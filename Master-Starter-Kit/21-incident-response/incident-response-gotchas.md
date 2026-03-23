# Incident Response Gotchas

> Hard-won production lessons from teams that learned the hard way. Read this before your first incident, not during it.

---

## The Lessons

### 1. "Rollback first, debug second — production is not a debugging environment"

The instinct to understand what went wrong before fixing it is strong. Fight it. Every minute you spend reading code and checking logs while production is down is a minute your users are suffering. The correct sequence is: (1) restore service, (2) understand why.

**The anti-pattern:** An engineer sees errors spiking after a deployment. Instead of rolling back, they open the code diff, read through the changes, try to understand the bug, write a fix, and deploy it. Total time: 45 minutes. A rollback would have taken 3 minutes.

**The fix:** Default to rollback. You can always re-deploy after you understand the problem. The code is not going anywhere. Your customers might be.

**Exception:** If the rollback itself is risky (irreversible database migration, data format change), then yes, fix forward. But that should be the exception, not the rule. And the fact that rollback is risky should have been planned for before the deployment.

---

### 2. "Communicate early even without answers — silence is worse than 'we are investigating'"

When things break, the natural human instinct is to wait until you have answers before saying anything. This is exactly wrong. Silence during an outage causes two things: (1) customers assume you do not know about the problem, and (2) your team assumes nobody is working on it.

**The anti-pattern:** The team detects an issue at 2:15 PM. They work on it for 40 minutes. At 2:55 PM, someone asks "should we update the status page?" The first external communication goes out at 3:05 PM — 50 minutes after detection. Customers have already posted on Twitter and filed 30 support tickets.

**The fix:** Post "We are investigating reports of [symptom]. We will update within 30 minutes." within 10 minutes of detection. It takes 60 seconds to write. It buys you 30 minutes of goodwill.

---

### 3. "Every incident without a postmortem will repeat"

If you do not understand why an incident happened, you cannot prevent it from happening again. And if you do not write it down, you will not remember the nuances a month later. Postmortems are not bureaucracy — they are the mechanism that turns incidents into reliability improvements.

**The anti-pattern:** A SEV2 incident is resolved on Tuesday. The team says "we should do a postmortem." By Thursday, everyone is busy with sprint work. By the following Tuesday, the details are fuzzy. The postmortem never happens. Three months later, the same incident occurs.

**The fix:** Schedule the postmortem before you close the incident. Put it on the calendar within 48 hours. Make it non-negotiable. A 30-minute postmortem that produces 2 action items is infinitely more valuable than no postmortem.

---

### 4. "On-call without runbooks is hazing, not engineering"

Putting someone on call for a system they have never operated, with no documentation on how to diagnose or fix common problems, is not "on-call." It is setting someone up to fail at 3 AM while stressed and sleep-deprived. On-call requires runbooks.

**The anti-pattern:** A junior engineer is added to the on-call rotation. At 2 AM, they get paged for a database connection error. They have never seen this error. They do not know which dashboard to check. They do not know who to escalate to. They spend 90 minutes flailing before waking up a senior engineer who fixes it in 5 minutes.

**The fix:** Before anyone goes on call, they should have: (1) runbooks for the top 10 failure modes, (2) a clear escalation path, (3) access to all necessary tools, and (4) a shadow rotation where they observe before they are primary.

---

### 5. "Your monitoring is only as good as your last alert that fired correctly"

Monitoring that exists but does not alert is decoration. The only way to know your alerting works is to verify it regularly. Alert configurations drift, thresholds become stale, notification channels get disconnected, and on-call schedules get out of date.

**The anti-pattern:** The team set up comprehensive monitoring six months ago. Since then, the Slack webhook token expired, the on-call schedule was not updated for two new hires, and the error rate threshold was set for the old traffic volume (it is now 5x higher, so the threshold never triggers). When a real incident happens, nobody gets alerted. A customer emails support 45 minutes later.

**The fix:** Test your alerting monthly. Send a test alert through every channel. Verify it reaches the on-call engineer. Check that thresholds still make sense for current traffic volumes. Treat alert configuration like code — review it, test it, update it.

---

### 6. "Test your incident response process before you need it — game days"

The first time your team runs through the incident response process should not be during a real SEV1 at 2 AM. Just like fire drills, incident response drills (game days) build muscle memory and reveal process gaps in a low-stakes environment.

**The anti-pattern:** The team has a beautiful incident response runbook. Nobody has ever practiced it. During a real incident, the IC does not know how to update the status page, the TL cannot find the rollback procedure, and the CL does not have the customer communication templates. The process that looked great on paper falls apart under pressure.

**The fix:** Run a game day quarterly. Simulate a realistic incident (inject a failure in staging, or use a tabletop exercise). Walk through the full process: detection, triage, communication, mitigation, resolution, postmortem. Debrief afterward and update the process based on what you learned.

**Game day ideas:**
- Kill a database replica and see if failover works
- Deploy a broken config to staging and practice rollback
- Simulate a third-party outage by blocking an external API
- Run a tabletop exercise: "Stripe is down. What do we do?"
- Page the on-call engineer unannounced and see how long it takes to respond

---

### 7. "The incident commander does not fix — they coordinate"

The IC role exists because, during a high-severity incident, someone needs to keep track of the big picture while engineers are deep in debugging. When the IC starts writing code, nobody is tracking the timeline, nobody is coordinating communication, and the response becomes a group of individuals working in parallel without alignment.

**The anti-pattern:** The most senior engineer declares themselves IC and then immediately starts debugging the root cause. Nobody is updating the status page. Nobody is tracking what has been tried. A second engineer starts working on the same thing without knowing. Thirty minutes in, the CTO asks for an update and nobody can provide one.

