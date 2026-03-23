# 30 — Billing & Payments

## Purpose

Design the **billing architecture** for any monetized product — subscriptions, usage-based billing, marketplace payments, one-time purchases, or hybrid models. This section is stack-agnostic and not coupled to multi-tenancy (unlike `26-multi-tenant-saas/billing-subscription-integration.template.md` which assumes multi-tenant SaaS).

## When This Section Runs

**Conditional Orchestrator Step** — After Security Hardening (Step 14), only if `{{PAYMENT_PROCESSING}}` is true (product accepts money).

## Why This Exists Separately from 26-Multi-Tenant-SaaS

Section 26 covers billing as one concern among many (tenant isolation, admin interfaces, rate limiting). This section provides **deep billing architecture** for:
- Non-SaaS products (marketplaces, e-commerce, one-time purchase apps)
- Usage-based billing models (API platforms, infrastructure products)
- Hybrid models (subscription + usage overages + marketplace fees)
- Tax compliance, dunning recovery, and refund processing that apply universally

## Files in This Section

| File | Purpose | When Needed |
|------|---------|-------------|
| `billing-architecture-decision-tree.md` | Choose billing model and payment provider | Always (if monetized) |
| `billing-domain-model.template.md` | Database schema for billing entities | Always (if monetized) |
| `tax-compliance-patterns.md` | Sales tax, VAT, and invoicing requirements | Always (if monetized) |
| `dunning-recovery-flows.template.md` | Failed payment handling and revenue recovery | If subscriptions |
| `usage-metering-patterns.md` | Track, aggregate, and bill for usage | If usage-based pricing |
| `billing-testing-patterns.md` | Test payment flows without real charges | Always (if monetized) |

## Dependencies

- **Input from:** Step 1 intake (payment model), `00-discovery/project-brief.template.md`
- **Cross-references:** `26-multi-tenant-saas/billing-subscription-integration.template.md` (for multi-tenant billing specifics), `29-legal-documents/terms-of-service.template.md` (refund/cancellation terms)
- **Referenced by:** `19-marketing/pricing-monetization/` (pricing strategy needs billing architecture constraints)
