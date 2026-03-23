# Competitor Switch Playbook — Per-Competitor Migration Guides

> Every competitor's data model is a fingerprint. This template creates dedicated migration paths for each competitor you target, combining technical data mapping with marketing copy and support procedures that make switching feel inevitable rather than impossible.

---

## 1. Competitor Analysis Template

Repeat this section for each competitor in `{{COMPETITOR_IMPORTERS}}`. Each competitor gets a complete migration profile covering data extraction, feature mapping, and customer communication.

---

### Competitor Profile: {{COMPETITOR_1_NAME}}

#### Overview

| Attribute | Value |
|-----------|-------|
| **Competitor Name** | {{COMPETITOR_1_NAME}} |
| **Primary Market Segment** | _e.g., SMB CRM, Enterprise PM, Mid-market Support_ |
| **Export Capabilities** | _e.g., CSV export, API access, database dump, limited export_ |
| **API Documentation** | _URL to their API docs_ |
| **OAuth Support** | _Yes/No — determines if API migration is possible_ |
| **Known Export Limitations** | _e.g., no attachment export, limited to 10k records, no activity history_ |
| **Estimated Customers Migrating** | _Monthly forecast_ |
| **Migration Complexity** | _Simple / Medium / Complex_ |
| **Average Migration Duration** | _e.g., 5 minutes self-serve, 2 days white-glove_ |

#### Data Export Instructions for {{COMPETITOR_1_NAME}}

Step-by-step instructions that customers follow to export their data from {{COMPETITOR_1_NAME}}. These instructions appear in the import wizard when the customer selects {{COMPETITOR_1_NAME}} as their source.

1. Log in to {{COMPETITOR_1_NAME}} and navigate to **Settings > Data Management > Export**
2. Select the data types to export: _(list specific options)_
3. Choose export format: **CSV** (recommended) or **JSON**
4. Click **Export** and wait for the download to complete
5. The export will download as a ZIP file containing one CSV per data type
6. Upload the ZIP file (or individual CSVs) to the {{PROJECT_NAME}} import wizard

**Common issues with {{COMPETITOR_1_NAME}} exports:**

| Issue | Symptom | Solution |
|-------|---------|----------|
| Date format | Dates exported as `DD/MM/YYYY` (European) | Auto-detected and converted during import |
| UTF-8 encoding | Special characters appear as `Ã¤` | Encoding detection handles this automatically |
| Missing headers | First row is data, not headers | Import wizard prompts: "Does your file have a header row?" |
| Merged contacts | Duplicates created from merged records | Deduplication runs post-import |
| Attachment links | File URLs point to {{COMPETITOR_1_NAME}} CDN | Attachments downloaded and re-hosted during import |

#### Data Schema from {{COMPETITOR_1_NAME}}

| {{COMPETITOR_1_NAME}} Field | {{COMPETITOR_1_NAME}} Type | {{PROJECT_NAME}} Field | {{PROJECT_NAME}} Type | Transformation |
|---|---|---|---|---|
| `full_name` | string | `first_name` + `last_name` | string, string | Split on first space |
| `email_address` | string | `email` | string | Lowercase, trim |
| `phone` | string | `phone` | string | Normalize to E.164 |
| `company` | string | `organization.name` | relation | Create or match organization |
| `deal_value` | string | `deal.amount` | decimal | Strip currency symbol, parse float |
| `stage` | string | `deal.stage` | enum | Map via stage translation table |
| `created` | `DD/MM/YYYY` | `created_at` | ISO 8601 | Parse European date format |
| `tags` | comma-separated | `tags` | array | Split on comma, trim |
| `notes` | HTML | `notes` | markdown | HTML-to-markdown conversion |
| `custom_*` | varies | `custom_fields.*` | varies | Dynamic custom field creation |

#### Stage/Status Translation Table

| {{COMPETITOR_1_NAME}} Stage | {{PROJECT_NAME}} Stage | Notes |
|---|---|---|
| `New Lead` | `new` | Direct mapping |
| `Contacted` | `contacted` | Direct mapping |
| `Qualified` | `qualified` | Direct mapping |
| `Proposal Sent` | `proposal` | Direct mapping |
| `Negotiation` | `negotiation` | Direct mapping |
| `Won` | `closed_won` | Direct mapping |
| `Lost` | `closed_lost` | Direct mapping |
| `On Hold` | `paused` | {{COMPETITOR_1_NAME}}-specific — mapped to closest equivalent |
| _Custom stages_ | _Custom stages_ | Customer-created stages → create matching custom stages |