**The fix:** The IC does three things: (1) coordinate — make sure the right people are working on the right things, (2) communicate — provide regular updates to stakeholders, and (3) decide — make calls on escalation, scope, and resource allocation. If the IC is also the best person to debug, assign someone else as IC.

---

### 8. "Status pages that are always green teach customers to distrust them"

If your status page has been "All Systems Operational" for the past 12 months, but your customers have experienced multiple outages in that time, your status page is a lie. Customers learn quickly that your status page is unreliable and stop checking it. Then, when you actually need them to check it during a major incident, they do not bother.

**The anti-pattern:** The team is reluctant to post incidents on the status page because it "looks bad." Minor outages are handled internally without any public acknowledgment. Customers notice the outages anyway (because they are using the product) and start telling each other "their status page is useless." When a major incident happens and the team actually updates the status page, customers see it hours later because they stopped checking it.

**The fix:** Post every customer-affecting incident on the status page, no matter how small. A 5-minute blip? Post it. Brief performance degradation? Post it. This builds trust because customers see that the status page reflects reality. When a real incident happens, they check the status page first because they know it is reliable.

---

### 9. "Blame is the enemy of learning"

Blameless postmortems are not about being soft or avoiding accountability. They are about creating an environment where people tell the truth. If the person who made the change that caused the outage is afraid of being punished, they will hide information, downplay their involvement, and minimize the root cause. The result: an incomplete postmortem that does not actually prevent recurrence.

**The anti-pattern:** During a postmortem, the discussion turns to "who approved this PR?" and "why did you not test this?" The engineer who wrote the code gets defensive. They stop volunteering information. The postmortem becomes a blame exercise disguised as a learning exercise. The action items focus on "better code review" (vague and unmeasurable) instead of systemic fixes like automated testing or deployment safeguards.

**The fix:** Replace "Person X should have..." with "The system allowed..." Instead of "Why did you deploy on Friday?" ask "Why does our process allow deployments on Friday if they are risky?" The goal is to make the system better, not to punish the person. Humans make mistakes. Systems should catch them.

**Litmus test for blamelessness:** If you can replace the name of the person involved with "any engineer on the team" and the postmortem still makes sense, it is blameless. If it only makes sense with a specific person's name, it is blame.

---

### 10. "The most dangerous incidents are the ones nobody notices"

The loud, dramatic SEV1 where everything is on fire gets attention. The silent SEV3 where 5% of users have corrupted data for three weeks does not. Silent incidents cause more cumulative damage because they are not detected, not triaged, and not fixed until the damage is extensive.

**The anti-pattern:** A background job has been silently failing for two weeks, causing data inconsistencies for a small percentage of users. No alert fired because error rates stayed below the threshold. No customer reported it because they assumed the data was correct. When it is finally discovered, the cleanup takes days and requires manual data reconciliation.

**The fix:**
- Monitor for data consistency, not just uptime and error rates
- Set up alerts for background job failures, not just application request failures
- Review data integrity checks regularly (row counts, referential integrity, business rule validation)
- Use anomaly detection in addition to static thresholds — a 2% error rate is fine if your baseline is 1.5%, but alarming if your baseline is 0.01%
- Periodically audit: "What could be broken right now that we would not know about?"

---

## Bonus Lessons

### 11. "Toil is a reliability problem"

If your on-call engineer spends their week doing manual tasks (restarting services, clearing logs, running manual data fixes), they have less energy and attention for real incidents. Automate repetitive operational tasks. Every manual runbook step is a candidate for automation.

### 12. "Your backup strategy is only as good as your last restore test"

Having backups is not the same as being able to restore from backups. If you have never tested a restore, you do not know if it works. Test quarterly. Time the restoration. Document the process. Know your RPO (Recovery Point Objective) and RTO (Recovery Time Objective) from actual tests, not theoretical calculations.

### 13. "Do not page on things that do not require human judgment"

If the correct response to an alert is always the same (restart the service, clear the cache, scale up), automate it. Pages that wake people up should require human decision-making. Everything else should self-heal. Alert fatigue from unnecessary pages is one of the fastest ways to destroy an on-call culture.

### 14. "Incident response is a team skill, not an individual skill"

You can have the best engineers in the world, but if they cannot coordinate during an incident, response times will be slow. Practice coordination: IC/TL/CL role assignment, parallel workstreams, structured communication. The best incident responders are not the best debuggers — they are the best coordinators.

### 15. "The deployment that causes the outage is rarely the one you suspect"

Often, a deployment looks fine for hours or days before causing an issue. Memory leaks accumulate, connection pools slowly drain, cache entries expire and are not replenished. When the issue manifests, the most recent deployment gets blamed, but the root cause may be 3 deployments ago. Always check the timeline carefully.

---

## Quick-Reference Anti-Pattern Checklist

Use this during your quarterly incident review:

- [ ] Are we rolling back fast, or are we debugging in production?
- [ ] Are we communicating within 10 minutes, or are we staying silent?
- [ ] Is every SEV1-SEV3 incident getting a postmortem?
- [ ] Do all on-call engineers have runbooks for the top 10 failure modes?
- [ ] Have we tested our alerting in the last 30 days?
- [ ] Have we run a game day in the last quarter?
- [ ] Is the IC staying in the coordination role, or are they debugging?
- [ ] Does our status page reflect reality?
- [ ] Are our postmortems blameless?
- [ ] Are we catching silent failures with data integrity monitoring?

If you answered "no" to any of these, you have found your next reliability investment.
