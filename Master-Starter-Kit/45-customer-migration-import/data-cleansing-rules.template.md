# Data Cleansing Rules — Normalization & Deduplication

> Real-world data is filthy. Phone numbers with letters, dates in four formats, addresses with creative abbreviations, and duplicates that differ by a single character. This template defines the cleansing pipeline that transforms chaos into consistency — at the aggressiveness level your business can tolerate.

---

## 1. Data Normalization Rules

Normalization ensures that equivalent data is stored identically. "United States", "US", "USA", and "U.S.A." should all resolve to the same value. The level of normalization is controlled by `{{DATA_CLEANSING_LEVEL}}`.

### Normalization Pipeline

```
Raw Value → Trim → Encoding Fix → Case Normalize → Format Standardize → Validate → Clean Value
```

```typescript
// src/migration/cleansing/normalizer.ts
interface NormalizationResult {
  originalValue: string;
  normalizedValue: string;
  changes: NormalizationChange[];
  confidence: number;
}

interface NormalizationChange {
  rule: string;
  before: string;
  after: string;
}

export function normalizeField(
  value: string,
  fieldType: string,
  level: 'minimal' | 'moderate' | 'aggressive'
): NormalizationResult {
  const changes: NormalizationChange[] = [];
  let current = value;

  // Level: minimal — safe transformations only
  current = applyAndTrack(current, 'trim', v => v.trim(), changes);
  current = applyAndTrack(current, 'remove_null_bytes', v => v.replace(/\0/g, ''), changes);
  current = applyAndTrack(current, 'normalize_whitespace', v => v.replace(/\s+/g, ' '), changes);
  current = applyAndTrack(current, 'fix_encoding', v => fixMojibake(v), changes);

  if (level === 'minimal') {
    return { originalValue: value, normalizedValue: current, changes, confidence: 1.0 };
  }

  // Level: moderate — format standardization
  if (fieldType === 'email') {
    current = applyAndTrack(current, 'lowercase_email', v => v.toLowerCase(), changes);
    current = applyAndTrack(current, 'trim_email_dots', v => normalizeEmailDots(v), changes);
  }

  if (fieldType === 'phone') {
    current = applyAndTrack(current, 'normalize_phone', v => normalizePhoneNumber(v), changes);
  }

  if (fieldType === 'url') {
    current = applyAndTrack(current, 'normalize_url', v => normalizeUrl(v), changes);
  }

  if (fieldType === 'date') {
    current = applyAndTrack(current, 'normalize_date', v => normalizeDateFormat(v), changes);
  }

  if (fieldType === 'country') {
    current = applyAndTrack(current, 'normalize_country', v => normalizeCountry(v), changes);
  }

  if (level === 'moderate') {
    return { originalValue: value, normalizedValue: current, changes, confidence: 0.95 };
  }

  // Level: aggressive — inference and correction
  if (fieldType === 'name') {
    current = applyAndTrack(current, 'fix_case', v => titleCase(v), changes);
    current = applyAndTrack(current, 'fix_name_order', v => fixNameOrder(v), changes);
  }

  if (fieldType === 'address') {
    current = applyAndTrack(current, 'expand_abbreviations', v => expandAddressAbbreviations(v), changes);
    current = applyAndTrack(current, 'fix_zip', v => normalizeZipCode(v), changes);
  }

  if (fieldType === 'email') {
    current = applyAndTrack(current, 'fix_domain_typos', v => fixCommonEmailTypos(v), changes);
  }

  return { originalValue: value, normalizedValue: current, changes, confidence: 0.85 };
}

function applyAndTrack(
  value: string,
  rule: string,
  transform: (v: string) => string,
  changes: NormalizationChange[]
): string {
  const result = transform(value);
  if (result !== value) {
    changes.push({ rule, before: value, after: result });
  }
  return result;
}
```

### Normalization Rules by Level

