# Beginner's Glossary

> Plain-English definitions for every technical term used in this kit.
> If a term isn't here, ask Claude: "What does [term] mean in simple terms?"

---

## Project & Planning Terms

| Term | What It Means |
|------|--------------|
| **MVP** | Minimum Viable Product — the smallest version of your product that's useful. Build this first, add more later. |
| **Greenfield** | A brand-new project starting from scratch (no existing code). |
| **Monorepo** | One big folder that holds multiple apps together (e.g., your website AND your mobile app in the same project). The opposite is having separate folders/repos for each. |
| **Stack** | The combination of tools/languages your project uses. Example: "Next.js + PostgreSQL + Prisma" is a stack. |
| **Scaffold** | Auto-generating the starting folder structure and files for a project. Like getting a pre-built house frame instead of starting from raw lumber. |
| **Spec** | Specification — a detailed description of what something should do, written BEFORE you build it. |
| **Gate checkpoint** | A pause in the autopilot where Claude shows you what it's done and waits for your "looks good" before continuing. |
| **Tribunal** | This kit's name for its research engine. It simulates a debate about your project — like having 5 experts argue about the best approach, then giving you the verdict. |
| **Placeholder** | A `{{VARIABLE_NAME}}` in a template that gets replaced with your project's actual values. Like a fill-in-the-blank form. |
| **State files** | Files that track where you are in the project (STATUS.md, handoff.md, etc.). They help Claude remember what's been done even if the conversation resets. |
| **PROTECT-LIST** | A list of files that should never be changed without your explicit permission. Safety net for important stuff. |

---

## Technical Terms

| Term | What It Means |
|------|--------------|
| **API** | Application Programming Interface — how your app's frontend (what users see) talks to the backend (where data lives). Think of it as a waiter taking orders between the kitchen and the dining room. |
| **Backend** | The behind-the-scenes part of your app — databases, business logic, user accounts. Users never see this directly. |
| **Frontend** | The part of your app users actually see and interact with — buttons, pages, forms. |
| **Database** | Where your app stores information permanently. Like a giant spreadsheet that your app reads from and writes to. |
| **ORM** | Object-Relational Mapper — a tool that lets your code talk to the database using your programming language instead of raw database commands. Makes database work easier. Examples: Prisma, Drizzle, SQLAlchemy. |
| **Framework** | A pre-built toolkit that gives you a head start. Instead of building everything from scratch, you start with common features already built. Examples: Next.js, Django, Rails. |
| **Deployment** | Putting your app on the internet so real users can access it. Going from "works on my computer" to "works for everyone." |
| **Environment variables** | Secret settings (passwords, API keys) stored outside your code so they don't accidentally get shared. Like keeping your house key separate from your house blueprints. |
| **CI/CD** | Continuous Integration / Continuous Deployment — automatic systems that test and deploy your code whenever you make changes. Like having a robot that checks your homework and mails it in for you. |
| **Docker** | A tool that packages your app with everything it needs to run, so it works the same on every computer. Like shipping a product in a standardized container. |
| **Git** | A version control system — it tracks every change you make to your code so you can undo mistakes and collaborate with others. Like "Track Changes" in Word, but for code. |
| **TypeScript** | JavaScript with added safety checks. It catches common mistakes before your code runs, like a spell-checker for programming. |

---

## Architecture Terms

| Term | What It Means |
|------|--------------|
| **Auth / Authentication** | How your app verifies who someone is (login, passwords, "Sign in with Google"). |
| **Authorization / RBAC** | Who's allowed to do what. RBAC = Role-Based Access Control. Example: admins can delete users, regular users can't. |
| **CORS** | Cross-Origin Resource Sharing — a security rule that controls which websites can talk to your API. If your frontend is on `app.com` and your API is on `api.com`, CORS controls whether they can communicate. |
| **CRUD** | Create, Read, Update, Delete — the four basic things you do with data. Almost every feature in an app is some combination of these. |
| **JWT** | JSON Web Token — a small encrypted ID card your app gives users after login. They show it with every request to prove who they are. |
| **REST** | A common pattern for building APIs. Uses standard web addresses (URLs) and actions (GET, POST, PUT, DELETE) to work with data. |
| **tRPC** | A tool that lets your frontend and backend share code, so they always agree on what data looks like. Eliminates a whole class of bugs. |
| **Middleware** | Code that runs between a request arriving and your app handling it. Like a security guard checking IDs at the door before letting people into the building. |
| **Webhook** | A way for external services to notify your app when something happens. Like a doorbell — Stripe rings it when a payment comes through. |
| **Rate limiting** | Preventing users from making too many requests too fast. Stops abuse and keeps your app running smoothly for everyone. |

