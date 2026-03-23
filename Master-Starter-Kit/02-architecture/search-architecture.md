# Search Architecture

> Choose and implement the right search solution for your product. Start with PostgreSQL full-text search — upgrade only when you outgrow it.

---

## Decision Tree

```
How many searchable records do you have?
  │
  ├── < 10,000 records → PostgreSQL ILIKE or full-text search
  │                       Zero additional infrastructure
  │
  ├── 10K - 1M records → PostgreSQL full-text search (RECOMMENDED)
  │                       Fast, free, already in your stack
  │
  ├── 1M - 10M records →
  │   Do you need: typo tolerance, faceted search, instant results?
  │     ├── YES → Meilisearch (self-hosted) or Algolia (managed)
  │     └── NO → PostgreSQL full-text search is still fine
  │
  └── 10M+ records →
      Do you need: aggregations, geo search, complex filtering?
        ├── YES → Elasticsearch / OpenSearch
        └── NO → Meilisearch or Typesense
```

---

## Option A: PostgreSQL Full-Text Search — RECOMMENDED Default

**When to use:** Most applications. Zero additional infrastructure.

### Basic Implementation

```sql
-- Add search vector column
ALTER TABLE products ADD COLUMN search_vector tsvector;

-- Populate search vector
UPDATE products SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(category, '')), 'C');

-- Create GIN index for fast search
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Keep it updated automatically
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_search_vector
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

### Drizzle ORM Query

```typescript
import { sql } from 'drizzle-orm';

async function searchProducts(query: string, limit = 20, offset = 0) {
  const tsQuery = query
    .trim()
    .split(/\s+/)
    .map(word => `${word}:*`)   // Prefix matching
    .join(' & ');                // AND logic

  return db.execute(sql`
    SELECT
      id, name, description, category,
      ts_rank(search_vector, to_tsquery('english', ${tsQuery})) AS rank
    FROM products
    WHERE search_vector @@ to_tsquery('english', ${tsQuery})
    ORDER BY rank DESC
    LIMIT ${limit} OFFSET ${offset}
  `);
}
```

| Pros | Cons |
|------|------|
| Zero additional infrastructure | No typo tolerance (requires exact prefix matches) |
| Transactionally consistent with data | No faceted search built-in |
| Good enough for most applications | Result highlighting requires extra work |
| Supports weighted ranking (A > B > C) | Limited language support vs Elasticsearch |
| Free (included in PostgreSQL) | Slower than dedicated search engines at scale |

---

## Option B: Meilisearch

**When to use:** You need typo tolerance, instant search, or faceted filtering.

```typescript
// Setup
import { MeiliSearch } from 'meilisearch';
const meili = new MeiliSearch({ host: process.env.MEILI_URL, apiKey: process.env.MEILI_KEY });

// Index documents
const index = meili.index('products');
await index.addDocuments(products);

// Configure searchable attributes and ranking
await index.updateSettings({
  searchableAttributes: ['name', 'description', 'category'],
  filterableAttributes: ['category', 'price', 'inStock'],
  sortableAttributes: ['price', 'createdAt'],
  rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
});

// Search with typo tolerance, filters, and facets
const results = await index.search('laptpo', {  // Typo: "laptpo" → "laptop"
  filter: ['category = electronics', 'price < 1000'],
  facets: ['category', 'brand'],
  limit: 20,
});
```

| Pros | Cons |
|------|------|
| Typo tolerance out of the box | Additional infrastructure (Docker container) |
| Sub-50ms search responses | Index sync needed (not transactional) |
| Faceted search and filtering | Memory-heavy for large datasets |
| Easy to set up and configure | Less battle-tested than Elasticsearch |

---

## Option C: Algolia (Managed)

**When to use:** You want zero infrastructure management and instant results.

| Pros | Cons |
|------|------|
| Best-in-class search UX | Expensive at scale ($1+/1000 requests) |
| Built-in UI components (InstantSearch.js) | Vendor lock-in |
| Analytics and A/B testing | Data leaves your infrastructure |
| Global CDN for search | Record limits per plan |

---

## Index Synchronization

If using an external search engine (Meilisearch, Algolia, Elasticsearch), keep the index in sync:

### Pattern: Event-Driven Sync (RECOMMENDED)

```typescript
// After any database write, queue an index update
async function createProduct(data: CreateProductInput) {
  const product = await db.insert(products).values(data).returning();

  // Queue search index update (don't do it inline)
  await searchIndexQueue.add('index', {
    action: 'upsert',
    collection: 'products',
    document: product,
  });

  return product;
}

// Worker: process index updates
const searchWorker = new Worker('search-index', async (job) => {
  const { action, collection, document } = job.data;
  const index = meili.index(collection);

  switch (action) {
    case 'upsert':
      await index.addDocuments([document]);
      break;
    case 'delete':
      await index.deleteDocument(document.id);
      break;
  }
});
```

### Scheduled Full Reindex

Run a full reindex periodically to catch any missed updates:

```typescript
// Weekly: full reindex as safety net
async function fullReindex(collection: string) {
  const allRecords = await db.select().from(products);
  const index = meili.index(collection);
  await index.deleteAllDocuments();
  await index.addDocuments(allRecords, { primaryKey: 'id' });
}
```

---

## Autocomplete / Typeahead

### Frontend Pattern

```typescript
// Debounced search with React
function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 200); // 200ms debounce

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    searchApi(debouncedQuery)
      .then(setResults)
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  return { query, setQuery, results, isLoading };
}
```

---

## Decision Summary

```markdown
## Search Architecture for {{PROJECT_NAME}}

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Search provider | {PostgreSQL FTS / Meilisearch / Algolia} | {why} |
| Searchable entities | {list} | {why} |
| Sync strategy | {event-driven / scheduled / N/A} | {why} |
| Autocomplete | {yes/no} | {why} |
| Faceted search | {yes/no} | {why} |
```
