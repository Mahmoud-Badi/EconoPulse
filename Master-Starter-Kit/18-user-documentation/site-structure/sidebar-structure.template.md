---
generated_date: {{GENERATED_DATE}}
---

# Documentation Sidebar Structure

Navigation tree for the {{PROJECT_NAME}} documentation site. Auto-generated from the feature list and screen catalog. Update this file when adding new features or reorganizing documentation.

---

## Sidebar Tree

```text
{{PROJECT_NAME}} Docs
├── Getting Started
│   ├── Welcome
│   ├── Create Your Account
│   ├── {{USER_ROLE_1}} Guide → getting-started/{{USER_ROLE_1_SLUG}}.md
│   ├── {{USER_ROLE_2}} Guide → getting-started/{{USER_ROLE_2_SLUG}}.md
│   └── {{USER_ROLE_3}} Guide → getting-started/{{USER_ROLE_3_SLUG}}.md
│
├── Features
│   ├── {{FEATURE_GROUP_1}}
│   │   ├── {{FEATURE_1_1_NAME}} → guides/{{FEATURE_1_1_SLUG}}.md
│   │   ├── {{FEATURE_1_2_NAME}} → guides/{{FEATURE_1_2_SLUG}}.md
│   │   └── {{FEATURE_1_3_NAME}} → guides/{{FEATURE_1_3_SLUG}}.md
│   ├── {{FEATURE_GROUP_2}}
│   │   ├── {{FEATURE_2_1_NAME}} → guides/{{FEATURE_2_1_SLUG}}.md
│   │   └── {{FEATURE_2_2_NAME}} → guides/{{FEATURE_2_2_SLUG}}.md
│   └── {{FEATURE_GROUP_3}}
│       ├── {{FEATURE_3_1_NAME}} → guides/{{FEATURE_3_1_SLUG}}.md
│       └── {{FEATURE_3_2_NAME}} → guides/{{FEATURE_3_2_SLUG}}.md
│
<!-- IF {{HAS_MOBILE}} == "true" -->
├── Mobile App
│   ├── Download & Setup
│   ├── Mobile-Specific Features
│   │   ├── {{MOBILE_FEATURE_1}} → guides/mobile/{{MOBILE_FEATURE_1_SLUG}}.md
│   │   └── {{MOBILE_FEATURE_2}} → guides/mobile/{{MOBILE_FEATURE_2_SLUG}}.md
│   ├── Offline Mode → guides/mobile/offline-mode.md
│   └── Push Notifications → guides/mobile/push-notifications.md
│
<!-- ENDIF -->
├── Tutorials
│   ├── {{TUTORIAL_1_TITLE}} → tutorials/{{TUTORIAL_1_SLUG}}.md
│   └── {{TUTORIAL_2_TITLE}} → tutorials/{{TUTORIAL_2_SLUG}}.md
│
├── FAQ
│   ├── {{FAQ_CATEGORY_1}} → faq/{{FAQ_CATEGORY_1_SLUG}}.md
│   ├── {{FAQ_CATEGORY_2}} → faq/{{FAQ_CATEGORY_2_SLUG}}.md
│   └── {{FAQ_CATEGORY_3}} → faq/{{FAQ_CATEGORY_3_SLUG}}.md
│
├── Troubleshooting
│   ├── {{TROUBLESHOOT_TOPIC_1}} → troubleshooting/{{TROUBLESHOOT_TOPIC_1_SLUG}}.md
│   └── {{TROUBLESHOOT_TOPIC_2}} → troubleshooting/{{TROUBLESHOOT_TOPIC_2_SLUG}}.md
│
└── Changelog → changelog.md
```

---

## Sidebar Configuration

### Docusaurus (`sidebars.js`)

The AI should generate this file from the tree above:

```javascript
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [/* role-based guides */],
    },
    {
      type: 'category',
      label: 'Features',
      items: [/* feature group subcategories */],
    },
    // ... remaining categories
  ],
};
```

### Nextra (`_meta.json`)

Each directory needs a `_meta.json` file defining page order and labels.

---

## Rules for Updating

1. **New feature guide:** Add to the appropriate Feature Group subcategory
2. **New tutorial:** Add to the Tutorials section in chronological order
3. **New FAQ category:** Add to FAQ section alphabetically
4. **New troubleshooting topic:** Add to Troubleshooting section
5. **Mobile feature:** Add to Mobile App section (if mobile-only) or add "On Mobile" note to the web feature
6. **Always update this file** when adding new documentation pages
