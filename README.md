# StapuBox OTP Authentication

A production-ready OTP authentication flow built with React Native CLI and TypeScript.

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey)
![React Native](https://img.shields.io/badge/React%20Native-0.86-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- 📱 Mobile number entry with country code picker (+91)
- 🔢 4-digit OTP input with auto-focus, backspace navigation & paste support
- 📩 SMS Auto-Read via `react-native-sms-retriever` (Android only)
- ⏱️ 60-second resend countdown timer with reset
- ✅ Success screen with spring animation
- 🛡️ Zod + React Hook Form validation
- 🌐 Offline detection via `@react-native-community/netinfo`
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
| SMS Auto-Read | react-native-sms-retriever |
| Offline | @react-native-community/netinfo |

---

## Project Structure

```
src/
├── api/              # Axios instance + raw API calls
├── services/         # Business logic + error mapping
├── store/            # Zustand global state
├── hooks/            # Custom hooks (useSendOtp, useOtpTimer, etc.)
├── screens/          # LoginScreen, VerifyOtpScreen, SuccessScreen
├── components/       # Reusable UI (AppButton, OTPInput, etc.)
├── navigation/       # AuthNavigator + typed routes
├── constants/        # Colors, typography, spacing, strings
├── utils/            # Validators, SMS parser
└── types/            # TypeScript type definitions
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

## Architecture Decisions

### Feature-Based Folder Structure
Each feature owns its screen, styles, and component files. Scales cleanly as the app grows.

### Service Layer Pattern
API calls go through `auth.service.ts` which maps errors to user-friendly messages. Screens never contain API logic.

### Minimal Global State (Zustand)
Only the mobile number is stored globally (needed across Login → VerifyOtp → Success). Loading and error states remain local to each screen.

### Separation of Concerns
- `api/` — HTTP only
- `services/` — Business logic + error mapping
- `hooks/` — UI state management
- `screens/` — Composition only

### SMS Retriever Abstraction
`useSmsRetriever` hook abstracts the Android SMS Retriever API. Gracefully degrades on iOS (no-op). Users can always enter OTP manually.

### React.memo + useCallback
All reusable components are wrapped in `React.memo`. Handlers use `useCallback` to prevent unnecessary re-renders.

---

## Running Tests

```bash
npm test

# With coverage
npm test -- --coverage
```

### Test Coverage

| File | Tests |
|---|---|
| `validators.ts` | Mobile validation, OTP validation, numeric filter, Zod schema |
| `smsParser.ts` | OTP extraction from various SMS formats |
| `useOtpTimer.ts` | Countdown, finish callback, reset |

---

## Generating Release APK

```bash
cd android
./gradlew assembleRelease
```

APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

> For a signed release, configure a keystore in `android/app/build.gradle`.

---

## SMS Auto-Read Flow (Android)

```
User taps Send OTP
        ↓
OTP Screen opens + SMS Retriever starts
        ↓
Server sends OTP via SMS
        ↓
react-native-sms-retriever receives message
        ↓
extractOtpFromSms() parses 4-digit code
        ↓
OTP boxes auto-filled + auto-submitted
```

> The SMS must contain the app's hash (generated from package name + signing key). This is handled automatically by the SMS Retriever API.

---

## Known Issues

1. **SMS Retriever hash**: The SMS must include the app's 11-character hash string (appended by server). If the server doesn't include this hash, auto-read won't work — the user falls back to manual entry cleanly.

2. **react-native-sms-retriever on RN 0.86**: Tested via dynamic import. If the native module fails to link, the hook falls back silently.

3. **iOS**: SMS auto-read is Android-only. iOS users enter OTP manually — fully supported.

4. **API response shape**: The service layer handles both `{ success, data }` and raw response shapes. If the API changes shape, update `auth.service.ts` only.

---

## Demo Flow

1. Launch app → Login screen
2. Enter 10-digit mobile number
3. Tap "Send OTP" → loading state → navigate to OTP screen
4. OTP auto-filled via SMS (Android) or enter manually
5. 4th digit entered → auto-submit → loading
6. Wrong OTP → red boxes + shake animation + error message
7. "Resend OTP" disabled for 60s, then enabled
8. Correct OTP → Success screen with animation
9. "Change Mobile Number" → navigate back to Login

---

## License

MIT
