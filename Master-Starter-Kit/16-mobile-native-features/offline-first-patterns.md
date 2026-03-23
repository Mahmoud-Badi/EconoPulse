# Offline-First Patterns

Mobile apps operate in environments where connectivity is unreliable — elevators, subways, rural areas, airplane mode. An app that shows a blank screen or error page when the network drops feels broken. This guide covers local database options, sync strategies, conflict resolution, and network state detection for every major mobile framework.

---

## Strategy Decision Matrix

Choose your strategy based on your app's primary use case:

| App Type | Recommended Strategy | Local Storage | Sync Approach | Example |
|----------|---------------------|--------------|---------------|---------|
| News / content reader | Cache-first | SQLite or key-value | Background refresh | News apps, blogs |
| Social feed | Cache-first | SQLite | Pull-to-refresh + background | Instagram, Twitter |
| E-commerce | Online-only + cache | Key-value for cart, API cache | Cart syncs on checkout | Shopify, Amazon |
| Task / note-taking | Offline-first | SQLite (full CRUD) | Queue-based sync on reconnect | Todoist, Notion |
| Messaging | Offline-first | SQLite (full CRUD) | WebSocket + queue fallback | WhatsApp, Slack |
| Banking / finance | Online-only | Minimal cache (balances) | Always server-authoritative | Bank apps |
| Field service / forms | Offline-first | SQLite (full CRUD) | Batch sync when connected | Inspection apps |
| Maps / navigation | Cache-first | Tile cache + SQLite | Pre-download regions | Google Maps offline |

**Rule of thumb:** If your users would be frustrated by not being able to use the app for 30 seconds without internet, you need at least cache-first. If they need to create or modify data offline, you need offline-first.

---

## Local Database Options

### React Native

| Library | Type | Best For | Performance | Complexity |
|---------|------|----------|-------------|------------|
| **MMKV** | Key-value | Settings, tokens, small state | Fastest (C++ JSI) | Low |
| **expo-sqlite** | SQLite | Simple relational data | Good | Low-Medium |
| **WatermelonDB** | SQLite (lazy) | Complex apps with large datasets | Excellent (lazy loading) | High |
| **Realm** | Object DB | Cross-platform sync (MongoDB Atlas) | Good | Medium |

```typescript
// MMKV — blazing fast key-value storage
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Store values (synchronous — no await needed)
storage.set('user.token', 'abc123');
storage.set('user.preferences', JSON.stringify({ theme: 'dark', lang: 'en' }));
storage.set('onboarding.completed', true);

// Read values
const token = storage.getString('user.token');
const prefs = JSON.parse(storage.getString('user.preferences') ?? '{}');
const onboarded = storage.getBoolean('onboarding.completed');
```

```typescript
// expo-sqlite — simple SQLite for Expo apps
import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('myapp.db');

// Create table
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    synced INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// Insert
await db.runAsync(
  'INSERT INTO tasks (id, title) VALUES (?, ?)',
  [crypto.randomUUID(), 'Buy groceries']
);

// Query
const tasks = await db.getAllAsync<Task>('SELECT * FROM tasks WHERE synced = 0');
```

```typescript
// WatermelonDB — for complex apps with 10k+ records
// Lazy loads records (only fetches from DB when accessed)
import { Database, Model, Q } from '@nozbe/watermelondb';
import { field, text, date, readonly, relation } from '@nozbe/watermelondb/decorators';

class Task extends Model {
  static table = 'tasks';
  static associations = {
    projects: { type: 'belongs_to', key: 'project_id' },
  };

  @text('title') title!: string;
  @field('completed') completed!: boolean;
  @date('updated_at') updatedAt!: Date;
  @readonly @date('created_at') createdAt!: Date;
  @relation('projects', 'project_id') project!: Project;
}

// Query with reactive updates (re-renders when data changes)
const tasks = database
  .get<Task>('tasks')
  .query(Q.where('completed', false), Q.sortBy('created_at', 'desc'));
```

