---
generated_date: {{GENERATED_DATE}}
---

# Changelog

All notable changes to {{PROJECT_NAME}} are documented here. This changelog is auto-updated by the `/document-feature` skill after each feature is completed.

---

## [{{VERSION}}] — {{RELEASE_DATE}}

### New Features

- **{{FEATURE_1_NAME}}** — {{FEATURE_1_SHORT_DESCRIPTION}}. [Learn more]({{USER_DOCS_PATH}}/guides/{{FEATURE_1_SLUG}}.md)
<!-- IF {{HAS_MOBILE}} == "true" -->
  - Available on: {{FEATURE_1_PLATFORMS}}
<!-- ENDIF -->

### Improvements

- {{IMPROVEMENT_1_DESCRIPTION}}

### Bug Fixes

- {{BUGFIX_1_DESCRIPTION}}

### Breaking Changes

- {{BREAKING_CHANGE_1_DESCRIPTION}} — [Migration guide]({{USER_DOCS_PATH}}/guides/{{MIGRATION_GUIDE_SLUG}}.md)

---

<!-- Template notes for the AI builder:

When appending a new entry:
1. Add the new version section at the TOP (newest first)
2. Link every new feature to its guide
3. Use past tense ("Added", "Fixed", "Improved")
4. Keep descriptions user-facing (no technical jargon)
5. If a breaking change affects user workflows, link to a migration guide

Categories to use:
- New Features: wholly new functionality
- Improvements: enhancements to existing features
- Bug Fixes: corrections to broken behavior
- Breaking Changes: changes that affect existing user workflows (rare)
- Deprecations: features that will be removed in a future version

For mobile apps, also note:
- Minimum OS version changes
- New permissions required
- Features that require app update
-->
