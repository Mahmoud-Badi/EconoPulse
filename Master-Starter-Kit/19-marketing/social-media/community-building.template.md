# Community Building Strategy

> **Project:** {{PROJECT_NAME}}
> **Community Platform:** {{COMMUNITY_PLATFORM}}
> **Community Name:** {{COMMUNITY_NAME}}
> **Community Goal:** {{COMMUNITY_GOAL}}
> **Community Manager:** {{COMMUNITY_MANAGER}}
> **Launch Date:** {{COMMUNITY_LAUNCH_DATE}}

---

## Why Build a Community

A community is a moat. Features can be copied. Pricing can be undercut. But a thriving community of engaged users who help each other, provide feedback, and advocate for your product -- that cannot be replicated.

**What a community gives you:**
- **Retention:** Users who join a community churn 30-50% less than those who do not
- **Support:** Community members answer each other's questions, reducing your support burden
- **Feedback:** Real-time product feedback from your most engaged users
- **Advocacy:** Community members become your best marketers (word of mouth)
- **Content:** Community discussions generate ideas for blog posts, features, docs, and marketing copy
- **Network effects:** Each new member makes the community more valuable for everyone else

**When to build a community:**
- You have at least 50-100 active users who would participate
- Your product benefits from user interaction (tips, workflows, integrations)
- You can commit to managing and engaging in the community daily
- Your users have questions, workflows, and insights worth sharing with each other

**When NOT to build a community (yet):**
- You have fewer than 20 users
- Your product is a simple, one-time-use tool
- You cannot dedicate at least 30-60 minutes per day to community management
- You are building to validate, not to retain

---

## Platform Selection

### Comparison Matrix

| Feature | Discord | Slack | Circle | Discourse | Facebook Groups | Reddit (Subreddit) |
|---------|---------|-------|--------|-----------|----------------|-------------------|
| **Best For** | Dev tools, gaming, tech, open-source | B2B, professional, enterprise | Course creators, paid communities | Forums, long-form discussion, open-source | Broad consumer, local, non-tech | Public discovery, SEO, large-scale |
| **Cost** | Free (premium: $2.99/mo per user) | Free tier limited; paid from $7.25/user/mo | From $89/mo | Free self-hosted; hosted from $100/mo | Free | Free |
| **Real-Time Chat** | Excellent | Excellent | Limited | No (forum-based) | Limited | No |
| **Discoverability** | Low (invite-only) | Very low (invite-only) | Low (invite/link) | High (SEO-indexed) | Medium (search) | High (SEO-indexed, Reddit search) |
| **Threading** | Forum channels + threads | Excellent threading | Good threading | Excellent | Basic | Good |
| **Voice/Video** | Built-in (Stage Channels, voice) | Huddles | Limited | No | Rooms | Reddit Talk |
| **Moderation Tools** | Good (bots, roles, automod) | Basic | Good | Excellent | Basic | Good (automod, mod tools) |
| **API/Integrations** | Excellent (bots, webhooks) | Excellent (apps, workflows) | Limited | Good | Limited | Good (API, bots) |
| **Mobile Experience** | Good | Good | Good | Average | Good | Good |
| **Ownership/Data** | You own the server | Limited data ownership | You own the community | Full ownership (self-hosted) | Facebook owns everything | Reddit owns everything |
| **Scalability** | Excellent to 100K+ | Starts to degrade past 500 free | Good to 10K+ | Excellent | Good to 100K+ | Unlimited |

### Recommendation by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**For SaaS Products:** Discord or Slack. Discord if your audience is tech-savvy and comfortable with it. Slack if your audience is more corporate/enterprise. Consider Circle for paid communities or premium tiers.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev-tool" -->
**For Developer Tools:** Discord is the clear winner. Developers are already on Discord. It supports code formatting, bot integrations, and voice channels for office hours. Add a Discourse forum for long-form Q&A that gets indexed by search engines.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile" -->
**For Mobile Apps:** Discord for engaged power users. Reddit subreddit for broader discovery and SEO. Facebook Groups if your audience skews 35+.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
**For Marketplaces:** Discord or Facebook Groups depending on audience demographics. Facebook Groups work well for buyer/seller communities. Discord works for tech-savvy marketplace communities.
<!-- ENDIF -->

---

## Community Goal Definition

