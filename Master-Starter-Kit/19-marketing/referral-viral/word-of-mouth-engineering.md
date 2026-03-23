# Word-of-Mouth Engineering for {{PROJECT_NAME}}

> Designing a product that people naturally talk about.
> Product Type: {{PRODUCT_TYPE}} | Target Audience: {{TARGET_AUDIENCE}}

---

## Table of Contents

1. [Why Word-of-Mouth is the Most Powerful Channel](#why-word-of-mouth-is-the-most-powerful-channel)
2. [The Remarkability Concept](#the-remarkability-concept)
3. [Design for Talk Value](#design-for-talk-value)
4. [WOW Moments Design](#wow-moments-design)
5. [Social Currency](#social-currency)
6. [Triggers: Environmental Cues](#triggers-environmental-cues)
7. [Customer Success Equals Word of Mouth](#customer-success-equals-word-of-mouth)
8. [Making Sharing Easy](#making-sharing-easy)
9. [Collecting and Amplifying User Stories](#collecting-and-amplifying-user-stories)
10. [Anti-Patterns: What Kills WOM](#anti-patterns-what-kills-wom)
11. [Measuring Word-of-Mouth](#measuring-word-of-mouth)
12. [Framework for {{PROJECT_NAME}}](#framework-for-project_name)

---

## Why Word-of-Mouth is the Most Powerful Channel

Word-of-mouth (WOM) is not just a marketing channel -- it is the ultimate marketing channel. Here is why:

### Trust

People trust recommendations from friends and colleagues more than any ad, review site, or influencer.

| Source | Trust Level | Cost |
|--------|------------|------|
| Friend/colleague recommendation | 92% | $0 |
| Online reviews from strangers | 70% | $0 |
| Editorial content/press | 58% | Variable |
| Social media influencers | 38% | High |
| Paid advertising | 24% | High |

A recommendation from a trusted peer is 3-4x more likely to result in a purchase than any paid channel.

### Zero Marginal Cost

Every word-of-mouth recommendation costs you exactly $0 in media spend. The cost is baked into the product itself -- you invest in making something worth talking about, and the distribution is free.

### Compounding Effect

Unlike paid ads (which stop the moment you stop spending), word-of-mouth compounds:

```
Month 1:  10 users talk about {{PROJECT_NAME}} → 3 new users
Month 2:  13 users talk → 4 new users
Month 3:  17 users talk → 5 new users
Month 6:  40 users talk → 12 new users
Month 12: 150 users talk → 45 new users

Each new user becomes a potential advocate, creating exponential growth.
Paid ads: linear. WOM: exponential.
```

### Higher Quality Customers

Customers acquired through word-of-mouth:
- Have 16% higher lifetime value than other customers
- Are 18% more likely to stay (lower churn)
- Have a 37% higher retention rate
- Are more likely to refer others themselves (continuing the cycle)

---

## The Remarkability Concept

"Remarkable" literally means "worth remarking about." Something is remarkable when it is so notable, surprising, or impressive that people feel compelled to talk about it.

### The Remarkability Test

Ask yourself: If a user had dinner with a friend tonight, would they mention {{PROJECT_NAME}}? Why? What would they say?

If you cannot answer that question with a specific, concrete statement, your product is not remarkable yet.

### What Makes Something Remarkable

| Quality | Description | Example |
|---------|-------------|---------|
| **Surprising** | Does something unexpected | Stripe's API that "just works" in 7 lines of code |
| **Extreme** | Best-in-class at something specific | Superhuman's obsessive focus on email speed |
| **Novel** | First to do something | Notion combining docs + databases + wikis |
| **Contrarian** | Challenges conventional wisdom | Basecamp saying "less is more" in project management |
| **Personal** | Makes users feel something | Duolingo's encouraging (and guilt-tripping) notifications |
| **Visible** | Others can see you using it | AirPods as a visible status signal |

### The Talk Value Hierarchy

Not all talk-worthy elements are equal. Aim for the top of this hierarchy:

```
Level 4: IDENTITY   -- "Using this product says something about who I am"
                       (Example: Tesla, Apple, Notion -- using it is a status signal)

Level 3: STORY      -- "Let me tell you about this incredible experience"
                       (Example: Exceptional customer support, surprising delight)

Level 2: UTILITY    -- "You should try this, it'll help with [problem]"
                       (Example: Recommending a useful tool to a colleague)

Level 1: NOVELTY    -- "Have you heard about this new thing?"
                       (Example: First-day buzz that fades quickly)
```

**Goal for {{PROJECT_NAME}}:** Build talk value at Level 2 (utility) minimum, and aspire to Level 3 or 4.

---

## Design for Talk Value

### Unexpected Delight

Create moments that surprise users positively. Delight is the gap between expectation and reality. When reality significantly exceeds expectation, people talk about it.

**Tactics:**

| Tactic | Implementation | Talk Value |
|--------|---------------|-----------|
| **Easter eggs** | Hidden features that users discover and share | "Did you know that {{PROJECT_NAME}} does [hidden thing]?" |
| **Exceptional onboarding** | First experience is so smooth it shocks people | "I was set up in literally 2 minutes" |
| **Thoughtful details** | Small touches that show you care | Custom 404 pages, loading animations, personality in copy |
| **Proactive support** | Reaching out before the user asks for help | "They emailed me before I even noticed the issue" |
| **Generous free tier** | Giving more than expected for free | "You can do all this without paying? Seriously?" |
| **Speed** | Product is noticeably faster than alternatives | "It loads instantly. Like, actually instantly." |

### Visible Quality

Products that are obviously well-crafted trigger sharing. Quality is visible in:

- **Design:** Clean, modern, intentional interface design
- **Performance:** Fast load times, smooth interactions, no jank
- **Copy:** Thoughtful, human, occasionally witty interface text
- **Reliability:** It works. Every time. Without surprises.
- **Attention to edge cases:** Handles unusual situations gracefully

When someone uses a high-quality product, they want others to experience it too. Quality creates pride of association.

### Status Signal

Using certain products says something positive about you. When a product functions as a status signal, users share it voluntarily to enhance their own image.

**How to make {{PROJECT_NAME}} a status signal:**
- Associate with successful, respected users (case studies, testimonials)
- Create a recognizable visual identity (distinctive design language)
- Position as the "smart choice" or "expert's choice"
- Make adoption visible (public profiles, badges, "built with" marks)

### Conversation Starter

Some product features naturally come up in conversation.

**Design features that are conversational:**
```
"So I've been tracking [metric] with {{PROJECT_NAME}} and you wouldn't
believe what I found..."

"I automated my entire [workflow] with {{PROJECT_NAME}} -- took me
15 minutes."

"{{PROJECT_NAME}} just sent me my monthly summary and I've apparently
[surprising statistic]."
```

Products that generate interesting data, surprising insights, or shareable achievements give users something to talk about.

---

## WOW Moments Design

A "WOW moment" is the first time a user experiences the core value of your product and thinks "this is amazing." Identifying and optimizing this moment is one of the highest-leverage activities for driving word-of-mouth.

### Identifying the WOW Moment

Your WOW moment is the earliest point where users experience the core value proposition of {{PROJECT_NAME}}.

**Questions to identify it:**
1. What is the first result or outcome your user achieves?
2. What makes users say "oh, that's cool" or "wow, that was easy"?
3. At what point do users realize this product is different from alternatives?
4. What feature or result makes people's eyes light up in demos?

### Common WOW Moments by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS WOW Moments:**
- First automated task completes successfully ("It just did that for me?")
- First dashboard loads with real data ("I can see everything in one place!")
- First integration connects seamlessly ("It pulled all my data from [source]!")
- First time saved becomes visible ("I just did in 5 minutes what used to take 2 hours")
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
**Mobile App WOW Moments:**
- First personalized result appears ("It knows exactly what I need")
- First achievement unlocked ("I'm actually making progress!")
- First social interaction ("My friends are here too!")
- First problem solved ("This fixed exactly what I was struggling with")
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
**Developer Tool WOW Moments:**
- First successful run with minimal configuration ("Wait, that's all the setup?")
- First performance metric showing dramatic improvement ("10x faster than before")
- First complex task simplified to one command ("One line replaced 50 lines of config")
- First integration with existing workflow ("It works with everything I already use")
<!-- ENDIF -->

### Optimizing the Path to WOW

```
Current time to WOW moment: _____ minutes / _____ steps
Target time to WOW moment:  < 5 minutes / < 3 steps

Steps to reduce:
1. Remove unnecessary signup fields (email only, or social login)
2. Pre-populate with sample data so the product is not empty on first load
3. Provide a guided walkthrough to the WOW moment
4. Remove configuration steps (smart defaults, auto-detection)
5. Show results immediately (instant feedback, no waiting)
```

### WOW Moment Audit

| Current Step | Friction Level | Can It Be Removed? | Optimization |
|-------------|---------------|-------------------|-------------|
| Account creation | Medium | Simplify | Social login, email-only |
| Onboarding survey | Low-Medium | Minimize | 2-3 questions max |
| Configuration | High | Automate | Smart defaults, import existing data |
| First action | Varies | Streamline | Guided walkthrough, templates |
| **WOW moment** | -- | **Accelerate** | **Get here as fast as possible** |

---

## Social Currency

People share things that make them look good. When using or talking about {{PROJECT_NAME}} makes someone look smart, innovative, or successful, they will share it voluntarily.

### Types of Social Currency

**1. Knowledge:** "I know about something you don't"
- Being the first to discover a great tool
- Sharing insider knowledge or tips
- Recommending something that helps others

**2. Status:** "I use sophisticated tools"
- Being associated with a premium product
- Using what the best professionals use
- Being seen as an early adopter

**3. Helpfulness:** "I can help you with your problem"
- Solving a friend's problem by recommending your product
- Being the go-to person for recommendations
- Providing genuine value to their network

**4. Identity:** "This product represents my values"
- Products aligned with their professional identity
- Tools that reflect their work philosophy
- Brands that match how they want to be perceived

### Creating Social Currency for {{PROJECT_NAME}}

| Social Currency | Implementation |
|----------------|---------------|
| **Make users feel smart** | Give them data, insights, or knowledge they can share. "Did you know that [insight from {{PROJECT_NAME}} data]?" |
| **Make users look successful** | Shareable achievements, metrics, or results. "I achieved [result] using {{PROJECT_NAME}}." |
| **Make users feel helpful** | Make it easy to recommend when someone mentions a relevant problem. "You should try {{PROJECT_NAME}} for that." |
| **Give users insider status** | Early access, beta features, community membership. "I got into the beta for {{PROJECT_NAME}}'s new [feature]." |
| **Create FOMO for non-users** | Visible badges, public profiles, community content. Others see {{PROJECT_NAME}} users and want in. |

---

## Triggers: Environmental Cues

A trigger is anything in the environment that reminds someone of your product. Frequency of triggers multiplied by strength of association determines how often people think about (and talk about) your product.

### Types of Triggers

**Frequent triggers (daily/weekly):**
- Work tasks that your product addresses
- Conversations about problems you solve
- Seeing colleagues use the product
- Email notifications and updates from the product

**Situational triggers:**
- Someone asks for a recommendation in your category
- A friend complains about a problem you solve
- Social media discussions about your product's domain
- Industry events or conferences

**Environmental triggers:**
- "Powered by {{PROJECT_NAME}}" badges on websites
- Branded output from the product
- Physical swag (stickers, t-shirts) in offices

### Designing Triggers for {{PROJECT_NAME}}

**High-frequency triggers to build:**

1. **Weekly digest email** -- Regular touchpoint that keeps {{PROJECT_NAME}} in mind
   ```
   "Your weekly {{PROJECT_NAME}} summary: You [accomplished X],
   [saved Y hours], and [achieved Z]."
   ```

2. **"Powered by" attribution** -- Every output includes subtle branding
   ```
   Reports, exports, shared links, embeds all include
   "Made with {{PROJECT_NAME}}" mark.
   ```

3. **Desktop/browser presence** -- Persistent visibility
   ```
   Browser extension, desktop app, Slack integration --
   {{PROJECT_NAME}} is always visible in the user's workflow.
   ```

4. **Conversation hooks** -- Product generates data people naturally discuss
   ```
   "{{PROJECT_NAME}} showed me that [interesting insight]"
   becomes a conversation starter in meetings.
   ```

### Trigger Frequency Matrix

| Trigger Type | Frequency | Strength | Priority |
|-------------|-----------|----------|----------|
| Product usage | Daily | High | Essential -- make product indispensable |
| Email digest | Weekly | Medium | Build -- sends even when user is not active |
| "Powered by" marks | Variable | Medium | Build -- passive exposure to non-users |
| Swag / physical items | Constant (if displayed) | Low | Nice to have -- stickers, t-shirts |
| Social content | Variable | Medium | Build -- shareable insights, achievements |
| Community mentions | Variable | High | Nurture -- enable and encourage sharing |

---

## Customer Success Equals Word of Mouth

The most powerful driver of word-of-mouth is simple: help your users succeed. Users who achieve their goals with your product become automatic advocates.

### The Success-to-Advocacy Pipeline

```
Step 1: User signs up for {{PROJECT_NAME}}
Step 2: User achieves their first goal (WOW moment)
Step 3: User achieves ongoing success (retained user)
Step 4: User attributes success partly to {{PROJECT_NAME}}
Step 5: User naturally mentions {{PROJECT_NAME}} when relevant
Step 6: User actively recommends {{PROJECT_NAME}} to peers
Step 7: User becomes an advocate (creates content, answers questions, evangelizes)
```

### Accelerating the Pipeline

| Step | Acceleration Tactic |
|------|-------------------|
| 1 → 2 | Shorten time-to-value. Guided onboarding. Pre-populated data. |
| 2 → 3 | Onboarding emails. Feature discovery. Regular engagement hooks. |
| 3 → 4 | Show impact: "You saved X hours" or "You completed Y tasks this month." |
| 4 → 5 | Make sharing easy. Prompt at moments of success. Shareable achievements. |
| 5 → 6 | Referral program. Community membership. Ambassador opportunities. |
| 6 → 7 | Recognize advocates. Give them platform. Include them in product development. |

### Success Metrics That Drive WOM

Help users see and articulate their success with {{PROJECT_NAME}}:

```
"Since using {{PROJECT_NAME}}, you've:"
- Saved {{HOURS_SAVED}} hours on {{TASK}}
- Completed {{TASKS_COMPLETED}} {{TASK_TYPE}}s
- Achieved {{KEY_METRIC}} (a {{IMPROVEMENT}}% improvement)
- Collaborated with {{TEAM_MEMBERS}} team members

[Share your results] [Tweet about it]
```

When users can quantify their success, they have a concrete story to tell others.

---

## Making Sharing Easy

Even when users want to share, friction kills follow-through. Remove every barrier between the impulse to share and the actual sharing action.

### One-Click Sharing

Every shareable moment should require exactly one click:

```
[Share on Twitter] → Pre-written tweet, just click to post
[Share on LinkedIn] → Pre-written post, just click to publish
[Copy Link] → Link copied to clipboard with one click
[Email a Friend] → Pre-filled email opens in their email client
[Share to Slack] → Direct share to Slack channel or DM
```

### Pre-Written Messages

Do not make users write the share message. Provide them with well-crafted text they can edit if they want:

**For Twitter:**
```
"Just discovered {{PROJECT_NAME}} for {{USE_CASE}} -- absolute game changer.
If you're a {{TARGET_AUDIENCE_ROLE}}, check it out: {{WEBSITE_URL}}"
```

**For email:**
```
Subject: Check out {{PROJECT_NAME}}

Hey [Name],

I've been using {{PROJECT_NAME}} for {{USE_CASE}} and thought of you.
It [specific benefit relevant to recipient].

Worth checking out: {{WEBSITE_URL}}
```

**For Slack/Teams:**
```
"Found a great tool for {{USE_CASE}} -- {{PROJECT_NAME}}.
We should look at this for the team. {{WEBSITE_URL}}"
```

### Shareable Artifacts

Create outputs from the product that are inherently shareable:

| Artifact | Platform | Example |
|----------|----------|---------|
| Achievement cards | Twitter, LinkedIn | "I just completed 100 tasks in {{PROJECT_NAME}}!" |
| Data visualizations | All platforms | Beautiful charts from user's data |
| Summary reports | Email, Slack | Monthly recap with key metrics |
| Badges | GitHub, personal site | "Certified {{PROJECT_NAME}} user" |
| Public profiles | Direct link | User's portfolio or dashboard page |
| Screenshots | All platforms | Product designed to look good in screenshots |

---

## Collecting and Amplifying User Stories

Real user stories are the most credible form of word-of-mouth. Collect, curate, and amplify them.

### Collecting Stories

**Automated collection:**
- Post-milestone email: "You just [achieved milestone]! Would you share your experience?"
- NPS follow-up: After someone rates 9-10, ask: "Would you mind telling us more about your experience?"
- In-app prompt: After positive action, ask for a quick testimonial
- Support ticket closure: "Was your issue resolved? Would you share your experience?"

**Active collection:**
- User interviews (scheduled 30-minute calls)
- Community threads asking for experiences
- Social media monitoring (find people already talking about you)
- Annual user survey with open-ended questions

**Collection template:**
```
We'd love to hear your story! Answer any of these:

1. What problem were you trying to solve when you found {{PROJECT_NAME}}?
2. What did you try before {{PROJECT_NAME}}?
3. What specific results have you achieved?
4. What's your favorite feature and why?
5. Would you recommend {{PROJECT_NAME}} to a colleague? What would you say?
```

### Amplifying Stories

Once you have user stories, amplify them across channels:

| Story Format | Where to Use | Effort |
|-------------|-------------|--------|
| **Short quote** (1-2 sentences) | Landing page, ads, email signatures | Low |
| **Testimonial card** (quote + photo + name) | Website, social media, sales materials | Low |
| **Case study** (full story with metrics) | Blog, sales enablement, ads | Medium |
| **Video testimonial** (30-60 seconds) | Website, YouTube, social media, ads | Medium-High |
| **Guest blog post** (user writes their story) | Blog, newsletters, Medium | Medium |
| **Podcast interview** (user tells their story) | Podcast, YouTube, social clips | High |

### Story Amplification Cycle

```
1. Collect story from user
2. Get permission to share (written consent)
3. Create multiple formats from one story (quote, card, case study, video)
4. Share across owned channels (website, email, social)
5. Use in paid advertising (testimonial ads)
6. Share with the user so they can reshare (social proof loop)
7. Tag user in social posts (expands reach to their network)
```

---

## Anti-Patterns: What Kills WOM

### Anti-Pattern 1: Asking for Shares Too Early

**Problem:** Prompting users to share before they have experienced value feels pushy and desperate.

**Fix:** Wait until after the WOW moment. After onboarding success, after first achievement, after a positive support interaction. Never during signup or before they have used the product.

### Anti-Pattern 2: Forced Virality

**Problem:** Making sharing mandatory to use features ("Invite 3 friends to unlock this feature"). Users resent being forced and share reluctantly, generating low-quality referrals.

**Fix:** Make sharing optional and rewarding, not required. Feature-gating behind shares feels manipulative. Incentivize without mandating.

### Anti-Pattern 3: Annoying Notifications

**Problem:** Constant push notifications, emails, and pop-ups asking users to share, rate, or review. Especially "Rate us 5 stars!" popups.

**Fix:** Limit share requests to high-satisfaction moments. Maximum once per week in-app, once per month via email. Make dismissal easy and permanent.

### Anti-Pattern 4: Overpromising and Underdelivering

**Problem:** Marketing creates expectations the product cannot meet. Users feel deceived and share negative experiences (negative WOM is 2-3x more powerful than positive).

**Fix:** Underpromise and overdeliver. Let the product speak for itself. Set realistic expectations and exceed them.

### Anti-Pattern 5: Ignoring Negative Feedback

**Problem:** Users with bad experiences talk about them 2-3x more than users with good experiences. One unresolved complaint can undo 10 positive recommendations.

**Fix:** Resolve negative experiences quickly and thoroughly. Turn detractors into promoters by exceeding their expectations in recovery. A great recovery story is itself word-of-mouth worthy.

### Anti-Pattern 6: Generic, Forgettable Product

**Problem:** The product works fine but has no distinctive character. There is nothing to remark about. It is competent but forgettable.

**Fix:** Find one thing to be dramatically better at than anyone else. Be opinionated. Have a point of view. Generic products do not generate word-of-mouth.

---

## Measuring Word-of-Mouth

WOM is harder to measure than paid channels, but there are effective proxies and direct measurement approaches.

### Direct Measurement

**1. "How did you hear about us?" Survey**
Add this to your signup flow (optional, single dropdown):
```
How did you hear about {{PROJECT_NAME}}?
- Friend/colleague recommendation
- Social media
- Search engine
- Blog/article
- Online community (Reddit, forum, etc.)
- Podcast/video
- Advertisement
- Other: _______________
```

Track the percentage selecting "Friend/colleague recommendation" over time. This is your most direct WOM metric.

**2. Net Promoter Score (NPS)**

```
"On a scale of 0-10, how likely are you to recommend
{{PROJECT_NAME}} to a friend or colleague?"

0-6: Detractors (would not recommend, may talk negatively)
7-8: Passives (satisfied but not enthusiastic)
9-10: Promoters (actively recommend -- your WOM engine)

NPS = % Promoters - % Detractors

Good NPS: 30-50
Great NPS: 50-70
World-class NPS: 70+
```

### Proxy Metrics

| Metric | How to Track | What It Indicates |
|--------|-------------|-------------------|
| **Organic mention volume** | Social listening tools (Mention, Brand24) | How often people talk about you unprompted |
| **Share of voice** | Compare your mentions to competitor mentions | Your WOM relative to alternatives |
| **Referral traffic** | GA4: Acquisition > Traffic acquisition > Referral | People clicking links others shared |
| **Direct traffic** | GA4: Direct traffic (people typing your URL) | Brand recognition from WOM |
| **Branded search volume** | Google Search Console, Google Trends | People searching for you by name |
| **User-generated content** | Manual tracking + social monitoring | Blog posts, tweets, videos about you |
| **Community growth** | Discord/Slack member count, forum activity | Organic community expansion |

### Monthly WOM Scorecard

| Metric | This Month | Last Month | Trend | Target |
|--------|-----------|------------|-------|--------|
| NPS score | ____ | ____ | | > 50 |
| % new users from WOM | ___% | ___% | | > 20% |
| Organic social mentions | ____ | ____ | | Growing |
| Branded search volume | ____ | ____ | | Growing |
| User-generated content pieces | ____ | ____ | | Growing |
| Referral program participants | ____ | ____ | | Growing |
| Community members | ____ | ____ | | Growing |

---

## Framework for {{PROJECT_NAME}}

### Step 1: Identify Your WOM Opportunities

Complete this assessment:

```
1. What is {{PROJECT_NAME}}'s WOW moment?
   ___________________________________________________

2. What would make someone mention {{PROJECT_NAME}} at dinner?
   ___________________________________________________

3. What is {{PROJECT_NAME}} dramatically better at than alternatives?
   ___________________________________________________

4. What social currency does using {{PROJECT_NAME}} provide?
   ___________________________________________________

5. What triggers in daily life remind people of {{PROJECT_NAME}}?
   ___________________________________________________

6. What shareable artifacts does {{PROJECT_NAME}} create?
   ___________________________________________________

7. What story would a user tell about {{PROJECT_NAME}}?
   ___________________________________________________
```

### Step 2: Prioritize WOM Initiatives

| Initiative | Impact | Effort | Priority |
|-----------|--------|--------|----------|
| Optimize WOW moment | Very High | Medium | 1 |
| Add "how did you hear" to signup | High | Low | 2 |
| Implement NPS survey | High | Low | 3 |
| Create shareable achievements | High | Medium | 4 |
| Set up social monitoring | Medium | Low | 5 |
| Build referral program | High | High | 6 |
| Collect and publish testimonials | Medium | Medium | 7 |
| Create ambassador program | Medium | High | 8 |

### Step 3: Build the WOM Engine

**Month 1: Foundation**
- [ ] Optimize onboarding to reach WOW moment in under 5 minutes
- [ ] Add "how did you hear about us" to signup
- [ ] Send NPS survey to existing users
- [ ] Start collecting testimonials from happy users

**Month 2: Amplification**
- [ ] Create shareable achievement cards / summary reports
- [ ] Add one-click sharing to key moments
- [ ] Publish first 5 testimonials on website
- [ ] Set up social media monitoring for brand mentions

**Month 3: Acceleration**
- [ ] Launch referral program (see referral-program.template.md)
- [ ] Create "powered by {{PROJECT_NAME}}" attribution system
- [ ] Publish first case study
- [ ] Begin ambassador identification (see ambassador-program.template.md)

**Ongoing:**
- [ ] Monitor NPS monthly and address detractors
- [ ] Collect and publish new testimonials quarterly
- [ ] Refresh shareable content and achievements
- [ ] Optimize based on WOM metrics and user feedback
