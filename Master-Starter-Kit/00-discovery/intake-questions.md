# Project Intake Questions — 5-Phase Deep Discovery

> **~87 structured interview questions organized in 5 sequential phases (including deep discovery categories G-L).**
> Each phase builds on the previous — Phase 2 uses entities from Phase 1, Phase 3 uses services from Phase 2, etc.
> Questions marked with **\*** are **stop gates** — Claude must get answers before proceeding.
> Each question includes: the question text, why it matters, a smart default, and the stop gate indicator.
>
> **Total stop gates:** 20 (was 18)
> **Estimated interview time:** 120-180 minutes (full), 20-30 minutes (quick mode)

---

## Quick Intake Mode

If the user requests speed, cover Phase 1 stop gates + a compressed Phase 2:

1. PT1* (app type)
2. A1* (what it does)
3. A2* (who pays)
4. A3* (core action)
5. A1-FOLLOW* (expected service count)
6. A6* (main entities — minimum 5, even rough)
7. B1* (user types — with screen count estimates)
8. D1* (deployment)
9. E1* (developer count)
10. E2* (MVP date)
11. F1* (mobile — auto-resolved)
12. Compressed P2-1*: Claude proposes a service list based on A1/A6/B1 answers, user confirms/corrects

Infer all remaining answers with smart defaults. Completes intake in ~20-30 minutes.

---

# PHASE 1: Core Identity

> **Goal:** Establish what the product is, who it serves, the broad technical constraints, and — critically — the raw materials (entities, user types, rough service count) that Phase 2 will systematically mine.
> **Estimated time:** 15-20 minutes.
> **Stop gates:** 12

---

## Category PT: Project Type

> Goal: Determine upfront whether this is a web application, a native mobile application, or both. This single answer shapes the entire orchestrator flow — which steps to run, which questions to ask, and what infrastructure to set up. Ask this FIRST before any other question.

---

### PT1* — What type of application is this?

**Question:** What platforms does this product need to run on?
- **Web application** — browser-based app (desktop and/or mobile browsers)
- **Mobile application** — native iOS/Android app installed from the App Store or Play Store
- **Both web and mobile** — a web app with a companion native mobile app

**Why it matters:** This is the single most impactful architectural decision. A web-only project skips all mobile infrastructure (code signing, app store submission, native device APIs, Sections 14-17). A mobile-only project skips web-specific infrastructure (Docker, Vercel, Storybook). A hybrid project runs the full orchestrator. Getting this wrong means either unnecessary complexity or missing an entire platform.

**Smart default:** N/A — this is a stop gate. Claude must get an answer.

**Stop gate:** YES

**How Claude sets CONFIG from this answer:**
- **Web only:** `PROJECT_TYPE: "web"`, `HAS_WEB: "true"`, `HAS_MOBILE: "false"` → skip Category F, skip mobile orchestrator steps (3.5, 5.5, 11.5, 14.5)
- **Mobile only:** `PROJECT_TYPE: "mobile"`, `HAS_WEB: "false"`, `HAS_MOBILE: "true"` → skip web-specific infra in Step 11, skip Storybook in Step 13, proceed to Category F. `FRONTEND_FRAMEWORK` defaults to `"none"` unless a web admin panel is also needed.
- **Both:** `PROJECT_TYPE: "web+mobile"`, `HAS_WEB: "true"`, `HAS_MOBILE: "true"` → full orchestrator, all questions apply

**Follow-up if mobile-only:**
- Does the mobile app connect to a backend API? (If yes, `BACKEND_FRAMEWORK` questions still apply — the backend serves the mobile app)
- Is the backend a custom API or a BaaS (Firebase, Supabase)? (BaaS means `BACKEND_FRAMEWORK: "none"`)

**Follow-up if both:**
- Is the mobile app the primary interface or a companion to the web app?
- Should the mobile app launch with the web MVP or follow later?

---

## Category A: Core Concept

> Goal: Understand what the product is, who it's for, why it exists, and — NEW — establish the building blocks (entities, service count, daily workflows) that Phase 2 will systematically enumerate.

---

### A1* — What does this product do? (One sentence)

**Question:** In one sentence, what does this product do? Don't explain how — just what outcome it delivers.

**Why it matters:** This sentence becomes the anchor for every architecture decision, feature prioritization, and scope conversation. If you can't say it in one sentence, the product isn't focused enough yet.

**Smart default:** N/A — this is a stop gate. Claude must get an answer.

**Stop gate:** YES

**Examples of good answers:**
- "It manages wheelchair transportation scheduling for non-emergency medical transport companies."
- "It tracks inventory across multiple warehouses and auto-reorders when stock is low."
- "It lets freelancers send invoices and get paid in 48 hours."

**Examples of bad answers (Claude should push back):**
- "It's like Uber but for..." (too vague — for what? who?)
- "It does everything a business needs." (scope is infinite — narrow it)

---

### A1-FOLLOW* — How many distinct services or modules does this product have?

**Question:** Think of your product as a set of services or modules (like "Trip Management," "Billing," "Reporting," "User Management," "Notifications"). Roughly how many distinct services or modules does it have? Don't worry about being exact — give a rough count and we'll enumerate them all in Phase 2.

**Why it matters:** This sets the completeness anchor. If you say "about 35 services" and Claude only discovers 12 during the deep mining phase, we know something was missed. The count acts as a completeness check throughout the entire orchestrator.

**Smart default:** N/A — this is a stop gate. Claude must get at least a rough number.

**Stop gate:** YES

**What Claude does with this:**
- Stores as `CONFIG.EXPECTED_SERVICE_COUNT`
- In Phase 2, Claude compares enumerated services against this number
- If gap is >20%, Claude flags it: "You estimated {N} services. We've identified {M}. Are we missing something?"

**How to help the user estimate:**
- Count the main sidebar navigation items you envision → that's a minimum
- Count distinct "areas" of the product (scheduling, billing, reporting, settings, etc.)
- A typical B2B SaaS has 8-15 services. A complex enterprise product has 20-40+.

---

### A2* — Who is the paying customer?

**Question:** Who pays for this product? Is this B2B (businesses pay), B2C (consumers pay), or Internal (your own company uses it)?

**Why it matters:** This determines auth complexity, billing features, multi-tenancy needs, and the entire pricing model. A B2B product needs organizations, seats, billing. A B2C product needs individual sign-up and possibly freemium. Internal means no billing at all.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

**Follow-up questions based on answer:**
- **B2B:** How many seats per organization? Do they self-serve or sales-led? Free trial?
- **B2C:** Freemium or paid-only? Subscription or one-time?
- **Internal:** How many internal users? Multiple departments?

---

### A3* — What is the ONE thing users do every day?

**Question:** If a user opens your app every single day, what is the one action they perform most? This is your "core loop."

**Why it matters:** The core loop determines the default landing page, the primary navigation structure, the performance optimization targets, and where 60% of your UI effort should go. If the core loop is slow or confusing, nothing else matters.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

**Examples:**
- TMS: "Check today's trip schedule and dispatch drivers."
- CRM: "Review pipeline and log customer interactions."
- E-commerce admin: "Process new orders and update shipping."

---

### A3-FOLLOW — What are the top 3-5 daily workflows?

**Question:** Beyond the core loop (A3), what are the other 2-4 things that happen every day across ALL user types? Think about what different roles do, not just the primary user.

**Why it matters:** Products have 3-5 critical daily workflows across different roles. Capturing these early means we can trace them end-to-end in Phase 3. Each daily workflow reveals screens, API calls, notifications, and edge cases.

**Smart default:** Claude infers from the user types and frustrations listed in B1/B2.

**Stop gate:** No

**Template for answer:**
```
1. [Role]: [What they do daily] (e.g., "Dispatcher: Reviews unassigned trips and assigns drivers")
2. [Role]: [What they do daily] (e.g., "Driver: Checks assigned schedule, navigates to pickups")
3. [Role]: [What they do daily] (e.g., "Admin: Reviews daily metrics, handles escalations")
4. [Role]: [What they do daily] (e.g., "Billing: Generates invoices for completed trips")
```

---

### A4 — Does it exist today? What's broken?

**Question:** Is there a current version of this product (even a spreadsheet or manual process)? If yes, what's broken about it that motivated building something new?

**Why it matters:** If a V1 exists, its failures are your requirements. Every complaint about the old system is a feature spec for the new one. If nothing exists, you're building from scratch and need to be extra careful about assumptions.

**Smart default:** "Greenfield project — no existing system." Claude notes this and moves on.

**Stop gate:** No

**Follow-up if yes:**
- Can Claude see the existing system (URL, screenshots, codebase)?
- What are the top 3 complaints from current users?
- What works well that must be preserved?

---

### A5 — Who are the 3 biggest competitors?

**Question:** Name up to 3 competitors or similar products. These don't have to be exact competitors — "inspired by" counts.

**Why it matters:** Competitors define the user's expectations. If your users have used Notion, they expect drag-and-drop, slash commands, and real-time collaboration. If they've used Excel, they expect tables and formulas. Competitors set the UX bar.

**Smart default:** "No known competitors — Claude will research during the Tribunal step." Claude adds a research task.

**Stop gate:** No

---

### A6* — What are the main "things" (entities) this product manages?

**Question:** List the main objects or entities this system tracks. Examples: Trips, Drivers, Vehicles, Patients, Invoices, Routes, Products, Orders, Tickets. Don't worry about database design — just name the real-world things your product manages.

**Why it matters:** Entities are the backbone of the data model. Every entity becomes at least one database table, one API resource, and one or more screens. Missing an entity here means missing an entire feature area later. This list is the foundation for Phase 2's systematic service enumeration.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

**Template for answer:**