Before setting up your community, define what success looks like.

### Primary Goal (Choose One)

| Goal | Description | Success Metric |
|------|-------------|---------------|
| **Customer Support** | Users help each other with questions and issues | Response time, resolution rate, support ticket deflection |
| **Product Feedback** | Collect feature requests, bug reports, and user insights | Feature requests submitted, feedback quality, NPS |
| **User Engagement** | Keep users active and invested in your product | Daily/weekly active members, messages per day |
| **Brand Advocacy** | Turn users into evangelists who promote your product | Referrals generated, testimonials shared, UGC created |
| **Networking** | Connect users with each other for mutual benefit | Connections made, collaborations formed, events attended |

### Community Goal for {{PROJECT_NAME}}

**Primary Goal:** {{PRIMARY_COMMUNITY_GOAL}}
**Secondary Goal:** {{SECONDARY_COMMUNITY_GOAL}}
**Key Metric:** {{COMMUNITY_KEY_METRIC}}
**6-Month Target:** {{COMMUNITY_6_MONTH_TARGET}}

---

## Community Structure

### Channel/Category Organization (Discord Example)

```
Welcome & Info
  #welcome -- auto-greeting for new members, rules, getting started
  #rules -- community guidelines
  #introductions -- new members introduce themselves
  #announcements -- product updates, events, important news (admin-only posting)

Product
  #general -- open discussion about {{PROJECT_NAME}}
  #feature-requests -- suggest and vote on new features
  #bug-reports -- report issues (structured format)
  #tips-and-tricks -- share workflows, hacks, and best practices
  #showcase -- show what you've built with {{PROJECT_NAME}}

Community
  #off-topic -- non-product conversation, personality, fun
  #jobs-and-hiring -- job postings from community members
  #resources -- share useful links, tools, articles
  #events -- upcoming events, webinars, meetups

Support
  #help -- ask questions and get help from community or team
  #faq -- frequently asked questions (pinned or bot-driven)

Voice Channels
  #office-hours -- scheduled voice sessions with the team
  #coworking -- open voice channel for working together
```

### Role Structure

| Role | Who Gets It | Permissions |
|------|-------------|------------|
| **Admin** | Founders, core team | Full access, channel management |
| **Moderator** | Trusted community members | Message management, muting, slow mode |
| **Team Member** | {{PROJECT_NAME}} employees | Identified as official team |
| **Early Adopter / OG** | First 50-100 members | Badge recognition, early access to features |
| **Power User** | Highly active members | Special channels, input on roadmap |
| **Member** | Default role for all | Standard channel access |
| **New Member** | Just joined (auto-assigned) | Limited access until they complete welcome flow |

### Rules Document

**Template: {{COMMUNITY_NAME}} Community Rules**

```
Welcome to the {{COMMUNITY_NAME}} community!

To keep this a valuable space for everyone, please follow these guidelines:

1. BE RESPECTFUL
   Treat everyone with kindness. No harassment, hate speech,
   or personal attacks. Disagree with ideas, not people.

2. STAY ON TOPIC
   Use the right channels for your discussions. Product
   questions in #help, feature ideas in #feature-requests, etc.

3. NO SPAM
   Do not repeatedly promote your own products or services.
   One-time sharing in #resources is fine if it's genuinely
   useful. Ask a moderator if unsure.

4. SEARCH BEFORE ASKING
   Check #faq and search the channel before posting a question.
   It may have already been answered.

5. GIVE BEFORE YOU TAKE
   Help others before asking for help. Share knowledge, answer
   questions, and contribute to discussions.

6. PROTECT PRIVACY
   Do not share personal information about yourself or others.
   Do not screenshot private conversations without consent.

7. REPORT ISSUES
   If you see rule violations, report them to moderators
   privately. Do not engage in public drama.

Violations will be handled as follows:
- First offense: Warning
- Second offense: 24-hour mute
- Third offense: Temporary ban (7 days)
- Severe violations: Immediate permanent ban

Questions? DM a moderator.
```

---

## Launch Strategy

### Phase 1: Foundation (Before Opening)
1. Set up the platform with all channels, roles, and rules
2. Write a welcome message and pin it
3. Create 10-20 seed posts/discussions to avoid an empty community
4. Test the onboarding flow yourself (new member experience)
5. Invite 3-5 trusted people to test and provide feedback on the setup

