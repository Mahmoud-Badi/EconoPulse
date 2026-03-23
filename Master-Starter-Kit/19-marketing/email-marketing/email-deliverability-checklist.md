# Email Deliverability Checklist

> Technical setup and ongoing practices to ensure your emails reach the inbox, not the spam folder.

---

## Why Deliverability Matters

You can write the perfect email, but it's worthless if it lands in spam. Email deliverability is the percentage of emails that successfully reach the recipient's inbox. Industry average is ~85%, but with proper setup you should target 95%+.

---

## Technical Authentication Setup

### 1. SPF (Sender Policy Framework)

SPF tells receiving mail servers which IP addresses are authorized to send email on behalf of your domain.

**Setup:**
1. Identify all services that send email from your domain (email provider, marketing tool, transactional email service)
2. Add a TXT record to your DNS:
   ```
   v=spf1 include:_spf.google.com include:sendgrid.net include:mailchimp.com ~all
   ```
3. Include entries for each sending service
4. Use `~all` (soft fail) during setup, then switch to `-all` (hard fail) once confirmed

**Verification:** Use [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx) to validate your record.

### 2. DKIM (DomainKeys Identified Mail)

DKIM adds a digital signature to your emails, proving they haven't been tampered with in transit.

**Setup:**
1. Generate DKIM keys through your email service provider
2. Add the provided CNAME or TXT record to your DNS
3. Each sending service needs its own DKIM record
4. Use 2048-bit keys (not 1024-bit — those are considered weak)

