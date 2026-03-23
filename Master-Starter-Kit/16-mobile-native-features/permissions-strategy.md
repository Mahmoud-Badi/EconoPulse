# Permissions Strategy

Mobile permissions are the single most common reason for App Store rejections and user frustration. Request too many permissions on first launch and users uninstall. Request the wrong permission at the wrong time and Apple rejects your app. Forget to add an Info.plist string and your app crashes. This guide defines the request-at-point-of-use pattern, platform-specific requirements, and handling for every permission state.

---

## The Cardinal Rule: Request at Point of Use

**Never request all permissions on first launch.** Request each permission the moment the user tries to use the related feature, and explain why before showing the system dialog.

```
WRONG:                              RIGHT:
┌──────────────────┐               ┌──────────────────┐
│ App First Launch │               │ User taps "Scan" │
│                  │               │                  │
│ ┌──────────────┐ │               │ ┌──────────────┐ │
│ │ Allow Camera?│ │               │ │ We need your │ │
│ │ Allow GPS?   │ │               │ │ camera to    │ │
│ │ Allow Notifs?│ │               │ │ scan the     │ │
│ │ Allow Contac?│ │               │ │ barcode.     │ │
│ └──────────────┘ │               │ │              │ │
│                  │               │ │ [Continue]   │ │
│ User: *uninstall*│               │ └──────────────┘ │
└──────────────────┘               │        │         │
                                   │        ▼         │
                                   │ ┌──────────────┐ │
                                   │ │ Allow Camera │ │
                                   │ │ Access?      │ │
                                   │ │ [Allow] [No] │ │
                                   │ └──────────────┘ │
                                   └──────────────────┘
```

---

## Permission Decision Flowchart

```
User triggers feature that requires permission
                │
                ▼
┌───────────────────────────┐
│ Check current status      │
│ (checkPermission())       │
└────────────┬──────────────┘
             │
    ┌────────┼────────┐────────────┐
    │        │        │            │
 GRANTED  UNDETERMINED DENIED    BLOCKED
    │        │        │         (permanent)
    │        ▼        ▼            │
    │  ┌──────────┐ ┌──────────┐  │
    │  │Show pre- │ │Show      │  │
    │  │permission│ │explanation│  │
    │  │dialog    │ │"We need  │  │
    │  │with value│ │this to..."│  │
    │  │propostion│ │          │  │
    │  └────┬─────┘ └────┬─────┘  │
    │       │             │        │
    │       ▼             ▼        ▼
    │  ┌──────────┐ ┌──────────┐ ┌──────────────┐
    │  │System    │ │Request   │ │Direct to     │
    │  │dialog    │ │again     │ │Settings app  │
    │  │(OS shows)│ │(1 retry) │ │with steps    │
    │  └────┬─────┘ └────┬─────┘ └──────────────┘
    │       │             │
    ▼       ▼             ▼
┌──────────────────────────────┐
│ Proceed with feature         │
│ OR                           │
│ Offer alternative (manual    │
│ entry, different workflow)   │
└──────────────────────────────┘
```

---

## iOS Permissions (Info.plist)

Every iOS permission requires a user-facing string in `Info.plist` explaining why the app needs it. Apple reviews these strings and will reject your app if they are vague ("This app needs access") or don't match actual usage.

### Required Permission Strings

