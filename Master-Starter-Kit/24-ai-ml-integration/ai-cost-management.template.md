# AI Cost Management

> Token budgeting, caching strategies, and cost guardrails for {{PROJECT_NAME}}. AI costs scale with users, not servers. Budget accordingly or get surprised by a five-figure invoice.

---

## Cost Profile for {{PROJECT_NAME}}

**AI Provider:** {{AI_PROVIDER}}
**Average Revenue Per User:** {{AVERAGE_REVENUE_PER_USER}}/month

### Rule of Thumb

AI costs per user should be **less than 10% of ARPU**. If your ARPU is {{AVERAGE_REVENUE_PER_USER}}, your AI cost per user must stay below ${{AVERAGE_REVENUE_PER_USER}} * 0.10/month. Exceeding this threshold means your AI features are eroding margins.

---

## Token Budget by Feature

| Feature | Avg Input Tokens | Avg Output Tokens | Cost/Request | Requests/User/Day | Daily Cost/User | Monthly Cost/User |
|---------|-----------------|-------------------|-------------|-------------------|----------------|------------------|
| {{FEATURE_1}} | — | — | $— | — | $— | $— |
| {{FEATURE_2}} | — | — | $— | — | $— | $— |
| {{FEATURE_3}} | — | — | $— | — | $— | $— |
| {{FEATURE_4}} | — | — | $— | — | $— | $— |
| **Total** | — | — | — | — | **$—** | **$—** |

### How to Fill This Table

1. Build the feature with logging enabled
2. Run 100 representative requests through the feature
3. Measure average input and output token counts
4. Calculate cost using your provider's pricing
5. Estimate daily requests per user from product analytics or assumptions
6. Multiply: `cost_per_request * requests_per_user_per_day * 30 = monthly_cost_per_user`

### Example Filled Table (SaaS with Chat + RAG + Classification)

| Feature | Avg Input Tokens | Avg Output Tokens | Cost/Request | Requests/User/Day | Daily Cost/User | Monthly Cost/User |
|---------|-----------------|-------------------|-------------|-------------------|----------------|------------------|
| Help Chat | 2,000 | 500 | $0.014 | 5 | $0.07 | $2.10 |
| Doc Search (RAG) | 3,000 | 400 | $0.015 | 10 | $0.15 | $4.50 |
| Ticket Classification | 200 | 50 | $0.0002 | 20 | $0.004 | $0.12 |
| Email Drafts | 500 | 800 | $0.014 | 2 | $0.028 | $0.84 |
| **Total** | — | — | — | — | **$0.25** | **$7.56** |

---

## Caching Strategies

Caching is the single most effective cost reduction technique. A cached response costs $0.

### 1. Exact Match Cache (Redis)

Cache responses for identical prompts. Works best for classification, search queries, and frequently asked questions.

```typescript
// lib/ai/cache.ts

import { Redis } from "ioredis";
import { createHash } from "crypto";

const redis = new Redis(process.env.REDIS_URL!);
const CACHE_TTL = 3600; // 1 hour

function hashPrompt(prompt: string, model: string): string {
  return createHash("sha256").update(`${model}:${prompt}`).digest("hex");
}

export async function cachedLLMCall(
  prompt: string,
  model: string,
  generateFn: () => Promise<string>
): Promise<{ result: string; cached: boolean }> {
  const key = `ai:cache:${hashPrompt(prompt, model)}`;

  // Check cache
  const cached = await redis.get(key);
  if (cached) {
    return { result: cached, cached: true };
  }

  // Generate and cache
  const result = await generateFn();
  await redis.setex(key, CACHE_TTL, result);

  return { result, cached: false };
}
```

**Cache hit rates by feature type:**

| Feature Type | Expected Cache Hit Rate | Why |
|-------------|------------------------|-----|
| Classification | 30-60% | Many inputs repeat (support tickets, categories) |
| FAQ / Search | 40-70% | Users ask similar questions |
| Content Generation | 5-15% | Unique inputs, but templates overlap |
| Chat Conversation | <5% | Every conversation is unique |

### 2. Semantic Cache

Cache responses for semantically similar prompts. Uses embedding similarity to find near-matches.

