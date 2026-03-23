# App Store Listing Generator

**Purpose:** Generate app store listing content for both Apple App Store and Google Play Store
by reading the tribunal output, project brief, and user personas. Produces store-ready
metadata including titles, descriptions, keywords, screenshot scenarios, and privacy
declarations.

**Output:** `dev_docs/mobile/app-store-listing.md`

---

## When to Run

Run this generator:

- During Step 14.5 (Store Submission Readiness gate)
- When preparing for first app store submission
- When updating store listings for major feature releases
- After significant pivot or repositioning

---

## Inputs Required

| Input | Location | What it provides |
| ----- | -------- | ---------------- |
| Project brief | `dev_docs/PROJECT-BRIEF.md` | Product description, target market |
| Tribunal executive summary | `dev_docs/tribunal/10-deliverables/executive-summary.md` | Feature priorities, market positioning |
| User personas | `dev_docs/user-personas.md` | Target user descriptions, pain points |
| Mobile screen catalog | `dev_docs/mobile-screen-catalog.md` | Screens to showcase in screenshots |
| Competitor research | `dev_docs/tribunal/02-competitor-research/` | Competitor positioning to differentiate from |
| Native features audit | `dev_docs/mobile/native-features-audit.md` | Privacy-relevant features (camera, location, etc.) |

---

## Generation Algorithm

1. **Read the project brief.** Extract:
   - One-sentence product description (A1 answer)
   - Target market and customer type
   - Core daily action (A3 answer)
   - Key differentiators from competitors

2. **Read user personas.** For each persona:
   - What problem does the app solve for them?
   - What is their primary use case?
   - What language/tone resonates with them?

3. **Read competitor store listings.** Note:
   - What keywords competitors use
   - What screenshots they show
   - What their descriptions emphasize
   - Gaps you can exploit (features they lack)

4. **Generate all listing sections** per the format below.

5. **Read the native features audit.** Map native APIs to privacy declarations:
   - Camera → "We use your camera to scan barcodes/documents"
   - Location → "We use your location to provide navigation/tracking"
   - Contacts → "We access your contacts to help you invite team members"
   - Push → "We send notifications for status updates/alerts"

6. **Validate** all content meets platform character limits.

---

## Listing Output Format

Write to `dev_docs/mobile/app-store-listing.md`:

```markdown
# App Store Listing — {{PROJECT_NAME}}

> Generated from tribunal output and project brief.
> Last updated: {{DATE}}

---

## App Identity

| Field | Value | Limit |
|-------|-------|-------|
| **App Name** | {{APP_NAME}} | 30 chars (iOS) / 50 chars (Android) |
| **Bundle ID** | com.{{COMPANY}}.{{PROJECT_SLUG}} | — |
| **Package Name** | com.{{COMPANY}}.{{PROJECT_SLUG}} | — |
| **Category** | {{CATEGORY}} (e.g., Business, Productivity) | Primary + secondary |
| **Content Rating** | {{RATING}} (e.g., 4+, Everyone) | Per IARC questionnaire |

---

## Apple App Store Listing

### Title (30 characters max)
```
{{APP_NAME}}
```
Characters used: {{N}}/30

### Subtitle (30 characters max)
```
{{SUBTITLE — describes core value proposition}}
```
Characters used: {{N}}/30

### Keywords (100 characters max, comma-separated)
```
{{keyword1}},{{keyword2}},{{keyword3}},...
```
Characters used: {{N}}/100

**Keyword strategy:**
- Include: core function keywords, industry terms, action verbs
- Exclude: app name (already indexed), competitor names (rejection risk), generic terms
- Prioritize: long-tail keywords with less competition

### Promotional Text (170 characters, can be updated without review)
```
{{PROMOTIONAL_TEXT — current promotion, seasonal message, or key update}}
```

### Description (4000 characters max)
```
{{DESCRIPTION}}