### Phase 2: First 50 Members (Invitation-Only)
**Goal:** Create a core group of engaged members who set the culture.

- Personally invite your most engaged users (email, DM, in-app notification)
- Frame it as exclusive: "You're one of the first people we're inviting to our community"
- Greet every single new member personally
- Post daily yourself to model the kind of engagement you want
- Ask questions to spark discussion: "What's the #1 thing you'd like us to build next?"
- Respond to every message within 1-2 hours
- Introduce members to each other: "Hey @Alice, @Bob has been doing something similar -- you two should connect"

**Template: Invitation Message**
```
Subject: You're invited to the {{COMMUNITY_NAME}} community

Hey {{FIRST_NAME}},

You've been one of our most engaged {{PROJECT_NAME}} users,
and I wanted to personally invite you to our new community.

We're starting small -- just {{NUMBER}} of our best users --
to create a space where we can:

- Share tips and workflows for getting the most out of {{PROJECT_NAME}}
- Collect your feedback directly (we actually build what you suggest)
- Connect with other {{TARGET_AUDIENCE}} who are solving similar problems
- Get early access to new features before anyone else

Join here: {{INVITE_LINK}}

This is a genuine community, not a marketing channel. Your voice
matters here.

See you inside,
{{YOUR_NAME}}
```

### Phase 3: Growth to 500+ Members
Once you have an active core group (50+ members with daily activity):

- Open the community to all users (add a link in your product, website, email signature)
- Create a "welcome flow" that introduces new members to the community
- Appoint 2-3 active members as moderators
- Start recurring events (weekly office hours, monthly AMA)
- Encourage user-generated content (showcases, tips, tutorials)
- Cross-promote the community on social media, blog, and email

### Phase 4: Scaling (500+ Members)
- Implement automated onboarding (welcome bot, role assignment, channel suggestions)
- Create sub-communities or channels for specific topics or user segments
- Develop a moderation team (community members, not just staff)
- Launch a community ambassador program (rewards for active contributors)
- Track community health metrics and adjust strategy accordingly

---

## Engagement Tactics

### Daily Prompts
Post a conversation starter every day. This keeps the community active and gives lurkers a reason to participate.

**Monday:** "What are you working on this week?"
**Tuesday:** "Tip Tuesday: Share one {{PRODUCT_DOMAIN}} tip that saves you time"
**Wednesday:** "What's one feature you wish {{PROJECT_NAME}} had?"
**Thursday:** "Throwback: What was your first experience with {{PROBLEM_DOMAIN}}?"
**Friday:** "Friday wins: Share something you accomplished this week"
**Saturday:** "Weekend project: What are you building or learning this weekend?"
**Sunday:** "Resource Sunday: Share a useful article, tool, or video you found recently"

### AMAs (Ask Me Anything)
- Host monthly AMAs with the founder or team members
- Invite industry experts, customers, or partners as guests
- Announce 1 week in advance, collect questions ahead of time
- Duration: 1-2 hours of live Q&A

### Challenges
- Weekly or monthly challenges related to your product or domain
- "Build something with {{PROJECT_NAME}} and share it in #showcase"
- "30-day {{SKILL}} challenge -- daily progress updates in #challenge"
- Offer prizes: free months, swag, feature in your newsletter

### Show-and-Tell
- Dedicated channel where members share what they have built or achieved
- Celebrate every submission (react, comment, share)
- Feature the best ones in your newsletter, blog, or social media (with permission)

### Office Hours
- Weekly or bi-weekly voice/video sessions where the team is available for live Q&A
- Keeps a personal connection between the team and community
- Record and share highlights for those who cannot attend

### Member Spotlights
- Feature one community member per week
- Short interview: who they are, what they use {{PROJECT_NAME}} for, their best tip
- Post in #announcements and share on social media

---

## Moderation Guide

### Moderation Principles
1. **Be fair and consistent** -- same rules apply to everyone
2. **Assume good intent** -- most rule violations are accidental, not malicious
3. **Act quickly** -- toxic behavior spreads fast. Remove it before it becomes culture.
4. **Be transparent** -- when you take action, explain why (publicly or privately)
5. **Escalate when needed** -- moderators should escalate serious issues to admins

### Enforcement Ladder

