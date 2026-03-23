# Mobile State Management

## Purpose

State management on mobile follows the same architecture as web: **API client -> state layer -> UI**. The tools change per framework, but the pattern is universal. This guide covers the recommended state management stack for each framework, including client state, server state (cache), and persistence.

---

## The Universal Pattern

Regardless of framework, every mobile app has three state categories:

| Category | What It Holds | Lifecycle | Example |
|----------|--------------|-----------|---------|
| **Server state** | Data fetched from the API | Cached, refetched on stale | User list, order details, search results |
| **Client state** | UI state not from the server | Ephemeral or session-scoped | Selected tab, modal open/closed, form draft |
| **Persisted state** | State that survives app restart | Permanent until cleared | Auth tokens, user preferences, onboarding status |

The mistake most mobile apps make: putting everything in one global store. This leads to stale data, unnecessary re-renders, and complex synchronization bugs.

**Rule:** Server state belongs in a server cache (TanStack Query, Riverpod AsyncNotifier, etc.). Client state belongs in a lightweight store (Zustand, @State, StateFlow). Persisted state belongs in secure/encrypted storage.

---

## React Native: Zustand + TanStack Query

### Why This Stack

- **Zustand** — Same library you use on the web. Stores can be shared via monorepo packages if they contain only client state.
- **TanStack Query** — Same library you use on the web. Handles caching, refetching, pagination, optimistic updates.
- **MMKV** — Fast, synchronous key-value storage (replaces AsyncStorage for performance).
- **SecureStore** — Encrypted storage for auth tokens (Expo SecureStore or react-native-keychain).

### Client State: Zustand

```typescript
// stores/useAuthStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "@/lib/storage";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

```typescript
// stores/useUIStore.ts
import { create } from "zustand";

interface UIState {
  isFilterOpen: boolean;
  selectedTab: string;
  toggleFilter: () => void;
  setTab: (tab: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isFilterOpen: false,
  selectedTab: "home",
  toggleFilter: () => set((s) => ({ isFilterOpen: !s.isFilterOpen })),
  setTab: (tab) => set({ selectedTab: tab }),
}));
```

### Server State: TanStack Query

```typescript
// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Fetch list
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => api.orders.list(filters),
    staleTime: 30_000, // 30 seconds before refetch
  });
}

// Fetch single
export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => api.orders.get(id),
    enabled: !!id,
  });
}

// Create mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => api.orders.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
```

### Persistence: MMKV

```typescript
// lib/storage.ts
import { MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

const storage = new MMKV();

// Zustand-compatible storage adapter
export const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.delete(name),
};

// Direct helpers
export const appStorage = {
  get: <T>(key: string): T | null => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },
  set: <T>(key: string, value: T) => {
    storage.set(key, JSON.stringify(value));
  },
  remove: (key: string) => storage.delete(key),
  clear: () => storage.clearAll(),
};
```

### Secure Token Storage

```typescript
// lib/auth.ts
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const REFRESH_KEY = "refresh_token";

export const tokenStorage = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_KEY),
  setRefreshToken: (token: string) => SecureStore.setItemAsync(REFRESH_KEY, token),
  clear: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};
```

### Sharing Stores with Web

If a Zustand store contains **only client state** (no platform-specific imports), it can live in a shared monorepo package:

```typescript
// packages/shared-stores/src/useCartStore.ts
import { create } from "zustand";

// This store has no React Native or web-specific imports
// It can be imported by both apps/web and apps/mobile
export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}));
```

**Cannot share:** Persisted stores (web uses localStorage, mobile uses MMKV — different storage backends).

---

## Flutter: Riverpod

### Why This Stack

- **Riverpod** — Compile-safe, testable, supports async state out of the box. The recommended state management for Flutter.
- **AsyncNotifier** — Built into Riverpod for managing API call state (loading, data, error).
- **SharedPreferences** — Simple key-value persistence.
- **Hive** — Fast, lightweight NoSQL database for structured offline data.
- **flutter_secure_storage** — Encrypted storage for tokens.

### Client State: Riverpod StateProvider / NotifierProvider

```dart
// providers/theme_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