| Entity | Description | Who Creates It | Estimated Volume (per month) |
|--------|-------------|----------------|------------------------------|
| Trip | A scheduled transport from A to B | Dispatcher or Facility | ~500 |
| Driver | A person who performs transport | Admin | ~50 (rarely changes) |
| Vehicle | A transport vehicle | Admin | ~30 (rarely changes) |
| Invoice | A bill for completed services | System (auto-generated) | ~400 |
| Facility | A healthcare facility that requests trips | Admin | ~20 (rarely changes) |

**What Claude does with this:**
- Stores as `CONFIG.MVP_ENTITIES`
- Used in Phase 2 (P2-1) to enumerate features per entity
- Used in Phase 4 to inform data model design
- Every entity must appear in at least one service by end of Phase 2

---

### A7 — What states or statuses do your key entities go through?

**Question:** For each major entity you listed in A6, what are the statuses it can have? For example, a Trip might go through: Requested → Scheduled → In Progress → Completed → Billed. A Driver might be: Active → Suspended → Inactive.

**Why it matters:** State machines are the core business logic. They determine what actions are valid when, what notifications fire, and what the UI shows. Getting these early prevents the "what should happen when...?" questions during development.

**Smart default:** Claude prompts with common state patterns based on the industry. "Most [entity type] systems use: Draft → Active → Completed → Archived. Does that match yours?"

**Stop gate:** No (but strongly encouraged for top 3 entities)

**Template for answer:**
```
Trip: Requested → Scheduled → Assigned → In Progress → Completed → Billed → Closed
  - Branching: Can be "Cancelled" from any state before "Completed"
  - Branching: Can be "No Show" from "In Progress"

Driver: Pending Approval → Active → Suspended → Inactive
  - Only Admin can change driver status

Invoice: Draft → Sent → Viewed → Paid → Overdue
  - Auto-transitions: Sent → Overdue after 30 days
```

**What Claude does with this:**
- Stores as `CONFIG.MVP_ENTITY_STATES`
- Feeds directly into domain-rules.template.md (state machines)
- Phase 3 uses these to identify notification triggers per state transition

---

## Category B: Users

> Goal: Map every person who touches the system. Understand their workflows, frustrations, and technical abilities. This drives RBAC, navigation, and persona-specific UI.

---

### B1* — List every user type

**Question:** List every type of person who will use this system. For each, provide: a name, a one-line description, their key daily workflow, an estimated screen count, and whether they are internal (employees) or external (customers/partners).

**Why it matters:** This directly generates your RBAC system, your navigation structure (different sidebar for different roles), and your test personas. Missing a user type here means missing an entire feature set later. The screen count estimate is your first completeness anchor for Phase 3.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

**Template for answer:**

| Role | Description | Key Daily Workflow | Est. Screen Count | Internal/External |
|------|-------------|-------------------|-------------------|-------------------|
| Super Admin | System owner, full access | Configure system, manage orgs | ~10 | Internal |
| Admin | Company admin | Review metrics, manage team, settings | ~12 | Internal |
| Dispatcher | Assigns trips to drivers | View trip queue, assign drivers | ~8 | Internal |
| Driver | Performs transport | View assigned trips, navigate | ~5 | Internal |
| Facility Staff | Requests trips | Submit trip requests, track status | ~4 | External |

**Why screen count matters:** If the user says Dispatcher has ~8 screens and Phase 3 only identifies 3, we know screens were missed.

---

### B2* — Biggest frustration per user type

**Question:** For each user type listed in B1, what is their single biggest frustration with the current process (or with competitor products)?

**Why it matters:** Frustrations are features in disguise. "The dispatcher spends 30 minutes manually assigning trips" means you need auto-dispatch. "Drivers can't see their schedule until they arrive" means you need a mobile-first driver view. Every frustration maps directly to a P0 or P1 feature.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

---

### B3 — Most critical user type to get right on day one

**Question:** If you could only make ONE user type happy at launch, which one? Why?

**Why it matters:** This determines your MVP scope. You build the critical user's workflow first, end-to-end, and let other roles have basic functionality. This prevents the classic mistake of building 30% of every role instead of 100% of one role.

**Smart default:** "The paying customer's primary user." (If B2B and the admin pays, optimize for the admin. If the daily user drives retention, optimize for them.)

**Stop gate:** No

---

### B4 — Accessibility needs?

**Question:** Will your users include elderly people, non-technical users, or people with disabilities? Are there any specific accessibility requirements?

**Why it matters:** This affects font sizes, contrast ratios, interaction patterns, keyboard navigation, screen reader support, and overall UI complexity. An app for 25-year-old developers can use keyboard shortcuts and dense UIs. An app for 65-year-old patients needs large buttons and simple flows.

**Smart default:** "Standard WCAG 2.1 AA compliance. No specific accessibility requirements beyond standard best practices."

**Stop gate:** No

---

### B5 — Desktop, mobile, or both?

**Question:** Will users primarily access the app on desktop, mobile, or both? Which is more important if you had to choose?

**Why it matters:** This determines your responsive strategy. Desktop-first means complex layouts with mobile as a simplified view. Mobile-first means thumb-friendly UI with desktop as an expanded view. "Both equally" means responsive design is a P0 requirement from day one.

**Smart default:** "Desktop-first with responsive mobile support."

**Stop gate:** No

**Follow-up:** Do any user types need a native mobile app, or is a responsive web app sufficient?

---

### B6 — Expected user counts?

**Question:** How many users do you expect at launch? At 1 year? (Order of magnitude is fine — 10, 100, 1000, 10K, 100K)

**Why it matters:** This drives infrastructure decisions. 10 users = SQLite is fine. 1,000 users = PostgreSQL with basic optimization. 100K users = connection pooling, caching layer, CDN, and performance monitoring from day one.

**Smart default:** "Launch: ~10-50 users. Year 1: ~100-500 users." (Appropriate for most B2B SaaS MVPs.)

**Stop gate:** No

---

### B7 — Anonymous or unauthenticated users?

**Question:** Does any user type interact with the system without logging in? Examples: a patient who receives an SMS link to confirm an appointment, a client who views a shared report via a public link, a driver who uses a kiosk mode, a visitor browsing a public directory.

**Why it matters:** Anonymous or semi-authenticated interactions create separate UI flows, different security models, and additional screens that are easy to miss if you only think about logged-in users. These often require token-based access, rate limiting, and abuse prevention.

**Smart default:** "No anonymous interactions. All users must log in."

**Stop gate:** No

---

## Category D: Deployment (ask early — gates infrastructure)

> Goal: Determine where and how the app runs. These decisions are hard to change later, so get them right now.

---

### D1* — Deployment target?

**Question:** Where will this app be deployed? Options:
- **Vercel** (easiest for Next.js, generous free tier, auto-scaling)
- **AWS** (most flexible, more ops work, better for complex architectures)
- **Docker/self-hosted** (full control, you manage everything)
- **Other** (Fly.io, Railway, Render, etc.)

**Why it matters:** Deployment target affects build configuration, environment variable management, CI/CD pipeline, and cost structure. Choosing Vercel means you get zero-config deployments but accept their limitations. Choosing AWS means full flexibility but you own the ops burden.

**Smart default:** N/A — this is a stop gate. (Though Vercel is recommended for most Next.js projects.)

**Stop gate:** YES

---

## Category E: Timeline & Team

> Goal: Understand the constraints that shape scope. An ambitious product with 1 developer and a 4-week timeline needs aggressive prioritization.

---

### E1* — How many developers?

**Question:** How many developers will work on this project? What are their experience levels?

**Why it matters:** A solo developer needs a monolith with minimal infrastructure overhead. A team of 5 can handle a monorepo with separate packages. Team size directly determines how many features can be built in parallel and how complex the architecture can be.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

---

### E2* — Target MVP date?

**Question:** When do you need the minimum viable product ready? (Not the full product — just enough to get the first user on it.)

**Why it matters:** Timeline drives scope. A 2-week MVP means 5-7 features max. A 3-month MVP means 30-40 features. Claude uses this to calculate feature velocity and phase planning. If the math doesn't work (50 features in 2 weeks with 1 developer), Claude will say so and negotiate scope.

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES

**Claude's math check:**
- Solo developer: ~2-3 features per week (including tests and deployment)
- Two developers: ~4-5 features per week
- Available weeks = (MVP date - today) in weeks
- Max features = developers x features/week x available weeks
- If requested features > max features, Claude flags the gap

---

## Category F: Mobile Platform

> Goal: Determine whether the project needs a native mobile app, which platforms and framework to target, and what native capabilities are required. **Skip this entire category if PT1 = "Web application".**

---

### F1* — Does this project need a native mobile app?

**Question:** Do any user types need a native mobile app (installed from the App Store or Play Store), or is a responsive web app sufficient for all users?

**Auto-resolved:** If PT1 was answered as "Mobile application" or "Both web and mobile," this question is automatically "yes." If PT1 was "Web application," this question is automatically "no" — skip Category F entirely.

**Smart default:** Auto-resolved from PT1. If the answer is "no," set CONFIG.HAS_MOBILE to "false" and skip all remaining F-category questions.

**Stop gate:** YES (auto-resolved from PT1)

**Follow-up if yes (and not already answered in PT1):**
- Which user types need the mobile app? (drivers, field workers, customers, all?)
- What do they do on mobile that they cannot do on a responsive web app?

**Red flags Claude should watch for (during earlier questions):**
- User says "drivers in the field" → they almost certainly need a mobile app
- User says "works offline" → mobile app with offline-first architecture
- User says "push notifications for time-sensitive alerts" → mobile app advantage
- User says "GPS tracking" or "camera scanning" → native device APIs needed

---

## Phase 1 Completion Gate