| Permission | Info.plist Key | Template String |
|-----------|---------------|----------------|
| Camera | `NSCameraUsageDescription` | "{{PROJECT_NAME}} needs camera access to scan barcodes and take photos for your profile." |
| Photo Library | `NSPhotoLibraryUsageDescription` | "{{PROJECT_NAME}} needs access to your photo library to upload images to your profile." |
| Photo Library (Add Only) | `NSPhotoLibraryAddUsageDescription` | "{{PROJECT_NAME}} saves receipt photos to your photo library." |
| Location (Foreground) | `NSLocationWhenInUseUsageDescription` | "{{PROJECT_NAME}} uses your location to find nearby stores and show your position on the map." |
| Location (Background) | `NSLocationAlwaysAndWhenInUseUsageDescription` | "{{PROJECT_NAME}} uses your location in the background to track your delivery route." |
| Contacts | `NSContactsUsageDescription` | "{{PROJECT_NAME}} reads your contacts to help you invite friends to the app." |
| Face ID | `NSFaceIDUsageDescription` | "{{PROJECT_NAME}} uses Face ID to securely unlock your account." |
| Microphone | `NSMicrophoneUsageDescription` | "{{PROJECT_NAME}} needs microphone access to record voice messages." |
| Bluetooth | `NSBluetoothPeripheralUsageDescription` | "{{PROJECT_NAME}} uses Bluetooth to connect to your fitness tracker." |
| Bluetooth (Always) | `NSBluetoothAlwaysUsageDescription` | "{{PROJECT_NAME}} uses Bluetooth in the background to maintain connection with your device." |
| Calendar | `NSCalendarsUsageDescription` | "{{PROJECT_NAME}} adds your bookings to your calendar." |
| Motion | `NSMotionUsageDescription` | "{{PROJECT_NAME}} uses motion data to count your steps." |
| Tracking (ATT) | `NSUserTrackingUsageDescription` | "{{PROJECT_NAME}} uses this to provide personalized recommendations." |

### Info.plist Template

```xml
<!-- ios/[AppName]/Info.plist -->
<dict>
    <!-- Only include keys for permissions your app actually uses -->

    <key>NSCameraUsageDescription</key>
    <string>{{PROJECT_NAME}} needs camera access to scan barcodes and take photos for your profile.</string>

    <key>NSPhotoLibraryUsageDescription</key>
    <string>{{PROJECT_NAME}} needs access to your photo library to upload images to your profile.</string>

    <key>NSLocationWhenInUseUsageDescription</key>
    <string>{{PROJECT_NAME}} uses your location to find nearby stores and show your position on the map.</string>

    <!-- Only include if you actually need background location -->
    <!-- IF {{NEEDS_BACKGROUND_LOCATION}} == "yes" -->
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>{{PROJECT_NAME}} uses your location in the background to track your delivery route.</string>
    <!-- ENDIF -->

    <key>NSFaceIDUsageDescription</key>
    <string>{{PROJECT_NAME}} uses Face ID to securely unlock your account.</string>

    <key>NSContactsUsageDescription</key>
    <string>{{PROJECT_NAME}} reads your contacts to help you invite friends to the app.</string>

    <key>NSMicrophoneUsageDescription</key>
    <string>{{PROJECT_NAME}} needs microphone access to record voice messages.</string>
</dict>
```

### Writing Effective Permission Strings

**Apple will reject your app if:**
- The string is generic ("This app needs this permission")
- The string doesn't explain the specific feature that uses it
- You request a permission your app never actually uses
- The background location string doesn't explain why background access is needed

**Good strings follow this pattern:** `"[App Name] [action verb] [your data] to [user benefit]."`

| Bad | Good |
|-----|------|
| "Camera access needed" | "FoodSnap needs camera access to scan product barcodes and check nutritional information." |
| "Allow location access" | "RunTracker uses your location to map your running routes and calculate distance." |
| "This app needs your contacts" | "PartyPlanner reads your contacts to help you quickly invite friends to events." |

---

## Android Permissions (AndroidManifest.xml)

Android permissions fall into two categories: **normal** (granted automatically) and **dangerous** (require runtime prompt).

