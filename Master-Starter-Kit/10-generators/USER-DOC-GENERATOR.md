# User Documentation Generator

**Purpose:** Read the feature list, screen catalog, user roles, and error handling strategy, then generate a complete user-facing documentation skeleton with guides, FAQs, tutorials, troubleshooting, changelog, in-app help content, and screenshot manifest.

**Output:** Files in `user_docs/` directory — the end-user documentation structure.

---

## When to Run

Run this generator during **Step 15.5** of the ORCHESTRATOR (User Documentation), after:

1. Features list exists (`dev_docs/foundations/features-list.md`)
2. Screen catalog exists (`dev_docs/specs/screen-catalog.md`)
3. User roles defined (`dev_docs/foundations/user-roles.md`)
4. Error handling strategy exists (`dev_docs/specs/error-handling.md`)
5. Service specs exist (`dev_docs/specs/services/`)

<!-- IF {{HAS_MOBILE}} == "true" -->
6. Mobile screen catalog exists
7. Mobile navigation structure defined
<!-- ENDIF -->

---

## Inputs Required

| Input | Location | What It Provides |
|-------|----------|-----------------|
| Features list | `dev_docs/foundations/features-list.md` | All user-facing features grouped by category |
| Screen catalog | `dev_docs/specs/screen-catalog.md` | Every screen with its URL, components, and data |
| User roles | `dev_docs/foundations/user-roles.md` | All user types and their permissions |
| Error handling | `dev_docs/specs/error-handling.md` | Error codes, messages, recovery strategies |
| Service specs | `dev_docs/specs/services/` | Per-service API details and domain logic |
| Project brief | `dev_docs/foundations/project-brief.md` | Project name, description, support URL |
<!-- IF {{HAS_MOBILE}} == "true" -->
| Mobile screens | Mobile screen catalog or navigation structure | Mobile-specific screens and features |
| App Store info | Project brief or discovery docs | App Store / Play Store requirements |
<!-- ENDIF -->

---

## Generation Steps

### Step 1: Create Directory Structure

```text
user_docs/
├── guides/
│   └── mobile/                    (if HAS_MOBILE)
├── faq/
├── getting-started/
├── tutorials/
├── troubleshooting/
├── changelog.md
├── in-app/
│   └── mobile/                    (if HAS_MOBILE)
├── screenshots/
│   ├── web/
│   ├── ios/                       (if HAS_MOBILE)
│   ├── android/                   (if HAS_MOBILE)
│   └── store/                     (if HAS_MOBILE)
│       ├── ios/
│       └── android/
├── store-listing/                 (if HAS_MOBILE)
└── DOC-INDEX.md
```

### Step 2: Generate Feature Guide Skeletons

For each feature in the features list:

1. Read the feature spec from `dev_docs/specs/features/`
2. Read the associated screen spec(s) from the screen catalog
3. Determine platform scope:
   - Web-only → generate guide from `18-user-documentation/doc-types/feature-guide.template.md`
   - Cross-platform → generate guide with "On Mobile" section filled in
   - Mobile-only → generate guide in `user_docs/guides/mobile/`
