# Community & Developer Portal

> Build the spaces where users help each other, learn from each other, and extend your product.

**Kit context:** This guide is part of the `33-customer-experience-ops/` module.
**Last validated:** 2026-03-12
**Depends on:** `18-user-documentation/`, `06-tech-stack/`, `14-api-integration/`

---

## Overview

This guide covers two interconnected but distinct systems: a **community forum** where users interact with each other and your team, and a **developer documentation portal** for API/SDK users. Not every product needs both — use the decision criteria below before investing engineering and content effort.

Cross-references:
- For customer support workflows and ticket management, see other templates in `33-customer-experience-ops/`
- For internal API documentation standards, see `18-user-documentation/`
- For API design and integration architecture, see `14-api-integration/`

---

## Do You Need This?

Answer honestly. Building a community forum or developer portal that nobody uses is worse than not having one — it signals an abandoned product.

### Community Forum Decision Criteria

| Signal | Verdict |
|--------|---------|
| User base > 1,000 active users | Strong candidate for a community forum |
| Product has multiple use cases or workflows (users solve different problems) | Community adds value — users learn from each other's approaches |
| Users already congregating elsewhere (Reddit, Stack Overflow, Discord, unofficial Slack groups) | You are losing control of the narrative — create an official space |
| Product is highly technical and users troubleshoot creatively | Community is high-value — peer solutions reduce support load |
| Product is simple, single-use-case, B2B with < 100 accounts | A good knowledge base is sufficient — community will feel empty |
| Product is in early stage (< 500 users) | Too early for a forum — use a private Slack/Discord channel instead |

### Developer Portal Decision Criteria

| Signal | Verdict |
|--------|---------|
| Product has a public API | Developer portal is **mandatory**, not optional |
| Product has SDKs in 2+ languages | Developer portal with per-language docs required |
| Product supports webhooks or integrations | At minimum, document the webhook payload schema and integration guides |
| Product has no API and no integration points | No developer portal needed — skip that section entirely |

### The "Neither" Option

If your product is B2B with fewer than 100 accounts, no public API, and a single primary use case: invest in a thorough knowledge base (`self-service-knowledge-center.template.md`) and responsive support. A community forum and developer portal would be premature overhead.

---

## Community Forum Architecture

### Platform Selection Decision Tree

| Factor | Discourse | GitHub Discussions | Circle | Custom Built |
|--------|-----------|-------------------|--------|--------------|
| **Best for** | General product communities, SaaS, B2B | Open-source projects, developer-heavy products | Creator/course communities, membership products | Full brand control, deep product integration |
| **Cost** | $100/mo hosted (Discourse Hub), free self-hosted | Free (requires GitHub) | $49-399/mo | Engineering time (significant) |
| **Moderation tools** | Excellent — trust levels, auto-moderate, flag system, slow mode | Basic — lock, pin, labels, minimal auto-mod | Good — member approval, post review | Build everything yourself |
| **SEO** | Excellent — server-rendered, well-structured, sitemap generation | Good — indexed by Google, but nested under github.com | Poor — most content behind auth | Depends entirely on implementation |
| **Gamification** | Built-in — badges, trust levels, likes, solved markers | Basic — reactions, upvotes | Basic — points, leaderboards | Build everything yourself |
| **SSO integration** | SAML, OAuth 2.0, custom DiscourseConnect | GitHub OAuth only | OAuth 2.0, SAML (enterprise plan) | Full control |
| **API access** | Full REST API, webhook support | GitHub GraphQL API | REST API | Full control |
| **Self-hosting** | Yes (Docker-based, well-documented) | No (GitHub-hosted only) | No (SaaS only) | Yes (you built it) |
| **Search** | Built-in full-text search, excellent | GitHub's code search (decent for discussions) | Basic search | Build or integrate (Algolia, Typesense) |
| **Recommendation** | Default choice for most products | If your users already live on GitHub | If community is content/course-centric | Only if you have unique requirements that no platform satisfies |

