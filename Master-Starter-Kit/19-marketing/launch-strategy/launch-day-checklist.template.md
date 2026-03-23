# Launch Day Checklist for {{PROJECT_NAME}}

> An hour-by-hour execution plan for launch day, covering every platform and scenario.
> Part of the Master Starter Kit — Marketing Section.

---

## Table of Contents

1. [Pre-Launch Night](#pre-launch-night)
2. [Launch Day Timeline (Hour by Hour)](#launch-day-timeline)
3. [Platform-Specific Launch Tasks](#platform-specific-tasks)
4. [Emergency Response Plan](#emergency-response)
5. [Real-Time Metrics Dashboard](#real-time-metrics)
6. [Post-Launch Same-Day Debrief](#same-day-debrief)

---

## Pre-Launch Night (The Evening Before)

Launch day starts the night before. Spend 1-2 hours on final preparation so you can execute with confidence tomorrow.

### Final Technical Checks

- [ ] **Load test your landing page.** Can it handle 5-10x your normal traffic? If you're on shared hosting, consider temporarily upgrading. If using a CDN (Cloudflare, Vercel, Netlify), confirm it's active.
- [ ] **Test the signup/purchase flow.** Go through the entire flow yourself. Create a test account. Make a test purchase. Confirm emails are delivered.
- [ ] **Check all links.** Every link in your emails, social posts, and landing page should work. Broken links on launch day are devastating.
- [ ] **Verify payment processing.** Stripe, PayPal, or whatever you use — confirm it's live and processing correctly.
- [ ] **Clear your error monitoring.** Check Sentry, LogRocket, or your monitoring tool. Resolve any existing errors so you can spot new ones quickly tomorrow.
- [ ] **Confirm uptime monitoring is active.** UptimeRobot, Pingdom, or similar. Set alerts to your phone.
- [ ] **Database backups.** Take a manual backup now. Confirm automated backups are running.

### Content and Communication Prep

- [ ] **Pre-schedule social media posts** for the morning launch announcements. Use your scheduling tool or platform native scheduling.
- [ ] **Queue your launch email** in your email tool. Double-check the subject line, preview text, content, and links. Set it to send at your chosen time (recommended: 6-7 AM in your target audience's primary timezone).
- [ ] **Prepare your Product Hunt submission** (if applicable). Have all assets uploaded, tagline finalized, description written, first comment drafted. Submit at 12:01 AM PST.
- [ ] **Draft community posts** for Reddit, Hacker News, Indie Hackers, and any other platforms. Have them in a document ready to copy-paste.
- [ ] **Prepare response templates** for common questions, objections, and positive feedback. You'll need these when the comments start flowing.

### Team and Personal Prep

- [ ] **Brief everyone involved.** If you have a team, co-founder, or friends helping — make sure everyone knows their role and timing.
- [ ] **Set your alarm.** If you're doing Product Hunt (12:01 AM PST), set your alarm accordingly. Otherwise, aim to be at your desk by 6 AM in your audience's timezone.
- [ ] **Prepare your workspace.** Two monitors if possible. Phone charged. Water and snacks nearby. You'll be at your desk for 12-16 hours.
- [ ] **Silence non-essential notifications.** You want launch-related alerts only. Turn off Slack channels, social media notifications from non-launch accounts, and other distractions.
- [ ] **Get sleep.** This sounds obvious, but many founders stay up all night tweaking things. Don't. A rested mind makes better decisions during the chaos of launch day.

---

## Launch Day Timeline (Hour by Hour)

Adjust all times to your target audience's timezone. This template uses US Eastern Time as a baseline.

### 12:01 AM — Product Hunt Submission (If Applicable)

- [ ] Submit to Product Hunt at exactly 12:01 AM PST (3:01 AM EST).
- [ ] Post your first/maker comment immediately after submission.
- [ ] Verify your listing appears correctly: images, tagline, description, links.
- [ ] **Go back to sleep.** (If you're doing Product Hunt, set a second alarm for 6 AM.)

### 6:00 AM — Launch Email

- [ ] Send launch announcement email to your entire list.
- [ ] **Subject line examples:**
  - "{{PROJECT_NAME}} is live! 🚀"
  - "It's here — {{PROJECT_NAME}} just launched"
  - "We've been building something for {{TIME_PERIOD}}. It's finally ready."
- [ ] Include in the email: what launched, key benefits, CTA (try it / sign up), Product Hunt link (if applicable), social share request.
- [ ] Monitor email delivery: open rates, click rates, bounce rates.
- [ ] Respond to any immediate email replies within 30 minutes.

### 7:00 AM — Social Media Blitz

Post across all platforms within a 30-minute window. Stagger slightly so you're not copy-pasting the same thing everywhere.

- [ ] **Twitter/X (7:00 AM):**
  - Post launch announcement thread (3-5 tweets). Structure:
    1. The announcement + link
    2. The problem you're solving
    3. Key features / what makes it different
    4. Social proof (beta results, testimonials)
    5. CTA + ask for retweets
  - Pin the thread to your profile.
  - Reply to your own thread with the Product Hunt link (if applicable).

- [ ] **LinkedIn (7:15 AM):**
  - Post a personal launch story from your founder profile (performs better than company pages).
  - Structure: the journey, why you built this, what it does, CTA.
  - Ask employees / co-founders to reshare within 1 hour (early engagement matters on LinkedIn).

- [ ] **Instagram (7:20 AM):**
  - Post carousel or product screenshot to feed.
  - Add launch announcement to Stories (multiple slides: problem → solution → demo → CTA → link).
  - Update link in bio to your launch page.

- [ ] **TikTok/Reels/Shorts (7:30 AM):**
  - Post a 30-60 second launch video (can be pre-recorded).
  - Formats that work: quick product demo, founder talking to camera, before/after.

### 8:00 AM — Community Posts

Post to relevant communities. Each community has different norms — respect them.

- [ ] **Reddit (8:00 AM):**
  - Post to r/SideProject, r/startups, r/[your niche] (check each sub's rules first).
  - Use "Show" format where applicable.
  - Write a genuine post about what you built and why. Not a sales pitch.
  - Stay in the thread and respond to every comment.

- [ ] **Hacker News (8:15 AM):**
  - Submit as "Show HN: {{PROJECT_NAME}} – {{SHORT_DESCRIPTION}}" (if doing Show HN).
  - Include a text body: what it is, why you built it, tech stack, what you'd love feedback on.
  - See the dedicated `hacker-news-guide.md` for detailed HN strategy.

- [ ] **Indie Hackers (8:30 AM):**
  - Post a detailed launch story in the forum.
  - Include metrics, backstory, and what you learned during development.
  - The IH community loves transparency.

- [ ] **Other communities (8:45 AM):**
  - Discord servers (share in appropriate channels only — not spam).
  - Slack groups.
  - Facebook groups.
  - Niche forums.

### 9:00 AM - 12:00 PM — Morning Engagement Block

This is the most critical engagement window. Be online, responsive, and active.

- [ ] **Check all platforms every 15-20 minutes.** Respond to every comment, question, and mention.
- [ ] **Product Hunt:** Respond to every comment on your listing within 10 minutes. Be genuine, helpful, and grateful. Update your first comment if needed.
- [ ] **Hacker News:** Respond to every comment thoughtfully. Accept criticism gracefully. Don't argue.
- [ ] **Social media:** Reply to every tweet, comment, and DM. Retweet/share supportive posts.
- [ ] **Email:** Respond to every email from new users within 30 minutes.
- [ ] **Monitor for bugs.** Check your error monitoring tool. If users report issues, acknowledge immediately and fix fast.
- [ ] **Track metrics.** Open your analytics dashboard. Note signups, traffic sources, and conversion rate.

### 12:00 PM — Midday Check-in

- [ ] Post a progress update on Twitter/X: "4 hours since launch! Here's what's happened so far: [metrics, reactions, highlights]."
- [ ] Share the update on your other active platforms.
- [ ] Email or message your supporters: "Thank you for the incredible launch day support so far!"
- [ ] Check Product Hunt ranking. If you're in the top 5, double down on engagement. If not, don't panic — keep engaging.
- [ ] Eat lunch. Seriously. Take 20 minutes away from the screen.

### 1:00 PM - 5:00 PM — Afternoon Engagement Block

- [ ] **Continue responding** to all comments and messages across platforms.
- [ ] **Share user reactions.** Screenshot positive comments, tweets, or DMs (with permission) and share them as social proof.
- [ ] **Post additional content.** A follow-up tweet/post with a specific feature deep-dive or user story.
- [ ] **DM supporters directly.** Thank people who shared your launch. Personal gratitude goes a long way.
- [ ] **Monitor and fix bugs.** If issues are reported, prioritize the most impactful ones. Ship hotfixes if needed.
- [ ] **Reach out to press.** If you're getting traction, email journalists: "We launched [Product] today — [X] signups so far, trending on Product Hunt." Traction makes the story newsworthy.

### 5:00 PM — Afternoon Update

- [ ] Post another progress update with real numbers: signups, upvotes, traffic, memorable user quotes.
- [ ] Share any press coverage or notable mentions.
- [ ] Thank specific people and communities that helped.

### 6:00 PM — Progress Update Post

- [ ] Write a detailed progress update. Include:
  - Key metrics: signups, traffic, PH rank, social engagement.
  - Memorable moments: best comment, funniest reaction, most surprising feedback.
  - Lessons learned: what worked, what didn't, what surprised you.
  - Gratitude: thank specific people, communities, and supporters.
- [ ] Post on Twitter/X, LinkedIn, and Indie Hackers.
- [ ] Share with your email list (optional — only if you have something meaningful to share).

### 7:00 PM - 9:00 PM — Evening Wind-Down

- [ ] **Continue monitoring** but at a reduced pace. Respond to new comments as they come.
- [ ] **Start drafting** your launch retrospective for tomorrow.
- [ ] **Fix any remaining critical bugs** reported during the day.
- [ ] **Queue thank-you messages** for key supporters.
- [ ] **Review metrics dashboard.** Take screenshots for your records.

### 10:00 PM — Recap and Thank You Post

- [ ] Post a final launch day recap:
  - "What a day! {{PROJECT_NAME}} launched XX hours ago. Here's how it went:"
  - Final metrics for the day.
  - A heartfelt thank you.
  - What's next: upcoming features, improvements based on feedback.
- [ ] Send a personal thank-you email to anyone who went above and beyond (shared multiple times, wrote about you, gave detailed feedback).

### 11:00 PM — Done

- [ ] Close your laptop.
- [ ] Set one final alarm for the morning to check overnight developments.
- [ ] Get sleep. Tomorrow is Day 2, and the work continues.

---

## Platform-Specific Launch Tasks

### Product Hunt

See the full `product-hunt-guide.md` for comprehensive strategy. Launch day essentials:

- [ ] Submit at 12:01 AM PST (midnight Pacific Time). This gives you the full 24-hour cycle.
- [ ] Post your maker comment immediately. Make it personal and detailed (200-400 words):
  - Why you built {{PROJECT_NAME}}.
  - The personal story behind it.
  - What makes it different.
  - What you'd love feedback on.
- [ ] **Ask for support the right way:** Share the PH link and say "I'd love your support and honest feedback." Never say "please upvote me."
- [ ] Respond to every PH comment within 10 minutes. Be genuine and helpful.
- [ ] Update your maker comment throughout the day with new information, fixes, or milestone celebrations.
- [ ] Thank voters in the comments and on social media.
- [ ] **Don't obsess over the ranking.** Top 5 is great, but the real value is signups and traffic, not a badge.

### Hacker News

See the full `hacker-news-guide.md` for detailed strategy. Launch day essentials:

- [ ] Post between 8-10 AM EST (Tuesday-Thursday is best).
- [ ] Use "Show HN" format: "Show HN: {{PROJECT_NAME}} – {{SHORT_DESCRIPTION}}"
- [ ] Text body should include: what it is (1-2 sentences), why you built it, interesting technical details, what you'd love feedback on.
- [ ] **Never ask for upvotes.** This is an instant community violation on HN.
- [ ] Respond to every comment, even critical ones. Be honest about limitations.
- [ ] Accept criticism gracefully. HN commenters are blunt but often right.
- [ ] If your post gets traction (front page), stay engaged for the entire time it's visible.
- [ ] Make sure your landing page loads fast and works without JavaScript. HN users notice.

### Twitter/X

- [ ] Post a launch thread (3-5 tweets). Tweet 1 is the hook.
- [ ] Pin the thread to your profile.
- [ ] Change your display name to include a launch indicator (optional): "{{YOUR_NAME}} — just launched {{PROJECT_NAME}}"
- [ ] Update your bio with {{PROJECT_NAME}} description and link.
- [ ] Reply to every mention, quote tweet, and DM throughout the day.
- [ ] Retweet/quote supportive posts from others.
- [ ] DM 10-20 mutuals asking for a retweet (be polite, not pushy).
- [ ] Post 3-5 supplementary tweets throughout the day (metrics, user reactions, behind-the-scenes).

### LinkedIn

- [ ] Post from your personal profile (always outperforms company pages for launches).
- [ ] Use the "personal story" format: journey, struggle, why you built this, what it does, CTA.
- [ ] Tag relevant connections who helped or inspired you.
- [ ] Ask your team/co-founders to reshare and comment within the first hour.
- [ ] Respond to every comment — LinkedIn rewards early engagement.
- [ ] Post a follow-up later in the day with results and learnings.

### Reddit

- [ ] Post to relevant subreddits (2-3 max, not 10 — that looks like spam).
- [ ] Each subreddit gets a tailored post — not copy-paste.
- [ ] Be value-first: share what you learned building it, not just what it does.
- [ ] Include "Show" prefix if the subreddit supports it.
- [ ] Stay in the thread for hours. Respond to everything.
- [ ] Do NOT post across many subreddits simultaneously — Reddit tracks this and will flag it as spam.
- [ ] Be transparent about being the maker.

---

## Emergency Response Plan

### If Your Site Crashes

1. **Don't panic.** It happens to most launches that get real traction.
2. **Post an update immediately:** "We're experiencing heavy traffic — our server is spinning up. Back in a few minutes!"
3. **Contact your hosting provider** for emergency scaling.
4. **Put up a simple static page** (Cloudflare Pages, Netlify, or even a Google Doc) with your core information and a waitlist signup while you fix the main site.
5. **Fix the root cause:** Scale up servers, enable caching, optimize database queries, increase rate limits.
6. **Post a recovery update:** "We're back! Thanks for your patience — turns out our launch went better than our server expected 😄"

### If You Get Negative Feedback

1. **Don't get defensive.** This is the hardest part.
2. **Acknowledge the feedback.** "Thank you for the honest feedback. You're right about [valid point]."
3. **Differentiate between types of negative feedback:**
   - **Bug reports:** "Great catch — fixing this now." (Then actually fix it.)
   - **Feature requests:** "We've heard this from a few people. Adding to our roadmap."
   - **Philosophical disagreements:** "Interesting perspective. We took a different approach because [reason], but I see your point."
   - **Trolling:** Ignore or respond with grace. Don't engage in arguments.
4. **Turn criticism into opportunity.** A thoughtful response to criticism often wins more supporters than the criticism lost.

### If You Find a Critical Bug

1. **Assess severity.** Does it block signups or core functionality? Fix immediately. Is it cosmetic? Note it and fix tomorrow.
2. **Communicate proactively.** If users are affected, post: "We identified an issue with [feature] and are working on a fix. Should be resolved within [time]."
3. **Ship the fix fast.** Have your development environment ready for quick deployments on launch day.
4. **Follow up.** When fixed, post: "Fixed! [Feature] is working properly now. Thanks to [person who reported it]."

### If Nothing Happens (Low Traction)

1. **This is normal.** Most launches don't go viral. A quiet launch is not a failure.
2. **Focus on what IS working.** Even 10 signups on day 1 is 10 real people interested in your product.
3. **Don't stop.** Keep posting, keep engaging, keep sharing. Some launches pick up momentum on day 2 or 3.
4. **Analyze why.** Was the timing bad? Was the messaging unclear? Was the audience too small? Learn and iterate.
5. **Remember:** Launch day is one day. The real work is the months of marketing that follow.

---

## Real-Time Metrics Dashboard

Set up this dashboard before launch day. Check every 1-2 hours.

### Metrics to Track

| Metric | Tool | Goal for Day 1 |
|--------|------|----------------|
| **Website traffic** | Google Analytics / Plausible / PostHog | {{TRAFFIC_GOAL}} unique visitors |
| **Traffic sources** | Analytics (UTM tags) | Know which channels drive the most visitors |
| **Signups / registrations** | Your product database | {{SIGNUP_GOAL}} signups |
| **Conversion rate** | Visitors → Signups | 5-15% (varies by product type) |
| **Product Hunt upvotes** | Product Hunt | Top 10 for the day (varies) |
| **Product Hunt rank** | Product Hunt | Track position throughout the day |
| **Social media engagement** | Platform analytics | Likes, retweets, comments, shares |
| **Email open rate** | Email tool | 40-60% (higher than normal due to launch interest) |
| **Email click rate** | Email tool | 10-20% |
| **Errors/bugs** | Sentry / error monitoring | Zero critical, minimal warnings |
| **Server performance** | Hosting dashboard | Response time under 500ms |
| **Revenue (if applicable)** | Stripe / payment provider | {{REVENUE_GOAL}} day 1 revenue |

### Quick Dashboard Setup

If you don't have a custom dashboard, use this simple approach:

1. **Open tabs:** Analytics, Product Hunt, Twitter/X notifications, email tool dashboard, error monitoring, payment dashboard.
2. **Create a simple spreadsheet** with rows for each hour and columns for key metrics.
3. **Update hourly.** Fill in numbers every hour. You'll see trends and can adjust your strategy in real-time.

---

## Post-Launch Same-Day Debrief

At the end of launch day (or the morning after), run through this debrief template.

### Launch Day Results

```
DATE: {{LAUNCH_DATE}}

METRICS:
- Total website visitors: ___
- Total signups: ___
- Conversion rate: ___
- Product Hunt final rank: ___
- Product Hunt upvotes: ___
- Social media reach: ___
- Email open rate: ___
- Revenue: ___

TOP TRAFFIC SOURCES:
1. ___
2. ___
3. ___

WHAT WORKED:
- ___
- ___
- ___

WHAT DIDN'T WORK:
- ___
- ___
- ___

SURPRISES:
- ___
- ___

MOST VALUABLE FEEDBACK RECEIVED:
- ___
- ___
- ___

CRITICAL BUGS/ISSUES:
- ___
- ___

TOP SUPPORTERS TO THANK:
- ___
- ___
- ___

IMMEDIATE ACTION ITEMS (NEXT 48 HOURS):
- [ ] ___
- [ ] ___
- [ ] ___

CONTENT TO CREATE FROM LAUNCH DAY:
- [ ] Launch retrospective blog post
- [ ] "Results" thread on Twitter
- [ ] Thank-you email to supporters
- [ ] Updated landing page with social proof from launch day
```

### Questions to Answer

1. **Which channel drove the most signups?** Double down on that channel in the coming weeks.
2. **What was the most common question or confusion?** Update your landing page and onboarding to address it.
3. **What feedback should change your roadmap?** Identify patterns, not one-off requests.
4. **Who were your biggest champions?** These people are your core community. Nurture these relationships.
5. **Did launch day meet your expectations?** Be honest. If not, why? What would you do differently?

---

## Launch Day Supply Checklist

Don't forget the physical prep:

- [ ] Full phone charge (you'll be on it all day)
- [ ] Laptop charger plugged in
- [ ] Water bottle filled
- [ ] Snacks and meals prepared (you won't want to cook)
- [ ] Coffee/tea ready
- [ ] Comfortable chair (you'll be sitting for 12+ hours)
- [ ] Second monitor if available (one for metrics, one for engagement)
- [ ] Notepad for quick notes and ideas throughout the day
- [ ] Headphones (if in a shared space)

---

*This template is part of the Master Starter Kit marketing section. Replace all `{{PLACEHOLDER}}` values with details specific to {{PROJECT_NAME}}. Adjust all times to your target audience's timezone.*