### Manifest Declarations

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Camera -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />

    <!-- Location -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <!-- Background location — only if needed, request separately from foreground -->
    <!-- IF {{NEEDS_BACKGROUND_LOCATION}} == "yes" -->
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    <!-- ENDIF -->

    <!-- Contacts -->
    <uses-permission android:name="android.permission.READ_CONTACTS" />

    <!-- Biometrics -->
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />

    <!-- Bluetooth (Android 12+) -->
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN"
        android:usesPermissionFlags="neverForLocation" />

    <!-- NFC -->
    <uses-permission android:name="android.permission.NFC" />

    <!-- Notifications (Android 13+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Microphone -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <!-- Storage (Android < 13 only) -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />

    <!-- Media (Android 13+) -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

</manifest>
```

### Android Permission Categories

| Permission | Manifest Declaration | Runtime Prompt? | API Level Notes |
|-----------|---------------------|----------------|-----------------|
| `CAMERA` | Yes | Yes | All versions |
| `ACCESS_FINE_LOCATION` | Yes | Yes | All versions |
| `ACCESS_COARSE_LOCATION` | Yes | Yes | All versions |
| `ACCESS_BACKGROUND_LOCATION` | Yes | Yes (separate) | Android 10+ (must request after foreground) |
| `READ_CONTACTS` | Yes | Yes | All versions |
| `USE_BIOMETRIC` | Yes | No (prompt IS the permission) | Android 9+ |
| `BLUETOOTH_CONNECT` | Yes | Yes | Android 12+ |
| `BLUETOOTH_SCAN` | Yes | Yes | Android 12+ |
| `NFC` | Yes | No | All versions |
| `POST_NOTIFICATIONS` | Yes | Yes | Android 13+ (auto-granted on older versions) |
| `RECORD_AUDIO` | Yes | Yes | All versions |
| `READ_EXTERNAL_STORAGE` | Yes | Yes | Android < 13 only |
| `READ_MEDIA_IMAGES` | Yes | Yes | Android 13+ |
| `INTERNET` | Yes | No (normal permission) | All versions |
| `VIBRATE` | Yes | No (normal permission) | All versions |

---

## Per-Framework Permission Libraries

### React Native (Expo Managed)

Expo handles permissions through each module's own API. No separate permissions library needed.

```typescript
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';

// Each module has its own permission methods
const cameraPermission = await Camera.requestCameraPermissionsAsync();
const locationPermission = await Location.requestForegroundPermissionsAsync();
const contactsPermission = await Contacts.requestPermissionsAsync();
const notifPermission = await Notifications.requestPermissionsAsync();
```

### React Native (Bare)

```typescript
// react-native-permissions — unified API for all permissions
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { Platform } from 'react-native';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
})!;

async function requestCameraPermission(): Promise<boolean> {
  const status = await check(CAMERA_PERMISSION);

  switch (status) {
    case RESULTS.GRANTED:
      return true;

    case RESULTS.DENIED:
      // Can request — show system dialog
      const result = await request(CAMERA_PERMISSION);
      return result === RESULTS.GRANTED;

    case RESULTS.BLOCKED:
      // Permanently denied — must go to Settings
      Alert.alert(
        'Camera Permission Required',
        'Camera access was permanently denied. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openSettings },
        ]
      );
      return false;

    case RESULTS.UNAVAILABLE:
      // Hardware not available on this device
      return false;

    default:
      return false;
  }
}
```

### Flutter

```dart
// permission_handler package
import 'package:permission_handler/permission_handler.dart';

class PermissionService {
  Future<bool> requestCamera() async {
    return _requestPermission(Permission.camera, 'Camera');
  }

  Future<bool> requestLocation() async {
    return _requestPermission(Permission.locationWhenInUse, 'Location');
  }

  Future<bool> requestContacts() async {
    return _requestPermission(Permission.contacts, 'Contacts');
  }

  Future<bool> requestNotifications() async {
    return _requestPermission(Permission.notification, 'Notifications');
  }

  Future<bool> _requestPermission(Permission permission, String name) async {
    final status = await permission.status;

    if (status.isGranted) return true;

    if (status.isDenied) {
      // Show pre-permission dialog first (your custom UI)
      final shouldRequest = await _showPrePermissionDialog(name);
      if (!shouldRequest) return false;

      final result = await permission.request();
      return result.isGranted;
    }

    if (status.isPermanentlyDenied) {
      // Direct to Settings
      final opened = await openAppSettings();
      return false; // User needs to grant in Settings and come back
    }

    return false;
  }