// providers/ui_provider.dart
final isFilterOpenProvider = StateProvider<bool>((ref) => false);
final selectedTabProvider = StateProvider<int>((ref) => 0);
```

### Server State: AsyncNotifierProvider

```dart
// providers/orders_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/order.dart';
import '../services/order_service.dart';

// Service provider
final orderServiceProvider = Provider<OrderService>((ref) {
  final dio = ref.watch(dioProvider);
  return OrderService(dio);
});

// Order list provider (with automatic caching)
final ordersProvider = FutureProvider.autoDispose
    .family<List<Order>, OrderFilters?>((ref, filters) async {
  final service = ref.watch(orderServiceProvider);
  return service.getOrders(filters: filters);
});

// Single order provider
final orderProvider = FutureProvider.autoDispose
    .family<Order, String>((ref, id) async {
  final service = ref.watch(orderServiceProvider);
  return service.getOrder(id);
});

// Mutation with AsyncNotifier
class CreateOrderNotifier extends AsyncNotifier<Order?> {
  @override
  Future<Order?> build() async => null;

  Future<void> create(CreateOrderInput input) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final service = ref.read(orderServiceProvider);
      final order = await service.createOrder(input);
      // Invalidate the orders list cache
      ref.invalidate(ordersProvider);
      return order;
    });
  }
}

final createOrderProvider =
    AsyncNotifierProvider<CreateOrderNotifier, Order?>(
  CreateOrderNotifier.new,
);
```

### Using in UI

```dart
// screens/orders/order_list_screen.dart
class OrderListScreen extends ConsumerWidget {
  const OrderListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(ordersProvider(null));

    return ordersAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => ErrorWidget(
        message: error.toString(),
        onRetry: () => ref.invalidate(ordersProvider),
      ),
      data: (orders) => RefreshIndicator(
        onRefresh: () async => ref.invalidate(ordersProvider),
        child: ListView.builder(
          itemCount: orders.length,
          itemBuilder: (context, index) => OrderCard(order: orders[index]),
        ),
      ),
    );
  }
}
```

### Persistence: SharedPreferences + Hive

```dart
// services/storage_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('Must be overridden in ProviderScope');
});

// Initialize in main.dart:
// final prefs = await SharedPreferences.getInstance();
// runApp(ProviderScope(
//   overrides: [sharedPreferencesProvider.overrideWithValue(prefs)],
//   child: const App(),
// ));

class StorageService {
  final SharedPreferences _prefs;
  StorageService(this._prefs);

  bool get hasCompletedOnboarding =>
      _prefs.getBool('onboarding_complete') ?? false;

  Future<void> setOnboardingComplete() =>
      _prefs.setBool('onboarding_complete', true);

  String? get lastSelectedFilter => _prefs.getString('last_filter');

  Future<void> setLastSelectedFilter(String filter) =>
      _prefs.setString('last_filter', filter);
}

final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService(ref.watch(sharedPreferencesProvider));
});
```

### Secure Token Storage

```dart
// services/auth_service.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'auth_token';
  static const _refreshKey = 'refresh_token';

  static Future<String?> getToken() => _storage.read(key: _tokenKey);
  static Future<void> setToken(String token) =>
      _storage.write(key: _tokenKey, value: token);
  static Future<String?> getRefreshToken() => _storage.read(key: _refreshKey);
  static Future<void> setRefreshToken(String token) =>
      _storage.write(key: _refreshKey, value: token);
  static Future<void> clear() => _storage.deleteAll();
}
```

---

## Native iOS: SwiftUI @Observable + Combine

### Why This Stack

- **@Observable** (iOS 17+) — Replaces `ObservableObject`. Simpler, more performant observation.
- **@State / @Environment** — Built-in SwiftUI state primitives. No external library needed.
- **async/await** — Swift concurrency for API calls. No need for Combine in most cases.
- **UserDefaults** — Simple persistence.
- **SwiftData** — Apple's persistence framework (replaces Core Data for new projects).
- **Keychain** — Encrypted token storage.

### Client State: @Observable ViewModel

```swift
// ViewModels/AuthViewModel.swift
import SwiftUI

