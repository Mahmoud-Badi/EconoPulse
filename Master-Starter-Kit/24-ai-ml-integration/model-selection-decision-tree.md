# Model Selection Decision Tree

> Choose the right AI model and provider for each feature. The wrong model wastes money. The right model at the wrong price tier burns through runway. Use this guide to match models to features.

---

## Provider Overview (2026)

### Anthropic Claude

**Strengths:** Code generation, safety, instruction following, long context (200K), structured output.

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Best For |
|-------|----------------------|------------------------|---------------|----------|
| Claude Opus 4 | $15.00 | $75.00 | 200K | Complex reasoning, highest quality |
| Claude Sonnet 4 | $3.00 | $15.00 | 200K | Best quality/cost ratio, code, general |
| Claude Haiku 3.5 | $0.80 | $4.00 | 200K | Fast classification, simple tasks |

**When to choose Anthropic:**
- Your product requires excellent code generation
- Safety and instruction following are critical
- You need long context windows (up to 200K tokens)
- Structured output reliability matters

---

### OpenAI GPT

**Strengths:** Largest ecosystem, best multimodal, fine-tuning support, widest tool/plugin ecosystem.

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Best For |
|-------|----------------------|------------------------|---------------|----------|
| GPT-4o | $2.50 | $10.00 | 128K | General purpose, multimodal |
| GPT-4o-mini | $0.15 | $0.60 | 128K | Fast, cheap, good quality |
| o3 | $10.00 | $40.00 | 200K | Complex reasoning, math, science |
| o3-mini | $1.10 | $4.40 | 200K | Reasoning tasks at lower cost |

**When to choose OpenAI:**
- You need the widest ecosystem (most tutorials, tools, integrations)
- Fine-tuning is a requirement
- You need vision/image understanding alongside text
- Your team is already familiar with the OpenAI API

---

### Google Gemini

**Strengths:** Largest context windows (1M+ tokens), multimodal (text, image, video, audio), competitive pricing.

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Best For |
|-------|----------------------|------------------------|---------------|----------|
| Gemini 2.5 Pro | $1.25 / $2.50 | $10.00 / $15.00 | 1M | Long context, multimodal, reasoning |
| Gemini 2.5 Flash | $0.15 / $0.30 | $0.60 / $2.50 | 1M | Fast, cheap, good quality |

*Pricing tiers: under/over 200K context tokens.*

**When to choose Google:**
- You need very long context windows (1M tokens)
- Video or audio understanding is required
- You want the cheapest option with good quality (Gemini Flash)
- Multimodal beyond text+image (video, audio, documents)

---

### Open Source Models

**Strengths:** Privacy, self-hosting, fine-tuning, no per-token costs, data sovereignty.

| Model | Parameters | Quality (vs GPT-4o) | Hosting Cost | Best For |
|-------|-----------|---------------------|-------------|----------|
| Llama 3.3 70B | 70B | ~90% | $2-4/hr GPU | General purpose, fine-tuning |
| Llama 3.1 405B | 405B | ~95% | $8-15/hr GPU | Highest quality open-source |
| Mistral Large 2 | 123B | ~90% | $3-6/hr GPU | European data sovereignty |
| Qwen 2.5 72B | 72B | ~88% | $2-4/hr GPU | Multilingual, coding |
| DeepSeek V3 | 671B MoE | ~93% | $4-8/hr GPU | Reasoning, coding |

**When to choose open source:**
- Data cannot leave your infrastructure (healthcare, finance, government)
- You need to fine-tune on proprietary data
- Per-token API costs would exceed GPU hosting costs at your scale
- You want full control over the model and its behavior

**Hosted Open Source (No GPU Management):**
| Provider | Models Available | Pricing Model |
|----------|----------------|--------------|
| Together AI | Llama, Mistral, Qwen | Per-token (cheaper than OpenAI) |
| Groq | Llama, Mixtral | Per-token (very fast inference) |
| Fireworks AI | Llama, Mistral | Per-token, fine-tuning support |
| Replicate | Most open-source models | Per-second compute |

---

## Decision Tree by Use Case

### Need the best quality?

```
Is cost a major concern?
├── NO → Claude Opus 4 or o3
│         (Use for: critical features, complex reasoning, customer-facing quality)
└── YES → Claude Sonnet 4 or GPT-4o
          (Use for: 90% of production features, excellent quality at reasonable cost)
```

### Need the lowest cost?

```
Is quality above "good enough" important?
├── YES → Gemini 2.5 Flash ($0.15/1M input)
│         or GPT-4o-mini ($0.15/1M input)
└── NO →  Open source via Together AI / Groq
          (Llama 3.3 70B at ~$0.05-0.10/1M tokens)
```

### Need privacy / self-hosting?

```
What is your scale?
├── <10K requests/day → Hosted open-source (Together AI, Groq)
│                        Cheaper than managing GPUs
├── 10K-100K requests/day → Self-hosted on cloud GPUs
│                            Llama 3.3 70B on 2x A100
└── >100K requests/day → Self-hosted with vLLM or TGI
                          Dedicated GPU cluster
```

### Need fine-tuning?

```
How much training data do you have?
├── <100 examples → Do not fine-tune. Use few-shot prompting.
├── 100-1000 examples → OpenAI fine-tuning (GPT-4o-mini)
│                        or LoRA on Llama 3.3
├── 1000-10000 examples → Full fine-tune on open-source model
└── >10000 examples → Consider training from scratch (unlikely to be needed)
```