### Flutter

| Library | Type | Best For | Performance | Complexity |
|---------|------|----------|-------------|------------|
| **Drift** | SQLite (type-safe) | Relational data, complex queries | Excellent | Medium |
| **Hive** | NoSQL (binary) | Key-value, simple objects | Very fast | Low |
| **Isar** | NoSQL (binary) | Large datasets, full-text search | Excellent | Medium |
| **shared_preferences** | Key-value | Settings, flags | Good | Very low |

```dart
// Drift — type-safe SQLite (recommended for most Flutter apps)
import 'package:drift/drift.dart';

class Tasks extends Table {
  TextColumn get id => text()();
  TextColumn get title => text().withLength(min: 1, max: 200)();
  BoolColumn get completed => boolean().withDefault(const Constant(false))();
  BoolColumn get synced => boolean().withDefault(const Constant(false))();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [Tasks])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // Type-safe queries
  Future<List<Task>> getUnsyncedTasks() =>
      (select(tasks)..where((t) => t.synced.equals(false))).get();

  Stream<List<Task>> watchActiveTasks() =>
      (select(tasks)..where((t) => t.completed.equals(false))).watch();
}
```

```dart
// Hive — fast NoSQL for simple data
import 'package:hive_flutter/hive_flutter.dart';

await Hive.initFlutter();
Hive.registerAdapter(UserPrefsAdapter());

final prefsBox = await Hive.openBox<UserPrefs>('preferences');
prefsBox.put('current', UserPrefs(theme: 'dark', language: 'en'));

final prefs = prefsBox.get('current');
```

### Native iOS

| Library | Type | Best For | Notes |
|---------|------|----------|-------|
| **SwiftData** | Object graph (SQLite) | Modern iOS 17+ apps | Macro-based, simplest API |
| **Core Data** | Object graph (SQLite) | iOS 15+ apps, legacy codebases | Mature, complex API |
| **SQLite (direct)** | Relational | Full SQL control | Use GRDB.swift wrapper |
| **UserDefaults** | Key-value | Settings, small values | Not for large data |
| **Keychain** | Encrypted key-value | Secrets, tokens, credentials | Security-sensitive data |

```swift
// SwiftData — modern, macro-based persistence
import SwiftData

@Model
class Task {
    var id: UUID
    var title: String
    var completed: Bool
    var synced: Bool
    var updatedAt: Date

    init(title: String) {
        self.id = UUID()
        self.title = title
        self.completed = false
        self.synced = false
        self.updatedAt = Date()
    }
}

// Query
let descriptor = FetchDescriptor<Task>(
    predicate: #Predicate { !$0.completed },
    sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
)
let activeTasks = try modelContext.fetch(descriptor)
```

### Native Android

| Library | Type | Best For | Notes |
|---------|------|----------|-------|
| **Room** | SQLite (type-safe) | All relational data | Recommended by Google, compile-time verification |
| **DataStore** | Key-value / Proto | Settings, preferences | Replaces SharedPreferences |
| **SQLite (direct)** | Relational | Legacy apps | Use Room instead for new projects |

```kotlin
// Room — type-safe SQLite (recommended)
@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val title: String,
    val completed: Boolean = false,
    val synced: Boolean = false,
    @ColumnInfo(name = "updated_at") val updatedAt: Long = System.currentTimeMillis()
)

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks WHERE completed = 0 ORDER BY updated_at DESC")
    fun watchActiveTasks(): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE synced = 0")
    suspend fun getUnsyncedTasks(): List<TaskEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(task: TaskEntity)

    @Query("UPDATE tasks SET synced = 1 WHERE id = :taskId")
    suspend fun markSynced(taskId: String)
}
```

---

## Sync Strategies

### Strategy 1: Online-Only (with API Cache)

