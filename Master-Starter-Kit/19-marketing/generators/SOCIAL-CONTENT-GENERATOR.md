# Social Content Generator

**Purpose:** Generate a full month of social media content across all active platforms.
Produces ready-to-post copy organized by content pillar, platform, and post type. Includes
hashtag strategies, engagement hooks, build-in-public templates, and cross-platform
recycling notes. Adapts content mix to product type and brand voice.

**Output:** `marketing/social-media/content-batch-{MONTH}.md`

---

## When to Run

Run this generator:
- After Channel Decision Tree (Step 20) confirms which social platforms are active
- After Brand & Messaging (Step 21) establishes brand voice
- Monthly, to produce the next month's content batch
- After any major product update, pivot, or milestone

---

## Inputs Required

| Input | Location | What it provides |
|-------|----------|-----------------|
| MARKETING_CONFIG | Orchestrator STATE BLOCK | Product type, audience, platforms, brand voice |
| Brand Voice Guide | `marketing/brand-messaging/brand-voice-guide.md` | Tone, personality, vocabulary, do/don't |
| Messaging Framework | `marketing/brand-messaging/messaging-framework.md` | Key messages, proof points |
| Channel Priority Matrix | `marketing/channels/channel-priority-matrix.md` | Active platforms and tier assignments |
| Product Features | Project brief or tribunal specs | Feature list for product posts |
| Content Pillars | `marketing/social-media/social-content-calendar.md` | Content themes and categories |
| Platform Playbooks | `marketing/social-media/{platform}-playbook.md` | Platform-specific best practices |
| Competitor Social Audit | COMPETITOR-MARKETING-ANALYZER output | What competitors post and what works |

---

## Generation Algorithm

1. **Read MARKETING_CONFIG.** Extract:
   - `{{PRIMARY_PLATFORMS}}` -- which platforms to generate content for
   - `{{PRODUCT_TYPE}}` -- determines content style and topics
   - `{{UNIQUE_VALUE_PROP}}` -- weave into product posts
   - `{{CUSTOMER_LANGUAGE}}` -- use their words in educational content
   - `{{MARKET_POSITIONING}}` -- determines thought leadership angle

2. **Define content pillars.** Every post maps to one of these pillars:
   - **Educational:** Teach something valuable about the problem space
   - **Engagement:** Ask questions, run polls, start conversations
   - **Product:** Showcase features, updates, use cases
   - **Behind-the-Scenes (BTS):** Build-in-public, team, process, decisions
   - **Social Proof:** Customer stories, milestones, reviews, media mentions

3. **Read platform playbooks.** Apply platform-specific rules:
   - Character limits, media requirements, hashtag conventions
   - Best posting times and frequency
   - Algorithm preferences (what gets distribution)

4. **Generate content per platform** following the output format below.

5. **Map each post to a content pillar** and ensure distribution matches the target mix.

6. **Apply brand voice** to every piece of content.

7. **Add cross-platform recycling notes** showing which posts adapt across platforms.

---

## Content Pillar Distribution

Target mix for a healthy content feed (adjust per product type):

| Pillar | % of Posts | Purpose |
|--------|-----------|---------|
| Educational | 25-30% | Build authority, attract followers, provide value |
| Engagement | 20-25% | Increase reach through algorithm-boosting interactions |
| Product | 20-25% | Show what you build, drive conversions |
| Behind-the-Scenes | 15-20% | Build trust and authenticity, humanize the brand |
| Social Proof | 5-10% | Provide evidence and credibility |

**CTA Rule:** Maximum 20% of posts should have a direct product CTA (link to sign up,
try the product, visit the website). The other 80% provide value without asking for anything.
Social algorithms penalize link-heavy accounts.

---

## Output Format

Write to `marketing/social-media/content-batch-{MONTH}.md`:

```markdown
# Social Content Batch -- {{PROJECT_NAME}} -- {Month Year}

> **Platforms:** {{PRIMARY_PLATFORMS}}
> **Content Pillars:** Educational, Engagement, Product, BTS, Social Proof
> **Total Posts:** {N}
> **Generated:** {{DATE}}

---

## Twitter/X Content (20 posts + 4 threads)

### Educational Tweets (5 posts)

**Tweet E1:**
> {Educational tweet about the problem space. Teach something specific and actionable.
> 240 characters max for optimal engagement. Include a hook in the first line that
> stops the scroll.}

Pillar: Educational
Schedule: {Day, Time}
Hashtags: {2-3 relevant hashtags}
Media: {None / Image suggestion / Screenshot}
Recycled to: {LinkedIn (adapt), Reddit (expand into post)}

**Tweet E2:**
> {Thread-style insight compressed into a single tweet. "Most people think X about
> {topic}. But actually Y. Here's why:" -- then the explanation.}

Pillar: Educational
Schedule: {Day, Time}
Hashtags: {2-3 relevant hashtags}

**Tweet E3:**
> {Stat or data point about the industry/problem. "X% of {audience} spend {time/money}
> on {problem}. {Insight about why or what to do about it}." Cite source if available.}

Pillar: Educational
Schedule: {Day, Time}

**Tweet E4:**
> {Quick tip or hack related to the problem your product solves. Actionable in
> under 60 seconds. No product mention.}

Pillar: Educational
Schedule: {Day, Time}

**Tweet E5:**
> {Counter-intuitive take or myth-busting about your industry. "Unpopular opinion:
> {statement}. Here's why:" -- brief reasoning.}

Pillar: Educational
Schedule: {Day, Time}

---

### Engagement Tweets (5 posts)

**Tweet G1:**
> {Question that invites responses. "What's your biggest challenge with {topic}?"
> or "If you could automate ONE thing in your {workflow}, what would it be?"}

Pillar: Engagement
Schedule: {Day, Time}
Expected engagement: Replies

**Tweet G2:**
> {Poll. "Which matters more for {topic}? A) {Option A} B) {Option B}"}

Pillar: Engagement
Schedule: {Day, Time}
Expected engagement: Poll votes + quote tweets

**Tweet G3:**
> {"Agree or disagree?" format. State a mildly controversial opinion about the industry.
> Strong enough to provoke discussion, not so strong it alienates.}

Pillar: Engagement
Schedule: {Day, Time}

**Tweet G4:**
> {Fill-in-the-blank. "The best {tool/approach} for {task} is ____." or "I switched
> from ____ to ____ for {task} and never looked back."}

Pillar: Engagement
Schedule: {Day, Time}

**Tweet G5:**
> {"This or that" format. "{Option A} or {Option B} for {use case}? I'll go first:
> {your choice + brief reason}."}

Pillar: Engagement
Schedule: {Day, Time}

---

### Product Tweets (5 posts)

**Tweet P1:**
> {Feature spotlight. Show a specific feature solving a specific problem. Include a
> screenshot or short demo GIF. Keep the copy focused on the OUTCOME, not the feature
> name. "You can now {outcome} with {{PROJECT_NAME}}: {brief explanation}"}

Pillar: Product
Schedule: {Day, Time}
Media: Screenshot or GIF of the feature
CTA: {Link to feature page or sign-up -- this is a CTA post}

**Tweet P2:**
> {Use case tweet. "If you {situation}, {{PROJECT_NAME}} can help. Here's how:
> {specific workflow in 2-3 steps}." No link -- pure value.}

Pillar: Product
Schedule: {Day, Time}

**Tweet P3:**
> {Before/after comparison. "Before {{PROJECT_NAME}}: {pain}. After {{PROJECT_NAME}}:
> {outcome}." Keep it specific and relatable.}

Pillar: Product
Schedule: {Day, Time}

**Tweet P4:**
> {User-generated content or customer quote (with permission). "Love this feedback from
> a user: '{quote}'" -- retweet or screenshot.}

Pillar: Product / Social Proof
Schedule: {Day, Time}

**Tweet P5:**
> {Product update or changelog highlight. "Just shipped: {feature/improvement}. This
> was the #1 requested feature. {What it does in one sentence}."}

Pillar: Product
Schedule: {Day, Time}
CTA: {Link to changelog or product -- CTA post}

---

### Behind-the-Scenes Tweets (5 posts)

**Tweet B1:**
> {Build-in-public update. "Week {N} building {{PROJECT_NAME}}: {milestone or
> challenge}. {What you learned or decided}. {Optional: screenshot of progress}"}

Pillar: BTS
Schedule: {Day, Time}

**Tweet B2:**
> {Decision sharing. "We debated {decision} for a week. Went with {choice} because:
> {reasoning in 1-2 sentences}. Would you have chosen differently?"}

Pillar: BTS / Engagement
Schedule: {Day, Time}

**Tweet B3:**
> {Metrics transparency. "{{PROJECT_NAME}} month {N} numbers: {metric 1}, {metric 2},
> {metric 3}. Here's what we're focusing on next: {priority}."}

Pillar: BTS
Schedule: {Day, Time}

**Tweet B4:**
> {Lesson learned. "Mistake we made this week: {mistake}. What we learned: {lesson}.
> Sharing because someone else might avoid this."}

Pillar: BTS
Schedule: {Day, Time}

**Tweet B5:**
> {Personal/team moment. "Late night debugging {feature} and finally cracked it.
> {Brief story of the challenge and solution}." Humanize the brand.}

Pillar: BTS
Schedule: {Day, Time}

---

### Thread Outlines (4 threads)

**Thread 1: "{Educational topic -- deep dive}" (8-12 tweets)**
- Tweet 1 (hook): {Attention-grabbing opener that promises value}
- Tweet 2-3: {Problem context and why it matters}
- Tweet 4-7: {Actionable steps, tips, or framework}
- Tweet 8-9: {Examples or case studies}
- Tweet 10-11: {Summary and key takeaway}
- Tweet 12: {CTA -- follow for more, check out {{PROJECT_NAME}} if relevant}

**Thread 2: "{Behind-the-scenes -- how we built X}" (6-8 tweets)**
- Tweet 1 (hook): {What you built and why it matters}
- Tweets 2-6: {Decisions, challenges, screenshots, metrics}
- Tweet 7-8: {Lessons learned and what's next}

**Thread 3: "{Industry trend or analysis}" (6-10 tweets)**
- Tweet 1 (hook): {Bold statement about the trend}
- Tweets 2-8: {Evidence, analysis, implications}
- Tweet 9-10: {What to do about it, predictions}

**Thread 4: "{Product story or customer story}" (5-7 tweets)**
- Tweet 1 (hook): {Compelling problem or outcome statement}
- Tweets 2-5: {Story arc: problem -> discovery -> solution -> result}
- Tweet 6-7: {Takeaway and soft CTA}

---

## LinkedIn Content (8 posts)

### Thought Leadership Posts (2)

**LinkedIn TL1:**
> {500-800 word post. Start with a hook line that appears above the "see more" fold
> (first 2-3 lines are critical). Share an original perspective on an industry trend.
> Structure: Hook -> Context -> Your take -> Evidence -> Conclusion -> Discussion question.
> Write in first person. No marketing language. Authentic, opinionated, backed by experience.}

Pillar: Educational / Thought Leadership
Schedule: {Day, Time -- Tue/Wed/Thu mornings perform best}
Hashtags: {3-5 LinkedIn hashtags}
Recycled to: {Twitter thread (condense), Blog post (expand)}

**LinkedIn TL2:**
> {Similar format. Different topic. Could be a "lessons learned" post, a contrarian
> industry take, or a frameworks/mental-models post.}

---

### Case Study / Customer Story Posts (2)

**LinkedIn CS1:**
> {Tell a customer's story in narrative format. Start with their problem, walk through
> the journey, end with specific results. Tag the customer's company if appropriate.
> Include: "What {Company} was dealing with... -> What they tried... -> What changed...
> -> The results:"}

**LinkedIn CS2:**
> {Different angle: before/after comparison with specific metrics. Or a lesson from
> working with customers. "After working with {N} {customer type}, I noticed a pattern:
> {insight}. Here's what the most successful ones do differently:"}

---

### Tips / How-To Posts (2)

**LinkedIn T1:**
> {Actionable tips post. "5 ways to {achieve outcome} without {common pain}:" then
> numbered list with brief explanations. Each tip should be independently valuable.}

**LinkedIn T2:**
> {Process or framework share. "Here's the exact process I use to {relevant activity}:
> Step 1... Step 2... Step 3..." Provide real, usable advice.}

---

### Product Update Posts (2)

**LinkedIn PU1:**
> {Major product announcement or milestone. Frame it as industry-relevant, not just
> self-promotional. "We just launched {feature} because we noticed {industry problem}.
> Here's what it does and why it matters:" Include a visual.}

Pillar: Product
CTA: {Link in comments -- LinkedIn penalizes links in post body}

**LinkedIn PU2:**
> {Behind-the-scenes of building a feature. "The hardest part of building {feature}
> was {challenge}. Here's how we solved it:" Technical audience loves process posts.}

---

## Reddit Content (5 value-add ideas)

**CRITICAL:** Reddit content is NOT promotional. Every post/comment must provide genuine
value to the subreddit community. Self-promotion gets you banned.

### Reddit Idea R1:
**Subreddit:** r/{relevant subreddit}
**Type:** Comment on existing thread
**Topic:** {Thread topic where your expertise is relevant}
**Value:** {What helpful information/perspective you would share}
**Product mention:** None -- pure value contribution
**Goal:** Build karma and reputation in the community

### Reddit Idea R2:
**Subreddit:** r/{relevant subreddit}
**Type:** Original post (question or discussion)
**Topic:** "{Question related to the problem your product solves}"
**Value:** {Frame as seeking community input on a topic you genuinely want to discuss}
**Product mention:** None yet -- this builds community presence

### Reddit Idea R3:
**Subreddit:** r/{relevant subreddit}
**Type:** Resource share
**Topic:** "{Helpful resource you created -- guide, tool, template}"
**Value:** {Share something genuinely useful, freely available, no gate}
**Product mention:** Only if directly asked. If you created the resource, disclose.

### Reddit Idea R4:
**Subreddit:** r/{relevant subreddit}
**Type:** "Show {Subreddit}" post (after 2-4 weeks of community participation)
**Topic:** "I built {product} to solve {problem}. Happy to answer questions."
**Value:** {Transparent about being the builder. Offer value, not a sales pitch.}
**Product mention:** Yes -- transparent, not sneaky. "Full disclosure: I built this."

### Reddit Idea R5:
**Subreddit:** r/{relevant subreddit}
**Type:** AMA or detailed answer
**Topic:** "{Deep expertise share on a topic you know well}"
**Value:** {Comprehensive answer that establishes you as a domain expert}
**Product mention:** Only if naturally relevant and helpful

---

## Visual/Graphic Content Ideas (4 concepts)

### Graphic G1: Infographic
**Concept:** {Data visualization or process diagram related to the problem space.
Example: "The cost of {manual process} -- by the numbers"}
**Platforms:** LinkedIn, Twitter, Instagram
**Copy:** "{2-3 sentence caption explaining the key insight from the infographic}"
**Tools:** Canva, Figma, or custom design

### Graphic G2: Comparison Chart
**Concept:** {Visual comparison -- could be before/after, old way vs new way,
or competitive comparison}
**Platforms:** Twitter, LinkedIn
**Copy:** "{Caption that frames the comparison and invites discussion}"

### Graphic G3: Quote Card
**Concept:** {Customer testimonial or founder quote on branded background.
Include the quote, attribution, and {{PROJECT_NAME}} logo}
**Platforms:** All platforms
**Copy:** "{Brief intro to the quote and why it matters}"

### Graphic G4: Product Screenshot / Demo
**Concept:** {Annotated screenshot or short demo GIF showing a key workflow.
Annotations highlight the specific outcome, not the UI elements}
**Platforms:** Twitter, LinkedIn
**Copy:** "{Outcome-focused caption. Not 'look at our UI' but 'here's how you
accomplish X in 30 seconds'}"
```

