# LLM Integration Patterns

> How to connect your application to LLM providers. Five approaches from simple to sophisticated, each with full TypeScript code examples, trade-offs, and production considerations.

---

## Choosing Your Integration Approach

| Approach | Best For | Complexity | Streaming | Type Safety | Provider Lock-in |
|----------|----------|-----------|-----------|-------------|-----------------|
| Direct API Call | Prototypes, simple features | Low | Manual | None | High |
| Provider SDK | Production features, single provider | Medium | Built-in | Full | High |
| Vercel AI SDK | Next.js apps, chat UIs, multi-provider | Medium | Built-in | Full | Low |
| LangChain | Complex multi-step workflows, agents | High | Built-in | Partial | Low |
| LlamaIndex | RAG-focused applications | High | Built-in | Partial | Low |

**Recommendation:** Start with the **Vercel AI SDK** for most web applications. It provides the best developer experience with React hooks, built-in streaming, and provider-agnostic abstractions. Use **provider SDKs directly** when you need fine-grained control. Use **LangChain** only when you need complex agent workflows.

---

## 1. Direct API Call

The simplest approach. Raw HTTP requests to the provider API. No dependencies beyond `fetch`.

**Best for:** Quick prototypes, serverless functions, environments where you cannot install dependencies.

**Trade-offs:** No type safety. No automatic retries. Manual streaming parsing. Manual token counting.

```typescript
// Direct API call to Anthropic
async function callClaude(prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error.message}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
```

**Direct API with Streaming:**
```typescript
async function* streamClaude(prompt: string): AsyncGenerator<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

    for (const line of lines) {
      const data = JSON.parse(line.slice(6));
      if (data.type === "content_block_delta") {
        yield data.delta.text;
      }
    }
  }
}
```

---

## 2. Provider SDK

Official SDKs from Anthropic, OpenAI, and Google. Full type safety, automatic retries, built-in streaming, and proper error handling.

**Best for:** Production applications committed to a single provider.

### Anthropic SDK

```bash
npm install @anthropic-ai/sdk
```

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple completion
async function complete(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

// Streaming
async function streamComplete(prompt: string): Promise<ReadableStream> {
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  return new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(event.delta.text));
        }
      }
      controller.close();
    },
  });
}

// Tool calling
async function callWithTools(userMessage: string) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools: [
      {
        name: "get_weather",
        description: "Get the current weather for a location",
        input_schema: {
          type: "object" as const,
          properties: {
            location: { type: "string", description: "City name" },
          },
          required: ["location"],
        },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  return response;
}
```

### OpenAI SDK

```bash
npm install openai
```

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple completion
async function complete(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content ?? "";
}

// Streaming
async function streamComplete(prompt: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      process.stdout.write(content);
    }
  }
}

// Structured output with JSON mode
async function classifyWithSchema(content: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Classify the content. Respond in JSON: { "category": "...", "confidence": 0.0-1.0 }`,
      },
      { role: "user", content },
    ],
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}");
}
```

---

## 3. Vercel AI SDK

Provider-agnostic abstraction with React hooks for streaming, structured output, and tool calling. The best DX for Next.js applications.

**Best for:** Next.js apps, chat UIs, applications that may switch providers.

```bash
npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google
```

### Server-Side: API Route

```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are a helpful assistant for Acme Corp.
             You help users manage their projects and tasks.
             Be concise. Use markdown for formatting.`,
    messages,
    tools: {
      getProjects: tool({
        description: "List the user's projects",
        parameters: z.object({
          status: z.enum(["active", "archived", "all"]).optional(),
        }),
        execute: async ({ status }) => {
          // Your database query here
          return await db.projects.findMany({
            where: status && status !== "all" ? { status } : undefined,
          });
        },
      }),
      createTask: tool({
        description: "Create a new task in a project",
        parameters: z.object({
          projectId: z.string(),
          title: z.string(),
          priority: z.enum(["low", "medium", "high"]),
        }),
        execute: async ({ projectId, title, priority }) => {
          return await db.tasks.create({
            data: { projectId, title, priority },
          });
        },
      }),
    },
    maxSteps: 5, // Allow up to 5 tool calls per request
  });

  return result.toDataStreamResponse();
}
```

### Client-Side: React Chat Component

```typescript
// components/chat.tsx
"use client";

import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      onError: (err) => {
        console.error("Chat error:", err);
      },
    });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? "text-right" : "text-left"
            }
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}
      </form>
    </div>
  );
}
```

### Structured Output with Vercel AI SDK