```typescript
// lib/ai/semantic-cache.ts

const SIMILARITY_THRESHOLD = 0.95; // Must be very similar to use cache

export async function semanticCachedLLMCall(
  prompt: string,
  generateFn: () => Promise<string>
): Promise<{ result: string; cached: boolean }> {
  // Generate embedding for the prompt
  const promptEmbedding = await generateQueryEmbedding(prompt);

  // Search cache for similar prompts
  const similar = await searchSimilar(
    promptEmbedding,
    1, // top 1
    { type: "cache" }
  );

  if (similar.length > 0 && similar[0].similarity >= SIMILARITY_THRESHOLD) {
    // Found a semantically similar cached response
    const cachedResponse = await redis.get(`ai:semantic-cache:${similar[0].metadata.id}`);
    if (cachedResponse) {
      return { result: cachedResponse, cached: true };
    }
  }

  // Generate new response
  const result = await generateFn();

  // Store in semantic cache
  const cacheId = crypto.randomUUID();
  await redis.setex(`ai:semantic-cache:${cacheId}`, CACHE_TTL, result);
  await storeChunks([
    {
      id: cacheId,
      documentId: "cache",
      content: prompt,
      embedding: promptEmbedding,
      metadata: { type: "cache", id: cacheId, chunkIndex: 0, totalChunks: 1 },
    },
  ]);

  return { result, cached: false };
}
```

### 3. Prompt Prefix Caching (Anthropic)

Anthropic automatically caches the beginning of prompts. If your system prompt is the same across requests, subsequent requests are cheaper.

```typescript
// Anthropic prompt caching - automatic with the API
// The first request caches the system prompt
// Subsequent requests with the same system prompt prefix get a discount

// Pricing with cache:
// - Cache write: 1.25x base input price (first request)
// - Cache read:  0.1x base input price (subsequent requests)
// - For a 2000-token system prompt sent 100 times:
//   Without cache: 100 * 2000 * $3.00/1M = $0.60
//   With cache:    1 * 2000 * $3.75/1M + 99 * 2000 * $0.30/1M = $0.067
//   Savings: ~89%

// Best practice: put static content (system prompt, instructions, examples)
// at the BEGINNING of the message, and dynamic content (user query) at the END.
```

### Cache Decision Tree

```
Is the exact same prompt likely to be sent again?
├── YES (>20% of the time) → Exact match cache (Redis)
├── MAYBE (similar but not identical) → Semantic cache
└── NO (unique every time) → Prompt prefix caching (if using Anthropic)
                             Or no caching (accept the cost)
```

---

## Tier-Based AI Access Limits

| Tier | AI Requests/Day | Max Tokens/Request | Features Available | Monthly AI Budget/User |
|------|----------------|-------------------|-------------------|----------------------|
| Free | {{FREE_TIER_LIMIT}} | 1,000 | Basic chat, classification | $0.50 |
| Pro | {{PRO_TIER_LIMIT}} | 4,000 | All features, standard models | $5.00 |
| Enterprise | {{ENTERPRISE_TIER_LIMIT}} | 8,000 | All features, premium models, priority | $25.00 |

### Implementation: Tier-Based Rate Limiting

