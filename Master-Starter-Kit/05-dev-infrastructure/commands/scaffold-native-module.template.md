# /scaffold-native-module $ARGUMENT

Generate a native module bridge (React Native) or platform channel (Flutter) for accessing platform-specific APIs.

## Steps

1. **Parse the module name** from `$ARGUMENT`:
   - Convert to PascalCase for class/module names: `battery-level` → `BatteryLevel`
   - Convert to camelCase for method names: `battery-level` → `batteryLevel`
   - Determine the native API category (camera, sensors, storage, biometrics, Bluetooth, etc.)

2. **Check if a community package already exists**:
   - Search for existing packages before writing native code
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   - Check: `npx npm search react-native-$ARGUMENT 2>/dev/null | head -10`
   - Check Expo modules: `npx expo install --check expo-$ARGUMENT 2>/dev/null`
   - If a well-maintained package exists (>1000 weekly downloads, updated within 6 months), recommend using it instead of building custom.
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   - Check: `dart pub search $ARGUMENT 2>/dev/null | head -10`
   - Check pub.dev for official plugins (flutter team maintained)
   - If a well-maintained package exists (>100 pub points, updated within 6 months), recommend using it instead of building custom.
<!-- ENDIF -->

3. **Generate the native module**:

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   ### Expo Module (Recommended for Expo projects)

   Create `modules/$ARGUMENT/`:

   **`modules/$ARGUMENT/index.ts`** — TypeScript API:
   ```typescript
   import {ModuleName}Module from "./src/{ModuleName}Module";

   export function get{ModuleName}(): Promise<{ReturnType}> {
     return {ModuleName}Module.get{ModuleName}();
   }

   export function addListener(
     eventName: string,
     listener: (event: any) => void
   ): { remove: () => void } {
     return {ModuleName}Module.addListener(eventName, listener);
   }
   ```

   **`modules/$ARGUMENT/src/{ModuleName}Module.ts`** — Module definition:
   ```typescript
   import { requireNativeModule } from "expo-modules-core";

   export default requireNativeModule("{ModuleName}");
   ```

   **`modules/$ARGUMENT/ios/{ModuleName}Module.swift`** — iOS implementation:
   ```swift
   import ExpoModulesCore

   public class {ModuleName}Module: Module {
     public func definition() -> ModuleDefinition {
       Name("{ModuleName}")

       AsyncFunction("get{ModuleName}") { (promise: Promise) in
         // TODO: Implement native iOS logic
         promise.resolve(["value": "placeholder"])
       }

       Events("{ModuleName}Changed")
     }
   }
   ```

   **`modules/$ARGUMENT/android/src/main/java/expo/modules/{modulename}/{ModuleName}Module.kt`** — Android implementation:
   ```kotlin
   package expo.modules.{modulename}

   import expo.modules.kotlin.modules.Module
   import expo.modules.kotlin.modules.ModuleDefinition

   class {ModuleName}Module : Module() {
     override fun definition() = ModuleDefinition {
       Name("{ModuleName}")

       AsyncFunction("get{ModuleName}") {
         // TODO: Implement native Android logic
         mapOf("value" to "placeholder")
       }

       Events("{ModuleName}Changed")
     }
   }
   ```

   **`modules/$ARGUMENT/expo-module.config.json`**:
   ```json
   {
     "platforms": ["ios", "android"],
     "ios": {
       "modules": ["{ModuleName}Module"]
     },
     "android": {
       "modules": ["expo.modules.{modulename}.{ModuleName}Module"]
     }
   }
   ```

   ### TurboModule (React Native New Architecture)

   If not using Expo, generate a TurboModule:

   **`modules/$ARGUMENT/src/Native{ModuleName}.ts`** — Spec file:
   ```typescript
   import type { TurboModule } from "react-native";
   import { TurboModuleRegistry } from "react-native";

   export interface Spec extends TurboModule {
     get{ModuleName}(): Promise<{ReturnType}>;
   }

   export default TurboModuleRegistry.getEnforcing<Spec>("{ModuleName}");
   ```
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   ### Platform Channel

   **`lib/services/{module_name}_service.dart`** — Dart API:
   ```dart
   import 'package:flutter/services.dart';

   class {ModuleName}Service {
     static const _channel = MethodChannel('{{PROJECT_SLUG}}/{module_name}');

     /// Get {module_name} data from the native platform.
     static Future<Map<String, dynamic>> get{ModuleName}() async {
       try {
         final result = await _channel.invokeMethod<Map>('get{ModuleName}');
         return Map<String, dynamic>.from(result ?? {});
       } on PlatformException catch (e) {
         throw {ModuleName}Exception('Failed to get {module_name}: ${e.message}');
       }
     }

     /// Listen to {module_name} changes.
     static Stream<Map<String, dynamic>> get{ModuleName}Stream() {
       const eventChannel = EventChannel('{{PROJECT_SLUG}}/{module_name}/events');
       return eventChannel
           .receiveBroadcastStream()
           .map((event) => Map<String, dynamic>.from(event as Map));
     }
   }

   class {ModuleName}Exception implements Exception {
     final String message;
     const {ModuleName}Exception(this.message);

     @override
     String toString() => '{ModuleName}Exception: $message';
   }
   ```

   **`ios/Runner/{ModuleName}Plugin.swift`** — iOS implementation:
   ```swift
   import Flutter
   import UIKit

   class {ModuleName}Plugin: NSObject, FlutterPlugin {
     static func register(with registrar: FlutterPluginRegistrar) {
       let channel = FlutterMethodChannel(
         name: "{{PROJECT_SLUG}}/{module_name}",
         binaryMessenger: registrar.messenger()
       )
       let instance = {ModuleName}Plugin()
       registrar.addMethodCallDelegate(instance, channel: channel)
     }

     func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
       switch call.method {
       case "get{ModuleName}":
         // TODO: Implement native iOS logic
         result(["value": "placeholder"])
       default:
         result(FlutterMethodNotImplemented)
       }
     }
   }
   ```

   **`android/app/src/main/kotlin/.../{ModuleName}Plugin.kt`** — Android implementation:
   ```kotlin
   package {{ANDROID_PACKAGE}}

   import io.flutter.embedding.engine.plugins.FlutterPlugin
   import io.flutter.plugin.common.MethodCall
   import io.flutter.plugin.common.MethodChannel
   import io.flutter.plugin.common.MethodChannel.MethodCallHandler

   class {ModuleName}Plugin : FlutterPlugin, MethodCallHandler {
     private lateinit var channel: MethodChannel

     override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
       channel = MethodChannel(binding.binaryMessenger, "{{PROJECT_SLUG}}/{module_name}")
       channel.setMethodCallHandler(this)
     }

     override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
       when (call.method) {
         "get{ModuleName}" -> {
           // TODO: Implement native Android logic
           result.success(mapOf("value" to "placeholder"))
         }
         else -> result.notImplemented()
       }
     }

     override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
       channel.setMethodCallHandler(null)
     }
   }
   ```

   ### Federated Plugin (for reuse across projects)

   If the module will be shared across multiple apps, use the federated plugin pattern:
   ```bash
   flutter create --template=plugin --platforms=android,ios {module_name}
   ```
