# /doc-quality-gate

Run the documentation quality gate before transitioning to the next phase.

## Instructions

This command checks documentation coverage and completeness for all features completed in the current phase. It **blocks phase transition** if coverage is below 90%.

## Workflow

### Step 1: Gather Data

1. Read `user_docs/DOC-INDEX.md` for current coverage stats
2. Read `dev_docs/STATUS.md` to find all tasks marked DONE in the current phase
3. Identify which features those tasks belong to

### Step 2: Check Each Feature

For each completed feature, verify:

- [ ] Feature guide exists at `user_docs/guides/{feature-slug}.md` (or `guides/mobile/` for mobile-only)
- [ ] Guide has ALL required sections per `18-user-documentation/doc-quality-standards.md`:
  - Description, prerequisites, steps, expected results, tips, related features, FAQ, troubleshooting
- [ ] FAQ entries exist (minimum 3 per feature)
- [ ] Troubleshooting entries exist for error states
- [ ] Changelog entry exists
- [ ] In-app help JSON exists for related screens
- [ ] Screenshot placeholders exist (at least 1 per guide)

<!-- IF {{HAS_MOBILE}} == "true" -->
### Mobile Checks (if applicable)

- [ ] Cross-platform features have "On Mobile" sections
- [ ] Mobile-only features have guides in `user_docs/guides/mobile/`
- [ ] Mobile screenshot placeholders include platform tags (ios/android)
- [ ] Permission flows documented for features requiring device permissions
- [ ] Platform differences noted where iOS/Android behavior differs
<!-- ENDIF -->

### Step 3: Calculate Coverage

```text
Coverage = (features with complete docs / total completed features) × 100
```

### Step 4: Report

```text
DOCUMENTATION QUALITY GATE — Phase {N}
═══════════════════════════════════════

Coverage: {X}% ({Y}/{Z} features documented)
<!-- IF {{HAS_MOBILE}} == "true" -->
Platform coverage: Web {A}% | iOS {B}% | Android {C}%
<!-- ENDIF -->

✅ PASS:
- {feature}: guide ✓ | faq ✓ | troubleshoot ✓ | changelog ✓ | in-app ✓

❌ FAIL:
- {feature}: guide ✗ (missing) | faq ✓ | troubleshoot ✗ (0 entries)

Screenshots: {captured} captured, {pending} pending, {missing} missing placeholders
<!-- IF {{HAS_MOBILE}} == "true" -->
Mobile screenshots: iOS {D}/{E} | Android {F}/{G}
App Store readiness: {READY | NOT READY — missing: {list}}
<!-- ENDIF -->

══════════════════════════════════════
GATE: {PASS ✅ | FAIL ❌}
══════════════════════════════════════
```

### Step 5: If FAIL

List exactly what's missing with instructions to fix:

```text
TO PASS THIS GATE:

1. {feature-name}: Run /document-feature to generate the missing guide
2. {feature-name}: Add 2 more FAQ entries (has 1, needs 3)
3. {feature-name}: Add troubleshooting entry for the "payment failed" error state
```

<!-- IF {{HAS_MOBILE}} == "true" -->
### Mobile Gate (Soft — Warning Only)

The mobile-specific checks produce **warnings, not blocking failures**:

- App Store listing content exists
- Store screenshots captured for primary device sizes
- Mobile onboarding guide complete

These are soft gates because store submission may happen in a later phase.
<!-- ENDIF -->

### Step 6: If PASS

```text
Documentation quality gate PASSED. Phase {N} documentation is complete.
You may proceed to the next phase.
```
