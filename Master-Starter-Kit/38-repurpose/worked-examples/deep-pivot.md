# Worked Example: Deep Pivot (Full Fork)

> **Scenario:** An e-commerce marketplace → B2B procurement platform

---

## What Makes This a Deep Pivot

- Different user types (consumers → procurement teams, vendors, approvers)
- Different transaction model (simple purchase → multi-step approval workflow)
- Different pricing (fixed price → negotiated quotes, volume discounts, contract pricing)
- Different compliance (consumer protection → SOX compliance, audit trails)
- Significant data model restructuring
- Reuse: **25-40%**

---

## Why Fork Instead of Build From Scratch

Even at 25-40% reuse, forking saves significant time:

| Component | Build From Scratch | Fork & Adapt | Time Saved |
|-----------|-------------------|-------------|-----------|
| User management + auth | 3-4 weeks | 1 week (add roles, org hierarchy) | 2-3 weeks |
| Search engine | 4-6 weeks | 1-2 weeks (different facets, same engine) | 3-4 weeks |
| File/media management | 2-3 weeks | 0.5 weeks (same system, different context) | 2 weeks |
| Notification system | 2-3 weeks | 0.5 weeks (new templates, same engine) | 2 weeks |
| Payment processing | 3-4 weeks | 2 weeks (invoicing vs instant checkout) | 1-2 weeks |
| Admin dashboard | 3-4 weeks | 1-2 weeks (different metrics, same framework) | 2 weeks |
| **Total saved** | | | **~12-15 weeks** |

**Decision threshold:** If reuse saves >8 weeks AND the target market justifies the pivot, fork. If reuse saves <8 weeks, build from scratch — the technical debt of adapting isn't worth it.

---

## Feature Inheritance Map

### What Transfers

| E-Commerce Feature | Procurement Equivalent | Reuse % |
|-------------------|----------------------|---------|
| Product catalog | Supplier catalog | 60% — add contract pricing, approval status |
| Shopping cart | Requisition | 30% — fundamentally different workflow |
| Checkout | Purchase order creation | 20% — multi-step approval, not instant |
| Order tracking | PO tracking + delivery confirmation | 50% — add approval chain visibility |
| User accounts | Org accounts with role hierarchy | 40% — add org structure, spending limits |
| Reviews & ratings | Supplier performance scoring | 30% — quantitative metrics, not qualitative reviews |
| Search & discovery | Catalog search + approved supplier filter | 70% — same engine, different facets |
| Wishlist | Requisition templates / favorites | 60% — similar concept, different context |
| Payment processing | Invoice processing + AP integration | 25% — net-30/60/90 terms, not instant payment |
| Email notifications | Workflow notifications + approval requests | 50% — same engine, different templates |
| Analytics dashboard | Spend analytics + compliance dashboard | 40% — different metrics entirely |

### What Must Be Built New

| Feature | Why E-Commerce Can't Provide It | Effort | Priority |
|---------|-------------------------------|--------|----------|
| Approval workflows | E-commerce is instant buy; procurement requires manager → director → VP chain | XL | P0 |
| Budget management | E-commerce has no concept of departmental budgets or spending limits | L | P0 |
| Contract management | E-commerce uses fixed pricing; procurement uses negotiated multi-year contracts | XL | P0 |
| RFQ/RFP system | E-commerce sellers set prices; procurement buyers request competitive quotes | L | P1 |
| Supplier onboarding | E-commerce onboards buyers; procurement must vet and approve suppliers | M | P1 |
| Three-way matching | Match PO ↔ delivery receipt ↔ invoice before payment (no e-commerce equivalent) | L | P1 |
| Compliance/audit trail | SOX compliance requires immutable audit trail for all financial transactions | M | P0 |
| ERP integration | Connect to SAP, Oracle, NetSuite for GL posting, inventory sync | XL | P1 |
| Punch-out catalogs | Allow users to "punch out" to supplier's catalog and bring selections back | L | P2 |

---

## Data Model: Major Restructuring

### Removed Concepts (E-Commerce Only)

```
- Cart (replaced by Requisition)
- Wishlist (replaced by Requisition Templates)
- Consumer Reviews (replaced by Supplier Scorecards)
- Promotions / Discount Codes (replaced by Contract Pricing)
- Guest Checkout (all users must be authenticated + org-bound)
```

### Transformed Concepts

```
Product → CatalogItem
  - price → REMOVED (pricing is per-contract, not per-item)
  + contract_prices: [{ contract_id, unit_price, volume_tiers, effective_date, expiry_date }]
  + approved_suppliers: [supplier_id] (only approved suppliers visible)
  + commodity_code (UNSPSC classification)
  + requires_approval_above (threshold amount)

Order → PurchaseOrder
  - instant_payment → REMOVED
  + requisition_id (FK — PO created from approved requisition)
  + approval_chain: [{ approver_id, status, timestamp, comments }]
  + budget_id (FK — charged against department budget)
  + payment_terms (net_30, net_60, net_90)
  + delivery_address_id (ship-to, not bill-to)
  + three_way_match_status (po_matched, receipt_matched, invoice_matched)
  + gl_codes: [{ line_item_id, gl_account, cost_center, amount }]

User → OrgUser
  + organization_id (FK — every user belongs to an org)
  + department_id (FK)
  + spending_limit (per-transaction and per-month)
  + approval_authority (maximum $ they can approve)
  + role (requester, approver, buyer, admin, auditor)
  + delegations: [{ delegate_to, start_date, end_date }] (vacation coverage)
```

