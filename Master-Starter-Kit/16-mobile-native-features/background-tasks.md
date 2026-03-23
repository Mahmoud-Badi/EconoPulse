# Background Tasks

Mobile operating systems aggressively restrict what apps can do when they are not in the foreground. iOS kills background tasks after 30 seconds. Android Doze mode defers all network access. Both platforms throttle background fetch frequency based on user engagement. This guide covers what each platform allows, the constraints you must work within, and per-framework implementation.

---

## Platform Constraints Summary

| Constraint | iOS | Android |
|-----------|-----|---------|
| Background fetch max time | ~30 seconds | 10 minutes (WorkManager) |
| Background fetch frequency | OS decides (adaptive, based on usage) | Minimum 15 minutes (WorkManager) |
| Background processing | BGProcessingTask: up to several minutes, only when idle + charging | WorkManager: no time limit for long-running, but must show foreground notification |
| Network in background | Allowed during active task only | Restricted in Doze mode (deferred until maintenance window) |
| Location in background | Requires "Always" permission + background mode | Requires `ACCESS_BACKGROUND_LOCATION` + foreground service |
| Audio in background | Requires background audio mode | Requires foreground service with media type |
| Keep-alive | Not possible (no persistent background execution) | Foreground service only (must show notification) |
| Battery optimization | iOS manages automatically (App Nap) | User can disable battery optimization per app |

---

## iOS Background Modes

### Available Background Modes (Capabilities)

| Mode | Capability | Max Duration | Use Case |
|------|-----------|-------------|----------|
| Background Fetch | `fetch` | ~30 seconds | Refresh content (news, social feed) |
| Remote Notifications | `remote-notification` | ~30 seconds | Silent push to trigger data fetch |
| Background Processing | `processing` | Minutes (when idle + charging) | Database cleanup, ML model training |
| Background Location | `location` | Continuous (with permission) | Delivery tracking, fitness |
| Background Audio | `audio` | Continuous | Music, podcasts, audio recording |
| VoIP | `voip` | Continuous | Internet calling |
| Bluetooth | `bluetooth-central` / `bluetooth-peripheral` | Continuous | BLE device communication |

### BGTaskScheduler (iOS 13+)

```swift
// AppDelegate.swift — register tasks at launch
import BackgroundTasks

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    // Register background fetch task
    BGTaskScheduler.shared.register(
        forTaskWithIdentifier: "com.yourapp.refresh",
        using: nil
    ) { task in
        self.handleBackgroundRefresh(task: task as! BGAppRefreshTask)
    }

    // Register background processing task (heavy work)
    BGTaskScheduler.shared.register(
        forTaskWithIdentifier: "com.yourapp.cleanup",
        using: nil
    ) { task in
        self.handleBackgroundProcessing(task: task as! BGProcessingTask)
    }

    return true
}

// Schedule background fetch
func scheduleBackgroundRefresh() {
    let request = BGAppRefreshTaskRequest(identifier: "com.yourapp.refresh")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60) // No sooner than 15 min
    try? BGTaskScheduler.shared.submit(request)
}

// Schedule background processing (runs when idle + charging)
func scheduleBackgroundProcessing() {
    let request = BGProcessingTaskRequest(identifier: "com.yourapp.cleanup")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 60 * 60) // No sooner than 1 hour
    request.requiresNetworkConnectivity = true  // Wait for network
    request.requiresExternalPower = true         // Wait for charging
    try? BGTaskScheduler.shared.submit(request)
}

// Handle background refresh
func handleBackgroundRefresh(task: BGAppRefreshTask) {
    // Schedule the next refresh
    scheduleBackgroundRefresh()

    // Set expiration handler (called if time runs out)
    task.expirationHandler = {
        // Clean up any in-progress work
        task.setTaskCompleted(success: false)
    }

    // Do the work (max ~30 seconds)
    Task {
        do {
            let newData = try await fetchLatestContent()
            await updateLocalDatabase(with: newData)
            task.setTaskCompleted(success: true)
        } catch {
            task.setTaskCompleted(success: false)
        }
    }
}

// Handle background processing
func handleBackgroundProcessing(task: BGProcessingTask) {
    scheduleBackgroundProcessing()

    task.expirationHandler = {
        task.setTaskCompleted(success: false)
    }

    Task {
        do {
            try await performDatabaseCleanup()
            try await syncOfflineChanges()
            task.setTaskCompleted(success: true)
        } catch {
            task.setTaskCompleted(success: false)
        }
    }
}
```

### Info.plist Configuration