<!-- ENDIF -->

4. **Register the module**:

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   - Expo Module: Add to `app.json` plugins or it auto-links via `expo-module.config.json`
   - TurboModule: Run `npx react-native codegen` to generate native specs
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   - Register plugin in `ios/Runner/AppDelegate.swift`:
     ```swift
     {ModuleName}Plugin.register(with: registrar(forPlugin: "{ModuleName}Plugin")!)
     ```
   - Register plugin in `android/app/src/main/kotlin/.../MainActivity.kt`:
     ```kotlin
     flutterEngine.plugins.add({ModuleName}Plugin())
     ```
<!-- ENDIF -->

5. **Generate tests**:

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
   **`modules/$ARGUMENT/__tests__/{ModuleName}.test.ts`**:
   ```typescript
   import { get{ModuleName} } from "../index";

   // Mock the native module
   jest.mock("../src/{ModuleName}Module", () => ({
     get{ModuleName}: jest.fn().mockResolvedValue({ value: "test" }),
     addListener: jest.fn(),
   }));

   describe("{ModuleName}", () => {
     it("should return {module_name} data", async () => {
       const result = await get{ModuleName}();
       expect(result).toEqual({ value: "test" });
     });
   });
   ```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
   **`test/services/{module_name}_service_test.dart`**:
   ```dart
   import 'package:flutter/services.dart';
   import 'package:flutter_test/flutter_test.dart';
   import 'package:{{PROJECT_SLUG}}/services/{module_name}_service.dart';

   void main() {
     TestWidgetsFlutterBinding.ensureInitialized();

     const channel = MethodChannel('{{PROJECT_SLUG}}/{module_name}');

     setUp(() {
       TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
           .setMockMethodCallHandler(channel, (call) async {
         if (call.method == 'get{ModuleName}') {
           return {'value': 'test'};
         }
         return null;
       });
     });

     test('get{ModuleName} returns data', () async {
       final result = await {ModuleName}Service.get{ModuleName}();
       expect(result['value'], equals('test'));
     });
   }
   ```
<!-- ENDIF -->

6. **Run typecheck**:
   ```bash
   {{TYPE_CHECK_CMD}} 2>&1 | tail -20
   ```

7. **Output report**:

```
NATIVE MODULE GENERATED
========================
Name: {ModuleName}
Channel: {{PROJECT_SLUG}}/{module_name}

Files created:
  {list of files with paths}

Platform implementations:
  iOS:     {Swift file path} — TODO: implement native logic
  Android: {Kotlin file path} — TODO: implement native logic

Tests:     {test file path}
TypeCheck: {PASS/FAIL}

NEXT STEPS:
1. Implement the native iOS logic in {Swift file}
2. Implement the native Android logic in {Kotlin file}
3. Test on iOS simulator: {command}
4. Test on Android emulator: {command}
5. Run the generated unit test: {command}
```

## Rules

- **Check for existing packages first.** Do not reinvent the wheel. If expo-camera or camera plugin exists and is maintained, use it.
- **Channel names must match exactly.** Use `{{PROJECT_SLUG}}/{module_name}` convention and triple-check the string is identical in Dart/TS, Swift, and Kotlin.
- **Always handle PlatformException / errors.** Native code can fail. The Dart/TS layer must catch and handle gracefully.
- **Include both iOS AND Android implementations.** A native module that only works on one platform is not done.
- **Mock native modules in tests.** Never call real native code in unit tests. Use mocks that return expected values.
- **Event channels for streams.** Use MethodChannel for request/response, EventChannel for continuous data streams (sensor updates, location changes).
- **Prefer Expo Modules over TurboModules** when using Expo. Expo Modules API is simpler and auto-links.
