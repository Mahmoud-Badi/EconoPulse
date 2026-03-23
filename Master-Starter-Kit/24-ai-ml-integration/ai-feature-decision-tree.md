# AI Feature Decision Tree

> What type of AI feature are you building? Start here. Your answer determines the architecture pattern, provider, infrastructure, and cost profile for everything that follows.

---

## The Decision Tree

Before writing any code, identify which category your AI feature falls into. Each category has a distinct architecture pattern, recommended stack, and cost profile. Most products combine multiple categories.

---

## 1. Chat Interface

**What it is:** Conversational AI that lets users ask questions, get help, or interact with your product through natural language dialogue.

**Examples:** Customer support chatbot, product Q&A, coding assistant, tutoring system.

**Architecture Pattern:**
```
User Input → Conversation History → System Prompt + Context → LLM → Streaming Response → UI
```

**Key Components:**
- Streaming responses (SSE or WebSocket)
- Conversation history management (sliding window or summarization)
- Tool/function calling (let the LLM query your APIs)
- Context injection (user data, product state, relevant documents)

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Integration | Vercel AI SDK (`useChat` hook) or direct Anthropic/OpenAI SDK |
| Streaming | Server-Sent Events (SSE) via API route |
| History | Database-backed with sliding window (last 20 messages) |
| Model | Claude Sonnet or GPT-4o (quality matters for conversation) |

**Estimated Cost per Request:** $0.003 - $0.05 (depends on conversation length)

**Complexity Rating:** 3/5