**{{PROJECT_NAME}} recommendation:** Use {{CX_COMMUNITY_PLATFORM}} — default to Discourse unless your user base is primarily developers already on GitHub.

### Information Architecture

Structure your community with clear, non-overlapping categories. Start with fewer categories and split later when volume justifies it.

**Starter category structure:**

```
📁 Announcements          — Staff-only posting, everyone can reply
  └─ Product Updates      — Release notes, changelog summaries
  └─ Events               — Webinars, meetups, office hours
📁 Help & Support         — Users asking questions
  └─ Getting Started      — New user questions
  └─ How Do I...?         — Feature-specific questions
  └─ Bug Reports          — User-reported issues (triaged by staff)
📁 Feature Requests       — Ideas and voting
📁 Show & Tell            — Users sharing what they've built
📁 Developers             — API questions, integration help (if applicable)
📁 Off-Topic / Watercooler — Community bonding, not product-related
```

**Rules:**
- Maximum 8 top-level categories at launch — more creates decision paralysis for new posters
- Every category has a pinned "About this category" post explaining what belongs here and what does not
- "Bug Reports" is NOT a substitute for a proper bug tracker — staff triages community bug reports into {{ISSUE_TRACKER}}
- "Feature Requests" uses a voting plugin (Discourse has one built-in) to surface popular ideas

### Community Health Metrics

Track these weekly. Set targets within 90 days of launch.

| Metric | How to measure | Healthy target | Red flag |
|--------|---------------|----------------|----------|
| Daily active posters | Unique users who post/reply per day | > 5% of registered members | < 1% of registered members |
| Weekly active posters | Unique users who post/reply per week | > 15% of registered members | < 5% of registered members |
| Question response rate | % of questions with at least 1 reply within 48 hours | > 90% | < 70% (unanswered questions kill communities) |
| Mean time to first response | Hours from question posted to first reply | < 12 hours | > 48 hours |
| Accepted answer rate | % of questions marked as "solved" | > 50% | < 25% |
| New member retention | % of new members who post again within 30 days of first post | > 30% | < 10% |
| Staff response ratio | % of total replies that come from staff | 10-30% (community self-sustaining) | > 60% (community is just a support channel) or < 5% (community feels abandoned by company) |
| Spam/moderation action rate | Moderator actions per 100 posts | < 3% | > 10% (spam problem or toxic culture) |

### Moderation Policies

**Community Guidelines — Non-Negotiable Rules:**

1. Be respectful. Disagree with ideas, not people.
2. Stay on topic within categories. Use the appropriate category.
3. No spam, self-promotion (unless in designated "Show & Tell" category), or affiliate links.
4. No sharing of account credentials, API keys, or personal data.
5. Search before posting. Duplicate questions dilute knowledge.
6. Bug reports must include: product version, steps to reproduce, expected vs. actual behavior.

**Moderation Tiers:**

| Tier | Who | Powers | Response time |
|------|-----|--------|---------------|
| Auto-moderation | System rules | Block spam (Akismet or equivalent), hold posts with 3+ links from new users, flag posts with banned words | Instant |
| Community moderators | Trusted volunteer members (Trust Level 4 in Discourse) | Edit titles, recategorize posts, merge duplicate topics, hide off-topic replies | Within 24 hours |
| Staff moderators | {{CX_TEAM}} members | All community moderator powers + delete posts, suspend users, IP ban, access moderation logs | Within 12 hours |
| Admin escalation | {{CX_LEAD}} or {{PRODUCT_OWNER}} | Final decision on bans, policy changes, legal/compliance issues | Within 24 hours |

**Escalation path:** Community flag → Community moderator review → Staff moderator decision → Admin escalation (if disputed or ban-worthy)

**Handling negative feedback publicly:**
- Never delete criticism unless it violates guidelines (deleting criticism destroys trust)
- Acknowledge the feedback publicly: "Thanks for raising this. Here's what we know..."
- If it's a known issue, link to the relevant status page or roadmap item
- If it's a misunderstanding, clarify without being defensive
- If you messed up, own it: "You're right, we dropped the ball on this. Here's what we're doing about it."

