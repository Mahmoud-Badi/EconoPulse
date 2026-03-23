# Virtual Events Playbook for {{PROJECT_NAME}}

> Plan and execute online workshops, AMAs, product launch events, office hours, and hackathons that engage your audience and drive growth for {{PROJECT_NAME}}.

---

## Table of Contents

1. [Virtual Event Types](#virtual-event-types)
2. [Event Planning Template](#event-planning-template)
3. [Promotion Strategy](#promotion-strategy)
4. [Engagement During the Event](#engagement-during-the-event)
5. [Follow-Up and Repurposing](#follow-up-and-repurposing)
6. [Measuring Success](#measuring-success)
7. [Platform Selection](#platform-selection)
8. [Complete Virtual Event Plan](#complete-virtual-event-plan)

---

## Virtual Event Types

### Product Launch Event

A focused event to announce and demonstrate something new about {{PROJECT_NAME}}.

**Format:** Presentation + live demo + Q&A
**Duration:** 30-60 minutes
**Audience:** Existing users, prospects, press, community members
**Cadence:** As needed (major releases, milestones)

**Structure:**
| Time | Segment | Notes |
|---|---|---|
| 0:00-0:05 | Welcome and excitement building | Set the stage, build anticipation |
| 0:05-0:15 | The "why" — problem being solved | Context for the announcement |
| 0:15-0:30 | The reveal — what's new | Announcement, demo, screenshots/video |
| 0:30-0:45 | Live demo | Show the new feature/product in action |
| 0:45-0:55 | Q&A | Answer audience questions |
| 0:55-1:00 | What's next and CTA | Roadmap preview, how to get started |

**Tips:**
- Build anticipation with a teaser campaign before the event.
- Show the product being used for real tasks, not scripted demos.
- Have a backup plan if the live demo fails (screenshots, pre-recorded video).
- Make the announcement available in writing immediately after the event.
- Create a "launch page" that attendees can share.

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS launch event additions:**
- Show before/after workflows with the new feature.
- Include a customer beta tester sharing their experience.
- Announce availability, pricing changes, and migration path.
- Offer early-adopter pricing or exclusive access window.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
**Mobile app launch event additions:**
- Show the app running on actual devices (screen share from phone).
- Walk through the app store listing and what's new.
- Demonstrate the onboarding flow for new users.
- Share download links and promo codes live.
<!-- ENDIF -->

### Workshop

A hands-on teaching session where attendees learn by doing.

**Format:** Instruction + guided practice + Q&A
**Duration:** 60-120 minutes
**Audience:** Prospective and existing users who want to learn
**Cadence:** Monthly or bi-monthly

**Structure:**
| Time | Segment | Notes |
|---|---|---|
| 0:00-0:05 | Welcome and setup check | Ensure everyone has access to materials |
| 0:05-0:15 | Context and overview | What we'll build/learn today |
| 0:15-0:45 | Guided instruction block 1 | Teach + attendees follow along |
| 0:45-0:50 | Check-in and Q&A | Address questions before moving on |
| 0:50-1:15 | Guided instruction block 2 | Continue building / learning |
| 1:15-1:25 | Show and tell | Attendees share what they built |
| 1:25-1:30 | Wrap-up and next steps | Resources, CTA, upcoming workshops |

**Tips:**
- Send setup instructions before the workshop (prerequisites, accounts, tools).
- Have a co-facilitator to monitor chat and help with technical issues.
- Provide a finished example that attendees can reference if they fall behind.
- Record the workshop for those who cannot attend live.
- Keep the pace manageable — better to cover less thoroughly than more superficially.

**Workshop topic ideas for {{PROJECT_NAME}}:**
1. "Getting started with {{PROJECT_NAME}}: Zero to {{FIRST_MILESTONE}} in 60 minutes"
2. "Advanced {{FEATURE}}: Tips and workflows for power users"
3. "{{USE_CASE}} masterclass: Solving {{PROBLEM}} step by step"
4. "Integrations workshop: Connecting {{PROJECT_NAME}} with {{POPULAR_TOOL}}"
5. "{{INDUSTRY}} workflow: Using {{PROJECT_NAME}} for {{SPECIFIC_OUTCOME}}"

### AMA (Ask Me Anything)

An open Q&A session with the founder or team.

**Format:** Open questions from audience, answered live
**Duration:** 30-60 minutes
**Audience:** Community members, users, prospective users
**Cadence:** Monthly or quarterly

**Structure:**
| Time | Segment | Notes |
|---|---|---|
| 0:00-0:05 | Welcome and format explanation | How to submit questions |
| 0:05-0:10 | Quick update | What's new at {{PROJECT_NAME}} since last AMA |
| 0:10-0:50 | Q&A | Answer questions from the audience |
| 0:50-0:55 | Roadmap preview | What's coming next |
| 0:55-1:00 | Close | Thank everyone, announce next AMA |

**Tips:**
- Collect questions in advance (form, community post, or email) to seed the conversation.
- Be honest and transparent — AMAs build trust when you are genuine.
- Say "I don't know" when you don't know. Promise to follow up.
- Have 5-10 pre-submitted questions as backup if live questions are slow.
- Record and publish answers as a FAQ or blog post.

### Office Hours

Recurring, casual sessions for questions, feedback, and support.

**Format:** Open-door drop-in, bring your questions
**Duration:** 30-60 minutes
**Audience:** Existing users, trial users
**Cadence:** Weekly or bi-weekly

**Structure:**
- No formal agenda — attendees bring their questions.
- Host provides quick answers, demos, or troubleshooting live.
- Can cover feature requests, use cases, best practices, and bugs.

**Tips:**
- Set a consistent recurring time (e.g., every Thursday at 2 PM {{TIMEZONE}}).
- Lower commitment than webinars — no registration required, just join.
- Use the platform your community already uses (Zoom, Discord, Google Meet).
- Summarize common questions and publish as documentation or FAQ updates.
- Even if only 2-3 people show up, the conversations are high-value.

### Hackathon

A build-with-your-tool event where participants create projects and showcase results.

**Format:** Build period + presentations + judging + prizes
**Duration:** 1 day to 1 week (virtual hackathons can be longer)
**Audience:** Developers, power users, API consumers
**Cadence:** Quarterly or bi-annually

**Structure:**
| Phase | Duration | Activity |
|---|---|---|
| Kickoff | 1 hour | Announce theme, rules, prizes, resources |
| Build period | 1-7 days | Participants build projects using {{PROJECT_NAME}} |
| Midpoint check-in | 30 min | Optional check-in for questions and progress |
| Submission | — | Participants submit projects by deadline |
| Showcase | 2-3 hours | Participants present their projects (3-5 min each) |
| Judging | 30 min | Panel evaluates submissions |
| Awards | 15 min | Announce winners and prizes |

**Tips:**
- Provide clear documentation, starter templates, and example projects.
- Offer prizes that matter: cash, premium subscriptions, swag, feature showcases.
- Have mentors available during the build period for technical questions.
- Showcase projects publicly (blog post, social media, website gallery).
- Hackathon projects become testimonials, case studies, and content.

<!-- IF {{PRODUCT_TYPE}} == "api" -->
**API/Developer tool hackathon specifics:**
- Provide sandbox environments and test API keys.
- Offer starter code repositories and boilerplate projects.
- Judge on creativity, technical implementation, and practical value.
- Feature winning projects in your documentation or showcase page.
<!-- ENDIF -->

---

## Event Planning Template

### Pre-Event Checklist

**8 weeks before:**
- [ ] Define event goal: {{EVENT_GOAL}}
- [ ] Choose event type: {{EVENT_TYPE}}
- [ ] Select date and time: {{EVENT_DATE}} at {{EVENT_TIME}} {{TIMEZONE}}
- [ ] Choose platform: {{EVENT_PLATFORM}}
- [ ] Identify speaker(s): {{SPEAKERS}}
- [ ] Draft event description and promotion copy

**6 weeks before:**
- [ ] Create registration page / event listing
- [ ] Set up email sequences (confirmation, reminders)
- [ ] Create promotional graphics and assets
- [ ] Brief any co-hosts or moderators

**4 weeks before:**
- [ ] Begin promotion (email, social, communities)
- [ ] Reach out to partners for cross-promotion
- [ ] Create event-specific content (teasers, countdown posts)

**2 weeks before:**
- [ ] Send reminder to registered attendees
- [ ] Prepare presentation materials (slides, demos, resources)
- [ ] Test technical setup (platform, audio, video, screen sharing)
- [ ] Prepare engagement elements (polls, Q&A prompts, handouts)

**1 week before:**
- [ ] Final reminder email
- [ ] Dry run of the full event (tech check + content run-through)
- [ ] Prepare backup plan (pre-recorded segments, backup platform)

**Day of:**
- [ ] Send 1-hour reminder email
- [ ] Set up event room 30 minutes early
- [ ] Test all technology one final time
- [ ] Have water, notes, and backup materials ready
- [ ] Confirm moderator/co-host is online

### Run of Show Template

```
EVENT: {{EVENT_TITLE}}
DATE: {{EVENT_DATE}} at {{EVENT_TIME}} {{TIMEZONE}}
DURATION: {{DURATION}} minutes
PLATFORM: {{EVENT_PLATFORM}}
HOST: {{HOST_NAME}}
MODERATOR: {{MODERATOR_NAME}}

MINUTE-BY-MINUTE:

{{TIME_START}} — Host joins, opens room, tests audio/video
{{TIME_START + 5}} — Attendees begin joining, welcome music/slide
{{TIME_START + 10}} — Official start, welcome, housekeeping
  - "Welcome to {{EVENT_TITLE}}"
  - Explain format and ground rules
  - How to ask questions (chat / Q&A panel / raise hand)
{{TIME_START + 15}} — Main content begins
  [SECTION 1: {{SECTION_1_TOPIC}}]
  - Key points: {{KEY_POINTS}}
  - Duration: {{DURATION}} minutes
{{TIME_START + 30}} — Engagement break
  - Poll question: "{{POLL_QUESTION}}"
  - Address chat questions
{{TIME_START + 35}} — Main content continues
  [SECTION 2: {{SECTION_2_TOPIC}}]
  - Key points: {{KEY_POINTS}}
  - Duration: {{DURATION}} minutes
{{TIME_START + 50}} — Q&A
  - Open floor for questions
  - Moderator curates from chat
{{TIME_START + 55}} — Wrap-up
  - Recap key takeaways
  - Share resources and links
  - CTA: {{CTA_DESCRIPTION}}
  - Announce next event
{{TIME_START + 60}} — Event ends
```

### Technical Setup Checklist

| Component | Primary | Backup |
|---|---|---|
| Streaming platform | {{PRIMARY_PLATFORM}} | {{BACKUP_PLATFORM}} |
| Microphone | {{PRIMARY_MIC}} | Wired earbuds |
| Camera | Webcam / laptop camera | Phone with tripod |
| Internet | WiFi / Ethernet | Phone hotspot |
| Slides | Local file | Google Slides (cloud backup) |
| Screen sharing | Platform built-in | Alternative (OBS if needed) |
| Recording | Platform recording | Local recording (OBS / QuickTime) |
| Chat moderation | Moderator on {{PLATFORM}} | Backup moderator |

---

## Promotion Strategy

### Promotion Timeline

| Timing | Channel | Action | Goal |
|---|---|---|---|
| 4 weeks before | Email | Announcement to full list | Initial registrations |
| 4 weeks before | Social | Announcement posts | Awareness |
| 3 weeks before | Communities | Share in {{COMMUNITY_PLATFORMS}} | Community registrations |
| 3 weeks before | Partners | Cross-promotion ask | Extended reach |
| 2 weeks before | Email | Reminder with new angle/speaker spotlight | Second wave registrations |
| 2 weeks before | Social | Speaker/topic teaser content | Engagement |
| 1 week before | Email | "Last chance" / "Almost full" | Urgency registrations |
| 1 week before | Social | Daily countdown posts | Momentum |
| 3 days before | Email | "3 days away" with agenda preview | Reduce no-shows |
| 1 day before | Email | Final reminder with join link | Reduce no-shows |
| 1 hour before | Email | "Starting soon" with direct link | Maximize attendance |
| Live | Social | "We're live! Join now: {{LINK}}" | Last-minute attendees |

### Email Promotion Sequence

**Email 1: Announcement**
```
Subject: [Free event] {{EVENT_TITLE}} on {{EVENT_DATE}}

Hi {{FIRST_NAME}},

I'm hosting a {{EVENT_TYPE}} on {{EVENT_DATE}} at {{EVENT_TIME}} {{TIMEZONE}}:

"{{EVENT_TITLE}}"

In this session, you'll learn:
→ {{LEARNING_POINT_1}}
→ {{LEARNING_POINT_2}}
→ {{LEARNING_POINT_3}}

It's free and limited to {{CAPACITY}} spots.

[REGISTER NOW]

Can't make it live? Register anyway — I'll send you the replay.

{{FOUNDER_NAME}}
```

**Email 2: Reminder (2 weeks before)**
```
Subject: Have you registered? {{EVENT_TITLE}} is in 2 weeks

Hi {{FIRST_NAME}},

Just a reminder about our upcoming {{EVENT_TYPE}}:

"{{EVENT_TITLE}}"
{{EVENT_DATE}} at {{EVENT_TIME}} {{TIMEZONE}}

{{SOCIAL_PROOF — "Over {{NUMBER}} people have already registered"}}

Here's a sneak peek of what we'll cover:
{{PREVIEW_CONTENT}}

[SAVE YOUR SPOT]

{{FOUNDER_NAME}}
```

**Email 3: Last chance (1 week before)**
```
Subject: Last chance: {{EVENT_TITLE}} — {{EVENT_DATE}}

Hi {{FIRST_NAME}},

Our {{EVENT_TYPE}} "{{EVENT_TITLE}}" is next week.

{{URGENCY_ELEMENT — "Spots are filling up" / "Registration closes
{{DEADLINE}}"}}

[REGISTER FREE — LAST CHANCE]

{{FOUNDER_NAME}}
```

### Social Media Promotion

**Announcement post:**
```
Hosting a free {{EVENT_TYPE}} on {{EVENT_DATE}}:

"{{EVENT_TITLE}}"

What you'll learn:
→ {{POINT_1}}
→ {{POINT_2}}
→ {{POINT_3}}

Register free: {{REGISTRATION_URL}}
```

**Countdown posts (daily, 7 days before):**
- Day 7: Topic teaser with one key insight
- Day 6: Speaker spotlight with bio and photo
- Day 5: Behind-the-scenes preparation
- Day 4: Attendee testimonial from previous event
- Day 3: Agenda preview
- Day 2: "Tomorrow!" with registration link
- Day 1: "Today! Join us in X hours" with direct link

**Community promotion:**
- Share in {{COMMUNITY_PLATFORMS}} where your audience gathers.
- Frame as genuine value, not just an ad: "I'm teaching {{TOPIC}} in a live session next week — free to join."
- Engage with comments and questions about the event.
- Follow each community's self-promotion rules.

---

## Engagement During the Event

### Interactive Elements

**Polls:**
- Open with a poll to get attendees participating immediately.
  - "How experienced are you with {{TOPIC}}?" (Beginner / Intermediate / Advanced)
  - "What's your biggest challenge with {{TOPIC}}?" (Option A / B / C / D)
- Mid-session poll to check understanding or gather opinions.
- Closing poll: "What was most valuable today?" or "What should we cover next?"

**Q&A:**
- Use the platform's built-in Q&A feature (not just chat).
- Encourage upvoting of questions so the best ones rise to the top.
- Dedicate specific time for Q&A (don't try to answer everything on the fly).
- Have a moderator organize and filter questions.

**Chat:**
- Actively prompt chat engagement: "Drop your city in the chat!" "Type YES if you've experienced this."
- Acknowledge chat messages by name: "Great point, {{NAME}}!"
- Use chat for quick pulse checks: "Does this make sense? Thumbs up in chat."

**Breakout Rooms (for workshops):**
- Small group discussions (3-5 people).
- Give clear instructions and a specific prompt.
- Set a timer and bring everyone back.
- Have each group share a key insight with the full group.

**Live Demos:**
- Show real usage, not scripted walkthroughs.
- Narrate what you're doing as you do it.
- Have a backup (pre-recorded demo) in case of technical issues.
- Invite an attendee to try it live (high engagement but risky — have a backup).

### Moderation Best Practices

Assign a dedicated moderator (not the presenter) to:

- Welcome attendees as they join.
- Monitor chat for questions, technical issues, and off-topic messages.
- Curate Q&A questions and pass the best ones to the presenter.
- Handle any disruptive attendees (mute, remove if necessary).
- Post links, resources, and time stamps in chat as relevant.
- Keep the energy up with encouraging messages.

### Recording

- **Always record every virtual event.** No exceptions.
- Inform attendees that the session is being recorded.
- Use the platform's built-in recording AND a local backup.
- Record the full screen (slides + speaker video + chat highlights).
- Start recording before attendees join and stop after the last word.

---

## Follow-Up and Repurposing

### Post-Event Email (within 24 hours)

**To attendees:**
```
Subject: Replay + resources from {{EVENT_TITLE}}

Hi {{FIRST_NAME}},

Thanks for joining {{EVENT_TITLE}} today!

Here's everything from the session:
📹 Replay: {{REPLAY_LINK}}
📄 Slides: {{SLIDES_LINK}}
📋 Resources: {{RESOURCES_LINK}}

{{CTA_DESCRIPTION}}:
{{CTA_LINK}}

What should we cover next? Reply and let me know!

{{FOUNDER_NAME}}
```

**To no-shows:**
```
Subject: You missed {{EVENT_TITLE}} — here's the replay

Hi {{FIRST_NAME}},

Sorry you couldn't make it to {{EVENT_TITLE}} — here's the
full replay so you don't miss out:

📹 Watch now: {{REPLAY_LINK}}

Key highlights:
→ [{{TIMESTAMP_1}}] {{HIGHLIGHT_1}}
→ [{{TIMESTAMP_2}}] {{HIGHLIGHT_2}}
→ [{{TIMESTAMP_3}}] {{HIGHLIGHT_3}}

{{CTA_DESCRIPTION}}: {{CTA_LINK}}

{{FOUNDER_NAME}}
```

### Social Recap

Within 48 hours, post a recap across your social channels:

- Key takeaways thread (Twitter/X).
- Highlight reel or quote graphics (Instagram, LinkedIn).
- Full recap post with learnings (LinkedIn, blog).
- Thank attendees and tag engaged participants.
- Share any interesting audience questions and your answers.

### Content Repurposing Pipeline

```
VIRTUAL EVENT RECORDING
├── Full replay → YouTube (unlisted or public)
├── 3-5 short clips (60-90 sec) → Social media (Reels, Shorts, TikTok)
├── Blog post → Written summary of key points
├── Email series → 3 emails expanding on core topics
├── Quote graphics → Social media
├── FAQ document → From Q&A questions asked
├── Podcast episode → Audio-only version
├── Documentation updates → Insights from workshop or office hours
└── Testimonials → Attendee reactions and feedback
```

---

## Measuring Success

### Key Metrics by Event Type

| Metric | Product Launch | Workshop | AMA | Office Hours | Hackathon |
|---|---|---|---|---|---|
| Registrations | 200+ | 50-100 | 50+ | 10-30 | 20-50 |
| Show-up rate | 40-50% | 50-60% | 40-50% | Varies | 60-80% |
| Engagement (chat/Q&A) | 20-30% | 40-60% | 60-80% | 80-100% | 80-100% |
| Post-event conversion | 10-15% | 5-10% | 3-5% | Ongoing | 20-30% |
| NPS / satisfaction | 8+ | 8+ | 7+ | 7+ | 8+ |

### Post-Event Analysis

After every event, answer these questions:

1. **Attendance:** How many registered vs attended? What was the show-up rate?
2. **Engagement:** How active was the chat/Q&A? What questions came up most?
3. **Content:** Which sections generated the most engagement? Where did people drop off?
4. **Technical:** Were there any issues with audio, video, or platform?
5. **Conversion:** How many attendees took the desired action (signup, trial, purchase)?
6. **Feedback:** What did attendees say in surveys, chat, or follow-up emails?
7. **Improvement:** What would you do differently next time?

---

## Platform Selection

| Platform | Best For | Price | Key Features |
|---|---|---|---|
| Zoom | All event types, reliability | Free (40 min) / $13.33/mo | Breakout rooms, polls, recording |
| Google Meet | Budget option, simple events | Free (60 min) / Google Workspace | Simple, reliable, no install needed |
| StreamYard | Multi-platform streaming | $20/mo+ | Stream to YouTube/LinkedIn/Facebook |
| Luma | Modern event pages, community | Free | Beautiful event pages, social features |
| Crowdcast | Webinars, series events | $34/mo+ | Built-in registration, Q&A, analytics |
| Discord Stage | Community events, AMAs | Free | Already where communities are |
| Twitter Spaces | Casual audio conversations | Free | Built-in audience, easy to join |
| Hopin | Large virtual events | Custom pricing | Multi-stage, expo halls, networking |
| Riverside | High-quality recordings | $15/mo+ | Local recording, great audio quality |

### Platform Selection Criteria

- **Audience size:** Free tools work for under 100; paid tools needed for larger events.
- **Event type:** Workshops need breakout rooms; AMAs need Q&A; launches need reliability.
- **Recording:** Ensure the platform records or have a local backup plan.
- **Accessibility:** Can attendees join without installing software?
- **Branding:** Can you customize the experience with {{PROJECT_NAME}} branding?

---

## Complete Virtual Event Plan

### Event Plan for {{PROJECT_NAME}}

**Event Title:** {{EVENT_TITLE}}
**Event Type:** {{EVENT_TYPE}} (Product Launch / Workshop / AMA / Office Hours / Hackathon)
**Goal:** {{EVENT_GOAL}}
**Target Attendance:** {{TARGET_ATTENDANCE}}
**Date:** {{EVENT_DATE}} at {{EVENT_TIME}} {{TIMEZONE}}
**Duration:** {{DURATION}} minutes
**Platform:** {{EVENT_PLATFORM}}
**Host:** {{HOST_NAME}}
**Moderator:** {{MODERATOR_NAME}}

**Promotion Calendar:**

| Date | Action | Owner | Status |
|---|---|---|---|
| {{DATE_MINUS_28}} | Create event page and registration | {{OWNER}} | [ ] |
| {{DATE_MINUS_21}} | Send announcement email | {{OWNER}} | [ ] |
| {{DATE_MINUS_21}} | Social media announcement | {{OWNER}} | [ ] |
| {{DATE_MINUS_14}} | Community posts | {{OWNER}} | [ ] |
| {{DATE_MINUS_14}} | Partner cross-promotion | {{OWNER}} | [ ] |
| {{DATE_MINUS_7}} | Reminder email | {{OWNER}} | [ ] |
| {{DATE_MINUS_3}} | "Almost here" email | {{OWNER}} | [ ] |
| {{DATE_MINUS_1}} | Final reminder email | {{OWNER}} | [ ] |
| {{EVENT_DATE}} | 1-hour reminder email | {{OWNER}} | [ ] |
| {{EVENT_DATE}} | Go live! | {{OWNER}} | [ ] |
| {{DATE_PLUS_1}} | Follow-up email with replay | {{OWNER}} | [ ] |
| {{DATE_PLUS_2}} | Social recap and highlights | {{OWNER}} | [ ] |
| {{DATE_PLUS_7}} | Repurposed content published | {{OWNER}} | [ ] |

**Post-Event Content Plan:**
- [ ] Upload replay to YouTube
- [ ] Create 3-5 short clips for social media
- [ ] Write blog post recap
- [ ] Send follow-up email series (3 emails)
- [ ] Update FAQ/documentation based on questions asked
- [ ] Create quote graphics from attendee feedback
- [ ] Schedule next event based on feedback

---

*This virtual events playbook is part of the {{PROJECT_NAME}} Marketing Starter Kit. Start with low-commitment formats (office hours, AMAs) to build your event muscles, then scale to workshops and launch events as you grow.*
