# Manual Action & Penalty Recovery

Manual actions are Google's way of telling you they found something specific on your site that violates their guidelines. Unlike algorithmic changes (which are automatic and unnamed), manual actions are applied by human reviewers, appear explicitly in Search Console, and require a formal reconsideration request to lift.

This is the most serious SEO incident category. Treat it as Sev-1 or Sev-2 depending on scope.

---

## Finding Manual Actions

**Location:** Google Search Console → Security & Manual Actions → Manual Actions

If you see "No issues detected" — you do not have a manual action. Your traffic drop is algorithmic or technical (see `traffic-drop-diagnosis.md`).

If you see one or more listed actions, each will specify:
- The type of violation.
- Whether it affects the entire site or specific pages/sections.
- When it was applied.
- A link to documentation about the issue.

---

## Manual Action Types

### 1. Unnatural Links TO Your Site

**What triggered it:** Google's webspam team determined that your site has an unnatural pattern of inbound links — paid links, link exchanges, PBN links, or large-scale manipulative link building.

**Impact:** Rankings suppressed for affected pages or entire site.

**How to fix:**

1. **Export your full backlink profile** from Ahrefs, Semrush, AND Google Search Console (GSC → Links → Export).

2. **Identify unnatural links.** Look for:
   - Links from sites with no real content (PBNs, link farms).
   - Links from completely irrelevant sites (your SaaS product linked from a casino blog).
   - Links with exact-match anchor text at unnatural frequency.
   - Links from sites in languages you do not operate in.
   - Sudden spikes of links from a single campaign.
   - Links from guest posts on low-quality sites that exist solely for link building.

3. **Attempt removal outreach:**
   - Contact the webmaster of each unnatural linking site.
   - Use a professional, non-threatening tone.
   - Request link removal or nofollow addition.
   - Document every outreach attempt (date, email, response).
   - Template:
     ```
     Subject: Link Removal Request — [Your Domain]

     Hi,

     We are conducting a backlink audit and have identified a link from
     your page [URL] to our site [URL].

     We would appreciate it if you could remove this link or add a
     rel="nofollow" attribute to it.

     Thank you for your time.

     [Your Name]
     [Your Contact Info]
     ```
   - Send 2 follow-ups over 2 weeks. If no response, proceed to disavow.

4. **Create a disavow file** for links you could not get removed (see Disavow section below).

5. **File a reconsideration request** (see Reconsideration section below).

### 2. Unnatural Links FROM Your Site

**What triggered it:** Your site is linking out to spammy sites, likely through paid links, hacked link injections, or compromised UGC (user-generated content with spam links).

**How to fix:**

1. Crawl your entire site with Screaming Frog. Export all outbound links.
2. Identify suspicious outbound links (links you did not intentionally place, links to spammy sites, paid links without `rel="sponsored"`).
3. Remove the links, or add `rel="nofollow"` or `rel="sponsored"` to any that must remain.
4. If hacked: clean the site, patch vulnerabilities, change all credentials.
5. Implement UGC link moderation if the issue came from comments/forums.
6. File reconsideration request.

### 3. Thin Content with Little or No Added Value

**What triggered it:** A significant portion of your site has content that is shallow, auto-generated, scraped, or provides no original value beyond what exists elsewhere.

**How to fix:**

1. **Identify thin pages:**
   - Crawl site with Screaming Frog → filter pages with <300 words.
   - Check GSC for pages with high impressions but very low CTR (sign of thin content in SERP).
   - Look for auto-generated pages (product variants with identical descriptions, tag/category pages with no unique content, location pages with only city name swapped).

2. **For each thin page, decide:**

   | Decision | When to Apply | Action |
   | -------- | ------------- | ------ |
   | **Improve** | Page targets a real keyword with traffic potential | Add substantial unique content (500+ words of genuine value) |
   | **Consolidate** | Multiple thin pages target the same topic | Merge into one comprehensive page, 301 redirect others |
   | **Remove** | Page has no traffic potential and no user value | 301 redirect to most relevant page, or return 410 Gone |
   | **Noindex** | Page is needed for UX but has no SEO value | Add `<meta name="robots" content="noindex">` |

3. Track all changes in a spreadsheet (URL, action taken, date, new word count).
4. File reconsideration request with evidence of changes.

### 4. Pure Spam

**What triggered it:** The site uses techniques that fundamentally violate Google's guidelines — auto-generated gibberish, cloaking (showing different content to Googlebot than to users), hidden text, doorway pages.

**How to fix:**

1. Identify the specific spam technique cited in the manual action.
2. Remove it completely. This is not a "tone it down" situation — it must be fully removed.
3. If the site was hacked and spam was injected:
   - Clean all injected content.
   - Update CMS, plugins, themes to latest versions.
   - Change all passwords (CMS admin, FTP, database, hosting panel).
   - Check for backdoors (uploaded PHP shells, modified .htaccess files).
   - Request a security review in Search Console after cleaning.