### Gamification & Reputation

**Trust Level System (Discourse model — adapt for other platforms):**

| Level | Name | How to earn | Permissions unlocked |
|-------|------|-------------|---------------------|
| 0 | New | Account creation | Read all, post in Help & Support only, max 2 links per post |
| 1 | Basic | Read 30 min of content, view 5 topics | Post in all categories, add links, flag posts |
| 2 | Member | 15 days active, 50 posts read, 1 post with 1+ likes | Edit own post titles, create polls, invite users |
| 3 | Regular | 50 days active, read 25% of new topics, > 5 liked posts | Recategorize own topics, edit wiki posts, access lounge category |
| 4 | Leader | Manually granted by staff to community champions | Edit any post title, recategorize any topic, merge topics, pin/unpin |

**Badges worth implementing:**
- "First Solution" — your answer was marked as the solution for the first time
- "Helpful x10/x50/x100" — received 10/50/100 likes on your posts
- "Problem Solver x25" — 25 of your answers marked as solutions
- "Consistent Contributor" — posted at least once per week for 3 months
- "Bug Hunter" — reported a bug that was confirmed and fixed

**What NOT to gamify:**
- Do not reward post volume (incentivizes low-quality posts)
- Do not give monetary rewards (attracts mercenaries, not community members)
- Do not create competitive leaderboards (creates unhealthy dynamics; use them internally for champion identification only)

### Community Champions Program

**Identification criteria** (measure monthly):
- Top 10 contributors by accepted answers
- Top 10 contributors by likes received
- Users who consistently respond within 2 hours
- Users who help newcomers specifically (replies to Trust Level 0 users)

**Champion benefits:**
- Private "Champions" channel or category (direct line to product and engineering team)
- Early access to beta features (2 weeks before general availability)
- Quarterly video call with product team (share roadmap, gather feedback)
- Public recognition: special badge on profile, annual "Community Champions" blog post
- Swag: one annual swag package (keep it genuine, not cheap promotional items)
- Conference tickets: if you host or sponsor events, offer champions complimentary tickets

**Champion expectations (communicated clearly, not demanded):**
- Remain active in the community (at least weekly participation)
- Maintain respectful, helpful tone aligned with community guidelines
- Provide honest feedback (champions are not yes-people)
- Understand this is voluntary — no obligation, step back any time

---

## Video Tutorial Production Pipeline

### Planning

**Content selection — prioritize by impact:**
1. Analyze support tickets: top 10 questions that would be better answered with video (visual workflows, multi-step processes)
2. Analyze KB article engagement: articles with high traffic but low "Was this helpful?" scores — video may explain better
3. Analyze community forum: frequently asked questions with complex answers
4. Product team input: features with low adoption that are genuinely valuable

**Script template (keep every video to this structure):**

```
[0:00 - 0:05]  Hook: "Here's how to [accomplish task] in {{PROJECT_NAME}}."
[0:05 - 0:15]  Context: "You'd want to do this when [use case]. Let me show you."
[0:15 - 3:00]  Walkthrough: Step-by-step screen recording with narration
[3:00 - 3:15]  Recap: "To summarize: [step 1], [step 2], [step 3]. That's it."
[3:15 - 3:30]  Next steps: "If you want to go further, check out [related video/article]."
```

**Absolute rules:**
- Maximum length: 5 minutes. If it takes longer, split into a series.
- No filler intros ("Hey guys, welcome back to another episode...") — get to the point immediately
- No background music — it is distracting for instructional content and creates accessibility issues
- Always show the end result first (2 seconds), then show how to get there — users need to know the destination before the journey

### Recording Standards