```typescript
// Generate structured data (not streaming)
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const ProductDescriptionSchema = z.object({
  headline: z.string().max(60),
  description: z.string().max(300),
  features: z.array(z.string()).max(5),
  targetAudience: z.string(),
  tone: z.enum(["professional", "casual", "luxury", "playful"]),
});

export async function generateProductDescription(productInfo: string) {
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-20250514"),
    schema: ProductDescriptionSchema,
    prompt: `Generate a product description for: ${productInfo}`,
  });

  return object;
  // Returns typed object: { headline: string, description: string, ... }
}
```

### Provider Switching (Zero Code Change)

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

// Switch providers by changing one line
const MODEL_MAP = {
  primary: anthropic("claude-sonnet-4-20250514"),
  fallback: openai("gpt-4o"),
  cheap: google("gemini-2.5-flash"),
} as const;

export function getModel(tier: keyof typeof MODEL_MAP = "primary") {
  return MODEL_MAP[tier];
}
```

---

## 4. LangChain

Framework for building complex AI pipelines: chains, agents, RAG, and multi-step workflows.

**Best for:** Complex workflows that chain multiple LLM calls, agents with tool calling, RAG pipelines with custom retrievers.

**Trade-offs:** Heavy dependency. Abstractions can be opaque. Debugging is harder. Over-engineered for simple use cases.

```bash
npm install langchain @langchain/anthropic @langchain/core
```

### Simple Chain

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatAnthropic({
  modelName: "claude-sonnet-4-20250514",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert at summarizing {topic} documents."],
  ["human", "Summarize this:\n\n{text}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const result = await chain.invoke({
  topic: "legal",
  text: "The party of the first part hereby agrees...",
});
```

### RAG Chain

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatAnthropic({ modelName: "claude-sonnet-4-20250514" });

const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Answer questions based only on the following context.
     If the answer is not in the context, say "I don't have that information."

     Context: {context}`,
  ],
  ["human", "{input}"],
]);

const combineDocsChain = await createStuffDocumentsChain({
  llm: model,
  prompt: questionAnsweringPrompt,
});

const retrievalChain = await createRetrievalChain({
  retriever: vectorStore.asRetriever({ k: 5 }),
  combineDocsChain,
});

const response = await retrievalChain.invoke({
  input: "What is the refund policy?",
});

console.log(response.answer);
```

### Agent with Tools

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const searchTool = new DynamicStructuredTool({
  name: "search_database",
  description: "Search the product database by query",
  schema: z.object({
    query: z.string().describe("The search query"),
    limit: z.number().optional().default(5),
  }),
  func: async ({ query, limit }) => {
    const results = await db.products.search(query, limit);
    return JSON.stringify(results);
  },
});

const model = new ChatAnthropic({ modelName: "claude-sonnet-4-20250514" });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful product assistant. Use the tools to help users find products."],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = createToolCallingAgent({ llm: model, tools: [searchTool], prompt });
const executor = new AgentExecutor({ agent, tools: [searchTool] });

const result = await executor.invoke({
  input: "Find me a laptop under $1000 with good battery life",
});
```

---

## 5. LlamaIndex

Framework optimized for RAG: document loading, indexing, chunking, retrieval, and question answering.

**Best for:** RAG-focused applications where the primary AI feature is searching and querying documents.

**Trade-offs:** Narrower scope than LangChain. TypeScript support is newer and less mature than Python. Best for RAG, overkill for other AI features.

```bash
npm install llamaindex @llamaindex/anthropic @llamaindex/openai
```

```typescript
import {
  VectorStoreIndex,
  SimpleDirectoryReader,
  serviceContextFromDefaults,
} from "llamaindex";
import { Anthropic } from "@llamaindex/anthropic";
import { OpenAIEmbedding } from "@llamaindex/openai";

// Load and index documents
const documents = await new SimpleDirectoryReader().loadData("./docs");

const serviceContext = serviceContextFromDefaults({
  llm: new Anthropic({ model: "claude-sonnet-4-20250514" }),
  embedModel: new OpenAIEmbedding({ model: "text-embedding-3-small" }),
});

const index = await VectorStoreIndex.fromDocuments(documents, {
  serviceContext,
});

// Query
const queryEngine = index.asQueryEngine();
const response = await queryEngine.query("What is the return policy?");
console.log(response.toString());
```

---

## Key Patterns (Framework-Agnostic)

### Streaming Responses (SSE)

Every AI feature that generates text should stream. Users perceive streaming as 3-5x faster than waiting for a complete response.

```typescript
// Server: Next.js API route with SSE
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Your LLM streaming call here
      for await (const chunk of llmStream(prompt)) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Client: Consuming SSE stream