---

## Database Terms

| Term | What It Means |
|------|--------------|
| **Schema** | The structure/layout of your database — what tables exist, what columns they have, and how they relate. Like the blueprint for a filing cabinet. |
| **Migration** | A change to your database structure. Instead of editing the database directly, you write a migration file that describes the change, so it can be applied consistently everywhere. |
| **Seed data** | Fake but realistic data loaded into your database for testing. Instead of testing with an empty app, you fill it with sample users, products, etc. |
| **PostgreSQL** | A popular, powerful, free database. This is where most production apps store their data. |
| **RLS** | Row-Level Security — database rules that control which rows a user can see. In a multi-tenant app, it ensures Company A can't see Company B's data. |

---

## Design Terms

| Term | What It Means |
|------|--------------|
| **Design tokens** | Named values for colors, fonts, spacing, and other visual properties. Instead of writing `#3B82F6` everywhere, you use `--color-primary` — change it once, it updates everywhere. |
| **Component** | A reusable building block of your UI. A "Button" component can be used on every page without rewriting the code. |
| **Responsive** | A design that works on all screen sizes — phone, tablet, desktop. The layout automatically adjusts. |
| **Tailwind** | A CSS framework that lets you style things by adding short class names directly in your HTML. Instead of writing separate CSS files, you write `class="bg-blue-500 text-white p-4"`. |
| **Storybook** | A tool that lets you view and test your UI components in isolation, outside of your full app. Like a showroom for your buttons, forms, and cards. |
| **Anti-slop** | This kit's term for design quality rules that prevent the generic "AI template" look. Rules like "no gradients without purpose" and "no stock-photo hero sections." |

---

## Testing Terms

| Term | What It Means |
|------|--------------|
| **Unit test** | Testing one small piece of code in isolation. "Does this function correctly calculate the total?" |
| **Integration test** | Testing that multiple pieces work together. "Does the API correctly save to the database?" |
| **E2E test** | End-to-End test — testing the full user flow. "Can a user sign up, create a project, and invite a teammate?" Simulates a real user clicking through the app. |
| **Playwright** | A tool that opens a real browser and clicks through your app automatically, running E2E tests. |
| **Jest / Vitest** | Tools that run unit and integration tests for JavaScript/TypeScript code. |
| **Mock** | A fake version of something used in tests. Instead of calling the real Stripe API during tests, you use a mock that pretends to be Stripe. |
| **Coverage** | What percentage of your code is tested. 80% coverage means tests exercise 80% of your code paths. |

---

## Business Terms

| Term | What It Means |
|------|--------------|
| **SaaS** | Software as a Service — an app people pay for monthly/yearly (like Slack, Notion, Netflix). Instead of selling a download, you sell access. |
| **Multi-tenant** | One app serving multiple companies/organizations. Each "tenant" sees only their data. Most SaaS apps are multi-tenant. |
| **Churn** | Users who cancel or stop using your product. Low churn = people stick around. |
| **ARPU** | Average Revenue Per User — how much money each user generates on average. |
| **MRR** | Monthly Recurring Revenue — total money coming in each month from subscriptions. |
| **Runway** | How many months of cash you have left before running out. If you have $50K and spend $10K/month, your runway is 5 months. |
| **Unit economics** | Does each customer make you money or cost you money? Revenue per user minus cost per user. |
| **Dunning** | The process of recovering failed payments. When a credit card expires, dunning sends emails like "Please update your payment method." |

---

## Mobile Terms

| Term | What It Means |
|------|--------------|
| **React Native** | A framework for building mobile apps (iOS + Android) using JavaScript/TypeScript. Write once, run on both platforms. |
| **Expo** | A toolkit that makes React Native easier. Handles the hard parts (building, deploying, push notifications) so you can focus on your app. |
| **OTA updates** | Over-The-Air updates — pushing app updates directly to users' phones without going through the App Store review process. |
| **Deep linking** | When a URL opens a specific screen in your mobile app instead of just the home screen. Like `myapp://profile/123` opening user #123's profile. |

---

## Legal Terms

| Term | What It Means |
|------|--------------|
| **ToS** | Terms of Service — the legal agreement users accept when they use your product. "By using this app, you agree to..." |
| **DPA** | Data Processing Agreement — a legal document required when you handle other companies' data (especially in the EU). |
| **EULA** | End-User License Agreement — defines what users can and can't do with your software. |
| **GDPR** | General Data Protection Regulation — EU law about handling personal data. Requires consent, data portability, right to deletion. |
| **PII** | Personally Identifiable Information — any data that can identify a person (name, email, phone, address). Handle with care. |

---

*Don't see a term? Ask Claude: "What does [term] mean in the context of this project?"*
