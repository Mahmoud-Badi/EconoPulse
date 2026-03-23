# /generate-asset $ARGUMENT

Generate a custom image with Gemini 3 Pro for the specified asset type.

## Asset Types

| Type | Resolution | Aspect Ratio | Style | Use Case |
|------|-----------|-------------|-------|----------|
| `empty-state` | 1024x1024 | 1:1 | Flat illustration, minimal | Empty data tables, no results |
| `auth-bg` | 2048x1152 | 16:9 | Abstract, geometric | Login/signup page background |
| `error` | 1024x1024 | 1:1 | Empathetic illustration | 404, 500, generic error pages |
| `hero` | 2048x878 | 21:9 | Brand-aligned, impactful | Landing page hero section |
| `icon` | 1024x1024 | 1:1 | Flat, simple, single-color | App icons, feature icons |
| `og-image` | 1200x630 | ~2:1 | Brand colors, text overlay | Social media preview cards |

## Steps

### Step 1: Read Brand Context

```
{DOCS_PATH}/design/BRAND-GUIDELINES.md
{DOCS_PATH}/design/DESIGN-TOKENS.md
```

Extract:
- Primary color (hex)
- Secondary color (hex)
- Accent color (hex)
- Brand personality (e.g., "professional, trustworthy, modern")
- Logo style if relevant

### Step 2: Build the Prompt

Based on the asset type and `$ARGUMENT` context, construct a detailed image generation prompt:

**Empty State Example:**
```
A clean, flat illustration for a "{$ARGUMENT}" empty state in a web application.
Style: Minimal flat illustration with no more than 3 colors.
Colors: Use {primary_hex} as the main color, {secondary_hex} as accent, white for background elements.
Subject: {contextual subject — e.g., "A friendly clipboard with a magnifying glass for no search results"}
Mood: Helpful, not sad. Encouraging the user to take action.
DO NOT include: photo-realistic elements, gradients, stock photo style, text, faces, hands.
Background: Transparent or solid white.
```

**Auth Background Example:**
```
Abstract geometric background for a login page.
Style: Modern, clean, tech-inspired. Subtle and non-distracting.
Colors: Predominantly {primary_hex} with {secondary_hex} accents. Keep it muted (40-60% opacity feel).
Pattern: {choose: flowing curves / geometric shapes / subtle grid / topographic lines}
DO NOT include: text, logos, faces, photos, busy patterns that distract from the login form.
```

**Error Page Example:**
```
Empathetic illustration for a {$ARGUMENT} error page (e.g., 404 not found).
Style: Flat illustration, friendly, not alarming.
Colors: Use {primary_hex} with warm neutral tones. Avoid harsh reds.
Subject: {contextual — e.g., "A lost astronaut floating near a planet for 404"}
Mood: "We know this is frustrating. We'll help you find your way."
DO NOT include: scary elements, harsh colors, photo-realistic style, text.
```

### Step 3: Generate with Gemini

Use the Gemini MCP server:

```
gemini-generate-image:
  prompt: "{constructed prompt from Step 2}"
  aspect_ratio: "{aspect ratio from asset type table}"
```

### Step 4: Review with Gemini Analysis

Analyze the generated image:

```
gemini-analyze-image: {generated image}
  prompt: "Review this generated illustration for use as a {$ARGUMENT asset type} in a professional B2B web application.

  Check:
  1. Does it look hand-crafted or AI-generated? (goal: hand-crafted)
  2. Color palette matches brand? ({primary_hex}, {secondary_hex})
  3. Is it simple enough (max 3 primary colors)?
  4. Would it look good at the target size ({resolution})?
  5. Any stock-photo vibes? (should be zero)
  6. Is the style consistent with flat/minimal illustration?

  Rate overall quality 1-10 and suggest improvements."
```

**If quality < 7**: Iterate. Adjust the prompt based on feedback and regenerate. Repeat up to 3 times.

**If quality >= 7**: Proceed to Step 5.

### Step 5: Save the Asset

Save to the project's public images directory:

```
apps/web/public/images/{asset-type}/{name}.png
```

For example:
```
apps/web/public/images/empty-state/no-trips.png
apps/web/public/images/auth-bg/login-background.png
apps/web/public/images/error/404-illustration.png
```

### Step 6: Register in Asset Manifest

Append to `{{DOCS_PATH}}/design/ASSET-MANIFEST.md`:

```markdown
| {name} | {asset-type} | {resolution} | {date} | `/images/{asset-type}/{name}.png` | {1-line description} |
```

If the manifest file doesn't exist, create it with this header:

```markdown
# Asset Manifest

| Name | Type | Resolution | Generated | Path | Description |
|------|------|-----------|-----------|------|-------------|
```

### Step 7: Output Next.js Image Snippet

Provide a ready-to-use code snippet:

```tsx
import Image from "next/image";

<Image
  src="/images/{asset-type}/{name}.png"
  alt="{descriptive alt text}"
  width={{width}}
  height={{height}}
  className="{suggested classes — e.g., mx-auto opacity-80}"
  priority={false}
/>
```

For auth backgrounds:
```tsx
<div
  className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/images/auth-bg/{name}.png')" }}
/>
```

### Output

```
ASSET GENERATED
================
Name: {name}
Type: {asset-type}
Resolution: {width}x{height}
Quality Score: {1-10 from review}
Iterations: {count}
Path: apps/web/public/images/{asset-type}/{name}.png
Manifest: Updated
Usage: {Next.js Image snippet above}
```

## Rules

- **Never save stock photo style**: If Gemini produces a photo-realistic or stock-photo-looking image, reject it and regenerate with stronger style constraints.
- **Max 3 colors per illustration**: Keep illustrations simple. Use the brand's primary color, one accent, and white/neutral. Busy multi-color illustrations look AI-generated.
- **Always register in manifest**: Every generated asset gets logged in ASSET-MANIFEST.md for tracking.
- **Descriptive alt text**: The `alt` attribute must describe the image content for screen readers, not the file name.
- **Consistent style**: All illustrations across the app should share the same style (flat, minimal, same color palette). Inconsistent styles look unprofessional.
- **No text in images**: Text in generated images can't be translated, resized, or made accessible. Keep text in HTML overlays.
- **Max 3 iterations**: If quality doesn't improve after 3 regenerations, use the best version and note it needs a designer's touch.