4. File reconsideration request.

### 5. Cloaking and/or Sneaky Redirects

**What triggered it:** The server serves different content to Googlebot than to regular users, or redirects users to a different page than what Googlebot sees.

**Common causes:**
- IP-based cloaking (detecting Googlebot's IP and serving SEO-optimized content).
- User-agent based cloaking (detecting Googlebot's user-agent string).
- JavaScript redirects that Googlebot does not execute.
- Interstitials that redirect mobile users but not Googlebot.
- Affiliate link cloaking that Google interprets as deceptive.

**How to fix:**

1. Verify: `curl -A "Googlebot" URL` vs `curl -A "Mozilla/5.0" URL` — content should be identical.
2. Remove any IP-based or user-agent-based content differentiation.
3. Remove JavaScript redirects that only fire for certain users.
4. If using affiliate links: use `rel="sponsored"` and standard HTML links, not cloaked redirects.
5. File reconsideration request.

### 6. Structured Data Abuse

**What triggered it:** Structured data markup does not match page content — fake reviews, inaccurate pricing, markup for content that does not exist on the page.

**How to fix:**

1. Audit all structured data on the site (Screaming Frog → Configuration → Spider → Structured Data).
2. Validate against Google's structured data guidelines for each type.
3. Remove any markup that does not accurately describe visible page content.
4. Common issues:
   - Review stars on pages without actual reviews.
   - FAQ schema with questions not visible on the page.
   - Product schema with incorrect prices.
   - AggregateRating with fabricated ratings.
5. Test with Google's Rich Results Test after fixes.
6. File reconsideration request.

### 7. User-Generated Spam

**What triggered it:** Spam in comments, forums, or user profiles on your site — often from bot registrations or SEO spam in UGC areas.

**How to fix:**

1. Clean up existing spam content (remove spam comments, profiles, forum posts).
2. Implement preventive measures:
   - CAPTCHA on all forms.
   - Link moderation queue (no links published without review).
   - `rel="ugc"` on all user-generated links.
   - Noindex user profile pages if they have no unique value.
   - Rate limiting on post/comment creation.
3. File reconsideration request.

---

## Creating a Disavow File

### When to Use the Disavow Tool

- You have a manual action for unnatural inbound links AND you could not get them removed through outreach.
- You have identified clearly manipulative links you did not build and cannot remove.

**When NOT to use:**
- Do not disavow links just because they have low Domain Rating. Google ignores most low-quality links automatically.
- Do not disavow competitor links out of paranoia.
- Do not disavow links as a precaution "just in case."

### Disavow File Format

```
# Disavow file for example.com
# Generated: YYYY-MM-DD
# Reason: Manual action for unnatural links

# Domain-level disavows (entire domains that are spam)
domain:spamsite1.com
domain:linkfarm.net
domain:pbn-network-42.com

# URL-level disavows (specific pages on otherwise legitimate domains)
https://legitimatesite.com/sponsored-post-with-paid-link
https://guestpostfactory.com/article-123
```

### Rules

| Rule | Explanation |
| ---- | ----------- |
| One entry per line | Each line is either `domain:example.com` or a full URL |
| Comments start with `#` | Use comments to explain why each entry is disavowed |
| Domain-level for spam sites | If the entire domain is a link farm, disavow at domain level |
| URL-level for mixed sites | If a legitimate site has one spammy page linking to you, disavow just that URL |
| Plain text file, UTF-8 encoding | Save as `.txt` with UTF-8 encoding |
| Submit via Search Console | GSC → Disavow Links tool (separate URL, not in main GSC interface) |

### Common Disavow Mistakes

| Mistake | Consequence | Prevention |
| ------- | ----------- | ---------- |
| Disavowing too aggressively | Lose link equity from legitimate links, rankings drop further | Only disavow clearly manipulative links |
| Disavowing your own domain | Catastrophic ranking loss | Double-check file before submitting |
| Using wrong format | File not processed | Validate format before submitting |
| Not documenting reasons | Cannot review decisions later, cannot explain to Google | Add comments explaining each entry |
| Submitting and forgetting | New spam links accumulate | Review and update quarterly |

### Partial vs. Full Disavow Strategy

| Strategy | When to Use |
| -------- | ----------- |
| **Targeted disavow** (10-50 entries) | You can clearly identify the manipulative links. Most situations. |
| **Broad disavow** (100+ entries) | You inherited a heavily-spammed link profile (e.g., acquired a domain). |
| **Full domain disavow** | The linking domain is entirely spam with no legitimate pages. |
| **URL-level disavow** | The linking domain has legitimate pages but one specific page has a paid/spam link. |

---

## Filing a Reconsideration Request

### Where to File

Google Search Console → Security & Manual Actions → Manual Actions → Request Review

### What to Include

Your request must convince a human reviewer that:
1. You understand what the violation was.
2. You have taken concrete steps to fix it.
3. You have taken steps to prevent recurrence.

### Template

```
We acknowledge the manual action for [violation type] on [domain].

WHAT WE FOUND:
- [Specific description of the violation, e.g., "We identified 847 unnatural
  backlinks from 234 domains, primarily from guest post networks and
  paid link placements."]

WHAT WE DID TO FIX IT:
- [Action 1: "We contacted 234 domain owners requesting link removal.
  We received responses from 67, and 43 removed the links."]
- [Action 2: "We created a disavow file covering 191 remaining domains
  and submitted it on YYYY-MM-DD."]
- [Action 3: "We removed all thin content pages (142 pages) and
  either improved them with original content or redirected them."]

EVIDENCE:
- [Link to spreadsheet documenting all outreach attempts with dates]
- [Link to disavow file]
- [Screenshots of before/after for content improvements]

HOW WE WILL PREVENT RECURRENCE:
- [Prevention 1: "We have terminated our relationship with the link
  building agency that created these links."]
- [Prevention 2: "We have implemented a quarterly backlink audit process."]
- [Prevention 3: "All future content is reviewed against Google's
  quality guidelines before publication."]

We respectfully request that you review our site and lift the manual action.
```

### Tone Guidelines

| Do | Do Not |
| -- | ------ |
| Be specific and factual | Be vague ("we cleaned everything up") |
| Take responsibility | Blame others ("our former SEO agency did this") |
| Show evidence of work done | Make promises without proof |
| Be professional and concise | Be emotional, angry, or pleading |
| Explain preventive measures | Only address the current violation |

### After Submitting

- Google typically responds within 1-4 weeks.
- You will receive a message in Search Console.
- **If approved:** Manual action is lifted. Rankings may take additional weeks to recover as Google recrawls and re-evaluates.
- **If denied:** Read the response carefully. It will indicate what was insufficient. Fix the remaining issues and resubmit. There is no limit on reconsideration requests, but wait at least 2 weeks between submissions.

---

## Recovery Timeline Expectations

| Situation | Fix Time | Recovery Time | Total |
| --------- | -------- | ------------- | ----- |
| Manual action (unnatural links) | 2-4 weeks to clean up | 2-4 weeks after reconsideration approved | 1-2 months |
| Manual action (thin content) | 2-6 weeks to improve content | 2-4 weeks after reconsideration approved | 1-3 months |
| Manual action (pure spam) | Days to remove spam | 2-4 weeks after reconsideration approved | 1-2 months |
| Algorithmic link penalty (no manual action) | 2-4 weeks to disavow | Months (waits for next algorithm refresh) | 3-6 months |
| Algorithmic content quality | 4-12 weeks to improve content | Months (waits for next core update) | 3-12 months |
| Site hacked + spam injected | Days to clean | 2-6 weeks after security review + reconsideration | 1-2 months |

**Important:** Recovery means returning to approximately pre-penalty traffic levels. If your competitors improved during your penalty period, you may not return to the exact same rankings.

---

## Prevention Measures

### Ongoing Link Monitoring

- [ ] Monthly: Review new backlinks in Ahrefs/Semrush for suspicious patterns.
- [ ] Quarterly: Full backlink audit. Compare link profile to competitors.
- [ ] Immediately: Investigate any sudden spike in new referring domains (could be negative SEO or a link scheme you are unaware of).

### Content Quality Gates

- [ ] No page published with <500 words unless it is a tool page, calculator, or similar.
- [ ] All content reviewed for originality before publication (Copyscape or similar).
- [ ] Auto-generated pages (product variants, location pages) must have minimum unique content per page.
- [ ] Quarterly thin content audit — identify and address pages with zero organic traffic.

### Technical Safeguards

- [ ] Production robots.txt reviewed after every deployment.
- [ ] No `noindex` tags on pages that should be indexed (automated check in CI/CD).
- [ ] Structured data validated against actual page content.
- [ ] UGC areas have moderation, CAPTCHA, and `rel="ugc"` on links.

### Team Education

- [ ] SEO team trained on Google's Search Essentials (formerly Webmaster Guidelines).
- [ ] Content team trained on E-E-A-T principles.
- [ ] Engineering team understands SEO implications of technical changes (robots.txt, meta tags, redirects).
- [ ] Any external SEO agency's link-building practices reviewed and approved before engagement.

---

## Cross-References

- **Incident response:** `36-seo/incident/seo-incident-response.md`
- **Traffic drop diagnosis:** `36-seo/incident/traffic-drop-diagnosis.md`
- **Algorithm update playbook:** `36-seo/incident/algorithm-update-playbook.md`
- **Gotchas:** `36-seo/gotchas/seo-gotchas.md`