---

## Hashtag Strategy

### Platform-Specific Hashtag Rules

| Platform | # of Hashtags | Placement | Type |
|----------|--------------|-----------|------|
| Twitter/X | 2-3 max | End of tweet or woven into text | Industry + niche |
| LinkedIn | 3-5 | End of post, after a line break | Industry + broad reach |
| Instagram | 15-25 | First comment (not caption) | Mix of broad + niche + branded |
| Reddit | 0 | Never | Hashtags are not used on Reddit |

### Suggested Hashtags (customize per product type)

**Industry hashtags:** #{industry}, #{niche}, #{product_category}
**Audience hashtags:** #{audience_role}, #{audience_community}
**Topic hashtags:** #{topic_1}, #{topic_2}
**Branded hashtag:** #{{PROJECT_NAME}} (use sparingly -- only on product posts)

---

## Content Recycling Map

| Original Post | Recycle To | Adaptation Required |
|--------------|-----------|-------------------|
| Twitter thread | LinkedIn post | Expand into paragraphs, add professional context |
| LinkedIn thought leadership | Blog post | Expand significantly, add examples and links |
| Blog post | Twitter thread | Compress to key points, add hooks |
| Twitter tweet | LinkedIn | Add professional framing, lengthen |
| Customer story (any platform) | Email newsletter | Add context and CTA |
| Reddit answer | Blog post | Expand, add visuals, remove Reddit-specific framing |
| Infographic | All platforms | Adjust dimensions per platform specs |

