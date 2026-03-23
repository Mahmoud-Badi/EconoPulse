# Hacker News Launch and Posting Strategy

> How to post on Hacker News effectively — for product launches, content, and community engagement.
> Part of the Master Starter Kit — Marketing Section.

---

## Table of Contents

1. [Understanding HN Culture](#hn-culture)
2. [When to Post on HN](#when-to-post)
3. [Show HN Format](#show-hn)
4. [Title Optimization](#title-optimization)
5. [Best Posting Times](#posting-times)
6. [Content That Does Well](#content-that-works)
7. [Commenting Strategy](#commenting-strategy)
8. [What Kills HN Posts](#what-kills-posts)
9. [Building HN Karma](#building-karma)
10. [HN-Optimized Landing Page](#landing-page)
11. [After a Successful HN Post](#after-success)
12. [Realistic Expectations](#realistic-expectations)

---

## Understanding HN Culture

Hacker News is unlike any other platform. Understanding its culture is essential — violating community norms will not just hurt your post, it will get you flagged, downvoted, or banned.

### Core Values

- **Meritocracy.** Content is judged on its quality, not the poster's follower count or brand. A nobody with a great project can hit #1.
- **Anti-self-promotion.** The community has a strong distaste for marketing speak, growth hacking, and promotional language. They can smell marketing from a mile away.
- **Technical depth.** The audience is heavily technical: engineers, researchers, founders, and tech-savvy professionals. Surface-level content gets ignored; deep, technical content gets celebrated.
- **Intellectual curiosity.** HN loves novel ideas, unique approaches, and things that make you think. "Same thing but better" doesn't excite them. "Completely different approach to the same problem" does.
- **Honesty and transparency.** Admit your limitations. Don't oversell. The community respects honesty far more than confidence.
- **Substance over style.** Flashy design and marketing polish can actually work against you. A plain, fast-loading page with clear information performs better than a beautifully designed but slow marketing page.

### The Audience

- **Who reads HN:** Software engineers, startup founders, researchers, CTOs, PMs, venture capitalists, tech journalists.
- **What they value:** Technical innovation, open source, privacy, performance, simplicity, honesty.
- **What they dislike:** Marketing fluff, buzzwords ("AI-powered," "revolutionary," "disruptive"), data collection, vendor lock-in, dark patterns.
- **How they communicate:** Blunt, direct, sometimes harsh. Criticism on HN is usually constructive, even when it stings. Don't take it personally.

### HN Guidelines (Official)

From the official HN guidelines (news.ycombinator.com/newsguidelines.html):

- Be civil. Don't say things you wouldn't say face-to-face.
- Don't do things to make titles more attention-grabbing.
- Don't submit the same story repeatedly. (If it didn't gain traction, wait before trying again.)
- Don't use HN primarily for promotion.
- Don't buy or manipulate votes.
- Comment substantively. Don't post shallow dismissals or one-liners.

---

## When to Post on HN

There are three main post types on Hacker News, each with a specific use case.

### "Show HN" — For New Projects and Products

**Use when:** You've built something and want to show it to the HN community.

**Requirements:**
- You must be personally involved in building it (not promoting someone else's product).
- The project should be something HN users can try or experience directly.
- It should be interesting from a technical or intellectual perspective.

**Format:**
- Title: `Show HN: [Product Name] – [Clear description of what it does]`
- Body: Text post explaining what it is, why you built it, and what you'd love feedback on.

### "Ask HN" — For Questions and Discussions

**Use when:** You want to ask the community a question or start a discussion.

**Examples:**
- "Ask HN: How do you handle authentication in microservices?"
- "Ask HN: What's your favorite lesser-known programming language?"
- "Ask HN: I'm building a [type of product] — what would you want in it?"

**Can be useful for market research** before building or launching.

### Regular Link Submissions — For Content

**Use when:** You have a blog post, article, or resource worth sharing.

**Requirements:**
- The content should be genuinely interesting to the HN audience.
- It should not be primarily promotional (a blog post that's thinly disguised product marketing will be flagged).
- Technical deep dives, industry analysis, and unique perspectives perform best.

---

## Show HN Format

This is the most important section if you're launching a product on HN.

### Title Format

```
Show HN: [Product Name] – [What it does, in plain English]
```

**Good examples:**
- `Show HN: Whisper – Open-source speech recognition that runs locally`
- `Show HN: MailTrap – Test email sending without spamming real inboxes`
- `Show HN: PageSpeed Watcher – Get alerts when your site gets slower`

**Bad examples:**
- `Show HN: The Most Revolutionary AI-Powered Platform for Developers` (buzzwords, vague)
- `Show HN: Check out our amazing new tool!!!` (hyperbolic, no information)
- `Show HN: MyApp – Disrupting the $50B market for...` (marketing speak)

### Body Text Structure

When posting a Show HN with a text body, include:

```
[WHAT IT IS — 1-2 sentences]
Clear explanation of what the product does. No jargon. A 12-year-old should
understand the first sentence.

[WHY I BUILT IT — 2-3 sentences]
The personal motivation. What problem were you trying to solve? What was
your "aha moment"? HN loves the human story behind the technology.

[TECHNICAL DETAILS — 2-4 sentences]
What's it built with? Any interesting technical decisions? Open source?
This is where you win the HN audience. Share the "how," not just the "what."

[WHAT I'D LOVE FEEDBACK ON — 1-2 sentences]
Specific questions for the community. This invites constructive engagement.
"I'd especially love feedback on the API design and pricing model."

[LINK]
Your product URL.
```

### Example Show HN Post

```
Title: Show HN: Logfire – Open-source log analysis without the cloud dependency

I got frustrated with sending all my application logs to third-party services
that charge per GB. So I built Logfire — a self-hosted log analysis tool that
runs on a single server and handles up to 1TB/day of log data.

It's built in Rust for performance, uses ClickHouse as the storage backend,
and has a simple web UI for searching and creating alerts. No vendor lock-in,
no per-GB pricing.

The source is on GitHub: [link]. It's MIT licensed.

I'd love feedback on the query language design and whether the setup process
is clear enough from the docs. This is a one-person project so far, and I'm
trying to decide which features to prioritize next.

Live demo: [link]
GitHub: [link]
Docs: [link]
```

### What Makes a Show HN Succeed

1. **Genuinely useful or interesting.** Does it solve a real problem in a way that HN users appreciate?
2. **Tryable immediately.** A live demo or instant signup (no sales call required) is essential.
3. **Technical substance.** Interesting tech stack, novel approach, or open source code.
4. **Humble tone.** "I built this and would love your feedback" beats "We've created the ultimate solution."
5. **Active maker participation.** Responding to every comment promptly and thoughtfully.
6. **Fast, clean landing page.** (See "HN-Optimized Landing Page" below.)

---

## Title Optimization

Your title determines whether people click. On HN, the rules are different from other platforms.

### HN Title Rules

- **Maximum 80 characters.** Shorter is better.
- **Don't editorialize.** Don't add your opinion to the title. Let the content speak.
- **Don't use ALL CAPS** or excessive punctuation!!!
- **Don't use clickbait.** "You won't believe..." will get your post killed.
- **HN moderators may change your title** if it doesn't follow guidelines. They revert to the article's original title for link submissions.

### What Works in Titles

| Strategy | Example | Why It Works |
|----------|---------|-------------|
| **Clarity** | "Show HN: SQLite-based full-text search engine" | Immediately clear what it is |
| **Specificity** | "I wrote a DNS server in 200 lines of Go" | Specific details create intrigue |
| **Results** | "How we reduced our Docker image from 1.2GB to 40MB" | Measurable outcome |
| **Technical interest** | "Writing a compiler from scratch in Rust" | Technically interesting topic |
| **Contrarian** | "Why we moved from microservices back to a monolith" | Challenges conventional wisdom |
| **Open source** | "Show HN: OSS alternative to [commercial product]" | HN loves open source |

### What Fails in Titles

| Strategy | Example | Why It Fails |
|----------|---------|-------------|
| **Buzzwords** | "AI-powered revolutionary disruption platform" | HN smells marketing |
| **Vagueness** | "Show HN: We built something cool" | No information, no clicks |
| **Superlatives** | "The best, fastest, most amazing tool ever" | Overselling triggers skepticism |
| **Emojis** | "Show HN: Our amazing new tool 🚀🔥" | Not the culture |
| **Questions as bait** | "Is this the future of development?" | Reads as marketing |

---

## Best Posting Times

### Optimal Window

- **Tuesday through Thursday** — highest community activity.
- **8:00-10:00 AM US Eastern Time** (5:00-7:00 AM Pacific) — when the US East Coast wakes up.
- **Why this works:** HN traffic peaks during US business hours. Early morning EST means your post gains momentum as more users come online throughout the day.

### Timing Strategy

```
BEST:    Tuesday-Thursday, 8-10 AM EST
GOOD:    Monday, 8-10 AM EST
OKAY:    Friday, 8-10 AM EST
AVOID:   Weekends (lower activity, but also less competition)
AVOID:   Major US holidays
AVOID:   Major tech conferences (audience is distracted)
```

### How the HN Algorithm Works (Simplified)

- New posts appear on the "New" page.
- As they get upvotes, they climb the front page ("Top Stories").
- The ranking formula weighs: upvotes, time since posting, and penalty factors.
- Posts age out. Even a #1 post drops off the front page within 12-24 hours.
- **Critical:** The first 1-2 hours determine whether your post reaches the front page. If you don't gain traction early, the post fades.

### Resubmission Policy

- If your post doesn't gain traction (0-5 points), you can resubmit it later.
- Wait at least a few days before resubmitting.
- HN's guidelines don't prohibit resubmission, but submitting the same URL repeatedly in a short period will be flagged.
- Different day, different time, slightly different title — try again. Many successful HN posts were submitted 2-3 times before gaining traction.

---

## Content That Does Well on HN

### Topics That HN Loves

| Category | Examples |
|----------|---------|
| **Technical deep dives** | "How SQLite works internally," "Building a TCP stack from scratch" |
| **Open source projects** | New OSS tools, frameworks, libraries |
| **Unique approaches** | Novel solutions to common problems, unconventional architectures |
| **Privacy and security** | Tools that protect privacy, security research, encryption |
| **Performance** | Speed improvements, optimization techniques, benchmarks |
| **Programming languages** | New languages, interesting language comparisons, PL theory |
| **Self-hosted alternatives** | OSS replacements for commercial SaaS tools |
| **Startup stories** | Honest post-mortems, launch stories, pivots, failures |
| **Data and research** | Original research, interesting datasets, statistical analysis |
| **Contrarian views** | Well-argued positions that challenge the status quo |

### Topics That HN Dislikes

| Category | Why |
|----------|-----|
| **Marketing content** | "10 Ways to Grow Your SaaS" — too promotional |
| **Shallow listicles** | "Top 10 JavaScript Frameworks" — no depth |
| **PR announcements** | Corporate press releases get flagged |
| **Crypto/NFT promotion** | Community fatigue (though serious technical crypto discussion is fine) |
| **Recruitment spam** | "We're hiring!" as a standalone post |
| **Duplicate content** | Rewording existing popular articles |

### Content Strategy for HN (As a Product Maker)

Instead of posting your product directly, create content that demonstrates your expertise:

1. **Write about a technical challenge** you solved while building your product.
   - "How we built real-time sync without WebSockets"
   - Submit as a blog post link, not a Show HN.

2. **Share interesting data** from your product's usage.
   - "What 100K API calls taught us about error handling patterns"
   - Original data is HN gold.

3. **Open source a component** of your product.
   - "We open-sourced our rate limiter — here's how it works"
   - Open source always gets HN's attention.

4. **Write an honest post-mortem** about a failure or challenge.
   - "Why our first architecture didn't scale (and what we did about it)"
   - Vulnerability and honesty resonate.

5. **Then, periodically, post a Show HN** for your actual product.
   - By now, you have karma, community recognition, and credibility.

---

## Commenting Strategy

Your comments matter as much as (or more than) your post. On HN, maker engagement is what separates a good launch from a great one.

### Comment Rules

1. **Respond to every comment.** Even critical ones. Especially critical ones. This shows you're engaged and genuine.
2. **Respond quickly.** The first 2-3 hours are critical. Comments during this window influence whether other users upvote your post.
3. **Be honest about limitations.** "You're right, we don't support that yet. It's on our roadmap for Q2" is better than "Our product is perfect for everyone."
4. **Accept criticism gracefully.** Someone says your architecture is wrong? Consider it: "That's a fair point. We chose X because of [trade-off], but I can see how Y would be better for [use case]. Something to think about."
5. **Provide technical depth.** When someone asks about implementation details, give a substantive answer. This is where you win the HN audience.
6. **Don't be defensive.** The moment you get defensive, you lose the crowd. Stay calm, be thoughtful, acknowledge valid points.
7. **Don't argue with trolls.** Some comments are just negativity. A brief, polite response or no response at all is best.

### Comment Templates

**For praise:**
```
"Thank you! That means a lot. [Add something substantive — e.g., 'The
auth system was actually the hardest part to get right.']"
```

**For constructive criticism:**
```
"That's a fair point. [Acknowledge their concern]. We currently handle this by
[your approach], but I can see how [their suggestion] would work well for
[use case]. Worth considering — adding it to our discussion list."
```

**For feature requests:**
```
"Great suggestion. This has come up a couple of times — it's on our roadmap
for [timeframe]. If you want to follow along, [link to GitHub issue or roadmap]."
```

**For technical questions:**
```
"Good question. The short answer is [brief answer]. The longer explanation:
[technical detail]. We chose this approach because [reasoning]. Happy to go
deeper if you're interested."
```

**For harsh criticism:**
```
"Appreciate the direct feedback. You're right that [valid part of criticism].
We're actively working on [how you're addressing it]. The trade-off we made
was [explanation], but I hear you."
```

### Common Mistakes in Comments

- **Don't shill.** Avoid turning every comment into a product pitch. Answer the question, don't sell.
- **Don't use marketing language.** "Our revolutionary platform" → "The tool." Keep it plain.
- **Don't ignore negative comments.** Silence looks like you can't handle criticism.
- **Don't write one-word replies.** "Thanks!" is not a comment. Add substance.
- **Don't downvote people who criticize you.** It's petty and sometimes detectable.

---

## What Kills HN Posts

Understanding what kills a post is as important as knowing what makes one succeed.

### Instant Death

| Action | Consequence |
|--------|------------|
| **Asking for upvotes** | Community backlash + possible flagging. NEVER do this. |
| **Vote manipulation** | Using multiple accounts, asking friends to upvote from the same IP, vote rings. HN detects this. |
| **Promotional tone** | "Check out our AMAZING new tool!" → Instant downvotes. |
| **Misleading titles** | Title promises one thing, content delivers another. Flagged quickly. |
| **Broken/slow product** | If HN users click through and your site is down or takes 5+ seconds to load, they'll downvote and comment negatively. |

### Slow Death

| Issue | What Happens |
|-------|-------------|
| **No maker engagement** | Post gets a few comments with questions. Maker doesn't respond. Interest dies. |
| **Defensive responses** | Maker argues with every critique. Community turns against them. |
| **Marketing-heavy landing page** | HN users click through, see "enterprise solutions" marketing speak, bounce. |
| **Requires signup to try** | No demo, no free tier, "request a demo" button. HN users move on. |
| **Nothing technically interesting** | "Another todo app" or "another note-taking tool" without a unique angle. |

### Recovery

If your post is dying:
- **Don't delete and resubmit immediately.** This makes things worse.
- **Engage actively in comments.** Even if the post isn't on the front page, good engagement can revive it.
- **Wait a week and try again.** Different day, different time, maybe a different angle in the title.
- **Create better content first.** Write a technical blog post about your product's architecture. Post that instead.

---

## Building HN Karma

Before launching your product on HN, build karma and community presence. This takes weeks, not days.

### How Karma Works

- You earn karma from upvotes on your comments and submissions.
- Karma determines: your ability to downvote (requires 500+ karma), your account's perceived credibility, and flag weight.
- There's no minimum karma to post, but accounts with zero karma and activity posting a product look suspicious.

### Earning Karma Organically

1. **Read HN daily.** Understand what's being discussed. Get a feel for the community's tone.
2. **Comment thoughtfully.** 2-3 substantive comments per week on topics you know well. Quality over quantity.
3. **Share interesting content.** Found a great technical article? Post it. If it's genuinely interesting, it'll gain traction.
4. **Answer questions.** "Ask HN" threads are opportunities to share your expertise. Helpful answers get upvoted.
5. **Be early.** Comments on new posts that gain traction get more visibility. Check the "New" page, not just the front page.

### Timeline

- **Month 1:** Read daily. Comment 2-3 times per week. Aim for 50-100 karma.
- **Month 2:** Comment more frequently. Submit 1-2 interesting links. Aim for 100-300 karma.
- **Month 3+:** You're now a recognized community member. Launch your Show HN with credibility.

### Karma Before Launch (Minimum)

- **Ideal:** 500+ karma over several months of genuine participation.
- **Acceptable:** 100+ karma with at least a month of activity.
- **Risky:** Under 50 karma or a brand-new account. Looks like you created an account just to promote your product.

---

## HN-Optimized Landing Page

When HN users click through to your site, they have very specific expectations. Violating these expectations means they bounce, downvote, or comment negatively.

### What HN Users Want

- **Fast loading.** Under 2 seconds. Ideally under 1 second. If your page is slow, they will comment about it (negatively).
- **Clear explanation.** What does this product do? Explain it in the first sentence. No vague platitudes.
- **Works without JavaScript (ideally).** HN users are disproportionately likely to run NoScript or disable JS. At minimum, your core message should be visible without JS.
- **No dark patterns.** No forced signup before viewing content. No popup modals. No chat widgets that obscure content. No cookie walls.
- **Technical credibility.** Show your tech stack, link to documentation, explain how it works. Not just "what it does" but "how it works."
- **Try it without signing up.** A live demo, playground, or free tier that doesn't require email. HN users want to evaluate before committing.
- **Pricing transparency.** If it costs money, show the pricing. "Contact sales" for a tool that looks simple will generate negative comments.
- **Simple design.** Clean, fast, informative. Not flashy. Think Stripe's documentation quality, not a Dribbble showpiece.

### What Makes HN Users Leave

- Autoplaying video with sound.
- "Schedule a demo" as the only CTA.
- Corporate stock photos.
- Marketing buzzwords without substance.
- Requiring sign-up to see anything useful.
- Slow loading (this cannot be overstated).
- Cookie consent banners that take up half the screen.
- Chat popups within the first 5 seconds.

### Ideal HN Landing Page Structure

```
[HEADLINE: What it does, plainly stated]
[SUBHEADLINE: For whom and how]
[SCREENSHOT OR DEMO: Show the product immediately]
[TRY IT: Button to instant demo or free signup (no credit card)]
[HOW IT WORKS: Technical explanation — architecture, approach, tech stack]
[PRICING: Clear and visible]
[FOOTER: Links to docs, GitHub (if OSS), blog]
```

---

## After a Successful HN Post

If your post hits the front page, congratulations. Here's how to maximize the opportunity.

### During the Front Page Window (6-24 hours)

- [ ] **Stay engaged.** Respond to every comment. This is the #1 priority during this window.
- [ ] **Monitor your server.** HN traffic can be brutal. The "Hacker News hug of death" is real. Have scaling options ready.
- [ ] **Track signups.** Use UTM parameters or referrer tracking to know exactly how many signups come from HN.
- [ ] **Screenshot everything.** Your HN ranking, comment count, traffic stats. You'll want these for your launch story.
- [ ] **Don't post other links.** Let your current post have its moment. Posting additional links while your Show HN is live looks like spam.

### Immediately After

- [ ] **Thank the community.** Post a comment on your thread: "Update: Thank you for the incredible feedback today. Here's what we're planning to address based on your comments: [list]."
- [ ] **Act on feedback.** If common criticisms emerged, fix them. Then post about the fixes. HN loves makers who listen.
- [ ] **Write a blog post.** "Our Hacker News Experience" or "What I Learned from HN's Front Page." Share the metrics, the feedback, and how it impacted your product. This post itself can do well on HN if it's genuinely insightful.

### Capturing the Traffic

HN traffic is a firehose that shuts off quickly. Make the most of it:

- [ ] **Clear CTA on your landing page.** Make it obvious what visitors should do (sign up, try the demo, star the GitHub repo).
- [ ] **Email capture.** Even if they don't sign up today, capture emails for future engagement.
- [ ] **GitHub stars (if OSS).** Ask people to star the repo. GitHub stars are compounding social proof.
- [ ] **Newsletter signup.** "Get updates on our progress" is a low-commitment alternative to signing up for the product.

### Long-Term Impact

- Your HN post is permanently indexed and searchable.
- Comments provide SEO value and backlinks.
- Some readers will write about your product on their blogs, creating additional backlinks.
- Journalists monitor HN's front page. Press inquiries may come days later.
- Future HN posts will benefit from your established karma and community recognition.

---

## Realistic Expectations

### Most Posts Get 0-5 Points

This is the reality of HN. The vast majority of submissions never gain traction. This doesn't mean your content or product is bad — it means:
- The timing wasn't right.
- The title didn't resonate.
- It got buried under better content.
- The audience that day wasn't interested in your topic.

### Front Page Is Rare

- Roughly 30 new stories make the front page each day.
- Hundreds to thousands of stories are submitted daily.
- Your odds on any given submission are low, probably under 5%.
- But the payoff for reaching the front page is significant.

### Quality Matters More Than Gaming

There is no trick, hack, or shortcut to HN success. The community is too smart and too vigilant for manipulation. The only reliable strategy is:
1. Build something genuinely interesting.
2. Be a genuine community member.
3. Present it honestly and clearly.
4. Engage thoughtfully with the response.
5. If it doesn't work the first time, try again later.

### What Success Actually Looks Like

| Outcome | Typical Result |
|---------|---------------|
| Front page (#1-30) for a few hours | 5,000-50,000 visitors |
| #1 for several hours | 20,000-100,000+ visitors |
| Strong Show HN (100-300 points) | 500-2,000 signups for a free product |
| Front page with paid product | 50-500 signups or trials |
| Conversion rate from HN traffic | 2-8% (lower than average — HN users are browsers) |

### The Bigger Picture

HN is one channel. A great HN launch doesn't build a company, and a failed HN post doesn't kill one. Treat it as an opportunity for feedback and awareness, not a make-or-break moment.

---

*This guide is part of the Master Starter Kit marketing section. Hacker News is a unique community — approach it with genuine curiosity and respect, and it will reward you.*
