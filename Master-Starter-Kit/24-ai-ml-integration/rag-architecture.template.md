# RAG Architecture Blueprint

> Complete Retrieval-Augmented Generation pipeline for {{PROJECT_NAME}}. This template defines the document ingestion, chunking, embedding, storage, retrieval, and generation stages for your RAG system.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    INGESTION PIPELINE                            │
│                                                                  │
│  Upload → Extract Text → Clean → Chunk → Embed → Store (Vector) │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    RETRIEVAL PIPELINE                            │
│                                                                  │
│  User Query → Embed Query → Vector Search → Re-rank →           │
│  Construct Prompt (System + Context + Query) → LLM → Response   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Provider:** {{AI_PROVIDER}}
**Framework:** {{AI_FRAMEWORK}}
**Vector Database:** {{VECTOR_DB}}

---

## 1. Document Ingestion Pipeline

### Pipeline Steps

```typescript
// lib/ai/ingestion.ts

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    title: string;
    uploadedBy: string;
    uploadedAt: Date;
    // {{PROJECT_NAME}}-specific metadata
    // Add your domain-specific fields here
  };
}

interface Chunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: Document["metadata"] & {
    chunkIndex: number;
    totalChunks: number;
  };
}

export async function ingestDocument(file: File, userId: string): Promise<void> {
  // Step 1: Extract text
  const text = await extractText(file);

  // Step 2: Clean text
  const cleaned = cleanText(text);

  // Step 3: Chunk
  const chunks = await chunkText(cleaned, file.name);

  // Step 4: Generate embeddings
  const embeddings = await generateEmbeddings(chunks.map((c) => c.content));

  // Step 5: Store in vector database
  await storeChunks(
    chunks.map((chunk, i) => ({
      ...chunk,
      embedding: embeddings[i],
      metadata: {
        ...chunk.metadata,
        source: file.name,
        title: file.name.replace(/\.[^.]+$/, ""),
        uploadedBy: userId,
        uploadedAt: new Date(),
      },
    }))
  );
}
```

### Text Extraction

```typescript
// lib/ai/extractors.ts

export async function extractText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return extractPDF(file);
    case "docx":
      return extractDOCX(file);
    case "txt":
    case "md":
      return file.text();
    case "html":
      return extractHTML(file);
    case "csv":
      return extractCSV(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

async function extractPDF(file: File): Promise<string> {
  // Using pdf-parse
  const pdfParse = await import("pdf-parse");
  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdfParse.default(buffer);
  return data.text;
}

async function extractDOCX(file: File): Promise<string> {
  // Using mammoth
  const mammoth = await import("mammoth");
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractHTML(file: File): Promise<string> {
  const html = await file.text();
  // Strip tags, keep text content
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function extractCSV(file: File): Promise<string> {
  const text = await file.text();
  // Convert CSV rows to natural language for better embedding
  const rows = text.split("\n");
  const headers = rows[0].split(",");
  return rows
    .slice(1)
    .map((row) => {
      const values = row.split(",");
      return headers.map((h, i) => `${h.trim()}: ${values[i]?.trim()}`).join(", ");
    })
    .join("\n");
}
```

### Text Cleaning

```typescript
// lib/ai/clean.ts

export function cleanText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove page numbers
      .replace(/\bPage\s+\d+\s*(of\s+\d+)?\b/gi, "")
      // Remove headers/footers that repeat
      .replace(/(.{20,})\n(?:.*\n)*?\1/g, "$1")
      // Normalize unicode
      .normalize("NFKC")
      // Remove null bytes
      .replace(/\0/g, "")
      .trim()
  );
}
```

---

## 2. Chunking Strategy

### Decision Tree: Choosing a Chunking Strategy

```
What type of content are you chunking?
├── Structured documents (headers, sections) → Semantic chunking
├── Code files → Code-aware chunking (split on functions/classes)
├── Conversational data → Message-boundary chunking
├── Tables/CSV → Row-based chunking
└── General text → Recursive character splitting (default)
```