**Recycling Rule:** Wait at least 7 days before posting recycled content. Always adapt
for the destination platform -- do not copy-paste across platforms.

---

## Conditional Adjustments by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
- Emphasize ROI and productivity outcomes in product posts
- Include SaaS-specific hashtags (#SaaS, #B2B, #ProductLed)
- LinkedIn gets more investment (B2B decision makers)
- Feature comparison posts against competitors perform well
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
- Include code snippets and technical demos in product posts
- Twitter/X and Reddit are primary platforms
- Technical accuracy is more important than polish
- Share benchmark results, architecture decisions, and technical deep-dives
- GitHub activity (stars, releases, issues) becomes social content
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
- Visual content is king (screenshots, app demos, short videos)
- TikTok/Instagram Reels for short demo clips
- App Store rating updates become social proof posts
- User-generated content reposting is high-value
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
- Create content for BOTH sides of the marketplace
- Success stories from both buyers and sellers
- Community building content is critical
- Geographic-specific content if marketplace is location-based
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->
- Portfolio showcases and case studies are primary content
- LinkedIn is the primary platform
- Client testimonials and results are highest-performing posts
- Local and industry-specific hashtags
<!-- ENDIF -->

---

## Quality Gates

Before finalizing the content batch, verify:

- [ ] Content pillar distribution matches target percentages (within 5%)
- [ ] Maximum 20% of posts contain a direct CTA or product link
- [ ] Every post matches the brand voice guide tone
- [ ] No two consecutive posts are in the same pillar (mix it up)
- [ ] Twitter posts are under 280 characters (240 for optimal engagement)
- [ ] LinkedIn posts have a strong hook in the first 2 lines (before "see more")
- [ ] Reddit content provides genuine value without promotion (except R4)
- [ ] Hashtags follow platform-specific rules (count and placement)
- [ ] Visual content has clear concepts that a designer can execute
- [ ] Thread outlines have a compelling hook that stands alone
- [ ] Each post can be understood without reading the previous post
- [ ] No factual claims are made without cited or citable sources
- [ ] Content does not reference time-sensitive events that may be past when posted

---

## Validation Checklist

After generation, verify:
- [ ] All `{{PLACEHOLDER}}` variables are resolved
- [ ] Post count matches spec: Twitter (20+4 threads), LinkedIn (8), Reddit (5), Graphics (4)
- [ ] Each post has a pillar assignment and schedule suggestion
- [ ] Cross-platform recycling notes are actionable
- [ ] Conditional sections match the actual product type
- [ ] Content batch covers a full calendar month with appropriate spacing
- [ ] No duplicate content or repeated messaging across posts
