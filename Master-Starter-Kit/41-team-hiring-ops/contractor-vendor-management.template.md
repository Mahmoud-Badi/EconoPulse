# Contractor & Vendor Management

> Contractors and vendors are force multipliers when managed well and liability generators when managed poorly. This template covers when to use contractors vs FTEs, agreement structure, IP protection, onboarding, performance evaluation, FTE transition planning, and budget tracking — so that every external engagement has clear scope, legal protection, and a planned exit.

---

## 1. When to Use Contractors vs FTEs

### Decision Matrix

| Factor | Favor Contractor | Favor FTE |
|--------|------------------|-----------|
| **Duration** | < 6 months, defined deliverable | Ongoing, indefinite need |
| **Scope** | Well-bounded, documented in SOW | Broad, evolving, requires judgment calls |
| **Context depth** | Shallow — can onboard quickly with documentation | Deep — requires months of institutional knowledge |
| **Sensitivity** | No access to core IP, customer data, or strategic plans | Needs access to sensitive systems and strategy |
| **Management** | Self-directed, experienced, needs minimal supervision | Needs mentorship, career development, integration |
| **Cost structure** | Higher hourly but lower total (no benefits, no equity) | Lower hourly but higher total (benefits, equity, taxes) |
| **Availability** | Fractional (20-30 hrs/week) or burst capacity | Full-time dedication required |
| **Legal risk** | Low — if properly classified and contracted | Low — standard employment relationship |

### Common Contractor Use Cases

| Use Case | Typical Duration | Typical Structure | Notes |
|----------|-----------------|-------------------|-------|
| **MVP development** | 2-4 months | Project-based, fixed scope | Good for validating before hiring FTE |
| **Design sprint** | 2-6 weeks | Project-based, deliverable-focused | Brand, UX research, design system creation |
| **Infrastructure setup** | 1-3 months | Hourly, advisory + hands-on | CI/CD, cloud architecture, monitoring |
| **Content creation** | Ongoing | Per-piece or monthly retainer | Blog posts, documentation, marketing copy |
| **Specialized expertise** | 2-8 weeks | Hourly, advisory | Security audit, performance optimization, compliance |
| **Capacity overflow** | 1-3 months | Hourly, embedded in team | Sprint surge, launch preparation |
| **Fractional executive** | 3-12 months | Part-time, advisory | CFO, CTO, CMO before you need full-time |

---

## 2. Contractor Agreement Template (SOW Structure)

Every contractor engagement must have a written Statement of Work (SOW) before work begins. Verbal agreements are not agreements.

### SOW Template

```
STATEMENT OF WORK (SOW)
=======================
Agreement between: {{PROJECT_NAME}} ("Company")
And: [Contractor Name / Entity] ("Contractor")
Effective date: ____
End date: ____
SOW number: SOW-{{YEAR}}-{{NUMBER}}

1. SCOPE OF WORK
   1.1 Project description:
       ____

   1.2 Deliverables:
       | # | Deliverable | Description | Due Date | Acceptance Criteria |
       |---|-------------|-------------|----------|-------------------|
       | 1 | | | | |
       | 2 | | | | |
       | 3 | | | | |

   1.3 Out of scope (explicitly excluded):
       - ____
       - ____

2. TIMELINE
   | Milestone | Target Date | Dependencies |
   |-----------|------------|--------------|
   | Kickoff | | |
   | Milestone 1 | | |
   | Milestone 2 | | |
   | Final delivery | | |

3. COMPENSATION
   3.1 Rate structure:
       - [ ] Hourly rate: $____ /hour
       - [ ] Fixed project fee: $____
       - [ ] Monthly retainer: $____ /month

   3.2 Estimated total: $____
   3.3 Maximum not-to-exceed: $____ (requires written approval to exceed)
   3.4 Payment terms: Net ____ days from invoice
   3.5 Invoice frequency: [weekly / bi-weekly / monthly / milestone-based]

4. WORKING ARRANGEMENTS
   4.1 Hours per week: ____ (maximum)
   4.2 Communication channel: [Slack / email / project tool]
   4.3 Status update frequency: [daily / weekly]
   4.4 Point of contact (Company): ____
   4.5 Point of contact (Contractor): ____

5. INTELLECTUAL PROPERTY
   All work product created under this SOW is owned by Company.
   (See IP Assignment Agreement, attached as Exhibit A)

6. CONFIDENTIALITY
   Contractor will not disclose Company's confidential information.
   (See NDA, attached as Exhibit B)

7. TERMINATION
   7.1 Either party may terminate with ____ days written notice
   7.2 Company pays for all work completed through termination date
   7.3 Contractor delivers all work product upon termination

8. INDEPENDENT CONTRACTOR STATUS
   Contractor is an independent contractor, not an employee.
   Contractor is responsible for their own taxes, insurance, and equipment.
   Company does not provide benefits, office space, or equipment to Contractor.

SIGNATURES
Company: ____  Date: ____
Contractor: ____  Date: ____
```

---

## 3. Vendor Evaluation Criteria

