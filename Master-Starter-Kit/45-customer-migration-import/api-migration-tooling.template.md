# API-Based Migration Tooling — Competitor Data Extraction

> The best migration experience is no file at all. API-to-API migration connects directly to the customer's existing tool, extracts their data, and imports it — no downloads, no uploads, no formatting errors. This template architects the extraction pipeline.

---

## 1. OAuth Connection Flow

API-based migration starts with the customer authorizing {{PROJECT_NAME}} to access their data in the source system. OAuth 2.0 is the standard mechanism. The connection flow must be seamless — one click to authorize, one click to start migration.

### Connection UI Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Select      │───▶│  OAuth       │───▶│  Permission  │───▶│  Connected   │
│  Source      │    │  Redirect    │    │  Consent     │    │  Ready to    │
│  Platform    │    │  (Source)    │    │  (Source UI) │    │  Migrate     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### OAuth Implementation

```typescript
// src/migration/oauth/oauth-manager.ts
interface OAuthConfig {
  provider: string;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
  redirectUri: string;
}

const COMPETITOR_OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  '{{COMPETITOR_1_NAME}}': {
    provider: '{{COMPETITOR_1_NAME}}',
    clientId: process.env.COMPETITOR_1_OAUTH_CLIENT_ID!,
    clientSecret: process.env.COMPETITOR_1_OAUTH_CLIENT_SECRET!,
    authorizationUrl: 'https://api.competitor1.com/oauth/authorize',
    tokenUrl: 'https://api.competitor1.com/oauth/token',
    scopes: ['read:contacts', 'read:deals', 'read:activities', 'read:files'],
    redirectUri: `${process.env.APP_URL}/api/migration/oauth/callback`,
  },
  '{{COMPETITOR_2_NAME}}': {
    provider: '{{COMPETITOR_2_NAME}}',
    clientId: process.env.COMPETITOR_2_OAUTH_CLIENT_ID!,
    clientSecret: process.env.COMPETITOR_2_OAUTH_CLIENT_SECRET!,
    authorizationUrl: 'https://{{COMPETITOR_2_NAME}}.com/oauth2/authorize',
    tokenUrl: 'https://{{COMPETITOR_2_NAME}}.com/oauth2/token',
    scopes: ['data.read', 'export.full'],
    redirectUri: `${process.env.APP_URL}/api/migration/oauth/callback`,
  },
};

export function generateAuthUrl(provider: string, userId: string): string {
  const config = COMPETITOR_OAUTH_CONFIGS[provider];
  if (!config) throw new Error(`Unknown provider: ${provider}`);

  const state = generateOAuthState(userId, provider); // CSRF protection

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
    access_type: 'offline', // Request refresh token
  });

  return `${config.authorizationUrl}?${params.toString()}`;
}

export async function handleOAuthCallback(
  code: string,
  state: string
): Promise<OAuthTokens> {
  const { userId, provider } = validateOAuthState(state);
  const config = COMPETITOR_OAUTH_CONFIGS[provider];

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  if (!response.ok) {
    throw new OAuthError(`Token exchange failed: ${response.status} ${await response.text()}`);
  }

  const tokens = await response.json();

  // Store tokens securely (encrypted at rest)
  await storeTokens(userId, provider, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    scopes: config.scopes,
  });

  return tokens;
}
```

---

## 2. API Rate Limit Management

Competitor APIs enforce rate limits that constrain migration speed. Exceeding limits causes temporary bans, failed requests, and incomplete migrations. A robust rate limiter is essential.

### Rate Limit Strategy

