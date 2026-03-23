<!-- CONDITIONAL: Generate only if {{HAS_MOBILE}} == "true" AND {{HAS_OFFLINE}} == "true" -->

# Mobile Offline Sync — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

---

```mermaid
flowchart TB
    subgraph LOCAL["Local Device Storage"]
        LS_1["{{LOCAL_STORE_1_NAME}}<br/>Technology: {{LOCAL_STORE_1_TECH}}<br/>Max size: {{LOCAL_STORE_1_MAX_SIZE}}"]
        LS_2["{{LOCAL_STORE_2_NAME}}<br/>Technology: {{LOCAL_STORE_2_TECH}}<br/>Max size: {{LOCAL_STORE_2_MAX_SIZE}}"]
        LS_3["{{LOCAL_STORE_3_NAME}}<br/>Technology: {{LOCAL_STORE_3_TECH}}<br/>Max size: {{LOCAL_STORE_3_MAX_SIZE}}"]
    end

    subgraph QUEUE["Operation Queue"]
        Q_HIGH["High Priority Queue<br/>{{QUEUE_HIGH_TYPES}}"]
        Q_NORMAL["Normal Priority Queue<br/>{{QUEUE_NORMAL_TYPES}}"]
        Q_LOW["Low Priority Queue<br/>{{QUEUE_LOW_TYPES}}"]
        Q_META["Queue Metadata<br/>Timestamps, retry counts,<br/>idempotency keys"]
    end

    subgraph CONFLICT["Conflict Detection"]
        VER_CHECK["Version Check<br/>Compare local vs server<br/>version vectors"]
        FIELD_DIFF["Field-Level Diff<br/>Identify changed fields<br/>per record"]
        MERGE_CHECK["Merge Feasibility<br/>Non-overlapping changes<br/>auto-merge"]
    end

    subgraph RESOLUTION["Conflict Resolution"]
        LWW["Last-Write-Wins<br/>{{LWW_DATA_TYPES}}"]
        MERGE["Auto-Merge<br/>{{MERGE_DATA_TYPES}}"]
        ESCALATE["Escalate to User<br/>{{ESCALATE_DATA_TYPES}}"]
        CUSTOM["Custom Strategy<br/>{{CUSTOM_RESOLUTION_DESC}}"]
    end

    subgraph SYNC["Server Sync Engine"]
        BATCH["Batch Uploader<br/>Max batch: {{SYNC_BATCH_SIZE}}<br/>Interval: {{SYNC_INTERVAL}}"]
        DELTA["Delta Sync<br/>Only changed fields<br/>since {{DELTA_BASELINE}}"]
        FULL["Full Sync<br/>Triggered: {{FULL_SYNC_TRIGGER}}<br/>Frequency: {{FULL_SYNC_FREQUENCY}}"]
    end

    subgraph SERVER["Server"]
        API["Sync API<br/>{{SYNC_API_ENDPOINT}}"]
        SRV_DB[("Server Database<br/>{{SERVER_DB_NAME}}")]
        SRV_QUEUE["Server Event Queue<br/>Pending pushes to device"]
    end

    subgraph CONFIRM["Confirmation & Cleanup"]
        ACK["Server Acknowledgment<br/>Per-operation ACK"]
        PURGE["Queue Purge<br/>Remove synced operations"]
        NOTIFY["UI Notification<br/>Sync status indicator"]
    end

    %% Local storage → Queue
    LS_1 -->|"offline write"| Q_HIGH
    LS_2 -->|"offline write"| Q_NORMAL
    LS_3 -->|"offline write"| Q_LOW
    Q_HIGH & Q_NORMAL & Q_LOW --> Q_META

    %% Queue → Conflict detection
    Q_META -->|"on connectivity restored"| VER_CHECK
    VER_CHECK -->|"conflict detected"| FIELD_DIFF
    VER_CHECK -->|"no conflict"| BATCH
    FIELD_DIFF --> MERGE_CHECK

    %% Conflict detection → Resolution
    MERGE_CHECK -->|"auto-mergeable"| MERGE
    MERGE_CHECK -->|"simple override"| LWW
    MERGE_CHECK -->|"user decision needed"| ESCALATE
    MERGE_CHECK -->|"domain-specific"| CUSTOM

    %% Resolution → Sync
    LWW -->|"resolved record"| BATCH
    MERGE -->|"merged record"| BATCH
    ESCALATE -->|"user-resolved record"| BATCH
    CUSTOM -->|"resolved record"| BATCH
    DELTA -->|"delta payload"| API
    BATCH -->|"batch payload"| API
    FULL -->|"full snapshot"| API

    %% Server processing
    API -->|"persist"| SRV_DB
    SRV_DB -->|"server changes"| SRV_QUEUE
    SRV_QUEUE -->|"push to device"| DELTA

    %% Confirmation
    API -->|"ACK"| ACK
    ACK -->|"mark synced"| PURGE
    PURGE -->|"update UI"| NOTIFY
    NOTIFY -->|"clear dirty flags"| LS_1
    NOTIFY -->|"clear dirty flags"| LS_2
    NOTIFY -->|"clear dirty flags"| LS_3
```