### Recursive Character Splitting (Recommended Default)

```typescript
// lib/ai/chunking.ts

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Production-tested defaults for {{PROJECT_NAME}}
const CHUNK_CONFIG = {
  chunkSize: 512,       // tokens (roughly 2000 characters)
  chunkOverlap: 50,     // tokens overlap between chunks
  separators: ["\n\n", "\n", ". ", " ", ""], // Split priority
};

export async function chunkText(
  text: string,
  source: string
): Promise<{ content: string; metadata: { chunkIndex: number; totalChunks: number } }[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_CONFIG.chunkSize * 4, // Approximate chars per token
    chunkOverlap: CHUNK_CONFIG.chunkOverlap * 4,
    separators: CHUNK_CONFIG.separators,
  });

  const docs = await splitter.createDocuments([text]);

  return docs.map((doc, index) => ({
    content: doc.pageContent,
    metadata: {
      chunkIndex: index,
      totalChunks: docs.length,
    },
  }));
}
```

### Semantic Chunking (For Structured Documents)

```typescript
// Split on document structure: headers, sections, paragraphs
export function semanticChunk(
  markdown: string
): { content: string; heading: string }[] {
  const sections: { content: string; heading: string }[] = [];
  let currentHeading = "Introduction";
  let currentContent: string[] = [];

  for (const line of markdown.split("\n")) {
    if (line.startsWith("#")) {
      if (currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join("\n").trim(),
        });
      }
      currentHeading = line.replace(/^#+\s*/, "");
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Last section
  if (currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join("\n").trim(),
    });
  }

  // Further split large sections using recursive splitting
  return sections.flatMap((section) => {
    if (section.content.length > 2000) {
      // Split large sections but preserve the heading context
      const subChunks = chunkText(section.content, section.heading);
      // chunkText returns a promise -- handle accordingly in real code
      return [section]; // Simplified for illustration
    }
    return [section];
  });
}
```

### Chunking Configuration Reference

| Content Type | Chunk Size | Overlap | Separator Strategy |
|-------------|-----------|---------|-------------------|
| General text | 512 tokens | 50 tokens | Recursive (paragraphs → sentences → words) |
| Technical docs | 1024 tokens | 100 tokens | Semantic (headers → paragraphs) |
| Legal documents | 512 tokens | 100 tokens | Paragraph-based with high overlap |
| Code files | 1500 tokens | 200 tokens | Function/class boundaries |
| Chat logs | 256 tokens | 0 tokens | Message boundaries |
| FAQ/Q&A | 256 tokens | 0 tokens | Question-answer pairs |

---

## 3. Embedding Model Selection

| Model | Provider | Dimensions | Cost per 1M Tokens | Quality (MTEB) | Notes |
|-------|----------|-----------|--------------------|--------------------|-------|
| text-embedding-3-small | OpenAI | 1536 | $0.02 | Good | Best cost/quality ratio |
| text-embedding-3-large | OpenAI | 3072 | $0.13 | Excellent | Best quality from OpenAI |
| embed-v4.0 | Cohere | 1024 | $0.10 | Excellent | Good multilingual support |
| BGE-large-en-v1.5 | Open Source | 1024 | Free (self-hosted) | Good | No API costs, requires GPU |
| E5-large-v2 | Open Source | 1024 | Free (self-hosted) | Good | Microsoft, good for search |
| Gemini Embedding | Google | 768 | $0.00 (preview) | Good | Free during preview |

**Recommendation for {{PROJECT_NAME}}:** Start with `text-embedding-3-small`. It is cheap ($0.02/1M tokens), produces good-quality embeddings, and is the most widely used. Switch to `text-embedding-3-large` only if retrieval quality is insufficient.

### Embedding Generation

```typescript
// lib/ai/embeddings.ts

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_SIZE = 100; // OpenAI supports up to 2048 inputs per request

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });

    embeddings.push(...response.data.map((d) => d.embedding));
  }

  return embeddings;
}

export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });

  return response.data[0].embedding;
}

export { EMBEDDING_DIMENSIONS };
```