**Paragraph 1: Hook (what problem it solves)**
{{HOOK — start with the user's pain point, then the solution}}

**Paragraph 2: Key features (bullet points)**
• {{Feature 1 — tied to core daily action}}
• {{Feature 2 — biggest differentiator}}
• {{Feature 3 — secondary value}}
• {{Feature 4 — trust/security feature}}

**Paragraph 3: Who it's for**
{{TARGET_AUDIENCE — describe the ideal user}}

**Paragraph 4: Call to action**
{{CTA — what to do next, what to expect}}
```

### What's New (for updates)
```
Version {{VERSION}}:
• {{Change 1}}
• {{Change 2}}
• {{Bug fix summary}}
```

---

## Google Play Store Listing

### Title (50 characters max)
```
{{APP_NAME}} — {{SHORT_TAGLINE}}
```
Characters used: {{N}}/50

### Short Description (80 characters max)
```
{{SHORT_DESCRIPTION — one sentence, action-oriented}}
```
Characters used: {{N}}/80

### Full Description (4000 characters max)
```
{{FULL_DESCRIPTION — can differ from iOS to optimize for Play Store search}}
```

---

## Screenshot Scenarios

Screenshots should tell a story: problem → solution → key features → social proof.

### iPhone Screenshots (6.7" required, 6.5" and 5.5" recommended)

| # | Screen | Caption | Purpose |
|---|--------|---------|---------|
| 1 | {{HERO_SCREEN}} | "{{HEADLINE — biggest value prop}}" | Hook — show the core experience |
| 2 | {{CORE_ACTION_SCREEN}} | "{{HEADLINE — core daily action}}" | Show the main thing users do |
| 3 | {{FEATURE_SCREEN_1}} | "{{HEADLINE — key differentiator}}" | Differentiate from competitors |
| 4 | {{FEATURE_SCREEN_2}} | "{{HEADLINE — secondary feature}}" | Show depth |
| 5 | {{DASHBOARD_SCREEN}} | "{{HEADLINE — data/insights}}" | Show the value of data |
| 6 | {{SETTINGS_SCREEN}} | "{{HEADLINE — trust/control}}" | Build trust |

### Android Screenshots (Phone required, 7" and 10" tablet recommended)

Same scenarios as iPhone, adapted for Android UI.

### Screenshot Design Rules
- Use device frames (Figma plugin or fastlane frameit)
- Add headline text above the device frame
- Use brand colors for background
- Show real-looking data (not "Lorem ipsum" or "Test User")
- First screenshot is most important — it appears in search results

---

## Privacy Declarations

### Apple App Privacy (App Store Connect)

| Data Type | Collected | Linked to Identity | Used for Tracking | Purpose |
|-----------|-----------|-------------------|-------------------|---------|
| Email address | Yes | Yes | No | Account creation, communication |
| Name | Yes | Yes | No | Profile display |
| Location | {{Yes/No}} | {{Yes/No}} | No | {{Purpose}} |
| Photos | {{Yes/No}} | No | No | {{Purpose}} |
| Contacts | {{Yes/No}} | No | No | {{Purpose}} |
| Usage data | Yes | Yes | No | App analytics, improvement |
| Crash data | Yes | No | No | Stability improvement |
| Device ID | Yes | No | No | Push notifications |

### Google Play Data Safety

| Data Type | Collected | Shared | Purpose | Required |
|-----------|-----------|--------|---------|----------|
| Email address | Yes | No | Account management | Yes |
| Name | Yes | No | App functionality | Yes |
| Location | {{Yes/No}} | No | {{Purpose}} | {{Yes/No}} |
| Photos | {{Yes/No}} | No | {{Purpose}} | {{Yes/No}} |
| App interactions | Yes | No | Analytics | Yes |
| Crash logs | Yes | No | App stability | Yes |

**Data deletion:** Users can request account and data deletion via {{METHOD}}.
**Data encryption:** All data encrypted in transit (HTTPS) and at rest.

---

## Review Notes

Notes to include when submitting for Apple App Review:

```
Test Account:
  Email: {{TEST_EMAIL}}
  Password: {{TEST_PASSWORD}}

Key features to test:
1. {{Feature 1}} — navigate to {{screen}}, tap {{button}}
2. {{Feature 2}} — {{instructions}}

Notes:
- {{Any special instructions for reviewers}}
- {{Explanation of any features that might seem like guideline violations}}
```

---

## Pre-Submission Checklist

### Apple App Store
- [ ] App name and subtitle set
- [ ] Keywords populated (100 char max)
- [ ] Description written
- [ ] Screenshots uploaded (6.7", 6.5", 5.5")
- [ ] iPad screenshots uploaded (if universal app)
- [ ] App icon uploaded (1024x1024, no transparency)
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Age rating questionnaire completed
- [ ] App Privacy labels completed
- [ ] Review notes with test account
- [ ] IDFA declaration completed
- [ ] Export compliance answered

### Google Play Store
- [ ] Title and descriptions set
- [ ] Feature graphic uploaded (1024x500)
- [ ] Screenshots uploaded (phone + tablet)
- [ ] App icon uploaded (512x512)
- [ ] Content rating questionnaire completed
- [ ] Data safety section completed
- [ ] Privacy policy URL added
- [ ] Target API level meets requirement
- [ ] Signing key configured (Play App Signing)
```

---

## Validation Checklist

After generation, verify:

- [ ] All character limits are respected (title, subtitle, keywords, descriptions)
- [ ] Keywords do not include the app name (already indexed by Apple)
- [ ] Keywords do not include competitor names (rejection risk)
- [ ] Screenshot scenarios cover the core user journey
- [ ] Privacy declarations accurately reflect the native features audit
- [ ] Test account credentials are valid and accessible
- [ ] Description highlights the core daily action (A3) from intake
- [ ] Description differentiates from top competitors
- [ ] All checklist items are addressed
