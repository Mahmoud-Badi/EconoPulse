# Device APIs

Mobile apps have access to hardware and system APIs that web apps cannot touch: camera, GPS, biometrics, contacts, Bluetooth, NFC, and the file system. Each API requires platform-specific permissions, has different behavior on simulators vs real devices, and needs graceful degradation when unavailable. This guide covers the recommended library for each framework, required permissions, and common use cases.

---

## Camera

### Libraries

| Framework | Library | Best For |
|-----------|---------|----------|
| React Native (Expo) | `expo-camera` | Photo capture, barcode scanning (managed workflow) |
| React Native (Bare) | `react-native-vision-camera` | Advanced: frame processing, ML, custom overlays |
| Flutter | `camera` | Photo/video capture |
| Flutter | `mobile_scanner` | Barcode/QR scanning |
| Native iOS | AVFoundation | Full camera pipeline control |
| Native Android | CameraX | Recommended camera API (lifecycle-aware) |

### Use Cases

- **Photo capture:** Profile photos, document uploads, receipt scanning
- **Barcode / QR scanning:** Product lookup, ticket validation, check-in flows
- **Document scanning:** ID verification, invoice capture (use ML Kit or Vision for edge detection)
- **Video recording:** Testimonials, support tickets, social content

### Permissions Required

| Platform | Permission | When Required |
|----------|-----------|---------------|
| iOS | `NSCameraUsageDescription` | Always (Info.plist string required) |
| Android | `CAMERA` | Runtime permission (user prompt) |
| Android | `WRITE_EXTERNAL_STORAGE` | Only if saving to gallery (Android < 10) |

### React Native (Expo)

```typescript
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';

export function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera access is needed to take photos.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      // photo.uri contains the local file path
      await uploadPhoto(photo.uri);
    }
  };

  return (
    <CameraView
      ref={cameraRef}
      style={styles.camera}
      facing={facing}
      barcodeScannerSettings={{
        barcodeTypes: ['qr', 'ean13', 'code128'],
      }}
      onBarcodeScanned={(result) => {
        console.log('Scanned:', result.data);
      }}
    >
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Flip" onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')} />
    </CameraView>
  );
}
```

### React Native (Bare) — Vision Camera

```typescript
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

export function ScannerScreen() {
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log('Scanned:', codes[0].value);
    },
  });

  if (!device) return <Text>No camera device found</Text>;

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
}
```

### Flutter

```dart
import 'package:mobile_scanner/mobile_scanner.dart';

class ScannerScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: MobileScanner(
        onDetect: (capture) {
          final barcodes = capture.barcodes;
          for (final barcode in barcodes) {
            debugPrint('Scanned: ${barcode.rawValue}');
          }
        },
      ),
    );
  }
}
```

### Simulator vs Real Device

| Feature | iOS Simulator | Android Emulator | Real Device |
|---------|--------------|-----------------|-------------|
| Photo capture | Static image only | Emulated camera | Full support |
| Barcode scanning | Not supported | Limited | Full support |
| Video recording | Not supported | Limited | Full support |
| Front camera | Not supported | Emulated | Full support |

**Always test camera features on a real device before shipping.**

---

## GPS / Location

### Libraries

| Framework | Library | Best For |
|-----------|---------|----------|
| React Native (Expo) | `expo-location` | Foreground + background location, geocoding |
| React Native (Expo) | `react-native-maps` | Map rendering with markers and overlays |
| Flutter | `geolocator` | Location access, distance calculations |
| Flutter | `google_maps_flutter` | Google Maps widget |
| Native iOS | Core Location | All location services |
| Native Android | FusedLocationProviderClient | Google Play Services location |

### Use Cases

- **Real-time tracking:** Delivery apps, ride-sharing, fitness trackers
- **Geofencing:** Enter/exit region alerts, location-based reminders
- **Route navigation:** Turn-by-turn directions, distance estimation
- **Location-based search:** "Nearby restaurants", store locators

### Permissions Required

| Platform | Permission | Type | Use Case |
|----------|-----------|------|----------|
| iOS | `NSLocationWhenInUseUsageDescription` | Foreground only | Map display, nearby search |
| iOS | `NSLocationAlwaysAndWhenInUseUsageDescription` | Background | Delivery tracking, geofencing |
| Android | `ACCESS_FINE_LOCATION` | Runtime | Precise location (GPS) |
| Android | `ACCESS_COARSE_LOCATION` | Runtime | Approximate location (WiFi/cell) |
| Android | `ACCESS_BACKGROUND_LOCATION` | Runtime (separate request) | Background tracking (Android 10+) |

