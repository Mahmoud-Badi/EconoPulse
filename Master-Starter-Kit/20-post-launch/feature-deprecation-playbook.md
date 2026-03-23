# Feature Deprecation Playbook

> **How to remove features without removing users.** Deprecation is the hardest product decision because it requires admitting that something you built is no longer worth maintaining. This playbook gives you the timeline, templates, and process to do it responsibly.

---

## When to Deprecate

Deprecation is appropriate when:

1. **Usage is critically low.** Less than 5% of active users have touched the feature in the past 90 days.
2. **Maintenance cost exceeds value.** The feature causes disproportionate bugs, support tickets, or engineering complexity relative to its usage.
3. **It conflicts with product direction.** The feature pulls the product in a direction that no longer aligns with your strategy.
4. **A better alternative exists.** You have built (or will build) a replacement that serves the same need more effectively.
5. **Security or compliance risk.** The feature cannot be maintained to current security or regulatory standards without a rewrite.

Deprecation is NOT appropriate when:

- The feature is unpopular but critical for a high-value segment (e.g., API used by your largest enterprise customer)
- You just do not want to maintain it (that is technical debt, not deprecation)
- A competitor removed it (their users are not your users)

---

## The 90-Day Deprecation Timeline

Every feature deprecation follows this timeline. Compress it at your peril — users need time to adapt.

```
Day 0          Day 30         Day 60         Day 90
│              │              │              │
▼              ▼              ▼              ▼
ANNOUNCE ────→ WARN ────────→ FINAL ───────→ REMOVE
                              NOTICE
```

### Day 0: Announce (90 Days Before Removal)

**Actions:**
- Publish deprecation announcement in changelog
- Send email to all users who have used the feature in the past 6 months
- Add deprecation banner in the product UI (visible when accessing the feature)
- Update API documentation to mark endpoints as deprecated
- Add `Deprecation` and `Sunset` HTTP headers to API responses (see API section below)
- Create migration guide or document the alternative

**Communication tone:** Informative, not apologetic. Explain the WHY clearly.

### Day 30: Warn (60 Days Before Removal)

**Actions:**
- Send second email to users who are STILL using the feature (not all users — only active users of the deprecated feature)
- Escalate UI warning: change banner from informational (blue/yellow) to urgent (orange)
- Add in-app tooltip or modal on first use: "This feature is being removed on [DATE]. [Migration guide link]"
- Offer migration assistance for high-value customers (white-glove if needed)
- Review support tickets related to the deprecation. Address common concerns.

**Communication tone:** Urgent but helpful. Offer concrete migration steps.

### Day 60: Final Notice (30 Days Before Removal)

**Actions:**
- Send final email: "Last chance. [Feature] is being removed on [DATE]."
- UI warning becomes blocking for new usage: "This feature is being removed in 30 days. Please migrate to [alternative]."
- Existing workflows continue to function (do not break anything yet)
- Offer data export for any user data that will be lost
- Provide one-click migration if technically feasible
- Personally reach out to any remaining high-usage accounts

**Communication tone:** Direct and final. No ambiguity about what happens on Day 90.

### Day 90: Remove

**Actions:**
- Remove the feature from the product
- Remove UI entry points (navigation, menus, buttons)
- API endpoints return `410 Gone` with a response body explaining the removal and linking to alternatives
- Redirect old URLs to the migration guide or alternative feature
- Send confirmation email: "[Feature] has been removed. Here is what to use instead."
- Archive (do not delete) the code in case rollback is needed
- Update all documentation to remove references to the deprecated feature
- Close all related support tickets with a final response

---

## Communication Templates

### Day 0: Deprecation Announcement Email

```
Subject: [Your Product] Changes coming: [Feature Name] is being deprecated

Hi [Name],

We are writing to let you know that [Feature Name] will be removed from
[Your Product] on [DATE — 90 days from now].

WHY WE ARE MAKING THIS CHANGE
[2-3 sentences explaining the reasoning. Be honest. Users respect
transparency.]

WHAT REPLACES IT
[Feature Name] is being replaced by [Alternative]. [Alternative] does
everything [Feature Name] did, plus [additional benefits].

WHAT YOU NEED TO DO
1. [Step 1 — the most important migration action]
2. [Step 2]
3. [Step 3]

Detailed migration guide: [LINK]

TIMELINE
- Today: [Feature Name] continues to work normally
- [DATE + 60 days]: Warning notifications will appear in the product
- [DATE + 90 days]: [Feature Name] will be removed

NEED HELP?
Reply to this email or contact [support channel]. We are here to help
with your migration.

[Signature]
```