```typescript
// src/migration/api/rate-limiter.ts
interface RateLimitConfig {
  maxRequestsPerSecond: number;
  maxRequestsPerMinute: number;
  maxConcurrent: number;
  retryAfterHeader: string; // Header name for retry-after
  backoffMultiplier: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '{{COMPETITOR_1_NAME}}': {
    maxRequestsPerSecond: 10,
    maxRequestsPerMinute: 500,
    maxConcurrent: 5,
    retryAfterHeader: 'Retry-After',
    backoffMultiplier: 2,
  },
  '{{COMPETITOR_2_NAME}}': {
    maxRequestsPerSecond: 5,
    maxRequestsPerMinute: 250,
    maxConcurrent: 3,
    retryAfterHeader: 'X-Rate-Limit-Reset',
    backoffMultiplier: 1.5,
  },
};

export class ApiRateLimiter {
  private requestTimes: number[] = [];
  private activeRequests: number = 0;
  private config: RateLimitConfig;
  private backoffDelay: number = 0;

  constructor(provider: string) {
    this.config = RATE_LIMITS[provider];
  }

  async acquire(): Promise<void> {
    // Wait for backoff if rate-limited
    if (this.backoffDelay > 0) {
      await sleep(this.backoffDelay);
      this.backoffDelay = 0;
    }

    // Wait for concurrent request slot
    while (this.activeRequests >= this.config.maxConcurrent) {
      await sleep(100);
    }

    // Wait for rate window
    const now = Date.now();
    this.requestTimes = this.requestTimes.filter(t => now - t < 60000);

    while (this.requestTimes.length >= this.config.maxRequestsPerMinute) {
      const oldestExpiry = this.requestTimes[0] + 60000;
      await sleep(oldestExpiry - now);
      this.requestTimes = this.requestTimes.filter(t => Date.now() - t < 60000);
    }

    // Check per-second limit
    const lastSecond = this.requestTimes.filter(t => now - t < 1000);
    if (lastSecond.length >= this.config.maxRequestsPerSecond) {
      await sleep(1000 - (now - lastSecond[0]));
    }

    this.requestTimes.push(Date.now());
    this.activeRequests++;
  }

  release(): void {
    this.activeRequests--;
  }

  handleRateLimitResponse(headers: Headers): void {
    const retryAfter = headers.get(this.config.retryAfterHeader);
    if (retryAfter) {
      const delay = parseInt(retryAfter, 10) * 1000;
      this.backoffDelay = Math.min(delay, 300000); // Max 5 min backoff
    } else {
      this.backoffDelay = Math.min(
        (this.backoffDelay || 1000) * this.config.backoffMultiplier,
        300000
      );
    }
  }
}
```

### Rate Limit Monitoring

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| 429 responses per minute | > 5 | Increase backoff delay |
| Average response time | > 2000ms | Reduce concurrency |
| Consecutive failures | > 10 | Pause migration, notify customer |
| Token refresh failures | Any | Alert engineering, pause migration |
| Daily API quota remaining | < 10% | Throttle to minimum rate |

---

## 3. Data Extraction Pipeline

### Extraction Architecture

```typescript
// src/migration/api/extraction-pipeline.ts
interface ExtractionPlan {
  provider: string;
  entities: EntityExtractionConfig[];
  totalEstimatedRecords: number;
  estimatedDurationMinutes: number;
}

interface EntityExtractionConfig {
  entityType: string; // 'contacts', 'deals', 'tasks', etc.
  apiEndpoint: string;
  paginationType: 'offset' | 'cursor' | 'page' | 'link';
  pageSize: number;
  orderDependencies: string[]; // Must extract these entity types first
  fieldMapping: FieldMapping[];
  filters?: Record<string, string>;
}

export async function buildExtractionPlan(
  provider: string,
  tokens: OAuthTokens,
  options: MigrationOptions
): Promise<ExtractionPlan> {
  const api = createApiClient(provider, tokens);

  // Discover what data is available and estimate counts
  const entities = getEntityConfigs(provider);
  const plan: ExtractionPlan = {
    provider,
    entities: [],
    totalEstimatedRecords: 0,
    estimatedDurationMinutes: 0,
  };

  for (const entity of entities) {
    // Get record count from API (most APIs support count-only requests)
    const count = await api.getRecordCount(entity.apiEndpoint, entity.filters);

    // Apply historical data policy filter
    if (options.historicalDataPolicy !== 'full' && entity.hasDateFilter) {
      entity.filters = {
        ...entity.filters,
        ...buildDateFilter(options.historicalDataPolicy),
      };
    }

    plan.entities.push({ ...entity, estimatedCount: count });
    plan.totalEstimatedRecords += count;
  }

  // Topological sort for dependency ordering
  plan.entities = topologicalSort(plan.entities);

  // Estimate duration based on rate limits
  const rateLimit = RATE_LIMITS[provider];
  const totalPages = plan.entities.reduce(
    (sum, e) => sum + Math.ceil((e.estimatedCount || 0) / e.pageSize), 0
  );
  plan.estimatedDurationMinutes = Math.ceil(totalPages / rateLimit.maxRequestsPerMinute);

  return plan;
}

export async function executeExtraction(
  plan: ExtractionPlan,
  tokens: OAuthTokens,
  importId: string
): Promise<ExtractionResult> {
  const api = createApiClient(plan.provider, tokens);
  const rateLimiter = new ApiRateLimiter(plan.provider);
  const results: EntityExtractionResult[] = [];

  for (const entity of plan.entities) {
    const entityResult = await extractEntity(api, rateLimiter, entity, importId);
    results.push(entityResult);

    await updateProgress(importId, {
      currentEntity: entity.entityType,
      extractedRecords: entityResult.recordCount,
      status: 'extracting',
    });
  }

  return { entities: results, totalRecords: results.reduce((s, r) => s + r.recordCount, 0) };
}

async function extractEntity(
  api: ApiClient,
  rateLimiter: ApiRateLimiter,
  config: EntityExtractionConfig,
  importId: string
): Promise<EntityExtractionResult> {
  let allRecords: any[] = [];
  let cursor: string | null = null;
  let page = 0;

  do {
    await rateLimiter.acquire();
    try {
      const response = await api.get(config.apiEndpoint, {
        limit: config.pageSize,
        ...(config.paginationType === 'cursor' ? { cursor } : { offset: page * config.pageSize }),
        ...config.filters,
      });

      const records = response.data || response.results || response.items || [];
      allRecords.push(...records);

      // Update cursor/pagination
      cursor = response.next_cursor || response.nextCursor || null;
      page++;

      // Store batch to staging (avoid holding all records in memory)
      if (allRecords.length >= 1000) {
        await storeStagingBatch(importId, config.entityType, allRecords);
        allRecords = [];
      }
    } catch (error) {
      if (isRateLimitError(error)) {
        rateLimiter.handleRateLimitResponse(error.headers);
        continue; // Retry after backoff
      }
      throw error;
    } finally {
      rateLimiter.release();
    }
  } while (cursor || (config.paginationType === 'offset' && allRecords.length === config.pageSize));

  // Store remaining records
  if (allRecords.length > 0) {
    await storeStagingBatch(importId, config.entityType, allRecords);
  }

  return { entityType: config.entityType, recordCount: page * config.pageSize };
}
```