**Important:** On Android 10+, you must request foreground location first, then separately request background location. Requesting both at once will fail.

### React Native (Expo)

```typescript
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Request foreground permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      // Get current position
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    })();
  }, []);

  return { location, error };
}

// Background location tracking
async function startBackgroundTracking() {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') return;

  await Location.startLocationUpdatesAsync('BACKGROUND_LOCATION_TASK', {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 100, // meters
    deferredUpdatesInterval: 60000, // ms
    showsBackgroundLocationIndicator: true, // iOS blue bar
    foregroundService: {
      notificationTitle: 'Tracking your delivery',
      notificationBody: 'Location is used to show your position on the map',
    },
  });
}
```

### Flutter

```dart
import 'package:geolocator/geolocator.dart';

class LocationService {
  Future<Position?> getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return null; // Prompt user to enable location services
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return null;
    }

    if (permission == LocationPermission.deniedForever) {
      // Direct user to Settings
      await Geolocator.openAppSettings();
      return null;
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }

  // Real-time location stream
  Stream<Position> getLocationStream() {
    return Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // meters
      ),
    );
  }
}
```

### Simulator vs Real Device

| Feature | iOS Simulator | Android Emulator | Real Device |
|---------|--------------|-----------------|-------------|
| GPS coordinates | Simulated (set in Debug menu) | Simulated (set in Extended Controls) | Real GPS |
| Background location | Works (simulated) | Works (simulated) | Full support |
| Geofencing | Limited accuracy | Limited accuracy | Full support |
| Speed/heading | Can simulate routes | Can simulate routes | Real sensor data |

---

## Biometrics

### Libraries

| Framework | Library | Features |
|-----------|---------|----------|
| React Native (Expo) | `expo-local-authentication` | Face ID, Touch ID, Android biometrics |
| Flutter | `local_auth` | Face ID, Touch ID, fingerprint, face unlock |
| Native iOS | LocalAuthentication framework | Face ID, Touch ID |
| Native Android | BiometricPrompt | Fingerprint, face, iris |

### Use Cases

- **App unlock:** Protect app access after backgrounding
- **Transaction confirmation:** Authorize payments, transfers
- **Sensitive data access:** View passwords, export data

### Permissions Required

| Platform | Permission | Notes |
|----------|-----------|-------|
| iOS | `NSFaceIDUsageDescription` | Required for Face ID (Info.plist). Touch ID requires no additional permission. |
| Android | `USE_BIOMETRIC` | Manifest declaration. No runtime prompt needed (biometric prompt IS the permission). |

### React Native (Expo)

```typescript
import * as LocalAuthentication from 'expo-local-authentication';

async function authenticateWithBiometrics(): Promise<boolean> {
  // Check if hardware supports biometrics
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    // Fall back to PIN/password
    return false;
  }

  // Check if biometrics are enrolled
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    // User hasn't set up biometrics — prompt them in Settings
    Alert.alert(
      'Biometrics Not Set Up',
      'Enable Face ID or fingerprint in your device Settings to use this feature.'
    );
    return false;
  }

  // Check available types
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  const hasFaceID = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const hasFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

  // Authenticate
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirm your identity',
    cancelLabel: 'Use Password',
    disableDeviceFallback: false, // Allow PIN fallback
    fallbackLabel: 'Use Passcode',
  });

  return result.success;
}
```

### Flutter

```dart
import 'package:local_auth/local_auth.dart';

class BiometricService {
  final LocalAuthentication _auth = LocalAuthentication();

  Future<bool> authenticate() async {
    final canCheck = await _auth.canCheckBiometrics;
    final isDeviceSupported = await _auth.isDeviceSupported();

    if (!canCheck || !isDeviceSupported) return false;

    try {
      return await _auth.authenticate(
        localizedReason: 'Confirm your identity to continue',
        options: const AuthenticationOptions(
          stickyAuth: true,    // Keep auth dialog if app goes to background
          biometricOnly: false, // Allow PIN fallback
        ),
      );
    } catch (e) {
      return false;
    }
  }
}
```

### Simulator vs Real Device

| Feature | iOS Simulator | Android Emulator | Real Device |
|---------|--------------|-----------------|-------------|
| Face ID | Simulated (Features > Face ID) | Not supported | Full support |
| Touch ID | Simulated (Features > Touch ID) | Simulated (extended controls) | Full support |
| Biometric enrollment | Can simulate | Limited | Full support |

---

## Contacts

### Libraries