| Rule | Minimal | Moderate | Aggressive | Risk |
|------|---------|----------|------------|------|
| Trim whitespace | Yes | Yes | Yes | None |
| Remove null bytes | Yes | Yes | Yes | None |
| Normalize whitespace | Yes | Yes | Yes | None |
| Fix encoding (mojibake) | Yes | Yes | Yes | Low — may alter intentional characters |
| Lowercase email | No | Yes | Yes | None |
| Normalize phone to E.164 | No | Yes | Yes | Low — country code inference |
| Standardize date format | No | Yes | Yes | Medium — format ambiguity (01/02 = Jan 2 or Feb 1?) |
| Normalize country names | No | Yes | Yes | Low — well-defined mappings |
| Title-case names | No | No | Yes | Medium — may break van/de/von prefixes |
| Fix email domain typos | No | No | Yes | Medium — `gmal.com` → `gmail.com` may be wrong |
| Expand address abbreviations | No | No | Yes | Low — well-defined abbreviations |
| Infer missing country codes | No | No | Yes | Medium — assumes locale |

---

## 2. Deduplication Strategy

### Deduplication Pipeline

```
Records → Block/Group → Compare Pairs → Score Similarity → Decide (merge/keep/flag)
```

```typescript
// src/migration/cleansing/deduplicator.ts
interface DuplicateGroup {
  records: ImportRecord[];
  similarity: number;
  matchFields: string[];
  suggestedWinner: ImportRecord;
  strategy: 'merge' | 'keep_newest' | 'keep_oldest' | 'flag_for_review';
}

export async function findDuplicates(
  records: ImportRecord[],
  config: DeduplicationConfig
): Promise<DuplicateGroup[]> {
  const groups: DuplicateGroup[] = [];

  // Phase 1: Blocking — group records by blocking key to reduce comparisons
  // Without blocking, N records requires N*(N-1)/2 comparisons
  const blocks = createBlocks(records, config.blockingFields);

  // Phase 2: Pairwise comparison within each block
  for (const block of blocks.values()) {
    if (block.length < 2) continue;

    for (let i = 0; i < block.length; i++) {
      for (let j = i + 1; j < block.length; j++) {
        const similarity = calculateSimilarity(block[i], block[j], config.compareFields);

        if (similarity >= config.threshold) {
          groups.push({
            records: [block[i], block[j]],
            similarity,
            matchFields: getMatchingFields(block[i], block[j], config.compareFields),
            suggestedWinner: selectWinner(block[i], block[j], config.winnerStrategy),
            strategy: similarity >= 0.95 ? 'merge' : 'flag_for_review',
          });
        }
      }
    }
  }

  return groups;
}

function createBlocks(
  records: ImportRecord[],
  blockingFields: string[]
): Map<string, ImportRecord[]> {
  const blocks = new Map<string, ImportRecord[]>();

  for (const record of records) {
    // Create blocking key from specified fields
    // Example: email domain + first 3 chars of name → "gmail.com|joh"
    const key = blockingFields
      .map(field => {
        const value = record[field];
        if (!value) return '';
        if (field === 'email') return value.split('@')[1]?.toLowerCase() || '';
        return value.substring(0, 3).toLowerCase();
      })
      .join('|');

    if (!blocks.has(key)) blocks.set(key, []);
    blocks.get(key)!.push(record);
  }

  return blocks;
}

function calculateSimilarity(
  a: ImportRecord,
  b: ImportRecord,
  fields: CompareField[]
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const field of fields) {
    const valueA = a[field.name] || '';
    const valueB = b[field.name] || '';

    let fieldSimilarity: number;
    switch (field.algorithm) {
      case 'exact':
        fieldSimilarity = valueA.toLowerCase() === valueB.toLowerCase() ? 1 : 0;
        break;
      case 'levenshtein':
        fieldSimilarity = 1 - levenshteinDistance(valueA, valueB) / Math.max(valueA.length, valueB.length, 1);
        break;
      case 'jaro_winkler':
        fieldSimilarity = jaroWinklerSimilarity(valueA, valueB);
        break;
      case 'phone_normalized':
        fieldSimilarity = normalizePhoneNumber(valueA) === normalizePhoneNumber(valueB) ? 1 : 0;
        break;
      default:
        fieldSimilarity = valueA === valueB ? 1 : 0;
    }

    weightedSum += fieldSimilarity * field.weight;
    totalWeight += field.weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
```