---

## 4. Incremental Migration (Delta Sync)

Incremental migration allows customers to start using {{PROJECT_NAME}} before the full migration completes. New and updated records sync continuously from the source system until the customer fully transitions.

### Delta Sync Architecture

```
┌────────────────┐    ┌────────────────┐    ┌────────────────┐
│  Initial Full  │───▶│  Delta Sync    │───▶│  Cutover       │
│  Extraction    │    │  (Continuous)  │    │  (Final)       │
│                │    │                │    │                │
│ All records    │    │ Modified since │    │ Stop source    │
│ from source    │    │ last sync      │    │ Final delta    │
│                │    │                │    │ Disable sync   │
└────────────────┘    └────────────────┘    └────────────────┘
```

```typescript
// src/migration/sync/delta-sync.ts
interface SyncState {
  importId: string;
  provider: string;
  lastSyncAt: Date;
  entityWatermarks: Record<string, string>; // entityType -> last modified timestamp or cursor
  status: 'active' | 'paused' | 'completed';
}

export async function executeDeltaSync(state: SyncState): Promise<SyncResult> {
  const api = createApiClient(state.provider, await getTokens(state.importId));
  const rateLimiter = new ApiRateLimiter(state.provider);
  const entities = getEntityConfigs(state.provider);
  let totalSynced = 0;

  for (const entity of entities) {
    const watermark = state.entityWatermarks[entity.entityType];
    const modifiedRecords = await api.get(entity.apiEndpoint, {
      modified_since: watermark || state.lastSyncAt.toISOString(),
      limit: entity.pageSize,
      sort: 'modified_at:asc',
    });

    for (const record of modifiedRecords.data) {
      await upsertRecord(state.importId, entity.entityType, record, entity.fieldMapping);
      totalSynced++;
    }

    // Update watermark
    if (modifiedRecords.data.length > 0) {
      state.entityWatermarks[entity.entityType] =
        modifiedRecords.data[modifiedRecords.data.length - 1].modified_at;
    }
  }

  state.lastSyncAt = new Date();
  await saveSyncState(state);

  return { syncedRecords: totalSynced, syncedAt: state.lastSyncAt };
}
```

### Delta Sync Schedule

| Phase | Frequency | Purpose |
|-------|-----------|---------|
| Initial migration | One-time | Full data extraction |
| Active sync | Every 15 minutes | Keep data current during transition |
| Pre-cutover | Every 5 minutes | Minimize gap before final sync |
| Cutover sync | One-time | Final delta to capture last changes |
| Post-cutover | Disabled | Customer fully on {{PROJECT_NAME}} |

---

## 5. Error Handling & Retry Logic

### Retry Strategy

```typescript
// src/migration/api/retry-handler.ts
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableStatuses: number[];
  retryableErrors: string[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  initialDelay: 1000,
  maxDelay: 60000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EPIPE'],
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  context?: string
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (!isRetryable(error, config)) {
        throw error; // Non-retryable — fail immediately
      }

      if (attempt === config.maxAttempts) {
        break; // Exhausted retries
      }

      console.warn(
        `[migration:retry] ${context || 'operation'} failed (attempt ${attempt}/${config.maxAttempts}), ` +
        `retrying in ${delay}ms: ${(error as Error).message}`
      );

      await sleep(delay);
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }

  throw new MigrationError(
    `Operation failed after ${config.maxAttempts} attempts: ${lastError?.message}`,
    { cause: lastError, context }
  );
}

function isRetryable(error: any, config: RetryConfig): boolean {
  if (error.status && config.retryableStatuses.includes(error.status)) return true;
  if (error.code && config.retryableErrors.includes(error.code)) return true;
  return false;
}
```