@Observable
class AuthViewModel {
    var user: User?
    var isAuthenticated: Bool { user != nil }
    var isLoading = false
    var error: String?

    private let authService: AuthService
    private let keychainService: KeychainService

    init(authService: AuthService = .shared, keychainService: KeychainService = .shared) {
        self.authService = authService
        self.keychainService = keychainService
    }

    func login(email: String, password: String) async {
        isLoading = true
        error = nil
        defer { isLoading = false }

        do {
            let response = try await authService.login(email: email, password: password)
            keychainService.setToken(response.token)
            user = response.user
        } catch {
            self.error = error.localizedDescription
        }
    }

    func logout() {
        keychainService.clearTokens()
        user = nil
    }

    func checkExistingSession() async {
        guard let token = keychainService.getToken() else { return }
        do {
            user = try await authService.getMe(token: token)
        } catch {
            keychainService.clearTokens()
        }
    }
}
```

### Server State: ViewModel with async/await

```swift
// Views/Orders/OrderViewModel.swift
import SwiftUI

@Observable
class OrderViewModel {
    var orders: [Order] = []
    var selectedOrder: Order?
    var isLoading = false
    var error: String?

    private let orderService: OrderService

    init(orderService: OrderService = .shared) {
        self.orderService = orderService
    }

    func fetchOrders() async {
        isLoading = true
        error = nil
        defer { isLoading = false }

        do {
            orders = try await orderService.list()
        } catch {
            self.error = error.localizedDescription
        }
    }

    func fetchOrder(id: String) async {
        isLoading = true
        error = nil
        defer { isLoading = false }

        do {
            selectedOrder = try await orderService.get(id: id)
        } catch {
            self.error = error.localizedDescription
        }
    }

    func createOrder(_ input: CreateOrderInput) async -> Bool {
        isLoading = true
        error = nil
        defer { isLoading = false }

        do {
            let newOrder = try await orderService.create(input)
            orders.insert(newOrder, at: 0)
            return true
        } catch {
            self.error = error.localizedDescription
            return false
        }
    }
}
```

### Using in SwiftUI Views

```swift
// Views/Orders/OrderListView.swift
struct OrderListView: View {
    @State private var viewModel = OrderViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading && viewModel.orders.isEmpty {
                ProgressView()
            } else if let error = viewModel.error, viewModel.orders.isEmpty {
                ErrorView(message: error, onRetry: {
                    Task { await viewModel.fetchOrders() }
                })
            } else {
                List(viewModel.orders) { order in
                    NavigationLink(value: Route.orderDetail(id: order.id)) {
                        OrderCardView(order: order)
                    }
                }
                .refreshable {
                    await viewModel.fetchOrders()
                }
            }
        }
        .task {
            await viewModel.fetchOrders()
        }
    }
}
```

### Persistence: UserDefaults + SwiftData

```swift
// Services/UserDefaultsService.swift
class UserDefaultsService {
    static let shared = UserDefaultsService()
    private let defaults = UserDefaults.standard

    var hasCompletedOnboarding: Bool {
        get { defaults.bool(forKey: "onboarding_complete") }
        set { defaults.set(newValue, forKey: "onboarding_complete") }
    }

    var lastSelectedFilter: String? {
        get { defaults.string(forKey: "last_filter") }
        set { defaults.set(newValue, forKey: "last_filter") }
    }
}
```

---

## Native Android: ViewModel + StateFlow + Hilt

### Why This Stack

- **ViewModel** — Survives configuration changes (rotation). The standard Android lifecycle-aware state holder.
- **StateFlow** — Kotlin coroutine-based reactive state. Integrates with Compose via `collectAsStateWithLifecycle()`.
- **Hilt** — Dependency injection. Simplifies providing repositories, API clients, and use cases to ViewModels.
- **DataStore** — Modern replacement for SharedPreferences (type-safe, coroutine-based).
- **EncryptedSharedPreferences** — Secure token storage.

### Client State: ViewModel + StateFlow

```kotlin
// ui/screens/auth/LoginViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LoginUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val isAuthenticated: Boolean = false,
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState = _uiState.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                authRepository.login(email, password)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isAuthenticated = true,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message,
                )
            }
        }
    }
}
```

### Server State: ViewModel + Repository

```kotlin
// ui/screens/orders/OrderViewModel.kt
data class OrderListUiState(
    val orders: List<Order> = emptyList(),
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val error: String? = null,
)