| Framework | Library | Features |
|-----------|---------|----------|
| React Native (Expo) | `expo-contacts` | Read contacts, search, get by ID |
| Flutter | `contacts_service` | Read/write contacts |

### Use Cases

- **Invite friends:** Find contacts who aren't on the platform
- **Share with contacts:** Quick-share to a phone number or email
- **Auto-fill:** Pre-fill recipient fields from contact data

### Permissions Required

| Platform | Permission | Notes |
|----------|-----------|-------|
| iOS | `NSContactsUsageDescription` | Info.plist string required |
| Android | `READ_CONTACTS` | Runtime permission |
| Android | `WRITE_CONTACTS` | Only if modifying contacts (rare) |

### React Native (Expo)

```typescript
import * as Contacts from 'expo-contacts';

async function getContacts() {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') return [];

  const { data } = await Contacts.getContactsAsync({
    fields: [
      Contacts.Fields.Name,
      Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails,
      Contacts.Fields.Image,
    ],
    sort: Contacts.SortTypes.FirstName,
  });

  return data.map((contact) => ({
    id: contact.id,
    name: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim(),
    phone: contact.phoneNumbers?.[0]?.number ?? null,
    email: contact.emails?.[0]?.email ?? null,
    image: contact.imageAvailable ? contact.image : null,
  }));
}
```

### Simulator vs Real Device

| Feature | iOS Simulator | Android Emulator | Real Device |
|---------|--------------|-----------------|-------------|
| Read contacts | Sample contacts available | Need to add manually | Full address book |
| Contact photos | Works | Works | Full support |
| Write contacts | Works | Works | Full support |

---

## Bluetooth / NFC

### Libraries

| Framework | Library | Technology |
|-----------|---------|-----------|
| React Native | `react-native-ble-plx` | Bluetooth Low Energy (BLE) |
| React Native | `react-native-nfc-manager` | NFC tag reading/writing |
| Flutter | `flutter_blue_plus` | Bluetooth Low Energy |
| Flutter | `nfc_manager` | NFC tag reading/writing |

### Use Cases

- **BLE device pairing:** Fitness trackers, smart locks, medical devices
- **Beacon detection:** Indoor navigation, proximity marketing, museum guides
- **NFC tag reading:** Tap-to-pay, event check-in, product authentication
- **NFC tag writing:** Write URL or data to NFC tags

### Permissions Required

| Platform | Permission | Notes |
|----------|-----------|-------|
| iOS | `NSBluetoothPeripheralUsageDescription` | Required for BLE |
| iOS | `NSBluetoothAlwaysUsageDescription` | For background BLE (iOS 13+) |
| iOS | NFC requires entitlement | Add "Near Field Communication Tag Reading" capability |
| Android | `BLUETOOTH_CONNECT` | Android 12+ (runtime permission) |
| Android | `BLUETOOTH_SCAN` | Android 12+ (runtime permission) |
| Android | `ACCESS_FINE_LOCATION` | Required for BLE scanning on Android < 12 |
| Android | `NFC` | Manifest permission (no runtime prompt) |

### React Native — BLE

```typescript
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

// Scan for nearby BLE devices
function scanForDevices(onDeviceFound: (device: Device) => void) {
  manager.startDeviceScan(
    null, // null = scan for all service UUIDs
    { allowDuplicates: false },
    (error, device) => {
      if (error) {
        console.error('BLE scan error:', error);
        return;
      }
      if (device?.name) {
        onDeviceFound(device);
      }
    }
  );

  // Stop scanning after 10 seconds
  setTimeout(() => manager.stopDeviceScan(), 10000);
}

// Connect to a device
async function connectToDevice(deviceId: string) {
  const device = await manager.connectToDevice(deviceId);
  await device.discoverAllServicesAndCharacteristics();

  // Read a characteristic
  const characteristic = await device.readCharacteristicForService(
    'service-uuid',
    'characteristic-uuid'
  );
  console.log('Value:', characteristic.value); // base64 encoded
}
```

### React Native — NFC

```typescript
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Initialize NFC
await NfcManager.start();

// Read an NFC tag
async function readNfcTag(): Promise<string | null> {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();

    if (tag?.ndefMessage) {
      const record = tag.ndefMessage[0];
      const text = Ndef.text.decodePayload(new Uint8Array(record.payload));
      return text;
    }
    return null;
  } catch (error) {
    console.error('NFC read error:', error);
    return null;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
```

### Simulator vs Real Device

| Feature | iOS Simulator | Android Emulator | Real Device |
|---------|--------------|-----------------|-------------|
| BLE scanning | Not supported | Not supported | Full support |
| BLE connection | Not supported | Not supported | Full support |
| NFC reading | Not supported | Limited (Core NFC) | Full support |
| NFC writing | Not supported | Not supported | Full support |

