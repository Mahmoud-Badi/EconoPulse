# 29 — Legal Documents

## Purpose

Generate the **user-facing legal documents** every commercial product requires before launch. These templates are populated from outputs of `00-discovery/data-sensitivity.template.md` and Step 14 (Security Hardening) to ensure legal commitments match actual technical controls.

## When This Section Runs

**Orchestrator Step 14.7** — After Security Hardening (Step 14), before Observability (Step 15).

## Why This Exists

The kit already classifies data sensitivity, maps compliance requirements, and implements security controls. But none of that produces the **customer-facing documents** that:
- App stores require for submission (Privacy Policy, EULA)
- GDPR mandates for any product with EU users (Privacy Policy, DPA)
- Payment processors require (Terms of Service)
- Users expect before trusting your product

## Files in This Section

| File | Purpose | When Needed |
|------|---------|-------------|
| `legal-document-decision-tree.md` | Determine which documents your project needs | Always |
| `privacy-policy.template.md` | User-facing privacy policy | Always |
| `terms-of-service.template.md` | User-facing terms of service | Always |
| `cookie-policy.template.md` | Cookie usage policy | If using cookies/tracking |
| `acceptable-use-policy.template.md` | Rules for user-generated content | If UGC platform |
| `dpa.template.md` | Data Processing Agreement | If B2B SaaS with EU customers |
| `eula.template.md` | End User License Agreement | If mobile app |

## Dependencies

- **Input from:** `00-discovery/data-sensitivity.template.md` (data classification), Step 14 security hardening output
- **Referenced by:** `17-mobile-deployment/` (app store submission requires Privacy Policy + EULA), `19-marketing/legal-compliance/` (existing compliance guides)

## Rules

1. **Never copy legal text verbatim** — Templates provide structure and guidance. Every product needs attorney review before publishing.
2. **Match technical reality** — If your data sensitivity classification says you collect IP addresses, your privacy policy must disclose it.
3. **Use plain language** — Legal documents should be understandable by non-lawyers. GDPR explicitly requires this.
4. **Keep them current** — Privacy policies must be updated when data practices change. Add a review reminder to `20-post-launch/`.
