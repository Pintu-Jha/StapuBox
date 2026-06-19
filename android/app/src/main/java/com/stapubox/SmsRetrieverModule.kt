package com.stapubox

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
    ReactContextBaseJavaModule(reactContext) {

    private var smsBroadcastReceiver: BroadcastReceiver? = null

    override fun getName(): String = "SmsRetrieverModule"

    @ReactMethod
    fun startListening(promise: Promise) {
        val client = SmsRetriever.getClient(reactContext)
        val task = client.startSmsRetriever()

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
        smsBroadcastReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
                    val extras = intent.extras ?: return
                    val status = extras.get(SmsRetriever.EXTRA_STATUS) as? com.google.android.gms.common.api.Status ?: return

                    if (status.statusCode == CommonStatusCodes.SUCCESS) {
                        val message = extras.getString(SmsRetriever.EXTRA_SMS_MESSAGE) ?: return
                        sendEvent(message)
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

    private fun sendEvent(message: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onSmsReceived", message)
    }

    override fun invalidate() {
        unregisterReceiver()
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