---

## 4. Vector Database Configuration

<!-- IF {{VECTOR_DB}} == "pgvector" -->

### pgvector (PostgreSQL)

```sql
-- Enable the extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the chunks table
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  chunk_index INTEGER NOT NULL,
  total_chunks INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index (better recall, slower build)
CREATE INDEX ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Or IVFFlat index (faster build, good for prototyping)
-- CREATE INDEX ON document_chunks
--   USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 100);
```

```typescript
// lib/ai/vectordb.ts (pgvector with Drizzle)

import { pgTable, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// Note: Drizzle does not natively support vector columns.
// Use raw SQL for vector operations.

export async function storeChunks(chunks: Chunk[]): Promise<void> {
  for (const chunk of chunks) {
    await db.execute(sql`
      INSERT INTO document_chunks (document_id, content, embedding, chunk_index, total_chunks, metadata)
      VALUES (
        ${chunk.documentId},
        ${chunk.content},
        ${JSON.stringify(chunk.embedding)}::vector,
        ${chunk.metadata.chunkIndex},
        ${chunk.metadata.totalChunks},
        ${JSON.stringify(chunk.metadata)}::jsonb
      )
    `);
  }
}

export async function searchSimilar(
  queryEmbedding: number[],
  topK: number = 5,
  filter?: Record<string, any>
): Promise<{ content: string; similarity: number; metadata: any }[]> {
  const filterClause = filter
    ? sql`AND metadata @> ${JSON.stringify(filter)}::jsonb`
    : sql``;

  const results = await db.execute(sql`
    SELECT
      content,
      metadata,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) AS similarity
    FROM document_chunks
    WHERE 1=1 ${filterClause}
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${topK}
  `);

  return results.rows as any[];
}
```

<!-- ENDIF -->

<!-- IF {{VECTOR_DB}} == "pinecone" -->

### Pinecone

```typescript
// lib/ai/vectordb.ts (Pinecone)

import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const INDEX_NAME = "{{PROJECT_NAME}}-docs";
const index = pinecone.index(INDEX_NAME);

export async function storeChunks(chunks: Chunk[]): Promise<void> {
  const vectors = chunks.map((chunk) => ({
    id: chunk.id,
    values: chunk.embedding,
    metadata: {
      content: chunk.content,
      documentId: chunk.documentId,
      chunkIndex: chunk.metadata.chunkIndex,
      source: chunk.metadata.source,
    },
  }));

  // Pinecone supports up to 100 vectors per upsert
  for (let i = 0; i < vectors.length; i += 100) {
    await index.upsert(vectors.slice(i, i + 100));
  }
}

export async function searchSimilar(
  queryEmbedding: number[],
  topK: number = 5,
  filter?: Record<string, any>
): Promise<{ content: string; similarity: number; metadata: any }[]> {
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter,
  });

  return results.matches.map((match) => ({
    content: match.metadata?.content as string,
    similarity: match.score ?? 0,
    metadata: match.metadata,
  }));
}
```

<!-- ENDIF -->

<!-- IF {{VECTOR_DB}} == "chroma" -->

### Chroma

```typescript
// lib/ai/vectordb.ts (Chroma)

import { ChromaClient } from "chromadb";

const chroma = new ChromaClient({ path: process.env.CHROMA_URL });

const COLLECTION_NAME = "{{PROJECT_NAME}}-docs";

export async function getCollection() {
  return chroma.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
  });
}

export async function storeChunks(chunks: Chunk[]): Promise<void> {
  const collection = await getCollection();

  await collection.add({
    ids: chunks.map((c) => c.id),
    embeddings: chunks.map((c) => c.embedding),
    documents: chunks.map((c) => c.content),
    metadatas: chunks.map((c) => c.metadata as any),
  });
}

export async function searchSimilar(
  queryEmbedding: number[],
  topK: number = 5,
  filter?: Record<string, any>
): Promise<{ content: string; similarity: number; metadata: any }[]> {
  const collection = await getCollection();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where: filter,
  });

  return (results.documents[0] ?? []).map((doc, i) => ({
    content: doc ?? "",
    similarity: 1 - (results.distances?.[0]?.[i] ?? 0),
    metadata: results.metadatas?.[0]?.[i] ?? {},
  }));
}
```