| Severity | Example | Action |
|----------|---------|--------|
| **Low** | Off-topic post, minor spam | Redirect to correct channel, gentle reminder of rules |
| **Medium** | Repeated off-topic, mild disrespect, self-promotion | Direct message warning, citation of specific rule violated |
| **High** | Harassment, hate speech, doxxing | Immediate message deletion, 24-hour mute, formal warning |
| **Severe** | Threats, illegal activity, persistent harassment | Immediate permanent ban, report to platform if needed |

### Handling Common Situations

**Heated Argument Between Members:**
1. Acknowledge both perspectives publicly: "I can see where you're both coming from"
2. Redirect to private: "Let's continue this in DMs so we can understand each other better"
3. If it escalates: "Let's take a break from this topic. I'm locking this thread for now."

**Obvious Spam:**
1. Delete the message immediately
2. Ban the account (spam accounts rarely reform)
3. No need for a warning or explanation

**Gray Area Self-Promotion:**
1. DM the member: "Hey, noticed your post about [product]. We love when members share resources, but we want to make sure it's balanced. Could you also share some non-promotional content or help answer some questions in #help?"
2. Point them to the appropriate channel (#resources or a self-promotion thread)

**Criticism of {{PROJECT_NAME}}:**
1. Do NOT delete criticism (unless it violates rules)
2. Respond constructively: "Thanks for the feedback. Can you tell me more about what happened? I want to make sure we address this."
3. Follow up publicly when the issue is resolved

---

## Community-Led Growth

### How Community Drives Product Adoption
1. **Onboarding support:** New users get help from experienced users, reducing time-to-value
2. **Feature discovery:** Users share workflows and tips, helping others discover features they did not know existed
3. **Social proof:** Active community signals a healthy, trusted product
4. **Word of mouth:** Community members recommend {{PROJECT_NAME}} to their networks
5. **Feedback loop:** Community feedback improves the product, which improves retention

### Community → Acquisition Funnel
```
Social media / blog / search
        ↓
  Community (free to join)
        ↓
  Engage with members and content
        ↓
  See {{PROJECT_NAME}} solving real problems
        ↓
  Try {{PROJECT_NAME}} (free tier / trial)
        ↓
  Get help from community during onboarding
        ↓
  Become a paying user
        ↓
  Become an advocate (invite others, share on social)
```

### Tactics for Community-Led Growth
- **Invite links with tracking:** Unique invite links to measure which members bring in the most new users
- **Referral rewards:** Give community members incentives for inviting others (extended trials, premium features, swag)
- **Testimonial harvesting:** When someone shares a positive experience in the community, ask if you can use it as a testimonial
- **Case study pipeline:** Community discussions reveal power users whose stories make great case studies
- **Beta testing:** Give community members early access to new features in exchange for feedback

---

## Measuring Community Health

### Key Metrics

| Metric | What It Measures | Healthy Range | How to Track |
|--------|-----------------|--------------|-------------|
| **Daily Active Members (DAM)** | How many people participate daily | 5-15% of total members | Platform analytics |
| **Weekly Active Members (WAM)** | How many participate weekly | 20-40% of total members | Platform analytics |
| **Messages per Day** | Overall activity level | Depends on size (10+ for small, 100+ for large) | Platform analytics |
| **Response Time** | How quickly questions get answered | Under 2 hours for common questions | Manual tracking or bot |
| **Member Retention** | Do people stick around after joining? | 70%+ still active after 30 days | Platform analytics |
| **Lurker-to-Poster Ratio** | How many people contribute vs. just read | 10-20% posting, 80-90% lurking (normal) | Platform analytics |
| **Net Promoter Score (NPS)** | Would members recommend the community? | 50+ is excellent | Survey quarterly |
| **Sentiment** | Is the tone positive or negative? | Mostly positive, constructive criticism welcome | Manual review |

### Monthly Community Health Check

| Metric | This Month | Last Month | Trend | Notes |
|--------|-----------|-----------|-------|-------|
| Total members | | | | |
| New members | | | | |
| DAM / WAM | | | | |
| Messages per day | | | | |
| Average response time | | | | |
| Top contributors | | | | |
| Feature requests submitted | | | | |
| Support questions answered by community | | | | |
| Members who churned | | | | |

---

## Community → Content Pipeline

Community discussions are a goldmine for content. Here is how to systematically turn them into marketing assets.

### Discussions → Blog Posts
- When a question comes up repeatedly, write a comprehensive blog post answering it
- When a member shares an innovative workflow, expand it into a tutorial
- When a heated discussion reveals differing opinions, write a "X vs Y" comparison post

### Discussions → Product Features
- Track feature requests in a public roadmap (Canny, Linear, Notion)
- Vote on requests in the community to prioritize
- When you ship a community-requested feature, announce it in the community FIRST

### Discussions → Documentation
- FAQs from #help → official documentation
- Tips from #tips-and-tricks → official best practices guide
- Bug workarounds → knowledge base articles

### Discussions → Social Content
- Interesting community discussions → tweet threads or LinkedIn posts
- Member showcases → social media features (with permission)
- Community milestones → celebratory posts

---

## Community Manager Responsibilities

### If You Are the Community Manager (Solo Founder)

**Daily (30-45 min):**
- Greet new members
- Respond to questions in #help
- Post a daily prompt or conversation starter
- React to and comment on member posts
- Check for rule violations

**Weekly (1-2 hours):**
- Review community metrics
- Plan next week's engagement activities
- Host or prepare for office hours/events
- Identify and recognize top contributors
- Update FAQ/pinned messages as needed

**Monthly (2-3 hours):**
- Full community health review
- Plan next month's events and themes
- Reach out to inactive members (re-engagement)
- Review and update community rules if needed
- Create content from community discussions

### Automation Opportunities
- **Welcome bot:** Auto-greet new members, assign roles, share rules
- **FAQ bot:** Auto-respond to common questions with links to answers
- **Moderation bot:** Auto-flag potential rule violations (spam, links, offensive content)
- **Metrics bot:** Auto-track and report community statistics
- **Reminder bot:** Auto-post daily prompts and event reminders

**Tools:** MEE6 (Discord), Carl-bot (Discord), Slack Workflow Builder, Zapier/Make for cross-platform automations

---

## Templates

### Community Launch Announcement (Social Media / Email)

```
Subject: Join the {{COMMUNITY_NAME}} Community

We just launched the {{COMMUNITY_NAME}} community -- a space for
{{TARGET_AUDIENCE}} to connect, learn, and grow together.

Inside, you'll find:

- Direct access to the {{PROJECT_NAME}} team for questions and feedback
- Tips, workflows, and best practices from power users
- Early access to new features before they're public
- A network of {{TARGET_AUDIENCE}} building amazing things

It's free to join and we'd love to have you.

Join here: {{INVITE_LINK}}

See you inside,
{{YOUR_NAME}} and the {{PROJECT_NAME}} team
```

### Welcome Message (Posted in #welcome)

```
Welcome to {{COMMUNITY_NAME}}!

We're glad you're here. This community is a space for
{{TARGET_AUDIENCE}} to help each other, share ideas, and
get the most out of {{PROJECT_NAME}}.

Here's how to get started:

1. Introduce yourself in #introductions
   (who you are, what you're building, what brought you here)

2. Check out #rules for community guidelines

3. Browse #tips-and-tricks for quick wins

4. Ask questions anytime in #help -- we're friendly, we promise

5. Share what you're building in #showcase -- we love seeing it

Useful links:
- {{PROJECT_NAME}} docs: {{DOCS_URL}}
- Feature requests: #feature-requests
- Bug reports: #bug-reports

Questions? Tag @{{COMMUNITY_MANAGER}} or any @Moderator.

Looking forward to seeing you around!
```

### Rules Document (See Moderation section above)

---

## Quick-Start Checklist

- [ ] Define your community goal and key metric
- [ ] Choose your platform (Discord, Slack, Circle, etc.)
- [ ] Set up the platform with channels, roles, and rules
- [ ] Write and post your welcome message and rules
- [ ] Create 10+ seed discussions to avoid an empty community
- [ ] Personally invite your first 20-50 most engaged users
- [ ] Greet every new member for the first month
- [ ] Post a daily prompt for the first 2 weeks to build engagement habits
- [ ] Schedule your first community event (office hours or AMA)
- [ ] Set up basic automation (welcome bot, FAQ bot)
- [ ] Track community health metrics weekly
- [ ] Appoint 2-3 moderators from active community members (month 2-3)
- [ ] Create a community-to-content pipeline
- [ ] Review and adjust strategy monthly based on metrics