### Need multimodal?

```
What modalities?
├── Text + Image → GPT-4o or Gemini 2.5 Pro (both excellent)
├── Text + Video → Gemini 2.5 Pro (only good option)
├── Text + Audio → Gemini 2.5 Pro or OpenAI Whisper + GPT
└── Text only → Any provider (choose by quality/cost)
```

### Need code generation?

```
Quality requirements?
├── Best code quality → Claude Sonnet 4 (consistently rated highest for code)
├── Good + cheap → GPT-4o-mini or Gemini 2.5 Flash
└── Privacy required → DeepSeek V3 or Qwen 2.5 Coder (self-hosted)
```

---

## Cost Comparison Table (per 1M tokens, as of 2026)

| Provider / Model | Input Cost | Output Cost | Speed (tokens/s) | Quality Tier |
|-----------------|-----------|------------|-------------------|-------------|
| Claude Opus 4 | $15.00 | $75.00 | ~40 | S-tier |
| o3 | $10.00 | $40.00 | ~30 | S-tier |
| Claude Sonnet 4 | $3.00 | $15.00 | ~80 | A-tier |
| GPT-4o | $2.50 | $10.00 | ~80 | A-tier |
| Gemini 2.5 Pro | $1.25 | $10.00 | ~100 | A-tier |
| o3-mini | $1.10 | $4.40 | ~100 | A-tier |
| Claude Haiku 3.5 | $0.80 | $4.00 | ~150 | B-tier |
| Gemini 2.5 Flash | $0.15 | $0.60 | ~200 | B-tier |
| GPT-4o-mini | $0.15 | $0.60 | ~150 | B-tier |
| Llama 3.3 70B (Together) | $0.09 | $0.09 | ~100 | B-tier |
| Llama 3.3 70B (Groq) | $0.06 | $0.06 | ~300 | B-tier |

---

## Multi-Model Strategy

Do not use one model for everything. Use the right model for each task.

| Task | Recommended Model | Why |
|------|------------------|-----|
| Chat / Conversation | Claude Sonnet 4 | Best instruction following, safe |
| Classification | Gemini Flash or GPT-4o-mini | Fast, cheap, structured output |
| Content generation | Claude Sonnet 4 | Best writing quality |
| Code generation | Claude Sonnet 4 | Best code quality |
| Summarization | Gemini 2.5 Pro | 1M context window |
| Embeddings | text-embedding-3-small | Cheapest, good quality |
| Re-ranking | Cohere Rerank v3 | Purpose-built for re-ranking |
| Image generation | DALL-E 3 or Flux | Depends on style needs |
| Moderation | OpenAI Moderation API | Free, purpose-built |

### Implementation: Model Router

```typescript
// lib/ai/model-router.ts

import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

type TaskType =
  | "chat"
  | "classification"
  | "generation"
  | "code"
  | "summarization"
  | "embedding";

const MODEL_CONFIG: Record<TaskType, { model: any; maxTokens: number }> = {
  chat: {
    model: anthropic("claude-sonnet-4-20250514"),
    maxTokens: 4096,
  },
  classification: {
    model: google("gemini-2.5-flash"),
    maxTokens: 256,
  },
  generation: {
    model: anthropic("claude-sonnet-4-20250514"),
    maxTokens: 2048,
  },
  code: {
    model: anthropic("claude-sonnet-4-20250514"),
    maxTokens: 4096,
  },
  summarization: {
    model: google("gemini-2.5-pro"),
    maxTokens: 2048,
  },
  embedding: {
    model: openai("text-embedding-3-small"),
    maxTokens: 0,
  },
};

export function getModelForTask(task: TaskType) {
  return MODEL_CONFIG[task];
}
```

---

## Fallback Strategy

Always have a fallback provider. LLM providers experience outages.

```typescript
// lib/ai/fallback.ts

interface ProviderConfig {
  name: string;
  model: any;
  healthCheckUrl?: string;
}

const FALLBACK_CHAIN: ProviderConfig[] = [
  { name: "anthropic", model: anthropic("claude-sonnet-4-20250514") },
  { name: "openai", model: openai("gpt-4o") },
  { name: "google", model: google("gemini-2.5-pro") },
];

export async function callWithFallback(
  messages: any[],
  system?: string
) {
  for (const provider of FALLBACK_CHAIN) {
    try {
      const result = await streamText({
        model: provider.model,
        system,
        messages,
      });
      return { result, provider: provider.name };
    } catch (error: any) {
      console.warn(`[AI Fallback] ${provider.name} failed: ${error.message}`);

      // Do not fallback on client errors (bad request, auth failure)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      continue;
    }
  }

  throw new Error("All AI providers are unavailable. Please try again later.");
}
```

---

## Switching Providers Checklist

If you need to switch providers mid-project:

- [ ] Verify the new model supports your required features (streaming, tool calling, structured output)
- [ ] Re-run your evaluation dataset against the new model
- [ ] Compare cost at your current usage volume
- [ ] Test all prompt templates -- prompts that work well for one model may need adjustment for another
- [ ] Update rate limiting configuration (different providers have different limits)
- [ ] Update error handling (different error formats and status codes)
- [ ] Run adversarial safety tests against the new model
- [ ] Verify streaming behavior works correctly with your UI
- [ ] Update your fallback chain order
- [ ] Monitor quality metrics for 48 hours after switching