<!-- ENDIF -->

---

## 5. Retrieval Patterns

### Basic Top-K Similarity Search

```typescript
// lib/ai/retrieval.ts

export async function retrieve(
  query: string,
  topK: number = 5
): Promise<{ content: string; similarity: number; metadata: any }[]> {
  const queryEmbedding = await generateQueryEmbedding(query);
  return searchSimilar(queryEmbedding, topK);
}
```

### Hybrid Search (Vector + BM25 Keyword)

```typescript
// Combine vector similarity with keyword search for better recall
export async function hybridSearch(
  query: string,
  topK: number = 5,
  alpha: number = 0.7 // 0 = full keyword, 1 = full vector
): Promise<{ content: string; score: number }[]> {
  // Vector search
  const vectorResults = await retrieve(query, topK * 2);

  // Keyword search (using PostgreSQL full-text search)
  const keywordResults = await db.execute(sql`
    SELECT content, ts_rank(to_tsvector('english', content), plainto_tsquery('english', ${query})) AS rank
    FROM document_chunks
    WHERE to_tsvector('english', content) @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${topK * 2}
  `);

  // Reciprocal Rank Fusion
  const scores = new Map<string, number>();

  vectorResults.forEach((r, i) => {
    const rrf = 1 / (60 + i); // k=60 is standard for RRF
    scores.set(r.content, (scores.get(r.content) ?? 0) + alpha * rrf);
  });

  (keywordResults.rows as any[]).forEach((r: any, i: number) => {
    const rrf = 1 / (60 + i);
    scores.set(r.content, (scores.get(r.content) ?? 0) + (1 - alpha) * rrf);
  });

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([content, score]) => ({ content, score }));
}
```

### Re-ranking with Cross-Encoder

```typescript
// Use a cross-encoder model to re-rank initial retrieval results
// This is more accurate than embedding similarity alone
export async function retrieveAndRerank(
  query: string,
  topK: number = 5
): Promise<{ content: string; score: number }[]> {
  // Step 1: Over-retrieve (get more candidates than needed)
  const candidates = await retrieve(query, topK * 3);

  // Step 2: Re-rank with cross-encoder (Cohere Rerank API)
  const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

  const reranked = await cohere.rerank({
    model: "rerank-english-v3.0",
    query,
    documents: candidates.map((c) => c.content),
    topN: topK,
  });

  return reranked.results.map((r) => ({
    content: candidates[r.index].content,
    score: r.relevanceScore,
  }));
}
```

### Metadata Filtering

```typescript
// Filter retrieval by document metadata (tenant, type, date, etc.)
export async function retrieveForUser(
  query: string,
  userId: string,
  documentType?: string,
  topK: number = 5
): Promise<{ content: string; similarity: number }[]> {
  const queryEmbedding = await generateQueryEmbedding(query);

  const filter: Record<string, any> = {
    uploadedBy: userId,
  };

  if (documentType) {
    filter.type = documentType;
  }

  return searchSimilar(queryEmbedding, topK, filter);
}
```

---

## 6. Prompt Construction

### RAG Prompt Template