**Verification:** Send a test email to [mail-tester.com](https://www.mail-tester.com) and check DKIM status.

### 3. DMARC (Domain-based Message Authentication)

DMARC tells receiving servers what to do with emails that fail SPF or DKIM checks.

**Setup (phased approach):**

Phase 1 — Monitor only (start here):
```
v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com; pct=100
```

Phase 2 — Quarantine failures (after 2-4 weeks of monitoring):
```
v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com; pct=100
```

Phase 3 — Reject failures (after confirming legitimate emails pass):
```
v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.com; pct=100
```

**Verification:** Check DMARC reports or use [DMARC Analyzer](https://www.dmarcanalyzer.com).

### 4. Custom Return-Path

Set up a custom return-path (bounce address) that matches your sending domain. This improves SPF alignment and deliverability.

### 5. Custom Tracking Domain

Use your own domain for tracking links and open pixels instead of your email provider's default domain. This avoids shared reputation issues.

Example: `track.yourdomain.com` instead of `click.mailprovider.com`

---

## IP Warmup Schedule

If you're using a new IP address or domain for sending, you must warm it up gradually. Sending too much too fast from a new IP triggers spam filters.

### Warmup Schedule (New IP)

| Day | Daily Send Volume | Notes |
|-----|------------------|-------|
| 1-2 | 50 | Send to your most engaged contacts only |
| 3-4 | 100 | Continue with engaged contacts |
| 5-7 | 250 | |
| 8-10 | 500 | Monitor bounce rates and spam complaints |
| 11-14 | 1,000 | |
| 15-21 | 2,500 | |
| 22-28 | 5,000 | |
| 29-35 | 10,000 | |
| 36+ | Full volume | Gradually increase to full list |

### Warmup Rules
- Send to most engaged subscribers first (recent openers, clickers)
- Monitor bounce rate (must stay below 2%)
- Monitor spam complaint rate (must stay below 0.1%)
- If metrics spike, pause and reduce volume
- Consistent daily sending is better than sporadic large sends

---

## Sender Reputation Monitoring

### Tools for Monitoring
- **Google Postmaster Tools** — Shows your domain reputation with Gmail (register at postmaster.google.com)
- **Microsoft SNDS** — Smart Network Data Services for Outlook/Hotmail reputation
- **Sender Score** (by Validity) — IP reputation score out of 100
- **MXToolbox** — Blacklist monitoring and DNS health
- **mail-tester.com** — Spam score testing (send test emails here)

### Key Metrics to Track
| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Bounce rate | < 1% | 1-2% | > 2% |
| Spam complaint rate | < 0.05% | 0.05-0.1% | > 0.1% |
| Open rate | > 20% | 10-20% | < 10% |
| Unsubscribe rate | < 0.5% | 0.5-1% | > 1% |
| Sender Score | > 80 | 60-80 | < 60 |

---

## List Hygiene

### Bounce Handling
- **Hard bounces:** Remove immediately after first occurrence (invalid email addresses)
- **Soft bounces:** Remove after 3-5 consecutive soft bounces (full inbox, server down)
- Never re-add hard bounced addresses
- Clean your list monthly

### Sunset Policy for Inactive Subscribers
- Define "inactive": no opens or clicks in 90 days
- Send a re-engagement campaign to inactives ("Do you still want to hear from us?")
- If no engagement after re-engagement attempt, move to suppression list
- Never send to subscribers who've been inactive for 6+ months without re-engagement first

### List Verification
- Use an email verification service before importing any list (ZeroBounce, NeverBounce, Hunter.io)
- Verify new signups in real-time with double opt-in or API verification
- Remove role-based addresses (info@, admin@, support@) — they hurt deliverability
- Remove disposable email addresses (mailinator, guerrillamail, etc.)

---

## Content Best Practices

### Spam Trigger Words to Avoid
These words in subject lines or body copy increase spam score:
- "Free," "Act now," "Limited time," "Urgent," "Click here"
- "Guaranteed," "No obligation," "Winner," "Congratulations"
- ALL CAPS in subject lines
- Excessive exclamation marks (!!!)
- "Re:" or "Fwd:" in subject lines when it's not a reply

### Image-to-Text Ratio
- Keep at least 60% text, 40% images
- Never send image-only emails (spam filters can't read images)
- Always include alt text for images
- Avoid embedding images as base64 — use hosted image URLs

### Link Best Practices
- Don't use URL shorteners (bit.ly, tinyurl) — they're commonly used by spammers
- Limit to 3-5 links per email
- All links should go to your own domain (or well-known domains)
- Avoid linking to newly registered domains
- Ensure all links work (broken links trigger spam filters in some systems)

### HTML Best Practices
- Use inline CSS, not external stylesheets
- Keep HTML under 100KB
- Use standard fonts (Arial, Helvetica, Georgia, Times)
- Include a plain-text version of every HTML email
- Test rendering across email clients (Litmus, Email on Acid)

---

## Ongoing Monitoring Schedule

### Daily
- Check bounce rate for any sends from the previous day
- Monitor spam complaint rate
- Check support inbox for delivery issues reported by users

### Weekly
- Review open and click rates by email type
- Check Google Postmaster Tools domain reputation
- Review any blacklist alerts (set up monitoring at MXToolbox)

### Monthly
- Run list hygiene (remove bounces, verify new additions)
- Review sender score
- Analyze deliverability by mailbox provider (Gmail vs Outlook vs Yahoo)
- Clean inactive subscribers per sunset policy

### Quarterly
- Full authentication audit (SPF, DKIM, DMARC records)
- Review email sending practices against current best practices
- Test inbox placement across major providers
- Review and update re-engagement campaigns

---

## Pre-Send Checklist

Before sending any email campaign:

- [ ] SPF, DKIM, DMARC all passing (check with mail-tester.com)
- [ ] Sending from authenticated, custom domain (not gmail.com)
- [ ] Custom tracking domain configured
- [ ] List cleaned within the last 30 days
- [ ] Hard bounces removed
- [ ] Subject line checked for spam triggers
- [ ] Image-to-text ratio is acceptable (60%+ text)
- [ ] All links tested and working
- [ ] Plain-text version included
- [ ] Unsubscribe link present and functional
- [ ] Physical mailing address included (CAN-SPAM requirement)
- [ ] Test email sent and checked across Gmail, Outlook, Apple Mail
- [ ] Spam score tested (mail-tester.com score > 8/10)
