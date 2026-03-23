# Beta Testing Distribution

## Why This Matters

Shipping directly to the app store without beta testing is like deploying to production without a staging environment. Beta testing catches device-specific bugs, UX confusion, and performance problems that no amount of simulator testing can find. It also builds confidence -- you know real users can install, open, and use your app before millions of people get access to it.

---

## TestFlight (iOS)

TestFlight is Apple's official beta distribution platform. It is free, built into App Store Connect, and the only way to distribute beta iOS builds to external testers without managing device UDIDs.

### Internal Testing

- **Testers:** Up to 100 members of your App Store Connect team
- **Review required:** No -- builds are available immediately after processing
- **Build limit:** Up to 100 builds per version
- **Use for:** Developer team testing, QA team, stakeholders with Apple Developer accounts

**Setup:**
1. Upload a build to App Store Connect (via Xcode, EAS Submit, or Transporter)
2. Wait for build processing (5-30 minutes)
3. Go to TestFlight > Internal Testing > select the build
4. Add internal testers by Apple ID (they must be App Store Connect users)
5. Testers receive a notification in the TestFlight app

### External Testing

- **Testers:** Up to 10,000 per app
- **Review required:** Yes -- Beta App Review (typically 1-2 days for first build, faster for subsequent)
- **Use for:** Public beta, large tester groups, users without developer accounts

**Setup:**
1. Upload a build to App Store Connect
2. Create a beta group (e.g., "Early Adopters," "Enterprise Clients")
3. Add testers by email address or share a public link
4. Submit for Beta App Review (provide test notes, contact info)
5. After approval, testers are notified in TestFlight

### Tester Groups

Organize testers by purpose:

| Group | Who | What They Test |
|-------|-----|----------------|
| Core Team | Developers, designers, PM | Every build -- functionality and regressions |
| QA | Dedicated testers | Feature-complete builds -- edge cases, device compatibility |
| Stakeholders | Executives, clients | Milestone builds -- UX flow, feature completeness |
| Beta Users | External users | Pre-release builds -- real-world usage, feedback |

### Feedback Collection

TestFlight provides built-in feedback mechanisms:
- **Screenshot annotations:** Testers can mark up screenshots with notes
- **Crash reports:** Automatic crash log collection
- **Tester feedback:** In-app feedback form with text and screenshots
- Access feedback in App Store Connect > TestFlight > Feedback

### Important Limits

- **Build expiry:** Builds expire 90 days after upload. Testers lose access.
- **Multiple builds:** Testers can install multiple builds simultaneously and switch between them
- **iOS version requirement:** TestFlight requires iOS 13+
- **App size:** Same limits as App Store (no additional restrictions)

---

## Google Play Internal Testing

Google Play Console offers three testing tracks, each with different visibility and review requirements.

### Internal Testing Track

- **Testers:** Up to 100 (by email address or Google Group)
- **Review required:** No -- available within minutes of upload
- **Use for:** Team testing, rapid iteration, daily builds

**Setup:**
1. Go to Google Play Console > Testing > Internal testing
2. Create a testers list (email addresses or Google Groups)
3. Upload an AAB (Android App Bundle)
4. Share the opt-in URL with testers
5. Testers install from the Play Store (may take a few minutes to appear)

### Closed Testing Track

- **Testers:** Unlimited, but must opt in
- **Review required:** Yes -- Google reviews the build (1-3 days)
- **Use for:** Larger beta groups, external testers, pre-launch validation

**Setup:**
1. Go to Testing > Closed testing > Create track
2. Name the track (e.g., "Beta," "Partner Preview")
3. Add tester email lists or Google Groups
4. Upload an AAB and submit for review
5. After approval, share the opt-in link

### Open Testing Track

- **Testers:** Anyone with the link
- **Review required:** Yes
- **Use for:** Public beta, gathering feedback at scale, App Store presence as "Early Access"

### Staged Rollout

Google Play supports percentage-based rollout for production releases:

| Stage | Percentage | Duration | Purpose |
|-------|-----------|----------|---------|
| 1 | 1% | 1-2 days | Catch critical crashes with minimal exposure |
| 2 | 5% | 1-2 days | Validate fix for stage 1 issues |
| 3 | 10% | 2-3 days | Broader device coverage |
| 4 | 20% | 2-3 days | Validate at scale |
| 5 | 50% | 2-3 days | Near-full rollout |
| 6 | 100% | -- | Full rollout |

**Monitoring during rollout:**
- Watch crash rate in Android Vitals (target: <1%)
- Watch ANR rate (target: <0.5%)
- Watch uninstall rate (compare to baseline)
- **Halt rollout** if any metric exceeds threshold

### Pre-Launch Reports

When you upload to any testing track, Google automatically runs your app on Firebase Test Lab devices:
- **Automated crawl:** Google's crawler navigates your app and reports crashes
- **Performance:** Startup time, rendering performance
- **Accessibility:** Content labeling, touch target sizes
- **Security:** Known vulnerability scanning

View pre-launch reports in Google Play Console > Testing > Pre-launch report.

---

## Firebase App Distribution

Firebase App Distribution works for both iOS and Android. It is platform-independent and integrates with CI/CD pipelines.

### When to Use Instead of TestFlight / Play Console

- You want **one tool for both platforms**
- You need to distribute **outside of the app stores** (no review process)
- You want **faster iteration** (no processing delays)
- You are distributing to a **small internal team** and do not need store presence

### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools
firebase login

# Distribute an iOS build
firebase appdistribution:distribute path/to/app.ipa \
  --app {{FIREBASE_APP_ID_IOS}} \
  --groups "qa-team,stakeholders" \
  --release-notes "Bug fixes for login flow"

# Distribute an Android build
firebase appdistribution:distribute path/to/app.apk \
  --app {{FIREBASE_APP_ID_ANDROID}} \
  --groups "qa-team,stakeholders" \
  --release-notes "Bug fixes for login flow"
```

### Tester Management

```bash
# Add testers
firebase appdistribution:testers:add --emails user1@example.com,user2@example.com

# Create a group
firebase appdistribution:group:create qa-team

# Add testers to a group
firebase appdistribution:testers:add --group qa-team --emails user1@example.com
```

### In-App Update Alerts

Firebase App Distribution includes an optional SDK that shows testers an in-app alert when a new build is available:

```typescript
// React Native (using @react-native-firebase/app-distribution)
import appDistribution from '@react-native-firebase/app-distribution';

// Check for new builds on app launch
const update = await appDistribution().checkForUpdate();
if (update.isAvailable) {
  // Show update prompt to tester
  await appDistribution().signInTester();
}
```

### Fastlane Integration

```ruby
# Fastfile
lane :distribute do
  firebase_app_distribution(
    app: "{{FIREBASE_APP_ID}}",
    groups: "qa-team, stakeholders",
    release_notes: "#{last_git_commit[:message]}",
    firebase_cli_token: ENV['FIREBASE_TOKEN']
  )
end
```

---

## Expo Internal Distribution

For Expo and React Native projects using EAS Build.

### Development Builds

```bash
# Build a development client (includes dev tools, hot reload)
eas build --profile development --platform ios
eas build --profile development --platform android
```

Development builds are installable apps with the Expo development tools built in. They connect to your local dev server for hot reload.

### Internal Distribution (Preview Builds)

```bash
# Build for internal distribution (no dev tools, production-like)
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Or both platforms at once
eas build --profile preview --platform all
```

### Installation

After a build completes:
1. EAS provides a **QR code** and a **direct download link**
2. iOS testers: scan the QR code on their device to install (requires registered UDID)
3. Android testers: scan the QR code or open the link to download the APK

### iOS Device Registration (UDID Management)

iOS internal distribution requires registering device UDIDs in the Apple Developer Portal. EAS simplifies this:

```bash
# Register a new device
eas device:create

# This generates a URL that testers open on their device.
# The URL installs a temporary profile that reports the device UDID.
# EAS then registers the UDID in the Apple Developer Portal.
# A new build is required after adding devices (the provisioning profile must be regenerated).
```

**Limits:**
- Apple allows 100 devices per device type per year (iPhone, iPad counted separately)
- Devices can only be removed during the annual account renewal
- For more than 100 testers, use TestFlight (external testing track) instead

### EAS Update (OTA -- No New Build Required)

```bash
# Push a JavaScript-only update to preview testers
eas update --channel preview --message "Fix: profile image upload crash"

# Push to production
eas update --channel production --message "Fix: incorrect currency display"
```

OTA updates deploy in minutes. No app store review. No new build. But they cannot change native code.

---

## Comparison Table

| Feature | TestFlight | Play Internal | Firebase App Dist | Expo Internal |
|---------|-----------|---------------|-------------------|---------------|
| **Platforms** | iOS only | Android only | iOS + Android | iOS + Android |
| **Max testers** | 10,000 (external) | 100 (internal track) | Unlimited | 100 iOS devices (Apple limit) |
| **Review required** | Yes (external) | No (internal) | No | No |
| **Time to availability** | 5-30 min (internal), 1-2 days (external) | Minutes | Minutes | Minutes (after build) |
| **Install method** | TestFlight app | Play Store | Firebase tester app or direct link | QR code or direct link |
| **In-app feedback** | Yes (built-in) | No | No (separate SDK) | No |
| **Crash reports** | Yes | Yes (via Android Vitals) | Yes (via Firebase Crashlytics) | Yes (via Sentry or similar) |
| **Build expiry** | 90 days | No expiry | No expiry | No expiry |
| **OTA updates** | No | No | No | Yes (EAS Update) |
| **Cost** | Free | Free | Free (Spark plan) | Free tier: limited builds |
| **CI integration** | Fastlane, EAS Submit | Fastlane, Gradle | Firebase CLI, Fastlane | EAS CLI |

---

## Recommended Flow for Small Teams (< 10 people)

```
Developer pushes to main
    |
    v
CI builds preview/internal build
    |
    +--> iOS: Upload to TestFlight (internal testing group)
    |         - Immediate availability, no review
    |         - Team installs via TestFlight app
    |
    +--> Android: Upload to Play Console (internal testing track)
    |         - Immediate availability, no review
    |         - Team installs from Play Store
    |
    v
QA tests on both platforms
    |
    v (tests pass)
CI builds production build
    |
    +--> iOS: Submit to App Store Review
    +--> Android: Submit to internal/closed track, then staged rollout to production
```

**If using Expo:** Replace TestFlight + Play Console with EAS Build `preview` profile for daily testing, and use EAS Submit for store submission. Use EAS Update for JavaScript-only hotfixes between binary releases.