  Future<bool> _showPrePermissionDialog(String permissionName) async {
    // Show your custom dialog explaining why the permission is needed
    // Return true if user taps "Continue", false if "Not Now"
    // Implementation depends on your dialog/overlay system
    return true;
  }
}
```

### Native iOS

```swift
import AVFoundation
import CoreLocation
import Contacts
import LocalAuthentication

// Camera
AVCaptureDevice.requestAccess(for: .video) { granted in
    // granted: Bool
}

// Location
let locationManager = CLLocationManager()
locationManager.requestWhenInUseAuthorization()
// For background: locationManager.requestAlwaysAuthorization()

// Contacts
let store = CNContactStore()
store.requestAccess(for: .contacts) { granted, error in
    // granted: Bool
}

// Biometrics (no pre-request — the evaluate call IS the prompt)
let context = LAContext()
var error: NSError?
if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
    context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Unlock your account"
    ) { success, error in
        // success: Bool
    }
}
```

### Native Android

```kotlin
// Using ActivityResultContracts (modern approach)
class MainActivity : ComponentActivity() {

    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            openCamera()
        } else {
            showPermissionDeniedDialog()
        }
    }

    private val locationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val fineGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
        val coarseGranted = permissions[Manifest.permission.ACCESS_COARSE_LOCATION] ?: false
        when {
            fineGranted -> startPreciseLocationUpdates()
            coarseGranted -> startApproximateLocationUpdates()
            else -> showLocationDeniedDialog()
        }
    }

    fun requestCamera() {
        when {
            ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                == PackageManager.PERMISSION_GRANTED -> openCamera()

            shouldShowRequestPermissionRationale(Manifest.permission.CAMERA) ->
                showPrePermissionDialog { cameraPermissionLauncher.launch(Manifest.permission.CAMERA) }

            else -> cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }
}
```

---

## Handling Permanent Denial

When a user has permanently denied a permission (tapped "Don't Allow" on iOS, or "Deny" twice on Android), the system dialog will never appear again. You must direct the user to the Settings app.

```typescript
// React Native: Open Settings
import { Linking, Platform } from 'react-native';

function openAppSettings() {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
}

// Provide clear instructions
function showSettingsPrompt(permissionName: string) {
  Alert.alert(
    `${permissionName} Permission Required`,
    `To enable ${permissionName.toLowerCase()}, go to Settings > ${APP_NAME} > ${permissionName} and select "Allow".`,
    [
      { text: 'Not Now', style: 'cancel' },
      { text: 'Open Settings', onPress: openAppSettings },
    ]
  );
}
```

```dart
// Flutter: Open Settings
import 'package:permission_handler/permission_handler.dart';

Future<void> handlePermanentDenial(String permissionName) async {
  final shouldOpen = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text('$permissionName Required'),
      content: Text(
        'Please enable $permissionName in Settings > ${appName} > $permissionName.',
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Not Now')),
        TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Open Settings')),
      ],
    ),
  );

  if (shouldOpen == true) {
    await openAppSettings();
  }
}
```

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Requesting all permissions at launch | User uninstalls, low grant rates | Request at point of use only |
| Missing Info.plist string on iOS | App crashes when permission requested | Add every permission string before building |
| Vague permission strings | App Store rejection | Use pattern: "[App] [verb] [data] to [benefit]" |
| Not checking `shouldShowRequestPermissionRationale` on Android | Missing chance to explain before denial | Always check rationale state before requesting |
| Requesting background location with foreground on Android 10+ | Permission request silently fails | Request foreground first, then background separately |
| Not handling the "blocked" state | User permanently stuck without feature | Detect blocked state and offer Settings redirect |
| Declaring unused permissions in manifest | App Store/Play Store warnings, user distrust | Only declare permissions your app actually uses |
| Not using `android:required="false"` on `<uses-feature>` | App hidden from devices without that hardware | Add `required="false"` unless the feature is mandatory |
| Forgetting `POST_NOTIFICATIONS` on Android 13+ | Notifications silently fail | Add the permission and request it at runtime |