```xml
<!-- Info.plist -->
<key>BGTaskSchedulerPermittedIdentifiers</key>
<array>
    <string>com.yourapp.refresh</string>
    <string>com.yourapp.cleanup</string>
</array>

<key>UIBackgroundModes</key>
<array>
    <string>fetch</string>
    <string>processing</string>
    <!-- Add only the modes you actually use -->
    <!-- <string>location</string> -->
    <!-- <string>remote-notification</string> -->
    <!-- <string>audio</string> -->
</array>
```

### Testing Background Tasks on iOS

```
# In Xcode debugger, simulate background fetch:
# Debug > Simulate Background Fetch

# Or use lldb command while app is running:
e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"com.yourapp.refresh"]
```

---

## Android Background Execution

### WorkManager (Recommended)

WorkManager is the recommended API for deferrable, guaranteed background work on Android. It handles backward compatibility, respects Doze mode, and survives process death.

```kotlin
// build.gradle
dependencies {
    implementation("androidx.work:work-runtime-ktx:2.9.0")
}
```

```kotlin
// SyncWorker.kt
class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            val unsyncedItems = database.getUnsyncedItems()
            api.syncItems(unsyncedItems)
            database.markAllSynced()
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) {
                Result.retry() // WorkManager handles exponential backoff
            } else {
                Result.failure()
            }
        }
    }
}

// Schedule work
fun schedulePeriodicSync() {
    val constraints = Constraints.Builder()
        .setRequiredNetworkType(NetworkType.CONNECTED)
        .setRequiresBatteryNotLow(true)
        .build()

    // Periodic work (minimum interval: 15 minutes)
    val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(
        repeatInterval = 30, repeatIntervalTimeUnit = TimeUnit.MINUTES,
        flexInterval = 15, flexTimeUnit = TimeUnit.MINUTES
    )
        .setConstraints(constraints)
        .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 1, TimeUnit.MINUTES)
        .build()

    WorkManager.getInstance(context).enqueueUniquePeriodicWork(
        "periodic_sync",
        ExistingPeriodicWorkPolicy.KEEP, // Don't restart if already scheduled
        syncRequest
    )
}

// One-time work (e.g., upload a file)
fun scheduleUpload(fileUri: String) {
    val uploadRequest = OneTimeWorkRequestBuilder<UploadWorker>()
        .setInputData(workDataOf("file_uri" to fileUri))
        .setConstraints(
            Constraints.Builder()
                .setRequiredNetworkType(NetworkType.UNMETERED) // WiFi only
                .build()
        )
        .build()

    WorkManager.getInstance(context).enqueue(uploadRequest)
}
```

### Foreground Services (User-Visible Ongoing Work)

For work that the user should be aware of (music playback, navigation, file download):

```kotlin
class LocationTrackingService : Service() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = NotificationCompat.Builder(this, "tracking")
            .setContentTitle("Tracking your delivery")
            .setContentText("Location is being shared with the customer")
            .setSmallIcon(R.drawable.ic_location)
            .setOngoing(true)
            .build()

        startForeground(NOTIFICATION_ID, notification)

        // Start location updates
        startLocationTracking()

        return START_STICKY // Restart if killed
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
```

### Android Doze Mode

Android 6+ aggressively restricts background network access when the device is idle (screen off, stationary, not charging):

| Doze State | Network | Alarms | Sync | GPS |
|-----------|---------|--------|------|-----|
| Active | Allowed | Normal | Normal | Normal |
| Light Doze | Deferred | Deferred | Deferred | Reduced |
| Deep Doze | Blocked | Blocked | Blocked | Blocked |
| Maintenance Window | Allowed (briefly) | Fires | Fires | Allowed |

**How to work with Doze:**
- Use WorkManager (it schedules work during maintenance windows)
- Use high-priority FCM messages (bypass Doze for critical alerts)
- Never use `AlarmManager` for periodic work (unreliable in Doze)
- Foreground services are NOT affected by Doze

---

## React Native

### expo-task-manager

```typescript
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Location from 'expo-location';

// Define a background fetch task
const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const now = Date.now();
    console.log(`Background fetch at ${new Date(now).toISOString()}`);

    // Do your background work here
    await syncOfflineData();
    await refreshCachedContent();

    // Return the result
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the background fetch task
async function registerBackgroundFetch() {
  const status = await BackgroundFetch.getStatusAsync();

  if (status === BackgroundFetch.BackgroundFetchStatus.Denied) {
    console.log('Background fetch is disabled in system settings');
    return;
  }

  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 15 minutes (minimum on both platforms)
    stopOnTerminate: false,    // Keep running after app is killed (Android)
    startOnBoot: true,         // Start after device reboot (Android)
  });
}

// Unregister
async function unregisterBackgroundFetch() {
  await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
```

### Background Location (expo-task-manager)

