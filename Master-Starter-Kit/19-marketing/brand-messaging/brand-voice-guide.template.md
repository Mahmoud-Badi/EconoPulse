# Brand Voice Guide: {{PROJECT_NAME}}

> **Purpose:** This guide defines how {{PROJECT_NAME}} sounds across every customer touchpoint. It ensures consistency whether content is written by founders, marketers, developers, or AI tools. Every piece of public-facing text should pass through this guide before publishing.
>
> **Last updated:** {{DATE}}
> **Owner:** {{BRAND_OWNER}}
> **Version:** 1.0

---

## Table of Contents

1. [Brand Personality Definition](#1-brand-personality-definition)
2. [Voice Dimensions](#2-voice-dimensions)
3. [Tone Modifiers by Context](#3-tone-modifiers-by-context)
4. [Vocabulary Guide](#4-vocabulary-guide)
5. [Writing Style Rules](#5-writing-style-rules)
6. [Voice in Action: Examples](#6-voice-in-action-examples)
7. [Do's and Don'ts](#7-dos-and-donts)
8. [Brand Voice Checklist](#8-brand-voice-checklist)
9. [Quick Reference Card](#9-quick-reference-card)

---

## 1. Brand Personality Definition

### Core Brand Personality

If {{PROJECT_NAME}} were a person, they would be described as:

| # | Adjective | What It Means for Us | What It Does NOT Mean |
|---|-----------|----------------------|----------------------|
| 1 | {{PERSONALITY_ADJ_1}} | {{PERSONALITY_1_MEANING}} | {{PERSONALITY_1_NOT}} |
| 2 | {{PERSONALITY_ADJ_2}} | {{PERSONALITY_2_MEANING}} | {{PERSONALITY_2_NOT}} |
| 3 | {{PERSONALITY_ADJ_3}} | {{PERSONALITY_3_MEANING}} | {{PERSONALITY_3_NOT}} |
| 4 | {{PERSONALITY_ADJ_4}} | {{PERSONALITY_4_MEANING}} | {{PERSONALITY_4_NOT}} |
| 5 | {{PERSONALITY_ADJ_5}} | {{PERSONALITY_5_MEANING}} | {{PERSONALITY_5_NOT}} |

**Example personality sets by product type (choose or adapt one):**

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
- **Confident, Clear, Empowering, Warm, Forward-thinking** -- Good for B2B SaaS tools that want to feel modern and trustworthy without being cold or corporate.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
- **Friendly, Energetic, Simple, Encouraging, Playful** -- Good for consumer mobile apps that want to feel approachable and delightful to use.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
- **Precise, Honest, Helpful, Pragmatic, Respectful** -- Good for developer tools that need to earn trust through accuracy and respect for the developer's time.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
- **Trustworthy, Enthusiastic, Knowledgeable, Genuine, Attentive** -- Good for e-commerce brands that want to feel like a knowledgeable friend, not a pushy salesperson.
<!-- ENDIF -->

### Brand Archetype

{{PROJECT_NAME}} aligns with the **{{BRAND_ARCHETYPE}}** archetype.

| Archetype | Core Drive | Brand Promise | Example Brands |
|-----------|-----------|---------------|----------------|
| Creator | Innovation, self-expression | "We help you bring ideas to life" | Adobe, Lego |
| Sage | Knowledge, understanding | "We help you understand the world" | Google, TED |
| Hero | Mastery, achievement | "We help you rise to the challenge" | Nike, FedEx |
| Explorer | Freedom, discovery | "We help you experience new things" | Jeep, Patagonia |
| Caregiver | Service, nurturing | "We take care of you" | Johnson & Johnson |
| Everyperson | Belonging, authenticity | "We're just like you" | IKEA, Target |
| Magician | Transformation | "We make the impossible possible" | Apple, Disney |
| Ruler | Control, stability | "We bring order to chaos" | Microsoft, Mercedes |
| Rebel | Liberation, disruption | "We break the rules" | Harley-Davidson, Virgin |

**Our archetype in practice:** {{ARCHETYPE_DESCRIPTION}}

---

## 2. Voice Dimensions

Rate {{PROJECT_NAME}} on each dimension. Mark the position with an `X` on the scale.

### Voice Dimensions Chart

```
FORMAL ----[---|---|---|---|---|---|---|---|---]---- CASUAL
              1   2   3   4   5   6   7   8   9
                              {{FORMAL_CASUAL_SCORE}}

SERIOUS ---[---|---|---|---|---|---|---|---|---]---- PLAYFUL
              1   2   3   4   5   6   7   8   9
                              {{SERIOUS_PLAYFUL_SCORE}}

TECHNICAL -[---|---|---|---|---|---|---|---|---]---- ACCESSIBLE
              1   2   3   4   5   6   7   8   9
                              {{TECHNICAL_ACCESSIBLE_SCORE}}

AUTHORITATIVE [---|---|---|---|---|---|---|---|---] FRIENDLY
              1   2   3   4   5   6   7   8   9
                              {{AUTHORITY_FRIENDLY_SCORE}}

RESERVED --[---|---|---|---|---|---|---|---|---]---- ENTHUSIASTIC
              1   2   3   4   5   6   7   8   9
                              {{RESERVED_ENTHUSIASTIC_SCORE}}

CONVENTIONAL [---|---|---|---|---|---|---|---|---]-- BOLD
              1   2   3   4   5   6   7   8   9
                              {{CONVENTIONAL_BOLD_SCORE}}
```

### What Each Score Means

**Formal (1-3) vs Casual (7-9):**
- **Formal:** Third person, complete sentences, no contractions, professional language. "We are pleased to announce..."
- **Middle (4-6):** Conversational but professional. "We're excited to share..."
- **Casual:** First person, fragments okay, slang acceptable. "Guess what? We just shipped..."

**Serious (1-3) vs Playful (7-9):**
- **Serious:** Focus on outcomes, no jokes, measured language. "Reduce deployment time by 40%."
- **Middle (4-6):** Occasional light touch, positive framing. "Deploy faster. Way faster."
- **Playful:** Humor welcome, personality-forward, puns allowed. "Ship it like it's hot."

**Technical (1-3) vs Accessible (7-9):**
- **Technical:** Jargon expected, assumes expertise, precise terminology. "Configure your CI/CD pipeline with YAML manifests."
- **Middle (4-6):** Explain when needed, link to docs for depth. "Set up automatic deployments (here's how)."
- **Accessible:** Plain language, analogies, no assumed knowledge. "Every time you save your code, we put it live for you."

**Authoritative (1-3) vs Friendly (7-9):**
- **Authoritative:** Expert positioning, declarative statements. "The industry standard for deployment."
- **Middle (4-6):** Knowledgeable but approachable. "We've helped 10,000 teams deploy with confidence."
- **Friendly:** Peer positioning, collaborative language. "Let's figure this out together."

---

## 3. Tone Modifiers by Context

The voice stays consistent, but the **tone** shifts depending on context. Think of voice as your personality and tone as your mood -- your personality stays the same whether you are at a job interview or at a backyard cookout, but your mood adjusts.

### Tone Matrix

| Context | Energy Level | Formality Shift | Humor Level | Technical Depth | Primary Goal |
|---------|-------------|----------------|-------------|-----------------|--------------|
| **Marketing website** | High | Baseline | Moderate | Low-Medium | Inspire and convert |
| **Product UI** | Calm | Slightly formal | Minimal | Medium | Guide and reassure |
| **Documentation** | Neutral | Slightly formal | None-Minimal | High | Educate and enable |
| **Blog posts** | Medium-High | Slightly casual | Moderate | Varies by post | Engage and inform |
| **Social media** | High | Casual | High | Low | Connect and entertain |
| **Email campaigns** | Medium | Baseline | Low-Moderate | Low-Medium | Nurture and convert |
| **Support responses** | Warm | Baseline | None | As needed | Resolve and reassure |
| **Error messages** | Calm | Slightly casual | Minimal | Low | Inform and guide |
| **Onboarding flows** | Encouraging | Slightly casual | Minimal | Low-Medium | Teach and motivate |
| **Changelogs** | Neutral-Positive | Baseline | Minimal | Medium-High | Inform and excite |
| **Legal/compliance** | Neutral | Formal | None | Medium | Clarify and protect |
| **Sales materials** | Confident | Slightly formal | Minimal | Medium | Persuade and prove |
| **Internal comms** | Relaxed | Casual | Moderate | Varies | Align and motivate |

### Detailed Tone Guidance by Channel

#### Marketing Website
- **Lead with benefits**, not features
- Use "you" more than "we" (aim for 3:1 ratio)
- Short paragraphs, scannable structure
- Confident but never arrogant
- Every section answers "Why should I care?"

#### Documentation
- **Lead with the task** the user is trying to accomplish
- Use second person imperative: "Run the command" not "You should run the command"
- Be precise -- vague docs are worse than no docs
- Include expected outputs and common errors
- Never assume knowledge without stating the prerequisite

#### Social Media
- **Lead with personality** -- this is where the brand gets to be most human
- Okay to use sentence fragments, casual punctuation, trending formats
- Engage, do not broadcast -- reply to people, join conversations
- Humor is welcome but never punch down

#### Support Responses
- **Lead with empathy** -- acknowledge the frustration before solving
- "I understand this is frustrating" before "Here's how to fix it"
- Never blame the user, even if it is user error
- Provide next steps, not just answers
- Follow up structure: Empathy > Solution > Verification > Offer more help

#### Error Messages
- **Lead with what happened** in plain language
- Say what went wrong, why, and what to do next
- Never use technical codes alone -- always pair with human-readable text
- Avoid "Oops!" and other faux-casual error language unless your brand is genuinely playful (score 7+ on the playful dimension)

---

## 4. Vocabulary Guide

### Words We Use

These words reflect our brand personality and should appear frequently across all content.

| Word/Phrase | Why We Use It | Context |
|-------------|---------------|---------|
| {{PREFERRED_WORD_1}} | {{WORD_1_REASON}} | {{WORD_1_CONTEXT}} |
| {{PREFERRED_WORD_2}} | {{WORD_2_REASON}} | {{WORD_2_CONTEXT}} |
| {{PREFERRED_WORD_3}} | {{WORD_3_REASON}} | {{WORD_3_CONTEXT}} |
| {{PREFERRED_WORD_4}} | {{WORD_4_REASON}} | {{WORD_4_CONTEXT}} |
| {{PREFERRED_WORD_5}} | {{WORD_5_REASON}} | {{WORD_5_CONTEXT}} |
| {{PREFERRED_WORD_6}} | {{WORD_6_REASON}} | {{WORD_6_CONTEXT}} |
| {{PREFERRED_WORD_7}} | {{WORD_7_REASON}} | {{WORD_7_CONTEXT}} |
| {{PREFERRED_WORD_8}} | {{WORD_8_REASON}} | {{WORD_8_CONTEXT}} |

**Common preferred word categories to consider:**
- Power verbs: build, ship, launch, create, unlock, accelerate, simplify, empower, transform, discover
- Outcome words: results, growth, impact, success, performance, efficiency, confidence, clarity
- Relationship words: together, partner, team, community, support, trust, collaborate

### Words We Avoid

These words conflict with our brand personality or have been overused to the point of meaninglessness.

| Word/Phrase | Why We Avoid It | Use Instead |
|-------------|-----------------|-------------|
| "Utilize" | Corporate jargon; "use" is always better | "Use" |
| "Leverage" (as verb) | Overused business-speak | "Use," "take advantage of," or be specific |
| "Synergy" | Meaningless buzzword | Describe the specific collaboration benefit |
| "Best-in-class" | Unsubstantiated superlative | Cite a specific metric or award |
| "Cutting-edge" | Cliche, says nothing specific | Describe what makes it advanced |
| "Seamless" | Overused, often untrue | "Works with," "connects to," or describe the actual integration |
| "Robust" | Vague engineering-speak | Describe the specific capability |
| "Innovative" | Self-congratulatory, show don't tell | Describe the innovation itself |
| "Disruptive" | Overused Silicon Valley cliche | Describe the change you are making |
| "Revolutionary" | Almost never true, undermines credibility | Describe the specific improvement |
| {{AVOIDED_WORD_1}} | {{AVOIDED_WORD_1_REASON}} | {{AVOIDED_WORD_1_ALTERNATIVE}} |
| {{AVOIDED_WORD_2}} | {{AVOIDED_WORD_2_REASON}} | {{AVOIDED_WORD_2_ALTERNATIVE}} |
| {{AVOIDED_WORD_3}} | {{AVOIDED_WORD_3_REASON}} | {{AVOIDED_WORD_3_ALTERNATIVE}} |

### Jargon Decisions

For each technical or industry term, decide: use freely, use with explanation, or avoid.

| Term | Decision | Guideline |
|------|----------|-----------|
| {{JARGON_TERM_1}} | {{JARGON_1_DECISION}} | {{JARGON_1_GUIDELINE}} |
| {{JARGON_TERM_2}} | {{JARGON_2_DECISION}} | {{JARGON_2_GUIDELINE}} |
| {{JARGON_TERM_3}} | {{JARGON_3_DECISION}} | {{JARGON_3_GUIDELINE}} |
| {{JARGON_TERM_4}} | {{JARGON_4_DECISION}} | {{JARGON_4_GUIDELINE}} |
| {{JARGON_TERM_5}} | {{JARGON_5_DECISION}} | {{JARGON_5_GUIDELINE}} |

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
**Developer tool jargon guidance:**
- Use standard technical terms without explanation: API, SDK, CLI, CI/CD, REST, GraphQL, webhook
- Explain your own terminology on first use: "Pipelines (our term for automated workflows)..."
- Avoid marketing terms that developers distrust: "enterprise-grade," "military-grade encryption," "blazing fast"
- Use precise measurements instead of superlatives: "p99 latency under 50ms" not "lightning fast"
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS jargon guidance:**
- Avoid internal product terms in customer-facing copy -- translate to benefits
- Use industry-standard terms your audience knows: dashboard, workflow, integration, automation
- Be careful with terms like "AI-powered" -- only use if you can explain the specific AI capability
- Avoid "platform" unless you truly are a platform (multiple products, extensibility, ecosystem)
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
**Mobile app jargon guidance:**
- Avoid all technical terms in user-facing copy: never say "cache," "sync," "render"
- Use action-oriented language: "Save," "Share," "Open," not "Upload," "Transmit," "Launch instance"
- In app store descriptions, use the language your users search for, not industry jargon
- Translate technical features to outcomes: not "offline mode" but "Works without internet"
<!-- ENDIF -->

### Competitor Naming Convention

- **Always** refer to competitors by their actual name -- never by a dismissive nickname
- **Never** trash-talk competitors directly in public-facing content
- **Do** compare features objectively when asked: "Unlike {{COMPETITOR}}, {{PROJECT_NAME}} offers..."
- **Do not** use "traditional" or "legacy" as code words for competitors

---

## 5. Writing Style Rules

### Sentence Structure

| Rule | Guideline | Example |
|------|-----------|---------|
| **Average sentence length** | 15-20 words. Mix short (5-8) with medium (15-25). Never exceed 35. | "Ship faster. Our CI/CD pipeline runs your tests in parallel, cutting build times by 60% on average." |
| **Paragraph length** | 2-4 sentences for marketing. 1-3 for UI. As needed for docs. | -- |
| **Active voice** | Use active voice at least 90% of the time. | GOOD: "The system processes your request." BAD: "Your request is processed by the system." |
| **Subject position** | Put the subject and verb early in the sentence. | GOOD: "You can export data in three formats." BAD: "In order to facilitate data portability across multiple systems, three export formats are available." |

### Grammar and Mechanics

| Rule | Our Standard | Notes |
|------|-------------|-------|
| **Contractions** | {{CONTRACTION_POLICY}} | "We're" vs "We are," "don't" vs "do not." Contractions feel warmer and more conversational. Use them in marketing and support. Avoid in legal content. |
| **Oxford comma** | {{OXFORD_COMMA_POLICY}} | "Features, pricing, and support" (with) vs "Features, pricing and support" (without). Pick one and be consistent. |
| **Exclamation marks** | Maximum one per page or email. Never in headlines. | Overuse makes everything feel breathless and insincere. |
| **Emoji usage** | {{EMOJI_POLICY}} | Options: Never, Social media only, Sparingly across channels, Freely. |
| **Capitalization** | Sentence case for headlines, buttons, and navigation. | "Get started today" not "Get Started Today" (unless brand decision overrides). |
| **Numbers** | Spell out one through nine, use numerals for 10+. Always use numerals for stats. | "Three features" but "15 integrations" and "3x faster." |
| **Ampersands** | Avoid in body copy. Acceptable in headers if space-constrained. | "Features and pricing" not "Features & pricing" in body. |
| **Ellipses** | Avoid in professional copy. Acceptable in conversational social posts. | -- |

### Humor Policy

**Our humor level:** {{HUMOR_LEVEL}} (None / Subtle / Moderate / Generous)

| Level | What It Looks Like | Where It Works | Where It Does Not |
|-------|-------------------|----------------|-------------------|
| **None** | Straightforward, professional, no jokes | Legal, compliance, crisis comms | -- |
| **Subtle** | Clever word choices, slight wit, the occasional smile | Marketing site, blog, changelogs | Error messages, support, docs |
| **Moderate** | Light jokes, pop culture references, playful headers | Social media, blog, marketing, onboarding | Error messages, pricing, legal |
| **Generous** | Puns, memes, running jokes, personality-heavy | Social, brand campaigns, 404 pages | Support tickets, security alerts |

**Humor rules regardless of level:**
- Never joke about the user's problem or frustration
- Never use humor that requires cultural or regional context to understand
- Never punch down -- humor should target problems, not people
- If a joke needs to be explained, cut it
- Self-deprecating humor about your product should be rare and strategic

### Inclusive Language

- Use "they/them" for singular generic pronouns
- Avoid gendered terms: "salesperson" not "salesman," "team" not "guys"
- Do not use ableist language: "check" not "sanity check," "placeholder" not "dummy"
- Do not use violent metaphors: "stop list" not "kill list," "primary/replica" not "master/slave"
- Write for a global audience: avoid US-centric idioms, sports metaphors, and cultural references that do not travel
- Use people-first language: "people who use screen readers" not "blind users"

---

## 6. Voice in Action: Examples

Below are examples of {{PROJECT_NAME}}'s voice applied to common content types. These serve as benchmarks when creating new content.

### Homepage Headline

**Voice:** {{BRAND_VOICE}}

| Approach | Example |
|----------|---------|
| Benefit-driven | "{{HOMEPAGE_HEADLINE_BENEFIT}}" |
| Problem-driven | "{{HOMEPAGE_HEADLINE_PROBLEM}}" |
| Outcome-driven | "{{HOMEPAGE_HEADLINE_OUTCOME}}" |

**Headline writing tips aligned to our voice:**
- Lead with the transformation, not the tool
- Use the audience's language, not ours
- Be specific enough to be believed ("Save 4 hours a week" not "Save time")
- Keep it under 10 words if possible

### Tweet / Social Post

```
{{EXAMPLE_TWEET}}
```

**Social post guidelines:**
- Character limit awareness (280 for X, variable for others)
- Hook in the first line -- assume the rest is below the fold
- One idea per post
- End with engagement prompt or link, never both
- Hashtag policy: {{HASHTAG_POLICY}}

### Error Message

**Structure:** What happened + Why + What to do next

```
{{EXAMPLE_ERROR_MESSAGE}}
```

**Error message formula:**
1. **State the problem** in plain language (not error codes alone)
2. **Explain why** if it is not obvious and the explanation helps
3. **Give the next step** -- always give the user somewhere to go
4. **Offer help** if the next step might not work

**Example by brand personality:**

| Personality | Error Message |
|-------------|--------------|
| Professional | "We couldn't save your changes. The file may be in use by another application. Try closing other programs and saving again." |
| Friendly | "Hmm, your changes didn't save. This usually happens when another app has the file open. Close it and try again -- we'll be here." |
| Playful | "Save failed -- looks like another app called dibs on that file. Close it and try again?" |
| Technical | "Save failed: EBUSY (resource busy). Close processes holding a lock on the target file and retry." |

### Email Subject Line

| Type | Example |
|------|---------|
| Welcome email | "{{EMAIL_SUBJECT_WELCOME}}" |
| Feature announcement | "{{EMAIL_SUBJECT_FEATURE}}" |
| Re-engagement | "{{EMAIL_SUBJECT_REENGAGE}}" |
| Transactional | "{{EMAIL_SUBJECT_TRANSACTIONAL}}" |

**Subject line rules:**
- Under 50 characters for mobile preview
- No ALL CAPS or excessive punctuation
- Personalization when genuine, not forced
- Preview text extends the subject line, does not repeat it

### Support Response

```
{{EXAMPLE_SUPPORT_RESPONSE}}
```

**Support response structure:**
1. **Greet** by name if available
2. **Empathize** -- acknowledge their experience
3. **Solve** -- provide the answer or clear next steps
4. **Verify** -- confirm the solution or ask clarifying questions
5. **Offer** -- let them know you are here if they need more help
6. **Sign off** warmly

### Blog Post Introduction

```
{{EXAMPLE_BLOG_INTRO}}
```

**Blog intro guidelines:**
- First sentence is the hook -- make the reader feel seen or curious
- Establish the problem or opportunity within the first 2 sentences
- Tell them what they will get from reading
- Keep intros under 100 words -- earn the reader's scroll

---

## 7. Do's and Don'ts

### Before and After Examples

| Category | DON'T (Before) | DO (After) | Why |
|----------|----------------|------------|-----|
| **Clarity** | "Our AI-driven platform leverages cutting-edge machine learning to facilitate optimized workflow automation." | "Our tool uses machine learning to automate your repetitive tasks." | Clearer, fewer buzzwords, benefit-focused. |
| **Active voice** | "Your data is processed by our secure servers." | "Our secure servers process your data." | Active voice is direct and confident. |
| **User focus** | "We built an amazing new dashboard." | "You can now see all your metrics in one place." | Focus on what the user gets, not what you built. |
| **Specificity** | "Blazing fast performance." | "Pages load in under 200ms." | Specific claims are believable. Vague superlatives are not. |
| **Empathy** | "You entered an invalid email address." | "That email address doesn't look right. Check for typos?" | Blame the situation, not the user. |
| **Simplicity** | "In order to commence utilization of the platform..." | "To get started..." | Simple words beat fancy ones. |
| **Confidence** | "We think our product might help you..." | "{{PROJECT_NAME}} helps you {{CORE_BENEFIT}}." | Be confident. If you are not sure about your own product, no one else will be. |
| **Honesty** | "The #1 tool for everything." | "Trusted by {{USER_COUNT}} teams for {{USE_CASE}}." | Superlatives without proof erode trust. Social proof builds it. |
| **Conciseness** | "At this point in time, we are currently working on the process of developing..." | "We're building..." | Delete filler words ruthlessly. |
| **Jargon** | "Leverage our RESTful API endpoints to programmatically interface with..." | "Use our API to connect {{PROJECT_NAME}} with your existing tools." | Translate jargon to outcomes unless writing for developers. |

---

## 8. Brand Voice Checklist

Use this checklist before publishing any content. Every piece of content should score "Yes" on at least 8 of 10 items.

### Pre-Publish Checklist

- [ ] **Personality match:** Does this sound like {{PROJECT_NAME}}'s personality ({{PERSONALITY_ADJ_1}}, {{PERSONALITY_ADJ_2}}, {{PERSONALITY_ADJ_3}})? Read it aloud -- does it sound like our brand, or could it be any company?
- [ ] **Audience appropriate:** Is the tone right for this channel and context? (Check the Tone Matrix in Section 3.)
- [ ] **User focused:** Does the content prioritize "you" over "we"? Does it lead with what the reader cares about?
- [ ] **Clear and scannable:** Can someone understand the main point in 5 seconds? Are there headers, bullets, or bold text to aid scanning?
- [ ] **Active voice:** Is at least 90% of the content in active voice?
- [ ] **Jargon check:** Has all jargon been either removed, explained, or confirmed as acceptable per Section 4?
- [ ] **Avoided words check:** Does the content avoid all words on the "Words We Avoid" list?
- [ ] **Specific and honest:** Are claims backed by evidence? Have vague superlatives been replaced with specifics?
- [ ] **Inclusive language:** Does the content follow our inclusive language guidelines?
- [ ] **CTA clarity:** If there is a call to action, is it clear, specific, and compelling?

### Quick Gut-Check Questions

Ask yourself:
1. Would {{PROJECT_NAME}}'s ideal customer nod along while reading this?
2. Would they share it with a colleague?
3. If they read this next to a competitor's copy, would they prefer ours?
4. Does this build trust?
5. Would I be proud to put my name on this?

---

## 9. Quick Reference Card

Print this or keep it pinned for daily content creation.

```
+------------------------------------------------------+
|          {{PROJECT_NAME}} VOICE QUICK REFERENCE        |
+------------------------------------------------------+
|                                                      |
|  WE ARE: {{PERSONALITY_ADJ_1}}, {{PERSONALITY_ADJ_2}},|
|          {{PERSONALITY_ADJ_3}}                        |
|                                                      |
|  WE SOUND: {{BRAND_VOICE}}                            |
|                                                      |
|  WE SAY: {{PREFERRED_WORD_1}}, {{PREFERRED_WORD_2}},  |
|          {{PREFERRED_WORD_3}}                          |
|                                                      |
|  WE NEVER SAY: {{AVOIDED_WORD_1}}, {{AVOIDED_WORD_2}} |
|                                                      |
|  OUR READER THINKS: "{{READER_FEELING}}"              |
|                                                      |
|  WHEN IN DOUBT:                                      |
|  - Be clear over clever                              |
|  - Be specific over vague                            |
|  - Be helpful over promotional                       |
|  - Be confident over tentative                       |
|  - Be human over corporate                           |
|                                                      |
+------------------------------------------------------+
```

---

## Appendix: Voice Evolution

Brand voice is not static. Review this guide quarterly. Track what resonates with your audience and what falls flat. Update the examples, add new do's and don'ts, and refine the vocabulary list based on real performance data.

**Review schedule:**
- **Monthly:** Check social media engagement by tone and style. Note what works.
- **Quarterly:** Review this guide with the marketing team. Update examples.
- **Annually:** Conduct a full brand voice audit. Survey customers on brand perception.

**Voice evolution log:**

| Date | Change Made | Reason |
|------|-------------|--------|
| {{DATE}} | Initial guide created | Establishing baseline brand voice |
| | | |
| | | |

---

*This brand voice guide is part of the {{PROJECT_NAME}} Master Starter Kit. For questions about brand voice decisions, contact {{BRAND_OWNER}}.*