### Deduplication Configuration

| Field | Algorithm | Weight | Threshold | Notes |
|-------|-----------|--------|-----------|-------|
| `email` | Exact (after normalize) | 5.0 | 1.0 | Email match is strongest signal |
| `phone` | Phone normalized | 3.0 | 1.0 | After E.164 normalization |
| `first_name` | Jaro-Winkler | 2.0 | 0.85 | Handles typos, nicknames |
| `last_name` | Jaro-Winkler | 2.0 | 0.85 | Handles typos |
| `company` | Levenshtein | 1.5 | 0.8 | "Acme Corp" vs "Acme Corporation" |
| `address` | Levenshtein | 1.0 | 0.7 | After abbreviation expansion |
| `external_id` | Exact | 10.0 | 1.0 | If present, strongest signal |

---

## 3. Format Standardization

### Date Standardization

```typescript
// src/migration/cleansing/date-standardizer.ts
interface DateStandardizationResult {
  isoDate: string;
  originalFormat: string;
  confidence: number;
  ambiguous: boolean;
  warning?: string;
}

const DATE_PATTERNS: Array<{
  regex: RegExp;
  parser: (match: RegExpMatchArray) => Date;
  format: string;
  ambiguous: boolean;
}> = [
  // ISO 8601 (unambiguous)
  { regex: /^(\d{4})-(\d{2})-(\d{2})$/, parser: m => new Date(+m[1], +m[2]-1, +m[3]), format: 'YYYY-MM-DD', ambiguous: false },
  { regex: /^(\d{4})-(\d{2})-(\d{2})T/, parser: m => new Date(m[0]), format: 'ISO 8601', ambiguous: false },

  // Unambiguous (day > 12 or year position clear)
  { regex: /^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{4})$/i,
    parser: m => new Date(`${m[1]} ${m[2]} ${m[3]}`), format: 'DD Mon YYYY', ambiguous: false },
  { regex: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{1,2}),?\s+(\d{4})$/i,
    parser: m => new Date(`${m[1]} ${m[2]} ${m[3]}`), format: 'Mon DD, YYYY', ambiguous: false },

  // US format (ambiguous when day <= 12)
  { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parser: m => new Date(+m[3], +m[1]-1, +m[2]), format: 'MM/DD/YYYY', ambiguous: true },

  // European format (ambiguous when day <= 12)
  { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, parser: m => new Date(+m[3], +m[2]-1, +m[1]), format: 'DD.MM.YYYY', ambiguous: true },

  // Short year
  { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, parser: m => {
    const year = +m[3] > 50 ? 1900 + +m[3] : 2000 + +m[3];
    return new Date(year, +m[1]-1, +m[2]);
  }, format: 'MM/DD/YY', ambiguous: true },
];

export function standardizeDate(value: string, locale: string = 'en-US'): DateStandardizationResult {
  const trimmed = value.trim();

  for (const pattern of DATE_PATTERNS) {
    const match = trimmed.match(pattern.regex);
    if (!match) continue;

    const date = pattern.parser(match);
    if (isNaN(date.getTime())) continue;

    let ambiguous = pattern.ambiguous;
    let warning: string | undefined;

    // Resolve ambiguity using locale
    if (ambiguous && pattern.format.includes('/')) {
      const parts = trimmed.split('/');
      const first = parseInt(parts[0]);
      const second = parseInt(parts[1]);

      if (first > 12 && second <= 12) {
        // First number > 12, must be DD/MM/YYYY
        ambiguous = false;
        const corrected = new Date(+parts[2], second - 1, first);
        return {
          isoDate: corrected.toISOString().split('T')[0],
          originalFormat: 'DD/MM/YYYY (inferred)',
          confidence: 0.95,
          ambiguous: false,
        };
      } else if (first <= 12 && second > 12) {
        // Second number > 12, must be MM/DD/YYYY
        ambiguous = false;
      } else {
        // Both <= 12, truly ambiguous
        warning = `Date "${value}" is ambiguous. Interpreted as ${pattern.format} based on locale "${locale}". ` +
          `Verify: is this ${date.toLocaleDateString('en-US')}?`;
      }
    }

    return {
      isoDate: date.toISOString().split('T')[0],
      originalFormat: pattern.format,
      confidence: ambiguous ? 0.6 : 0.95,
      ambiguous,
      warning,
    };
  }

  // Fallback: native Date.parse
  const fallback = new Date(trimmed);
  if (!isNaN(fallback.getTime())) {
    return {
      isoDate: fallback.toISOString().split('T')[0],
      originalFormat: 'native parse',
      confidence: 0.5,
      ambiguous: true,
      warning: `Date "${value}" was parsed using fallback. Result: ${fallback.toISOString().split('T')[0]}. Please verify.`,
    };
  }

  throw new CleansingError(`Cannot parse date: "${value}"`);
}
```