```
PHASE 1 STOP GATES (12 total):
- [ ] PT1* answered: Project type is ____
- [ ] A1* answered: Product does ____
- [ ] A1-FOLLOW* answered: Expected service count is ____
- [ ] A2* answered: Customer type is ____
- [ ] A3* answered: Core daily action is ____
- [ ] A6* answered: ____ entities identified
- [ ] B1* answered: ____ user types identified (with screen count estimates)
- [ ] B2* answered: Frustrations documented for each user type
- [ ] D1* answered: Deploying to ____
- [ ] E1* answered: ____ developer(s)
- [ ] E2* answered: MVP target is ____
- [ ] F1* answered: Native mobile needed? ____ (auto-resolved from PT1)

RAW MATERIALS FOR PHASE 2:
  Entities: {count from A6}
  Entity states: {from A7, if answered}
  User types: {count from B1}
  Expected services: {from A1-FOLLOW}
  Daily workflows: {from A3 + A3-FOLLOW}
```

**Gate instruction for Claude:** Present a Phase 1 summary showing the entity count, user type count, expected service count, and core loop. Ask: "Before we dive deep into each service and feature, is this high-level picture correct?"

---

# PHASE 2: Deep Feature Mining

> **Goal:** Systematically enumerate every service, feature, and sub-feature in the product. This is the phase that prevents "user says 35 services but we only discovered 12."
> **Strategy:** Use entities (A6) and user types (B1) as two axes. For each entity → what operations exist. For each user type → what features they need. The intersection reveals features neither axis alone would surface.
> **Estimated time:** 20-30 minutes.
> **Stop gates:** 1

---

### P2-1* — Let's enumerate every service

**Question:** I'm going to walk through your product area by area. For each area, tell me: (1) what it does, (2) which user types use it, (3) roughly how many screens or pages it has. Start with the most important area.

**Why it matters:** This is the exhaustive enumeration. Instead of asking "what features do you need?" (which gets a partial list), we walk through methodically.

**Procedure for Claude:**

1. **Entity-driven pass:** For each entity from A6, ask: "What can users do with [entity]? Create, read, update, delete, search, filter, export, bulk operations?"

2. **Cross-cutting services pass:** After entity-driven services, prompt for these common service areas that don't map to a single entity:
   - Authentication & User Management
   - Notifications & Alerts
   - Reporting & Analytics / Dashboards
   - Settings & Configuration
   - Billing / Invoicing / Payments
   - Audit Trail / Activity Log
   - Search (global or entity-specific)
   - Help / Support / Feedback
   - Onboarding / Setup Wizard
   - Admin Tools / System Management

3. **Record each service:**

   | # | Service Name | Description | Entities Involved | User Types | Est. Screens | Est. API Endpoints | Priority (P0-P3) |
   |---|-------------|-------------|-------------------|------------|-------------|-------------------|-------------------|
   | 1 | Trip Management | Schedule and manage transport | Trip, Driver, Vehicle | Dispatcher, Admin | ~8 | ~12 | P0 |
   | 2 | Billing | Invoice generation and payment | Invoice, Payment, Trip | Billing Clerk, Admin | ~6 | ~10 | P0 |

4. **Completeness check:** Compare count against `CONFIG.EXPECTED_SERVICE_COUNT`. If counts differ by >20%, ask: "You estimated {N} services. We've identified {M}. Are we missing something, or was the original estimate off?"

**Smart default:** N/A — this is a stop gate.

**Stop gate:** YES — Claude must enumerate at least `CONFIG.EXPECTED_SERVICE_COUNT * 0.8` services before proceeding.

**What Claude does with this:**
- Stores full service list as `CONFIG.MVP_SERVICES`
- Each service becomes a service spec (Step 5) and a service hub file
- This table is the master reference for all downstream completeness checks

---

### P2-2 — For each service, list ALL operations

**Question:** For each service we just identified, let's list every operation. Beyond basic create/read/update/delete, are there special actions? Examples: "approve trip," "reassign driver," "generate invoice," "export CSV," "send reminder," "mark as paid," "bulk assign."

**Why it matters:** Special actions are where the real complexity lives. CRUD is predictable. But "reassign a driver to a different trip" involves validation (is the driver available?), state changes (old assignment cancelled, new one created), notifications (both drivers notified), and audit logging. Each special action is often its own API endpoint and its own UI interaction.

**Procedure for Claude:**

For each service from P2-1, list all operations:
```
Service: Trip Management
- Create trip (Dispatcher, Admin)
- View trip list (Dispatcher, Admin, Driver - own only)
- View trip detail (Dispatcher, Admin, Driver - own only)
- Edit trip (Dispatcher, Admin)
- Cancel trip (Dispatcher, Admin) — triggers notification to driver
- Assign driver (Dispatcher) — validation: driver must be available
- Reassign driver (Dispatcher) — cancels old, assigns new, notifies both
- Start trip (Driver) — GPS tracking begins
- Complete trip (Driver) — triggers billing
- Export trip report (Admin) — CSV/PDF
- Bulk assign trips (Dispatcher) — batch operation
- Search/filter trips (Dispatcher, Admin) — by status, date, driver, facility
```

**Smart default:** Claude generates standard CRUD operations for each entity and asks the user to confirm and add special actions.

**Stop gate:** No, but Claude must prompt for special actions for every P0 and P1 service.

---

### P2-3 — Integrations mapped to services

**Question:** For each service, does it connect to any external system? Think about: mapping/GPS (Google Maps, Mapbox), payment (Stripe, QuickBooks), communication (Twilio, SendGrid), EHR systems, government APIs, data imports from other software, SSO providers, analytics tools, etc.

**Why it matters:** This maps integrations to specific services (not just "we use Stripe"). This is needed for the integrations-map.template.md and for accurate effort estimation per service.

**Procedure for Claude:**

| Service | Integration | Purpose | Direction | Priority | Phase |
|---------|------------|---------|-----------|----------|-------|
| Trip Mgmt | Google Maps | Route calculation, ETA | Outbound API call | P0 | 1 |
| Trip Mgmt | GPS Provider | Real-time driver tracking | Inbound data stream | P1 | 2 |
| Billing | QuickBooks | Sync invoices | Bidirectional | P1 | 3 |
| Billing | Stripe | Payment processing | Bidirectional (webhooks) | P0 | 2 |
| Notifications | Twilio | SMS alerts | Outbound | P1 | 2 |
| Notifications | SendGrid | Email delivery | Outbound | P0 | 1 |

**Smart default:** Claude suggests common integrations for the detected industry. "Most healthcare transport apps integrate with Google Maps, Twilio, and at least one EHR system. Do any of these apply?"

**What Claude does with this:**
- Stores as `CONFIG.MVP_INTEGRATIONS`
- Feeds integrations-map.template.md
- Each integration becomes part of the service spec's "Dependencies" section

**Stop gate:** No

---

### P2-4 — Import, export, sync, and bulk operations

**Question:** Does any data need to be:
- **Imported** from an existing system at launch? (e.g., importing existing drivers/vehicles from a spreadsheet)
- **Exported** on demand? (e.g., trip reports as CSV, invoices as PDF)
- **Synced** continuously with another system? (e.g., real-time sync with QuickBooks)
- **Bulk operated** on? (e.g., bulk-approve invoices, bulk-assign trips, bulk-import records)

**Why it matters:** Import/export/bulk operations are commonly missed during intake but represent significant development effort. A CSV import with validation, error handling, and progress tracking is easily an L-sized feature. Continuous sync adds ongoing complexity.

**Smart default:** "No imports at launch. Basic CSV export for the primary entity. No continuous sync. No bulk operations beyond basic multi-select."

**Stop gate:** No

**Template for answer:**

| Operation | Entity | Format | Frequency | Source/Destination | Priority |
|-----------|--------|--------|-----------|-------------------|----------|
| Import | Drivers | CSV | One-time at launch | Existing spreadsheet | P0 |
| Export | Trip Report | CSV, PDF | On-demand | Admin downloads | P1 |
| Sync | Invoices | API | Real-time | QuickBooks | P2 |
| Bulk | Trips | N/A | Daily | Dispatcher selects and bulk-assigns | P1 |

**What Claude does with this:**
- Stores as `CONFIG.IMPORT_EXPORT`
- Each import/export/sync becomes a feature in the relevant service spec
- Bulk operations affect screen designs (multi-select UI, progress indicators)

---

### P2-5 — Reports and dashboards per user type

**Question:** For each user type, what dashboards, reports, or analytics do they need? Think about:
- What KPIs do they track? (revenue, trips completed, average response time)
- Do they need charts/graphs? Which ones?
- Do they need scheduled reports (weekly email with metrics)?
- Do they need to drill down into data?

**Why it matters:** Reporting is consistently underestimated. A "simple dashboard" with 6 KPI cards, 2 charts, a date range filter, and drill-down capability is an XL feature. Enumerating reports early prevents the late-stage surprise of "oh, and we need 5 dashboards."

**Smart default:** "One dashboard per user type with 3-5 KPIs and counters. No charts at MVP. No scheduled reports at MVP."

**Stop gate:** No

**Template for answer:**

| User Type | Dashboard/Report | KPIs | Charts | Frequency | Priority |
|-----------|-----------------|------|--------|-----------|----------|
| Admin | Executive Dashboard | Revenue, trips, on-time %, utilization | Bar chart (monthly revenue), Line chart (daily trips) | Real-time | P0 |
| Dispatcher | Operations Dashboard | Today's trips, unassigned count, driver availability | None (just counters) | Real-time | P0 |
| Billing Clerk | AR Report | Outstanding invoices, aging, collection rate | Pie chart (aging buckets) | Weekly PDF email | P1 |

**What Claude does with this:**
- Each dashboard becomes a screen in Phase 3
- KPIs become API endpoints
- Scheduled reports become background jobs (Phase 4, P4-3)

---

## Phase 2 Completion Gate

```
PHASE 2 COMPLETENESS CHECK:

Before proceeding to Phase 3, verify:
- [ ] Total services enumerated: ____ (within 20% of CONFIG.EXPECTED_SERVICE_COUNT)
- [ ] Every entity from A6 is covered by at least one service
- [ ] Every user type from B1 has at least one service they interact with
- [ ] Special actions identified for all P0 services (P2-2)
- [ ] Integrations mapped to specific services (P2-3)
- [ ] Import/export/bulk needs identified (P2-4)
- [ ] Reporting needs identified per user type (P2-5)

PHASE 2 SUMMARY:
  Services: {count} ({P0 count} P0, {P1 count} P1, {P2 count} P2, {P3 count} P3)
  Operations per service (avg): {avg}
  Integrations: {count}
  Import/export needs: {count}
  Dashboards: {count}
```

