# Code Signing & Provisioning

## Why This Matters

Code signing is the single most confusing part of mobile deployment. It is also the part you cannot skip. Every binary that runs on a physical device must be signed. Every binary submitted to a store must be signed with the correct certificate. Getting this wrong means your CI builds silently fail, your testers cannot install builds, or your store submission is rejected. This guide makes signing predictable.

---

## iOS Code Signing

### The Three Pieces

iOS code signing requires three things to work together:

1. **Certificate** -- proves your identity as a developer
2. **App ID** -- identifies your specific app
3. **Provisioning Profile** -- links a certificate to an app ID to a set of devices

If any one of these is wrong, missing, or expired, the build fails.

### Certificates

| Certificate Type | Purpose | Who Uses It |
|-----------------|---------|-------------|
| **iOS Development** | Run app on registered test devices from Xcode | Individual developers during development |
| **iOS Distribution (App Store)** | Submit to App Store or TestFlight | CI/CD pipeline, release manager |
| **iOS Distribution (Ad Hoc)** | Install on specific registered devices (up to 100) | Beta testers not using TestFlight |
| **iOS Distribution (Enterprise)** | Install on any device within organization (no store) | Enterprise-only ($299/year program) |

**Key facts:**
- Each certificate is valid for **1 year** from creation
- You can have up to 3 distribution certificates per team
- When a certificate expires, all provisioning profiles using it become invalid
- Revoke a certificate only if it is compromised -- revoking invalidates all profiles using it

### Provisioning Profiles

| Profile Type | Certificate Required | Device Limit | Use Case |
|-------------|---------------------|--------------|----------|
| **Development** | Development cert | 100 registered devices | Xcode debugging on physical devices |
| **Ad Hoc** | Distribution cert | 100 registered devices | Manual beta distribution outside TestFlight |
| **App Store** | Distribution cert | No limit (App Store distributes) | App Store and TestFlight submission |

**How they link together:**
```
Certificate (your identity)
    +
App ID (com.company.app)
    +
Device UDIDs (for dev/ad hoc only)
    =
Provisioning Profile (the "permission slip" that lets the app run)
```

### App IDs

- **Explicit App ID:** `com.{{COMPANY_NAME}}.{{APP_SLUG}}` -- required for production apps, push notifications, associated domains, Sign in with Apple
- **Wildcard App ID:** `com.{{COMPANY_NAME}}.*` -- works for development only, cannot use push notifications or most capabilities

**Capabilities to enable on your App ID:**
- Push Notifications (if using any push service)
- Associated Domains (if using universal links / deep links)
- Sign in with Apple (if offering Apple sign-in)
- App Groups (if sharing data between app and widget/extension)
- In-App Purchase (if selling digital content)

### Xcode Managed Signing

**When it works:** Solo developer, single machine, no CI/CD. Xcode creates and manages certificates and profiles automatically.

**When it does not work:**
- CI/CD builds (no Xcode GUI to manage signing)
- Teams with multiple developers (certificate conflicts)
- When you need reproducible, deterministic builds

**Recommendation:** Use managed signing for local development. Use manual signing (or Fastlane Match) for CI/CD.

### Manual Signing -- Step by Step

#### 1. Create a Certificate Signing Request (CSR)

```bash
# On macOS, open Keychain Access > Certificate Assistant > Request a Certificate From a Certificate Authority
# - Email: your Apple Developer email
# - Common Name: your name or team name
# - Save to disk
```

#### 2. Create the Certificate