### New Core Entities

```
Organization
  + name, address, tax_id
  + payment_terms_default
  + departments: [Department]
  + budgets: [Budget]
  + approved_suppliers: [Supplier]
  + compliance_settings (SOX, audit requirements)

Requisition (replaces Cart)
  + requester_id (FK)
  + department_id (FK)
  + line_items: [{ catalog_item_id, quantity, unit_price, gl_code }]
  + total_amount
  + justification (text — why is this purchase needed?)
  + status (draft, submitted, pending_approval, approved, rejected, converted_to_po)
  + approval_chain: [{ level, approver_id, threshold, status, timestamp }]

Contract
  + supplier_id (FK)
  + organization_id (FK)
  + start_date, end_date
  + pricing_terms: [{ catalog_item_id, unit_price, volume_tiers }]
  + payment_terms
  + auto_renew (boolean)
  + total_commitment (minimum spend)
  + spend_to_date (computed)

Budget
  + department_id (FK)
  + fiscal_year
  + allocated_amount
  + spent_amount (computed from approved POs)
  + remaining_amount (computed)
  + alerts: [{ threshold_pct, notify_users }]

ApprovalRule
  + organization_id (FK)
  + condition (amount_above, category_is, department_is, supplier_not_approved)
  + required_approvers: [{ role, level, any_or_all }]
  + escalation_after_hours (auto-escalate if not actioned)
```

---

## Implementation Plan

### Phase 1: Fork & Foundation (2-3 weeks)
1. Fork codebase, rebrand, strip consumer-specific features
2. Implement organization + department hierarchy
3. Replace user model with org-bound users + roles
4. Add SOX-compliant audit logging
5. Set up separate infrastructure

### Phase 2: Core Procurement Workflow (4-6 weeks)
1. Requisition system (create, submit, approval chain)
2. Approval workflow engine (configurable rules, delegation, escalation)
3. Budget management (allocate, track, alert)
4. PO generation from approved requisitions
5. Adapt catalog to contract-based pricing

### Phase 3: Supplier Management (3-4 weeks)
1. Supplier onboarding and approval workflow
2. Contract management (create, negotiate, track)
3. Supplier performance scorecards
4. Approved supplier catalog filtering

### Phase 4: Financial Integration (4-6 weeks)
1. Three-way matching (PO ↔ receipt ↔ invoice)
2. Invoice processing and AP workflow
3. GL code assignment and posting
4. ERP integration (start with one: NetSuite or SAP Business One)

### Phase 5: Advanced Features (3-4 weeks)
1. RFQ/RFP system
2. Spend analytics and compliance dashboard
3. Punch-out catalog support
4. Mobile approval app

**Total estimated effort: 16-23 weeks**
**Reuse percentage: ~30%**

---

## When to Abandon the Fork

The fork stops making sense if:

1. **Reuse drops below 20% during implementation** — you're spending more time removing/rewriting than building
2. **Core architecture doesn't support the new model** — e.g., the e-commerce platform assumes instant payments everywhere and can't handle approval workflows without rewriting the transaction engine
3. **Technical debt from the source app is creating more bugs than time saved** — legacy patterns in the e-commerce code are causing issues in the procurement context
4. **The team spends more time understanding the source code than writing new code** — unfamiliarity with the original codebase negates reuse benefits

**Checkpoint:** At the end of Phase 1, measure actual reuse. If it's tracking >10% below projection, reassess.

---

## Parallel Operation Guide

If the source e-commerce app continues to run while the procurement fork diverges:

### Shared Infrastructure (Keep in Sync)
- Auth library (shared package, versioned)
- Notification engine (shared service, separate templates)
- File storage service (shared, separate buckets)
- Monitoring and alerting (shared platform, separate dashboards)

### Diverging Code (Accept Drift)
- Data models (will diverge immediately — accept it)
- Business logic (completely different — no syncing)
- Frontend (different UX patterns — no syncing)
- APIs (different consumers — no syncing)

### Cherry-Pick Protocol
When the source app gets a security fix or infrastructure improvement:
1. Evaluate if it applies to the fork
2. If yes: cherry-pick the commit (not merge — merging will bring unwanted changes)
3. Adapt for the fork's context
4. Test in fork's CI pipeline
5. Document the cherry-pick in the fork's DEVLOG

**Reality check:** After 3-6 months, cherry-picking becomes impractical as the codebases diverge. Plan for full independence by month 6.
