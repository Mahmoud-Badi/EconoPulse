<!-- IF {{HAS_MOBILE}} == "true" -->
---
feature: {{FEATURE_SLUG}}
generated_date: {{GENERATED_DATE}}
platforms: [ios, android]
scope: platform-differences
---

# Platform Differences: {{FEATURE_NAME}}

> Use this template when iOS and Android behavior for a single feature diverges enough that a table inside the main feature guide is insufficient. In most cases, document differences as a "Platform Notes" table within `user_docs/guides/{{FEATURE_SLUG}}.md` instead. Create this standalone file only when differences span multiple workflows or require their own screenshots and steps.

---

## Overview

**Feature:** {{FEATURE_NAME}}

**What this document covers:** The behavioral, visual, and interaction differences between the iOS and Android implementations of {{FEATURE_NAME}} in {{PROJECT_NAME}}.

**Primary guide:** For complete feature instructions, see [{{FEATURE_NAME}}]({{USER_DOCS_PATH}}/guides/{{FEATURE_SLUG}}.md). This document is a reference supplement, not a standalone how-to guide.

---

## Behavior on iOS

{{IOS_BEHAVIOR_DESCRIPTION}}

### iOS Step-by-Step

1. {{IOS_STEP_1}}
2. {{IOS_STEP_2}}
3. {{IOS_STEP_3}}

**What you should see:** {{IOS_EXPECTED_RESULT}}