**Gate instruction for Claude:** Present the service inventory table to the user and ask: "Here are the {N} services we've identified. Are there any services or features missing from this list? Take a moment to think through your entire product."

**If the user adds services:** Re-run the entity coverage and user type coverage checks.

---

# PHASE 3: User Journey Mapping

> **Goal:** For each user type, map every screen they see and every workflow they perform. This ensures screen specs (Step 6) are complete.
> **Strategy:** Walk through each user type sequentially. For each user, trace their day from login to logout.
> **Estimated time:** 20-30 minutes.
> **Stop gates:** 2

---

### P3-1* — Post-login landing screen per user type

**Question:** For each user type from B1, what do they see immediately after logging in? Is it a dashboard? A list view? A map? What information must be visible at a glance?

**Why it matters:** The post-login screen is the most important screen per role. It determines the navigation structure and sets the user's mental model for the entire app.

**Procedure for Claude:**

For each user type, document:
```
Role: Dispatcher
Landing screen: Dispatch Dashboard
Route: /dispatch
Shows at a glance:
  - Today's trip count (assigned vs unassigned)
  - Map with active drivers
  - Unassigned trip queue
  - Alerts (late drivers, cancelled trips)
Primary action from this screen: Assign an unassigned trip to a driver
```

**Smart default:** N/A — this is a stop gate. Every user type must have a defined landing screen.

**Stop gate:** YES

---

### P3-2* — Complete screen navigation tree per user type

**Question:** Starting from the landing screen, what are ALL the screens this user type can access? Think about: sidebar navigation items, pages they can drill into, forms they can open, modals they interact with, settings they can access.

**Why it matters:** This is the screen inventory. Every screen listed here becomes a screen spec in Step 6. Missing a screen here means missing it in the spec and discovering it mid-development.

**Procedure for Claude:**

For each user type, build the complete navigation tree:
```
Role: Dispatcher
Screens (estimated from B1: ~8)

  Sidebar Navigation:
    1. Dashboard (/dispatch) — landing screen
    2. Trips (/trips)
       2a. Trip List (/trips) — filterable, sortable
       2b. Trip Detail (/trips/[id]) — full trip info, timeline, actions
       2c. Create Trip (/trips/new) — form with validation
       2d. Edit Trip (/trips/[id]/edit) — pre-filled form
    3. Drivers (/drivers)
       3a. Driver List (/drivers) — availability status
       3b. Driver Detail (/drivers/[id]) — schedule, performance
    4. Map View (/map) — real-time driver locations
    5. Reports (/reports) — read-only for dispatcher
    6. Settings (/settings) — notification preferences only

  Modals/Slide-overs:
    - Assign Driver modal (from Trip Detail)
    - Trip Quick View slide-over (from Dashboard)
    - Bulk Assign dialog (from Trip List)

  Total screens: 11 (estimated was ~8 — additional modals discovered)
```

After enumerating all roles, **de-duplicate screens**. Many roles share the same screen with different permissions (e.g., Admin and Dispatcher both see Trip List, but Admin can also delete).

**Master Screen List format:**

| # | Screen Name | Route | Roles (permission level) | Service | Priority |
|---|------------|-------|-------------------------|---------|----------|
| 1 | Dispatch Dashboard | /dispatch | Dispatcher (full), Admin (read) | Trip Mgmt | P0 |
| 2 | Trip List | /trips | Dispatcher, Admin (full), Driver (own) | Trip Mgmt | P0 |
| 3 | Trip Detail | /trips/[id] | Dispatcher, Admin, Driver (own) | Trip Mgmt | P0 |

**Stop gate:** YES — every user type must have a complete screen list. Total screen count must be within 30% of the sum of estimates from B1.

---

### P3-3 — Trace top 3 workflows per user type

**Question:** For each user type, walk me through their top 3 daily workflows step by step. For each step, tell me: what screen they're on, what action they take, and what happens next.

**Why it matters:** Workflow tracing reveals screen transitions, validation rules, notification triggers, and edge cases that no other question captures. "The dispatcher assigns a trip to a driver" becomes a multi-step flow with validation, notifications, and state changes.

**Procedure for Claude:**

For each user type's top workflows, trace step by step:

```
Workflow: Dispatcher assigns a trip
Trigger: New trip request arrives (or unassigned trip exists)

| Step | Screen | Action | System Response | Next Screen |
|------|--------|--------|----------------|-------------|
| 1 | Dispatch Dashboard | Views unassigned trip in queue | — | — |
| 2 | Dispatch Dashboard | Clicks trip to view details | Trip detail panel opens | Trip Detail (slide-over) |
| 3 | Trip Detail | Clicks "Assign Driver" | Shows available drivers filtered by proximity/schedule | Driver Selection Modal |
| 4 | Driver Selection Modal | Selects driver, confirms | Trip status → Assigned, SMS sent to driver | Back to Dashboard |
| 5 | Dispatch Dashboard | Sees trip moved to "Assigned" column | Real-time update via SSE | — |

Edge cases:
- No drivers available: Show "No available drivers" message with option to expand search radius
- Driver declines: Trip returns to unassigned queue, notification sent to dispatcher
- Trip cancelled while assigning: Show error "Trip was cancelled by [role]"
- Network error during assignment: Optimistic UI reverts, retry prompt shown
```

**Smart default:** Claude generates workflow stubs based on the core loop (A3), daily workflows (A3-FOLLOW), and frustrations (B2), then asks the user to confirm and correct.

**Stop gate:** No, but Claude must trace at least the #1 workflow for EVERY user type.

**What Claude does with this:**
- Stores as `CONFIG.MVP_WORKFLOWS`
- Each workflow reveals: screen transitions, API calls needed, validation rules, notification triggers, edge cases
- Feeds directly into service specs (business rules section) and screen specs (interactions section)

---

### P3-4 — Permission matrix

**Question:** Let's build a permission matrix. For each user type and each entity, what can they do? (Create, Read All, Read Own, Update All, Update Own, Delete, or None)

**Why it matters:** This directly feeds user-roles.template.md and becomes the RBAC implementation. Without this, developers guess at permissions and get them wrong.

**Procedure for Claude:**

| Entity | Super Admin | Admin | Dispatcher | Driver | Facility Staff |
|--------|------------|-------|------------|--------|---------------|
| Trip | CRUD All | CRUD All | CRUD All | Read Own, Update Status | Create Request, Read Own |
| Driver | CRUD All | CRUD All | Read All | Read Own Profile | None |
| Vehicle | CRUD All | CRUD All | Read All | Read Assigned | None |
| Invoice | CRUD All | CRUD All | Read All | None | Read Own Facility |
| User Account | CRUD All | CRUD (not Super Admin) | Read Own | Read Own | Read Own |
| Settings | Full | Full | Read + Notification Prefs | Read + Notification Prefs | None |
| Reports | All | All | Own Department | None | Own Facility |

**Smart default:** Claude pre-fills based on role hierarchy (Super Admin > Admin > Operational Roles > External Roles) and asks user to correct.

**Stop gate:** No, but Claude should fill this for all P0 entities.

**What Claude does with this:**
- Stores as `CONFIG.PERMISSION_MATRIX`
- Feeds user-roles.template.md
- Used in service specs (Auth & Permissions section)
- Used in screen specs (conditional rendering, disabled states)

---

### P3-5 — Notification triggers per workflow

**Question:** For each workflow we traced in P3-3, what notifications should the system send? For each notification: who receives it, through what channel (email, SMS, push, in-app), and how urgent is it?

**Why it matters:** Notification requirements are consistently missed during intake because they're side effects of workflows, not standalone features. Every state transition from A7 is a potential notification trigger.

**Procedure for Claude:**

| Trigger Event | Recipient | Channel | Urgency | Template Name |
|--------------|-----------|---------|---------|---------------|
| Trip assigned to driver | Driver | SMS + Push + In-app | Immediate | trip-assigned |
| Trip assigned to driver | Dispatcher | In-app only | Low (confirmation) | trip-assigned-confirm |
| Trip cancelled | Driver (if assigned) | SMS + Push | Immediate | trip-cancelled |
| Trip completed | Billing Clerk | In-app | Batched (hourly) | trip-ready-for-billing |
| Invoice overdue (>30 days) | Admin | Email | Daily digest | invoice-overdue |
| New user registered | Admin | Email | Daily digest | new-user-registered |
| Driver approaching pickup | Facility Staff | SMS | Immediate | driver-approaching |

**Smart default:** Claude suggests notification events for every state transition identified in A7 and asks the user to confirm/modify. Default: "Notify affected users on every P0 entity state transition. In-app for low urgency, SMS/push for immediate."

**Stop gate:** No

**What Claude does with this:**
- Stores as `CONFIG.NOTIFICATION_EVENTS`
- Feeds domain-rules.template.md (notification rules section)
- Each notification channel affects infrastructure (Twilio for SMS, FCM for push, etc.)

---

## Phase 3 Completion Gate

```
PHASE 3 COMPLETENESS CHECK:

Before proceeding to Phase 4, verify:
- [ ] Every user type has a defined landing screen (P3-1)
- [ ] Every user type has a complete screen navigation tree (P3-2)
- [ ] Master screen list created with duplicates removed
- [ ] Total unique screens: ____ (compare against sum of B1 estimates: ____)
- [ ] Top workflow traced for every user type (P3-3)
- [ ] Permission matrix covers all entities x all user types (P3-4)
- [ ] Notification triggers identified for all P0 workflows (P3-5)

PHASE 3 SUMMARY:
  Unique screens: {count} across {user type count} roles
  Shared screens (multi-role): {count}
  Workflows traced: {count}
  Permission matrix: {entity count} x {role count} cells
  Notification event types: {count}
```

