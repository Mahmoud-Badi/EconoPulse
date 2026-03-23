# Developer Directory & Discoverability Guide for {{PROJECT_NAME}}

> **Part of the {{PROJECT_NAME}} Marketing Toolkit**
> Comprehensive guide to listing and promoting {{PROJECT_NAME}} in developer-focused directories, communities, and platforms.

---

## Why Developer Directories Are Different

Developer audiences are uniquely skeptical of marketing. They value:
- **Substance over hype**: Show what it does, not what you promise
- **Technical depth**: Documentation, code examples, architecture decisions
- **Community participation**: Contribute, don't just promote
- **Open source credibility**: Contributing to or being open source builds trust
- **Peer recommendations**: Developers trust other developers, not ads

**Golden rule for developer marketing**: Provide genuine value in every interaction. If your only goal is promotion, developers will ignore or actively reject you.

---

## 1. GitHub Awesome Lists

### Overview
"Awesome lists" are community-curated lists of high-quality resources on specific topics (e.g., awesome-react, awesome-python, awesome-selfhosted). These lists are among the most-starred repos on GitHub and drive significant discovery traffic.

### Finding Relevant Lists

1. **Search GitHub** for `awesome-{{YOUR_CATEGORY}}`
   - Examples: `awesome-devtools`, `awesome-saas`, `awesome-cli-apps`, `awesome-nodejs`
2. **Browse** https://github.com/topics/awesome-list
3. **Check** https://github.com/sindresorhus/awesome (the meta-list of awesome lists)
4. **Search by technology**: `awesome-{{TECH_STACK}}` (e.g., awesome-react, awesome-python)

### How to Submit a PR

1. **Read the contributing guidelines**: Every awesome list has a CONTRIBUTING.md. Read it fully.
2. **Verify your project qualifies**: Most lists require:
   - Active maintenance (recent commits)
   - Clear documentation (README)
   - Minimum star count (varies; some require 100+, others have no minimum)
   - Proven stability or strong community adoption
3. **Prepare your entry**: Follow the exact format used by other entries in the list
   - Typically: `- [Project Name](URL) - One-line description.`
4. **Submit a pull request**:
   - Fork the awesome list repo
   - Add your entry in the appropriate section (alphabetical order usually)
   - Write a clear PR description explaining why {{PROJECT_NAME}} belongs
   - Be patient; maintainers may take days or weeks to review
5. **Respond to feedback**: If the maintainer asks for changes, make them promptly

### Quality Requirements (Typical)
- Active development (commits within last 3 months)
- Documentation: Clear README with installation, usage, and examples
- License: Open source license clearly specified
- Stability: No critical unresolved bugs
- Unique value: Not just a clone of an existing listed tool

### README Badge
Once accepted, add a badge to your README:
```markdown
[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
```

### SEO and Traffic Value
- Awesome lists often have 10K-100K+ stars
- Being listed drives ongoing organic discovery
- High-authority GitHub backlink
- Developers actively browse these lists when evaluating tools

---

## 2. dev.to (dev.to)

### Overview
dev.to is one of the largest developer community platforms. It allows you to create a product listing, publish articles, and engage in discussions. The platform has strong SEO and a welcoming community.

### Creating a Listing

1. **Create an account** at https://dev.to
2. **Create a listing** (under "Listings" in the menu):
   - Category: Products/Tools, Collaboration, or relevant category
   - Title: {{PROJECT_NAME}} — {{BRIEF_DESCRIPTION}}
   - Body: Explain what it does, key features, how to get started
   - Tags: Up to 4 relevant tags
3. **Listings are free** and appear in the Listings section

### Writing Launch Posts

A launch post on dev.to is significantly more valuable than just a listing. Here is how to write one that resonates:

**Post Structure:**
```markdown
---
title: I built {{PROJECT_NAME}} — {{HOOK_DESCRIPTION}}
published: true
tags: {{TAG_1}}, {{TAG_2}}, {{TAG_3}}, {{TAG_4}}
---

## The Problem
{{PROBLEM_DESCRIPTION}}

## Why I Built This
{{MOTIVATION — personal story resonates with developers}}

## How It Works
{{TECHNICAL_OVERVIEW — architecture, key decisions, stack}}

## Key Features
- {{FEATURE_1}}: {{EXPLANATION}}
- {{FEATURE_2}}: {{EXPLANATION}}
- {{FEATURE_3}}: {{EXPLANATION}}

## Getting Started
```bash
# Installation/setup commands
{{INSTALLATION_COMMANDS}}
```

## What's Next
{{ROADMAP_PREVIEW}}

## Try It Out
{{WEBSITE_URL}} | [GitHub]({{GITHUB_URL}}) | [Docs]({{DOCS_URL}})

I'd love your feedback! Drop a comment or open an issue.
```

