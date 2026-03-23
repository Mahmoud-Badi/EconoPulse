# Vector Database Patterns

> Deep dive into vector database setup, schema design, query patterns, and performance tuning for pgvector, Pinecone, Chroma, and Weaviate. Choose one. Configure it correctly the first time.

---

## Quick Decision Matrix

| Factor | pgvector | Pinecone | Chroma | Weaviate |
|--------|----------|----------|--------|----------|
| **Best for** | Simple RAG, already on PostgreSQL | Production RAG at scale | Prototyping, local dev | Hybrid search (vector + keyword) |
| **Max vectors** | ~5M (practical) | Billions | ~1M (practical) | Billions |
| **Managed service** | Via Supabase/Neon | Yes (fully managed) | No (self-hosted) | Yes (Weaviate Cloud) |
| **Cost** | Free (part of PostgreSQL) | $0.033/1K vectors/month | Free (open source) | Free tier + paid cloud |
| **Setup complexity** | Low (PostgreSQL extension) | Low (SDK + API key) | Low (pip/npm install) | Medium (Docker or cloud) |
| **Hybrid search** | Manual (combine with pg full-text) | Sparse vectors | No | Native (vector + BM25) |
| **Filtering** | SQL WHERE clauses | Metadata filtering | Metadata filtering | GraphQL-like filtering |

### Decision Tree

```
Are you already using PostgreSQL?
├── YES → Do you have < 1M vectors?
│   ├── YES → Use pgvector (simplest, no new infrastructure)
│   └── NO → Do you need hybrid search?
│       ├── YES → Use Weaviate
│       └── NO → Use Pinecone
└── NO → Are you prototyping / in early development?
    ├── YES → Use Chroma (fastest to set up, no account needed)
    └── NO → Do you need hybrid search (vector + keyword)?
        ├── YES → Use Weaviate
        └── NO → Use Pinecone (best managed service for pure vector search)
```

---

## 1. pgvector (PostgreSQL)

The simplest option if you are already running PostgreSQL. Add a column, create an index, query with SQL.

### Setup

```sql
-- Enable the extension (run once)
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
SELECT extversion FROM pg_extension WHERE extname = 'vector';
```

### Schema Design

```sql
-- Documents table (source files)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_url TEXT,
  file_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chunks table (embeddings)
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,  -- OpenAI text-embedding-3-small dimensions
  chunk_index INTEGER NOT NULL,
  total_chunks INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector similarity search
-- Choose ONE of the following:

-- Option A: HNSW (recommended for production)
-- Better recall, slower to build, faster queries
CREATE INDEX idx_chunks_embedding_hnsw ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Option B: IVFFlat (good for prototyping)
-- Faster to build, slightly lower recall
-- CREATE INDEX idx_chunks_embedding_ivfflat ON document_chunks
--   USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 100);

-- Metadata filtering index
CREATE INDEX idx_chunks_metadata ON document_chunks USING GIN (metadata);

-- Index for cascading deletes
CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);
```

### Index Comparison

| Index Type | Build Time | Query Speed | Recall | Memory | When to Use |
|-----------|-----------|-------------|--------|--------|-------------|
| HNSW | Slow (minutes-hours) | Fast | 95-99% | High | Production (<5M vectors) |
| IVFFlat | Fast (seconds-minutes) | Medium | 85-95% | Medium | Prototyping, frequent rebuilds |
| None (exact) | N/A | Very slow | 100% | Low | <10K vectors, testing |

### HNSW Tuning Parameters

```sql
-- m: connections per node (higher = better recall, more memory)
-- ef_construction: build-time search width (higher = better recall, slower build)

-- Conservative (fast build, good recall)
CREATE INDEX ... WITH (m = 16, ef_construction = 64);

-- Balanced (recommended)
CREATE INDEX ... WITH (m = 24, ef_construction = 128);

-- High recall (slow build, best quality)
CREATE INDEX ... WITH (m = 32, ef_construction = 256);

-- Query-time tuning (set per session)
SET hnsw.ef_search = 100;  -- Higher = better recall, slower query (default: 40)
```

