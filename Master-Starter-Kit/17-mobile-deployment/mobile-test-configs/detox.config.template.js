// =============================================================================
// Detox Configuration Template for React Native Projects
// =============================================================================
//
// This file configures Detox, a gray-box end-to-end testing framework for
// React Native. "Gray-box" means Detox understands the app's internal state --
// it waits for animations to finish, network requests to complete, and the JS
// thread to idle before interacting with elements. This eliminates flaky
// sleep-based waits.
//
// Setup:
//   npm install --save-dev detox jest @types/detox
//   npx detox init
//
// Replace all {{PLACEHOLDERS}} with your project values.
//
// Usage:
//   npx detox build --configuration ios.sim.debug
//   npx detox test --configuration ios.sim.debug
//
// =============================================================================

// <!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->

/** @type {import('detox').DetoxConfig} */
module.exports = {
  // ---------------------------------------------------------------------------
  // Test Runner Configuration
  // ---------------------------------------------------------------------------
  // Detox delegates test execution to Jest. This section configures how Jest
  // runs your e2e test files.
  testRunner: {
    args: {
      // The test runner binary -- Jest in this case
      $0: 'jest',
      // Path to Jest config specific to e2e tests (not your unit test config)
      config: 'e2e/jest.config.js',
    },
    jest: {
      // Maximum time (ms) to wait for the test runner to start.
      // Increase if your CI is slow to boot simulators.
      setupTimeout: 120000,
    },
  },

  // ---------------------------------------------------------------------------
  // App Configurations
  // ---------------------------------------------------------------------------
  // Define how to build and locate the app binary for each platform and
  // build type. Detox needs the built binary to install on the simulator
  // or emulator.
  apps: {
    // --- iOS Debug ---
    // Used during development. Faster builds, includes React Native dev tools.
    'ios.debug': {
      type: 'ios.app',
      // Path to the built .app file. This matches Xcode's default output
      // location when using -derivedDataPath.
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/{{PROJECT_SLUG}}.app',
      // The xcodebuild command to produce the binary.
      // -workspace: your Xcode workspace (created by CocoaPods)
      // -scheme: usually matches your project name
      // -sdk iphonesimulator: build for simulator, not device
      // -derivedDataPath: output location (keeps it predictable for CI)
      build:
        'xcodebuild -workspace ios/{{PROJECT_SLUG}}.xcworkspace -scheme {{PROJECT_SLUG}} -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },

    // --- iOS Release ---
    // Used in CI for realistic testing. Production-like build without dev tools.
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/{{PROJECT_SLUG}}.app',
      build:
        'xcodebuild -workspace ios/{{PROJECT_SLUG}}.xcworkspace -scheme {{PROJECT_SLUG}} -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },

    // --- Android Debug ---
    // Used during development. Includes debug bridge, allows hot reload.
    'android.debug': {
      type: 'android.apk',
      // Path to the debug APK produced by Gradle
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      // Build both the app APK and the test APK (required for Detox instrumentation)
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      // Forward port 8081 from emulator to host so Metro bundler is accessible.
      // Remove this if using a pre-bundled (release) build.
      reversePorts: [8081],
    },

    // --- Android Release ---
    // Used in CI for realistic testing. No dev tools, ProGuard/R8 enabled.
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },

  // ---------------------------------------------------------------------------
  // Device Configurations
  // ---------------------------------------------------------------------------
  // Define which simulators and emulators Detox should use. These must be
  // pre-installed on the machine running the tests.
  devices: {
    // iOS Simulator -- make sure this device type is installed in Xcode.
    // Check available simulators: xcrun simctl list devicetypes
    simulator: {
      type: 'ios.simulator',
      device: {
        // Use a recent iPhone model. Detox will find or create a simulator
        // matching this type.
        type: 'iPhone 15 Pro',
      },
    },

    // Android Emulator -- must match an AVD created in Android Studio.
    // Create one: Android Studio > Device Manager > Create Device
    // Or via CLI: avdmanager create avd -n Pixel_7_API_34 -k "system-images;android-34;google_apis;x86_64"
    emulator: {
      type: 'android.emulator',
      device: {
        // Must match exactly the AVD name in your Android emulator list.
        // Check available AVDs: emulator -list-avds
        avdName: 'Pixel_7_API_34',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Test Configurations
  // ---------------------------------------------------------------------------
  // Combine a device with an app to create a runnable test configuration.
  // These are the values you pass to --configuration in the CLI.
  configurations: {
    // Development testing on iOS Simulator
    // Usage: npx detox test --configuration ios.sim.debug
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },

    // CI testing on iOS Simulator (release build, more realistic)
    // Usage: npx detox test --configuration ios.sim.release
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },

    // Development testing on Android Emulator
    // Usage: npx detox test --configuration android.emu.debug
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },

    // CI testing on Android Emulator (release build, more realistic)
    // Usage: npx detox test --configuration android.emu.release
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },

  // ---------------------------------------------------------------------------
  // Behavior Configuration (Optional)
  // ---------------------------------------------------------------------------
  // Uncomment to customize Detox behavior globally.
  //
  // behavior: {
  //   init: {
  //     // Expire and re-install the app on every test suite init
  //     exposeGlobals: true,
  //   },
  //   cleanup: {
  //     // Shut down the simulator/emulator after tests complete
  //     shutdownDevice: false,
  //   },
  // },

  // ---------------------------------------------------------------------------
  // Artifacts Configuration (Optional)
  // ---------------------------------------------------------------------------
  // Uncomment to capture screenshots and videos on test failure.
  // Useful for debugging CI failures.
  //
  // artifacts: {
  //   rootDir: 'e2e/artifacts',
  //   plugins: {
  //     screenshot: {
  //       shouldTakeAutomaticSnapshots: true,
  //       keepOnlyFailedTestsArtifacts: true,
  //       takeWhen: {
  //         testStart: false,
  //         testDone: true,
  //       },
  //     },
  //     video: {
  //       android: {
  //         bitRate: 4000000,
  //       },
  //       simulator: {
  //         codec: 'hevc',
  //       },
  //     },
  //     log: {
  //       enabled: true,
  //     },
  //   },
  // },
};

// <!-- ENDIF -->