For agencies, SaaS tools, and service providers — evaluate before engaging.

### Vendor Evaluation Scorecard

| Criterion | Weight | Score (1-5) | Weighted Score | Notes |
|-----------|--------|-------------|---------------|-------|
| **Relevant experience** | 20% | | | Have they done this for companies like ours? |
| **Quality of past work** | 20% | | | Portfolio review, case studies, references |
| **Communication quality** | 15% | | | Response time, clarity, proactiveness during evaluation |
| **Pricing** | 15% | | | Competitive with alternatives? Value for money? |
| **Flexibility** | 10% | | | Can they adapt to changing requirements? |
| **Team quality** | 10% | | | Who will actually do the work (not just who sold it)? |
| **Security & compliance** | 5% | | | SOC 2, GDPR compliance, data handling practices |
| **References** | 5% | | | What do past clients say? Would they use them again? |
| **Total** | 100% | | /5.0 | |

**Scoring thresholds:**
- 4.0+ → Strong candidate, proceed to negotiation
- 3.0-3.9 → Acceptable, compare against alternatives
- Below 3.0 → Do not engage

### Reference Check Questions for Vendors

1. What project did [Vendor] complete for you? What was the scope?
2. Did they deliver on time and within budget? If not, what happened?
3. How was their communication throughout the project?
4. Who on their team did the actual work? Were they the same people presented during the sales process?
5. Would you hire them again for a similar project? Why or why not?
6. What is one thing they could have done better?

---

## 4. IP Assignment & NDA Requirements

### What Must Be Signed Before Work Begins

| Document | Required For | When Signed | Template |
|----------|-------------|-------------|---------|
| **NDA (Non-Disclosure Agreement)** | All contractors and vendors | Before any confidential information is shared | Exhibit B of SOW |
| **IP Assignment Agreement** | All contractors producing work product (code, design, content) | Before work begins | Exhibit A of SOW |
| **Data Processing Agreement (DPA)** | Vendors handling customer data | Before data access is granted | Separate agreement |
| **Master Service Agreement (MSA)** | Long-term vendor relationships | Before first SOW | Umbrella contract |

### IP Assignment Key Clauses

Your IP assignment agreement must include:

- [ ] **Work-for-hire declaration:** All work product created under the SOW is work made for hire and owned by Company
- [ ] **Assignment of rights:** To the extent work product is not work for hire, Contractor assigns all rights to Company
- [ ] **Moral rights waiver:** Contractor waives all moral rights (where applicable by jurisdiction)
- [ ] **Prior work exclusion:** Contractor may list pre-existing work that is excluded from assignment
- [ ] **License back for pre-existing work:** If contractor uses their pre-existing work in deliverables, Company gets a perpetual, irrevocable license
- [ ] **No open-source contamination:** Contractor will not introduce copyleft-licensed code without written approval
- [ ] **Representations:** Contractor represents that the work is original and does not infringe third-party rights

**Warning:** IP assignment law varies by jurisdiction. Have a lawyer review your template before first use. In some jurisdictions, certain IP cannot be assigned through work-for-hire and requires explicit assignment.

---

## 5. Contractor Onboarding (Lighter Than FTE)

Contractor onboarding is faster and narrower than FTE onboarding. The goal is productive contribution within 2-3 days, not deep organizational integration.

### Contractor Onboarding Checklist

**Day 0 (Before start):**
- [ ] SOW, NDA, and IP assignment signed
- [ ] Payment information collected
- [ ] Limited access accounts created (GitHub, Slack, project tool — scoped to project only)
- [ ] Project documentation shared
- [ ] Point of contact identified and introduced
- [ ] Communication norms documented (response times, channels, meeting schedule)

**Day 1:**
- [ ] Kickoff meeting (30-60 min): scope review, questions, timeline confirmation
- [ ] Codebase access verified (can clone, build, run if applicable)
- [ ] First deliverable milestone confirmed
- [ ] Status update format agreed (daily standup message, weekly summary, etc.)

**Day 2-3:**
- [ ] Contractor begins working on first deliverable
- [ ] First check-in to verify progress and unblock any issues
- [ ] Code review of first PR (if code-related engagement)

### What Contractors Do NOT Get

| FTE Benefit | Contractor Equivalent | Notes |
|-------------|----------------------|-------|
| Full Slack access | Project-specific channels only | No access to #general, #random, #leadership |
| All-hands attendance | Not invited | Unless directly relevant to their project |
| Company strategy docs | Only project-relevant docs | No board decks, financial reports, fundraising docs |
| Performance reviews | SOW milestone reviews | Evaluated on deliverables, not growth |
| 1:1s with manager | Weekly status sync | Shorter, deliverable-focused, not career-focused |
| Equipment | Use their own | Independent contractor = their own tools |
| Benefits | None | Independent contractor status |

---

## 6. Performance Evaluation for Contractors

### Milestone Review Template