### Query Patterns

```typescript
// lib/vectordb/pgvector.ts

import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// Cosine similarity search
export async function searchSimilar(
  queryEmbedding: number[],
  topK: number = 5,
  filters?: { documentId?: string; uploadedBy?: string }
): Promise<{ id: string; content: string; similarity: number; metadata: any }[]> {
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  let filterClauses = "";
  const params: any[] = [];

  if (filters?.documentId) {
    filterClauses += ` AND dc.document_id = $${params.length + 1}`;
    params.push(filters.documentId);
  }

  if (filters?.uploadedBy) {
    filterClauses += ` AND d.uploaded_by = $${params.length + 1}`;
    params.push(filters.uploadedBy);
  }

  const results = await db.execute(sql.raw(`
    SELECT
      dc.id,
      dc.content,
      dc.metadata,
      1 - (dc.embedding <=> '${embeddingStr}'::vector) AS similarity
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE 1=1 ${filterClauses}
    ORDER BY dc.embedding <=> '${embeddingStr}'::vector
    LIMIT ${topK}
  `));

  return results.rows as any[];
}

// Inner product search (for normalized embeddings)
export async function searchByInnerProduct(
  queryEmbedding: number[],
  topK: number = 5
) {
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  return db.execute(sql.raw(`
    SELECT id, content,
      (embedding <#> '${embeddingStr}'::vector) * -1 AS similarity
    FROM document_chunks
    ORDER BY embedding <#> '${embeddingStr}'::vector
    LIMIT ${topK}
  `));
}

// L2 (Euclidean) distance search
export async function searchByL2Distance(
  queryEmbedding: number[],
  topK: number = 5
) {
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  return db.execute(sql.raw(`
    SELECT id, content,
      embedding <-> '${embeddingStr}'::vector AS distance
    FROM document_chunks
    ORDER BY embedding <-> '${embeddingStr}'::vector
    LIMIT ${topK}
  `));
}

// Hybrid search: vector + full-text (PostgreSQL)
export async function hybridSearch(
  query: string,
  queryEmbedding: number[],
  topK: number = 5,
  vectorWeight: number = 0.7
): Promise<{ content: string; score: number }[]> {
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const results = await db.execute(sql.raw(`
    WITH vector_results AS (
      SELECT id, content,
        1 - (embedding <=> '${embeddingStr}'::vector) AS vector_score,
        ROW_NUMBER() OVER (ORDER BY embedding <=> '${embeddingStr}'::vector) AS vector_rank
      FROM document_chunks
      ORDER BY embedding <=> '${embeddingStr}'::vector
      LIMIT ${topK * 3}
    ),
    text_results AS (
      SELECT id, content,
        ts_rank(to_tsvector('english', content), plainto_tsquery('english', '${query}')) AS text_score,
        ROW_NUMBER() OVER (ORDER BY ts_rank(to_tsvector('english', content), plainto_tsquery('english', '${query}')) DESC) AS text_rank
      FROM document_chunks
      WHERE to_tsvector('english', content) @@ plainto_tsquery('english', '${query}')
      LIMIT ${topK * 3}
    )
    SELECT
      COALESCE(v.content, t.content) AS content,
      COALESCE(1.0 / (60 + v.vector_rank), 0) * ${vectorWeight} +
      COALESCE(1.0 / (60 + t.text_rank), 0) * ${1 - vectorWeight} AS rrf_score
    FROM vector_results v
    FULL OUTER JOIN text_results t ON v.id = t.id
    ORDER BY rrf_score DESC
    LIMIT ${topK}
  `));

  return results.rows as any[];
}
```

### Batch Operations

```typescript
// Efficient batch insert
export async function batchInsertChunks(
  chunks: { documentId: string; content: string; embedding: number[]; metadata: any }[]
): Promise<void> {
  // pgvector supports COPY for fastest bulk loading
  // For moderate sizes, use multi-row INSERT
  const values = chunks
    .map(
      (c) =>
        `('${c.documentId}', '${c.content.replace(/'/g, "''")}', '[${c.embedding.join(",")}]'::vector, '${JSON.stringify(c.metadata)}'::jsonb)`
    )
    .join(",\n");

  await db.execute(sql.raw(`
    INSERT INTO document_chunks (document_id, content, embedding, metadata)
    VALUES ${values}
  `));
}