```typescript
// lib/ai/tier-limits.ts

interface TierConfig {
  requestsPerDay: number;
  maxTokensPerRequest: number;
  allowedFeatures: string[];
  models: string[];
  monthlyBudgetCents: number;
}

const TIER_CONFIGS: Record<string, TierConfig> = {
  free: {
    requestsPerDay: 20,
    maxTokensPerRequest: 1000,
    allowedFeatures: ["chat", "classification"],
    models: ["gemini-2.5-flash", "gpt-4o-mini"],
    monthlyBudgetCents: 50,
  },
  pro: {
    requestsPerDay: 200,
    maxTokensPerRequest: 4000,
    allowedFeatures: ["chat", "classification", "generation", "search", "summarization"],
    models: ["claude-sonnet-4-20250514", "gpt-4o", "gemini-2.5-pro"],
    monthlyBudgetCents: 500,
  },
  enterprise: {
    requestsPerDay: 1000,
    maxTokensPerRequest: 8000,
    allowedFeatures: ["chat", "classification", "generation", "search", "summarization", "agents"],
    models: ["claude-opus-4-20250514", "claude-sonnet-4-20250514", "gpt-4o", "o3"],
    monthlyBudgetCents: 2500,
  },
};

export async function enforceAILimits(
  userId: string,
  tier: string,
  feature: string,
  estimatedTokens: number
): Promise<{ allowed: boolean; reason?: string }> {
  const config = TIER_CONFIGS[tier];
  if (!config) return { allowed: false, reason: "Invalid tier" };

  // Check feature access
  if (!config.allowedFeatures.includes(feature)) {
    return { allowed: false, reason: `Feature '${feature}' not available on ${tier} tier` };
  }

  // Check token limit
  if (estimatedTokens > config.maxTokensPerRequest) {
    return { allowed: false, reason: `Request exceeds ${config.maxTokensPerRequest} token limit` };
  }

  // Check daily request count
  const dailyCount = await getDailyRequestCount(userId);
  if (dailyCount >= config.requestsPerDay) {
    return { allowed: false, reason: `Daily limit of ${config.requestsPerDay} requests reached` };
  }

  // Check monthly budget
  const monthlySpendCents = await getMonthlySpend(userId);
  if (monthlySpendCents >= config.monthlyBudgetCents) {
    return { allowed: false, reason: "Monthly AI budget exceeded" };
  }

  return { allowed: true };
}
```

---

## Cost Monitoring

### Metrics to Track

| Metric | Query | Alert Threshold |
|--------|-------|----------------|
| Total daily AI spend | SUM of all request costs per day | > ${{DAILY_COST_ALERT}} |
| Cost per user per day | Total daily spend / active users | > ${{PER_USER_DAILY_ALERT}} |
| Single request cost | Individual request cost | > ${{SINGLE_REQUEST_ALERT}} |
| Cache hit rate | Cached requests / total requests | < 20% (should be higher) |
| Tokens per request (avg) | Average input + output tokens | > 5000 (investigate) |
| Error rate | Failed AI requests / total requests | > 5% |
| Provider spend by model | Cost broken down by model | Any model > 50% of total |

### Logging Every AI Request

```typescript
// lib/ai/logging.ts

interface AIRequestLog {
  requestId: string;
  userId: string;
  feature: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  latencyMs: number;
  cached: boolean;
  success: boolean;
  timestamp: Date;
}

export async function logAIRequest(log: AIRequestLog): Promise<void> {
  // Store in your analytics database
  await db.aiRequestLogs.create({ data: log });

  // Increment daily counters in Redis for rate limiting
  const dayKey = `ai:daily:${log.userId}:${new Date().toISOString().slice(0, 10)}`;
  await redis.incr(dayKey);
  await redis.expire(dayKey, 86400 * 2);

  // Increment monthly spend
  const monthKey = `ai:monthly:${log.userId}:${new Date().toISOString().slice(0, 7)}`;
  await redis.incrbyfloat(monthKey, log.costCents);
  await redis.expire(monthKey, 86400 * 35);
}

// Calculate cost from token usage
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const PRICING: Record<string, { input: number; output: number }> = {
    "claude-sonnet-4-20250514": { input: 3.0, output: 15.0 },
    "claude-haiku-3-5-20241022": { input: 0.8, output: 4.0 },
    "gpt-4o": { input: 2.5, output: 10.0 },
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
    "gemini-2.5-flash": { input: 0.15, output: 0.6 },
    "gemini-2.5-pro": { input: 1.25, output: 10.0 },
  };

  const pricing = PRICING[model];
  if (!pricing) return 0;

  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;

  return Math.round((inputCost + outputCost) * 100); // Return cents
}
```

---

## Cost Optimization Techniques

### 1. Use Shorter Prompts

Every token costs money. Compress your system prompts.

```typescript
// BAD: Verbose prompt (280 tokens)
const verbosePrompt = `
You are a helpful customer support assistant for our company.
Your job is to help customers with their questions and concerns.
You should always be polite and professional in your responses.
You should try to be as helpful as possible and provide accurate information.
If you don't know the answer, you should say so rather than making something up.
Please format your responses in a clear and easy to read manner.
`;

// GOOD: Compressed prompt (80 tokens)
const compactPrompt = `
You are {{PROJECT_NAME}}'s support assistant.
Rules: Be concise. Be accurate. If unsure, say so. Use markdown.
`;
```