### Phone Number Standardization

```typescript
// src/migration/cleansing/phone-standardizer.ts
export function standardizePhone(value: string, defaultCountry: string = 'US'): string {
  if (!value) return '';

  let cleaned = value.trim();

  // Remove common noise
  cleaned = cleaned.replace(/ext\.?\s*\d+$/i, ''); // Remove extensions
  cleaned = cleaned.replace(/[^\d\+]/g, ''); // Keep only digits and +

  if (!cleaned || cleaned.length < 7) return ''; // Too short

  // Already has country code
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 10 ? cleaned : '';
  }

  // Infer country code
  const countryPrefix = COUNTRY_PHONE_PREFIXES[defaultCountry] || '1';

  // US: 10 digits → +1XXXXXXXXXX
  if (defaultCountry === 'US' || defaultCountry === 'CA') {
    if (cleaned.length === 10) return `+1${cleaned}`;
    if (cleaned.length === 11 && cleaned.startsWith('1')) return `+${cleaned}`;
  }

  // UK: 10-11 digits → +44XXXXXXXXXX
  if (defaultCountry === 'GB') {
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    return `+44${cleaned}`;
  }

  // Generic: prepend country code
  return `+${countryPrefix}${cleaned}`;
}
```

### Address Standardization

| Abbreviation | Expansion | Context |
|-------------|-----------|---------|
| `St` / `St.` | `Street` | Address line |
| `Ave` / `Ave.` | `Avenue` | Address line |
| `Blvd` | `Boulevard` | Address line |
| `Dr` / `Dr.` | `Drive` | Address line (not "Doctor") |
| `Rd` / `Rd.` | `Road` | Address line |
| `Ln` | `Lane` | Address line |
| `Ct` | `Court` | Address line |
| `Apt` / `Apt.` | `Apartment` | Unit |
| `Ste` / `Ste.` | `Suite` | Unit |
| `FL` / `Fl` | `Floor` | Unit |

### Currency Standardization

```typescript
// src/migration/cleansing/currency-standardizer.ts
export function standardizeCurrency(value: string): { cents: number; currency: string; original: string } {
  const original = value.trim();
  let currency = 'USD'; // Default

  // Detect currency from symbols
  if (original.includes('€') || original.includes('EUR')) currency = 'EUR';
  else if (original.includes('£') || original.includes('GBP')) currency = 'GBP';
  else if (original.includes('¥') || original.includes('JPY')) currency = 'JPY';
  else if (original.includes('$') || original.includes('USD')) currency = 'USD';
  else if (original.includes('CAD') || original.includes('C$')) currency = 'CAD';

  // Strip non-numeric except . and ,
  let numeric = original.replace(/[^0-9.,\-]/g, '');

  // Detect decimal separator
  const lastDot = numeric.lastIndexOf('.');
  const lastComma = numeric.lastIndexOf(',');

  if (lastComma > lastDot && (numeric.length - lastComma) <= 3) {
    // European: 1.234,56 → comma is decimal
    numeric = numeric.replace(/\./g, '').replace(',', '.');
  } else {
    // US/UK: 1,234.56 → dot is decimal
    numeric = numeric.replace(/,/g, '');
  }

  const parsed = parseFloat(numeric);
  if (isNaN(parsed)) throw new CleansingError(`Cannot parse currency: "${value}"`);

  // JPY has no decimal places
  const cents = currency === 'JPY' ? Math.round(parsed) : Math.round(parsed * 100);

  return { cents, currency, original };
}
```

