# React Native Gotchas

React Native and Expo gotchas discovered during mobile development. Every item here cost real debugging time.

---

## Expo Managed vs Bare Workflow

### Managed Workflow Limitations

Expo managed workflow cannot use native modules that are not in the Expo SDK. If you need a native module that is not supported (e.g., Bluetooth LE, NFC, custom camera processing), you must either:

1. Use a development build (`npx expo prebuild`) which gives you native project files
2. Create a custom Expo config plugin
3. Switch to bare workflow

**Symptom:** `npx expo install some-native-package` succeeds, but the app crashes at runtime with "Module not found" or "undefined is not an object."
**Fix:** Check the Expo SDK compatibility list. If the module is not listed, you need a development build or bare workflow.

---

### Development Builds Are Not Optional for Production Apps

The Expo Go app is great for prototyping but cannot be used for production. It does not support:
- Custom native modules
- Push notification tokens (you get Expo push tokens, not FCM/APNs tokens)
- Custom app icons or splash screens
- App store submission

**Symptom:** Features work in Expo Go but break in standalone builds.
**Fix:** Switch to development builds early. Run `npx expo prebuild` and use `eas build --profile development` for daily development.

---

## Metro Bundler Monorepo Resolution

### watchFolders Must Include All Shared Packages

In a monorepo, Metro does not know about packages outside `apps/mobile/`. You must configure `watchFolders` in `metro.config.js` to include shared packages.

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
```

**Symptom:** `Unable to resolve module @myapp/types` or `Unable to resolve module @myapp/validators` at build time.
**Fix:** Add `watchFolders` and `nodeModulesPaths` pointing to the monorepo root.

---

### pnpm Hoisting Breaks Metro Resolution

pnpm uses a content-addressable store with symlinks, which Metro does not follow by default. You need either:

1. Set `node-linker=hoisted` in `.npmrc` (simplest but loses pnpm strictness)
2. Configure Metro's `resolver.unstable_enablePackageExports` and symlink resolution

**Symptom:** Metro fails to find packages that are clearly installed. Error messages reference `.pnpm/` paths.
**Fix:** Add `node-linker=hoisted` to `.npmrc` for the mobile workspace, or configure Metro's resolver.

---

## EAS Build

### Build Context in Monorepo

EAS Build uploads your entire monorepo by default. This can be slow (large upload) and may fail if your `.easignore` is not configured properly.

```
# .easignore (at monorepo root)
apps/web/
apps/api/
*.md
docs/
dev_docs/
```

**Symptom:** EAS builds take 10+ minutes to upload, or fail with "file too large."
**Fix:** Create `.easignore` at the project root to exclude non-mobile directories.

---

### EAS Build Environment Variables

EAS Build does not read your `.env` file. Environment variables must be set via:
1. `eas.json` env section (for non-secret values)
2. EAS Secrets (for API keys, auth tokens)
3. `app.config.ts` with `process.env` (evaluated at build time)

```json
// eas.json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.myapp.com"
      }
    }
  }
}
```

**Symptom:** API calls fail in EAS builds but work locally. `process.env.API_URL` is `undefined` in the built app.
**Fix:** Set all env vars in `eas.json` or EAS Secrets. Use `app.config.ts` to inject them into the Expo config.

---

## Hermes Engine

### Hermes Is the Default (and You Want It)

Hermes is the default JavaScript engine in React Native 0.70+ and Expo SDK 48+. It provides faster startup, lower memory usage, and better performance. Do NOT disable it unless you have a specific reason.

**Symptom:** Rare — some older npm packages use JavaScript features not supported by Hermes (e.g., `with` statement, certain Proxy patterns).
**Fix:** Check the Hermes compatibility table. Replace incompatible packages or add Babel transforms.

---

### Hermes Bytecode Caching

Hermes precompiles JavaScript to bytecode during build. This means:
- Build times are slightly longer (compilation step)
- Runtime startup is significantly faster
- `eval()` and `new Function()` are disabled by default (security improvement)

**Symptom:** Code using `eval()` or `new Function()` crashes at runtime.
**Fix:** Refactor to avoid dynamic code evaluation. This is a security improvement, not a bug.

---

## New Architecture (Fabric + TurboModules)

### Migration Is Not Required Yet (But Coming)

The New Architecture (Fabric renderer + TurboModules) is opt-in in Expo SDK 51+ and will become the default soon. Key changes:
- Fabric: new rendering system, replaces the bridge with JSI (JavaScript Interface)
- TurboModules: lazy-loaded native modules, typed interfaces

**Symptom:** Some third-party native modules crash or behave differently with the New Architecture enabled.
**Fix:** Check the React Native Directory (reactnative.directory) for New Architecture compatibility before enabling. Test thoroughly on both platforms.

---

### Bridge vs Bridgeless Mode

The old bridge (JSON serialization between JS and native) is being replaced by JSI (direct memory access). During transition:
- Some libraries support only bridge mode
- Some libraries support only bridgeless mode
- Some support both

**Symptom:** App crashes on startup with "Bridge module not found" or "TurboModule not found."
**Fix:** Check each native dependency for New Architecture support. Use `react-native-new-architecture` compatibility tracker.

---

## Expo Router

### File-Based Routing Naming Conventions

Expo Router uses file-system-based routing similar to Next.js. Common mistakes:

```
app/
  (tabs)/           ← Layout group (parentheses = not in URL)
    _layout.tsx     ← Tab navigator definition
    index.tsx       ← matches /
    profile.tsx     ← matches /profile
  (auth)/           ← Layout group for auth screens
    login.tsx       ← matches /login
  [id].tsx          ← Dynamic route: matches /123, /abc
  [...rest].tsx     ← Catch-all route
  +not-found.tsx    ← 404 page (plus sign = special file)
  _layout.tsx       ← Root layout