### Error Classification

| Error Type | Status Code | Retryable | Action |
|-----------|-------------|-----------|--------|
| Rate limited | 429 | Yes | Backoff per Retry-After header |
| Server error | 500, 502, 503 | Yes | Exponential backoff |
| Timeout | 408, ETIMEDOUT | Yes | Retry with increased timeout |
| Auth expired | 401 | Yes (once) | Refresh token, retry |
| Forbidden | 403 | No | Check scopes, notify customer |
| Not found | 404 | No | Skip record, log warning |
| Bad request | 400 | No | Log error, skip record |
| Gone | 410 | No | Record deleted in source, skip |

---

## 6. Migration Status API

Expose migration progress to the frontend via a status API.

```typescript
// src/migration/api/routes/migration-status.ts
// GET /api/migrations/:importId/status

export async function GET(
  request: Request,
  { params }: { params: { importId: string } }
) {
  const { importId } = params;
  const userId = await getAuthenticatedUserId(request);

  const migration = await getMigration(importId);
  if (!migration || migration.userId !== userId) {
    return Response.json({ error: 'Migration not found' }, { status: 404 });
  }

  const progress = await getProgress(importId);

  return Response.json({
    id: migration.id,
    status: migration.status,
    provider: migration.provider,
    startedAt: migration.startedAt,
    completedAt: migration.completedAt,
    progress: {
      currentPhase: progress.phase, // 'extracting' | 'transforming' | 'loading' | 'validating'
      currentEntity: progress.currentEntity,
      extractedRecords: progress.extractedRecords,
      transformedRecords: progress.transformedRecords,
      loadedRecords: progress.loadedRecords,
      errorCount: progress.errorCount,
      totalEstimated: progress.totalEstimated,
      percentComplete: progress.percentComplete,
      estimatedCompletionAt: progress.estimatedCompletionAt,
    },
    entities: progress.entityBreakdown,
    errors: progress.recentErrors.slice(0, 10),
  });
}
```

---

## 7. Authentication Token Management

### Token Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Grant    │───▶│  Store   │───▶│  Use     │───▶│  Refresh │
│  (OAuth)  │    │(Encrypted)│   │(API calls)│   │(Auto)    │
└──────────┘    └──────────┘    └──────────┘    └─────┬────┘
                                                       │
                                              ┌────────┴────────┐
                                              ▼                 ▼
                                        ┌──────────┐    ┌──────────┐
                                        │  Revoke  │    │  Expire  │
                                        │(User req)│    │(Provider)│
                                        └──────────┘    └──────────┘
```

### Secure Token Storage

```typescript
// src/migration/oauth/token-store.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY!, 'hex'); // 32 bytes
const ALGORITHM = 'aes-256-gcm';

export async function storeTokens(
  userId: string,
  provider: string,
  tokens: OAuthTokens
): Promise<void> {
  const encrypted = encryptTokens(tokens);

  await db.query(
    `INSERT INTO migration_tokens (user_id, provider, encrypted_tokens, expires_at, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id, provider) DO UPDATE SET
       encrypted_tokens = EXCLUDED.encrypted_tokens,
       expires_at = EXCLUDED.expires_at`,
    [userId, provider, encrypted, tokens.expiresAt]
  );
}

export async function getTokens(userId: string, provider: string): Promise<OAuthTokens> {
  const result = await db.query(
    `SELECT encrypted_tokens, expires_at FROM migration_tokens
     WHERE user_id = $1 AND provider = $2`,
    [userId, provider]
  );

  if (result.rows.length === 0) {
    throw new Error(`No tokens found for ${provider}. Customer must re-authorize.`);
  }

  const tokens = decryptTokens(result.rows[0].encrypted_tokens);

  // Auto-refresh if expired or expiring within 5 minutes
  if (new Date(result.rows[0].expires_at) < new Date(Date.now() + 300000)) {
    const refreshed = await refreshAccessToken(provider, tokens.refreshToken);
    await storeTokens(userId, provider, refreshed);
    return refreshed;
  }

  return tokens;
}

function encryptTokens(tokens: OAuthTokens): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const plaintext = JSON.stringify(tokens);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decryptTokens(encryptedString: string): OAuthTokens {
  const [ivHex, authTagHex, encrypted] = encryptedString.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}
```

### Token Cleanup Policy

| Event | Action |
|-------|--------|
| Migration completed | Keep tokens for {{ROLLBACK_WINDOW_HOURS}} hours, then delete |
| Customer disconnects provider | Revoke token via provider API, delete from store |
| Token refresh fails 3 times | Mark migration as paused, notify customer to re-authorize |
| Account deletion | Delete all tokens immediately, revoke via provider APIs |
| Provider revokes access | Detect on next API call (401), pause migration, notify customer |