```typescript
const LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  const { locations } = data;
  const location = locations[0];

  // Send location to server
  await api.updateLocation({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: location.timestamp,
  });
});

async function startBackgroundLocation() {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') return;

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 100,        // meters between updates
    deferredUpdatesInterval: 60000, // batch updates every 60 seconds
    showsBackgroundLocationIndicator: true, // iOS blue bar
    foregroundService: {           // Android foreground service notification
      notificationTitle: 'Tracking delivery',
      notificationBody: 'Your location is being shared',
      notificationColor: '#0066FF',
    },
  });
}

async function stopBackgroundLocation() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK);
}
```

### Headless JS (React Native Bare)

For bare React Native apps, Headless JS allows running JavaScript when the app is not in the foreground (Android only):

```typescript
// index.js
import { AppRegistry } from 'react-native';

// Register a Headless JS task
AppRegistry.registerHeadlessTask('SyncTask', () => async (taskData) => {
  console.log('Headless task running with data:', taskData);
  await syncOfflineData();
  // Task must complete — no indefinite background execution
});
```

```kotlin
// Android: Trigger Headless JS from native code
class SyncHeadlessTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig {
        return HeadlessJsTaskConfig(
            "SyncTask",
            Arguments.createMap().apply {
                putString("trigger", "periodic_sync")
            },
            5000, // timeout in ms
            true  // allow in foreground
        )
    }
}
```

---

## Flutter

### workmanager Package

```dart
// pubspec.yaml
dependencies:
  workmanager: ^0.5.2

// lib/main.dart
import 'package:workmanager/workmanager.dart';

// Top-level function — cannot be a class method
@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    switch (task) {
      case 'syncTask':
        await syncOfflineData();
        return true;
      case 'cleanupTask':
        await performDatabaseCleanup();
        return true;
      default:
        return false;
    }
  });
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Workmanager
  await Workmanager().initialize(callbackDispatcher, isInDebugMode: false);

  // Schedule periodic sync (minimum 15 minutes)
  await Workmanager().registerPeriodicTask(
    'periodicSync',
    'syncTask',
    frequency: const Duration(minutes: 30),
    constraints: Constraints(
      networkType: NetworkType.connected,
      requiresBatteryNotLow: true,
    ),
    backoffPolicy: BackoffPolicy.exponential,
    initialDelay: const Duration(minutes: 5),
  );

  // Schedule one-time task
  await Workmanager().registerOneOffTask(
    'uploadOnce',
    'syncTask',
    inputData: {'priority': 'high'},
    constraints: Constraints(networkType: NetworkType.connected),
  );

  runApp(const MyApp());
}

// Cancel tasks
await Workmanager().cancelByUniqueName('periodicSync');
await Workmanager().cancelAll();
```

### flutter_background_service

For long-running background tasks (like a music player or location tracker):

```dart
import 'package:flutter_background_service/flutter_background_service.dart';

Future<void> initializeBackgroundService() async {
  final service = FlutterBackgroundService();

  await service.configure(
    androidConfiguration: AndroidConfiguration(
      onStart: onStart,
      autoStart: false,
      isForegroundMode: true, // Shows notification
      notificationChannelId: 'background_service',
      initialNotificationTitle: 'Tracking active',
      initialNotificationContent: 'Monitoring your location',
      foregroundServiceNotificationId: 888,
    ),
    iosConfiguration: IosConfiguration(
      autoStart: false,
      onForeground: onStart,
      onBackground: onIosBackground,
    ),
  );
}

@pragma('vm:entry-point')
void onStart(ServiceInstance service) async {
  // This runs in a background isolate
  if (service is AndroidServiceInstance) {
    service.on('setAsForeground').listen((_) => service.setAsForegroundService());
    service.on('setAsBackground').listen((_) => service.setAsBackgroundService());
  }

  // Periodic work
  Timer.periodic(const Duration(seconds: 30), (timer) async {
    if (service is AndroidServiceInstance && !(await service.isForegroundService())) {
      return;
    }

    // Do background work
    final position = await getCurrentLocation();
    service.invoke('locationUpdate', {
      'lat': position.latitude,
      'lng': position.longitude,
    });
  });

  service.on('stop').listen((_) {
    service.stopSelf();
  });
}

@pragma('vm:entry-point')
Future<bool> onIosBackground(ServiceInstance service) async {
  // iOS background processing
  return true;
}
```

### Isolates for Heavy Computation

For CPU-intensive work that would block the UI thread:

```dart
import 'dart:isolate';

// Run heavy computation in a separate isolate
Future<List<ProcessedItem>> processLargeDataset(List<RawItem> items) async {
  return await Isolate.run(() {
    // This runs on a separate thread
    return items.map((item) => processItem(item)).toList();
  });
}

// For ongoing background processing with communication
Future<void> startProcessingIsolate() async {
  final receivePort = ReceivePort();

  await Isolate.spawn((SendPort sendPort) {
    // Background isolate work
    final items = fetchAndProcessData();
    sendPort.send(items);
  }, receivePort.sendPort);

  receivePort.listen((message) {
    // Handle results from background isolate
    updateUI(message);
  });
}
```

