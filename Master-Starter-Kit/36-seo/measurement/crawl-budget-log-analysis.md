# Crawl Budget & Log Analysis

What server logs tell you about how search engines interact with {{PROJECT_NAME}}, and how to use that data to optimize crawl efficiency, diagnose indexation problems, and correlate crawl patterns with ranking changes. This is advanced technical SEO — it matters most for sites with 1,000+ pages, JavaScript-heavy architectures, or frequent content changes.

---

## Table of Contents

1. [What Server Logs Tell You About SEO](#what-server-logs-tell-you-about-seo)
2. [When Log Analysis Matters](#when-log-analysis-matters)
3. [Log Analysis Tools](#log-analysis-tools)
4. [Access Log Format and Parsing](#access-log-format-and-parsing)
5. [Separating Bot Traffic from Human Traffic](#separating-bot-traffic-from-human-traffic)
6. [Googlebot Behavior Analysis](#googlebot-behavior-analysis)
7. [Crawl Budget Optimization](#crawl-budget-optimization)
8. [Correlating Crawl Patterns with Ranking Changes](#correlating-crawl-patterns-with-ranking-changes)
9. [Log-Based Alerts](#log-based-alerts)
10. [Monthly Log Analysis Workflow](#monthly-log-analysis-workflow)

---

## What Server Logs Tell You About SEO

Google Search Console shows you what Google *reports* about its crawling. Server logs show you what *actually happened*. The difference matters.

### Data Only Available in Server Logs

| Data Point | What It Tells You | Why GSC Cannot Provide It |
|---|---|---|
| **Exact crawl timestamps** | When Googlebot visited each URL, down to the millisecond | GSC aggregates data; no per-request timestamps |
| **Response time per request** | How long your server took to respond to Googlebot | GSC does not report server response times per URL |
| **HTTP status codes served to bots** | The exact status code Googlebot received (200, 301, 404, 500, etc.) | GSC reports index status, not crawl-time status codes |
| **URLs crawled that are not in GSC** | Googlebot may crawl URLs you did not know existed (parameter URLs, old URLs, JS-generated paths) | GSC only shows URLs it has processed, not all URLs it has requested |
| **Crawl frequency per URL** | How often each specific URL is crawled | GSC shows aggregate crawl stats, not per-URL frequency |
| **Bot identification** | Which specific bot crawled (Googlebot, Googlebot-Image, Googlebot-Video, Googlebot-News) | GSC combines all Google crawlers |
| **Rendering requests** | Whether Google's Web Rendering Service (WRS) made a second pass for JavaScript content | GSC shows final render status, not the rendering request itself |
| **Resource requests** | Which CSS, JS, images, and API calls Googlebot made to render the page | GSC URL inspection shows resource loading issues but not the request log |
| **Non-Google bot behavior** | Bingbot, AI bots, SEO tool crawlers — none of this appears in GSC | GSC is Google-only |

### The Core Question Logs Answer

**"Is Google crawling the right pages at the right frequency and getting the right responses?"**

If the answer is no, you have a crawl budget problem that no amount of content optimization can fix.

---

## When Log Analysis Matters

Log analysis is not necessary for every site. It is high-effort and only valuable when the site is complex enough to have crawl-level problems.

### Log Analysis Is Critical For

- **Sites with 1,000+ indexable URLs.** At this scale, crawl budget becomes a real constraint. Google will not crawl everything every day.
- **JavaScript-heavy sites (React, Angular, Vue SPAs).** Google must render JS content in a second pass. Logs reveal whether the rendering is happening and which pages are affected.
- **Sites with dynamic URL generation.** Faceted navigation, search results pages, infinite scroll, user-generated URL patterns — these can create thousands of crawlable URLs that waste budget.
- **Sites experiencing unexplained indexation issues.** If Google Search Console shows "Crawled - not indexed" increasing but you cannot figure out why, logs reveal the crawl behavior that preceded the decision.
- **After site migrations.** Logs confirm that Googlebot is following redirects correctly, not hitting 404s on old URLs, and discovering new URLs.
- **Sites with frequent content updates.** News sites, ecommerce with rotating inventory, sites publishing daily — log analysis confirms that new content is being crawled quickly.

### Log Analysis Is Overkill For

- Small sites under 500 URLs with stable content
- Static sites with no JavaScript rendering concerns
- Sites where Google Search Console shows healthy index coverage (90%+ of sitemap URLs indexed)
- Sites with no unexplained SEO anomalies

---

## Log Analysis Tools

### Dedicated Log Analysis Tools

| Tool | Type | Strengths | Limitations |
|---|---|---|---|
| **Screaming Frog Log Analyzer** | Desktop application | Purpose-built for SEO log analysis; Googlebot segmentation; integrates with Screaming Frog crawl data; handles large files | Desktop-only; file size limits based on RAM; one-time analysis (not real-time) |
| **Logflare** | Cloud service | Real-time log ingestion; BigQuery backend for custom analysis; good for ongoing monitoring | Requires log shipping setup; query complexity; cost scales with volume |
| **GoAccess** | Open-source CLI/web | Fast; real-time; runs on the server; minimal setup; beautiful terminal and HTML reports | Not SEO-specific — requires filtering for bot traffic manually; limited bot segmentation |
| **ELK Stack (Elasticsearch, Logstash, Kibana)** | Self-hosted or cloud | Extremely flexible; real-time dashboards; scales to any volume; custom alerting | Complex setup; requires DevOps knowledge; significant infrastructure cost at scale |
| **Splunk** | Enterprise platform | Enterprise-grade; advanced analytics; machine learning capabilities | Expensive; overkill for most SEO use cases |
| **JetOctopus** | Cloud SEO platform | Built for SEO log analysis; Googlebot segmentation out of the box; integrates crawl data and GSC data | Subscription cost; requires log shipping |
| **Oncrawl** | Cloud SEO platform | SEO-focused log analysis; correlates logs with crawl data and rankings | Subscription cost; learning curve |

### Recommended Setup by Site Size

| Site Size | Recommended Approach |
|---|---|
| Under 5,000 URLs | Screaming Frog Log Analyzer (monthly manual analysis) |
| 5,000-50,000 URLs | JetOctopus or Oncrawl (ongoing cloud analysis) |
| 50,000-500,000 URLs | ELK stack or Logflare with custom dashboards |
| 500,000+ URLs | ELK stack or Splunk with dedicated engineering support |

---

## Access Log Format and Parsing

### Common Log Formats

#### Apache Combined Log Format

```
%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"
```

**Example line:**
```
66.249.66.1 - - [13/Mar/2026:14:22:31 +0000] "GET /blog/api-rate-limiting HTTP/1.1" 200 45232 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
```

**Field breakdown:**

| Field | Value in Example | Meaning |
|---|---|---|
| `%h` | `66.249.66.1` | Client IP address |
| `%l` | `-` | Remote logname (usually empty) |
| `%u` | `-` | Remote user (usually empty) |
| `%t` | `[13/Mar/2026:14:22:31 +0000]` | Timestamp |
| `%r` | `GET /blog/api-rate-limiting HTTP/1.1` | Request line (method, URL, protocol) |
| `%>s` | `200` | HTTP status code |
| `%b` | `45232` | Response size in bytes |
| `Referer` | `-` | Referring URL (usually empty for bot requests) |
| `User-Agent` | `Mozilla/5.0 (compatible; Googlebot/2.1; ...)` | Client identification string |

#### Nginx Default Log Format

```
$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"
```

This is nearly identical to Apache combined format. The same parsing rules apply.

#### CloudFront Log Format

CloudFront uses a tab-separated format with additional fields:

```
date  time  x-edge-location  sc-bytes  c-ip  cs-method  cs(Host)  cs-uri-stem  sc-status  cs(Referer)  cs(User-Agent)  cs-uri-query  ...
```

CloudFront logs require different parsing because:
- They are tab-separated, not space-separated
- The date and time are in separate fields
- URL path and query string are in separate fields
- Additional CDN-specific fields (edge location, time-to-first-byte)

### Parsing Tips

1. **Decompress first.** Log files are often gzip-compressed (`.gz` extension). Decompress before analysis: `gzip -d access.log.gz`

2. **Handle log rotation.** Most servers rotate logs daily or when they reach a size threshold. You may need to concatenate multiple files for analysis: `cat access.log.1 access.log.2 > combined.log`

3. **Filter before processing.** For SEO analysis, you usually only need bot traffic. Pre-filter to reduce processing time:
   ```bash
   grep -i "googlebot\|bingbot\|GPTBot\|PerplexityBot\|ClaudeBot" access.log > bot-traffic.log
   ```

4. **Watch for IP spoofing.** Not every request claiming to be "Googlebot" is actually Google. Verify Googlebot requests by reverse DNS lookup (see Bot Verification section below).

---

## Separating Bot Traffic from Human Traffic

### User-Agent Identification

| Bot | User-Agent String (partial match) |
|---|---|
| Googlebot (web) | `Googlebot/2.1` |
| Googlebot (smartphone) | `Googlebot` + `Mobile` |
| Googlebot (image) | `Googlebot-Image` |
| Googlebot (video) | `Googlebot-Video` |
| Googlebot (news) | `Googlebot-News` |
| Google AdsBot | `AdsBot-Google` |
| Google StoreBot | `Storebot-Google` |
| Bingbot | `bingbot/2.0` |
| Yandex | `YandexBot` |
| GPTBot | `GPTBot` |
| ChatGPT-User | `ChatGPT-User` |
| PerplexityBot | `PerplexityBot` |
| ClaudeBot | `ClaudeBot` |
| CCBot | `CCBot` |
| Bytespider | `Bytespider` |
| Screaming Frog | `Screaming Frog SEO Spider` |
| Ahrefs | `AhrefsBot` |
| SEMrush | `SemrushBot` |

### Googlebot Verification

Anyone can set their user-agent to "Googlebot." To verify authentic Googlebot requests:

1. **Reverse DNS lookup on the IP:**
   ```bash
   host 66.249.66.1
   # Should return: 1.66.249.66.in-addr.arpa domain name pointer crawl-66-249-66-1.googlebot.com
   ```

2. **Forward DNS lookup to confirm:**
   ```bash
   host crawl-66-249-66-1.googlebot.com
   # Should return: crawl-66-249-66-1.googlebot.com has address 66.249.66.1
   ```

3. **The result must match.** If the reverse DNS does not resolve to `googlebot.com` or `google.com`, the request is not from Google.

For bulk verification, Google publishes its crawler IP ranges as a JSON file:
```
https://developers.google.com/search/apis/ipranges/googlebot.json
```

Download this file and match request IPs against the ranges. This is faster than DNS lookups for high-volume analysis.

### Traffic Segmentation

For meaningful analysis, segment your logs into:

| Segment | Definition | Analysis Focus |
|---|---|---|
| **Verified Googlebot** | Requests with Googlebot user-agent AND verified IP | Primary SEO analysis |
| **Other search bots** | Bingbot, Yandex, etc. (verified where possible) | Secondary search engine health |
| **AI bots** | GPTBot, ClaudeBot, PerplexityBot, etc. | AI crawl impact assessment |
| **SEO tool bots** | AhrefsBot, SemrushBot, etc. | Exclude from search engine analysis |
| **Fake Googlebot** | Googlebot user-agent but unverified IP | Security concern — investigate |
| **Human traffic** | Everything else | Exclude from bot analysis |

---

## Googlebot Behavior Analysis

The core of SEO log analysis. Understanding how Googlebot interacts with your site reveals problems that no other tool can surface.

### Key Metrics to Extract

#### 1. Crawl Volume Over Time

**What to measure:** Total Googlebot requests per day/week.

**What it means:**
- Stable crawl volume = Google considers your site stable and worth a consistent crawl allocation
- Increasing crawl volume = Google is discovering new content or re-evaluating existing content (can be positive or negative)
- Decreasing crawl volume = Google may be reducing your crawl priority — investigate server health, content quality, or robots.txt changes
- Sudden spike = Google may be re-crawling after a sitemap update, content publish, or algorithm update
- Sudden drop = Potential server issue, robots.txt misconfiguration, or manual action

#### 2. Pages Crawled vs. Pages Intended for Crawl

**What to measure:** Compare the set of URLs Googlebot actually crawled against your sitemap.

```
Crawl coverage = (Sitemap URLs crawled at least once in 30 days) / (Total sitemap URLs) x 100
```

**Interpretation:**
- 90-100%: Excellent — Google is crawling virtually all your content
- 70-89%: Good for large sites; investigate which URLs are not being crawled
- 50-69%: Crawl budget problem — too many URLs competing for limited crawl attention
- Below 50%: Severe crawl efficiency issue — immediate investigation required

**Action:** Export the list of sitemap URLs not crawled in 30 days. Check: Are they linked internally? Are they blocked by robots.txt? Are they returning errors? Are they too deep in the site architecture?

#### 3. Response Time to Googlebot

**What to measure:** Average and P95 server response time for Googlebot requests.

| Response Time | Assessment |
|---|---|
| Under 200ms | Excellent — no action needed |
| 200-500ms | Acceptable — optimize if possible |
| 500ms-1s | Slow — likely affecting crawl volume and crawl budget allocation |
| Over 1s | Critical — Google will reduce crawl rate to avoid overloading your server |

**Segment by page type:** Blog posts may respond in 100ms while product pages with database queries take 800ms. Aggregate averages hide these differences.

#### 4. Status Code Distribution

**What to measure:** Percentage of Googlebot requests returning each status code.

| Status Code | Healthy Range | Problem Threshold |
|---|---|---|
| 200 (OK) | 85-95% | Below 80% — investigate |
| 301 (Permanent redirect) | 1-10% | Above 15% — too many redirects consuming crawl budget |
| 302 (Temporary redirect) | Under 2% | Above 5% — these should usually be 301s |
| 304 (Not modified) | 1-10% | Not a problem — indicates effective caching |
| 404 (Not found) | Under 5% | Above 10% — dead links or deleted content not cleaned up |
| 410 (Gone) | Variable | Expected if you intentionally removed pages |
| 500 (Server error) | Under 0.5% | Above 1% — server stability issue |
| 503 (Service unavailable) | Under 0.1% | Above 0.5% — server overload or misconfigured maintenance mode |

#### 5. URL Pattern Analysis

**What to measure:** Group crawled URLs by pattern to identify crawl waste.

Common crawl-wasting URL patterns:

| Pattern | Example | Problem |
|---|---|---|
| Faceted navigation | `/products?color=red&size=large&sort=price` | Thousands of parameter combinations create near-duplicate URLs |
| Search result pages | `/search?q=widget` | Internal search pages should not be crawled |
| Session/tracking URLs | `/page?session=abc123` | Each session creates a "new" URL |
| Pagination beyond reasonable depth | `/blog/page/47` | Deep pagination is rarely valuable |
| Calendar/date archives | `/events/2025/03/15` | Empty date pages waste crawl budget |
| Print/PDF versions | `/page/print` or `/page.pdf` | Duplicate content in different format |
| Sorting parameters | `/products?sort=newest` | Same content in different order |

**Action:** For each pattern consuming significant crawl budget, decide:
- Block in robots.txt (fast, but prevents indexing)
- Add `noindex` meta tag (allows crawling but prevents indexing)
- Implement canonical tags (tells Google which version to index)
- Remove the URL generation entirely (best solution if the pages have no user value)

---

## Crawl Budget Optimization

Using log data to make Google's crawling of {{PROJECT_NAME}} more efficient.

### The Crawl Budget Equation

```
Effective crawl budget = (Total Googlebot requests) - (Wasted requests)

Wasted requests include:
  - Requests to pages that return errors (4xx, 5xx)
  - Requests to pages you do not want indexed
  - Requests to duplicate/near-duplicate URLs
  - Requests to low-value pages (thin content, empty archives)
  - Redirect chains (each hop consumes a request)
```

### Optimization Actions (Ordered by Impact)

#### 1. Eliminate Server Errors

Every 500 error wastes a crawl request and signals instability. Fix the underlying cause.

**From logs, extract:**
```
Top URLs returning 5xx to Googlebot (last 30 days):
  [URL] — [count] requests — [error code]
  [URL] — [count] requests — [error code]
```

#### 2. Block Crawling of Non-Indexable URLs

If log analysis reveals Googlebot spending significant crawl budget on URLs you do not want indexed:

```
# robots.txt additions based on log analysis

# Block faceted navigation parameters
Disallow: /products?*color=
Disallow: /products?*size=
Disallow: /products?*sort=

# Block internal search results
Disallow: /search

# Block print versions
Disallow: /*/print

# Block empty archive pages
Disallow: /events/????/??/??
```

#### 3. Fix Redirect Chains

Log data reveals redirect chains. Each hop consumes crawl budget. Reduce all chains to single hops.

**Identify chains:** Find URLs where Googlebot receives a 301/302, follows the redirect, and receives another 301/302 before reaching a 200.

#### 4. Consolidate Duplicate Content

If logs show Googlebot crawling multiple URLs with the same content:
- Implement `rel="canonical"` pointing to the preferred version
- Redirect non-canonical URLs to canonical URLs (301)
- Ensure the sitemap contains only canonical URLs

#### 5. Improve Crawl Efficiency for Important Pages

If important pages are being crawled infrequently (less than once per month), improve their crawl priority:
- Add internal links from high-authority pages
- Include them in the sitemap with accurate `lastmod`
- Implement IndexNow for immediate notification on updates
- Reduce the number of competing URLs (so budget is allocated to important pages)

---

## Correlating Crawl Patterns with Ranking Changes

The most advanced use of log data: connecting how Google crawls your site to how it ranks your pages.

### Correlation Patterns to Look For

#### Crawl Frequency Predicts Ranking Movement

**Hypothesis:** Pages that Google crawls more frequently tend to rank better (or maintain rankings more consistently).

**Analysis:**
1. From logs, calculate crawl frequency per URL (crawls per 30-day period)
2. From rank tracking data, get the average position for each URL
3. Plot crawl frequency (x-axis) vs ranking position (y-axis)

**Typical finding:** There is a positive correlation — pages crawled 10+ times per month tend to rank higher than pages crawled once per month. But correlation is not causation. Google crawls important pages more because they rank well, and they rank well partly because Google crawls them frequently (fresh index).

**Actionable insight:** If a previously well-crawled page sees crawl frequency decline before a ranking drop, this is an early warning signal. Investigate why Google reduced crawl priority (content staleness, lost internal links, new robots.txt rule).

#### Crawl → Index → Rank Timeline

When you publish or update a page, the timeline is:
1. Googlebot crawls the page (visible in logs)
2. Google processes and indexes the content (visible in GSC Index Coverage, 1-14 days later)
3. Rankings update (visible in rank tracking, days to weeks after indexing)

**Use logs to identify bottlenecks:**
- If step 1 is slow (pages not crawled for weeks after publication): crawl budget or discoverability problem
- If step 1 is fast but step 2 is slow: content quality or indexation criteria problem
- If steps 1-2 are fast but step 3 is slow: ranking competition or authority problem

#### Algorithm Update Impact on Crawl Behavior

After Google algorithm updates, crawl patterns often change:
- Pages that were promoted may see increased crawl frequency
- Pages that were demoted may see decreased crawl frequency
- Google may re-crawl affected pages at higher rates during the update rollout

**Action:** When a core update is announced, increase log monitoring frequency to daily. Compare pre-update and post-update crawl patterns. The pages Google suddenly crawls more (or less) often after an update are likely the pages most affected.

---

## Log-Based Alerts

Set up automated alerts to catch crawl anomalies before they cause ranking damage.

### Critical Alerts

| Alert | Condition | Severity | Response |
|---|---|---|---|
| **Crawl volume crash** | Daily Googlebot requests drop below 50% of 30-day average | Critical | Investigate immediately: server health, robots.txt, DNS |
| **5xx spike** | 5xx error rate exceeds 2% of Googlebot requests | Critical | Check server health, identify failing endpoints |
| **Crawl of blocked resource** | Googlebot requests a URL that should be blocked by robots.txt | High | Verify robots.txt is being served correctly |
| **New URL pattern** | Googlebot crawling a URL pattern not in your sitemap | Medium | Identify source — internal link, external link, or parameter crawling |
| **Response time degradation** | Average Googlebot response time exceeds 500ms for 24+ hours | High | Check server performance, database queries, CDN configuration |

### Implementing Alerts

**With ELK Stack:** Use Kibana alerting (Watcher) to trigger on threshold conditions.

**With Logflare:** Use Logflare's alerting rules on BigQuery-backed data.

**With custom scripts:** Schedule a daily cron job that parses the previous day's logs and sends alerts via email or Slack webhook:

```bash
#!/bin/bash
# Daily Googlebot crawl health check

LOG_FILE="/var/log/nginx/access.log.1"  # Yesterday's log
BOT_PATTERN="Googlebot"

# Count total Googlebot requests
TOTAL=$(grep -c "$BOT_PATTERN" "$LOG_FILE")

# Count 5xx errors
ERRORS=$(grep "$BOT_PATTERN" "$LOG_FILE" | awk '$9 ~ /^5/' | wc -l)

# Calculate error rate
ERROR_RATE=$(echo "scale=2; $ERRORS * 100 / $TOTAL" | bc)

# Alert if error rate exceeds threshold
if (( $(echo "$ERROR_RATE > 2" | bc -l) )); then
  echo "ALERT: Googlebot 5xx error rate is ${ERROR_RATE}% ($ERRORS / $TOTAL requests)" \
    | mail -s "SEO Crawl Alert: High Error Rate" seo-team@{{DOMAIN}}
fi
```

---

## Monthly Log Analysis Workflow

A structured process for extracting SEO insights from server logs every month.

### Step 1: Collect and Prepare Logs (Day 1)

- [ ] Download or access the previous month's server logs
- [ ] Decompress all log files
- [ ] Concatenate into a single file or load into your analysis tool
- [ ] Verify log completeness (check for gaps in timestamps)

### Step 2: Extract Bot Traffic (Day 1)

- [ ] Filter for Googlebot traffic (verified IPs)
- [ ] Filter for Bingbot traffic
- [ ] Filter for AI bot traffic (GPTBot, PerplexityBot, ClaudeBot, etc.)
- [ ] Save each segment for separate analysis

### Step 3: Analyze Googlebot Behavior (Day 1-2)

- [ ] **Total crawl volume.** Compare to previous month. Is it growing, stable, or declining?
- [ ] **Crawl volume by day.** Identify any anomalous days (spikes or drops).
- [ ] **Status code distribution.** Calculate % for each status code. Compare to previous month.
- [ ] **Top crawled URLs.** List the 50 most-crawled URLs. Are these the URLs you want Google to prioritize?
- [ ] **Least crawled important URLs.** Cross-reference sitemap against crawled URLs. Which sitemap URLs were not crawled?
- [ ] **Response time analysis.** Average and P95 response time overall and by URL group.
- [ ] **URL pattern analysis.** Group crawled URLs by pattern. Identify crawl waste.

### Step 4: Analyze AI Bot Behavior (Day 2)

- [ ] **AI bot crawl volume by bot.** How many requests from each AI bot?
- [ ] **Top URLs crawled by AI bots.** What content are AI bots most interested in?
- [ ] **AI bot crawl trend.** Is AI crawling increasing month over month?
- [ ] **Robots.txt compliance.** Are AI bots respecting your robots.txt directives?

### Step 5: Cross-Reference with SEO Data (Day 2-3)

- [ ] **Crawl frequency vs rankings.** For your top 50 keywords, correlate the ranking position with crawl frequency of the ranking URL.
- [ ] **Crawl vs index coverage.** Compare the set of URLs crawled by Googlebot against GSC index coverage data. Are there URLs being crawled but not indexed? URLs indexed but not crawled recently?
- [ ] **New URL discovery.** Identify URLs Googlebot crawled that are not in your sitemap or internal link map. Where did Google find them?

### Step 6: Generate Recommendations (Day 3)

- [ ] List all crawl budget waste identified (with estimated request savings)
- [ ] List URLs with response time problems (with specific endpoints to optimize)
- [ ] List indexation gaps (URLs not crawled or crawled but not indexed)
- [ ] Prioritize recommendations by estimated impact
- [ ] Document in the monthly SEO report (see `36-seo/measurement/seo-reporting.template.md`)

### Step 7: Implement and Verify (Ongoing)

- [ ] Implement robots.txt changes for crawl waste reduction
- [ ] Fix server errors identified in log analysis
- [ ] Optimize response time for slow endpoints
- [ ] Add internal links to under-crawled important pages
- [ ] In next month's analysis, verify that changes had the intended effect

---

## Cross-References

- `36-seo/technical/crawlability-indexation.md` — crawl budget fundamentals and indexation management
- `36-seo/technical/robots-sitemap-canonical.md` — robots.txt configuration
- `36-seo/ai-seo/llm-friendly-content.md` — AI bot robots.txt policy (allow vs block decisions)
- `36-seo/measurement/seo-kpi-dashboard.template.md` — integrating crawl metrics into the dashboard
- `36-seo/measurement/seo-reporting.template.md` — monthly reporting templates