// Delete all chunks for a document
export async function deleteDocumentChunks(documentId: string): Promise<void> {
  await db.execute(sql`
    DELETE FROM document_chunks WHERE document_id = ${documentId}
  `);
}
```

---

## 2. Pinecone

Fully managed vector database. No infrastructure to manage. Best for production at scale.

### Setup

```bash
npm install @pinecone-database/pinecone
```

```typescript
// lib/vectordb/pinecone.ts

import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Create index (do this once, via dashboard or script)
async function createIndex() {
  await pinecone.createIndex({
    name: "my-app-docs",
    dimension: 1536,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });
}

const index = pinecone.index("my-app-docs");
```

### Namespace Organization

Use namespaces to isolate data by tenant or document type.

```typescript
// Per-tenant namespace (multi-tenant SaaS)
function getNamespace(tenantId: string) {
  return index.namespace(`tenant-${tenantId}`);
}

// Per-document-type namespace
function getTypedNamespace(type: "docs" | "faq" | "tickets") {
  return index.namespace(type);
}
```

### CRUD Operations

```typescript
// Upsert vectors
export async function upsertChunks(
  tenantId: string,
  chunks: { id: string; embedding: number[]; content: string; metadata: Record<string, any> }[]
): Promise<void> {
  const ns = getNamespace(tenantId);

  const vectors = chunks.map((chunk) => ({
    id: chunk.id,
    values: chunk.embedding,
    metadata: {
      content: chunk.content, // Store content in metadata for retrieval
      ...chunk.metadata,
    },
  }));

  // Pinecone supports up to 100 vectors per upsert
  for (let i = 0; i < vectors.length; i += 100) {
    await ns.upsert(vectors.slice(i, i + 100));
  }
}

// Query with metadata filtering
export async function searchSimilar(
  tenantId: string,
  queryEmbedding: number[],
  topK: number = 5,
  filter?: Record<string, any>
): Promise<{ id: string; content: string; score: number; metadata: any }[]> {
  const ns = getNamespace(tenantId);

  const results = await ns.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter, // e.g., { documentType: "policy", status: "active" }
  });

  return results.matches.map((match) => ({
    id: match.id,
    content: (match.metadata?.content as string) ?? "",
    score: match.score ?? 0,
    metadata: match.metadata ?? {},
  }));
}

// Delete by ID
export async function deleteChunks(tenantId: string, ids: string[]): Promise<void> {
  const ns = getNamespace(tenantId);
  await ns.deleteMany(ids);
}

// Delete all chunks for a document (using metadata filter)
export async function deleteByDocument(tenantId: string, documentId: string): Promise<void> {
  const ns = getNamespace(tenantId);
  await ns.deleteMany({ documentId });
}

// Delete entire namespace (e.g., when a tenant is deleted)
export async function deleteTenantData(tenantId: string): Promise<void> {
  const ns = getNamespace(tenantId);
  await ns.deleteAll();
}
```

### Metadata Filtering Examples

```typescript
// Pinecone supports: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $and, $or

// Filter by document type
const results = await searchSimilar(tenantId, embedding, 5, {
  documentType: { $eq: "policy" },
});

// Filter by date range
const results = await searchSimilar(tenantId, embedding, 5, {
  createdAt: { $gte: "2025-01-01" },
});

// Complex filter
const results = await searchSimilar(tenantId, embedding, 5, {
  $and: [
    { documentType: { $in: ["policy", "faq"] } },
    { status: { $eq: "active" } },
    { createdAt: { $gte: "2025-01-01" } },
  ],
});
```

---

## 3. Chroma

Local-first vector database. Zero configuration. Best for prototyping and small datasets.

### Setup

```bash
npm install chromadb
```

```typescript
// lib/vectordb/chroma.ts