---

## 4. Missing Data Handling

### Strategy by Field Type

| Field | Strategy | Behavior |
|-------|----------|----------|
| Required text | Reject row | Row goes to error report |
| Optional text | Accept as empty | Store as null |
| Required email | Reject row | Cannot create record without identifier |
| Optional email | Accept as null | No email communications for this record |
| Required date | Use import timestamp | `created_at` defaults to now |
| Optional date | Accept as null | Null dates in queries |
| Required enum | Use default value | `status` defaults to "active" |
| Boolean | Default to false | Explicit false rather than null |
| Numeric | Default to 0 | Explicit zero rather than null |
| Foreign key | Accept as null | Orphaned record, logged as warning |

<!-- IF {{DATA_CLEANSING_LEVEL}} == "aggressive" -->
**Aggressive mode additional handling:**
- Missing names: Attempt to extract from email prefix (`john.smith@` → `John Smith`)
- Missing phone: Skip normalization, store raw
- Missing country: Infer from phone prefix, email domain, or timezone
- Missing timezone: Infer from country or leave as UTC
<!-- ENDIF -->

---

## 5. Encoding Normalization

```typescript
// src/migration/cleansing/encoding-fixer.ts
/**
 * Fix common encoding corruption (mojibake) patterns.
 * These occur when UTF-8 text is decoded as Latin-1 or Windows-1252.
 */
const MOJIBAKE_MAP: Record<string, string> = {
  'Ã¤': 'ä', 'Ã¶': 'ö', 'Ã¼': 'ü', 'Ã„': 'Ä', 'Ã–': 'Ö', 'Ãœ': 'Ü',
  'Ã©': 'é', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã«': 'ë',
  'Ã ': 'à', 'Ã¡': 'á', 'Ã¢': 'â', 'Ã£': 'ã',
  'Ã®': 'î', 'Ã¯': 'ï', 'Ã¬': 'ì', 'Ã­': 'í',
  'Ã²': 'ò', 'Ã³': 'ó', 'Ã´': 'ô', 'Ãµ': 'õ',
  'Ã¹': 'ù', 'Ãº': 'ú', 'Ã»': 'û',
  'Ã±': 'ñ', 'Ã§': 'ç', 'ÃŸ': 'ß',
  'â€™': '\u2019', 'â€œ': '\u201C', 'â€\u009D': '\u201D',
  'â€"': '\u2014', 'â€"': '\u2013',
  'â€¢': '\u2022', 'â€¦': '\u2026',
  'Â©': '\u00A9', 'Â®': '\u00AE', 'â„¢': '\u2122',
};

export function fixMojibake(text: string): string {
  let result = text;
  for (const [corrupted, correct] of Object.entries(MOJIBAKE_MAP)) {
    result = result.replaceAll(corrupted, correct);
  }

  // Remove invisible/control characters (except newlines and tabs)
  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Normalize Unicode (NFC form — precomposed characters)
  result = result.normalize('NFC');

  return result;
}
```

---

## 6. Business Rule Validation

Business rules are domain-specific constraints that go beyond format validation.