### Day 30: Warning Email (Active Users Only)

```
Subject: [Action Required] [Feature Name] removal in 60 days

Hi [Name],

We noticed you are still using [Feature Name] in [Your Product].
As announced on [Day 0 date], this feature will be removed on [DATE].

YOUR MIGRATION STATUS
- You have [X] [items/workflows/configurations] using [Feature Name]
- Migration to [Alternative] takes approximately [TIME]

QUICK MIGRATION STEPS
1. [Step 1 with link]
2. [Step 2 with link]
3. [Step 3 with link]

NEED HELP MIGRATING?
[For self-serve: Link to migration guide and FAQ]
[For high-value: "Reply to this email and we will schedule a call to
walk you through the migration."]

[Signature]
```

### Day 60: Final Notice Email

```
Subject: [Final Notice] [Feature Name] will be removed on [DATE]

Hi [Name],

This is your final reminder that [Feature Name] will be removed from
[Your Product] on [DATE] — 30 days from today.

After [DATE]:
- [Feature Name] will no longer be accessible
- [Any data implications]
- API endpoints will return 410 Gone

IF YOU HAVE NOT MIGRATED YET:
→ Migration guide: [LINK]
→ Need help? Contact us at [support channel] — we will prioritize
  your migration request.

[If data export is relevant:]
EXPORT YOUR DATA BEFORE [DATE]
You can export your [Feature Name] data here: [LINK]
After [DATE], this data will [be deleted / archived / migrated
automatically].

[Signature]
```

### In-App Deprecation Banner (Day 0)

```
ℹ️ [Feature Name] is being deprecated and will be removed on [DATE].
   We recommend migrating to [Alternative]. [Learn more →]
```

### In-App Warning Banner (Day 30)

```
⚠️ [Feature Name] will be removed in 60 days ([DATE]).
   Please migrate to [Alternative] before then. [Migration guide →]
```

### In-App Final Notice (Day 60)

```
🔴 [Feature Name] will be removed on [DATE] (30 days).
   Migrate now to avoid disruption. [Migrate now →] [Export data →]
```

---

## Data Export Obligations

Before removing any feature, you MUST handle user data responsibly:

### Data Checklist

- [ ] **Identify all user data** associated with the feature. This includes content, configurations, settings, and metadata.
- [ ] **Provide export functionality** in a standard format (CSV, JSON, or both). This should be available at least 60 days before removal.
- [ ] **Communicate data timeline** clearly: when exports will be available, when data will be deleted, and whether any data is migrated automatically.
- [ ] **Offer automatic migration** where possible. If the replacement feature can inherit data, migrate it automatically with user consent.
- [ ] **Archive data** for a minimum of 90 days after feature removal, even if the feature is gone. Users may realize they need something after the fact.
- [ ] **Comply with data regulations.** GDPR, CCPA, and other regulations may have specific requirements about data portability and deletion.

### Data Migration Decision Tree

```
Does the new feature use the same data format?
├─ YES → Migrate automatically. Notify user. Provide opt-out.
│
├─ PARTIALLY → Migrate what you can. Export the rest. Document gaps.
│
└─ NO → Provide full export. Do not migrate (it will be lossy and confusing).
```

---

## API Deprecation Headers

If the deprecated feature includes API endpoints, use standard HTTP headers to signal deprecation:

### Deprecation Header (RFC 8594)

```http
HTTP/1.1 200 OK
Deprecation: Sat, 01 Feb 2026 00:00:00 GMT
Sunset: Sat, 01 May 2026 00:00:00 GMT
Link: <https://docs.example.com/migration-guide>; rel="deprecation"
```