| Aspect | Standard | Why |
|--------|----------|-----|
| Resolution | 1920x1080 minimum, 3840x2160 (4K) preferred | UI text must be readable; 4K future-proofs |
| Frame rate | 30 fps for screen recordings, 60 fps if showing animations | Smooth without excessive file size |
| Audio | USB condenser microphone (Blue Yeti, Audio-Technica AT2020, or equivalent) | Built-in laptop mics produce tinny, echo-prone audio |
| Environment | Quiet room, no echo (add soft furnishings or foam panels if needed) | Background noise is the #1 reason viewers abandon tutorials |
| Screen | Clean desktop, hide bookmarks bar, close notifications, use a neutral wallpaper | Distractions break focus; notifications can leak private info |
| Cursor | Use a cursor highlighter tool (e.g., PointerFocus, Mousepose) | Viewers must see where you are clicking |
| Mouse movement | Deliberate and slow. Pause the cursor on the target element for 1 second before clicking | Fast mouse movements are impossible to follow |
| Zoom | Zoom into relevant areas for small UI elements (use a tool like ZoomIt) | Prevents "I can't read what that says" comments |
| Browser | Use a clean browser profile with no extensions visible | Extensions in toolbar are distracting and unprofessional |

**Recording tools by tier:**

| Tier | Tool | Cost | Best for |
|------|------|------|----------|
| Quick & simple | Loom | $12/user/mo | Internal tutorials, quick demos, short-lived content |
| Professional | Camtasia | $250 one-time | Polished tutorials with editing, annotations, effects |
| Free & powerful | OBS Studio | Free | Full control, streaming capability, no watermarks |
| Mac-native | ScreenFlow | $149 one-time | Mac-only teams, good balance of ease and power |

### Editing Checklist

- [ ] Cut all dead air (pauses > 2 seconds where nothing happens)
- [ ] Cut all mistakes and retakes (do not leave in "oops, let me redo that")
- [ ] Cut loading screens (replace with a brief "Loading..." text card if needed)
- [ ] Add chapter markers / timestamps for videos > 2 minutes
- [ ] Add captions/subtitles — mandatory, not optional (accessibility requirement + many users watch without sound)
- [ ] Add branded intro card: logo + video title, max 3 seconds
- [ ] Add branded outro card: related videos + CTA, max 3 seconds
- [ ] Add click annotations: visual pulse or highlight when clicking a button
- [ ] Add text callouts for keyboard shortcuts mentioned verbally
- [ ] Export at source resolution, H.264 codec, 5-10 Mbps bitrate

### Hosting Decision

| Platform | Best For | Cost | Analytics | Embed Quality | Ad-Free |
|----------|----------|------|-----------|---------------|---------|
| YouTube | Public tutorials, SEO, organic discovery | Free | Good (YouTube Studio) | Good (but shows related videos) | No (ads on free tier) |
| Loom | Quick internal or embedded tutorials | $12/user/mo | Basic (views, watch time) | Good (clean embed) | Yes |
| Vimeo | Branded, ad-free embedding in product or docs | $20/mo | Good (engagement graphs) | Excellent (customizable player) | Yes |
| Wistia | Marketing-grade analytics, CTAs in video, lead gen | $99/mo | Excellent (heatmaps, attention spans, CTA clicks) | Excellent (fully branded) | Yes |

**{{PROJECT_NAME}} recommendation:** {{CX_VIDEO_HOSTING}} — default to YouTube for public discoverability + Vimeo or Wistia for in-product/in-docs embedding (ad-free, branded experience).

### Maintenance Protocol

- **Re-record trigger:** any UI change that makes the video visually incorrect (button moved, layout changed, new step added). Check after every release.
- **Quarterly audit:** review all tutorial videos against current product UI. Flag videos that are > 10% inaccurate for re-recording.
- **Versioning:** when re-recording, set the old video to "unlisted" (not deleted) — users on older product versions may still need it. Add a pinned comment or annotation linking to the updated version.
- **Analytics review (monthly):**
  - Videos with < 30% completion rate: too long or poorly structured — re-edit or split
  - Videos with high traffic but low helpfulness: content may be confusing — reshoot with clearer narration
  - Videos with zero views in 90 days: either the feature is unused or the video is unfindable — investigate which

