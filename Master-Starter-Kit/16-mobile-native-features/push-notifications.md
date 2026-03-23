# Push Notifications

Push notifications are the primary re-engagement channel for mobile apps. Getting them wrong means silent failures (tokens expire, channels misconfigured, permissions denied) or App Store rejection (requesting notification permission on first launch without context). This guide covers the full pipeline: device registration, server-side delivery, foreground/background handling, and permission flow.

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Mobile App  │────▶│  Your Server │────▶│  FCM / APNs  │────▶│  Device      │
│              │     │              │     │              │     │              │
│ 1. Register  │     │ 2. Store     │     │ 3. Route     │     │ 4. Display   │
│    device    │     │    token     │     │    message   │     │    notif     │
│    token     │     │              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Flow:**
1. App registers with APNs (iOS) or FCM (Android) and receives a device token
2. App sends that token to your backend, associated with the user ID
3. Backend stores the token (database table: `device_tokens`)
4. When an event triggers a notification, backend sends the payload to FCM/APNs
5. FCM/APNs routes the message to the correct device
6. App handles the notification (foreground display, background tap navigation)

**Key facts:**
- Device tokens can change at any time — always re-register on app launch
- iOS tokens are APNs-specific; Android tokens are FCM-specific
- FCM can deliver to both iOS and Android (FCM wraps APNs for iOS)
- Tokens become invalid when the user uninstalls, reinstalls, or clears app data

---

## React Native (Expo)

### Setup

```bash
npx expo install expo-notifications expo-device expo-constants
```

```typescript
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### Token Registration

```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications don't work on simulators
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  // Check existing permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    // User denied — handle gracefully (see Permission Flow section below)
    return null;
  }

  // Get the Expo push token (works with Expo Push API)
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  // Android: create notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token.data;
}

// Send token to your backend
export async function saveTokenToServer(token: string, userId: string) {
  await fetch('https://api.yourapp.com/device-tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      userId,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    }),
  });
}
```

### Notification Handlers

```typescript
// app/_layout.tsx (or root component)
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export default function RootLayout() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // FOREGROUND: Notification received while app is open
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        // Show in-app banner, update badge count, etc.
        console.log('Foreground notification:', data);
      });

    // BACKGROUND/KILLED: User tapped the notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        // Navigate to the relevant screen
        if (data.screen) {
          router.push(data.screen as string);
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // ... rest of layout
}
```

### Android Notification Channels

Android 8+ (API 26) requires notification channels. Users can disable individual channels in system settings.

```typescript
// Create channels during app initialization
async function setupNotificationChannels() {
  await Notifications.setNotificationChannelAsync('messages', {
    name: 'Messages',
    description: 'New message notifications',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'message.wav',
    vibrationPattern: [0, 250, 250, 250],
    enableLights: true,
    lightColor: '#0066FF',
  });

  await Notifications.setNotificationChannelAsync('promotions', {
    name: 'Promotions',
    description: 'Deals and promotional offers',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: null, // No sound for promos
  });

  await Notifications.setNotificationChannelAsync('reminders', {
    name: 'Reminders',
    description: 'Scheduled reminders',
    importance: Notifications.AndroidImportance.HIGH,
  });
}
```

### Expo Push API vs Direct FCM/APNs

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Expo Push API** | Simple HTTP API, handles both platforms, free | Extra hop (Expo servers), limited customization | Most Expo apps, prototyping |
| **Direct FCM** | Full control, lower latency, rich features | More setup, manage both platforms separately | High-volume apps, custom payloads |

```typescript
// Sending via Expo Push API (from your server)
const message = {
  to: 'ExponentPushToken[xxxxxx]',
  sound: 'default',
  title: 'New Message',
  body: 'You have a new message from Sarah',
  data: { screen: '/messages/123' },
};

await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(message),
});
```

---

## React Native (Bare Workflow)

### Setup

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install @notifee/react-native  # For local notifications and foreground display
```

### Token Registration and Handling

```typescript
// src/notifications.ts
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export async function registerForPushNotifications(): Promise<string | null> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) return null;

  const token = await messaging().getToken();
  return token;
}

// Listen for token refresh
messaging().onTokenRefresh(async (newToken) => {
  await saveTokenToServer(newToken, getCurrentUserId());
});

// FOREGROUND: Display notification using Notifee
messaging().onMessage(async (remoteMessage) => {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? 'Notification',
    body: remoteMessage.notification?.body ?? '',
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_notification',
      pressAction: { id: 'default' },
    },
    data: remoteMessage.data,
  });
});

// BACKGROUND/KILLED: Register background handler (must be in index.js)
// index.js
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message:', remoteMessage);
  // Process data, update badge, etc.
});

// TAP HANDLER: User tapped a notification
messaging().onNotificationOpenedApp((remoteMessage) => {
  navigateToScreen(remoteMessage.data?.screen);
});

// APP OPENED FROM KILLED STATE via notification
const initialNotification = await messaging().getInitialNotification();
if (initialNotification) {
  navigateToScreen(initialNotification.data?.screen);
}
```