| Header | Purpose |
|--------|---------|
| `Deprecation` | Date when the endpoint was deprecated (Day 0) |
| `Sunset` | Date when the endpoint will stop working (Day 90) |
| `Link` (with `rel="deprecation"`) | URL to the migration guide |

### After Removal: 410 Gone Response

```http
HTTP/1.1 410 Gone
Content-Type: application/json

{
  "error": "gone",
  "message": "This endpoint was removed on 2026-05-01. Use /api/v2/alternative instead.",
  "migration_guide": "https://docs.example.com/migration-guide",
  "alternative_endpoint": "/api/v2/alternative"
}
```

**Do not return 404.** A 404 means the resource was never here. A 410 means it was here and is intentionally gone. This distinction matters for API consumers debugging integration failures.

---

## Migration Path Requirements

**Rule: Never deprecate without an alternative.** If you cannot offer a replacement, you cannot deprecate. You can only deprecate-and-replace, not deprecate-and-abandon.

### The Migration Path Must Include:

1. **A clear alternative** — What should users use instead? Be specific.
2. **A migration guide** — Step-by-step instructions with code examples (for APIs) or screenshots (for UI features).
3. **Feature parity documentation** — Explicitly list what the alternative does that the deprecated feature did, and what it does NOT do (gaps).
4. **A timeline** — How long migration takes. "5 minutes" or "2 hours" sets expectations.
5. **A support channel** — Where to get help if migration is not straightforward.

### When Full Parity is Not Possible

Sometimes the replacement does not cover 100% of the deprecated feature's use cases. Be honest about this:

```markdown
## Migration Gap: [Specific Capability]

The new [Alternative] does not support [specific capability] that existed
in [Deprecated Feature]. We are aware of this gap and have decided:

- [ ] We will add this capability to [Alternative] before removal (ETA: [DATE])
- [ ] This capability is not planned. Here is the workaround: [WORKAROUND]
- [ ] This capability is not planned and there is no workaround. Affected
      users: [NUMBER]. We have contacted them directly.
```

---

## Good vs Bad Deprecation Examples

### Good Deprecation: Stripe API Versioning

- 90+ day notice for all breaking changes
- Pinned API versions: old versions continue to work indefinitely
- Detailed migration guides with before/after code samples
- Dashboard shows which API version each integration uses
- Gradual rollout with opt-in for new versions

**Why it works:** Users are never surprised, migration is self-serve, and old versions degrade gracefully rather than breaking.

### Bad Deprecation: Twitter/X Free API Tier (2023)

- 30-day notice for a breaking change affecting millions of developers
- No migration path for most use cases (free tier simply removed)
- Documentation updated after the change, not before
- Support channels overwhelmed and unresponsive

**Why it failed:** Insufficient notice, no alternative for affected users, and poor communication created permanent trust damage.

### Bad Deprecation: Google Reader (2013)

- Adequate notice period (4 months)
- BUT no replacement offered
- No data portability path provided at announcement (added later under pressure)
- Ignored massive user backlash

**Why it failed:** Users had no alternative, and the deprecation felt like abandonment rather than evolution.

---

## Deprecation Decision Framework

Before starting a deprecation, answer these questions:

| Question | Required Answer |
|----------|----------------|
| What percentage of active users use this feature? | Measured (not guessed) |
| What is the annual maintenance cost of this feature? | Calculated in engineering hours |
| Is there a replacement that covers the primary use case? | YES (mandatory) |
| How long will migration take for the average user? | Estimated and documented |
| Are any contractual obligations tied to this feature? | Verified with legal/sales |
| Have we communicated with the highest-usage accounts? | YES (personally, not mass email) |
| Is user data at risk? | Export path documented |

If any required answer is missing, you are not ready to deprecate.

---

## Deprecation Tracking

| Field | Value |
|-------|-------|
| Feature name | |
| Deprecation announced (Day 0) | [DATE] |
| Warning sent (Day 30) | [DATE] |
| Final notice (Day 60) | [DATE] |
| Removal date (Day 90) | [DATE] |
| Replacement feature | |
| Migration guide URL | |
| Affected users (at announcement) | |
| Migrated users (at removal) | |
| Support tickets generated | |
| Users lost due to deprecation | |

Track this for every deprecation. The data informs future deprecation decisions.