---

## Developer Documentation Portal

> **Conditional section:** Only relevant if {{API_STYLE}} is defined (the product has a public API, SDK, or webhook system). If your product has no developer-facing interfaces, skip to "Community-to-Support Bridge."

### Portal Architecture

A developer documentation portal has five distinct content layers. Each serves a different need and is authored differently.

| Layer | Content Type | Authored By | Update Frequency |
|-------|-------------|-------------|------------------|
| **API Reference** | Endpoint definitions, parameters, response schemas, error codes | Auto-generated from OpenAPI/Swagger spec | Every release (auto-generated) |
| **Guides** | Conceptual explanations: authentication, pagination, rate limits, best practices | Developer relations or senior engineer | Quarterly review, update on breaking changes |
| **Tutorials** | Step-by-step walkthroughs: "Build a [thing] with our API" | Developer relations | Quarterly review, new tutorials as features launch |
| **SDK Docs** | Per-language SDK: installation, initialization, method reference, examples | SDK maintainer (engineer) | Every SDK release |
| **Changelog** | API versioning, breaking changes, deprecation notices | Engineering team | Every release |

**Additional infrastructure:**
- **Interactive API explorer:** try-it-now functionality where developers can make real (or sandbox) API calls from the docs page (Swagger UI, Redocly, or custom)
- **Status page:** API uptime, latency metrics, incident history — link from the developer portal prominently
- **API sandbox:** isolated environment where developers can experiment without affecting production data

### Technology Decision Tree

| Situation | Recommended Tool | Why |
|-----------|-----------------|-----|
| OpenAPI spec exists, want polished auto-generated reference | Redocly or Stoplight | Best-in-class OpenAPI rendering, try-it-now, search |
| Want writing + API reference in one platform, minimal setup | Mintlify, ReadMe, or GitBook | All-in-one, hosted, fast to launch |
| Full customization, open-source, developer audience | Docusaurus + custom OpenAPI renderer plugin | MDX-based, extensible, free, developer-friendly |
| Simple docs, developer-focused, Next.js stack | Nextra (MDX-based, built on Next.js) | Lightweight, familiar stack for Next.js teams |
| Already using Docusaurus for other docs | Docusaurus + `docusaurus-openapi-docs` plugin | Keep everything in one system |

**{{PROJECT_NAME}} recommendation:** {{API_DOCS_TOOL}} — default to Mintlify or Docusaurus depending on customization needs.

### API Reference Standards

**Every endpoint must document:**

```yaml
# Example structure per endpoint
endpoint: POST /api/v1/widgets
summary: Create a new widget
description: >
  Creates a widget in the authenticated user's workspace.
  The widget is created in "draft" status by default.
  Rate limit: 100 requests per minute per API key.
authentication: Bearer token (required)
parameters:
  - name: name
    in: body
    required: true
    type: string
    description: "Display name for the widget. Max 100 characters."
    example: "Revenue Dashboard Widget"
  - name: type
    in: body
    required: true
    type: string
    enum: [chart, table, metric, text]
    description: "Widget type. Determines available configuration options."
    example: "chart"
  - name: workspace_id
    in: body
    required: false
    type: string
    description: "Target workspace. Defaults to the user's primary workspace if omitted."
    example: "ws_abc123"
responses:
  201:
    description: Widget created successfully
    body:
      id: "wgt_xyz789"
      name: "Revenue Dashboard Widget"
      type: "chart"
      status: "draft"
      created_at: "2026-03-12T10:30:00Z"
  400:
    description: Validation error
    body:
      error: "validation_error"
      message: "Name must be 100 characters or fewer."
      field: "name"
  401:
    description: Invalid or missing API key
  429:
    description: Rate limit exceeded
    headers:
      Retry-After: 30
```

### Code Sample Library