---

## Flutter

### Setup

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^3.0.0
  firebase_messaging: ^15.0.0
  flutter_local_notifications: ^18.0.0
```

### Token Registration and Handling

```dart
// lib/services/notification_service.dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  Future<void> initialize() async {
    // Request permission
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false, // Set true for iOS provisional authorization
    );

    if (settings.authorizationStatus != AuthorizationStatus.authorized) {
      return;
    }

    // Get and save token
    final token = await _messaging.getToken();
    if (token != null) {
      await _saveTokenToServer(token);
    }

    // Listen for token refresh
    _messaging.onTokenRefresh.listen(_saveTokenToServer);

    // Setup local notifications for foreground display
    await _setupLocalNotifications();

    // FOREGROUND handler
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // BACKGROUND TAP handler (app was in background)
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // APP LAUNCHED from notification (was killed)
    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }
  }

  Future<void> _setupLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    const settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      settings,
      onDidReceiveNotificationResponse: (response) {
        // Handle tap on local notification
        _navigateToScreen(response.payload);
      },
    );

    // Create Android notification channel
    const channel = AndroidNotificationChannel(
      'high_importance',
      'High Importance Notifications',
      description: 'Used for important notifications',
      importance: Importance.high,
    );

    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);
  }

  void _handleForegroundMessage(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    _localNotifications.show(
      notification.hashCode,
      notification.title,
      notification.body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          'high_importance',
          'High Importance Notifications',
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: const DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      payload: message.data['screen'],
    );
  }

  void _handleNotificationTap(RemoteMessage message) {
    _navigateToScreen(message.data['screen']);
  }
}
```

### Background Message Handler (Top-Level Function)

```dart
// lib/main.dart — MUST be a top-level function, not a class method
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Process background data (cannot update UI from here)
  print('Background message: ${message.messageId}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}
```

---

## Native iOS

### APNs Registration

```swift
// AppDelegate.swift
import UIKit
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        return true
    }

    func requestNotificationPermission() {
        let options: UNAuthorizationOptions = [.alert, .badge, .sound]
        UNUserNotificationCenter.current().requestAuthorization(options: options) { granted, error in
            guard granted, error == nil else { return }
            DispatchQueue.main.async {
                UIApplication.shared.registerForRemoteNotifications()
            }
        }
    }

    // iOS 12+: Provisional authorization (delivers silently to Notification Center)
    func requestProvisionalPermission() {
        let options: UNAuthorizationOptions = [.alert, .badge, .sound, .provisional]
        UNUserNotificationCenter.current().requestAuthorization(options: options) { granted, _ in
            guard granted else { return }
            DispatchQueue.main.async {
                UIApplication.shared.registerForRemoteNotifications()
            }
        }
    }

    // Token received
    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        // Send token to your server
        saveTokenToServer(token: token)
    }

    // FOREGROUND: notification received while app is active
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // Show banner even when app is in foreground
        completionHandler([.banner, .badge, .sound])
    }

    // TAP: user tapped the notification
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        // Navigate to appropriate screen
        navigateToScreen(from: userInfo)
        completionHandler()
    }
}
```

### Notification Service Extension (Rich Notifications)

```swift
// NotificationServiceExtension/NotificationService.swift
import UserNotifications

class NotificationService: UNNotificationServiceExtension {

    override func didReceive(
        _ request: UNNotificationRequest,
        withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
    ) {
        guard let mutableContent = request.content.mutableCopy() as? UNMutableNotificationContent,
              let imageURLString = mutableContent.userInfo["image_url"] as? String,
              let imageURL = URL(string: imageURLString) else {
            contentHandler(request.content)
            return
        }

        // Download and attach image
        downloadImage(from: imageURL) { attachment in
            if let attachment = attachment {
                mutableContent.attachments = [attachment]
            }
            contentHandler(mutableContent)
        }
    }
}
```

---

## Native Android

### Firebase Cloud Messaging

```kotlin
// AndroidManifest.xml
<service
    android:name=".MyFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

```kotlin
// MyFirebaseMessagingService.kt
class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        // Send token to your server
        saveTokenToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // Create notification channel (required for Android 8+)
        createNotificationChannel()

        val notification = NotificationCompat.Builder(this, "default")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(remoteMessage.notification?.title ?: "Notification")
            .setContentText(remoteMessage.notification?.body ?: "")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(createPendingIntent(remoteMessage.data))
            .build()

        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(System.currentTimeMillis().toInt(), notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "default",
                "Default",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Default notification channel"
                enableLights(true)
                enableVibration(true)
            }
            val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }
}
```