---

## Sync Strategy by Data Type

| Data Type | Local Storage | Queue Priority | Conflict Strategy | Max Offline Duration |
|-----------|---------------|----------------|-------------------|----------------------|
| {{DATA_TYPE_1_NAME}} | {{DATA_TYPE_1_STORAGE}} | High | Last-Write-Wins | {{DATA_TYPE_1_MAX_OFFLINE}} |
| {{DATA_TYPE_2_NAME}} | {{DATA_TYPE_2_STORAGE}} | High | Auto-Merge (field-level) | {{DATA_TYPE_2_MAX_OFFLINE}} |
| {{DATA_TYPE_3_NAME}} | {{DATA_TYPE_3_STORAGE}} | Normal | Escalate to User | {{DATA_TYPE_3_MAX_OFFLINE}} |
| {{DATA_TYPE_4_NAME}} | {{DATA_TYPE_4_STORAGE}} | Normal | Auto-Merge (append-only) | {{DATA_TYPE_4_MAX_OFFLINE}} |
| {{DATA_TYPE_5_NAME}} | {{DATA_TYPE_5_STORAGE}} | Low | Last-Write-Wins | {{DATA_TYPE_5_MAX_OFFLINE}} |
| {{DATA_TYPE_6_NAME}} | {{DATA_TYPE_6_STORAGE}} | Low | {{DATA_TYPE_6_STRATEGY}} | {{DATA_TYPE_6_MAX_OFFLINE}} |

## Offline Capability Matrix

| Feature | Available Offline | Data Freshness | Sync Behavior on Reconnect |
|---------|-------------------|----------------|----------------------------|
| {{FEATURE_1_NAME}} | {{FEATURE_1_OFFLINE}} | {{FEATURE_1_FRESHNESS}} | {{FEATURE_1_RECONNECT}} |
| {{FEATURE_2_NAME}} | {{FEATURE_2_OFFLINE}} | {{FEATURE_2_FRESHNESS}} | {{FEATURE_2_RECONNECT}} |
| {{FEATURE_3_NAME}} | {{FEATURE_3_OFFLINE}} | {{FEATURE_3_FRESHNESS}} | {{FEATURE_3_RECONNECT}} |
| {{FEATURE_4_NAME}} | {{FEATURE_4_OFFLINE}} | {{FEATURE_4_FRESHNESS}} | {{FEATURE_4_RECONNECT}} |
| {{FEATURE_5_NAME}} | {{FEATURE_5_OFFLINE}} | {{FEATURE_5_FRESHNESS}} | {{FEATURE_5_RECONNECT}} |

## Conflict Resolution Decision Tree

1. **Version vectors match** → No conflict, proceed with sync.
2. **Version vectors diverge, non-overlapping fields** → Auto-merge both changes.
3. **Version vectors diverge, overlapping fields, data type = LWW** → Server timestamp wins.
4. **Version vectors diverge, overlapping fields, data type = merge** → Apply {{MERGE_ALGORITHM}} merge.
5. **Version vectors diverge, overlapping fields, data type = escalate** → Queue for user resolution with side-by-side diff.
6. **Operation queue exceeds {{MAX_QUEUE_SIZE}} entries** → Trigger compaction (collapse sequential edits to same record).

## Storage Budget

| Store | Technology | Capacity | Eviction Policy | Encryption |
|-------|-----------|----------|-----------------|------------|
| {{LOCAL_STORE_1_NAME}} | {{LOCAL_STORE_1_TECH}} | {{LOCAL_STORE_1_MAX_SIZE}} | {{LOCAL_STORE_1_EVICTION}} | {{LOCAL_STORE_1_ENCRYPTION}} |
| {{LOCAL_STORE_2_NAME}} | {{LOCAL_STORE_2_TECH}} | {{LOCAL_STORE_2_MAX_SIZE}} | {{LOCAL_STORE_2_EVICTION}} | {{LOCAL_STORE_2_ENCRYPTION}} |
| {{LOCAL_STORE_3_NAME}} | {{LOCAL_STORE_3_TECH}} | {{LOCAL_STORE_3_MAX_SIZE}} | {{LOCAL_STORE_3_EVICTION}} | {{LOCAL_STORE_3_ENCRYPTION}} |

## Notes

- **Sync on wake:** The sync engine triggers on app foreground, network change, and every {{SYNC_INTERVAL}} while active.
- **Bandwidth awareness:** On metered connections (cellular), only high-priority queue items sync. Full sync deferred to Wi-Fi.
- **Data encryption:** All local stores use {{LOCAL_ENCRYPTION_METHOD}}. Encryption key derived from {{ENCRYPTION_KEY_SOURCE}}.
- **Queue persistence:** Operation queue survives app termination. Stored in {{QUEUE_PERSISTENCE_TECH}}.

## Cross-References

- **Data flow sequences:** `data-flow.template.md`
- **Real-time paths:** `df-realtime-paths.template.md`
- **Service dependencies:** `df-cross-service-dependencies.template.md`
- **System architecture:** `system-architecture-flowchart.template.md`