### Tagging Strategy
- You can use up to 4 tags per post
- Use popular tags that are relevant: `javascript`, `webdev`, `opensource`, `productivity`, `tutorial`, `beginners`, `devtools`, `react`, `python`, etc.
- Check trending tags on dev.to before posting
- The first tag determines the primary category of your post

### Community Engagement
- Comment on other developers' posts genuinely
- Follow relevant tags and people
- Share your expertise (not just your product)
- Create a series: "Building {{PROJECT_NAME}}" with multiple parts documenting your journey
- Respond to every comment on your posts

### Expected Traffic
- A well-written post: 1,000-10,000 views
- If it hits the front page or trending: 10,000-50,000+ views
- Listing alone: modest ongoing traffic
- Building-in-public series: cumulative audience growth

---

## 3. GitHub Topics and Explore

### Overview
GitHub Topics allows repositories to be discovered through topic tags. GitHub Explore features trending repositories and topics. Proper tagging is essential for open-source projects.

### Tagging Your Repository

1. **Go to** your GitHub repository settings
2. **Add topics**: Click "Add topics" on your repo page (under the description)
3. **Select relevant topics**:
   - Your technology: `javascript`, `python`, `rust`, `go`, `typescript`
   - Your category: `cli-tool`, `developer-tools`, `automation`, `api`, `database`
   - Your use case: `productivity`, `monitoring`, `testing`, `deployment`
   - Broad topics: `open-source`, `hacktoberfest` (if you participate)
4. **Use up to 20 topics** (use all 20 if relevant topics exist)

### Getting Featured on GitHub Explore