**Gate instruction for Claude:** Present the master screen list and the permission matrix. Ask: "Here are {N} unique screens across {M} user types. Does this look complete? Are there any screens or pages we're missing?"

---

# PHASE 4: Technical Deep Dive

> **Goal:** Nail down every technical decision, now informed by the specific features, screens, and workflows identified in Phases 2-3. The existing tech questions (C1-C6, D2-D4, F2-F6) are asked here because they benefit from knowing the full scope.
> **Estimated time:** 15-20 minutes.
> **Stop gates:** 0 (all have smart defaults)

---

### C1 — Strong tech opinions or want recommendations?

**Question:** Do you have strong preferences for specific technologies, or would you like Claude to recommend a proven stack?

**Why it matters:** Some users have organizational mandates (must use AWS, must use Java). Others want the best tool for the job. Knowing this upfront prevents suggesting technologies the user can't or won't use.

**Smart default:** The proven stack (battle-tested in production):

| Layer | Technology | Why |
|-------|-----------|-----|
| Monorepo | Turborepo + pnpm | Fast builds, shared packages, dependency management |
| Frontend | Next.js (App Router) + React | SSR, file-based routing, massive ecosystem |
| API | tRPC v11 | End-to-end type safety, no code generation |
| Database | Drizzle ORM + PostgreSQL | Type-safe queries, great migrations, rock-solid DB |
| Auth | Better Auth | Self-hosted, flexible, supports RBAC + org-based auth |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, accessible components, fast prototyping |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E tests |
| Linting | Biome | Single tool for format + lint, 100x faster than ESLint |

**Stop gate:** No

---

### C2 — Real-time features needed?

**Question:** Based on the workflows we traced in Phase 3, which of these need real-time updates? (Live dashboards, notifications that appear without refreshing, collaborative editing, live location tracking, etc.)

**Why it matters:** Real-time adds complexity. SSE (Server-Sent Events) is simple and sufficient for most cases (live dashboards, notifications). WebSockets are needed for bidirectional communication (chat, collaborative editing). Now that we know the specific workflows, we can decide exactly which need real-time.

**Smart default:** "SSE for live dashboard updates and notifications. No WebSocket features needed."

**Stop gate:** No

---

### C3 — File storage needed?

**Question:** Based on the services identified in Phase 2, will users upload files? What types? How large? How many?

**Smart default:** "Basic file uploads (images, PDFs) under 10MB. Vercel Blob or S3-compatible storage."

**Stop gate:** No

---

### C4 — Email/SMS/Push notifications needed?

**Question:** Based on the notification matrix from P3-5, which channels do we need? Let's confirm: Email, SMS, Push, In-app?

**Smart default:** "Email notifications only (account verification, password reset, key alerts). No SMS or push at MVP."

**Stop gate:** No

**Cross-reference:** Compare with P3-5 notification matrix. If P3-5 listed SMS notifications but user says "email only at MVP," note which notification events are deferred.

---

### C5 — Payment processing needed?

**Question:** Does the app handle money? Subscriptions, one-time payments, marketplace payouts, invoicing?

**Smart default:** "No payment processing at MVP. Will evaluate Stripe for future phases."

**Stop gate:** No

---

### C6 — External integrations confirmation

**Question:** In Phase 2 (P2-3) we identified these integrations: {list from CONFIG.MVP_INTEGRATIONS}. Are there any we missed? Any that should be deferred from MVP?

**Smart default:** "No additional integrations beyond what was identified in Phase 2."

**Stop gate:** No

---

### D2 — Database strategy?

**Question:** Where will your database live? (Supabase, PlanetScale, Neon, Self-hosted)

**Smart default:** "Supabase PostgreSQL (managed, free tier, includes connection pooler)."

**Stop gate:** No

---

### D3 — Multi-tenancy needed?

**Question:** Does each customer get their own isolated data? (Row-level, schema-level, database-level, or single-tenant)

**Smart default:** "Single-tenant for MVP. Row-level multi-tenancy designed in but not enforced until needed."

**Stop gate:** No

---

### D4 — Compliance requirements?

**Question:** Does your app need to comply with HIPAA, PCI DSS, SOC 2, GDPR, or other regulations?

**Smart default:** "No specific compliance requirements. Standard security best practices."

**Stop gate:** No

**Red flags Claude should watch for:**
- User says "it's a healthcare app" but didn't mention HIPAA → ask about it
- User says "we process payments" but didn't mention PCI → ask about it
- User says "we have EU customers" but didn't mention GDPR → ask about it

---

### P4-1 — Search and filter capabilities

**Question:** For each major list screen we identified in Phase 3, what search and filter capabilities does it need? Think about: text search fields, dropdown filters, date range filters, sorting options, saved filters/views.

**Why it matters:** Search and filtering is a feature category that's easy to miss. A simple text search is S-sized. Full-text search with faceted filters is L-sized. Knowing this early affects both effort estimates and technology choices.

**Smart default:** "Text search + status filter for every list screen. Sort by created date (newest first). No saved views at MVP."

**Stop gate:** No

**Template for answer:**

| Screen | Text Search | Filters | Date Range | Sort Options | Saved Views | Priority |
|--------|------------|---------|------------|-------------|-------------|----------|
| Trip List | Trip ID, patient name, address | Status, driver, facility, vehicle type | Pickup date range | Date (asc/desc), status, driver | "Today's unassigned", "This week" | P0 |
| Invoice List | Invoice #, facility name | Status, facility | Invoice date, due date | Date, amount, status | "Overdue", "Ready to send" | P1 |

**What Claude does with this:**
- Stores as `CONFIG.SEARCH_REQUIREMENTS`
- Affects technology choice (PostgreSQL full-text search vs Elasticsearch)
- Each search/filter becomes part of the screen spec and API spec

---

### P4-2 — Audit trail and logging requirements

**Question:** Which actions need to be logged for audit purposes? Think about: regulatory requirements (HIPAA requires logging all PHI access), business requirements (who approved this invoice?), and debugging needs.

**Why it matters:** Audit logging is an architectural decision that affects every service. If needed, it must be designed in from the start — retrofitting audit logging is extremely painful because it touches every write operation.

**Smart default:** "Log all create/update/delete operations on P0 entities. Log all login/logout events. No PHI-level audit logging unless HIPAA applies."

**Stop gate:** No

**Red flags:**
- D4 indicated HIPAA → audit logging is mandatory for ALL PHI access (not just writes)
- Product handles financial data → audit logging on all financial transactions expected

**What Claude does with this:**
- Stores as `CONFIG.AUDIT_REQUIREMENTS` ("standard" | "hipaa" | "financial" | "none")
- Affects service spec architecture (audit middleware, event sourcing considerations)

---

### P4-3 — Scheduled and automated tasks

**Question:** Are there any tasks the system should perform automatically on a schedule? Examples:
- Send daily digest emails at 7am
- Auto-close trips that have been "In Progress" for more than 24 hours
- Generate monthly invoices on the 1st of each month
- Send reminder notifications 1 hour before scheduled trips
- Sync data with external system every 15 minutes

**Why it matters:** Scheduled tasks are a distinct architectural concern (cron jobs, queue workers, serverless functions). They need to be identified during intake because they affect infrastructure decisions and add development effort.

**Smart default:** "No scheduled tasks at MVP. All actions are user-initiated."

**Stop gate:** No

**Template for answer:**

| Task | Schedule | Description | Failure Behavior | Priority |
|------|----------|-------------|------------------|----------|
| Trip Reminders | 1 hour before pickup | SMS to driver and patient | Retry 3x, then alert dispatcher | P0 |
| Daily Digest | 7:00 AM local | Summary email to all admins | Skip and retry next day | P1 |
| Invoice Generation | 1st of month | Generate invoices for completed trips | Alert billing clerk, manual fallback | P1 |
| Stale Trip Cleanup | Every 6 hours | Flag trips in "In Progress" > 24h | Log warning, alert admin | P2 |

**What Claude does with this:**
- Stores as `CONFIG.SCHEDULED_TASKS`
- Affects infrastructure (need cron service, queue workers)
- Each scheduled task becomes a feature in the relevant service spec

---

### P4-4 — Data retention and deletion requirements

**Question:** How long should different types of data be kept? Can users delete their data? Are there legal requirements for how long data must be retained?

**Why it matters:** Data retention affects storage costs, backup strategy, and GDPR/HIPAA compliance.

**Smart default:** "Keep all data indefinitely. Soft delete (mark as deleted, don't remove). No GDPR deletion flow at MVP unless EU customers are expected."

**Stop gate:** No

---

### E3 — Launch date?

**Question:** When is the full product launch (not MVP, but the "real" launch with all planned features)?

**Smart default:** "MVP + 4-6 weeks for hardening and additional features."

**Stop gate:** No

---

### E4 — Who does QA?

**Question:** Who tests the product before release?

**Smart default:** "Developer self-tests with automated test suite (Vitest for unit, Playwright for E2E). Claude generates test cases for every feature."

**Stop gate:** No

---

### E5 — How will you get your first 100 users?

**Question:** How do you plan to acquire your first 100 users or customers?

**Smart default:** "No existing audience or distribution channel. Will need to build from scratch." Claude uses this to prioritize audience-building in the marketing steps.

**Stop gate:** No

---

### E6 — Marketing budget?

**Question:** Do you have a budget for marketing? ($0 Bootstrap / Small <$500/mo / Medium $500-$2K/mo / Growth $2K+/mo)

**Smart default:** "$0 (Bootstrap) — organic and free channels only."

**Stop gate:** No

---

### F2 — Which platforms? (skip if no mobile)

**Question:** Should the mobile app be available on iOS, Android, or both?

**Smart default:** "Both iOS and Android."

**Stop gate:** No

---

### F3 — Framework preference? (skip if no mobile)