---

### Competitor Profile: {{COMPETITOR_2_NAME}}

#### Overview

| Attribute | Value |
|-----------|-------|
| **Competitor Name** | {{COMPETITOR_2_NAME}} |
| **Primary Market Segment** | _e.g., SMB CRM, Enterprise PM, Mid-market Support_ |
| **Export Capabilities** | _e.g., CSV export, API access, database dump, limited export_ |
| **API Documentation** | _URL to their API docs_ |
| **OAuth Support** | _Yes/No_ |
| **Known Export Limitations** | _Document specific limitations_ |
| **Estimated Customers Migrating** | _Monthly forecast_ |
| **Migration Complexity** | _Simple / Medium / Complex_ |
| **Average Migration Duration** | _Estimate_ |

#### Data Export Instructions for {{COMPETITOR_2_NAME}}

1. Log in to {{COMPETITOR_2_NAME}}
2. Navigate to **Account Settings > Export Data**
3. Select data scope and format
4. Download export file
5. Upload to {{PROJECT_NAME}} import wizard

#### Data Schema from {{COMPETITOR_2_NAME}}

| {{COMPETITOR_2_NAME}} Field | {{COMPETITOR_2_NAME}} Type | {{PROJECT_NAME}} Field | {{PROJECT_NAME}} Type | Transformation |
|---|---|---|---|---|
| _Source field_ | _Source type_ | _Target field_ | _Target type_ | _Transformation rule_ |

_Populate this table by analyzing {{COMPETITOR_2_NAME}}'s export format with real customer data._

---

## 2. Feature Mapping Matrix

This matrix maps competitor features to {{PROJECT_NAME}} equivalents. It serves three purposes: (1) guide data migration — which data structures need mapping, (2) inform marketing — which features to highlight in switch campaigns, (3) manage customer expectations — which workflows will change.

### {{COMPETITOR_1_NAME}} Feature Mapping

| {{COMPETITOR_1_NAME}} Feature | {{PROJECT_NAME}} Equivalent | Parity | Migration Notes |
|---|---|---|---|
| Contact management | Contact management | Full | Direct data migration |
| Deal pipeline | Deal pipeline | Full | Stage mapping required |
| Email integration | Email integration | Full | Re-authorize email OAuth |
| Task management | Task management | Full | Due dates and assignees preserved |
| Custom fields | Custom fields | Full | Auto-created during import |
| Reporting | Analytics dashboard | Enhanced | More reporting options available |
| Automation rules | Workflow automation | Partial | Manual recreation required — no data migration |
| Mobile app | Mobile app | Full | Separate login, no data migration needed |
| Integrations | Integrations | Varies | Customer must reconnect each integration |
| _Feature X_ | _Not available_ | Gap | _Document workaround or planned feature_ |

**Parity legend:**
- **Full** — Feature exists with equivalent or better capability. Data migrates directly.
- **Enhanced** — Feature exists with additional capabilities. Highlight in marketing.
- **Partial** — Feature exists but with reduced capability. Set expectations during migration.
- **Gap** — Feature does not exist in {{PROJECT_NAME}}. Document workaround and roadmap status.
- **Different** — Capability exists but works differently. Requires customer retraining.

### {{COMPETITOR_2_NAME}} Feature Mapping

| {{COMPETITOR_2_NAME}} Feature | {{PROJECT_NAME}} Equivalent | Parity | Migration Notes |
|---|---|---|---|
| _Feature_ | _Equivalent_ | _Parity level_ | _Notes_ |

---

## 3. Data Format Differences & Translation Rules

### Common Translation Challenges