GitHub Explore (https://github.com/explore) features:
- **Trending repositories**: Based on stars gained in recent period
- **Collections**: Curated by GitHub and community members
- **Topics**: Browsable topic pages

**How to increase chances of trending:**
- Gain stars quickly after launch (coordinate social sharing)
- Write an excellent README with screenshots and clear documentation
- Have a clear, descriptive repository description
- Use appropriate topics
- Active development (recent commits)

### README Optimization for GitHub Discovery

Your README is your landing page on GitHub. Optimize it:

```markdown
# {{PROJECT_NAME}}

{{ONE_LINE_DESCRIPTION}}

[![Stars](badge-url)](repo-url)
[![License](badge-url)](license-url)
[![npm version](badge-url)](npm-url)

## Features
- Feature 1
- Feature 2
- Feature 3

## Quick Start
(Installation in 3 steps or fewer)

## Screenshots/Demo
(Visual proof of what it does)

## Documentation
(Link to full docs)

## Contributing
(How to contribute)

## License
(License type)
```

---

## 4. StackShare (stackshare.io)

### Overview
StackShare is where companies share their technology stacks and developers compare tools. Being listed on StackShare means your tool appears in stack comparisons and decision-making research.

### Creating a Tool Listing

1. **Go to** https://stackshare.io and create an account
2. **Submit your tool** if it doesn't already exist:
   - Tool name: {{PROJECT_NAME}}
   - URL: {{WEBSITE_URL}}
   - Category: Select the most relevant category
   - Description: Technical description focused on capabilities
   - Pros: List advantages (these are community-editable)
   - Cons: Acknowledge limitations honestly (builds credibility)
3. **Claim your tool page** as the official vendor

### Stack Decisions and Comparisons
- StackShare creates comparison pages: "{{PROJECT_NAME}} vs {{COMPETITOR_1}}"
- Users write "Stack Decisions" explaining why they chose specific tools
- Encourage your users to share their stack decisions mentioning {{PROJECT_NAME}}
- These comparisons heavily influence developers evaluating tools

### Company Stacks
- Companies publish their tech stacks on StackShare
- If companies using {{PROJECT_NAME}} list it in their stacks, it appears as social proof
- Reach out to your most prominent customers and ask them to add {{PROJECT_NAME}} to their public stack

---

## 5. Libraries.io (libraries.io)

### Overview
Libraries.io automatically indexes packages from package managers (npm, PyPI, RubyGems, crates.io, etc.) and provides discoverability, dependency tracking, and quality metrics.

### Optimization (Automatic Indexing)

Libraries.io automatically indexes your package. To optimize:

1. **Package metadata**: Ensure your `package.json`, `setup.py`, `Cargo.toml`, etc. has:
   - Clear description
   - Relevant keywords
   - Proper categorization
   - Homepage URL
   - Repository URL
   - Author information
2. **README quality**: Libraries.io displays your README; make it compelling
3. **SourceRank score**: Libraries.io calculates a quality score based on:
   - Presence of README, CHANGELOG, CONTRIBUTING files
   - License presence and type
   - Number of dependents
   - Commit frequency
   - Issue response time
   - Release frequency

### Improving Your SourceRank
- Add a LICENSE file (MIT, Apache 2.0, etc.)
- Add a CONTRIBUTING.md file
- Maintain a CHANGELOG.md
- Release regularly (semantic versioning)
- Respond to issues promptly
- Make your package depended on by other packages (organic growth)

---

## 6. Package Registries as Directories

### npm (npmjs.com)
If {{PROJECT_NAME}} is a JavaScript/TypeScript package:
- **README optimization**: npm displays your README as the package page. Treat it as a landing page.
- **Keyword selection**: Add relevant keywords in `package.json` (up to 20):
  ```json
  "keywords": ["{{KEYWORD_1}}", "{{KEYWORD_2}}", "{{KEYWORD_3}}"]
  ```
- **Description**: Clear, searchable one-liner in `package.json`
- **Publish regularly**: Packages with recent updates rank higher

### PyPI (pypi.org)
If {{PROJECT_NAME}} is a Python package:
- **Description and classifiers**: Use PyPI classifiers for categorization
- **Long description**: From your README.md (rendered on PyPI)
- **Keywords**: Add to `setup.py` or `pyproject.toml`
- **Project URLs**: Add documentation, issue tracker, and changelog links

### crates.io (crates.io)
If {{PROJECT_NAME}} is a Rust package:
- **Description**: Clear one-liner in `Cargo.toml`
- **Keywords**: Up to 5 keywords in `Cargo.toml`
- **Categories**: Select from crates.io's category list
- **Documentation**: Link to docs.rs

---

## 7. VS Code Marketplace

<!-- IF {{PRODUCT_TYPE}} == "vscode-extension" -->
**Priority: HIGH** — The VS Code Marketplace is your primary distribution channel.
<!-- ENDIF -->

### Extension Listing Optimization

1. **README.md**: This is your marketplace listing page
   - Start with a clear value proposition and screenshot
   - Include features with GIFs showing them in action
   - Installation instructions
   - Configuration options
   - Keyboard shortcuts
   - Known issues and FAQ
2. **package.json metadata**:
   - `displayName`: Human-readable name
   - `description`: Clear one-liner (shown in search results)
   - `categories`: Select all relevant categories
   - `keywords`: Up to 5 search keywords
   - `icon`: 256x256 PNG icon
   - `galleryBanner`: Background color for marketplace page
3. **CHANGELOG.md**: VS Code Marketplace displays this in a tab
4. **Rating and reviews**: Encourage satisfied users to rate your extension

### Discoverability Tips
- Use popular tags that accurately describe functionality
- Publish updates regularly (active extensions rank higher)
- Write a compelling description that appears in search results
- Include screenshots showing the extension in action
- Respond to Q&A and issues on the marketplace page

---

## 8. Stack Overflow Presence

### When to Create a Tag

Stack Overflow tags are created when enough questions exist about a technology. Creating a tag prematurely can be counterproductive.

**Create a tag when:**
- There are 5+ questions about {{PROJECT_NAME}} on Stack Overflow
- Your product has a significant developer user base
- You have the capacity to monitor and answer questions with the tag

**How to create a tag:**
- You need 1,500+ reputation to create tags
- If you do not have enough reputation, ask a community member to help
- Create a tag wiki excerpt (brief description) and full tag wiki

### Answering Questions (Ethically)

- **Search for questions** where {{PROJECT_NAME}} could be a genuine solution
- **Answer the question first**, then mention {{PROJECT_NAME}} as one possible tool
- **Disclose your affiliation**: "Disclaimer: I work on {{PROJECT_NAME}}"
- **Never spam**: Only suggest your tool when it genuinely solves the problem
- **Provide complete answers**: Include code examples, not just "use our tool"
- **Monitor your tag** (if you have one) and answer all questions promptly

---

## 9. Technical Blog Platforms

### Hashnode (hashnode.com)

- **Custom domain**: Hashnode lets you host your blog on your own domain
- **Built-in SEO**: Hashnode blogs are well-indexed
- **Community**: Articles appear in Hashnode's feed for discovery
- **Tags**: Use relevant technology and topic tags
- **Strategy**: Publish technical tutorials, architecture decisions, building-in-public content

### Medium Publications

Target developer-focused Medium publications for wider reach:

| Publication | Focus | Followers | How to Submit |
|------------|-------|-----------|---------------|
| **Better Programming** | Software engineering | 500K+ | Apply to be a writer via their submission form |
| **Level Up Coding** | Coding tutorials | 300K+ | Email editors or apply on their guidelines page |
| **JavaScript in Plain English** | JavaScript/web | 200K+ | Submit via their writer guidelines |
| **Towards Data Science** | Data/ML/AI | 600K+ | Apply via their writer application |
| **The Startup** | Startup ecosystem | 700K+ | Submit via Medium partner program |
| **freeCodeCamp** | Learning to code | 500K+ | Apply at freecodecamp.org/news |

**Important**: When republishing content from your own blog on Medium, use the "Import" feature which automatically sets the canonical URL to your original post (prevents SEO duplicate content issues).

---

## 10. Open Source Discoverability

If {{PROJECT_NAME}} is open source (or has an open-source component):

### GitHub Stars Strategy

Stars are social proof and affect GitHub's trending algorithm:

1. **Launch day coordination**: Ask your network to star the repo on the same day
2. **Star in exchange for value**: Share the repo in relevant communities when providing helpful content
3. **README quality**: A great README converts visitors into star-givers
4. **Badges in README**: Display star count, build status, coverage, and other quality signals
5. **Never buy stars**: GitHub detects and penalizes artificial starring. It also destroys credibility if discovered.

### Contributor Onboarding

More contributors means more visibility and organic promotion:

1. **CONTRIBUTING.md**: Clear, welcoming guide for new contributors
2. **Good First Issues**: Label issues that are accessible to new contributors
3. **Issue templates**: Make it easy to report bugs and request features
4. **PR templates**: Guide contributors through the PR process
5. **Code of Conduct**: Show the project is welcoming and inclusive
6. **Documentation**: Make it easy for contributors to understand the codebase
7. **Hacktoberfest participation**: October's Hacktoberfest drives contributor engagement

---

## 11. Developer Newsletter Submissions

Many newsletters feature new developer tools. Reach out to these:

| Newsletter | Focus | Audience Size | How to Submit |
|-----------|-------|---------------|---------------|
| **TLDR** | Tech/startup news | 1M+ | Submit at tldr.tech |
| **JavaScript Weekly** | JavaScript ecosystem | 180K+ | Email cooperpress.com |
| **Node Weekly** | Node.js ecosystem | 50K+ | Email cooperpress.com |
| **Python Weekly** | Python ecosystem | 120K+ | Submit at pythonweekly.com |
| **Golang Weekly** | Go ecosystem | 40K+ | Email cooperpress.com |
| **Ruby Weekly** | Ruby ecosystem | 40K+ | Email cooperpress.com |
| **React Status** | React ecosystem | 50K+ | Email cooperpress.com |
| **Hacker Newsletter** | Hacker News top stories | 60K+ | Get on HN front page |
| **Console.dev** | New developer tools | 30K+ | Apply at console.dev |
| **DevOps Weekly** | DevOps/infrastructure | 40K+ | Submit at devopsweekly.com |
| **Changelog** | Open source/dev | 100K+ | Submit via changelog.com |
| **Bytes** | JavaScript | 200K+ | Submit at bytes.dev |
| **This Week in Rust** | Rust ecosystem | 25K+ | Submit via twir GitHub |
| **StatusCode Weekly** | Web development | 50K+ | Email cooperpress.com |

### How to Pitch a Newsletter

```
Subject: New tool for {{NEWSLETTER_FOCUS}}: {{PROJECT_NAME}}

Hi {{EDITOR_NAME}},

I've been a reader of {{NEWSLETTER_NAME}} for a while. I just launched
{{PROJECT_NAME}} — {{ONE_LINE_DESCRIPTION}}.

It might be relevant for your readers because {{SPECIFIC_REASON_FOR_THIS_AUDIENCE}}.

Here's a quick overview:
- What it does: {{BRIEF_EXPLANATION}}
- Tech: Built with {{TECH_STACK}}
- Getting started: {{QUICK_START_URL}}
- GitHub: {{GITHUB_URL}} (if applicable)

Happy to provide any additional info you might need.

Thanks,
{{YOUR_NAME}}
```

---

## 12. Conference and Meetup Directories

### CFP (Call for Papers) Submission Platforms

Speaking at conferences is a powerful developer marketing channel:

| Platform | URL | Notes |
|----------|-----|-------|
| **Sessionize** | https://sessionize.com | Most popular CFP platform. Browse open CFPs. |
| **PaperCall** | https://www.papercall.io | Browse and submit to conferences globally. |
| **Confs.tech** | https://confs.tech | Directory of tech conferences with CFP links. |
| **CFP Land** | https://www.cfpland.com | Newsletter of open CFPs. |
| **Meetup.com** | https://www.meetup.com | Find local meetups to present at (lower bar than conferences). |

### Talk Topics That Promote Without Being Promotional

Instead of "How to use {{PROJECT_NAME}}," propose talks that provide value and mention your product naturally:

- "Lessons learned building {{CATEGORY}} at scale"
- "How we solved {{TECHNICAL_PROBLEM}} — and open-sourced the solution"
- "The architecture of {{CATEGORY}}: patterns and anti-patterns"
- "From side project to {{MILESTONE}}: a technical journey"

---

## Developer Directory Submission Tracker

| # | Directory/Platform | URL | Type | Submitted Date | Status | Traffic/Impact | Notes |
|---|-------------------|-----|------|---------------|--------|----------------|-------|
| 1 | GitHub Awesome List: awesome-{{CATEGORY}} | github.com/... | PR | {{DATE}} | | | |
| 2 | dev.to listing | dev.to | Listing | {{DATE}} | | | |
| 3 | dev.to launch post | dev.to | Article | {{DATE}} | | | |
| 4 | GitHub Topics | github.com/{{REPO}} | Tags | {{DATE}} | | | |
| 5 | StackShare | stackshare.io | Tool listing | {{DATE}} | | | |
| 6 | DevHunt | devhunt.org | Listing | {{DATE}} | | | |
| 7 | Hacker News (Show HN) | news.ycombinator.com | Post | {{DATE}} | | | One shot |
| 8 | Console.dev | console.dev | Submission | {{DATE}} | | | |
| 9 | Uneed | uneed.best | Listing | {{DATE}} | | | |
| 10 | Newsletter: {{NAME}} | {{URL}} | Pitch | {{DATE}} | | | |
| 11 | Newsletter: {{NAME}} | {{URL}} | Pitch | {{DATE}} | | | |
| 12 | Conference: {{NAME}} | {{URL}} | CFP | {{DATE}} | | | |

---

## Measuring Developer Directory Success

| Metric | Tool | What to Look For |
|--------|------|-----------------|
| GitHub stars over time | GitHub Insights | Growth trajectory and spikes after directory submissions |
| npm/PyPI downloads | Package manager stats | Download trend and spikes |
| Referral traffic | Google Analytics | Traffic from dev.to, HN, GitHub, StackShare |
| Developer signups | UTM tracking | Developers who sign up from directory sources |
| Community engagement | Manual tracking | Comments, PRs, issues from directory-sourced users |
| Backlink quality | Ahrefs/Moz | New backlinks from dev directories and awesome lists |
| Stack Overflow mentions | Search monitoring | Questions and answers mentioning {{PROJECT_NAME}} |

---

*Last updated: {{DATE}}*
*Owner: {{MARKETING_LEAD}} / {{DEV_ADVOCATE}}*