**Every endpoint must include code samples in at least three languages.** Samples must be copy-paste ready — include imports, authentication, error handling.

```bash
# cURL
curl -X POST https://api.{{PRODUCT_DOMAIN}}/v1/widgets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Revenue Dashboard Widget",
    "type": "chart"
  }'
```

```javascript
// JavaScript / TypeScript (using official SDK)
import { {{PRODUCT_SDK_NAME}} } from '{{PRODUCT_SDK_PACKAGE}}';

const client = new {{PRODUCT_SDK_NAME}}('YOUR_API_KEY');

const widget = await client.widgets.create({
  name: 'Revenue Dashboard Widget',
  type: 'chart',
});

console.log(widget.id); // "wgt_xyz789"
```

```python
# Python (using official SDK)
from {{PRODUCT_SDK_PACKAGE_PYTHON}} import {{PRODUCT_SDK_NAME}}

client = {{PRODUCT_SDK_NAME}}(api_key="YOUR_API_KEY")

widget = client.widgets.create(
    name="Revenue Dashboard Widget",
    type="chart",
)

print(widget.id)  # "wgt_xyz789"
```

**Code sample rules:**
- Use realistic-looking but obviously fake data (`YOUR_API_KEY`, `ws_abc123`)
- Include error handling in SDK examples (try/catch or equivalent)
- Pin SDK version in installation examples (`npm install {{PRODUCT_SDK_PACKAGE}}@2.x`)
- Test all code samples in CI — broken samples are worse than no samples
- Show the response alongside the request so developers know what to expect

### SDK Documentation Structure

**Per-language SDK documentation must follow this structure:**

1. **Quick Start (under 5 minutes to "Hello World")**
   ```
   ## Quick Start
   1. Install: `npm install {{PRODUCT_SDK_PACKAGE}}`
   2. Initialize: `const client = new Client('YOUR_API_KEY');`
   3. Make your first call: `const me = await client.users.me();`
   4. That's it. You just made your first API call.
   ```

2. **Installation** — every supported package manager, with version pinning:
   ```
   npm install {{PRODUCT_SDK_PACKAGE}}@^2.0
   yarn add {{PRODUCT_SDK_PACKAGE}}@^2.0
   pnpm add {{PRODUCT_SDK_PACKAGE}}@^2.0
   ```

3. **Authentication** — step-by-step with screenshots:
   - Where to find API keys in the product UI (screenshot with annotation)
   - Different auth methods if supported (API key, OAuth, JWT)
   - Security best practices: environment variables, never commit keys, rotate regularly

4. **Common Patterns:**
   - **Pagination:** show how to iterate through paginated responses (cursor-based or offset-based)
   - **Error handling:** enumerate error types, show how to catch and handle each
   - **Rate limiting:** explain limits, show how to handle 429 responses (exponential backoff)
   - **Webhooks:** how to receive, verify signature, acknowledge, and process webhook payloads
   - **Idempotency:** how to safely retry requests using idempotency keys

5. **Migration Guides** — when SDK versions have breaking changes:
   - List every breaking change with before/after code examples
   - Provide a migration script or codemod if possible
   - Support the previous major version for 12 months after the new version launches

---

## Community-to-Support Bridge

### Escalation from Community to Support

Not every community post needs staff attention. But some do, and they need it fast. Configure these automation rules:

| Trigger | Action | Response Time Target |
|---------|--------|---------------------|
| Question unanswered after 48 hours | Auto-flag for staff response, add to support team's daily queue | Staff responds within 24 hours of flag |
| Post tagged "bug" by a Trust Level 2+ member | Notify support team in {{SUPPORT_CHANNEL}} immediately | Staff acknowledges within 4 hours |
| Post tagged "urgent" or "blocker" | Notify support team + on-call engineer | Staff responds within 2 hours |
| Negative sentiment detected (NLP or keyword: "frustrated", "unacceptable", "switching to competitor") | Alert CX team lead in {{SUPPORT_CHANNEL}} | CX lead reviews within 4 hours |
| Post from a paying customer (matched via SSO email domain or account ID) | Add "customer" badge to post, priority queue for staff response | Staff responds within 12 hours |
| Post mentioning security, data loss, or privacy concern | Immediate alert to {{CX_LEAD}} and {{SECURITY_CONTACT}} | Response within 2 hours, escalate to security team if warranted |