The simplest approach. All reads and writes go through the API. Cache recent responses for faster loading.

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   App    │────▶│   API    │────▶│ Database │
│          │◀────│ (server) │◀────│ (server) │
└──────────┘     └──────────┘     └──────────┘
     │
     ▼
┌──────────┐
│  Cache   │  ← TanStack Query / Dio cache
│ (memory) │  ← staleTime: 5min, gcTime: 30min
└──────────┘
```

```typescript
// React Native with TanStack Query — automatic caching
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => api.getTasks(),
  staleTime: 5 * 60 * 1000,     // Consider fresh for 5 minutes
  gcTime: 30 * 60 * 1000,       // Keep in cache for 30 minutes
  retry: 3,                      // Retry on network failure
});
```

**When to use:** Banking apps, real-time dashboards, any app where stale data is dangerous.

### Strategy 2: Cache-First

Read from local cache immediately, then refresh from the server in the background. The user sees data instantly, and it updates if the server has newer data.

```
┌──────────┐ 1. Read  ┌──────────┐
│   App    │─────────▶│  Local   │
│          │◀─────────│  Cache   │
│          │ instant  └──────────┘
│          │
│          │ 2. Fetch ┌──────────┐
│          │─────────▶│   API    │
│          │◀─────────│ (server) │
│          │ update   └──────────┘
└──────────┘
```

```typescript
// React Native: TanStack Query with persisted cache
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const mmkvPersister = createSyncStoragePersister({
  storage: {
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});

// Wrap your app
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister: mmkvPersister, maxAge: 24 * 60 * 60 * 1000 }}
>
  <App />
</PersistQueryClientProvider>
```

**When to use:** News apps, social feeds, product catalogs — anything read-heavy where stale data for a few seconds is acceptable.

### Strategy 3: Offline-First (Full Local CRUD)

All reads and writes happen against the local database. Changes are queued and synced to the server when connectivity is available. This is the most complex strategy but provides the best user experience for write-heavy apps.

```
                    ┌───────────────────┐
                    │    Sync Engine    │
                    │                   │
                    │  ┌─────────────┐  │
                    │  │ Action Queue│  │
                    │  │ (pending)   │  │
                    │  └──────┬──────┘  │
                    │         │         │
┌──────────┐  CRUD  │  ┌──────▼──────┐  │  sync   ┌──────────┐
│   App    │───────▶│  │  Local DB   │  │────────▶│   API    │
│          │◀───────│  │  (SQLite)   │  │◀────────│ (server) │
│          │        │  └─────────────┘  │         └──────────┘
└──────────┘        └───────────────────┘
```

**When to use:** Task managers, note-taking apps, field service apps, messaging — anything where users must create or modify data without internet.

---

## Queue-Based Sync (Offline-First Implementation)

The core pattern for offline-first: every write operation is recorded in a sync queue, then processed when the network is available.

```typescript
// lib/sync/sync-queue.ts
interface SyncAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;       // 'task', 'note', etc.
  entityId: string;
  payload: Record<string, any>;
  timestamp: number;
  retryCount: number;
}

class SyncQueue {
  private db: SQLiteDatabase;

  async enqueue(action: Omit<SyncAction, 'id' | 'retryCount'>): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO sync_queue (id, type, entity, entity_id, payload, timestamp, retry_count)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [
        crypto.randomUUID(),
        action.type,
        action.entity,
        action.entityId,
        JSON.stringify(action.payload),
        action.timestamp,
      ]
    );
  }

  async processQueue(): Promise<void> {
    const actions = await this.db.getAllAsync<SyncAction>(
      'SELECT * FROM sync_queue ORDER BY timestamp ASC'
    );

    for (const action of actions) {
      try {
        await this.syncAction(action);
        await this.db.runAsync('DELETE FROM sync_queue WHERE id = ?', [action.id]);
      } catch (error) {
        if (action.retryCount >= 3) {
          // Move to dead-letter queue for manual review
          await this.moveToDeadLetter(action);
        } else {
          await this.db.runAsync(
            'UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?',
            [action.id]
          );
        }
      }
    }
  }

  private async syncAction(action: SyncAction): Promise<void> {
    switch (action.type) {
      case 'CREATE':
        await api.post(`/${action.entity}`, action.payload);
        break;
      case 'UPDATE':
        await api.patch(`/${action.entity}/${action.entityId}`, action.payload);
        break;
      case 'DELETE':
        await api.delete(`/${action.entity}/${action.entityId}`);
        break;
    }
  }
}
```

```typescript
// Usage: All writes go through the sync-aware service
class TaskService {
  private db: SQLiteDatabase;
  private syncQueue: SyncQueue;