```typescript
// src/migration/cleansing/business-rules.ts
interface BusinessRule {
  name: string;
  description: string;
  validate: (record: ImportRecord) => BusinessRuleResult;
  severity: 'error' | 'warning';
}

const BUSINESS_RULES: BusinessRule[] = [
  {
    name: 'deal_amount_positive',
    description: 'Deal amounts should be positive',
    validate: (record) => {
      if (record.amount_cents && record.amount_cents < 0) {
        return { valid: false, message: `Deal amount is negative: ${record.amount_cents / 100}` };
      }
      return { valid: true };
    },
    severity: 'warning',
  },
  {
    name: 'date_not_future',
    description: 'Created date should not be in the future',
    validate: (record) => {
      if (record.created_at && new Date(record.created_at) > new Date()) {
        return { valid: false, message: `Created date is in the future: ${record.created_at}` };
      }
      return { valid: true };
    },
    severity: 'warning',
  },
  {
    name: 'email_not_disposable',
    description: 'Email should not be from a disposable email service',
    validate: (record) => {
      if (record.email && isDisposableEmail(record.email)) {
        return { valid: false, message: `Disposable email detected: ${record.email}` };
      }
      return { valid: true };
    },
    severity: 'warning',
  },
  {
    name: 'start_before_end',
    description: 'Start date must be before end date',
    validate: (record) => {
      if (record.start_date && record.end_date) {
        if (new Date(record.start_date) > new Date(record.end_date)) {
          return { valid: false, message: `Start date (${record.start_date}) is after end date (${record.end_date})` };
        }
      }
      return { valid: true };
    },
    severity: 'error',
  },
  {
    name: 'phone_plausible_length',
    description: 'Phone number should be plausible length after normalization',
    validate: (record) => {
      if (record.phone) {
        const digits = record.phone.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) {
          return { valid: false, message: `Phone number "${record.phone}" has unusual length (${digits.length} digits)` };
        }
      }
      return { valid: true };
    },
    severity: 'warning',
  },
];
```

---

## 7. Cleansing Report Generation

After cleansing completes, generate a detailed report showing every change made. This serves as an audit trail and allows customers to verify that changes were appropriate.

```typescript
// src/migration/cleansing/cleansing-report.ts
interface CleansingReport {
  importId: string;
  level: 'minimal' | 'moderate' | 'aggressive';
  summary: {
    totalRecords: number;
    recordsModified: number;
    totalChanges: number;
    duplicatesFound: number;
    duplicatesMerged: number;
    duplicatesFlagged: number;
  };
  changesByRule: Record<string, { count: number; examples: CleansingChange[] }>;
  duplicateGroups: DuplicateGroup[];
}

export function generateCleansingReport(
  importId: string,
  changes: CleansingChange[],
  duplicates: DuplicateGroup[]
): CleansingReport {
  const changesByRule: Record<string, { count: number; examples: CleansingChange[] }> = {};

  for (const change of changes) {
    if (!changesByRule[change.rule]) {
      changesByRule[change.rule] = { count: 0, examples: [] };
    }
    changesByRule[change.rule].count++;
    if (changesByRule[change.rule].examples.length < 5) {
      changesByRule[change.rule].examples.push(change);
    }
  }

  return {
    importId,
    level: '{{DATA_CLEANSING_LEVEL}}' as any,
    summary: {
      totalRecords: new Set(changes.map(c => c.rowNumber)).size,
      recordsModified: new Set(changes.filter(c => c.applied).map(c => c.rowNumber)).size,
      totalChanges: changes.filter(c => c.applied).length,
      duplicatesFound: duplicates.length,
      duplicatesMerged: duplicates.filter(d => d.strategy === 'merge').length,
      duplicatesFlagged: duplicates.filter(d => d.strategy === 'flag_for_review').length,
    },
    changesByRule,
    duplicateGroups: duplicates,
  };
}
```

### Report Display Format

| Rule | Changes | Example Before | Example After |
|------|---------|---------------|--------------|
| `trim` | 1,234 | `"  John  "` | `"John"` |
| `lowercase_email` | 892 | `"John@Gmail.COM"` | `"john@gmail.com"` |
| `normalize_phone` | 456 | `"(555) 123-4567"` | `"+15551234567"` |
| `normalize_date` | 203 | `"15/03/2024"` | `"2024-03-15"` |
| `fix_encoding` | 12 | `"Ã¼ber"` | `"uber"` |
| `expand_abbreviations` | 89 | `"123 Main St."` | `"123 Main Street"` |

The customer receives this report as a downloadable CSV alongside the import results, enabling full traceability of every normalization applied to their data.
