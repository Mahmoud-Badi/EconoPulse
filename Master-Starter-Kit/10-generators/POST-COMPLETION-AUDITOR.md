# Post-Completion Auditor — Generator Prompt

> **Used by:** Step 29 (Post-Completion Audit)
> **Input:** COMPLETED array from STATE BLOCK, all files in `dev_docs/`
> **Output:** Per-round findings files + audit summary in `dev_docs/hardening/audit/`

---

## Generator Instructions

You are performing a 4-round post-completion audit of the project plan (Rounds 1, 2, 2.5, 3). Your job is to verify that every expected output from every completed step actually exists, is complete, and is internally consistent.

### Before Starting

1. Read the STATE BLOCK from ORCHESTRATOR.md — extract the `COMPLETED` array
2. Read `34-hardening/audit-checklist.template.md` — this is your master checklist
3. Create the output directory: `dev_docs/hardening/audit/`

### Round 1: Existence Audit

**Objective:** Does every expected file exist?

For each step in the COMPLETED array:
1. Look up the expected outputs in the audit checklist template
2. Check if each expected file exists at its expected path
3. For files that exist, check word count:
   - ≥50 words → PASS
   - <50 words → STUB (WARNING)
   - Does not exist → MISSING (CRITICAL)
4. For template-driven outputs (service specs, screen specs, task files), verify the COUNT matches:
   - Service specs: count should match `CONFIG.MVP_SERVICES` length
   - Screen specs: count should match screen catalog entries
   - Task files: should exist for every phase

**Log format per finding:**
```markdown
| {ID} | MISSING/STUB | {severity} | {description} | {expected_path} | OPEN |
```

**After Round 1:**
- Generate `dev_docs/hardening/audit/round-1-findings.md` using `34-hardening/round-summary.template.md`
- For MISSING files: attempt to generate them using the appropriate generator
- For STUB files: expand them using the appropriate template

### Round 2: Section Completeness Audit

**Objective:** Do existing files have all required sections?

For each file that passed Round 1's existence check:

**Service specs** — verify these 15 sections exist:
1. Overview, 2. Entities, 3. Business Rules, 4. API Endpoints, 5. State Machines,
6. Validation Rules, 7. Edge Cases, 8. Error Handling, 9. Performance Requirements,
10. Security Considerations, 11. Dependencies, 12. Testing Strategy, 13. Monitoring,
14. Future Considerations, 15. Open Questions

**Screen specs** — verify these sections exist:
1. Overview, 2. User Stories, 3. Layout/Wireframe, 4. Components Used,
5. States (loading/error/empty/data), 6. Interactions, 7. Responsive Behavior,
8. Accessibility, 9. API Calls, 10. Navigation, 11. Permissions

**Task files** — verify these sections exist:
1. Context Header, 2. Objective, 3. File Plan, 4. Acceptance Criteria,
5. Dependencies, 6. Effort Estimate

**Also check for placeholder text:**
- Scan all files for: "TBD", "TODO", "[FILL IN]", "[INSERT", "PLACEHOLDER", "lorem ipsum"
- Each occurrence is a WARNING finding

**After Round 2:**
- Generate `dev_docs/hardening/audit/round-2-findings.md`
- Fix Round 1 findings that were addressed
- For missing sections: generate them inline
- For placeholder text: replace with substantive content

### Round 2.5: Extended Output Audit

**Objective:** Verify outputs from steps beyond core planning (mobile, operational, marketing, hardening, BI, SEO).

For each completed step in the COMPLETED array, verify the expected outputs exist and have substantive content (≥50 words). Only audit steps that appear in the COMPLETED array — skip steps the project didn't run.

**Mobile steps** (if `HAS_MOBILE` in CONFIG):

| Step | Expected Outputs |
|------|-----------------|
| 3.5 Mobile Framework | `dev_docs/mobile-framework-decision.md` |
| 5.5 Native Audit | `dev_docs/specs/native-features-audit.md` |
| 11.5 Mobile Setup | `dev_docs/mobile-setup-checklist.md` |
| 14.5 Store Readiness | `dev_docs/store-readiness-checklist.md` |
| 15.5 User Docs | `dev_docs/user-docs/` directory with ≥3 files |

**Operational steps** (Steps 18.5-18.8):

| Step | Expected Outputs |
|------|-----------------|
| 18.5 Team Ceremonies | `dev_docs/team/ceremony-templates.md` or equivalent |
| 18.6 Incident Response | `dev_docs/incident-response/` with severity levels and runbooks |
| 18.7 Customer Support | `dev_docs/support/` with KB structure, SLAs, escalation |
| 18.8 Post-Launch | `dev_docs/post-launch/` with release cadence, feedback loops |

**Legal & Financial** (if applicable):

| Step | Expected Outputs |
|------|-----------------|
| 14.7 Legal Documents | `dev_docs/legal/` with privacy policy, ToS (≥2 files) |
| 14.8 Billing | `dev_docs/billing/` with billing model, tax, dunning |
| 14.9 Integrations | `dev_docs/integrations/` with strategy, webhook patterns |
| 17.5 Financial Modeling | `dev_docs/financial/` with revenue projections, unit economics |
| 17.6 Multi-Tenant | `dev_docs/multi-tenant/` with isolation strategy, billing |

**Marketing steps** (Steps 19-28.5, if marketing path was run):