```typescript
// lib/ai/prompt.ts

export function constructRAGPrompt(
  query: string,
  retrievedChunks: { content: string; metadata: any }[],
  systemContext?: string
): { system: string; user: string } {
  const context = retrievedChunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1}: ${chunk.metadata.source ?? "unknown"}]\n${chunk.content}`
    )
    .join("\n\n---\n\n");

  const system = `You are a helpful assistant for {{PROJECT_NAME}}.
Answer questions based ONLY on the provided context documents.
${systemContext ?? ""}

Rules:
- If the answer is not in the context, say "I don't have enough information to answer that question."
- Always cite your sources using [Source N] notation.
- Be concise and accurate.
- Do not make up information that is not in the context.
- If the context is ambiguous, acknowledge the ambiguity.`;

  const user = `Context documents:

${context}

---

Question: ${query}

Answer based on the context above. Cite sources using [Source N].`;

  return { system, user };
}
```

### Full RAG Pipeline

```typescript
// lib/ai/rag.ts

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export async function ragQuery(query: string, userId: string) {
  // Step 1: Retrieve relevant chunks
  const chunks = await retrieveForUser(query, userId, undefined, 5);

  // Step 2: Construct prompt
  const { system, user } = constructRAGPrompt(query, chunks);

  // Step 3: Generate response with streaming
  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system,
    messages: [{ role: "user", content: user }],
    temperature: 0.1, // Low temperature for factual responses
  });

  return {
    stream: result.toDataStreamResponse(),
    sources: chunks.map((c) => ({
      source: c.metadata.source,
      content: c.content.slice(0, 200) + "...",
      similarity: c.similarity,
    })),
  };
}

// API Route
export async function POST(req: Request) {
  const { query } = await req.json();
  const userId = getUserId(req);

  const { stream, sources } = await ragQuery(query, userId);

  // Include sources in response headers (or return alongside stream)
  return stream;
}
```

---

## 7. Evaluation

### Retrieval Quality Metrics

```typescript
// lib/ai/eval.ts

interface EvalResult {
  query: string;
  retrievedDocs: string[];
  relevantDocs: string[];  // Ground truth
  precision: number;       // How many retrieved docs are relevant
  recall: number;          // How many relevant docs were retrieved
  mrr: number;             // Mean Reciprocal Rank
}

export function evaluateRetrieval(
  retrieved: string[],
  relevant: string[]
): { precision: number; recall: number; mrr: number } {
  const retrievedSet = new Set(retrieved);
  const relevantSet = new Set(relevant);

  const truePositives = [...retrievedSet].filter((d) => relevantSet.has(d)).length;

  const precision = retrieved.length > 0 ? truePositives / retrieved.length : 0;
  const recall = relevant.length > 0 ? truePositives / relevant.length : 0;

  // MRR: rank of first relevant result
  const firstRelevantRank = retrieved.findIndex((d) => relevantSet.has(d));
  const mrr = firstRelevantRank >= 0 ? 1 / (firstRelevantRank + 1) : 0;

  return { precision, recall, mrr };
}
```

### Hallucination Detection

```typescript
// Use a second LLM call to check if the answer is grounded in the context
export async function checkHallucination(
  answer: string,
  context: string
): Promise<{ isGrounded: boolean; explanation: string }> {
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-20250514"),
    schema: z.object({
      isGrounded: z.boolean().describe("Whether the answer is fully supported by the context"),
      unsupportedClaims: z.array(z.string()).describe("Claims in the answer not found in context"),
      explanation: z.string(),
    }),
    prompt: `Check if this answer is fully grounded in the provided context.

Context:
${context}

Answer:
${answer}

Is every claim in the answer supported by the context?`,
  });

  return {
    isGrounded: object.isGrounded,
    explanation: object.explanation,
  };
}
```

---

## Configuration Summary for {{PROJECT_NAME}}

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Embedding Model | {{AI_PROVIDER}} embeddings | — |
| Vector Database | {{VECTOR_DB}} | — |
| Chunk Size | 512 tokens | — |
| Chunk Overlap | 50 tokens | — |
| Retrieval Strategy | Top-K with re-ranking | — |
| Generation Model | {{AI_PROVIDER}} | — |
| Framework | {{AI_FRAMEWORK}} | — |

**Estimated Cost per Query:**
- Embedding: ~$0.0001 (single query embedding)
- Vector search: ~$0.0001 (database query)
- Generation: ~$0.005 - $0.03 (depends on context length)
- **Total: ~$0.005 - $0.03 per RAG query**
