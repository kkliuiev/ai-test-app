# Crypto AML Checker

Mobile app for AML (Anti-Money Laundering) analysis of cryptocurrency addresses. Built with **React Native + Expo**.

Uses the [GoPlus Security Labs](https://gopluslabs.io) free API to check wallet and contract addresses for sanctions, money laundering, phishing, mixers, darkweb activity, and 17 other risk indicators across 6 EVM-compatible chains.

---

## Screens

| Checker | Result | History |
|---------|--------|---------|
| Address input + chain selector | Animated score gauge + risk factors | Persistent check history |

---

## Tech Stack

- **Expo SDK 51** + Expo Router (file-based navigation)
- **React Native 0.74**
- **TypeScript**
- **AsyncStorage** — local history persistence
- **GoPlus Security API** — free, no API key required

---

## Quick Start (Development)

```bash
npm install
npm start          # opens Expo dev server
```

Scan the QR code in the **Expo Go** app (iOS / Android) to run immediately on your device.

---

## iOS Build

### Prerequisites

- macOS machine with **Xcode 15+** installed
- Apple Developer account (free for simulator; paid $99/yr for device/App Store)
- CocoaPods: `sudo gem install cocoapods`

### Option A — EAS Build (recommended, no Mac needed)

[Expo Application Services](https://expo.dev/eas) builds in the cloud.

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Log in to your Expo account
eas login

# 3. Configure the project (first time only)
eas build:configure

# 4. Development build (install on device via TestFlight)
eas build --platform ios --profile development

# 5. Production build (App Store .ipa)
eas build --platform ios --profile production
```

Add `eas.json` to the project root:

```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### Option B — Local Xcode Build

```bash
# 1. Generate native iOS project
npx expo prebuild --platform ios

# 2. Install CocoaPods dependencies
cd ios && pod install && cd ..

# 3. Open in Xcode
open ios/CryptoAMLChecker.xcworkspace

# 4. Select target device / simulator → Product → Run (⌘R)
```

For **App Store submission**, set your Team ID in Xcode → Signing & Capabilities, then:
```
Product → Archive → Distribute App → App Store Connect
```

---

## Android Build

### Prerequisites

- **Android Studio** with Android SDK (API level 33+)
- Java 17: `brew install openjdk@17` (macOS) or via Android Studio
- `ANDROID_HOME` environment variable set

### Option A — EAS Build (recommended)

```bash
# Development APK (install directly on device)
eas build --platform android --profile development

# Production AAB (Google Play)
eas build --platform android --profile production
```

Add Android profiles to `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### Option B — Local Gradle Build

```bash
# 1. Generate native Android project
npx expo prebuild --platform android

# 2. Debug APK (install on device/emulator)
cd android && ./gradlew assembleDebug

# Output: android/app/build/outputs/apk/debug/app-debug.apk

# 3. Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 4. Release AAB (Google Play)
cd android && ./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### Signing the release build

```bash
# Generate keystore (one time)
keytool -genkey -v -keystore release.keystore \
  -alias crypto-aml -keyalg RSA -keysize 2048 -validity 10000

# Add to android/gradle.properties
MYAPP_UPLOAD_STORE_FILE=release.keystore
MYAPP_UPLOAD_KEY_ALIAS=crypto-aml
MYAPP_UPLOAD_STORE_PASSWORD=your_password
MYAPP_UPLOAD_KEY_PASSWORD=your_password
```

---

## PWA (Progressive Web App) — Mobile Browser

Expo Web builds a PWA that can be installed on the home screen of any mobile browser (iOS Safari, Android Chrome).

### Build

```bash
# Install web bundler dependency (if not already present)
npx expo install react-native-web react-dom @expo/metro-runtime

# Build static PWA
npx expo export --platform web

# Output: dist/
```

### Run locally

```bash
# Serve the built PWA
npx serve dist

# Or use any static file server
python3 -m http.server 8080 --directory dist
```

### Deploy

The `dist/` folder is a standard static site — deploy to any host:

```bash
# Vercel
npx vercel dist/

# Netlify
npx netlify deploy --prod --dir dist

# GitHub Pages
npx gh-pages -d dist
```

### Install on mobile device

**iOS (Safari):**
1. Open the deployed URL in Safari
2. Tap **Share** → **Add to Home Screen**
3. The app launches fullscreen like a native app

**Android (Chrome):**
1. Open the deployed URL in Chrome
2. Tap the **⋮ menu** → **Add to Home screen** (or banner appears automatically)

### PWA Manifest

Add `web.output = "static"` is already set in `app.json`. To customize the PWA manifest, edit `app.json`:

```json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png",
      "name": "Crypto AML Checker",
      "shortName": "AML Checker",
      "description": "AML risk analysis for crypto addresses",
      "themeColor": "#0f0f1a",
      "backgroundColor": "#0f0f1a"
    }
  }
}
```

---

## Environment Summary

| Platform | Build output | Tool |
|----------|-------------|------|
| iOS simulator | `.app` | `eas build --profile preview` |
| iOS device / TestFlight | `.ipa` | `eas build --profile development` |
| iOS App Store | `.ipa` | `eas build --profile production` |
| Android device | `.apk` | `eas build --profile development` |
| Google Play | `.aab` | `eas build --profile production` |
| PWA mobile | `dist/` static | `expo export --platform web` |

---

## Supported Chains

| Chain | Chain ID |
|-------|----------|
| Ethereum | 1 |
| BNB Chain | 56 |
| Polygon | 137 |
| Arbitrum | 42161 |
| Avalanche | 43114 |
| Optimism | 10 |

---

## Disclaimer

This application is for informational purposes only. Risk scores are based on third-party data (GoPlus Security Labs) and may not reflect the current state of an address. This tool does not constitute financial, legal, or compliance advice.
