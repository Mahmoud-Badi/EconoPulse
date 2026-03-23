# Flutter Gotchas

Flutter and Dart gotchas discovered during mobile development. Every item here cost real debugging time.

---

## Dart Null Safety

### Late Variables Are Runtime Checked

`late` variables bypass null safety at compile time but crash at runtime if accessed before initialization.

```dart
// DANGEROUS — crashes if accessed before _init()
late final ApiClient _client;

void _init() {
  _client = ApiClient(baseUrl: 'https://api.example.com');
}

// SAFER — nullable with explicit check
ApiClient? _client;

ApiClient get client {
  if (_client == null) throw StateError('ApiClient not initialized');
  return _client!;
}
```

**Symptom:** `LateInitializationError: Field '_client' has not been initialized` crash at runtime.
**Fix:** Prefer nullable types with explicit checks over `late` for non-trivial initialization. Use `late` only for fields guaranteed to be set before use (e.g., in `initState`).

---

### The `!` Operator Hides Bugs

The null assertion operator `!` converts `T?` to `T` but throws if null. Overusing it defeats the purpose of null safety.

```dart
// BAD — throws if user is null
final name = user!.name;

// GOOD — handle the null case
final name = user?.name ?? 'Unknown';
```

**Symptom:** `Null check operator used on a null value` crash in production.
**Fix:** Use `?.` and `??` instead of `!`. Reserve `!` for cases where you have absolute certainty (e.g., after an explicit null check).

---

## Platform Channels

### Error Handling Must Be Symmetric

If the native side throws an error, Flutter receives a `PlatformException`. If you do not catch it, the app crashes.

```dart
// WRONG — no error handling
final result = await platform.invokeMethod('getBatteryLevel');

// CORRECT — catch platform errors
try {
  final result = await platform.invokeMethod('getBatteryLevel');
} on PlatformException catch (e) {
  debugPrint('Platform error: ${e.message}');
  return -1; // fallback value
}
```

**Symptom:** App crashes when native code throws an exception. The crash log shows `PlatformException` but the Dart code does not handle it.
**Fix:** Always wrap `invokeMethod` calls in try-catch. Log errors and provide fallback values.

---

### Method Channel Names Must Match Exactly

The channel name string must be identical on both Dart and native sides. There is no compile-time check.

```dart
// Dart side
const channel = MethodChannel('com.myapp.battery');

// iOS side (Swift)
let channel = FlutterMethodChannel(name: "com.myapp.battery", ...)

// Android side (Kotlin)
val channel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.myapp.battery")
```

**Symptom:** `MissingPluginException(No implementation found for method X on channel Y)`.
**Fix:** Use a shared constant file or code generation. Triple-check channel names match across all three files.

---

## Widget Keys

### Keys Are Required for Stateful Widgets in Lists

If you render `StatefulWidget`s in a `ListView` without keys, Flutter reuses widget state incorrectly when items are reordered, inserted, or removed.

```dart
// WRONG — state gets mixed up when list changes
ListView.builder(
  itemBuilder: (context, index) => MyStatefulItem(data: items[index]),
);

// CORRECT — key preserves state identity
ListView.builder(
  itemBuilder: (context, index) => MyStatefulItem(
    key: ValueKey(items[index].id),
    data: items[index],
  ),
);
```

**Symptom:** After reordering or removing items, the wrong item shows expanded state, wrong checkbox is checked, or animations play on wrong items.
**Fix:** Always use `ValueKey` with a unique identifier for stateful widgets in lists.

---

## Build Runner / Code Generation

### Build Runner Is Slow and Fragile

Packages like `freezed`, `json_serializable`, and `riverpod_generator` require `build_runner` to generate code. Common issues:

```bash
# Run code generation
dart run build_runner build --delete-conflicting-outputs

# Watch mode (regenerate on file change)
dart run build_runner watch --delete-conflicting-outputs
```

**Symptom:** Build fails with "conflicting outputs" or generated files are outdated.
**Fix:** Always use `--delete-conflicting-outputs`. Run `build_runner build` after pulling changes. Add generated files to `.gitignore` or commit them (team must agree on one approach).

---

### Freezed Union Types Need Part Directive

Freezed generates code in a `.freezed.dart` part file. Missing the `part` directive causes cryptic errors.