4. Populate the template with:
   - Feature name and description (from feature spec)
   - Target user roles (from feature spec's access control)
   - Prerequisites (inferred from dependencies)
   - Step-by-step instructions (derived from the screen spec's user flows)
   - Screenshot placeholders (one per major screen/action)
   - FAQ entries (3 minimum per feature — derive from common questions about the feature)
   - Troubleshooting entries (from error states in the feature spec)
5. Save to `user_docs/guides/{feature-slug}.md`

### Step 3: Generate FAQ Skeletons

For each feature group in the features list:

1. Create a FAQ file: `user_docs/faq/{category-slug}.md`
2. Using the `18-user-documentation/doc-types/faq-entry.template.md` template
3. Populate with FAQ entries from the feature guide generation (Step 2)
4. Add cross-feature FAQs (e.g., "How do I reset my password?" spans auth features)

### Step 4: Generate Onboarding Guides

For each user role:

1. Create an onboarding guide: `user_docs/getting-started/{role-slug}.md`
2. Using the `18-user-documentation/doc-types/onboarding-guide.template.md` template
3. Customize the steps based on the role's permissions and primary workflows
4. Include screenshot placeholders for the signup, profile, and first workflow screens

<!-- IF {{HAS_MOBILE}} == "true" -->
5. Add mobile onboarding section if the user role has mobile access
6. Create mobile-specific onboarding guide: `user_docs/getting-started/mobile.md`
   Using `18-user-documentation/mobile/mobile-onboarding-guide.template.md`
<!-- ENDIF -->

### Step 5: Generate Troubleshooting Index

1. Read the error handling strategy for all error codes and messages
2. Create troubleshooting files by category: `user_docs/troubleshooting/{category}.md`
3. Using the `18-user-documentation/doc-types/troubleshooting.template.md` template
4. Populate with error messages → user-friendly messages → solutions
5. Generate the error-help mapping: update `user_docs/in-app/error-help-mapping.json`

### Step 6: Initialize Changelog

1. Create `user_docs/changelog.md` from `18-user-documentation/doc-types/changelog-entry.template.md`
2. Add the initial entry: version 0.1.0, date = today, "Project initialized" with links to the getting started guide

### Step 7: Generate In-App Help Content

For each screen in the screen catalog:

1. Create help JSON: `user_docs/in-app/{screen-slug}.json`
2. Populate with:
   - Screen title and description
   - Link to the corresponding feature guide
   - Tooltip entries for form fields and action buttons
   - Contextual help sections (summary of the feature guide)

<!-- IF {{HAS_MOBILE}} == "true" -->
3. For mobile screens, create: `user_docs/in-app/mobile/{screen-slug}-help.json`
4. Generate coach mark tour definitions: `user_docs/in-app/mobile/{screen-slug}-tour.json`
5. Generate onboarding carousel: `user_docs/in-app/mobile/onboarding-carousel.json`
<!-- ENDIF -->

### Step 8: Generate Screenshot Manifest

1. Create `user_docs/screenshot-manifest.md` from `18-user-documentation/screenshot-automation/screenshot-manifest.template.md`
2. For each screenshot placeholder across all generated docs:
   - Add an entry to the manifest with: feature, filename, URL/screen, viewport, setup instructions, status=pending

<!-- IF {{HAS_MOBILE}} == "true" -->
3. Add mobile screenshot entries for each mobile screen
4. Add App Store screenshot entries per `18-user-documentation/mobile/app-store-screenshot-spec.md`
<!-- ENDIF -->

### Step 9: Generate DOC-INDEX.md

1. Create `user_docs/DOC-INDEX.md` — the documentation coverage tracker
2. List every feature with documentation status:

```markdown
# Documentation Index — {{PROJECT_NAME}}

## Coverage Summary
- Features documented: 0/{{TOTAL_FEATURES}} (0%)
- FAQ entries: {{FAQ_COUNT}}
- Troubleshooting articles: {{TROUBLESHOOT_COUNT}}
- Screenshots: 0/{{TOTAL_SCREENSHOTS}} captured (0%)
- In-app help screens: {{IN_APP_COUNT}}

## Feature Documentation Status

| Feature | Guide | FAQ | Troubleshoot | Changelog | In-App | Screenshots | Status |
|---------|-------|-----|-------------|-----------|--------|-------------|--------|
| {{FEATURE_1}} | skeleton | 3 entries | 1 entry | pending | created | 0/3 | skeleton |
```

<!-- IF {{HAS_MOBILE}} == "true" -->

### Step 10: Generate Mobile-Specific Docs

1. Generate App Store listing skeleton: `user_docs/store-listing/app-store-listing.md`
   From `18-user-documentation/doc-types/app-store-listing.template.md`
2. Generate push notification guide: `user_docs/guides/mobile/push-notifications.md`
   From `18-user-documentation/mobile/push-notification-guide.template.md`
3. If `{{MOBILE_OFFLINE}} == "true"`:
   Generate offline mode guide: `user_docs/guides/mobile/offline-mode.md`
   From `18-user-documentation/mobile/offline-mode-guide.template.md`
4. Generate mobile screenshot manifest entries
<!-- ENDIF -->

---

## Output Verification

After generation, verify:

- [ ] `user_docs/` directory exists with all subdirectories
- [ ] One guide file exists per user-facing feature
- [ ] One FAQ file exists per feature category
- [ ] One onboarding guide exists per user role
- [ ] At least one troubleshooting file exists
- [ ] `changelog.md` exists with initial entry
- [ ] In-app help JSON exists for every screen in the catalog
- [ ] `screenshot-manifest.md` exists with entries for all placeholder screenshots
- [ ] `DOC-INDEX.md` exists with all features listed

<!-- IF {{HAS_MOBILE}} == "true" -->
- [ ] Mobile guide directory exists with mobile-only feature guides
- [ ] App Store listing skeleton exists
- [ ] Mobile in-app help files exist
- [ ] Mobile screenshot manifest entries exist
<!-- ENDIF -->

Present the summary:

```text
USER DOCUMENTATION SKELETON GENERATED

Feature guides: {X} ({Y} web, {Z} cross-platform, {W} mobile-only)
FAQ files: {N} categories, {M} total entries
Onboarding guides: {P} (one per role)
Troubleshooting files: {Q} categories
In-app help: {R} screen JSONs
Screenshot manifest: {S} screenshots pending
Changelog: initialized

Status: All skeleton — content will be populated by /document-feature after each task
```
