package com.stapubox

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.util.Base64
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import java.nio.charset.StandardCharsets
import java.security.MessageDigest

class SmsRetrieverModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var smsBroadcastReceiver: BroadcastReceiver? = null
    private val SMS_CONSENT_REQUEST = 2

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "SmsRetrieverModule"

    @ReactMethod
    fun startListening(promise: Promise) {
        val client = SmsRetriever.getClient(reactContext)
        // null means we listen for an OTP from any sender.
        // User Consent API does not require the app hash.
        val task = client.startSmsUserConsent(null)

        task.addOnSuccessListener {
            registerReceiver()
            promise.resolve(true)
        }
        task.addOnFailureListener { e ->
            promise.reject("SMS_RETRIEVER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopListening() {
        unregisterReceiver()
    }

    private fun registerReceiver() {
        if (smsBroadcastReceiver != null) return

        smsBroadcastReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
                    val extras = intent.extras ?: return
                    val status = extras.get(SmsRetriever.EXTRA_STATUS) as? com.google.android.gms.common.api.Status ?: return

                    if (status.statusCode == CommonStatusCodes.SUCCESS) {
                        val consentIntent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                            extras.getParcelable(SmsRetriever.EXTRA_CONSENT_INTENT, Intent::class.java)
                        } else {
                            @Suppress("DEPRECATION")
                            extras.getParcelable<Intent>(SmsRetriever.EXTRA_CONSENT_INTENT)
                        }
                        
                        if (consentIntent != null) {
                            try {
                                reactContext.currentActivity?.startActivityForResult(consentIntent, SMS_CONSENT_REQUEST)
                            } catch (e: Exception) {
                                // Fallback or ignore
                            }
                        }
                    }
                }
            }
        }

        val intentFilter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            reactContext.registerReceiver(smsBroadcastReceiver, intentFilter, Context.RECEIVER_EXPORTED)
        } else {
            reactContext.registerReceiver(smsBroadcastReceiver, intentFilter)
        }
    }

    private fun unregisterReceiver() {
        smsBroadcastReceiver?.let {
            try {
                reactContext.unregisterReceiver(it)
            } catch (_: Exception) {}
            smsBroadcastReceiver = null
        }
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == SMS_CONSENT_REQUEST) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                val message = data.getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE)
                if (message != null) {
                    sendEvent(message)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {}

    private fun sendEvent(message: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onSmsReceived", message)
    }

    override fun invalidate() {
        unregisterReceiver()
        reactContext.removeActivityEventListener(this)
        super.invalidate()
    }

    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}

    @ReactMethod
    fun getAppHash(promise: Promise) {
        try {
            val packageName = reactContext.packageName
            val packageManager = reactContext.packageManager
            val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                val signingInfo = packageManager.getPackageInfo(
                    packageName,
                    PackageManager.GET_SIGNING_CERTIFICATES
                ).signingInfo
                signingInfo?.apkContentsSigners
            } else {
                @Suppress("DEPRECATION")
                packageManager.getPackageInfo(packageName, PackageManager.GET_SIGNATURES).signatures
            }

            if (signatures == null || signatures.isEmpty()) {
                promise.reject("HASH_ERROR", "No signatures found")
                return
            }

            val appInfo = "$packageName ${signatures[0].toByteArray().toHexString()}"
            val md = MessageDigest.getInstance("SHA-256")
            md.update(appInfo.toByteArray(StandardCharsets.UTF_8))
            val digest = md.digest()
            val base64Hash = Base64.encodeToString(digest, Base64.NO_PADDING or Base64.NO_WRAP)
            promise.resolve(base64Hash.substring(0, 11))
        } catch (e: Exception) {
            promise.reject("HASH_ERROR", e.message, e)
        }
    }

    private fun ByteArray.toHexString() = joinToString("") { "%02x".format(it) }
}