### Staff Participation Guidelines

**Who participates and how:**

| Team | Participation Scope | Expected Commitment |
|------|--------------------|--------------------|
| Support team | Respond to tagged/escalated questions, monitor bug reports, moderate | 1-2 hours/day dedicated community time |
| Product team | Feature request discussions, share roadmap context (when appropriate), respond to "why" questions | 2-3 hours/week, focus on Feature Requests category |
| Engineering team | Technical/API questions, architecture discussions, investigate confirmed bugs | 1-2 hours/week, focus on Developers category |
| Executive team | Occasional high-visibility posts (major announcements, crisis response) | As needed, not routine |

**Tone guidelines for all staff:**
- Helpful, not corporate. Write like a knowledgeable colleague, not a press release.
- Acknowledge when you don't know the answer: "I'm not sure about this — let me check with the team and get back to you."
- Follow up when you said you would. Broken promises in public forums are extremely damaging. Set a calendar reminder.
- Never say "we can't share that" without explaining why: "We don't share specific timelines because they often change, but this is on our roadmap for {{NEXT_QUARTER}}."
- Thank users who report bugs or provide detailed feedback. They are doing free QA.
- If a post is critical of the product and the criticism is valid, agree publicly: "You're right, this isn't where it should be. Here's what we're doing about it."

**Staff response ratio target:** Staff responds to ~20% of all posts. If staff answers > 50% of questions, the community is not self-sustaining — invest in champions and better documentation. If staff answers < 5%, the community feels ignored — increase participation.

---

## Content Contribution Program

Allow users to submit tutorials, guides, tips, and templates. User-generated content scales knowledge far beyond what your team can produce alone.

### Submission Process

1. User submits content via a "Submit a tutorial" form or dedicated community category
2. Content team reviews for technical accuracy (does it actually work?), completeness, and tone
3. If revisions needed: collaborate with author via comments, do not rewrite without their involvement
4. Approved content published on the community or knowledge base with full author attribution
5. Author notified of publication with a thank-you message and "Community Author" badge

### Attribution & Recognition

- **Author credit:** Author name, profile picture, and link to community profile displayed prominently on published content
- **Badge:** "Community Author" badge on community profile (distinct from other badges)
- **Newsletter feature:** Highlight one community-authored piece per month in the product newsletter
- **Metrics shared:** Share view count and helpfulness rating with the author (they want to know their content matters)

### Legal Considerations

- **Contributor License Agreement (CLA):** Required before first submission. Must grant your team the right to:
  - Edit content for accuracy, formatting, and tone
  - Remove content if it becomes inaccurate or violates guidelines
  - Continue hosting content if the author leaves the community
- **Copyright:** Author retains copyright. CLA grants a non-exclusive, perpetual license to host and modify.
- **Takedown:** Author can request removal of their content at any time. Honor this within 7 days.
- **No compensation:** Make clear upfront that contributions are voluntary. Badges and recognition, not payment. If you later decide to pay authors, that is a separate program.

---

## Search Engine Optimization for Community Content

Community forums generate significant organic search traffic when properly optimized. This is a major acquisition channel.

### SEO Fundamentals for Community Platforms