---

## Server-Side: Firebase Admin SDK

### Setup

```typescript
// server/src/notifications.ts
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();
```

### Sending Notifications

```typescript
// Send to a single device
async function sendToDevice(token: string, title: string, body: string, data?: Record<string, string>) {
  try {
    await messaging.send({
      token,
      notification: { title, body },
      data: data ?? {},
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
          },
        },
      },
    });
  } catch (error: any) {
    // Handle invalid tokens
    if (
      error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered'
    ) {
      await deleteDeviceToken(token);
    }
    throw error;
  }
}

// Batch send (up to 500 messages per batch)
async function sendBatch(messages: admin.messaging.Message[]) {
  const batchSize = 500;
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    const response = await messaging.sendEach(batch);

    // Clean up failed tokens
    response.responses.forEach((resp, idx) => {
      if (resp.error) {
        const failedToken = (batch[idx] as any).token;
        deleteDeviceToken(failedToken);
      }
    });
  }
}

// Topic-based sending (subscribe users to topics like "news", "deals")
async function subscribeToTopic(tokens: string[], topic: string) {
  await messaging.subscribeToTopic(tokens, topic);
}

async function sendToTopic(topic: string, title: string, body: string) {
  await messaging.send({
    topic,
    notification: { title, body },
  });
}
```

### Token Management

```sql
-- device_tokens table
CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by user
CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);

-- Clean up stale tokens (run periodically)
DELETE FROM device_tokens WHERE last_used_at < NOW() - INTERVAL '60 days';
```

---

## Permission Flow

**The cardinal rule:** Never request notification permission on first launch. Users who haven't experienced your app's value will deny the permission, and on iOS you only get one chance to show the system dialog.

### Recommended Flow

```
1. User opens app for the first time
   → Do NOT request permission
   → Let them use the app normally

2. User completes a meaningful action (e.g., first order, first message sent)
   → Show a pre-permission screen explaining the value:
     "Get notified when your order ships"
     "Know instantly when someone replies to you"
   → Two buttons: "Enable Notifications" / "Maybe Later"

3. If user taps "Enable Notifications"
   → Show the system permission dialog
   → If granted → register token, save to server
   → If denied → show explanation, offer Settings link

4. If user taps "Maybe Later"
   → Respect the choice, remind later (after next meaningful action)
   → Never nag more than 3 times total
```

### iOS-Specific: Provisional Authorization (iOS 12+)

Provisional authorization delivers notifications silently to Notification Center without showing a permission dialog. The user sees a "Keep" / "Turn Off" option on the first notification. This is ideal for apps where you want to demonstrate notification value before asking for full permission.

```typescript
// Expo: Request provisional permission
const { status } = await Notifications.requestPermissionsAsync({
  ios: { allowProvisional: true },
});
```

### Handling Denial

```typescript
import { Alert, Linking, Platform } from 'react-native';

function handlePermissionDenied() {
  Alert.alert(
    'Notifications Disabled',
    'You won\'t receive updates about your orders. You can enable notifications in Settings.',
    [
      { text: 'Not Now', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        },
      },
    ],
  );
}
```

---

## Rich Notifications

### Images and Action Buttons

```typescript
// Server-side payload with rich content
const richMessage = {
  token: deviceToken,
  notification: {
    title: 'Your order has shipped!',
    body: 'Tap to track your package',
    imageUrl: 'https://cdn.yourapp.com/order-shipped.jpg', // iOS 15+, Android
  },
  data: {
    screen: '/orders/123/tracking',
    orderId: '123',
  },
  android: {
    notification: {
      channelId: 'orders',
      imageUrl: 'https://cdn.yourapp.com/order-shipped.jpg',
    },
  },
  apns: {
    payload: {
      aps: {
        'mutable-content': 1, // Required for Notification Service Extension
        category: 'ORDER_SHIPPED', // For action buttons
      },
    },
    fcmOptions: {
      imageUrl: 'https://cdn.yourapp.com/order-shipped.jpg',
    },
  },
};
```

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Not handling token refresh | Notifications stop working | Listen for `onTokenRefresh` and update server |
| Requesting permission on first launch | High denial rate, no second chance on iOS | Use pre-permission screen after value demonstration |
| No notification channels (Android 8+) | Notifications silently dropped | Create channels during app initialization |
| Not testing on real devices | Simulators cannot receive push notifications | Always test push on physical devices |
| Sending to stale tokens | Firebase errors, wasted API calls | Clean up tokens older than 60 days, delete on error |
| Missing `mutable-content: 1` for iOS rich notifications | Images won't load | Always set when sending image notifications |
| Background handler not top-level (Flutter) | Background notifications crash | Use `@pragma('vm:entry-point')` on top-level function |