At each SOW milestone:

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| **Deliverable quality** | | Does the work meet acceptance criteria? |
| **Timeliness** | | Delivered on or before the milestone date? |
| **Communication** | | Proactive updates? Responsive to questions? Flagged risks early? |
| **Autonomy** | | Needed minimal guidance? Self-directed? |
| **Documentation** | | Work is documented? Can someone else maintain it? |
| **Overall** | | Would you engage this contractor again? |

### Performance Actions

| Average Score | Action |
|--------------|--------|
| 4.0+ | Excellent. Consider for future engagements. Add to preferred contractor list. |
| 3.0-3.9 | Acceptable. Continue engagement. Provide specific feedback on areas below 4.0. |
| 2.0-2.9 | Below expectations. Formal conversation about gaps. Consider replacing for next phase. |
| Below 2.0 | Unacceptable. Initiate termination per SOW terms. Document issues for records. |

---

## 7. Transition Planning (Contractor to FTE)

### When to Convert

| Signal | Weight |
|--------|--------|
| Contractor has been engaged for 6+ months continuously | Strong signal — may also trigger misclassification risk |
| Work is becoming core and ongoing rather than project-based | Strong signal — this is now an FTE role |
| Contractor has accumulated deep institutional knowledge | Medium signal — hard to replace |
| Contractor expresses interest in full-time employment | Necessary (but not sufficient) condition |
| Total contractor cost exceeds equivalent FTE cost (including benefits) | Financial signal — conversion may be cheaper |

### Conversion Process

| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | Verify contractor is interested in FTE conversion | Hiring manager | Week 1 |
| 2 | Create formal role definition using `role-definition-framework.template.md` | Hiring manager | Week 1 |
| 3 | Determine level and compensation using `compensation-framework.template.md` | Hiring manager + HR | Week 2 |
| 4 | Calculate equity grant based on level (credit time as contractor? company policy varies) | HR + Legal | Week 2 |
| 5 | Check agency contract for conversion fees (if contractor came through agency) | HR | Week 2 |
| 6 | Extend offer | Hiring manager | Week 3 |
| 7 | Terminate contractor agreement upon FTE start date | HR | Start date |
| 8 | Run FTE onboarding (lighter version — they already know the codebase and team) | Hiring manager | Week 1 of FTE |

### Agency Conversion Fees

If the contractor was sourced through an agency, expect:

| Fee Type | Typical Range | Negotiation Strategy |
|----------|--------------|---------------------|
| **Direct conversion fee** | 10-25% of first-year salary | Negotiate before engagement starts (in MSA) |
| **Temp-to-perm buyout** | Decreases with engagement length (6 months → 15%, 12 months → 5%) | Longer engagement = lower fee |
| **Waiting period** | 3-6 months after agency contract ends, no fee | Wait it out if contractor is willing |

---

## 8. Budget Tracking

### Contractor Budget Dashboard

| Contractor / Vendor | SOW # | Start | End | Rate | Monthly Cost | Total Budget | Spent to Date | Remaining | Status |
|--------------------|-------|-------|-----|------|-------------|-------------|--------------|-----------|--------|
| | | | | | | | | | Active |
| | | | | | | | | | Active |
| | | | | | | | | | Completed |

### Monthly Budget Summary

| Category | Budget (Monthly) | Actual (This Month) | YTD Spend | Annual Budget | Variance |
|----------|-----------------|--------------------|-----------|--------------|---------|
| Engineering contractors | | | | | |
| Design contractors | | | | | |
| Content / Marketing contractors | | | | | |
| SaaS tools and services | | | | | |
| Agencies | | | | | |
| **Total** | **{{HIRING_BUDGET_MONTHLY}}** | | | | |

### Budget Alerts

| Alert | Trigger | Action |
|-------|---------|--------|
| **Approaching limit** | 80% of SOW budget consumed before 80% of timeline elapsed | Review scope. Discuss with contractor. Prepare change order or scope reduction. |
| **Over budget** | Spend exceeds SOW not-to-exceed amount | Stop work. Formal change order required with new budget approval. |
| **Runway impact** | Total contractor spend exceeds {{HIRING_BUDGET_MONTHLY}} for 2+ months | Review engagement portfolio. Identify contractors to pause or convert to FTE. |
| **Invoice anomaly** | Invoice significantly differs from expected amount | Verify hours/deliverables before payment. Discuss discrepancy with contractor. |

---

## Checklist

- [ ] Determined which roles should be contractors vs FTEs using the decision matrix
- [ ] Created SOW template with deliverables, timeline, compensation, and termination terms
- [ ] Established vendor evaluation scorecard and minimum score threshold
- [ ] Prepared IP assignment and NDA templates (reviewed by legal counsel)
- [ ] Created contractor onboarding checklist with scoped access and Day 1 kickoff
- [ ] Set up milestone review process for all active contractors
- [ ] Documented FTE conversion process with conversion fee awareness
- [ ] Created budget tracking dashboard with alerts for overspend
- [ ] Verified contractor classification compliance (consult employment lawyer for your jurisdiction)
- [ ] Stored all signed SOWs, NDAs, and IP assignments in a secure, accessible location