| Factor | Implementation |
|--------|---------------|
| Server-side rendering | Discourse does this by default. If custom-built, ensure all content is crawlable without JavaScript. |
| URL structure | `/community/category/topic-slug` — human-readable, keyword-rich slugs |
| Title tags | Thread title as `<title>`, category name as prefix: "Getting Started - How do I connect my CRM?" |
| Meta descriptions | First 160 characters of the original post |
| Canonical URLs | Set canonical to avoid duplicate content from pagination and sorting |
| Sitemap | Auto-generated sitemap.xml including all public threads, submitted to Google Search Console |
| Structured data | FAQ schema markup for solved questions (question + accepted answer) |
| Internal linking | Link from KB articles to relevant community discussions and vice versa |
| Noindex for low-value pages | Noindex user profile pages, search result pages, and threads with 0 replies older than 90 days |

### Content Quality Signals

- Threads with accepted answers rank higher — encourage solution marking
- Long-form, detailed answers rank higher than short replies — champions naturally produce these
- Duplicate threads dilute ranking — merge duplicates aggressively (redirect old URL to merged thread)
- Regular fresh content signals an active community — monitor posting cadence

---

## Implementation Checklist

### Decision Phase
- [ ] Evaluate: does {{PROJECT_NAME}} need a community forum, developer portal, both, or neither? (Use decision criteria above)
- [ ] If community: choose platform using the decision tree (default: Discourse)
- [ ] If developer portal: choose tooling using the technology decision tree
- [ ] Allocate staffing: who will manage the community day-to-day? (Minimum 0.5 FTE at launch)
- [ ] Set launch timeline: community and dev portal are ongoing commitments, not one-time projects

### Community Forum Setup (if applicable)
- [ ] Install and configure community platform
- [ ] Set up SSO integration with {{PROJECT_NAME}} product authentication
- [ ] Create category structure (start with the recommended 6-8 categories)
- [ ] Write and pin community guidelines in every category
- [ ] Configure auto-moderation rules (spam filter, new user link limits, banned words)
- [ ] Set up moderation tooling and alerts (escalation to {{SUPPORT_CHANNEL}})
- [ ] Identify and personally invite 5-10 initial community champions from existing power users
- [ ] Seed the forum with 10-15 high-quality posts (FAQs answered by staff, how-to guides, product tips)
- [ ] Configure SEO settings (sitemap, meta tags, structured data for solved questions)
- [ ] Set up community health metrics dashboard (weekly review cadence)
- [ ] Announce the community to existing users via email and in-product notification

### Video Tutorials (if applicable)
- [ ] Identify top 5 topics for initial video tutorials (from support ticket analysis)
- [ ] Write scripts for all 5 videos using the script template above
- [ ] Record, edit, and caption all 5 videos
- [ ] Publish to {{CX_VIDEO_HOSTING}} and embed in relevant KB articles and community posts
- [ ] Set up quarterly video audit process (review against current UI)

### Developer Portal (if applicable)
- [ ] Generate initial API reference from OpenAPI specification
- [ ] Write the "Getting Started" guide (authentication + first API call)
- [ ] Create code samples for top 10 endpoints in 3+ languages (cURL, JavaScript, Python)
- [ ] Write guides for common patterns: pagination, error handling, rate limits, webhooks
- [ ] Set up interactive API explorer (sandbox environment)
- [ ] Create SDK quick-start guide for each supported language
- [ ] Write the first migration guide (even if no breaking changes yet — establish the format)
- [ ] Set up automated testing for code samples in CI pipeline
- [ ] Link developer portal from product UI (settings, API key page, integration pages)

### Community-to-Support Bridge
- [ ] Configure escalation rules (unanswered questions, bug tags, sentiment detection)
- [ ] Set up notifications to {{SUPPORT_CHANNEL}} for escalated community posts
- [ ] Brief support, product, and engineering teams on participation expectations
- [ ] Create staff response tracking (are we hitting the 20% ratio target?)
- [ ] Set up monthly community health review with {{CX_LEAD}}

### Content Contribution Program (launch 3-6 months after community)
- [ ] Draft and publish contributor guidelines
- [ ] Create "Submit a tutorial" form or process
- [ ] Draft Contributor License Agreement (legal review required)
- [ ] Design "Community Author" badge
- [ ] Establish review and publication workflow
- [ ] Announce the program to the community