@HiltViewModel
class OrderViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(OrderListUiState())
    val uiState = _uiState.asStateFlow()

    init {
        fetchOrders()
    }

    fun fetchOrders() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val orders = orderRepository.getOrders()
                _uiState.value = _uiState.value.copy(
                    orders = orders,
                    isLoading = false,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message,
                )
            }
        }
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isRefreshing = true)
            try {
                val orders = orderRepository.getOrders()
                _uiState.value = _uiState.value.copy(
                    orders = orders,
                    isRefreshing = false,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isRefreshing = false,
                    error = e.message,
                )
            }
        }
    }
}
```

### Using in Compose

```kotlin
// ui/screens/orders/OrderListScreen.kt
@Composable
fun OrderListScreen(
    viewModel: OrderViewModel = hiltViewModel(),
    onNavigateToDetail: (String) -> Unit,
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when {
        uiState.isLoading && uiState.orders.isEmpty() -> {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        uiState.error != null && uiState.orders.isEmpty() -> {
            ErrorCard(
                message = uiState.error!!,
                onRetry = { viewModel.fetchOrders() },
            )
        }
        else -> {
            val pullRefreshState = rememberPullToRefreshState()
            PullToRefreshBox(
                isRefreshing = uiState.isRefreshing,
                onRefresh = { viewModel.refresh() },
                state = pullRefreshState,
            ) {
                LazyColumn {
                    items(uiState.orders) { order ->
                        OrderCard(
                            order = order,
                            onClick = { onNavigateToDetail(order.id) },
                        )
                    }
                }
            }
        }
    }
}
```

### Persistence: DataStore

```kotlin
// data/local/DataStoreManager.kt
import androidx.datastore.preferences.core.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DataStoreManager @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) {
    companion object {
        val ONBOARDING_COMPLETE = booleanPreferencesKey("onboarding_complete")
        val LAST_FILTER = stringPreferencesKey("last_filter")
    }

    val hasCompletedOnboarding: Flow<Boolean> = dataStore.data
        .map { it[ONBOARDING_COMPLETE] ?: false }

    suspend fun setOnboardingComplete() {
        dataStore.edit { it[ONBOARDING_COMPLETE] = true }
    }

    val lastSelectedFilter: Flow<String?> = dataStore.data
        .map { it[LAST_FILTER] }

    suspend fun setLastSelectedFilter(filter: String) {
        dataStore.edit { it[LAST_FILTER] = filter }
    }
}
```

### Secure Token Storage

```kotlin
// data/local/TokenManager.kt
import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext context: Context,
) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
    )

    fun getToken(): String? = prefs.getString("auth_token", null)
    fun setToken(token: String) = prefs.edit().putString("auth_token", token).apply()
    fun getRefreshToken(): String? = prefs.getString("refresh_token", null)
    fun setRefreshToken(token: String) = prefs.edit().putString("refresh_token", token).apply()
    fun clear() = prefs.edit().clear().apply()
}
```

---

## State Architecture Summary

| Layer | React Native | Flutter | iOS (SwiftUI) | Android (Compose) |
|-------|-------------|---------|---------------|-------------------|
| **Client state** | Zustand | Riverpod StateProvider | @Observable / @State | ViewModel + StateFlow |
| **Server state** | TanStack Query | Riverpod FutureProvider | ViewModel + async/await | ViewModel + Repository |
| **Persistence** | MMKV | SharedPreferences / Hive | UserDefaults / SwiftData | DataStore |
| **Secure storage** | Expo SecureStore | flutter_secure_storage | Keychain | EncryptedSharedPreferences |
| **DI** | Not needed (Zustand) | Riverpod (built-in) | @Environment | Hilt |
| **Reactive updates** | React re-renders | Riverpod watch/listen | SwiftUI observation | StateFlow + collectAsState |
