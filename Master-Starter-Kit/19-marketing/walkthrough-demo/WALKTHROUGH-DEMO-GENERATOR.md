# Walkthrough Demo Generator — Prompt

> **Used by:** Step 19 (Marketing) — Walkthrough Demo sub-step
> **Input:** Filled planning templates, architecture specs, brand messaging, Tribunal personas
> **Output:** Customized demo engine code + `demo-config.json` + deployment-ready HTML bundle

---

## Generator Instructions

You are generating an interactive walkthrough demo for {{PROJECT_NAME}}. This demo is a shareable link that lets potential clients explore the product with guided tours, hotspot highlights, and conversion CTAs.

### Before Starting

1. Read the filled planning templates in this folder:
   - `demo-strategy.md` — objectives, audience, success metrics
   - `feature-map.md` — features to showcase, priority, tour order
   - `demo-script.md` — tooltip text, narration, CTA copy
   - `sandbox-config.md` — seed data, mock API responses, approach decision
   - `cta-lead-capture.md` — CTA strategy, form fields, endpoints
   - `mobile-adaptation.md` — platform strategy, responsive/frame approach
   - `analytics-tracking.md` — events to track, provider setup

2. Read supporting inputs from earlier steps:
   - `dev_docs/specs/` — service specs and screen specs (for feature accuracy)
   - `dev_docs/foundations/design-system.md` — brand colors, fonts, spacing
   - Brand messaging from `19-marketing/brand-messaging/` — voice and tone
   - Tribunal persona files from `dev_docs/tribunal/` — target audience details

3. Read the starter code in `engine/`:
   - `walkthrough-engine.js` — core tour system
   - `walkthrough-engine.css` — component styles
   - `cta-module.js` — CTA/lead capture system
   - `cta-module.css` — CTA styles
   - `index.template.html` — HTML shell
   - `demo-config.example.json` — configuration reference

---

## Generation Process

### Phase 1: Generate `demo-config.json`

Transform the filled templates into a complete configuration file.

**From `feature-map.md`:**
- Map each prioritized feature to a tour step
- Set step order based on the tour flow logic
- Mark interactive vs view-only per step
- Set hotspot positions based on UI layout

**From `demo-script.md`:**
- Set step titles, descriptions, and tooltip content
- Set welcome screen and end screen copy
- Set transition text between sections

**From `cta-lead-capture.md`:**
- Configure entry gate (enabled, fields, webhook)
- Add mid-tour CTAs to the appropriate steps
- Configure end screen CTA (primary + secondary actions)

**From `sandbox-config.md`:**
- Add sandbox mock data for interactive steps
- Define action → response mappings
- Set state persistence rules

**From `mobile-adaptation.md`:**
- Set platform mode (web / mobile / both)
- Configure phone frame if mobile demo
- Set gesture mappings

**From `analytics-tracking.md`:**
- Configure analytics provider and tracking ID
- Set custom event names

**From `demo-strategy.md`:**
- Set meta information (product name, description)

**Validation checklist:**
- [ ] Every must-show feature from the feature map has a step in the config
- [ ] Every step has tooltip content (title + description minimum)
- [ ] Entry gate webhook URL is set (or gate is disabled)
- [ ] End screen has at least one CTA with a valid URL
- [ ] Interactive steps have sandbox action/response defined
- [ ] Analytics tracking ID is set (or analytics section is omitted)

---

### Phase 2: Customize Engine Code

Take the starter code from `engine/` and customize it for {{PROJECT_NAME}}.

**CSS customizations (`walkthrough-engine.css`):**

```css
:root {
  --wt-brand-color: {{BRAND_HUE}};
  --wt-brand-color-light: /* lighter variant of BRAND_HUE */;
  --wt-font: {{BRAND_FONT}}, system-ui, sans-serif;
  --wt-radius: /* from design system */;
}
```

- Update CSS custom properties to match the project's design system
- Adjust tooltip styling to match brand voice (formal = minimal, playful = rounded + colorful)
- Add phone frame style matching the product's mobile design

**HTML customizations (`index.template.html`):**

- Set page title to "{{PROJECT_NAME}} — Interactive Demo"
- Add project logo
- Set favicon
- Set Open Graph meta tags for link sharing:
  - `og:title` — "See {{PROJECT_NAME}} in Action"
  - `og:description` — from demo strategy
  - `og:image` — demo screenshot or product logo

---

### Phase 3: Build Demo Content

Based on the approach decision in `sandbox-config.md`:

#### If Simulated Demo:

1. **Create demo screens** — Build HTML mockups of each product screen referenced in the tour steps. These are static HTML/CSS representations of the real UI.
   - Use the screen specs from `dev_docs/specs/` for accuracy
   - Include realistic sample data from the sandbox config
   - Style to match the product's design system
   - Make interactive elements (buttons, forms) functional within the demo context