---

## Battery and Data Optimization

### Respecting Battery Saver Mode

```typescript
// React Native: Check battery state
import * as Battery from 'expo-battery';

const batteryLevel = await Battery.getBatteryLevelAsync();
const isLowPower = await Battery.isLowPowerModeEnabledAsync();

if (isLowPower || batteryLevel < 0.2) {
  // Reduce background work frequency
  // Skip non-essential syncs
  // Defer large uploads
}

// Subscribe to low power mode changes
Battery.addLowPowerModeListener(({ lowPowerMode }) => {
  if (lowPowerMode) {
    reduceBackgroundActivity();
  } else {
    restoreNormalActivity();
  }
});
```

```dart
// Flutter: Check battery state
import 'package:battery_plus/battery_plus.dart';

final battery = Battery();
final level = await battery.batteryLevel;
final state = await battery.batteryState; // charging, discharging, full

battery.onBatteryStateChanged.listen((state) {
  if (state == BatteryState.discharging && level < 20) {
    reduceBackgroundActivity();
  }
});
```

### WiFi-Only Sync

```typescript
// React Native: Only sync large files on WiFi
import NetInfo from '@react-native-community/netinfo';

const state = await NetInfo.fetch();
if (state.type === 'wifi') {
  await syncLargeFiles(); // Photos, videos, large datasets
} else {
  await syncEssentialDataOnly(); // Text, metadata, small payloads
}
```

```kotlin
// Android WorkManager: WiFi constraint
val wifiOnlyConstraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.UNMETERED) // WiFi only
    .build()

val uploadRequest = OneTimeWorkRequestBuilder<LargeUploadWorker>()
    .setConstraints(wifiOnlyConstraints)
    .build()
```

### Adaptive Scheduling

Adjust background work frequency based on user engagement:

```typescript
function getBackgroundInterval(lastActiveTimestamp: number): number {
  const hoursSinceActive = (Date.now() - lastActiveTimestamp) / (1000 * 60 * 60);

  if (hoursSinceActive < 1) return 15 * 60 * 1000;   // Active user: every 15 min
  if (hoursSinceActive < 24) return 60 * 60 * 1000;   // Recent user: every hour
  if (hoursSinceActive < 72) return 6 * 60 * 60 * 1000; // Inactive: every 6 hours
  return 24 * 60 * 60 * 1000;                          // Dormant: once a day
}
```

---

## Common Use Cases

| Use Case | iOS Solution | Android Solution | RN (Expo) | Flutter |
|----------|-------------|-----------------|-----------|---------|
| Periodic data sync | BGAppRefreshTask | WorkManager (periodic) | expo-background-fetch | workmanager |
| Location tracking | Background location mode | Foreground service | expo-task-manager + expo-location | flutter_background_service |
| File upload | URLSession background transfer | WorkManager (one-time) | expo-file-system + background fetch | workmanager |
| Scheduled notifications | UNNotificationRequest | AlarmManager + NotificationManager | expo-notifications schedule | flutter_local_notifications |
| Music playback | Background audio mode | Foreground service (media) | expo-av | just_audio_background |
| Health data sync | BGProcessingTask | WorkManager | Not supported in Expo | workmanager |
| WebSocket keep-alive | Not possible (use push instead) | Foreground service | Not reliable | flutter_background_service |

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Expecting exact timing for background fetch | Tasks run at OS discretion, not your schedule | Design for eventual execution, not precise timing |
| Not calling `setTaskCompleted` on iOS | System throttles your app's background time | Always call `setTaskCompleted(success:)` when done |
| Using `Timer` / `setInterval` for background work | Timers don't run when app is backgrounded | Use platform background APIs (WorkManager, BGTaskScheduler) |
| Not declaring background modes in Info.plist | Background tasks silently fail | Add required `UIBackgroundModes` for each capability |
| Running CPU-intensive work on main thread | UI freezes, watchdog kills app | Use isolates (Flutter) or Web Workers/background threads |
| Not handling `expirationHandler` on iOS | System terminates task ungracefully | Always register expiration handler and clean up |
| Ignoring Doze mode on Android | Background work never executes | Use WorkManager (it respects Doze maintenance windows) |
| Requesting background location without clear need | App Store rejection, user distrust | Only request if your core feature requires it, explain clearly |
| Not testing on real devices with battery optimization | Works in dev, fails in production | Test with battery saver enabled, test after Doze engages |