![Screenshot: {{FEATURE_NAME}} on iOS — main view]({{USER_DOCS_PATH}}/screenshots/ios/{{FEATURE_SLUG}}/main.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen in default state -->

<!-- IF {{IOS_HAS_SECONDARY_STATE}} == "true" -->
![Screenshot: {{FEATURE_NAME}} on iOS — {{IOS_SECONDARY_STATE_LABEL}}]({{USER_DOCS_PATH}}/screenshots/ios/{{FEATURE_SLUG}}/secondary.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{MOBILE_SCREEN_PATH}}, trigger {{IOS_SECONDARY_STATE_TRIGGER}}, capture result -->
<!-- ENDIF -->

### iOS-Specific Settings Path

To access related settings on iOS:

**Settings → {{PROJECT_NAME}} → {{IOS_SETTINGS_SUBSECTION}}**

![Screenshot: iOS Settings for {{FEATURE_NAME}}]({{USER_DOCS_PATH}}/screenshots/ios/{{FEATURE_SLUG}}/settings.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to iOS Settings → {{PROJECT_NAME}} → {{IOS_SETTINGS_SUBSECTION}}, capture full screen -->

---

## Behavior on Android

{{ANDROID_BEHAVIOR_DESCRIPTION}}

### Android Step-by-Step

1. {{ANDROID_STEP_1}}
2. {{ANDROID_STEP_2}}
3. {{ANDROID_STEP_3}}

**What you should see:** {{ANDROID_EXPECTED_RESULT}}

![Screenshot: {{FEATURE_NAME}} on Android — main view]({{USER_DOCS_PATH}}/screenshots/android/{{FEATURE_SLUG}}/main.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen in default state -->

<!-- IF {{ANDROID_HAS_SECONDARY_STATE}} == "true" -->
![Screenshot: {{FEATURE_NAME}} on Android — {{ANDROID_SECONDARY_STATE_LABEL}}]({{USER_DOCS_PATH}}/screenshots/android/{{FEATURE_SLUG}}/secondary.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to {{MOBILE_SCREEN_PATH}}, trigger {{ANDROID_SECONDARY_STATE_TRIGGER}}, capture result -->
<!-- ENDIF -->

### Android-Specific Settings Path

To access related settings on Android:

**Settings → Apps → {{PROJECT_NAME}} → {{ANDROID_SETTINGS_SUBSECTION}}**

![Screenshot: Android Settings for {{FEATURE_NAME}}]({{USER_DOCS_PATH}}/screenshots/android/{{FEATURE_SLUG}}/settings.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to Android Settings → Apps → {{PROJECT_NAME}} → {{ANDROID_SETTINGS_SUBSECTION}}, capture full screen -->

---

## Visual Differences

Screenshots side-by-side for documentation team reference:

| Element | iOS | Android |
|---------|-----|---------|
| **Navigation style** | {{IOS_NAVIGATION_STYLE}} | {{ANDROID_NAVIGATION_STYLE}} |
| **Primary action button** | {{IOS_PRIMARY_ACTION_LOCATION}} | {{ANDROID_PRIMARY_ACTION_LOCATION}} |
| **Modal / sheet style** | {{IOS_MODAL_STYLE}} | {{ANDROID_MODAL_STYLE}} |
| **Typography** | San Francisco (system) | Roboto (system) |
| **Icons** | {{IOS_ICON_STYLE}} | {{ANDROID_ICON_STYLE}} |
| **Status bar** | Light or dark content | Light or dark content |

### iOS Screenshot

![Screenshot: {{FEATURE_NAME}} full-page iOS]({{USER_DOCS_PATH}}/screenshots/ios/{{FEATURE_SLUG}}/visual-reference.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen with seed data loaded -->

### Android Screenshot

![Screenshot: {{FEATURE_NAME}} full-page Android]({{USER_DOCS_PATH}}/screenshots/android/{{FEATURE_SLUG}}/visual-reference.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen with seed data loaded -->

---

## Behavioral Differences Summary

| Behavior | iOS | Android |
|----------|-----|---------|
| {{DIFFERENCE_1_LABEL}} | {{IOS_BEHAVIOR_1}} | {{ANDROID_BEHAVIOR_1}} |
| {{DIFFERENCE_2_LABEL}} | {{IOS_BEHAVIOR_2}} | {{ANDROID_BEHAVIOR_2}} |
| {{DIFFERENCE_3_LABEL}} | {{IOS_BEHAVIOR_3}} | {{ANDROID_BEHAVIOR_3}} |
| {{DIFFERENCE_4_LABEL}} | {{IOS_BEHAVIOR_4}} | {{ANDROID_BEHAVIOR_4}} |
| Minimum OS version | iOS {{IOS_MIN_VERSION}} | Android {{ANDROID_MIN_VERSION}} (API {{ANDROID_MIN_API}}) |
| Permission required | {{IOS_PERMISSION_REQUIRED}} | {{ANDROID_PERMISSION_REQUIRED}} |

---

## Known Platform-Specific Limitations

### iOS Limitations

- **{{IOS_LIMITATION_1_TITLE}}:** {{IOS_LIMITATION_1_DESCRIPTION}}
- **{{IOS_LIMITATION_2_TITLE}}:** {{IOS_LIMITATION_2_DESCRIPTION}}

<!-- IF {{IOS_HAS_WORKAROUND}} == "true" -->
**Workaround for {{IOS_WORKAROUND_LIMITATION}}:**

{{IOS_WORKAROUND_STEPS}}
<!-- ENDIF -->

### Android Limitations

- **{{ANDROID_LIMITATION_1_TITLE}}:** {{ANDROID_LIMITATION_1_DESCRIPTION}}
- **{{ANDROID_LIMITATION_2_TITLE}}:** {{ANDROID_LIMITATION_2_DESCRIPTION}}

<!-- IF {{ANDROID_HAS_WORKAROUND}} == "true" -->
**Workaround for {{ANDROID_WORKAROUND_LIMITATION}}:**

{{ANDROID_WORKAROUND_STEPS}}
<!-- ENDIF -->

### Limitations on Both Platforms

- {{SHARED_LIMITATION_1}}
- {{SHARED_LIMITATION_2}}

---

## Version History of Platform Differences

Track when differences were introduced or resolved so future writers know the history:

| Version | Platform | Change |
|---------|----------|--------|
| {{VERSION_1}} | {{PLATFORM_1}} | {{CHANGE_DESCRIPTION_1}} |
| {{VERSION_2}} | {{PLATFORM_2}} | {{CHANGE_DESCRIPTION_2}} |

---

## Related Documentation

- [{{FEATURE_NAME}} — Full Guide]({{USER_DOCS_PATH}}/guides/{{FEATURE_SLUG}}.md)
- [Mobile Onboarding]({{USER_DOCS_PATH}}/guides/mobile/onboarding.md)
- [Push Notifications]({{USER_DOCS_PATH}}/guides/mobile/push-notifications.md)

---

*Last updated: {{GENERATED_DATE}} | [Report an issue]({{SUPPORT_URL}})*

<!-- Template notes for the AI builder:

1. Only create this file if the behavioral differences are too extensive for a table in the main feature guide.
2. Keep iOS and Android sections parallel in structure — same sub-headings, same level of detail.
3. The "Behavioral Differences Summary" table is the most important section — readers often jump straight to it.
4. Never omit "Known Platform-Specific Limitations" — even if empty, write "No known limitations at this time." Leaving it blank looks like an oversight.
5. Screenshot placeholders must include exact navigation paths so the /capture-screenshots skill can automate them.
-->
<!-- ENDIF -->