import { ChromaClient, Collection } from "chromadb";

// Local Chroma (in-memory or persistent)
const chroma = new ChromaClient({
  path: process.env.CHROMA_URL ?? "http://localhost:8000",
});

// Create or get collection
async function getCollection(): Promise<Collection> {
  return chroma.getOrCreateCollection({
    name: "documents",
    metadata: {
      "hnsw:space": "cosine", // cosine, l2, or ip
    },
  });
}
```

### Operations

```typescript
// Add documents (Chroma can auto-embed if configured with an embedding function)
export async function addChunks(
  chunks: { id: string; content: string; embedding: number[]; metadata: Record<string, any> }[]
): Promise<void> {
  const collection = await getCollection();

  await collection.add({
    ids: chunks.map((c) => c.id),
    embeddings: chunks.map((c) => c.embedding),
    documents: chunks.map((c) => c.content),
    metadatas: chunks.map((c) => c.metadata),
  });
}

// Query
export async function searchSimilar(
  queryEmbedding: number[],
  topK: number = 5,
  filter?: Record<string, any>
): Promise<{ id: string; content: string; distance: number; metadata: any }[]> {
  const collection = await getCollection();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where: filter, // e.g., { documentType: "policy" }
  });

  return (results.ids[0] ?? []).map((id, i) => ({
    id,
    content: results.documents[0]?.[i] ?? "",
    distance: results.distances?.[0]?.[i] ?? 0,
    metadata: results.metadatas?.[0]?.[i] ?? {},
  }));
}

// Update
export async function updateChunk(
  id: string,
  content: string,
  embedding: number[],
  metadata: Record<string, any>
): Promise<void> {
  const collection = await getCollection();

  await collection.update({
    ids: [id],
    embeddings: [embedding],
    documents: [content],
    metadatas: [metadata],
  });
}

// Delete
export async function deleteChunks(ids: string[]): Promise<void> {
  const collection = await getCollection();
  await collection.delete({ ids });
}
```

### Running Chroma

```bash
# Docker (recommended for development)
docker run -p 8000:8000 chromadb/chroma

# Or persistent storage
docker run -p 8000:8000 -v ./chroma-data:/chroma/chroma chromadb/chroma
```

---

## 4. Weaviate

Best for hybrid search (vector + keyword). Built-in BM25 search alongside vector similarity.

### Setup

```bash
npm install weaviate-client
```

```typescript
// lib/vectordb/weaviate.ts

import weaviate, { WeaviateClient } from "weaviate-client";

const client: WeaviateClient = await weaviate.connectToLocal();
// Or: await weaviate.connectToWeaviateCloud(process.env.WEAVIATE_URL!, { authCredentials: ... });
```

### Schema Definition

```typescript
// Define collection (class in Weaviate terms)
async function createCollection() {
  await client.collections.create({
    name: "DocumentChunk",
    properties: [
      { name: "content", dataType: "text" },
      { name: "documentId", dataType: "text" },
      { name: "documentType", dataType: "text" },
      { name: "chunkIndex", dataType: "int" },
      { name: "source", dataType: "text" },
    ],
    vectorizers: [
      {
        name: "default",
        vectorizerConfig: weaviate.configure.vectorizer.none(), // We provide our own embeddings
      },
    ],
  });
}
```

### Operations

```typescript
// Add with pre-computed embeddings
export async function addChunks(
  chunks: { content: string; embedding: number[]; documentId: string; source: string; chunkIndex: number }[]
): Promise<void> {
  const collection = client.collections.get("DocumentChunk");

  const objects = chunks.map((chunk) => ({
    properties: {
      content: chunk.content,
      documentId: chunk.documentId,
      source: chunk.source,
      chunkIndex: chunk.chunkIndex,
    },
    vectors: { default: chunk.embedding },
  }));

  await collection.data.insertMany(objects);
}

