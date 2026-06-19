# StapuBox OTP Authentication

A production-ready OTP authentication flow built with React Native CLI and TypeScript.

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey)
![React Native](https://img.shields.io/badge/React%20Native-0.86-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Quick Links

- **[📺 Watch Demo Video](https://drive.google.com/file/d/15ImHWOdL03VckOqHv30EVzNTjDZE5Db3/view?usp=drivesdk)**
- **[📦 Download Android APK](https://drive.google.com/file/d/1qCPtJEwrh1Okb0KcPc8BdNXnEKujvFlI/view?usp=sharing)**

---

## Features

- 📱 Mobile number entry with country code picker (+91)
- 🔢 4-digit OTP input with auto-focus, backspace navigation & paste support
- 📩 **SMS Auto-Read** via native SMS User Consent API (Android) - No App Hash required!
- ⌨️ Smooth keyboard handling & edge-to-edge layout via `react-native-keyboard-controller`
- ⏱️ 60-second resend countdown timer with reset
- ✅ Success screen with spring animation
- 🛡️ Zod + React Hook Form validation
- 🌐 Offline detection banner via `@react-native-community/netinfo`
- 🎨 Pixel-perfect dark theme (Figma: `#2D2E2F` + `#2398FE`)
- ⚡ Shake animation on invalid OTP
- ♿ Full accessibility support (roles, labels, states)

---
## Tech Stack

| Category | Library |
|---|---|
| Framework | React Native CLI 0.86 |
| Language | TypeScript 5.8 |
| Navigation | React Navigation v7 |
| State | Zustand |
| API | Axios |
| Validation | React Hook Form + Zod |
| Animations | React Native Reanimated v3 |
| Keyboard | react-native-keyboard-controller |
| Offline | @react-native-community/netinfo |

---

## Project Structure

```
src/
├── api/              # Axios instance + raw API calls
├── services/         # Business logic + error mapping
├── store/            # Zustand global state
├── hooks/            # Custom hooks (useSendOtp, useOtpTimer, useSmsRetriever, etc.)
├── screens/          # LoginScreen, VerifyOtpScreen, SuccessScreen
├── components/       # Reusable UI (AppButton, OTPInput, NetworkBanner, etc.)
├── navigation/       # AppNavigator + typed routes
├── constants/        # Colors, typography, spacing, strings
├── utils/            # Validators, SMS parser
└── types/            # TypeScript type definitions

android/
└── app/src/main/java/com/stapubox/
    └── SmsRetrieverModule.kt   # Custom Native Module for SMS User Consent
```

---

## Setup Guide

### Prerequisites

- Node.js >= 22.11.0
- React Native CLI environment ([official setup](https://reactnative.dev/docs/set-up-your-environment))
- Android Studio with SDK (for Android)
- Xcode (for iOS)

### 1. Clone & Install

```bash
git clone <repository-url>
cd StapuBox
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
BASE_URL=https://stapubox.com/trial
API_TOKEN=your_api_token_here
```

### 3. Android Setup

```bash
# Start Metro bundler
npm start

# Run on Android (in a new terminal)
npm run android
```

### 4. iOS Setup

```bash
cd ios && pod install && cd ..
npm run ios
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `BASE_URL` | API base URL (e.g. `https://stapubox.com/trial`) | ✅ |
| `API_TOKEN` | Bearer token for API authorization | ✅ |

> **Security**: `.env` is gitignored. Never commit your API token.

---

## API Endpoints

| Action | Method | Endpoint |
|---|---|---|
| Send OTP | POST | `{BASE_URL}/sendOtp` |
| Verify OTP | POST | `{BASE_URL}/verifyOtp?mobile={mobile}&otp={otp}` |
| Resend OTP | POST | `{BASE_URL}/resendOtp` |

All requests include `Authorization: Bearer {API_TOKEN}` header.

---

## Architecture & Design Decisions

### 1. Custom Native SMS Module (User Consent API)
Instead of relying on outdated third-party packages, we implemented a custom Android Native Module (`SmsRetrieverModule.kt`). It uses Google's **SMS User Consent API** which does NOT require the server to append a complicated 11-character app hash to the SMS, making it far more robust.

### 2. Edge-to-Edge Keyboard Handling
We use `react-native-keyboard-controller` for seamless, native 120Hz keyboard animations. We configured the App root to use `statusBarTranslucent={true}` to prevent Android window background clashes, while manually painting the Status Bar within our `ScreenContainer`.

### 3. Offline Resilience
Integrated `@react-native-community/netinfo` to globally listen for network drops. The `NetworkBanner` component mounts at the root level and gracefully slides in if the user loses connectivity during the flow.

### 4. Service Layer Pattern
API calls go through `auth.service.ts` which maps errors to user-friendly messages. Screens never contain raw API logic, keeping them strictly focused on UI composition.

### 5. Minimal Global State (Zustand)
Only the mobile number and authentication status are stored globally (needed across Login → VerifyOtp → Success). Loading and error states remain purely local to each screen.

---

## SMS Auto-Read Flow (Android)

```
User taps Send OTP
        ↓
OTP Screen mounts → starts useSmsRetriever hook
        ↓
Native Module calls startSmsUserConsent()
        ↓
Server sends OTP via SMS
        ↓
Android OS intercepts the SMS (if it contains OTP-like text)
        ↓
Bottom sheet prompts User: "Allow StapuBox to read this message?"
        ↓
User taps "Allow"
        ↓
extractOtpFromSms() parses 4-digit code using Regex
        ↓
OTP boxes auto-filled + auto-submitted to server
```

---

## Known Issues & Limitations

1. **iOS SMS Auto-Fill**: The custom SMS module is Android-only. On iOS, users can rely on Apple's built-in keyboard OTP suggestion feature (which works automatically if the SMS contains "code" or "OTP").
2. **Reanimated vs ScrollView on Android**: There is a known issue where `react-native-reanimated` entrance animations (`FadeInUp`) can get stuck at `opacity: 0` inside ScrollViews on physical Android devices. We removed layout animations on `LoginScreen` to guarantee 100% visibility.
3. **API Response Shape**: The service layer handles both `{ success, data }` and raw response shapes. If the backend significantly changes its JSON schema, update `auth.service.ts` to map it properly.

---

## Demo Flow

1. Launch app → Login screen
2. Disconnect internet → Red Offline Banner slides in
3. Reconnect internet → Banner slides out
4. Enter 10-digit mobile number
5. Tap "Send OTP" → loading state → navigate to OTP screen
6. OTP received → Android bottom sheet asks for permission → User accepts → Auto-filled
7. 4th digit entered → auto-submit → loading
8. Wrong OTP → red boxes + shake animation + error message
9. "Resend OTP" disabled for 60s, then enabled
10. Correct OTP → Success screen with animation

---