```dart
// REQUIRED — must be at top of file
part 'user_model.freezed.dart';
part 'user_model.g.dart'; // if using json_serializable

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String name,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
```

**Symptom:** `The name '_$UserModel' is not defined` or `Undefined class '_UserModel'`.
**Fix:** Add `part` directives and run `build_runner build`.

---

## iOS CocoaPods Issues

### CocoaPods Version Conflicts

Flutter iOS builds use CocoaPods for native dependency management. Version conflicts are common.

```bash
# Clean and reinstall pods
cd ios && rm -rf Pods Podfile.lock && pod install --repo-update && cd ..
```

**Symptom:** iOS build fails with "CocoaPods could not find compatible versions" or "CDN: trunk" errors.
**Fix:** Delete `Podfile.lock` and `Pods/`, then `pod install --repo-update`. If that fails, `pod repo remove trunk && pod setup`.

---

### Minimum iOS Version Mismatch

Some Flutter plugins require a higher minimum iOS version than your project specifies.

```ruby
# ios/Podfile
platform :ios, '15.0'  # Increase if a plugin requires it
```

**Symptom:** Build error: "The iOS deployment target is set to X.0, but the range of supported deployment target versions is Y.0 to Z.0."
**Fix:** Increase the platform version in `ios/Podfile` and `ios/Runner.xcodeproj` build settings.

---

## Gradle Issues (Android)

### Gradle Version Conflicts

Different Flutter plugins may require different Gradle or AGP (Android Gradle Plugin) versions.

```groovy
// android/build.gradle
buildscript {
    ext.kotlin_version = '1.9.22'
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.0'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

// android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-all.zip
```

**Symptom:** Android build fails with "Minimum supported Gradle version is X" or "This version of the Android Gradle plugin requires Kotlin version X."
**Fix:** Align Gradle, AGP, and Kotlin versions. Check the AGP ↔ Gradle compatibility matrix.

---

### ProGuard / R8 Stripping Required Code

In release mode, R8 (ProGuard replacement) minifies and tree-shakes code. If it removes code used via reflection (common in JSON serialization), the app crashes in release but works in debug.

```
# android/app/proguard-rules.pro
-keep class com.myapp.models.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
```

**Symptom:** App works in debug, crashes in release with `ClassNotFoundException` or JSON parsing errors.
**Fix:** Add ProGuard keep rules for model classes and serialization annotations. Test release builds regularly.

---

## Hot Reload Limitations

### Hot Reload Does Not Reset State

Hot reload preserves widget state. If you change initialization logic, the old state persists until you hot restart.

**Symptom:** Changed default values or constructor parameters are not reflected after hot reload.
**Fix:** Use hot restart (`Shift+R` in terminal, or restart button in IDE) after changing state initialization, constants, or constructor defaults.

---

### Hot Reload Does Not Work for Native Code

Changes to platform channels, native plugins, or build configuration require a full rebuild.

**Symptom:** Native code changes are not reflected after hot reload or hot restart.
**Fix:** Stop the app and run `flutter run` again. For plugin changes, run `flutter clean && flutter pub get` first.

---

## General Flutter Gotchas

### setState() Called After Dispose

Calling `setState()` after a widget is disposed (e.g., after navigating away) causes a framework error.

```dart
// WRONG — async callback may fire after dispose
void _loadData() async {
  final data = await api.fetchData();
  setState(() { _data = data; });
}

// CORRECT — check mounted before setState
void _loadData() async {
  final data = await api.fetchData();
  if (mounted) {
    setState(() { _data = data; });
  }
}
```

**Symptom:** `setState() called after dispose()` error in the console.
**Fix:** Always check `mounted` before calling `setState()` in async callbacks. Or use a state management solution (Riverpod, BLoC) that handles disposal automatically.

---

### Image Caching in ListView

Flutter's default `Image.network` does not cache images efficiently in scrolling lists. Use `cached_network_image` package.

```dart
// WRONG — re-downloads on every scroll
Image.network(url)

// CORRECT — caches to disk
CachedNetworkImage(imageUrl: url, placeholder: (_, __) => Shimmer())
```

**Symptom:** Images flicker when scrolling, network usage is high, or scrolling performance degrades with many images.
**Fix:** Use `cached_network_image` for all network images in lists. Configure memory and disk cache limits.