**Code Skeleton:**
```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are a helpful assistant for [Product].
             You help users with [specific tasks].
             Always be concise and accurate.`,
    messages,
    tools: {
      lookupOrder: {
        description: "Look up an order by ID",
        parameters: z.object({ orderId: z.string() }),
        execute: async ({ orderId }) => {
          return await db.orders.findUnique({ where: { id: orderId } });
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
```

---

## 2. Content Generation

**What it is:** Generate text content for users -- emails, blog posts, reports, product descriptions, social media posts.

**Examples:** Email composer, blog draft generator, report builder, product description writer.

**Architecture Pattern:**
```
User Input + Template + Tone Settings → System Prompt → LLM → Structured Output → Post-Processing → UI
```

**Key Components:**
- Structured output (JSON mode or Zod schemas)
- Template system (reusable prompt templates with variables)
- Tone/style control (formal, casual, persuasive)
- Draft → Edit → Finalize workflow

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Integration | Provider SDK with structured output |
| Output Format | JSON with Zod schema validation |
| Model | Claude Sonnet (excellent writing quality) or GPT-4o |
| Caching | Cache by template + key parameters |

**Estimated Cost per Request:** $0.005 - $0.03

**Complexity Rating:** 2/5

**Code Skeleton:**
```typescript
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const EmailSchema = z.object({
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body in markdown"),
  tone: z.enum(["formal", "casual", "persuasive"]),
  estimatedReadTime: z.number().describe("Estimated read time in minutes"),
});

export async function generateEmail(prompt: string, tone: string) {
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-20250514"),
    schema: EmailSchema,
    prompt: `Write a ${tone} email based on: ${prompt}`,
  });

  return object;
}
```

---

## 3. Search / RAG (Retrieval-Augmented Generation)

**What it is:** Let users search their own data using natural language. The system retrieves relevant documents and generates an answer grounded in those documents.

**Examples:** Documentation search, knowledge base Q&A, internal wiki search, legal document search.

**Architecture Pattern:**
```
User Query → Embed Query → Vector Search → Retrieve Top-K Documents →
Construct Prompt (System + Context + Query) → LLM → Answer with Citations → UI
```

**Key Components:**
- Document ingestion pipeline (upload → extract → chunk → embed → store)
- Vector database (pgvector, Pinecone, Chroma, Weaviate)
- Embedding model (text-embedding-3-small or Cohere embed)
- Retrieval strategy (top-k similarity, hybrid search, re-ranking)
- Citation generation (reference source documents in answers)

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Embeddings | OpenAI text-embedding-3-small (cheap, good quality) |
| Vector DB | pgvector (simple) or Pinecone (scalable) |
| Chunking | Recursive character splitting, 512 tokens, 50-token overlap |
| Generation Model | Claude Sonnet (excellent at following context) |
| Framework | LlamaIndex or custom pipeline |

**Estimated Cost per Request:** $0.002 - $0.02 (embedding) + $0.005 - $0.03 (generation)

**Complexity Rating:** 5/5

**See:** `rag-architecture.template.md` for the complete blueprint.

---

## 4. Classification

**What it is:** Categorize user content into predefined categories -- sentiment analysis, intent detection, spam filtering, content tagging.

**Examples:** Support ticket routing, sentiment analysis, content moderation, email categorization.

**Architecture Pattern:**
```
User Content → System Prompt with Categories → LLM → Structured Output (category + confidence) → Action
```

**Key Components:**
- Structured output with enum categories
- Confidence scoring
- Fallback for low-confidence results (route to human)
- Batch processing for bulk classification

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Integration | Provider SDK with JSON mode |
| Model | Gemini Flash or GPT-4o-mini (fast, cheap for classification) |
| Output | Zod enum schema with confidence score |
| Batch | Queue-based processing for bulk operations |

**Estimated Cost per Request:** $0.0002 - $0.002 (use cheapest model possible)

**Complexity Rating:** 1/5

**Code Skeleton:**
```typescript
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const ClassificationSchema = z.object({
  category: z.enum([
    "billing",
    "technical",
    "feature_request",
    "bug_report",
    "general",
  ]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export async function classifyTicket(content: string) {
  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: ClassificationSchema,
    prompt: `Classify this support ticket:\n\n${content}`,
  });

  if (object.confidence < 0.7) {
    return { ...object, requiresHumanReview: true };
  }

  return object;
}
```

---

## 5. Recommendation

**What it is:** Suggest content, products, actions, or connections to users based on their behavior, preferences, or content similarity.

**Examples:** Product recommendations, content suggestions, "similar items," user matching.

**Architecture Pattern:**
```
User Profile/Behavior → Embed User Context → Similarity Search → Re-rank by Business Rules → Recommendations
```

**Key Components:**
- User/item embeddings (pre-computed, stored in vector DB)
- Similarity search (cosine similarity between user and item embeddings)
- Business rule filtering (exclude already-seen, apply availability, boost new items)
- A/B testing different recommendation strategies

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Embeddings | OpenAI text-embedding-3-small for content-based |
| Vector DB | pgvector for <100K items, Pinecone for larger catalogs |
| Re-ranking | Business logic layer (freshness, diversity, user preferences) |
| Fallback | Popular/trending items when personalization data is insufficient |

**Estimated Cost per Request:** $0.0001 - $0.001 (embedding lookup only, no LLM generation)

**Complexity Rating:** 3/5

---

## 6. Summarization

**What it is:** Condense long content into shorter summaries -- articles, meeting transcripts, documents, email threads.

**Examples:** Document summarizer, meeting notes generator, email thread summary, report digest.

**Architecture Pattern:**
```
Long Content → Chunking (if exceeds context window) →
Map: Summarize Each Chunk → Reduce: Combine Summaries → Final Summary → UI
```

**Key Components:**
- Chunking strategy for long documents (recursive splitting with overlap)
- Map-reduce pattern for documents exceeding context window
- Output format control (bullet points, paragraphs, key takeaways)
- Streaming for real-time summary generation

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Model | Gemini 2.5 Pro (1M context) for long docs, Claude Sonnet for quality |
| Chunking | 4,000 tokens per chunk with 200-token overlap |
| Pattern | Single-pass for <100K tokens, map-reduce for longer |
| Streaming | Always stream -- summarization takes time |

**Estimated Cost per Request:** $0.01 - $0.10 (scales with document length)

**Complexity Rating:** 2/5

**Code Skeleton:**
```typescript
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export async function summarizeDocument(content: string, format: "bullets" | "paragraph" | "takeaways") {
  const formatInstructions = {
    bullets: "Summarize as a bulleted list of key points.",
    paragraph: "Write a 2-3 paragraph summary.",
    takeaways: "List the top 5 key takeaways with one sentence each.",
  };

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    prompt: `${formatInstructions[format]}\n\nDocument:\n${content}`,
  });

  return result.toDataStreamResponse();
}
```

---

## 7. Image Generation

**What it is:** Create images from text descriptions -- illustrations, product mockups, social media graphics, avatars.

**Examples:** Marketing image generator, avatar creator, product visualization, thumbnail generator.

**Architecture Pattern:**
```
User Prompt → Prompt Enhancement (optional) → Image Model API →
Image URL/Base64 → Storage (S3/R2) → Display
```

**Key Components:**
- Prompt enhancement (use LLM to improve user's vague prompt)
- Image model selection (DALL-E 3, Stable Diffusion, Flux)
- Image storage (do not serve directly from provider -- store in your own bucket)
- Content moderation (filter inappropriate requests and outputs)
- Style consistency (maintain brand style across generated images)

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Model | DALL-E 3 (best quality), Flux (best open-source), Stable Diffusion (most flexible) |
| Storage | Cloudflare R2 or AWS S3 |
| Enhancement | Use Claude/GPT to refine prompts before image generation |
| Moderation | OpenAI moderation API on input prompts |

**Estimated Cost per Request:** $0.02 - $0.12 per image (DALL-E 3: $0.04-$0.12, SD: $0.01-$0.03)

**Complexity Rating:** 2/5

---

## 8. Code Generation

**What it is:** Help users write, modify, debug, or explain code within your product.

**Examples:** In-app code editor with AI assist, SQL query builder, formula builder, no-code automation.

**Architecture Pattern:**
```
User Intent + Code Context → System Prompt (language, constraints, style) →
LLM → Generated Code → Syntax Validation → Sandbox Execution (optional) → UI
```

**Key Components:**
- Code context injection (existing code, schema, types)
- Syntax validation (parse generated code before returning)
- Sandboxed execution (never run LLM-generated code in production context)
- Language-specific system prompts
- Streaming with syntax highlighting

**Recommended Stack:**
| Component | Recommendation |
|-----------|---------------|
| Model | Claude Sonnet (best code quality) or GPT-4o |
| Validation | Language-specific parser (TypeScript compiler API, Python AST) |
| Sandbox | WebAssembly sandbox, Docker container, or cloud function |
| Streaming | Always stream -- code generation benefits greatly from streaming |

**Estimated Cost per Request:** $0.005 - $0.05 (depends on code context size)

**Complexity Rating:** 4/5

---

## Multi-Feature Strategy

Most products combine multiple AI feature types. A typical SaaS product might include:

| Feature | Type | Model | Priority |
|---------|------|-------|----------|
| Help chat | Chat Interface | Claude Sonnet | P0 -- Launch |
| Doc search | Search / RAG | Embeddings + Claude | P0 -- Launch |
| Ticket routing | Classification | Gemini Flash | P1 -- Month 2 |
| Email drafts | Content Generation | Claude Sonnet | P1 -- Month 2 |
| Meeting summaries | Summarization | Gemini Pro | P2 -- Month 3 |

**Recommendation:** Start with one AI feature. Ship it. Learn from production usage. Then add the next feature. Do not try to ship five AI features simultaneously.

---

## Quick Reference: Feature Type to Architecture

| Feature Type | Streaming | Vector DB | Tool Calling | Structured Output | Caching Priority |
|-------------|-----------|-----------|-------------|-------------------|-----------------|
| Chat Interface | Required | Optional | Common | Rare | Medium |
| Content Generation | Recommended | No | Rare | Required | High |
| Search / RAG | Recommended | Required | Rare | Optional | High |
| Classification | No | No | No | Required | Very High |
| Recommendation | No | Required | No | Optional | Very High |
| Summarization | Recommended | No | No | Optional | Medium |
| Image Generation | No | No | No | No | Low |
| Code Generation | Required | Optional | Optional | Optional | Medium |