  async createTask(title: string): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      synced: false,
      updatedAt: Date.now(),
    };

    // 1. Write to local DB immediately (user sees instant result)
    await this.db.runAsync(
      'INSERT INTO tasks (id, title, completed, synced, updated_at) VALUES (?, ?, ?, ?, ?)',
      [task.id, task.title, 0, 0, task.updatedAt]
    );

    // 2. Enqueue sync action
    await this.syncQueue.enqueue({
      type: 'CREATE',
      entity: 'tasks',
      entityId: task.id,
      payload: { id: task.id, title, completed: false },
      timestamp: Date.now(),
    });

    // 3. Try to sync immediately if online
    if (await isOnline()) {
      await this.syncQueue.processQueue();
    }

    return task;
  }
}
```

---

## Conflict Resolution

When the same record is modified both locally (offline) and on the server, you have a conflict.

### Last-Write-Wins (Simplest)

Compare timestamps. The most recent write overwrites the other. Works for most consumer apps.

```typescript
function resolveConflict(local: Record, server: Record): Record {
  return local.updatedAt > server.updatedAt ? local : server;
}
```

**Pros:** Simple, deterministic.
**Cons:** Data loss if both changes are meaningful.

### Server-Wins (Safest)

The server version always wins. The client re-downloads the latest state after syncing.

```typescript
async function syncWithServerWins(localChanges: Record[]): Promise<void> {
  for (const change of localChanges) {
    try {
      await api.put(`/records/${change.id}`, change);
    } catch (error) {
      if (error.status === 409) {
        // Conflict: server has a newer version. Accept server's version.
        const serverVersion = await api.get(`/records/${change.id}`);
        await localDb.upsert(serverVersion);
      }
    }
  }
}
```

**Pros:** No data corruption, server is always authoritative.
**Cons:** User's offline changes can be lost silently.

### Manual Merge (Show Conflict UI)

When a conflict is detected, show both versions to the user and let them choose.

```typescript
interface ConflictResolution {
  recordId: string;
  localVersion: Record;
  serverVersion: Record;
}

// In your UI
function ConflictResolver({ conflict }: { conflict: ConflictResolution }) {
  return (
    <View>
      <Text>This record was modified on another device. Which version do you want to keep?</Text>
      <View style={styles.comparison}>
        <ConflictCard label="Your version" record={conflict.localVersion} />
        <ConflictCard label="Server version" record={conflict.serverVersion} />
      </View>
      <Button title="Keep Mine" onPress={() => resolveWith(conflict.localVersion)} />
      <Button title="Keep Server" onPress={() => resolveWith(conflict.serverVersion)} />
      <Button title="Keep Both" onPress={() => duplicateAndResolve(conflict)} />
    </View>
  );
}
```

**Pros:** No silent data loss.
**Cons:** Interrupts user flow. Only appropriate for high-value data (documents, notes).

### Operational Transform (Collaborative Editing)

For real-time collaborative editing where multiple users edit the same document simultaneously. Uses CRDTs or OT algorithms to merge concurrent edits.

**Libraries:** Yjs, Automerge, ShareDB

**When to use:** Google Docs-style collaboration. Overkill for 99% of mobile apps. If you need this, use a purpose-built library rather than rolling your own.

---

## Network State Detection

### React Native

```typescript
import NetInfo from '@react-native-community/netinfo';