**Bluetooth and NFC can only be tested on real devices. There is no simulator support.**

---

## File System

### Libraries

| Framework | Library | Features |
|-----------|---------|----------|
| React Native (Expo) | `expo-file-system` | Read/write files, download, upload |
| React Native (Expo) | `expo-document-picker` | System file picker dialog |
| React Native (Expo) | `expo-sharing` | Share files via system share sheet |
| Flutter | `path_provider` | Get app-specific directories |
| Flutter | `file_picker` | System file picker dialog |
| Flutter | `share_plus` | Share files via system share sheet |

### Use Cases

- **Document storage:** Save PDFs, images, or data exports locally
- **File sharing:** Export data as CSV/PDF and share via email or messaging
- **File import:** Let users import documents, images, or data files
- **Offline caching:** Cache large files (images, videos) for offline access

### Permissions Required

| Platform | Permission | Notes |
|----------|-----------|-------|
| iOS | `NSPhotoLibraryUsageDescription` | Only if accessing photo library |
| iOS | No file permission needed | App sandbox provides private file access |
| Android | `READ_EXTERNAL_STORAGE` | Android < 13 only. Not needed for app-specific directories. |
| Android | `READ_MEDIA_IMAGES` | Android 13+ for images |
| Android | `READ_MEDIA_VIDEO` | Android 13+ for videos |

### React Native (Expo)

```typescript
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

// App-specific directories (no permission needed)
const appDir = FileSystem.documentDirectory; // Persistent, backed up
const cacheDir = FileSystem.cacheDirectory;  // Can be cleared by OS

// Write a file
async function saveData(filename: string, data: string): Promise<string> {
  const path = `${appDir}${filename}`;
  await FileSystem.writeAsStringAsync(path, data, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return path;
}

// Read a file
async function loadData(filename: string): Promise<string | null> {
  const path = `${appDir}${filename}`;
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) return null;
  return FileSystem.readAsStringAsync(path);
}

// Download a file
async function downloadFile(url: string, filename: string): Promise<string> {
  const path = `${appDir}${filename}`;
  const download = FileSystem.createDownloadResumable(
    url,
    path,
    {},
    (progress) => {
      const pct = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
      console.log(`Download: ${Math.round(pct * 100)}%`);
    }
  );
  const result = await download.downloadAsync();
  return result?.uri ?? path;
}

// Pick a file from the system
async function pickDocument() {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/*'],
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  return result.assets[0]; // { uri, name, size, mimeType }
}

// Share a file
async function shareFile(uri: string) {
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri);
  }
}
```

### Flutter

```dart
import 'package:path_provider/path_provider.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';

class FileService {
  Future<String> get _appDir async {
    final dir = await getApplicationDocumentsDirectory();
    return dir.path;
  }

  Future<File> saveData(String filename, String data) async {
    final path = '${await _appDir}/$filename';
    return File(path).writeAsString(data);
  }

  Future<String?> loadData(String filename) async {
    final path = '${await _appDir}/$filename';
    final file = File(path);
    if (!await file.exists()) return null;
    return file.readAsString();
  }

  Future<FilePickerResult?> pickFile() async {
    return FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg'],
    );
  }
}
```

### Simulator vs Real Device

| Feature | iOS Simulator | Android Emulator | Real Device |
|---------|--------------|-----------------|-------------|
| App file read/write | Full support | Full support | Full support |
| Document picker | Limited (no iCloud) | Works | Full support |
| File sharing | Limited | Works | Full support |
| Photo library access | Sample photos | Need to add | Full library |

---

## Graceful Degradation Patterns

When a device API is unavailable (permission denied, hardware missing, simulator), always provide a fallback:

```typescript
// Pattern: Check → Explain → Fallback
async function scanBarcode(): Promise<string | null> {
  // 1. Check hardware availability
  const hasCamera = await Camera.isAvailableAsync();
  if (!hasCamera) {
    // Fallback: manual entry
    return promptManualEntry('Enter barcode number manually');
  }

  // 2. Check permission
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    // Explain and offer alternatives
    Alert.alert(
      'Camera Required',
      'Camera access is needed to scan barcodes. You can also enter the code manually.',
      [
        { text: 'Enter Manually', onPress: () => promptManualEntry() },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
    return null;
  }

  // 3. Use the camera
  return openBarcodeScanner();
}
```

**Never let a denied permission block the user entirely.** Always offer an alternative path — manual entry, text search, or a different workflow.