| Challenge | {{COMPETITOR_1_NAME}} Format | {{PROJECT_NAME}} Format | Translation Logic |
|-----------|---|---|---|
| Name splitting | `"John Smith"` (single field) | `first_name`, `last_name` (two fields) | Split on first space; last token = last name, rest = first name |
| Date formats | `DD/MM/YYYY` or `MM-DD-YYYY` | ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`) | Detect format from sample, parse accordingly |
| Phone numbers | Free-text (`(555) 123-4567`) | E.164 (`+15551234567`) | Strip formatting, infer country code from account locale |
| Currency | `$1,234.56` or `1.234,56€` | Integer cents (`123456`) | Strip symbols, detect decimal separator, convert to cents |
| Rich text | HTML (`<b>Bold</b>`) | Markdown (`**Bold**`) | HTML-to-markdown conversion library |
| Tags/labels | Comma-separated string | JSON array | Split, trim, deduplicate |
| Relations | Inline text (`"Acme Corp"`) | Foreign key reference | Lookup or create related record |
| Attachments | URL to competitor CDN | URL to {{PROJECT_NAME}} storage | Download and re-upload to own storage |
| Timestamps | Unix epoch (`1703001600`) | ISO 8601 | Convert epoch to Date, format as ISO |
| Booleans | `"yes"/"no"`, `"Y"/"N"`, `1/0` | `true/false` | Normalize to boolean |

### Translation Engine

```typescript
// src/migration/transform/translator.ts
type TranslationRule = {
  sourceField: string;
  targetField: string | string[]; // Single field or multiple (e.g., name → first_name + last_name)
  transform: (value: any, row: Record<string, any>) => any;
};

const COMPETITOR_1_TRANSLATIONS: TranslationRule[] = [
  {
    sourceField: 'full_name',
    targetField: ['first_name', 'last_name'],
    transform: (value: string) => {
      if (!value) return { first_name: '', last_name: '' };
      const parts = value.trim().split(/\s+/);
      if (parts.length === 1) return { first_name: parts[0], last_name: '' };
      const lastName = parts.pop()!;
      return { first_name: parts.join(' '), last_name: lastName };
    },
  },
  {
    sourceField: 'deal_value',
    targetField: 'amount_cents',
    transform: (value: string) => {
      if (!value) return 0;
      // Remove currency symbols and thousands separators
      const cleaned = value.replace(/[^0-9.,\-]/g, '');
      // Detect decimal separator (last . or , in the string)
      const lastDot = cleaned.lastIndexOf('.');
      const lastComma = cleaned.lastIndexOf(',');
      let normalized: string;
      if (lastComma > lastDot) {
        // European format: 1.234,56
        normalized = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // US format: 1,234.56
        normalized = cleaned.replace(/,/g, '');
      }
      return Math.round(parseFloat(normalized) * 100);
    },
  },
  {
    sourceField: 'notes',
    targetField: 'notes',
    transform: (value: string) => {
      if (!value) return '';
      return htmlToMarkdown(value);
    },
  },
  {
    sourceField: 'tags',
    targetField: 'tags',
    transform: (value: string) => {
      if (!value) return [];
      return value.split(',').map(t => t.trim()).filter(Boolean);
    },
  },
];
```

---

## 4. Missing Feature Handling

When a customer relies on a competitor feature that {{PROJECT_NAME}} does not offer, the migration playbook must address it proactively — not let the customer discover the gap post-migration.

### Gap Communication Framework

| Gap Type | Communication Timing | Message Template |
|----------|---------------------|-----------------|
| **Planned feature** (on roadmap) | Pre-migration | "We are building [feature] and expect to ship it in [timeline]. In the meantime, [workaround]." |
| **Workaround available** | During migration | "[Feature] works differently in {{PROJECT_NAME}}. Here is how to achieve the same result: [steps]." |
| **Not planned** | Pre-migration | "We do not currently offer [feature]. We have found that most customers use [alternative approach]. Would this work for your use case?" |
| **Integration covers it** | During migration | "[Feature] is available through our [Integration Name] integration. Connect it from Settings > Integrations." |

### Gap Tracking

```typescript
// src/migration/services/feature-gap-tracker.ts
interface FeatureGap {
  competitorFeature: string;
  competitor: string;
  parity: 'planned' | 'workaround' | 'not_planned' | 'integration';
  customerCount: number; // How many migrating customers used this feature
  workaround?: string;
  plannedDate?: string;
  integrationName?: string;
}