// Check current state
const state = await NetInfo.fetch();
console.log('Connected:', state.isConnected);
console.log('Type:', state.type); // wifi, cellular, none

// Subscribe to changes
const unsubscribe = NetInfo.addEventListener((state) => {
  if (state.isConnected && state.isInternetReachable) {
    // Back online — process sync queue
    syncQueue.processQueue();
  }
});

// Custom hook
function useNetworkState() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
    return unsubscribe;
  }, []);

  return isOnline;
}
```

### Flutter

```dart
import 'package:connectivity_plus/connectivity_plus.dart';

// Check current state
final result = await Connectivity().checkConnectivity();
final isOnline = result != ConnectivityResult.none;

// Subscribe to changes
final subscription = Connectivity().onConnectivityChanged.listen((result) {
  if (result != ConnectivityResult.none) {
    syncService.processQueue();
  }
});

// Don't forget to cancel in dispose()
subscription.cancel();
```

### Native iOS

```swift
import Network

let monitor = NWPathMonitor()
monitor.pathUpdateHandler = { path in
    if path.status == .satisfied {
        // Online — trigger sync
        SyncService.shared.processQueue()
    }
    // Check connection type
    let isWiFi = path.usesInterfaceType(.wifi)
    let isCellular = path.usesInterfaceType(.cellular)
}
monitor.start(queue: DispatchQueue.global())
```

### Native Android

```kotlin
val connectivityManager = getSystemService(ConnectivityManager::class.java)

// Check current state
val network = connectivityManager.activeNetwork
val capabilities = connectivityManager.getNetworkCapabilities(network)
val isOnline = capabilities?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true

// Listen for changes
val callback = object : ConnectivityManager.NetworkCallback() {
    override fun onAvailable(network: Network) {
        // Online — trigger sync
        syncService.processQueue()
    }
    override fun onLost(network: Network) {
        // Offline
    }
}
connectivityManager.registerDefaultNetworkCallback(callback)
```

---

## Data Flow Diagram: Offline-First Complete Cycle

```
USER ACTION (create/update/delete)
         │
         ▼
┌─────────────────┐
│  Write to Local  │  ← Instant, no network needed
│     Database     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enqueue Sync    │  ← Record the action with timestamp
│     Action       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    No
│   Is Online?     │────────┐
└────────┬────────┘         │
         │ Yes              │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│ Process Queue    │  │ Wait for     │
│ (send to server)│  │ connectivity │
└────────┬────────┘  │ event        │
         │           └──────┬───────┘
         ▼                  │
┌─────────────────┐         │
│  Server Response │◀───────┘
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
  Success   Conflict
    │         │
    ▼         ▼
┌────────┐ ┌──────────────┐
│ Mark   │ │  Resolve     │
│ synced │ │  (LWW/       │
│        │ │  server-wins/ │
│        │ │  manual)     │
└────────┘ └──────────────┘
```

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Using `AsyncStorage` for large datasets | Slow reads, app freezes, 6MB limit on Android | Use SQLite (expo-sqlite, WatermelonDB) or MMKV |
| Not handling migration between schema versions | App crashes after update | Use versioned migrations (Drift, Room, WatermelonDB all support this) |
| Syncing entire database on reconnect | Slow sync, wasted bandwidth | Only sync records with `synced = false` |
| Trusting `isConnected` alone | Some networks return `isConnected: true` but have no internet | Also check `isInternetReachable` (React Native) or ping a health endpoint |
| No offline indicator in the UI | User doesn't know their changes aren't synced | Show a banner: "You're offline. Changes will sync when you reconnect." |
| Ignoring sync queue order | Dependent operations fail (delete before create) | Process queue in FIFO order by timestamp |
| No dead-letter queue for permanent failures | Sync queue grows forever | After N retries, move to dead-letter queue and notify user |