```

**Symptom:** Routes do not match, screens render in the wrong navigator, or 404 errors.
**Fix:** Follow Expo Router naming conventions exactly. Parentheses for groups, brackets for dynamic segments, underscore for layouts, plus for special files.

---

### Deep Links Require Scheme Configuration

Deep links do not work unless you configure the URL scheme in `app.json`:

```json
{
  "expo": {
    "scheme": "myapp",
    "plugins": [
      ["expo-router", {
        "origin": "https://myapp.com"
      }]
    ]
  }
}
```

**Symptom:** Deep links open the app but navigate to the wrong screen or the home screen.
**Fix:** Configure both `scheme` (for `myapp://` links) and `origin` (for universal links) in `app.json`.

---

## React Native Reanimated

### Worklet Thread Is Separate from JS Thread

Reanimated animations run on a separate worklet thread. You cannot access JavaScript closures, state, or context from worklets.

```typescript
// WRONG — JS variable not accessible in worklet
const [count, setCount] = useState(0);
const animatedStyle = useAnimatedStyle(() => {
  return { opacity: count > 0 ? 1 : 0.5 }; // count is always 0 in worklet
});

// CORRECT — use shared values
const count = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => {
  return { opacity: count.value > 0 ? 1 : 0.5 };
});
```

**Symptom:** Animated values do not update, or animations are stuck at initial values.
**Fix:** Use `useSharedValue` for any value that needs to be accessed in animation worklets. Use `useDerivedValue` for computed animation values.

---

## General React Native Gotchas

### FlatList Performance: keyExtractor and getItemLayout

FlatList without `keyExtractor` and `getItemLayout` performs poorly with large lists:

```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}      // Required for efficient updates
  getItemLayout={(_, index) => ({       // Enables scroll-to-index and reduces layout calc
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  renderItem={renderItem}
  initialNumToRender={10}               // Don't render all items upfront
  maxToRenderPerBatch={10}              // Control batch size
  windowSize={5}                         // Reduce off-screen rendering
/>
```

**Symptom:** Scrolling is janky, items flash or re-render unnecessarily, "VirtualizedList" warnings.
**Fix:** Always provide `keyExtractor`. Provide `getItemLayout` when items have fixed height. Tune rendering parameters.

---

### Platform-Specific File Extensions

React Native resolves `Component.ios.tsx` and `Component.android.tsx` automatically:

```
components/
  Button.tsx          ← shared implementation
  DatePicker.ios.tsx  ← iOS-specific
  DatePicker.android.tsx ← Android-specific
  DatePicker.tsx      ← fallback (optional)
```

**Symptom:** You want different implementations per platform but are using `Platform.OS` conditionals everywhere.
**Fix:** Use platform-specific file extensions. Metro resolves them automatically based on the build target.