2. **Create mock interactions** — For each interactive step:
   - Define what clicking the target element does (show modal, update content, navigate)
   - Create the response HTML/state change
   - Keep it simple — the goal is to demonstrate, not replicate

3. **File output:**
   - `demo-screens/` folder with HTML files for each screen
   - `demo-assets/` folder for images, icons, sample avatars

#### If Cloned Frontend:

1. **Generate mock API layer** — Create a JavaScript mock service worker or fetch interceptor that returns seed data for API calls
   - Map each API endpoint from the contracts to a mock response
   - Include realistic seed data from the sandbox config

2. **Generate setup guide** — Instructions for:
   - Building the frontend in demo mode
   - Injecting the walkthrough engine overlay
   - Configuring the mock API layer
   - Environment variables needed

3. **File output:**
   - `mock-api.js` — fetch interceptor with mock responses
   - `SETUP-GUIDE.md` — deployment instructions for cloned approach

---

### Phase 4: Configure Analytics

Based on `analytics-tracking.md`:

<!-- IF {{ANALYTICS_PROVIDER}} == "ga4" -->
Add Google Analytics 4 integration:
```javascript
// In initialization script
window.walkthroughEngine.on('step-change', (data) => {
  gtag('event', 'demo_step_viewed', {
    step_id: data.stepId,
    step_title: data.title,
    mode: data.mode
  });
});
```
<!-- ENDIF -->

<!-- IF {{ANALYTICS_PROVIDER}} == "mixpanel" -->
Add Mixpanel integration:
```javascript
window.walkthroughEngine.on('step-change', (data) => {
  mixpanel.track('Demo Step Viewed', {
    step_id: data.stepId,
    step_title: data.title,
    mode: data.mode
  });
});
```
<!-- ENDIF -->

<!-- IF {{ANALYTICS_PROVIDER}} == "custom" -->
Add custom webhook integration:
```javascript
window.walkthroughEngine.on('tour-complete', (data) => {
  fetch('{{ANALYTICS_WEBHOOK_URL}}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'demo_completed',
      ...data,
      timestamp: Date.now()
    })
  });
});
```
<!-- ENDIF -->

---

### Phase 5: Deployment Bundle

Generate a deployment-ready bundle:

```
{{PROJECT_SLUG}}-demo/
├── index.html              ← Main entry point
├── demo-config.json        ← Generated configuration
├── walkthrough-engine.js   ← Customized engine
├── walkthrough-engine.css  ← Branded styles
├── cta-module.js           ← CTA system
├── cta-module.css          ← CTA styles
├── demo-screens/           ← Screen mockups (simulated) or SETUP-GUIDE.md (cloned)
├── demo-assets/            ← Images, icons, sample data
└── README.md               ← Deployment instructions
```

**Deployment instructions to include:**
- Static hosting options (GitHub Pages, Netlify, Vercel, S3 + CloudFront)
- Custom domain setup
- SSL requirements (forms submit data, HTTPS required)
- CDN configuration for performance
- Environment-specific config (staging vs production demo)

---

## Output Checklist

After generation, verify:

- [ ] `demo-config.json` is valid JSON and covers all tour steps
- [ ] All CSS custom properties are set to project's brand values
- [ ] HTML meta tags are populated (title, OG tags, favicon)
- [ ] Entry gate form submits to the correct webhook endpoint
- [ ] All CTA links point to valid URLs
- [ ] Interactive steps respond to user clicks correctly
- [ ] Progress bar updates correctly in both guided and free modes
- [ ] Mode toggle switches cleanly between guided and free explore
- [ ] Mobile layout renders correctly (or phone frame displays properly)
- [ ] Analytics events fire on step changes, CTA clicks, and tour completion
- [ ] Bundle can be served from any static host without modifications
- [ ] No external dependencies beyond what's bundled

---

## Quality Standards

| Aspect | Requirement |
|--------|------------|
| **Load time** | Demo should load in <2 seconds on 3G. No heavy assets. |
| **Accessibility** | Keyboard navigation for tour steps. ARIA labels on interactive elements. |
| **Browser support** | Chrome, Firefox, Safari, Edge (last 2 versions). |
| **Mobile** | Fully functional on iOS Safari and Chrome Android. |
| **Content** | All tooltip text matches brand voice. No placeholder text in production. |
| **Security** | Form data sent over HTTPS only. No sensitive data in client-side code. |
| **Analytics** | All core events tracked. No PII in analytics events (unless consented). |

---

*This generator is part of the Master Starter Kit marketing section. Run it during Step 19 after completing brand messaging and before launch strategy.*
