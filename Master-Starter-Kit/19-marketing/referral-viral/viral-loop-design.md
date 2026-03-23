# Viral Loop Design for {{PROJECT_NAME}}

> Design built-in virality mechanics so your product grows itself.
> Product Type: {{PRODUCT_TYPE}} | Target Audience: {{TARGET_AUDIENCE}}

---

## Table of Contents

1. [What Makes Products Viral](#what-makes-products-viral)
2. [Viral Loop Types](#viral-loop-types)
3. [K-Factor Calculation](#k-factor-calculation)
4. [Designing Viral Loops by Product Type](#designing-viral-loops-by-product-type)
5. [Reducing Friction in the Viral Loop](#reducing-friction-in-the-viral-loop)
6. [Viral Content Mechanics](#viral-content-mechanics)
7. [Network Effects vs Virality](#network-effects-vs-virality)
8. [Measuring Virality](#measuring-virality)
9. [Case Studies](#case-studies)
10. [Viral Loop Design for {{PROJECT_NAME}}](#viral-loop-design-for-project_name)

---

## What Makes Products Viral

A viral product is one where the act of using it naturally exposes new people to it and motivates them to start using it too. Virality is not an accident -- it is designed into the product.

### The Four Drivers of Natural Virality

**1. Network Effects**
The product becomes more valuable as more people use it. Each new user makes the product better for all existing users.
- Example: Slack is useless alone but indispensable for a team. Every team member added makes it more valuable.
- Applies to: Communication tools, collaboration platforms, marketplaces, social networks.

**2. Social Sharing**
Using the product creates visible artifacts that others see on external platforms.
- Example: Spotify Wrapped creates shareable year-in-review graphics that flood social media every December.
- Applies to: Products that generate personal data, creative output, or achievements.

**3. Collaboration Features**
The product requires or benefits from inviting others to participate.
- Example: Google Docs requires sharing to collaborate. Every shared document exposes new people to Google Docs.
- Applies to: Productivity tools, project management, design tools, document editors.

**4. Visibility**
Using the product is inherently visible to others.
- Example: Zoom meeting links expose everyone on the call to the Zoom brand. Calendly links show the product to every scheduling recipient.
- Applies to: Products used in interpersonal interactions, communication tools, scheduling tools.

---

## Viral Loop Types

### Organic Viral Loops

The product is naturally more valuable with more users. No incentive needed -- the product itself drives sharing.

```
Loop: User A uses product → Invites User B to collaborate →
User B joins to use the product → User B invites User C → ...
```

**Characteristics:**
- Highest quality growth (users join because they need the product)
- Hardest to engineer (requires product to be inherently social/collaborative)
- Most sustainable (does not depend on incentives that can run out)
- Strongest retention (users stay because of network value)

**Examples:**
- Slack: Team messaging requires teammates
- Zoom: Video calls require other participants
- Figma: Design collaboration requires team access
- Notion: Shared workspaces require team members

### Incentivized Viral Loops

Users receive rewards for inviting others.

```
Loop: User A gets reward offer → Shares referral link →
User B signs up (both get reward) → User B shares referral link → ...
```

**Characteristics:**
- Easier to implement (add referral program to any product)
- Lower quality growth (some users join only for the incentive)
- Controllable (you can adjust incentive, pause program, target segments)
- Requires ongoing investment (each referral has a cost)

**Examples:**
- Dropbox: Extra storage for referrals
- Uber: Ride credits for both parties
- Robinhood: Free stock for referrals

### Social Viral Loops

Product usage creates shareable content that appears on external platforms.

```
Loop: User A uses product → Product generates shareable content →
User A shares on social media → User B sees content, clicks through →
User B tries product → User B creates shareable content → ...
```

**Characteristics:**
- High reach (content appears on platforms with billions of users)
- Variable quality (depends on content appeal and platform algorithm)
- Platform-dependent (changes in social media algorithms can kill virality)
- Creative-dependent (requires product to output visually/emotionally appealing content)

**Examples:**
- Spotify Wrapped: Annual listening stats shared by millions
- GitHub Contributions: Green squares as a developer status symbol
- Strava: Running/cycling activity visible to social connections
- Wordle: Daily word puzzle results shared as emoji grids

### Collaborative Viral Loops

Inviting others is core to using the product effectively.

```
Loop: User A creates shared workspace → Invites team members →
Team members experience product → Team members create their own
workspaces → Invite their contacts → ...
```

**Characteristics:**
- Organic feel (invitations are functional, not promotional)
- High conversion (invitees have a clear reason to join)
- Department-to-department spread (one team adopts, adjacent teams see it)
- Self-reinforcing (more collaborators = more value = more invitations)

**Examples:**
- Google Docs: Share a doc, collaborator joins Google ecosystem
- Notion: Share a workspace, team member creates a Notion account
- Miro: Share a board, collaborator needs a Miro account
- Airtable: Share a base, team members start using Airtable

---

## K-Factor Calculation

The K-factor measures how effectively each user generates new users.

### Formula

```
K = i x c

Where:
  i = average number of invitations sent per user
  c = conversion rate of each invitation (% that result in a new active user)
```

### Interpreting K-Factor

| K-Factor | Meaning | Growth Pattern |
|----------|---------|---------------|
| **K > 1** | Truly viral -- exponential growth | Each user brings more than one new user. Extremely rare. |
| **K = 0.5 - 1.0** | Amplified growth | Good. Each user brings 0.5-1.0 new users. Growth accelerates with other channels. |
| **K = 0.2 - 0.5** | Moderate amplification | Decent. Referrals supplement other acquisition channels. |
| **K < 0.2** | Minimal viral effect | Referrals contribute but are not a meaningful growth driver. |

### K-Factor Examples

```
Scenario A: Great referral program
  i = 3 invitations per user (average)
  c = 20% conversion rate
  K = 3 x 0.20 = 0.60 (amplified growth -- good!)

Scenario B: Weak referral program
  i = 1 invitation per user
  c = 10% conversion rate
  K = 1 x 0.10 = 0.10 (minimal effect -- needs improvement)

Scenario C: Truly viral product
  i = 5 invitations per user
  c = 25% conversion rate
  K = 5 x 0.25 = 1.25 (exponential growth -- extremely rare)
```

### How to Improve K-Factor

**Increase invitations (i):**
- Make sharing easier (one-click share, pre-written messages)
- Create more reasons to share (multiple shareable moments)
- Prompt sharing at peak satisfaction moments
- Offer tiered rewards (more referrals = better rewards)

**Increase conversion (c):**
- Optimize the referral landing page
- Personalize the invitation ("{{REFERRER_NAME}} invited you")
- Offer an incentive to the invited person
- Reduce signup friction (social login, short forms)
- Make the product value immediately clear

---

## Designing Viral Loops by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS Viral Loop Strategies

**Team Invites:**
The most natural viral loop for SaaS. Users need teammates to collaborate.
- Add "Invite team members" prominently during onboarding
- Make key features dependent on team participation
- Auto-suggest inviting contacts when creating shared resources
- Show empty states that encourage inviting: "This project is empty. Invite your team to start collaborating."

**Shared Workspaces:**
When users create shared workspaces or projects, external collaborators join and become users.
- Allow sharing with non-users via email
- Non-users see the product when they access shared content
- Prompt non-users to create their own account to unlock full features
- Example: "You've been invited to view this project. Create a free account to edit and create your own."

**Public Profiles:**
Give users a reason to create public-facing pages that showcase their work.
- Portfolio pages, project showcases, public dashboards
- Each public page is branded with "Made with {{PROJECT_NAME}}"
- Visitors click through to learn about the product

**Embeddable Widgets:**
Create components users can embed on their own websites.
- Charts, forms, badges, status pages
- Each embed includes a small "Powered by {{PROJECT_NAME}}" link
- Visitors see the widget, click through, and discover the product
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
### Mobile App Viral Loop Strategies

**Share Results:**
App generates results or outcomes that users want to share.
- Fitness: "I ran 5K today!" with app branding
- Learning: "I just completed a 30-day streak!"
- Productivity: "I completed 50 tasks this week"
- Each shared result links back to the app

**Invite to Play/Participate:**
Multi-player or collaborative features require friends.
- Challenges between friends
- Shared goals or groups
- Leaderboards (friends want to compete)

**Social Features:**
In-app social graph drives invitations.
- Find friends who use the app
- Activity feeds showing what friends are doing
- Comments and reactions on friend activity
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
### Developer Tool Viral Loop Strategies

**"Built with" Badges:**
Users display a badge on their projects indicating they use your tool.
- GitHub badges in README files: "Built with {{PROJECT_NAME}}"
- Footer badges on websites: "Powered by {{PROJECT_NAME}}"
- Each badge links to your product

**Shared Configurations:**
Developers share configurations, templates, or presets that reference your tool.
- Shareable config files that require your tool to use
- Template libraries that showcase your tool's capabilities
- Community-shared recipes, plugins, or extensions

**Open Source Components:**
Release parts of your product as open source, creating awareness.
- OSS libraries that funnel users to the paid product
- Community contributions that expand your reach
- GitHub stars and forks as social proof

**Developer Content:**
Your tool generates technical content developers share.
- API documentation, code snippets, integration guides
- Each piece of content references and links to your product
- Developers share solutions that involve your tool
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
### Marketplace Viral Loop Strategies

**Seller Invites Buyer (and Vice Versa):**
Each side of the marketplace naturally recruits the other.
- Sellers share their listings to attract buyers
- Buyers refer other buyers who might want similar products
- Every listing URL is a potential viral touchpoint

**Cross-Network Sharing:**
Marketplace listings shared to social platforms drive traffic.
- One-click sharing of listings to social media
- "Share this deal" functionality
- Seller social proof visible to their networks

**Reviews and Social Proof:**
User-generated reviews create content that attracts new users.
- Review content is SEO-friendly (organic growth)
- Users share their purchases/reviews on social media
- "I bought this on {{PROJECT_NAME}}" moments
<!-- ENDIF -->

---

## Reducing Friction in the Viral Loop

Every step of friction in your viral loop reduces conversion. Ruthlessly eliminate barriers.

### Friction Points and Solutions

| Friction Point | Problem | Solution |
|----------------|---------|----------|
| **Sharing requires effort** | User has to compose a message | Pre-written, editable share messages |
| **Too many clicks to share** | 3+ steps to share a link | One-click copy link, one-click social share |
| **Recipient does not understand value** | Invitation message is unclear | Personalized, clear invitation explaining what and why |
| **Signup is too complex** | 5-field form, email verification, password rules | Social login, email-only signup, magic link |
| **Product value is not immediate** | New user signs up but does not see value quickly | Pre-populate with sample data, guided onboarding, immediate "wow" moment |
| **No mobile experience** | Share link leads to desktop-only product | Mobile-responsive landing page and signup |
| **Sharing feels spammy** | User is embarrassed to share because it feels like an ad | Frame sharing as helping, not promoting. "Your friend will thank you" |

### The Perfect Viral Loop Flow

```
Step 1: User experiences value in {{PROJECT_NAME}} (wow moment)
Step 2: Product suggests sharing at the right moment (non-intrusive prompt)
Step 3: User clicks ONE button to share (copy link / social share / email)
Step 4: Recipient sees personalized invitation with clear value proposition
Step 5: Recipient clicks link and arrives at optimized landing page
Step 6: Recipient signs up with minimal friction (social login or email only)
Step 7: New user experiences value within first 60 seconds
Step 8: Loop repeats
```

**Target: 30 seconds or less from "decide to share" to "friend sees invitation."**

---

## Viral Content Mechanics

Create shareable outputs from product usage that spread on external platforms.

### Shareable Content Types

**1. Reports and Summaries**
- Monthly/annual usage summaries (like Spotify Wrapped)
- Performance reports or progress recaps
- Data visualizations of user activity
- Template: "In [time period], you [achievement]. Here's your {{PROJECT_NAME}} summary."

**2. Certificates and Achievements**
- Completion certificates for courses, milestones, or challenges
- Shareable badges for achievements
- "Level up" notifications designed for social sharing
- Template: "[User] just earned the [badge name] badge on {{PROJECT_NAME}}!"

**3. Public Profiles and Portfolios**
- User profile pages with public URLs
- Portfolio showcases of work done in the product
- Leaderboards and rankings

**4. "Powered by" Attributions**
- Branded output from the product
- Footer links on generated content
- Watermarks on free-tier exports
- Template: "[Content] made with {{PROJECT_NAME}} -- try it free"

### Design for Sharing

- **Visual-first:** Shareable content must look great on social media (proper aspect ratios, readable text, brand colors)
- **One-click sharing:** Share button generates platform-specific content (Twitter card, Instagram story, LinkedIn post)
- **Customizable:** Let users personalize before sharing (change colors, add their name, select what to highlight)
- **Platform-optimized:** Different formats for different platforms (square for Instagram, landscape for Twitter, vertical for Stories)

---

## Network Effects vs Virality

Network effects and virality are different growth mechanisms that are often confused. Understanding the distinction helps you design for both.

### Key Differences

| Dimension | Network Effects | Virality |
|-----------|---------------|----------|
| **Definition** | Product value increases as more people use it | Product usage leads to new user acquisition |
| **Driver** | Value from usage | Awareness from usage |
| **User motivation** | "I need others on this platform" | "I want to share/invite others" |
| **Growth type** | Retention-driven (users stay longer) | Acquisition-driven (users bring others) |
| **Examples** | Telephone, Facebook, Uber marketplace | Hotmail, Dropbox referrals, TikTok content |
| **Sustainability** | Very high (creates moat) | Variable (can fade without reinforcement) |

### How They Work Together

```
Network Effects:  User A joins → Product becomes more valuable →
                  User A stays longer → User A invites User B to
                  increase network value → User B joins → Product
                  becomes more valuable for everyone

Virality:         User A joins → User A shares content/link →
                  User B sees it → User B joins → User B shares →
                  User C sees it → ...

Combined:         User A joins → Product becomes more valuable →
                  User A invites User B (virality) → User B joins →
                  Product becomes more valuable for A (network effect) →
                  User B invites User C → ...
```

The most powerful growth engines combine both: virality brings users in, network effects keep them and make the product worth sharing.

---

## Measuring Virality

### Core Metrics

| Metric | Formula | What It Tells You |
|--------|---------|-------------------|
| **K-factor** | Invitations per user x Conversion rate | Overall viral efficiency |
| **Cycle time** | Average time from user signup to their first referred signup | Speed of viral growth (shorter = faster growth) |
| **Amplification factor** | Total users / Users from non-viral sources | How much virality multiplies your other growth channels |
| **Organic share rate** | Users who share organically / Total users | How naturally shareable the product is |
| **Invitation acceptance rate** | Accepted invitations / Total invitations sent | Quality and relevance of invitations |
| **Viral reach** | Unique people exposed to product via sharing | Top-of-funnel viral awareness |

### Viral Growth Calculator

```
Starting users (from other channels):  {{STARTING_USERS}}
K-factor:                               {{K_FACTOR}}
Cycle time:                             {{CYCLE_TIME}} days
Time period:                            90 days
Number of cycles:                       90 / {{CYCLE_TIME}} = ___ cycles

Users after N cycles = Starting users x (1 + K + K^2 + K^3 + ... K^N)

Example with K=0.5, 10 cycles:
Cycle 0: 1000 users (starting)
Cycle 1: 1000 + 500 = 1500
Cycle 2: 1500 + 250 = 1750
Cycle 3: 1750 + 125 = 1875
...
After 10 cycles: ~2000 users (2x the starting number from virality alone)

Example with K=1.2, 10 cycles (truly viral):
Cycle 0: 1000
Cycle 1: 1000 + 1200 = 2200
Cycle 2: 2200 + 2640 = 4840
Cycle 3: 4840 + 5808 = 10648
...
After 10 cycles: 100,000+ (exponential growth)
```

### Monthly Virality Report

| Metric | This Month | Last Month | Change | Target |
|--------|-----------|------------|--------|--------|
| Invitations sent | ____ | ____ | ___% | ____ |
| Invitations accepted | ____ | ____ | ___% | ____ |
| K-factor | ____ | ____ | | > 0.3 |
| Cycle time (days) | ____ | ____ | | < 14 |
| Amplification factor | ___x | ___x | | > 1.5x |
| Organic share rate | ___% | ___% | | > 5% |
| Users from viral channels | ____ | ____ | ___% | ____ |

---

## Case Studies

### Notion: From Niche to Mainstream via Viral Loops

**Viral mechanics used:**
- Collaborative workspaces (collaborative loop)
- Template gallery shared publicly (social loop)
- "Made with Notion" links (organic loop)
- Referral credits (incentivized loop)

**Key insight:** Notion templates became viral content. Users created beautiful templates and shared them on Twitter, Reddit, and blogs. Each template linked back to Notion. Templates became Notion's most effective acquisition channel.

**Lesson for {{PROJECT_NAME}}:** Create a mechanism for users to build and share templates, configs, or outputs that naturally reference your product.

### Figma: Replacing the Incumbent via Collaboration

**Viral mechanics used:**
- Real-time collaboration (collaborative loop)
- Browser-based access (zero install friction)
- Shareable prototypes and design specs (social loop)
- Public community files (organic loop)

**Key insight:** Figma spread department-by-department inside companies. One designer would use Figma, share a file with a developer, the developer would share with their team, and suddenly an entire company was on Figma. The browser-based access meant zero friction -- no download, no license, just click a link.

**Lesson for {{PROJECT_NAME}}:** Reduce barriers for non-users to experience your product through shared links. Make it possible to view/interact without signing up, then prompt account creation for full features.

### Calendly: Embedding Virality in Every Interaction

**Viral mechanics used:**
- Scheduling links sent to external people (organic loop)
- Every recipient experiences the product (visibility)
- "Powered by Calendly" branding on scheduling pages (attribution)
- Frictionless experience motivates recipients to try it themselves

**Key insight:** Every Calendly user sends scheduling links to people who are NOT Calendly users. Those recipients experience the product firsthand. A percentage of them think "I should use this too" and sign up. The product's core use case IS the viral loop.

**Lesson for {{PROJECT_NAME}}:** Identify if your product has interactions with non-users. Every such interaction is a viral opportunity. Ensure the non-user experience is excellent and subtly promotes sign-up.

### Loom: Making Video the Sharing Medium

**Viral mechanics used:**
- Video recordings shared via link (social loop)
- Recipients see Loom interface (visibility)
- "Record a Loom" CTA on viewing page (conversion)
- Slack/email integration makes sharing frictionless (reduced friction)

**Key insight:** Loom users send video messages to colleagues and clients. Every video view is a product impression. The viewing experience includes a prominent "Record your own" button. Recipients see how easy it is and many sign up to use it themselves.

**Lesson for {{PROJECT_NAME}}:** If your product generates outputs that are shared, make the sharing medium itself a showcase for the product.

---

## Viral Loop Design for {{PROJECT_NAME}}

### Step 1: Identify Viral Opportunities

Answer these questions:

```
1. Does using {{PROJECT_NAME}} involve interacting with non-users?
   (e.g., sharing output, collaborating, sending links)
   Answer: _______________

2. Does {{PROJECT_NAME}} produce output that users would naturally share?
   (e.g., reports, designs, content, achievements)
   Answer: _______________

3. Is {{PROJECT_NAME}} more valuable with more users?
   (e.g., team features, network effects, marketplace dynamics)
   Answer: _______________

4. Can parts of {{PROJECT_NAME}} be made visible on external platforms?
   (e.g., embeddable widgets, public profiles, "built with" badges)
   Answer: _______________
```

### Step 2: Choose Your Primary Viral Loop

Based on your answers above, select the most natural viral loop:

| If Answer | Primary Loop | Secondary Loop |
|-----------|-------------|----------------|
| #1 is Yes | Collaborative | Social |
| #2 is Yes | Social | Incentivized |
| #3 is Yes | Organic (network effect) | Collaborative |
| #4 is Yes | Social | Organic |
| None are Yes | Incentivized (referral program) | Social (create shareable content) |

### Step 3: Design the Loop

```
Trigger: What moment causes a user to share?
  {{VIRAL_TRIGGER}}

Action: What does the user do to share?
  {{VIRAL_ACTION}}

Exposure: What does the non-user see?
  {{VIRAL_EXPOSURE}}

Conversion: What motivates the non-user to sign up?
  {{VIRAL_CONVERSION}}

Cycle time target: ___ days (from trigger to new user's first trigger)
K-factor target: ___ (start with 0.2-0.3 as realistic goal)
```

### Step 4: Build and Measure

- [ ] Implement the primary viral loop in the product
- [ ] Add tracking for invitations, exposures, and conversions
- [ ] Calculate K-factor weekly
- [ ] Measure cycle time
- [ ] A/B test sharing prompts, messages, and landing pages
- [ ] Optimize friction points (see "Reducing Friction" section above)
- [ ] Iterate monthly based on data