// Track which competitor features customers actually used (based on data presence)
export async function detectUsedFeatures(
  competitor: string,
  extractedData: Record<string, any[]>
): Promise<string[]> {
  const usedFeatures: string[] = [];
  const featureDetectors = FEATURE_DETECTORS[competitor];

  for (const [feature, detector] of Object.entries(featureDetectors)) {
    if (detector(extractedData)) {
      usedFeatures.push(feature);
    }
  }

  return usedFeatures;
}
```

---

## 5. Migration Landing Page Copy

Each competitor gets a dedicated landing page: `{{PROJECT_URL}}/switch-from/{{COMPETITOR_SLUG}}`. These pages are co-owned by marketing and product.

### Landing Page Structure

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION                                           │
│  "Switch from {{COMPETITOR_1_NAME}} to {{PROJECT_NAME}} │
│   in under 10 minutes"                                  │
│  [Start Free Migration]  [See How It Works]             │
├─────────────────────────────────────────────────────────┤
│  WHY SWITCH                                             │
│  3-4 differentiators with competitor comparison          │
│  Feature comparison table                                │
├─────────────────────────────────────────────────────────┤
│  HOW IT WORKS                                           │
│  Step 1: Connect your {{COMPETITOR_1_NAME}} account     │
│  Step 2: Select what to migrate                         │
│  Step 3: Review and confirm                             │
│  Step 4: Start using {{PROJECT_NAME}}                   │
├─────────────────────────────────────────────────────────┤
│  WHAT MIGRATES                                          │
│  Checklist of data types with checkmarks                │
│  "Everything you need, nothing you don't"                │
├─────────────────────────────────────────────────────────┤
│  CUSTOMER STORIES                                       │
│  Testimonials from customers who switched               │
│  "I switched from {{COMPETITOR_1_NAME}} in 8 minutes"   │
├─────────────────────────────────────────────────────────┤
│  FAQ                                                     │
│  "Will I lose any data?"                                 │
│  "Can I try {{PROJECT_NAME}} before canceling?"          │
│  "How long does migration take?"                         │
│  "What if something goes wrong?"                         │
├─────────────────────────────────────────────────────────┤
│  CTA                                                     │
│  [Start Your Free Migration] — no credit card required   │
└─────────────────────────────────────────────────────────┘
```

### SEO Targeting

| Page | Target Keywords | URL |
|------|----------------|-----|
| Main switch page | `{{COMPETITOR_1_NAME}} alternative`, `switch from {{COMPETITOR_1_NAME}}` | `/switch-from/{{COMPETITOR_1_SLUG}}` |
| Migration guide | `export data from {{COMPETITOR_1_NAME}}`, `{{COMPETITOR_1_NAME}} to {{PROJECT_NAME}} migration` | `/switch-from/{{COMPETITOR_1_SLUG}}/guide` |
| Comparison page | `{{PROJECT_NAME}} vs {{COMPETITOR_1_NAME}}` | `/compare/{{COMPETITOR_1_SLUG}}` |

---

## 6. Win-Back Campaign Integration

Migration data feeds into win-back campaigns for customers who start but do not complete migration.

### Migration Funnel Events

| Event | Trigger | Campaign Action |
|-------|---------|----------------|
| Landing page visit | Page view | Retargeting pixel, add to audience |
| Migration started | File uploaded or OAuth connected | Email: "Your migration is in progress" |
| Validation errors | > 20% error rate | Email: "Need help with your migration? [Book a call]" |
| Migration abandoned | No activity for 24h after start | Email: "Your data is ready to import — pick up where you left off" |
| Migration completed | All records imported | Email: "Welcome! Here are 3 things to do first" |
| Migration failed | Processing error | Email: "We had trouble importing your data. [Contact support]" + assign to support agent |

### Abandoned Migration Sequence

```
Day 0 (24h after abandon): "Your migration is waiting"
  - Show progress summary
  - Link to resume import
  - Offer: "Need help? Reply to this email"

Day 3: "Quick question about your switch"
  - Ask what blocked them (single question survey)
  - Offer: "Book a 15-min migration assist call"

Day 7: "What we have improved since you started"
  - Highlight recent product improvements
  - Reduced-friction offer: "We will migrate your data for you — free"

Day 14: Final follow-up
  - "We saved your data for 30 days"
  - Clear deadline: "After [date], you will need to re-upload"
```