### 2. Use Smaller Models for Simple Tasks

```typescript
// Route requests to the cheapest capable model
function selectModel(task: string, complexity: "low" | "medium" | "high") {
  if (complexity === "low") return "gemini-2.5-flash";    // $0.15/1M
  if (complexity === "medium") return "gpt-4o-mini";       // $0.15/1M
  return "claude-sonnet-4-20250514";                       // $3.00/1M
}
```

### 3. Implement Streaming Abort

Let users cancel generation mid-stream. Stop paying for tokens the user does not want.

```typescript
// Client-side abort
const abortController = new AbortController();

const response = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ message }),
  signal: abortController.signal,
});

// User clicks "Stop generating"
cancelButton.addEventListener("click", () => {
  abortController.abort();
});
```

### 4. Batch Requests

Group multiple small requests into a single batch call when real-time response is not needed.

```typescript
// Instead of 100 individual classification calls ($0.02 total)
// Batch them into a single call with multiple items ($0.002 total)
async function batchClassify(items: string[]): Promise<Classification[]> {
  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: z.object({
      classifications: z.array(
        z.object({
          index: z.number(),
          category: z.string(),
          confidence: z.number(),
        })
      ),
    }),
    prompt: `Classify each of the following items:\n\n${items.map((item, i) => `${i}. ${item}`).join("\n")}`,
  });

  return object.classifications;
}
```

### 5. Truncate Context Intelligently

Do not send entire documents when a summary would suffice.

```typescript
// Before sending to LLM, check if context is too large
function prepareContext(docs: string[], maxTokens: number = 8000): string {
  let totalTokens = 0;
  const selected: string[] = [];

  for (const doc of docs) {
    const docTokens = estimateTokens(doc);
    if (totalTokens + docTokens > maxTokens) {
      // Truncate this document to fit remaining budget
      const remaining = maxTokens - totalTokens;
      selected.push(doc.slice(0, remaining * 4)); // ~4 chars per token
      break;
    }
    selected.push(doc);
    totalTokens += docTokens;
  }

  return selected.join("\n\n---\n\n");
}
```

---

## Budget Guardrails

### Hard Limits

```typescript
// lib/ai/guardrails.ts

const HARD_LIMITS = {
  maxCostPerRequestCents: 50,      // $0.50 per request max
  maxDailyCostPerUserCents: 500,   // $5.00 per user per day
  maxDailyTotalCostCents: 50000,   // $500 per day total
  maxMonthlyTotalCostCents: 500000, // $5,000 per month total
};

export async function checkBudgetGuardrails(
  userId: string,
  estimatedCostCents: number
): Promise<{ allowed: boolean; reason?: string }> {
  // Per-request limit
  if (estimatedCostCents > HARD_LIMITS.maxCostPerRequestCents) {
    return { allowed: false, reason: "Request too expensive. Simplify your query." };
  }

  // Per-user daily limit
  const userDailySpend = await getUserDailySpend(userId);
  if (userDailySpend + estimatedCostCents > HARD_LIMITS.maxDailyCostPerUserCents) {
    return { allowed: false, reason: "Daily AI budget exceeded. Resets at midnight UTC." };
  }

  // Global daily limit (circuit breaker)
  const totalDailySpend = await getTotalDailySpend();
  if (totalDailySpend + estimatedCostCents > HARD_LIMITS.maxDailyTotalCostCents) {
    // ALERT: This is an emergency. Something is wrong.
    await sendAlert("AI daily budget exceeded!", { totalDailySpend });
    return { allowed: false, reason: "Service temporarily unavailable. Please try again later." };
  }

  return { allowed: true };
}
```

---

## Monthly Cost Projection

| Metric | Value |
|--------|-------|
| Active Users | {{ACTIVE_USERS}} |
| Avg AI Requests/User/Day | — |
| Avg Cost/Request | $— |
| Daily AI Cost | $— |
| Monthly AI Cost | $— |
| AI Cost as % of Revenue | —% |
| AI Cost as % of ARPU | —% |

**Target:** AI cost should be **<10% of ARPU**. If it exceeds this, implement more aggressive caching, use cheaper models, or adjust tier limits.