async function consumeStream(prompt: string, onChunk: (text: string) => void) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") return;
      const parsed = JSON.parse(data);
      onChunk(parsed.text);
    }
  }
}
```

### Conversation Memory (Sliding Window)

Keep the last N messages to stay within context window limits. Summarize older messages to preserve important context.

```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 20;
const SUMMARY_THRESHOLD = 30;

async function manageConversationHistory(
  messages: Message[],
  newMessage: Message
): Promise<Message[]> {
  const allMessages = [...messages, newMessage];

  if (allMessages.length <= MAX_MESSAGES) {
    return allMessages;
  }

  if (allMessages.length >= SUMMARY_THRESHOLD) {
    // Summarize older messages
    const oldMessages = allMessages.slice(0, -MAX_MESSAGES);
    const recentMessages = allMessages.slice(-MAX_MESSAGES);

    const summary = await summarizeMessages(oldMessages);

    return [
      { role: "assistant", content: `[Previous conversation summary: ${summary}]` },
      ...recentMessages,
    ];
  }

  // Simple sliding window
  return allMessages.slice(-MAX_MESSAGES);
}
```

### Context Window Management

Token counting prevents context overflow errors. Always count before sending.

```typescript
import { encodingForModel } from "js-tiktoken";

const encoding = encodingForModel("gpt-4o"); // Works as a rough estimate for all models

function countTokens(text: string): number {
  return encoding.encode(text).length;
}

function truncateToFit(
  systemPrompt: string,
  messages: Message[],
  maxTokens: number = 100000
): Message[] {
  const systemTokens = countTokens(systemPrompt);
  const outputReserve = 4096; // Reserve tokens for the response
  let budget = maxTokens - systemTokens - outputReserve;

  // Keep messages from most recent, drop oldest if over budget
  const result: Message[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = countTokens(messages[i].content);
    if (budget - msgTokens < 0) break;
    budget -= msgTokens;
    result.unshift(messages[i]);
  }

  return result;
}
```

### Error Handling and Retry

LLM APIs are unreliable. Always implement retries with exponential backoff.

```typescript
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxRetries: 3, baseDelay: 1000, maxDelay: 10000 }
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Do not retry on client errors (except rate limits)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      if (attempt === config.maxRetries) break;

      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        config.maxDelay
      );

      console.warn(
        `LLM call failed (attempt ${attempt + 1}/${config.maxRetries}):`,
        error.message,
        `Retrying in ${Math.round(delay)}ms`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage
const response = await withRetry(() =>
  anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  })
);
```

### Rate Limiting Per User

Prevent any single user from consuming your entire AI budget.

```typescript
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

async function checkAIRateLimit(
  userId: string,
  limit: number = 50, // requests per window
  windowSeconds: number = 3600 // 1 hour
): Promise<RateLimitResult> {
  const key = `ai:ratelimit:${userId}`;
  const now = Math.floor(Date.now() / 1000);

  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, 0, now - windowSeconds);
  pipe.zadd(key, now.toString(), `${now}:${Math.random()}`);
  pipe.zcard(key);
  pipe.expire(key, windowSeconds);

  const results = await pipe.exec();
  const count = results![2][1] as number;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: new Date((now + windowSeconds) * 1000),
  };
}

// Usage in API route
export async function POST(req: Request) {
  const userId = getUserId(req);
  const { allowed, remaining } = await checkAIRateLimit(userId);

  if (!allowed) {
    return new Response("AI rate limit exceeded", {
      status: 429,
      headers: { "X-RateLimit-Remaining": remaining.toString() },
    });
  }

  // Proceed with AI call...
}
```

### Provider Failover

Automatic fallback when primary provider is down.

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

const PROVIDERS = [
  { name: "anthropic", model: anthropic("claude-sonnet-4-20250514") },
  { name: "openai", model: openai("gpt-4o") },
] as const;

async function streamWithFailover(messages: any[]) {
  for (const provider of PROVIDERS) {
    try {
      const result = streamText({
        model: provider.model,
        messages,
      });
      console.log(`Using provider: ${provider.name}`);
      return result;
    } catch (error: any) {
      console.warn(`Provider ${provider.name} failed:`, error.message);
      continue;
    }
  }

  throw new Error("All AI providers are unavailable");
}
```

---

## Decision Matrix: Which Integration to Use

```
Is your app a Next.js/React app?
├── YES → Do you need complex multi-step AI workflows (agents, chains)?
│   ├── YES → Use LangChain (with Vercel AI SDK for the UI layer)
│   └── NO → Use Vercel AI SDK (covers 90% of use cases)
└── NO → Is your backend Node.js/TypeScript?
    ├── YES → Do you need RAG as the primary feature?
    │   ├── YES → Use LlamaIndex
    │   └── NO → Use Provider SDK directly
    └── NO → Use Direct API calls (any language with HTTP)
```
