<!-- IF {{HAS_MOBILE}} == "true" -->
---
generated_date: {{GENERATED_DATE}}
app_store_id: {{APP_STORE_ID}}
play_store_id: {{PLAY_STORE_ID}}
---

# App Store & Play Store Listing Content

Marketing-facing content for {{PROJECT_NAME}} mobile app. This content is **persuasive** (convincing users to download), unlike user documentation which is **instructional** (helping users accomplish tasks). They share screenshots but use different text.

---

## App Identity

| Field | Value |
|-------|-------|
| **App Name** | {{PROJECT_NAME}} |
| **Subtitle** (iOS, 30 chars max) | {{APP_SUBTITLE}} |
| **Short Description** (Android, 80 chars max) | {{APP_SHORT_DESCRIPTION}} |
| **Category** | {{APP_CATEGORY}} |
| **Age Rating** | {{APP_AGE_RATING}} |

---

## Full Description

### App Store (iOS) — 4000 character limit

{{IOS_FULL_DESCRIPTION}}

**Key features:**
- {{KEY_FEATURE_1}}
- {{KEY_FEATURE_2}}
- {{KEY_FEATURE_3}}
- {{KEY_FEATURE_4}}
- {{KEY_FEATURE_5}}

{{IOS_CLOSING_CTA}}

### Play Store (Android) — 4000 character limit

{{ANDROID_FULL_DESCRIPTION}}

**Highlights:**
- {{KEY_FEATURE_1}}
- {{KEY_FEATURE_2}}
- {{KEY_FEATURE_3}}
- {{KEY_FEATURE_4}}
- {{KEY_FEATURE_5}}

{{ANDROID_CLOSING_CTA}}

---

## Keywords

### App Store (iOS) — 100 character limit, comma-separated

```text
{{IOS_KEYWORDS}}
```

### Play Store (Android)

Keywords are extracted from the description. Ensure these terms appear naturally:

```text
{{ANDROID_KEYWORDS}}
```

---

## Promotional Text (iOS only, 170 chars)

Updated without app review — use for seasonal promotions, new features, events.

```text
{{IOS_PROMOTIONAL_TEXT}}
```

---

## What's New (per version)

Updated each release. Ties into the [Changelog]({{USER_DOCS_PATH}}/changelog.md).

### Version {{VERSION}}

```text
{{WHATS_NEW_TEXT}}
```

---

## Screenshot Ordering

Screenshots appear in this order on both stores. See `mobile/app-store-screenshot-spec.md` for size requirements.

| # | Screen | Description | Key Message |
|---|--------|-------------|-------------|
| 1 | {{SCREENSHOT_1_SCREEN}} | {{SCREENSHOT_1_DESCRIPTION}} | {{SCREENSHOT_1_MESSAGE}} |
| 2 | {{SCREENSHOT_2_SCREEN}} | {{SCREENSHOT_2_DESCRIPTION}} | {{SCREENSHOT_2_MESSAGE}} |
| 3 | {{SCREENSHOT_3_SCREEN}} | {{SCREENSHOT_3_DESCRIPTION}} | {{SCREENSHOT_3_MESSAGE}} |
| 4 | {{SCREENSHOT_4_SCREEN}} | {{SCREENSHOT_4_DESCRIPTION}} | {{SCREENSHOT_4_MESSAGE}} |
| 5 | {{SCREENSHOT_5_SCREEN}} | {{SCREENSHOT_5_DESCRIPTION}} | {{SCREENSHOT_5_MESSAGE}} |

**Strategy:** Hero shot first (the core value proposition), then key features in order of importance, then social proof or advanced features.

---

## iOS-Specific

### Privacy Nutrition Labels

| Data Type | Collected | Linked to Identity | Used for Tracking |
|-----------|-----------|-------------------|-------------------|
| {{DATA_TYPE_1}} | {{COLLECTED_1}} | {{LINKED_1}} | {{TRACKING_1}} |
| {{DATA_TYPE_2}} | {{COLLECTED_2}} | {{LINKED_2}} | {{TRACKING_2}} |

### App Clips

<!-- IF {{HAS_APP_CLIPS}} == "true" -->
App Clip URL: {{APP_CLIP_URL}}
App Clip description: {{APP_CLIP_DESCRIPTION}}
<!-- ENDIF -->

---

## Android-Specific

### Play Store Tags

{{PLAY_STORE_TAGS}}

### Content Rating Questionnaire

Category: {{CONTENT_RATING_CATEGORY}}
Violence: {{CONTENT_RATING_VIOLENCE}}
Sexual content: {{CONTENT_RATING_SEXUAL}}
Language: {{CONTENT_RATING_LANGUAGE}}
Controlled substance: {{CONTENT_RATING_SUBSTANCE}}

### Data Safety Section

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| {{DATA_TYPE_1}} | {{COLLECTED_1}} | {{SHARED_1}} | {{PURPOSE_1}} |
| {{DATA_TYPE_2}} | {{COLLECTED_2}} | {{SHARED_2}} | {{PURPOSE_2}} |

---

<!-- Template notes for the AI builder:

1. Write MARKETING copy, not documentation. Persuade, don't instruct.
2. Front-load the most compelling value proposition.
3. Use short paragraphs and bullet points — users skim store listings.
4. Include relevant keywords naturally (don't stuff).
5. Keep "What's New" concise — 3-5 bullet points max.
6. Update the Privacy Nutrition Labels / Data Safety every time you add a new data collection feature.
7. Screenshot order matters — the first 2-3 are visible without scrolling.
-->
<!-- ENDIF -->
