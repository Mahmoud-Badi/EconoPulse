# Phase 24: AI/ML Feature Integration Patterns

> Patterns for building AI-powered features into your product. This is not about using AI to build the product -- that is what the kit itself does. This section is about shipping AI features to your users.

---

## Why This Exists

Users expect AI-powered features in 2026. Search should understand natural language. Content tools should draft and summarize. Support should answer questions instantly. The bar has shifted from "nice to have" to "table stakes." But most teams ship AI features poorly. They are slow (5+ second response times with no streaming), expensive (uncapped API costs that blow through budgets), insecure (prompt injection vulnerabilities on day one), and unreliable (hallucinations presented as facts with no guardrails).

The gap between a demo and a production AI feature is enormous. A ChatGPT wrapper takes an afternoon. A production-grade AI feature with streaming, caching, cost controls, safety guardrails, evaluation, testing, and graceful degradation takes weeks of deliberate engineering. Every decision compounds: the wrong embedding model wastes months of re-indexing, the wrong vector database creates scaling bottlenecks, and the wrong cost model burns through runway.

This section prevents those mistakes by providing battle-tested patterns for every stage of AI feature development. From deciding what type of AI feature to build, through model selection, integration architecture, RAG pipelines, cost management, safety guardrails, testing strategies, and production gotchas. Every pattern includes real TypeScript code examples, cost estimates, and decision trees so you can make the right choice the first time.

---

## Conditional Activation

This section is activated when `{{AI_FEATURES}} == "true"` during Orchestrator Step 1 (Discovery). If your product does not include user-facing AI features, skip this entire section. If you are only using AI for internal tooling (code generation, test writing), this section is not relevant -- those workflows are handled by the kit itself.

<!-- IF {{AI_FEATURES}} == "true" -->
**AI Features are enabled for this project.** Proceed with this section.
<!-- ENDIF -->

<!-- IF {{AI_FEATURES}} == "false" -->
**AI Features are not enabled.** Skip this section entirely.
<!-- ENDIF -->

---

## How It Integrates with the Orchestrator

This section is triggered at **Step 14.5** in the Orchestrator, after security architecture (Step 14) and before deployment planning (Step 15). This ordering is deliberate: AI features introduce unique security concerns (prompt injection, data leakage to third-party APIs) that must be addressed within your security architecture, and AI infrastructure requirements (vector databases, embedding pipelines, model API credentials) must be captured in your deployment plan.

**Relationship with Section 11 (Cost Estimation):** AI API costs are variable and usage-based. The `ai-cost-management.template.md` file feeds directly into the cost estimation template from Section 11. You must budget AI costs per-user, not per-server.

**Relationship with Section 02 (Architecture):** Your AI integration pattern (direct API, SDK, framework) affects your backend architecture. RAG pipelines require additional infrastructure (vector database, embedding pipeline, document ingestion workers). These must be captured in your architecture documents.

**Relationship with Section 08 (Testing):** AI features are probabilistic and require specialized testing strategies. The `ai-feature-testing.md` guide extends the testing patterns from Section 08 with evaluation datasets, regression testing for prompt changes, and adversarial safety testing.

**Relationship with Section 21 (Incident Response):** AI provider outages are a distinct failure mode. Your incident response runbooks should include procedures for AI provider failures, fallback strategies, and graceful degradation.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview and reading order for AI/ML integration | 14.5 |
| `ai-feature-decision-tree.md` | Guide | Decide what type of AI feature to build and which architecture pattern to use | 14.5 |
| `llm-integration-patterns.md` | Guide | Integration approaches: direct API, SDKs, frameworks, with code examples | 14.5 |
| `rag-architecture.template.md` | Template | Complete RAG pipeline blueprint: ingestion, chunking, embedding, retrieval | 14.5 |
| `model-selection-decision-tree.md` | Guide | Provider comparison, cost tables, multi-model strategy, fallback patterns | 14.5 |
| `ai-cost-management.template.md` | Template | Token budgeting, caching strategies, tier-based limits, cost monitoring | 14.5 |
| `prompt-engineering-templates.md` | Guide | System prompt patterns, versioning, evaluation frameworks, reusable templates | 14.5 |
| `ai-safety-guardrails.md` | Guide | Input sanitization, output validation, prompt injection prevention, compliance | 14.5 |
| `vector-database-patterns.md` | Guide | Deep dive into pgvector, Pinecone, Chroma, Weaviate with code examples | 14.5 |
| `ai-feature-testing.md` | Guide | Testing strategies for probabilistic AI features: evals, regression, adversarial | 14.5 |
| `ai-agent-patterns.md` | Guide | Tool calling, agent loops, multi-step reasoning, human-in-the-loop patterns | 14.5 |
| `ai-gotchas.md` | Guide | Production lessons and anti-patterns learned from shipping AI features | 14.5 |

---

## Recommended Reading Order

1. **`ai-feature-decision-tree.md`** -- Start here. Identify what type of AI feature you are building. This determines which patterns and infrastructure you need.
2. **`model-selection-decision-tree.md`** -- Choose your AI provider(s) and model(s). Cost and quality trade-offs are significant.
3. **`llm-integration-patterns.md`** -- Pick your integration approach: direct API, SDK, or framework. Includes code examples for each.
4. **`rag-architecture.template.md`** -- If building search/RAG features, design your complete retrieval pipeline here.
5. **`vector-database-patterns.md`** -- If using RAG, choose and configure your vector database.
6. **`prompt-engineering-templates.md`** -- Design your prompts with versioning, evaluation, and reusable templates.
7. **`ai-cost-management.template.md`** -- Budget your AI costs per feature, per user, per tier. Set up guardrails.
8. **`ai-safety-guardrails.md`** -- Implement input sanitization, output validation, and compliance requirements.
9. **`ai-agent-patterns.md`** -- If building agentic features, design your tool calling and agent loop architecture.
10. **`ai-feature-testing.md`** -- Set up evaluation datasets, regression testing, and adversarial testing.
11. **`ai-gotchas.md`** -- Read last. These lessons will save you from the most common production mistakes.

---

## Key Principles

1. **Stream everything.** Users tolerate latency when they see progress. A 5-second loading spinner feels broken. A streaming response feels fast.
2. **Budget per-user, not per-server.** AI costs scale with users, not infrastructure. A $0.01 call multiplied by 10K users/day is $100/day.
3. **Cache aggressively.** Identical prompts, similar queries, and repeated system prompts should all hit cache before hitting the API.
4. **Fail gracefully.** AI providers have outages. Your feature should degrade gracefully, not crash entirely.
5. **Validate everything.** Validate inputs before sending to the LLM. Validate outputs before showing to users. Trust nothing.
6. **Start expensive, optimize later.** Ship with the best model first. Prove the feature works. Then optimize cost with smaller models, caching, and batching.
7. **Test probabilistically.** AI outputs are non-deterministic. Use evaluation datasets and scoring, not exact string matching.