1. Go to [developer.apple.com](https://developer.apple.com/) > Certificates, Identifiers & Profiles > Certificates
2. Click "+" to create a new certificate
3. Select type (iOS Distribution for App Store)
4. Upload the CSR file
5. Download the `.cer` file
6. Double-click to install in Keychain Access

#### 3. Export as .p12 (for CI/CD)

```bash
# In Keychain Access:
# 1. Find the certificate under "My Certificates"
# 2. Right-click > Export
# 3. Choose .p12 format
# 4. Set a strong password
# 5. Store the .p12 and password in your CI secrets manager
```

#### 4. Create the Provisioning Profile

1. Go to Certificates, Identifiers & Profiles > Profiles
2. Click "+" to create a new profile
3. Select type (App Store Distribution)
4. Select the App ID
5. Select the certificate
6. Name the profile: `{{APP_SLUG}}_AppStore_Distribution`
7. Download and add to Xcode (double-click the `.mobileprovision` file)

### Certificate Renewal

Certificates expire after 1 year. Plan for renewal:

1. Create the new certificate **before** the old one expires (you can have both active)
2. Create new provisioning profiles linked to the new certificate
3. Update CI/CD secrets with the new `.p12` file and password
4. Verify a CI build succeeds with the new credentials
5. Revoke the old certificate only after confirming everything works

---

## Android Code Signing

### Keystore Generation

```bash
# Generate a release keystore
keytool -genkey -v \
  -keystore {{APP_SLUG}}-release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias {{APP_SLUG}}-key-alias

# You will be prompted for:
# - Keystore password (store securely -- you need this forever)
# - Key alias password (can be same as keystore password)
# - Name, organization, location (used in the certificate)
```

**Critical:** If you lose the keystore or forget the password, you can never update the app on Google Play. You would have to publish as a new app with a new package name.

### Signing Config in build.gradle

```groovy
// android/app/build.gradle

android {
    signingConfigs {
        release {
            storeFile file('{{APP_SLUG}}-release-key.jks')
            storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD') ?: ''
            keyAlias '{{APP_SLUG}}-key-alias'
            keyPassword System.getenv('ANDROID_KEY_PASSWORD') ?: ''
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Play App Signing (Recommended)

Google Play App Signing adds a layer of protection:

```
You hold: Upload Key (your keystore)
    |
    v (upload AAB signed with upload key)
Google holds: App Signing Key (Google-managed)
    |
    v (Google re-signs the app with the app signing key)
Users get: App signed by Google's app signing key
```

**Benefits:**
- If you lose your upload key, Google can reset it (you cannot lose access to your app)
- Google optimizes delivery per device (Dynamic Delivery with AAB)
- Key rotation is possible without publishing a new app

**Setup:**
1. Go to Google Play Console > Your App > Setup > App signing
2. Choose "Use Google-generated key" (recommended for new apps)
3. Or upload your existing key if migrating

### Key Management

| Credential | Where to Store | Never Do |
|-----------|---------------|----------|
| iOS .p12 certificate | CI secrets manager (EAS Secrets, GitHub Secrets) | Commit to git, share via Slack/email |
| iOS provisioning profile | CI secrets manager or Fastlane Match repo | Leave on a shared drive |
| Android keystore (.jks) | CI secrets manager, secure backup | Commit to git, store only on one machine |
| Keystore password | CI secrets manager, password manager | Hardcode in build.gradle |
| Key alias password | CI secrets manager, password manager | Hardcode in build.gradle |

---

## Secure Credential Storage

### EAS Secrets (Expo)

```bash
# Store iOS credentials
eas credentials

# EAS manages certificates and profiles for you:
# - Creates or imports certificates
# - Creates provisioning profiles
# - Stores everything encrypted in EAS servers
# - Injects credentials during cloud builds

# Store custom secrets
eas secret:create --scope project --name ANDROID_KEYSTORE_PASSWORD --value "your-password"
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value "your-token"
```

### Fastlane Match (Team Certificate Management)

```ruby
# Matchfile
git_url("https://github.com/{{ORG}}/certificates")
storage_mode("git")
type("appstore")
app_identifier("com.{{COMPANY_NAME}}.{{APP_SLUG}}")
username("{{APPLE_ID_EMAIL}}")

# Usage:
# fastlane match appstore    -- creates or downloads App Store cert + profile
# fastlane match development -- creates or downloads Development cert + profile
# fastlane match adhoc       -- creates or downloads Ad Hoc cert + profile
```

**How Match works:**
1. Certificates and profiles are stored in an encrypted private git repo
2. All team members pull from the same repo -- no certificate conflicts
3. Match creates certificates/profiles if they do not exist, downloads if they do
4. The git repo is encrypted with a passphrase shared across the team

### GitHub Secrets

```yaml
# In your GitHub repository settings > Secrets and variables > Actions:

# iOS
IOS_P12_BASE64        # base64-encoded .p12 certificate file
IOS_P12_PASSWORD       # password for the .p12 file
IOS_PROVISIONING_PROFILE_BASE64  # base64-encoded .mobileprovision file
APPLE_ID               # Apple ID for notarization / upload
APP_SPECIFIC_PASSWORD  # App-specific password for Apple ID

# Android
ANDROID_KEYSTORE_BASE64  # base64-encoded .jks keystore file
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD

# Encode files to base64:
# base64 -i certificate.p12 | pbcopy
# base64 -i keystore.jks | pbcopy
```

### .gitignore Rules

```gitignore
# iOS signing -- NEVER commit these
*.p12
*.cer
*.mobileprovision
*.provisionprofile

# Android signing -- NEVER commit these
*.jks
*.keystore
keystore.properties

# Fastlane sensitive files
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output
```

---

## First-Time Setup Walkthrough

### iOS (From Zero to Signed Build)

1. Enroll in Apple Developer Program ($99/year)
2. Create an explicit App ID in the Developer Portal with needed capabilities
3. Choose your signing approach:
   - **Solo dev:** Use Xcode managed signing for local, manual for CI
   - **Team:** Use Fastlane Match for all signing
4. For CI: Export .p12 certificate, store in CI secrets
5. Create App Store provisioning profile, store in CI secrets
6. Configure your build tool (EAS, Fastlane, or Xcode CLI) to use the credentials
7. Run a test build to verify signing works

### Android (From Zero to Signed Build)

1. Generate a release keystore with `keytool`
2. **Immediately back up the keystore and passwords** to a password manager
3. Configure `build.gradle` signing config to read passwords from environment variables
4. Enroll in Play App Signing when creating your app in Google Play Console
5. Store the keystore (base64-encoded) and passwords in CI secrets
6. Run a test build to verify the APK/AAB is signed correctly:
   ```bash
   # Verify APK signature
   apksigner verify --print-certs app-release.apk

   # Verify AAB signature
   jarsigner -verify -verbose -certs app-release.aab
   ```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "No signing certificate found" | Certificate not in Keychain or expired | Re-download from Developer Portal, double-click to install |
| "Provisioning profile doesn't include signing certificate" | Profile was created with a different certificate | Regenerate the profile with the correct certificate |
| "A valid provisioning profile for this executable was not found" | Wrong profile type (e.g., Development profile for App Store build) | Use the correct profile type for your build configuration |
| "The certificate used to sign has been revoked" | Someone revoked the certificate | Create a new certificate and regenerate all profiles |
| "INSTALL_PARSE_FAILED_NO_CERTIFICATES" (Android) | APK is not signed or signature is invalid | Check that signing config in build.gradle is correct and keystore exists |
| "Failed to finalize session" (Android) | Version code not incremented or signing key mismatch | Increment versionCode, verify you are using the correct upload key |
| "Keystore was tampered with, or password was incorrect" | Wrong password or corrupted keystore | Verify the password, restore keystore from backup |