**Question:** Mobile framework preference? React Native + Expo / Flutter / Native / No preference

**Smart default:** "Claude will recommend based on the tech stack and project requirements."

**Stop gate:** No

---

### F4 — Offline requirements? (skip if no mobile)

**Question:** Must the mobile app work without an internet connection? Which features?

**Smart default:** "Online-only for MVP. Cache recent data for brief connectivity gaps."

**Stop gate:** No

---

### F5 — Native device features? (skip if no mobile)

**Question:** Which native device features? Push notifications, Camera, GPS, Biometrics, Contacts, Bluetooth/NFC, Calendar, File system, None

**Smart default:** "Push notifications only for MVP."

**Stop gate:** No

---

### F6 — App store submission timeline? (skip if no mobile)

**Question:** When do you need the mobile app in the App Store / Play Store?

**Smart default:** "No fixed mobile deadline. Web MVP first, then mobile app follows."

**Stop gate:** No

---

## Phase 4 Completion Gate

No formal stop gate — all questions have smart defaults. But Claude should present a tech stack summary:

```
PHASE 4 TECH SUMMARY:
  Stack: {frontend} + {backend} + {database}
  Real-time: {SSE / WebSocket / None}
  Notifications: {channels}
  Integrations: {count} confirmed
  Compliance: {requirements}
  Scheduled tasks: {count}
  Search: {approach}
  Audit logging: {level}
```

---

# PHASE 4.5: Deep Discovery

> **Goal:** Probe deeper into business model, competitive landscape, user psychology, technical scale, data requirements, and compliance. These questions apply to ALL projects (not a separate mode).
> **Estimated time:** 30-45 minutes.
> **Stop gates:** 2 (G1, I2)

---

## Category G: Business Model Deep Dive

> Goal: Understand the revenue engine, unit economics, and pricing strategy at a level that informs technical architecture (billing service complexity, payment flows, pricing tiers).

---

### G1* — What is the revenue model breakdown?

**Question:** How does this product make money? Don't just say "subscription" — describe the tier structure, pricing anchors, margins, and whether there are multiple revenue streams (e.g., subscription + marketplace commission + premium features).

**Why it matters:** The revenue model directly shapes the billing service complexity, payment flows, and pricing page design. A simple flat-rate subscription needs minimal billing logic. A usage-based model with overages needs metering, alerts, and invoice generation. A marketplace model needs split payments, escrow, and tax handling.

**Smart default:** N/A — this is a stop gate. Claude must get an answer.

**Stop gate:** YES

---

### G2 — What is the customer acquisition cost target?

**Question:** How do you plan to acquire users, and what is the target cost per acquisition? (Organic/SEO, paid ads, partnerships, sales team, referral, product-led growth)

**Why it matters:** Informs marketing infrastructure needs (analytics, attribution, referral systems), onboarding optimization priority, and whether the product needs a self-serve signup flow vs. a sales-assisted demo flow.

**Smart default:** "Product-led growth with organic acquisition. No paid advertising at launch."

**Stop gate:** No

---

### G3 — What is the expected customer lifetime value and churn tolerance?

**Question:** How long do you expect a customer to stay? What monthly churn rate would be acceptable vs. alarming? What is the expected revenue per customer per month?

**Why it matters:** LTV/CAC ratio determines growth viability. High-churn products need retention features (re-engagement emails, usage nudges, win-back campaigns). Low-churn products can invest more in onboarding depth.

**Smart default:** "Target LTV: 12+ months. Acceptable churn: <5% monthly. Revenue per customer: TBD after pricing."

**Stop gate:** No

---

### G4 — What are the unit economics?

**Question:** What does it cost to serve one user? Consider: infrastructure costs per user, support costs per user, third-party API costs per user, storage costs per user.

**Why it matters:** Determines infrastructure architecture (shared vs. dedicated resources), pricing floor, and which features are cost-viable at scale.

**Smart default:** "Typical SaaS unit economics — infrastructure cost <10% of revenue per user."

**Stop gate:** No

---

### G5 — What does the competitive pricing landscape look like?

**Question:** What do competitors charge? Where do you position on price — premium, mid-market, or budget? What feature is your pricing anchor (the thing that justifies your price)?

**Why it matters:** Informs the pricing page design, feature gating strategy, and which features need to be in the free/low tier vs. premium tier.

**Smart default:** "Mid-market pricing. Competitors range from $X-$Y/month. Position on value, not price."

**Stop gate:** No

---

## Category H: Competitive Landscape

> Goal: Go beyond "who are the competitors" (covered in Phase 1) to understand strategic positioning, moat building, and anti-features.

---

### H1 — What is each competitor's biggest weakness you plan to exploit?