| Step | Expected Outputs |
|------|-----------------|
| 19 Marketing Discovery | `dev_docs/marketing/research/` with competitor analysis, audience profiles |
| 20 Brand & Messaging | `dev_docs/marketing/brand/` with voice guide, value props, pricing |
| 21 Strategy & Channels | `dev_docs/marketing/strategy/` with channel plan, budget, analytics |
| 22 Website & Conversion | `dev_docs/marketing/website/` with landing page copy, pricing page |
| 23 Content & Social | `dev_docs/marketing/content/` with blog strategy, social calendar |
| 24 Email Marketing | `dev_docs/marketing/email/` with welcome sequence, drip campaigns |
| 25 Launch Strategy | `dev_docs/marketing/launch/` with timeline, directories |
| 26 Growth & Outreach | `dev_docs/marketing/growth/` with outreach, referral programs |
| 27 Onboarding & Retention | `dev_docs/marketing/retention/` with onboarding flows, churn |
| 28 Marketing Dashboard | `dev_docs/marketing/dashboard/` with reporting, A/B testing |
| 28.5 Competitive Intel | `dev_docs/marketing/competitive/` with battle cards |

**BI & SEO** (Steps 28.7-28.8):

| Step | Expected Outputs |
|------|-----------------|
| 28.7 Business Intelligence | `dev_docs/bi/` with warehouse design, ETL, metrics registry, executive reports |
| 28.8 SEO Deep Planning | `dev_docs/seo/` with technical SEO, on-page, content strategy |

**Hardening steps** (Steps 29-33, mandatory):

| Step | Expected Outputs |
|------|-----------------|
| 29 Post-Completion Audit | `dev_docs/hardening/audit/` (this file's output) |
| 30 Enhancement Rounds | `dev_docs/hardening/enhancement/` with round logs |
| 31 Depth Verification | `dev_docs/hardening/depth/` with depth dashboard, deep dive summaries |
| 32 Expansion Planning | `dev_docs/hardening/expansion/` with expansion plan |
| 33 Protection Protocol | PROTECT-LIST.md updated, `dev_docs/hardening/protection/` |

**Section completeness checks for extended outputs:**

**Legal documents** — verify each contains:
1. Effective date, 2. Company details, 3. User rights, 4. Data handling, 5. Contact information

**Incident response** — verify:
1. Severity levels defined (≥3 levels), 2. At least 1 runbook, 3. Escalation path, 4. Postmortem template

**Marketing documents** — verify each is substantive (≥200 words) and not boilerplate

**BI outputs** — verify:
1. Metrics registry has ≥10 defined metrics, 2. Warehouse schema references actual project entities, 3. ETL sources match project's data sources

**After Round 2.5:**
- Generate `dev_docs/hardening/audit/round-2.5-findings.md`
- For MISSING outputs: flag as WARNING (not CRITICAL — extended outputs are path-dependent)
- For STUB outputs: flag as WARNING with recommendation to expand

### Round 3: Cross-Reference Integrity Audit

**Objective:** Do files correctly reference each other?

**Check these reference chains:**

1. **Service Matrix → Spec Files:**
   Every service in `dev_docs/completeness/service-matrix.md` must have a matching spec file in `dev_docs/specs/` AND a hub file in `dev_docs/services/`

2. **Screen Matrix → Screen Specs:**
   Every screen in `dev_docs/completeness/screen-matrix.md` must have a matching spec file in `dev_docs/specs/screens/`

3. **Features List → Tasks:**
   Every feature in `dev_docs/features-list.md` must have ≥1 task file in `dev_docs/tasks/`

4. **API Endpoints → Contracts:**
   Every endpoint listed in screen specs must appear in the API registry

5. **Task File Paths:**
   Every file path referenced in task files must be a valid, planned file (not a generic placeholder like `src/components/MyComponent.tsx`)

6. **Orphan Detection:**
   Find files in `dev_docs/` that are not referenced by any other file in `dev_docs/`. These are potential orphans.

**After Round 3:**
- Generate `dev_docs/hardening/audit/round-3-findings.md`
- Verify fixes from Rounds 1 and 2
- Create missing references
- Generate `dev_docs/hardening/audit/audit-summary.md` consolidating all rounds

### Final Output

Generate `dev_docs/hardening/audit/audit-summary.md`:

```markdown
# Post-Completion Audit Summary

## Overview
- Rounds executed: 4 (1, 2, 2.5, 3)
- Total findings: {TOTAL}
- Critical findings: {CRITICAL} (all must be resolved)
- Warnings: {WARNINGS}
- Resolved during audit: {RESOLVED}
- Remaining: {REMAINING}

## Round-by-Round
| Round | Focus | Findings | Resolved | Remaining |
|-------|-------|----------|----------|-----------|
| 1 | Existence | | | |
| 2 | Sections | | | |
| 2.5 | Extended Outputs | | | |
| 3 | Cross-refs | | | |

## Unresolved Items (if any)
[List any items that could not be auto-resolved and need user decision]

## Files Generated During Audit
[List any files that were created to fill gaps]

## Files Modified During Audit
[List any files that were expanded or corrected]
```

### Early Exit

If Round 2 finds 0 new issues AND Round 2.5 finds 0 new issues AND all Round 1 issues were resolved, Round 3 can be skipped (early exit). This is unlikely but possible for very thorough projects.
