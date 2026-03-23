# R3 Market Fit Analysis — Output Report

> **Source Application:** {{SOURCE_APP_NAME}}
> **Target Vertical:** {{TARGET_VERTICAL}}
> **Analysis Date:** {{DATE}}
> **Analyst:** {{ANALYST_NAME}}

---

## Executive Summary

{{EXECUTIVE_SUMMARY — 2-3 sentences: Is there market fit? What's the confidence level? What's the primary risk?}}

**Verdict:** {{FIT / PARTIAL_FIT / NO_FIT}}
**Confidence:** {{HIGH / MEDIUM / LOW}}
**Recommended Action:** {{PROCEED / PROCEED_WITH_MODIFICATIONS / PIVOT / ABANDON}}

---

## 1. Market Demand Assessment

### Target Market Size

| Metric | Value | Source | Confidence |
|--------|-------|--------|------------|
| TAM (Total Addressable Market) | {{TAM_VALUE}} | {{TAM_SOURCE}} | {{TAM_CONFIDENCE}} |
| SAM (Serviceable Available Market) | {{SAM_VALUE}} | {{SAM_SOURCE}} | {{SAM_CONFIDENCE}} |
| SOM (Serviceable Obtainable Market) | {{SOM_VALUE}} | {{SOM_SOURCE}} | {{SOM_CONFIDENCE}} |

### Demand Signals

| Signal | Evidence | Strength |
|--------|----------|----------|
| Search volume for target vertical solutions | {{SEARCH_VOLUME}} | {{STRENGTH}} |
| Competitor presence in target vertical | {{COMPETITOR_COUNT}} competitors | {{STRENGTH}} |
| User requests/feedback indicating demand | {{USER_DEMAND_EVIDENCE}} | {{STRENGTH}} |
| Industry growth rate | {{GROWTH_RATE}} | {{STRENGTH}} |
| Regulatory tailwinds/headwinds | {{REGULATORY_NOTES}} | {{STRENGTH}} |

### Demand Score: {{DEMAND_SCORE}}/10

---

## 2. Feature-Market Alignment

### Core Value Proposition Mapping

| Source App Feature | Target Vertical Need | Alignment | Gap |
|-------------------|---------------------|-----------|-----|
| {{FEATURE_1}} | {{NEED_1}} | {{DIRECT / PARTIAL / NONE}} | {{GAP_DESCRIPTION}} |
| {{FEATURE_2}} | {{NEED_2}} | {{DIRECT / PARTIAL / NONE}} | {{GAP_DESCRIPTION}} |
| {{FEATURE_3}} | {{NEED_3}} | {{DIRECT / PARTIAL / NONE}} | {{GAP_DESCRIPTION}} |

### Features That Transfer Directly (Reuse >80%)

{{LIST_OF_DIRECT_TRANSFER_FEATURES — features that work in the new vertical with minimal changes}}

### Features Requiring Adaptation (Reuse 30-80%)

| Feature | Current Behavior | Required Behavior | Effort |
|---------|-----------------|-------------------|--------|
| {{FEATURE}} | {{CURRENT}} | {{REQUIRED}} | {{S/M/L/XL}} |

### Features That Don't Transfer (Reuse <30%)

{{LIST_OF_NON_TRANSFERABLE_FEATURES — features that must be rebuilt or replaced}}

### New Features Required (Not in Source)

| Feature | Why Needed | Effort | Priority |
|---------|-----------|--------|----------|
| {{NEW_FEATURE}} | {{JUSTIFICATION}} | {{S/M/L/XL}} | {{P0/P1/P2}} |

### Alignment Score: {{ALIGNMENT_SCORE}}/10

---

## 3. Competitive Landscape

### Direct Competitors in Target Vertical

| Competitor | Pricing | Key Differentiator | Weakness | Market Share |
|-----------|---------|-------------------|----------|-------------|
| {{COMPETITOR_1}} | {{PRICING}} | {{DIFFERENTIATOR}} | {{WEAKNESS}} | {{SHARE}} |
| {{COMPETITOR_2}} | {{PRICING}} | {{DIFFERENTIATOR}} | {{WEAKNESS}} | {{SHARE}} |

### Competitive Advantage from Repurpose

What advantage does repurposing an existing app give you over building from scratch or using existing competitors?

- **Speed to market:** {{SPEED_ADVANTAGE — e.g., "6 months faster because core workflow engine already built"}}
- **Feature depth:** {{DEPTH_ADVANTAGE — e.g., "reporting engine already handles 50+ chart types"}}
- **Technical moat:** {{TECH_ADVANTAGE — e.g., "real-time sync engine would take 12 months to rebuild"}}
- **Cost advantage:** {{COST_ADVANTAGE — e.g., "shared infrastructure reduces per-customer cost by 40%"}}

### Competitive Score: {{COMPETITIVE_SCORE}}/10