// Hybrid search (vector + BM25 keyword)
export async function hybridSearch(
  query: string,
  queryEmbedding: number[],
  topK: number = 5,
  alpha: number = 0.7 // 0 = pure keyword, 1 = pure vector
): Promise<{ content: string; score: number; metadata: any }[]> {
  const collection = client.collections.get("DocumentChunk");

  const results = await collection.query.hybrid(query, {
    vector: queryEmbedding,
    alpha, // Balance between vector and keyword
    limit: topK,
    returnProperties: ["content", "documentId", "source", "chunkIndex"],
    returnMetadata: ["score"],
  });

  return results.objects.map((obj) => ({
    content: obj.properties.content as string,
    score: obj.metadata?.score ?? 0,
    metadata: {
      documentId: obj.properties.documentId,
      source: obj.properties.source,
      chunkIndex: obj.properties.chunkIndex,
    },
  }));
}

// Pure vector search
export async function vectorSearch(
  queryEmbedding: number[],
  topK: number = 5,
  filter?: any
): Promise<{ content: string; distance: number }[]> {
  const collection = client.collections.get("DocumentChunk");

  const results = await collection.query.nearVector(queryEmbedding, {
    limit: topK,
    returnProperties: ["content", "documentId", "source"],
    filters: filter,
  });

  return results.objects.map((obj) => ({
    content: obj.properties.content as string,
    distance: obj.metadata?.distance ?? 0,
  }));
}
```

---

## Migration Between Vector Databases

When you outgrow one vector database and need to switch.

### Migration Strategy

```typescript
// lib/vectordb/migration.ts

interface VectorRecord {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

// Step 1: Export from source
async function exportFromPgvector(): Promise<VectorRecord[]> {
  const results = await db.execute(sql`
    SELECT id, content, embedding::text, metadata
    FROM document_chunks
  `);

  return results.rows.map((row: any) => ({
    id: row.id,
    content: row.content,
    embedding: JSON.parse(row.embedding),
    metadata: row.metadata,
  }));
}

// Step 2: Import to destination
async function importToPinecone(records: VectorRecord[]): Promise<void> {
  const index = pinecone.index("my-app-docs");

  for (let i = 0; i < records.length; i += 100) {
    const batch = records.slice(i, i + 100);
    await index.upsert(
      batch.map((r) => ({
        id: r.id,
        values: r.embedding,
        metadata: { content: r.content, ...r.metadata },
      }))
    );

    console.log(`Migrated ${Math.min(i + 100, records.length)}/${records.length} vectors`);
  }
}

// Step 3: Verify migration
async function verifyMigration(
  source: VectorRecord[],
  sampleSize: number = 100
): Promise<{ matched: number; total: number }> {
  const sample = source.sort(() => Math.random() - 0.5).slice(0, sampleSize);
  let matched = 0;

  for (const record of sample) {
    const results = await searchSimilar("default", record.embedding, 1);
    if (results.length > 0 && results[0].content === record.content) {
      matched++;
    }
  }

  return { matched, total: sampleSize };
}
```

---

## Performance Benchmarks

Rough benchmarks for common configurations (actual performance varies by hardware and configuration):

| Database | 100K Vectors | 1M Vectors | 10M Vectors | Query Latency (p95) |
|----------|-------------|-----------|------------|-------------------|
| pgvector (HNSW) | <10ms | 15-30ms | 50-100ms | 20ms |
| pgvector (IVFFlat) | <10ms | 20-50ms | 100-300ms | 40ms |
| Pinecone (serverless) | <20ms | <20ms | <50ms | 30ms |
| Chroma (local) | <5ms | 10-30ms | Not recommended | 15ms |
| Weaviate (HNSW) | <10ms | 15-30ms | 30-80ms | 25ms |

### Tuning Tips

1. **pgvector:** Increase `maintenance_work_mem` for faster index builds. Set `hnsw.ef_search` higher for better recall.
2. **Pinecone:** Use serverless for variable traffic. Pod-based for consistent high volume.
3. **Chroma:** Keep under 1M vectors. Use persistent storage mode for production.
4. **Weaviate:** Tune `ef` and `maxConnections` in HNSW config. Use `flat` index for <10K vectors.