**Question:** For each competitor you listed, what is their biggest weakness? (UX is terrible, too expensive, missing a key feature, bad customer support, outdated technology, can't customize)

**Why it matters:** These weaknesses become your differentiating features. They should be prioritized in the roadmap and highlighted in marketing.

**Smart default:** "Will research during Tribunal phase (Step 3)."

**Stop gate:** No

---

### H2 — What switching costs exist for users on competitor products?

**Question:** If a potential customer is currently using a competitor, what makes it hard to switch? (Data locked in, team trained on it, integrations built, contracts/annual plans, emotional attachment)

**Why it matters:** High switching costs mean you need migration tools, data import features, and longer sales cycles. Low switching costs mean fast adoption but also easy churn.

**Smart default:** "Moderate switching costs — users have data in existing tools but no long-term contracts."

**Stop gate:** No

---

### H3 — What moat or defensibility do you have?

**Question:** What will prevent competitors from copying your product? (Network effects, proprietary data, brand trust, integration ecosystem, patents, speed-to-market, niche expertise)

**Why it matters:** Shapes long-term product strategy. If the moat is data, the product needs to collect and leverage data early. If the moat is network effects, the product needs viral/social features.

**Smart default:** "Speed-to-market and niche focus. Will develop additional moat through user data and integrations."

**Stop gate:** No

---

### H4 — Is there speed-to-market pressure?

**Question:** Is a competitor about to launch something similar? Is there a market window closing? Does a regulation change create urgency?

**Why it matters:** If yes, scope aggressively for MVP and defer non-essentials. If no, invest in getting it right rather than getting it fast.

**Smart default:** "No immediate competitive pressure. Focus on quality over speed."

**Stop gate:** No

---

### H5 — What features do competitors have that you explicitly choose NOT to build?

**Question:** What features do competitors offer that you will intentionally NOT include? Why? (Too complex, wrong audience, not aligned with positioning, technical debt magnet)

**Why it matters:** Anti-features are as important as features. They define focus and prevent scope creep. Document them to resist future "but competitor X has it" pressure.

**Smart default:** "Will identify during Tribunal phase (Step 3)."

**Stop gate:** No

---

## Category I: User Psychology & Behavior

> Goal: Understand the emotional and behavioral context of product usage to inform UX decisions, onboarding design, and retention strategies.

---

### I1 — What emotional state is the user in when they open your app?

**Question:** When a user opens your product, what are they feeling? (Stressed and urgent, curious and exploring, bored and browsing, focused and productive, frustrated and problem-solving)

**Why it matters:** Emotional state determines UX tone. A stressed user needs fast, clear actions with no friction. A curious user needs guided exploration. A frustrated user needs immediate problem resolution. This shapes everything from copy to color to interaction patterns.

**Smart default:** "Focused and task-oriented — they open the app to accomplish a specific goal."

**Stop gate:** No

---

### I2* — What is the "aha moment"?

**Question:** What is the single action or experience after which users become retained? (Created their first project, invited a team member, saw their first report, completed their first workflow, got their first result)

**Why it matters:** The aha moment defines the onboarding flow's primary goal. Every screen before the aha moment should reduce friction toward it. Every feature after should reinforce it. This is the most important UX decision in the product.

**Smart default:** N/A — this is a stop gate. Claude must get an answer.

**Stop gate:** YES

---

### I3 — What habits do your target users already have that you can piggyback on?

**Question:** What tools/apps do your users already use daily? What workflows are they already comfortable with? What mental models do they already have?

**Why it matters:** Piggybacking on existing habits reduces learning curve. If users already use Slack, integrate with Slack. If they're used to spreadsheets, make your UI grid-like. If they check email first thing, send morning digest emails.

**Smart default:** "Standard web app patterns — familiar with dashboards, forms, and tables."

**Stop gate:** No

---

### I4 — What is the social dynamic?

**Question:** Do users collaborate, compete, or work solo? Are there teams? Hierarchies? Public/private activities? Shared workspaces?

**Why it matters:** Social dynamics shape permissions, sharing, activity feeds, and collaboration features. A solo tool needs good individual workflows. A team tool needs shared state, commenting, and notifications.

**Smart default:** "Team-based collaboration with role-based access. No competitive elements."

**Stop gate:** No

---

### I5 — What is the trust barrier?

**Question:** What must users believe before they commit their data or money? (The product works, their data is safe, the company won't disappear, it integrates with their tools, other people like them use it)

**Why it matters:** Trust barriers determine what social proof, security badges, testimonials, certifications, or guarantees need to be visible in the product and marketing. High-trust products (health, finance) need more security signals.

**Smart default:** "Standard trust barriers — users need to see the product works before paying. Social proof and security basics sufficient."

**Stop gate:** No

---

## Category J: Technical Constraints & Scale

> Goal: Understand the technical boundaries that will shape architecture decisions beyond what Phase 4 covers.

---

### J1 — What is the expected peak concurrent users?

**Question:** At launch, how many users might be using the app at the same time? At 12 months? Are there predictable traffic spikes? (Monday mornings, end of month, seasonal)

**Why it matters:** Determines infrastructure sizing, caching strategy, database connection pooling, and whether auto-scaling is needed at launch or can be deferred.

**Smart default:** "Launch: <100 concurrent. 12 months: <1000 concurrent. No predictable spikes."

**Stop gate:** No

---

### J2 — Are there hard real-time requirements?

**Question:** Are there features that must respond within a specific time? (Chat messages <500ms, live tracking updates every 3 seconds, notification within 10 seconds of trigger, payment confirmation within 2 seconds)

**Why it matters:** Hard real-time requirements drive technology choices (WebSockets vs SSE vs polling), infrastructure requirements (dedicated servers vs serverless), and testing strategies.

**Smart default:** "No hard real-time requirements. Standard web response times (API <500ms, page load <3s)."

**Stop gate:** No

---

### J3 — What data volumes are expected?

**Question:** How many rows per table at 12 months? How much file storage? How many API calls per day? Any tables that grow rapidly (events, logs, messages)?

**Why it matters:** Data volume determines database indexing strategy, pagination approach, archival policies, and whether you need data partitioning. A table with 1M rows needs different handling than one with 10K.

**Smart default:** "Small-to-medium data volumes. No table exceeding 100K rows in the first year."

**Stop gate:** No

---

### J4 — Are there regulatory data residency requirements?

**Question:** Must data stay in a specific geographic region? (EU data in EU servers, US healthcare data in US, Australian financial data in Australia)

**Why it matters:** Data residency constraints determine hosting region, CDN configuration, and may require multi-region deployment architecture even at MVP.

**Smart default:** "No data residency requirements. Single-region deployment sufficient."

**Stop gate:** No

---

### J5 — What third-party APIs are critical, and what's the fallback?

**Question:** For each critical third-party API (payment, email, maps, auth), what happens if it goes down? Can the app function in a degraded mode? Is there a backup provider?

**Why it matters:** Critical API dependencies need fallback strategies, circuit breakers, and possibly multi-provider support. Identifying these early prevents outage cascades.

**Smart default:** "Payment and auth are critical with no fallback. Email can queue. All others can degrade gracefully."

**Stop gate:** No

---

## Category K: Data & Analytics Requirements

> Goal: Understand what data the business needs to make decisions, what users need to see, and what needs to be exported.

---

### K1 — What dashboards or reports does each user type need?

**Question:** For each user type, what data do they need to see at a glance? What reports do they generate? Daily, weekly, monthly?

**Why it matters:** Dashboards are often the most complex screens in an app. Understanding what data is needed early ensures the right data is collected and the right aggregation queries are planned.

**Smart default:** "Admin dashboard with key metrics. User-facing activity summary. Monthly report export."

**Stop gate:** No

**Cross-reference:** Supplements P2-5 (reports and dashboards). If P2-5 was already detailed, this question can be skipped.

---

### K2 — What business metrics must the system track?

**Question:** What KPIs drive business decisions? (Revenue, MRR, churn, DAU/MAU, conversion rate, time-to-value, NPS, feature adoption, support ticket volume)

**Why it matters:** Business metrics determine what analytics events to instrument from day one. Retroactively adding analytics is painful and loses historical data.

**Smart default:** "Standard SaaS metrics: MRR, churn, DAU/MAU, feature adoption."

**Stop gate:** No

---

### K3 — Is there a data export requirement?

**Question:** Do users or admins need to export data? In what formats? (CSV, PDF, Excel, API access for customers, GDPR data export, bulk data for analytics)

**Why it matters:** Export features are often forgotten until a customer asks for them. They require background jobs, file generation, and download infrastructure.

**Smart default:** "CSV export for lists and reports. PDF for individual records."

**Stop gate:** No

---

### K4 — Are there audit trail requirements?

**Question:** Does the system need to track who changed what, when, and why? At what granularity? (Every field change, just status changes, just security-relevant actions)

**Why it matters:** Audit trails affect database design (shadow tables, event sourcing, or simple audit log), performance, and storage. Compliance-heavy industries (healthcare, finance) often require granular audit trails.

**Smart default:** "Basic audit trail — track who created/updated/deleted records with timestamps."

**Stop gate:** No

**Cross-reference:** Supplements P4-2 (audit trail requirements). If P4-2 was already detailed, this question can be skipped.

---

## Category L: Compliance & Risk

> Goal: Understand regulatory and risk requirements that affect architecture, data handling, and operational procedures.

---

### L1 — What industry-specific regulations apply?

**Question:** Beyond general data protection (GDPR/CCPA), what industry-specific regulations apply? (HIPAA for healthcare, PCI-DSS for payments, SOX for financial reporting, FERPA for education, SOC 2 for enterprise sales)

**Why it matters:** Industry regulations dictate encryption requirements, access controls, audit logging, data retention, and sometimes even hosting providers. They must be architected in, not bolted on.

**Smart default:** "No industry-specific regulations. Standard security best practices sufficient."

**Stop gate:** No

**Cross-reference:** Supplements D4 (compliance requirements). If D4 was already detailed, confirm or add specifics here.

---

### L2 — What data classification levels exist?

**Question:** Categorize your data: What is public? Internal? Confidential? Restricted? (e.g., user profiles might be internal, payment data is restricted, published content is public)

**Why it matters:** Data classification determines encryption at rest/in transit requirements, access control granularity, backup encryption, and log redaction policies.

**Smart default:** "Two levels: public (marketing content) and internal (all user/business data). No restricted data beyond authentication credentials."

**Stop gate:** No

---

### L3 — What is the disaster recovery requirement?

**Question:** If the database is lost, how much data can you afford to lose? (RPO: Recovery Point Objective — last 5 minutes, last hour, last day) How fast must the system be back online? (RTO: Recovery Time Objective — minutes, hours, day)

**Why it matters:** RPO/RTO determines backup frequency, replication strategy, and disaster recovery infrastructure costs. A 5-minute RPO needs real-time replication. A 24-hour RPO needs daily backups.

**Smart default:** "RPO: 1 hour (hourly backups). RTO: 4 hours (reasonable recovery time). Daily backups minimum."

**Stop gate:** No

---

### L4 — Are there accessibility requirements beyond WCAG AA?

**Question:** Does the product need to meet specific accessibility standards? (Section 508 for US government, EN 301 549 for EU, specific disability support like screen reader optimization, high contrast, voice control, motor impairment accommodations)

**Why it matters:** Accessibility requirements beyond WCAG AA affect component library choices, testing requirements, and design constraints. Some government contracts require Section 508 compliance as a hard requirement.

**Smart default:** "WCAG AA compliance standard. No additional accessibility requirements."

**Stop gate:** No

---

## Deep Follow-Up Questions for Categories A-F

> These follow-ups are always asked alongside their parent question. They extract deeper insights that inform architecture and planning.

---

### A1-DEEP — What adjacent problems could this product solve in 12-18 months?

**Parent:** A1 (What does this product do?)

**Question:** Beyond the core problem, what related problems could this product eventually solve? What would version 2.0 look like?

**Why it matters:** Adjacent problem awareness prevents architecture decisions that close off future directions. If the product might expand into analytics, design the data model to support it from the start.

**Smart default:** "Focus on core problem first. Will explore expansion during hardening phase (Step 33)."

---

### A2-DEEP — What is the decision-making process for purchasing?

**Parent:** A2 (Who pays?)

**Question:** Who approves the purchase? How long is the sales cycle? Is it a single decision-maker or a committee? Is there a procurement process?

**Why it matters:** Sales cycle length determines whether you need a self-serve flow, a demo booking system, a free trial, or a sales pipeline. Committee decisions need shareable comparison documents and admin approval flows.

**Smart default:** "Single decision-maker. Self-serve purchase. No procurement process."

---

### A3-DEEP — What happens when the user can't complete their core action?

**Parent:** A3 (What is the ONE thing users do every day?)

**Question:** What is the fallback when the core action fails? What does the user do? Call support? Use a workaround? Wait?

**Why it matters:** The failure path of the core action is the highest-priority error handling scenario. It determines support infrastructure, error messaging, and recovery flows.

**Smart default:** "User sees an error message and retries. Support via email for persistent issues."

---

### B1-DEEP — What is each user type's technical sophistication?

**Parent:** B1 (List every user type)

**Question:** For each user type, rate their technical sophistication: tech-native (comfortable with complex UIs), standard (uses common web apps), basic (needs simple, guided interfaces), resistant (actively dislikes technology).

**Why it matters:** Technical sophistication determines UI complexity, onboarding depth, tooltip density, and whether features need a "simple mode" vs "advanced mode."

**Smart default:** "Standard — users are comfortable with common web applications."

---

### B2-DEEP — What workarounds do users currently use?

**Parent:** B2 (Biggest frustration per user type)

**Question:** What tools are users currently duct-taping together? (Spreadsheets + email + sticky notes? Multiple apps with manual copy-paste? Paper forms?)

**Why it matters:** Workarounds reveal the real workflow and the real data model. A spreadsheet that users maintain is a specification in disguise — its columns are your fields, its formulas are your business rules, its conditional formatting is your validation.

**Smart default:** "Spreadsheets and email for most workflows."

---

### C1-DEEP — What technologies has the team worked with before?

**Parent:** C1 (Strong tech opinions?)

**Question:** What languages, frameworks, and tools does the team have production experience with? What has burned them in the past?

**Why it matters:** Team experience dramatically affects development velocity. A team with 5 years of React experience will build faster in React than in a theoretically "better" framework they've never used.

**Smart default:** "Team experience aligns with the recommended stack."

---

### D1-DEEP — What is the deployment environment constraint?

**Parent:** D1 (Deployment target)

**Question:** Are there constraints on the deployment environment? (Must be on-premise, must be in a specific cloud, must not use containers, must be serverless, budget ceiling for hosting)

**Why it matters:** Deployment constraints can override architecture decisions. On-premise requirements eliminate serverless. Budget ceilings affect managed service choices.

**Smart default:** "Cloud deployment, no specific constraints. Budget-conscious — prefer managed services with free tiers."

---

### E1-DEEP — What is the team's availability?

**Parent:** E1 (Developer count)

**Question:** Are developers full-time on this project or splitting time? What percentage of their time goes to this project? Are there blackout periods (holidays, other projects, conferences)?

**Why it matters:** A "2-developer team" that's 50% allocated is really a 1-developer team. Timeline estimates must account for actual availability, not theoretical capacity.

**Smart default:** "Full-time dedication to this project."

---

### E2-DEEP — What happens if the MVP deadline is missed?

**Parent:** E2 (MVP date)

**Question:** Is the MVP date a hard deadline or aspirational? What are the consequences of missing it? (Lose funding, miss market window, contractual obligation, just a goal)

**Why it matters:** Hard deadlines require ruthless scope management. Aspirational dates allow quality-first development. This determines how aggressively to cut scope during planning.

**Smart default:** "Aspirational target. Quality over speed."

---

### F1-DEEP — What mobile-specific behaviors are critical?

**Parent:** F1 (Mobile app needed?)

**Question:** If mobile: What must work offline? What needs push notifications? What native device features are needed? (Camera, GPS, biometrics, contacts, calendar)

**Why it matters:** Mobile-specific behaviors drive framework choice (React Native vs Flutter vs native), determine offline sync architecture, and scope native feature implementation.

**Smart default:** "Online-only mobile experience. Push notifications for key alerts. No native device features beyond camera for profile photos."

**Condition:** Only ask if HAS_MOBILE is "true".

---

# PHASE 5: Validation & Completeness Check

> **Goal:** Verify that nothing was missed. Cross-reference all collected information against known completeness criteria. This is the final quality gate before generating the project brief.
> **Estimated time:** 5-10 minutes.
> **Stop gates:** 0 (but has a final gate before proceeding)

---

## Automated Checks (Claude performs these, no user input needed)

### P5-CHECK-1: Entity-Service Coverage

Claude runs: "For every entity in CONFIG.MVP_ENTITIES, verify at least one service covers it."

If an entity has no service: "You listed {Entity} in A6 but no service manages it. Is it part of an existing service, or do we need a new one?"

### P5-CHECK-2: User-Screen Coverage

Claude runs: "For every user type in B1, verify they have at least 3 screens (landing, primary workflow, settings/profile)."

If a user type has <3 screens: "The {Role} user type only has {N} screens. Most roles need at least a dashboard, a primary workflow screen, and a settings screen. Are we missing anything?"

### P5-CHECK-3: Integration Completeness

Claude runs: "For every integration in CONFIG.MVP_INTEGRATIONS, verify it has: service mapping, direction, priority, and phase assignment."

If incomplete: "The {Integration} integration is missing {field}. Can you clarify?"

### P5-CHECK-4: Workflow-Notification Coverage

Claude runs: "For every state transition identified in A7 and P3-3, verify a notification decision exists (even if the decision is 'no notification needed')."

If missing: "When a {Entity} moves from {State A} to {State B}, should anyone be notified?"

### P5-CHECK-5: Feasibility Math

Claude calculates:
```
Services: {N from P2-1}
Unique screens: {N from P3-2}
API endpoints (estimated): {N from service operations}
Estimated tasks (screens x 3 avg tasks per screen): {N}
Developers: {from E1}
Weeks to MVP: {from E2}
Features per dev per week: ~2-3
Max features at MVP: {developers x 2.5 x weeks}
```

If total estimated tasks exceed capacity: "Based on what we've discovered, you have approximately {N} features across {M} services and {S} screens. With {D} developer(s) and {W} weeks, you can build approximately {MAX} features at MVP. We need to either extend the timeline, add developers, or reduce scope. Which services could be deferred to post-MVP?"

### P5-CHECK-6: Revenue Stream Coverage

Claude runs: "For every revenue stream identified in G1, verify at least one service handles that revenue flow (e.g., subscription revenue → billing service, marketplace commission → payment service + commission calculation)."

### P5-CHECK-7: Competitive Differentiation Coverage

Claude runs: "For every competitor weakness identified in H1, verify at least one planned feature directly addresses that weakness as a differentiator. Flag any competitor weaknesses with no corresponding feature."

### P5-CHECK-8: Aha Moment Reachability

Claude runs: "Verify the 'aha moment' identified in I2 is achievable within the onboarding flow. Trace the path: signup → onboarding screens → aha moment. Flag if the aha moment requires features not available in Phase 1 or MVP."

---

## Final Questions

### P5-1 — Anything else?

**Question:** We've covered {N} services, {S} screens, {I} integrations, and {W} workflows. Is there anything else this system needs to do that we haven't discussed? Think about: edge cases, seasonal features, one-time operations, admin tools, internal tools, regulatory requirements.

**Smart default:** "Nothing else to add."

**Stop gate:** No (but Claude waits for explicit confirmation)

---

### P5-2 — Hard constraints or non-negotiable requirements?

**Question:** List anything that is absolutely non-negotiable. Things like: "Must use SQL Server because of existing infrastructure," "Must comply with HIPAA," "Must support Internet Explorer 11," "Must be translated into Spanish." These are constraints, not features — they override all other decisions.

**Smart default:** "No hard constraints beyond what was already discussed."

**Stop gate:** No

---

## Phase 5 Final Gate

```
PHASE 5 FINAL VALIDATION:

Automated checks:
- [ ] P5-CHECK-1: Every entity covered by a service ({passed/failed})
- [ ] P5-CHECK-2: Every user type has adequate screens ({passed/failed})
- [ ] P5-CHECK-3: All integrations fully specified ({passed/failed})
- [ ] P5-CHECK-4: Notification decisions for all state transitions ({passed/failed})
- [ ] P5-CHECK-5: Feasibility math: {FEASIBLE / TIGHT / NEEDS_SCOPE_CUT}
- [ ] P5-CHECK-6: Every revenue stream has a corresponding service ({passed/failed})
- [ ] P5-CHECK-7: Every competitor weakness maps to a differentiating feature ({passed/failed})
- [ ] P5-CHECK-8: Aha moment reachable within onboarding flow ({passed/failed})

Manual verification:
- [ ] User confirmed "nothing else to add" (P5-1)
- [ ] Hard constraints documented (P5-2)
- [ ] Service count: {N} (matches CONFIG.EXPECTED_SERVICE_COUNT or explained)
- [ ] Screen count: {N} (matches B1 estimates or explained)
- [ ] Entity count: {N}
- [ ] Integration count: {N}
- [ ] User types: {N}

CONFIRMED INTAKE SUMMARY:
  Project: {name} — {description}
  Project type: {web / mobile / web+mobile}
  Services: {count} services ({P0 count} P0, {P1 count} P1, {P2 count} P2)
  Screens: {count} unique screens across {user type count} roles
  Entities: {count} with {count} state machines mapped
  Integrations: {count} ({count} at MVP)
  Notifications: {count} event types across {count} channels
  Workflows: {count} traced end-to-end
  Import/export: {count} operations
  Scheduled tasks: {count}
  Developers: {count}, MVP target: {date} ({weeks} weeks)
  Feasibility: {FEASIBLE / TIGHT / NEEDS_SCOPE_CUT}
```

**Gate instruction for Claude:** Present the full summary. User must explicitly confirm before generating the project brief. If the user wants to change anything, re-enter the relevant phase. Do NOT generate the project brief until the user says the summary is correct.

---

## CONFIG Fields Generated by Intake

After all 5 phases, the STATE BLOCK CONFIG contains these fields (in addition to auto-detected stack fields):

```
// From Phase 1
PROJECT_TYPE: "web" | "mobile" | "web+mobile"
HAS_WEB: "true" | "false"
HAS_MOBILE: "true" | "false"
PROJECT_NAME: "..."
PROJECT_DESCRIPTION: "..."
EXPECTED_SERVICE_COUNT: 0
MVP_ENTITIES: ["Trip", "Driver", "Vehicle", ...]
MVP_ENTITY_STATES: { "Trip": ["Requested", "Scheduled", ...], ... }
PERSONAS: [{ role: "...", description: "...", screenCount: 0, internal: true }]
COMPETITORS: ["...", "..."]
DEPLOY_TARGET: "vercel" | "aws" | "docker" | "other"
TEAM_SIZE: 0
MVP_DATE: "YYYY-MM-DD"
TIMELINE_WEEKS: 0

// From Phase 2
MVP_SERVICES: [{ name: "...", description: "...", entities: [...], roles: [...], screens: 0, endpoints: 0, priority: "P0" }]
MVP_INTEGRATIONS: [{ service: "...", target: "...", direction: "...", priority: "P0" }]
IMPORT_EXPORT: [{ operation: "...", entity: "...", format: "...", frequency: "..." }]
DASHBOARDS: [{ role: "...", name: "...", kpis: [...], priority: "P0" }]

// From Phase 3
MVP_SCREENS: 0 // total unique screens
MVP_SCREENS_PER_ROLE: { "Dispatcher": 11, "Admin": 15, ... }
MVP_WORKFLOWS: [{ name: "...", role: "...", steps: 0, service: "..." }]
PERMISSION_MATRIX: { "Dispatcher": { "Trip": "CRUD All", "Driver": "Read All", ... }, ... }
NOTIFICATION_EVENTS: [{ trigger: "...", channel: "...", recipient: "...", urgency: "..." }]

// From Phase 4
SEARCH_REQUIREMENTS: [{ screen: "...", textSearch: [...], filters: [...] }]
AUDIT_REQUIREMENTS: "standard" | "hipaa" | "financial" | "none"
SCHEDULED_TASKS: [{ name: "...", schedule: "...", description: "...", priority: "P0" }]
REALTIME_STRATEGY: "sse" | "websocket" | "none"
NOTIFICATION_CHANNELS: ["email", "sms", "push", "in-app"]
MULTI_TENANT: "true" | "false"
AUTH_METHOD: "jwt" | "session" | "oauth" | "none"

// From Phase 5
FEASIBILITY: "FEASIBLE" | "TIGHT" | "NEEDS_SCOPE_CUT"
HARD_CONSTRAINTS: ["...", "..."]
```