---

## 4. Technical Feasibility

### Data Model Compatibility

| Source Entity | Target Equivalent | Change Required | Breaking? |
|--------------|------------------|-----------------|-----------|
| {{SOURCE_ENTITY}} | {{TARGET_ENTITY}} | {{CHANGE_TYPE}} | {{YES/NO}} |

### Infrastructure Reuse

| Component | Reusable? | Modification | Effort |
|-----------|-----------|-------------|--------|
| Database schema | {{YES/PARTIAL/NO}} | {{MODIFICATION}} | {{EFFORT}} |
| API layer | {{YES/PARTIAL/NO}} | {{MODIFICATION}} | {{EFFORT}} |
| Auth system | {{YES/PARTIAL/NO}} | {{MODIFICATION}} | {{EFFORT}} |
| File storage | {{YES/PARTIAL/NO}} | {{MODIFICATION}} | {{EFFORT}} |
| Background jobs | {{YES/PARTIAL/NO}} | {{MODIFICATION}} | {{EFFORT}} |
| Frontend components | {{YES/PARTIAL/NO}} | {{MODIFICATION}} | {{EFFORT}} |

### Estimated Reuse Percentage: {{REUSE_PCT}}%

### Technical Score: {{TECHNICAL_SCORE}}/10

---

## 5. Business Model Viability

### Pricing Strategy

| Tier | Price | Target Segment | Features Included |
|------|-------|---------------|-------------------|
| {{TIER_1}} | {{PRICE}} | {{SEGMENT}} | {{FEATURES}} |
| {{TIER_2}} | {{PRICE}} | {{SEGMENT}} | {{FEATURES}} |

### Unit Economics

| Metric | Value | Healthy Benchmark | Status |
|--------|-------|------------------|--------|
| CAC (Customer Acquisition Cost) | {{CAC}} | <{{BENCHMARK}} | {{OK/RISK}} |
| LTV (Lifetime Value) | {{LTV}} | >3x CAC | {{OK/RISK}} |
| LTV:CAC Ratio | {{RATIO}} | >3:1 | {{OK/RISK}} |
| Payback Period | {{PAYBACK}} | <12 months | {{OK/RISK}} |
| Gross Margin | {{MARGIN}} | >70% for SaaS | {{OK/RISK}} |

### Business Score: {{BUSINESS_SCORE}}/10

---

## 6. Risk Assessment

### Top Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|-----------|-------|
| {{RISK_1}} | {{H/M/L}} | {{H/M/L}} | {{MITIGATION}} | {{OWNER}} |
| {{RISK_2}} | {{H/M/L}} | {{H/M/L}} | {{MITIGATION}} | {{OWNER}} |
| {{RISK_3}} | {{H/M/L}} | {{H/M/L}} | {{MITIGATION}} | {{OWNER}} |

### Kill Criteria

Stop the repurpose effort if ANY of these become true:

1. {{KILL_CRITERION_1 — e.g., "Reuse drops below 40% during implementation"}}
2. {{KILL_CRITERION_2 — e.g., "CAC exceeds $X in first 3 months of launch"}}
3. {{KILL_CRITERION_3 — e.g., "Zero paying customers after 60 days of launch"}}

---

## 7. Composite Score & Recommendation

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Market Demand | {{DEMAND_SCORE}}/10 | 25% | {{WEIGHTED}} |
| Feature Alignment | {{ALIGNMENT_SCORE}}/10 | 25% | {{WEIGHTED}} |
| Competitive Position | {{COMPETITIVE_SCORE}}/10 | 15% | {{WEIGHTED}} |
| Technical Feasibility | {{TECHNICAL_SCORE}}/10 | 20% | {{WEIGHTED}} |
| Business Viability | {{BUSINESS_SCORE}}/10 | 15% | {{WEIGHTED}} |
| **Composite** | | | **{{COMPOSITE}}/10** |

### Decision Matrix

| Composite Score | Recommendation |
|----------------|---------------|
| 8-10 | **Strong fit** — proceed with confidence |
| 6-7.9 | **Moderate fit** — proceed with identified modifications |
| 4-5.9 | **Weak fit** — consider pivoting the approach or target vertical |
| <4 | **No fit** — abandon this vertical, explore alternatives |

### Final Recommendation

{{FINAL_RECOMMENDATION — 3-5 sentences summarizing the verdict, key factors, and recommended next steps}}

---

## Next Steps

If proceeding:

1. [ ] Complete Feature Inheritance Map (`38-repurpose/FEATURE-INHERITANCE-MAP.md`)
2. [ ] Define Fork Architecture (`38-repurpose/FORK-ARCHITECTURE.md`)
3. [ ] Create Vertical Differentiation Plan (`38-repurpose/VERTICAL-DIFFERENTIATION-PLAN.md`)
4. [ ] Begin Phase 1 implementation with highest-alignment features
