# Launch Day Checklist — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in launch day checklist for
# the fictional TaskFlow project management SaaS. Based on the
# template at 19-marketing/launch-strategy/launch-day-checklist.template.md
# ============================================================

> **Launch date:** June 15, 2026 (Monday)
> **Product:** TaskFlow -- project management for small agencies
> **Launch channels:** Product Hunt, Twitter/X, LinkedIn, Email, Reddit, Hacker News
> **War room:** #launch-day channel in team Slack
> **Launch lead:** Sarah Chen | **Dev on-call:** Marcus Liu | **Support lead:** Jamie Park

---

## Table of Contents

1. [Pre-Launch Night](#pre-launch-night)
2. [Launch Day Timeline (Hour by Hour)](#launch-day-timeline)
3. [Product Hunt Submission Details](#product-hunt-submission)
4. [Social Media Drafts](#social-media-drafts)
5. [Email Blast Details](#email-blast)
6. [Metric Goals](#metric-goals)
7. [Post-Launch (24 Hours)](#post-launch-24-hours)

---

## Pre-Launch Night (June 14, Evening)

### Final Technical Checks

- [ ] **Load test the landing page.** Confirm Vercel edge network can handle 10x normal traffic (currently ~200 visitors/day, plan for 2,000+). CDN is active and caching static assets.
- [ ] **Test the signup flow end-to-end.** Create a test account. Verify email confirmation arrives within 30 seconds. Confirm the onboarding wizard loads. Test on Chrome, Safari, Firefox, and mobile.
- [ ] **Test payment processing.** Run a test charge through Stripe ($1 test mode). Confirm the Pro plan upgrade flow works. Verify the receipt email sends.
- [ ] **Check all links.** Verify every link in the launch email, social posts, Product Hunt listing, and landing page. Use a link checker tool.
- [ ] **Confirm uptime monitoring.** UptimeRobot is active and alerting to Sarah's phone, Marcus's phone, and #alerts Slack channel.
- [ ] **Scale server resources.** Increase Railway container to 2 vCPU / 2 GB RAM for the day. Auto-scaling is enabled up to 4 containers.
- [ ] **Clear Sentry errors.** Resolve or mute all existing errors so new launch-day issues are immediately visible.
- [ ] **Take database backup.** Manual backup to S3 in addition to automated daily backups.

### Content and Communication Prep

- [ ] **Pre-schedule morning social posts.** Twitter thread queued for 7:00 AM ET. LinkedIn post queued for 7:15 AM ET. (Use Buffer.)
- [ ] **Queue the launch email.** Loaded in Resend, subject line confirmed, send time set to 6:00 AM ET. Segment: full list (1,200 subscribers).
- [ ] **Prepare Product Hunt submission.** All assets uploaded, tagline finalized, description written, first comment drafted. Ready to submit at 12:01 AM PT.
- [ ] **Draft community posts.** Reddit (r/SideProject, r/startups), Hacker News (Show HN), Indie Hackers -- all drafted in a Google Doc, ready to copy-paste.
- [ ] **Prepare response templates.** Templates ready for: "How is this different from Asana?", "What's the pricing?", "Does it integrate with X?", "Is there a free plan?", and positive feedback thank-yous.

### Team Prep

- [ ] **Brief the team.** Sarah (launch lead, social, PH, email), Marcus (dev on-call, bug fixes, scaling), Jamie (support inbox, community replies). Everyone knows their role.
- [ ] **Set alarms.** Sarah: 5:30 AM ET. Marcus: 5:45 AM ET. Jamie: 6:30 AM ET.
- [ ] **Silence non-launch notifications.** Slack DND mode for non-launch channels.

---

## Launch Day Timeline (Hour by Hour)

All times in US Eastern Time (ET).

### 12:01 AM ET (9:01 PM PT June 14) -- Product Hunt Submission

- [ ] Submit TaskFlow to Product Hunt at 12:01 AM PT (3:01 AM ET).
- [ ] Post maker comment immediately (see Section 3 for full draft).
- [ ] Verify listing: thumbnail, tagline, description, gallery images, links all correct.
- [ ] Go back to sleep. Set alarm for 5:30 AM ET.

### 6:00 AM -- Launch Email

- [ ] Confirm Resend sent the launch email to all 1,200 subscribers at 6:00 AM ET.
- [ ] Monitor delivery dashboard: check for bounces, delivery rate, initial opens.
- [ ] Respond to any early email replies within 30 minutes.

### 7:00 AM -- Social Media Blitz

- [ ] **Twitter/X (7:00 AM):** Confirm the pre-scheduled launch thread posted. Pin to profile. (See Section 4 for full thread draft.)
- [ ] **LinkedIn (7:15 AM):** Confirm the pre-scheduled post is live. Ask co-founder Marcus and team members to reshare within 30 minutes.
- [ ] **DM 15 mutual Twitter/X accounts** asking for a retweet: "We just launched TaskFlow on Product Hunt today. Would mean a lot if you could check it out and share if you think it's useful." (Be genuine, not pushy.)

### 8:00 AM -- Community Posts

- [ ] **Reddit (8:00 AM):** Post to r/SideProject. Title: "[Show] TaskFlow -- project management built for small agencies." Stay in thread and respond to every comment.
- [ ] **Reddit (8:15 AM):** Post to r/startups (different angle, tailored to the subreddit rules).
- [ ] **Hacker News (8:30 AM):** Submit "Show HN: TaskFlow -- Project management that combines tasks, time tracking, and client reporting." Include a text body about the tech stack (Next.js, PostgreSQL, Railway) and what feedback you want.
- [ ] **Indie Hackers (8:45 AM):** Post a detailed launch story with metrics (18 months of building, 800 beta users, $0 in funding).

### 9:00 AM - 12:00 PM -- Morning Engagement Block

- [ ] Check all platforms every 15 minutes. Respond to every comment, question, and mention.
- [ ] **Product Hunt:** Respond to every comment within 10 minutes. Be genuine and helpful.
- [ ] **Hacker News:** Respond to every comment thoughtfully. Accept criticism about pricing, features, or tech choices gracefully.
- [ ] **Email:** Respond to every new user email within 30 minutes.
- [ ] **Monitor Sentry** for new errors. If a bug is reported, Marcus acknowledges in Slack within 5 minutes and deploys a fix within 30.
- [ ] **Track metrics hourly.** Update the shared spreadsheet with visitor count, signups, PH upvotes, and social engagement.

### 12:00 PM -- Midday Check-In

- [ ] Post a progress update on Twitter/X: "6 hours since we launched TaskFlow. Here's how it's going: [metrics, highlights, user quotes]."
- [ ] Share the update on LinkedIn.
- [ ] Check Product Hunt ranking. Adjust engagement strategy if needed.
- [ ] **Eat lunch.** 20 minutes away from the screen. Non-negotiable.

### 1:00 PM - 5:00 PM -- Afternoon Engagement Block

- [ ] Continue responding to all comments and messages.
- [ ] Screenshot positive comments and tweets. Share as social proof (with permission or if public).
- [ ] Post a follow-up tweet with a specific feature deep-dive (e.g., a 30-second GIF of the client reporting feature).
- [ ] DM supporters to say thank you. Personal gratitude, not copy-paste.
- [ ] Monitor and fix any bugs. Marcus prioritizes by impact.
- [ ] If traction is strong, email 3-5 journalists: "TaskFlow launched today -- [X] signups so far, trending on Product Hunt. Here's the one-liner: [pitch]."

### 5:00 PM -- Afternoon Update

- [ ] Post an afternoon update with real numbers: "10 hours in. [X] visitors, [X] signups, [X] PH upvotes. Here's the best comment we've gotten so far: [quote]."
- [ ] Share any press coverage or notable mentions.

### 7:00 PM - 9:00 PM -- Evening Wind-Down

- [ ] Reduce monitoring to every 30 minutes. Respond to new comments as they come.
- [ ] Start drafting the launch retrospective post for tomorrow.
- [ ] Marcus fixes any remaining non-critical bugs reported during the day.
- [ ] Jamie queues personal thank-you DMs for the 10 biggest supporters.

### 10:00 PM -- Recap and Thank-You Post

- [ ] Post a final launch day recap on Twitter/X and LinkedIn: "What a day. TaskFlow launched [X] hours ago. Here's the full story: [final metrics]. Thank you to everyone who supported us. Here's what we're building next: [teaser]."
- [ ] Send a personal thank-you email to anyone who went above and beyond (shared multiple times, wrote about us, gave detailed feedback).
- [ ] Close the laptop. Get sleep. Day 2 starts tomorrow.

---

## Product Hunt Submission Details

**Product name:** TaskFlow
**Tagline:** "Project management that combines tasks, time tracking, and client reporting -- built for small agencies."

**Description:**
TaskFlow is a project management platform purpose-built for small agencies (5-30 people). Instead of juggling Trello for tasks, Harvest for time tracking, and spreadsheets for client reports, TaskFlow puts it all in one place. Kanban boards, built-in time tracking, automated client reports, and integrations with Slack, Figma, and Google Drive. Free plan available. Pro starts at $12/user/month.

**First (Maker) Comment:**

> Hi Product Hunt -- I'm Sarah, co-founder of TaskFlow.
>
> I spent 6 years running a digital agency before building this. The whole time, I managed projects across 4-5 different tools that never talked to each other. Every Friday I spent 2 hours copy-pasting time data into client reports. Every Monday I spent an hour figuring out what everyone was working on.
>
> TaskFlow started as an internal tool to fix that. We combined task boards, time tracking, and client reporting into one workspace. When other agency owners saw it, they asked if they could use it too.
>
> 18 months later, 800+ agency teams use TaskFlow. Here is what makes it different:
>
> - **Tasks + time in one place.** Start a timer on any task with one click. No separate time tracking app.
> - **Client reports in two clicks.** Pull hours, completed tasks, and project progress into a branded PDF your clients actually read.
> - **Built for small teams.** No enterprise complexity. No features you will never use. Pricing that makes sense for a 10-person shop.
>
> We have a generous free plan and Pro starts at $12/user/month.
>
> I would love your honest feedback -- what works, what does not, what you wish it did. We ship updates every week and user feedback drives our roadmap.
>
> Try it: https://taskflow.io

**Gallery images:** 5 screenshots (dashboard, kanban board, time tracking, client report, automation builder).

---

## Social Media Drafts

### Twitter/X Launch Thread (7:00 AM ET)

**Tweet 1 (The hook):**
> After 6 years of running an agency and managing projects across 5 different tools, I built the one I always wanted.
>
> Today we're launching TaskFlow -- project management built specifically for small agencies.
>
> Here's why it exists:

**Tweet 2 (The problem):**
> Small agencies have a project management problem no one talks about:
>
> - Tasks live in Trello
> - Time tracking lives in Harvest
> - Client reports live in Google Sheets
> - Status updates live in Slack threads no one can find
>
> Nothing connects. Everything is manual.

**Tweet 3 (The solution):**
> TaskFlow puts it all in one place:
>
> - Kanban boards for task management
> - Built-in time tracking (one click to start)
> - Client reports that generate in 2 clicks
> - Automations that handle the repetitive stuff
>
> One tool instead of five.

**Tweet 4 (Social proof):**
> 800+ agency teams have been using TaskFlow during our beta.
>
> Average results:
> - 6-10 hours saved per week
> - Client reporting time reduced by 80%
> - One team said it helped them win a new client
>
> (Not making that up -- the full case study is on our blog.)

**Tweet 5 (CTA):**
> We're live on Product Hunt today.
>
> Free plan available. Pro is $12/user/month.
>
> If you run a small agency -- or know someone who does -- I'd love for you to check it out.
>
> https://taskflow.io
> https://producthunt.com/posts/taskflow
>
> A retweet would mean the world.

### LinkedIn Announcement (7:15 AM ET)

> Two years ago, I left my agency to solve the problem that frustrated me most as an agency owner: project management.
>
> Not project management in the abstract. The specific, daily pain of running a 15-person creative shop with tools built for enterprise teams or solo freelancers -- nothing in between.
>
> Today, I'm excited to share that TaskFlow is officially live.
>
> TaskFlow combines task management, time tracking, and client reporting into one workspace built for small agencies (5-30 people). No enterprise bloat. No features you'll never touch. Just the tools your team actually needs, at a price that makes sense.
>
> 800+ agency teams have been using it during our beta. The average team saves 6-10 hours per week on project admin.
>
> We have a free plan and Pro starts at $12/user/month.
>
> If you run or work at a small agency, I'd love for you to try it: https://taskflow.io
>
> And if you know someone who might benefit, I'd be grateful for a share.

---

## Email Blast Details

**Subject line:** "TaskFlow is live -- the project management tool your agency actually needs"
**Preview text:** "Tasks, time tracking, and client reports in one place. Free plan available."
**Send time:** 6:00 AM ET, June 15, 2026
**Segment:** Full email list (1,200 subscribers: waitlist + beta users + newsletter)
**From name:** Sarah from TaskFlow
**Reply-to:** sarah@taskflow.io

**Email body highlights:**
- One-sentence announcement: "TaskFlow is officially live today."
- Three bullet points: what it does, who it is for, what is new since beta.
- Primary CTA: "Try TaskFlow Free" (links to signup).
- Secondary CTA: "Support us on Product Hunt" (links to PH listing).
- Personal note from Sarah thanking early supporters.

---

## Metric Goals (Day 1)

| Metric | Goal | Stretch Goal |
|--------|------|-------------|
| Website unique visitors | 500 | 1,000 |
| New signups (free + trial) | 50 | 100 |
| Product Hunt upvotes | 150 | 300 |
| Product Hunt daily rank | Top 10 | Top 5 |
| Twitter/X impressions | 10,000 | 25,000 |
| Email open rate (launch blast) | 40% | 50% |
| Email click rate | 10% | 15% |
| Media mentions / blog coverage | 3 | 5 |
| Critical bugs reported | 0 | 0 |
| Support response time (avg) | < 30 min | < 15 min |

---

## Post-Launch (24 Hours)

### Response Protocol

- **Support tickets:** Jamie responds to all tickets within 30 minutes during hours (7 AM - 10 PM ET). Overnight tickets get a response by 8 AM the next day.
- **Bug reports:** Marcus triages within 15 minutes. Critical bugs (signup broken, data loss) get an immediate hotfix. Non-critical bugs go to the backlog for this week's sprint.
- **Feature requests:** Log in the feedback spreadsheet. Respond with: "Thanks for the suggestion -- I've added it to our list. We prioritize based on how many users ask for the same thing."
- **Negative feedback:** Acknowledge, do not get defensive. "Thank you for the honest feedback. You're right about [valid point] -- we're working on improving that."
- **Press inquiries:** Sarah responds within 1 hour with the press kit link and an offer for a founder interview.

### Metrics Dashboard

Keep these tabs open all day:

1. **Plausible Analytics** -- Real-time visitor count, traffic sources, top pages.
2. **Product Hunt dashboard** -- Upvotes, comments, ranking.
3. **Resend dashboard** -- Email delivery, opens, clicks.
4. **Stripe dashboard** -- Any day-one paid conversions.
5. **Sentry** -- Errors and performance monitoring.
6. **Railway dashboard** -- Server health, response times, container scaling.
7. **Shared Google Sheet** -- Hourly metrics log (filled in manually by Sarah).

### Thank-You Posts (Day 2 Morning)

- [ ] Twitter/X thread: "Here's how our launch day went -- full numbers, lessons learned, and what's next."
- [ ] LinkedIn post: "TaskFlow launch day results + thank you to this community."
- [ ] Email to supporters list: Personal thank-you with day-one results.
- [ ] Product Hunt comment: Update maker comment with final day-one numbers and a thank-you.
- [ ] Indie Hackers update: Post day-one metrics transparently (the IH community values this).

### Immediate Action Items (48 Hours Post-Launch)

- [ ] Fix any bugs reported on launch day.
- [ ] Update the landing page with social proof from launch day (PH badge, user quotes, signup count).
- [ ] Write and publish a launch retrospective blog post.
- [ ] Send a follow-up email to new signups who have not completed onboarding.
- [ ] Analyze top traffic sources and double down on the highest-performing channel.
- [ ] Personally email the 10 most engaged Product Hunt commenters with a thank-you and an offer for a feedback call.

---

*This launch day checklist is part of the TaskFlow Master Starter Kit. Adjust all times to your target audience's primary timezone. Replace placeholder metrics with your actual targets based on list size and historical benchmarks.*
