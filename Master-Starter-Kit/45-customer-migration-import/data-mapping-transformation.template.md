# Data Mapping & Transformation — Schema Translation Rules

> The mapping layer is where source data becomes your data. Every field transformation is a decision about fidelity, normalization, and acceptable loss. Get it wrong and customers discover corrupted records weeks after migration.

---

## 1. Source-to-Target Schema Mapping

### Mapping Table Template

Use this table structure for every source system. Each row represents one field mapping. Populate it during competitor analysis or when a customer provides a sample export.

| # | Source Field | Source Type | Target Field | Target Type | Required | Transform | Default | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | string/int | `external_id` | string | Yes | Cast to string | — | Preserved for reference/rollback |
| 2 | `name` | string | `first_name`, `last_name` | string, string | Yes | Split on space | — | See name splitting rules |
| 3 | `email` | string | `email` | string | Yes | Lowercase, trim | — | Validate RFC 5322 |
| 4 | `phone` | string | `phone` | string | No | E.164 normalize | `null` | Country code from locale |
| 5 | `created_at` | various | `created_at` | ISO 8601 | Yes | Date parse | Import timestamp | Multiple format support |
| 6 | `status` | string | `status` | enum | Yes | Enum map | `active` | See status mapping table |
| 7 | `amount` | string | `amount_cents` | integer | No | Currency parse | `0` | Strip symbols, multiply by 100 |
| 8 | `notes` | HTML/text | `notes` | markdown | No | HTML→MD convert | `''` | Preserve formatting intent |
| 9 | `tags` | string | `tags` | string[] | No | Split on delimiter | `[]` | Comma or semicolon split |
| 10 | `custom_*` | varies | `custom_fields.*` | varies | No | Dynamic mapping | `null` | Create custom field definitions |
| 11 | `avatar_url` | URL | `avatar` | file reference | No | Download + re-host | `null` | Fetch from source CDN |
| 12 | `company_id` | int | `organization_id` | UUID | No | FK resolution | `null` | Lookup from org import batch |

### Mapping Configuration Schema

```typescript
// src/migration/mapping/mapping-config.ts
interface FieldMapping {
  sourceField: string;
  targetField: string | string[]; // Multi-target for split mappings
  sourceType: SourceType;
  targetType: TargetType;
  required: boolean;
  transform: TransformType;
  defaultValue?: any;
  enumMap?: Record<string, string>; // Source value → target value
  validationRules?: ValidationRule[];
  notes?: string;
}

type SourceType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' |
  'html' | 'json' | 'csv_list' | 'url' | 'binary';

type TargetType = 'string' | 'integer' | 'decimal' | 'boolean' | 'date' |
  'datetime' | 'enum' | 'json' | 'array' | 'uuid' | 'file_reference';

type TransformType = 'direct' | 'lowercase' | 'uppercase' | 'trim' |
  'split_name' | 'parse_date' | 'parse_currency' | 'normalize_phone' |
  'html_to_markdown' | 'csv_to_array' | 'enum_map' | 'fk_resolve' |
  'download_file' | 'generate_uuid' | 'custom';

export function createMappingConfig(
  source: string,
  mappings: FieldMapping[]
): MappingConfig {
  // Validate mapping completeness
  const requiredTargets = getRequiredTargetFields();
  const mappedTargets = new Set(mappings.flatMap(m =>
    Array.isArray(m.targetField) ? m.targetField : [m.targetField]
  ));

  const missingRequired = requiredTargets.filter(t => !mappedTargets.has(t));
  if (missingRequired.length > 0) {
    throw new MappingError(
      `Required target fields are not mapped: ${missingRequired.join(', ')}. ` +
      `Either map a source field or provide a default value.`
    );
  }

  return {
    source,
    mappings,
    createdAt: new Date().toISOString(),
    version: 1,
  };
}
```

---

## 2. Field Transformation Rules

### Transformation Function Registry

```typescript
// src/migration/transform/transformers.ts
type TransformFn = (value: any, row: Record<string, any>, context: TransformContext) => any;

interface TransformContext {
  importId: string;
  rowNumber: number;
  locale: string;
  timezone: string;
  lookupCache: Map<string, any>;
}

const TRANSFORM_REGISTRY: Record<TransformType, TransformFn> = {
  direct: (value) => value,

  lowercase: (value) => typeof value === 'string' ? value.toLowerCase() : value,

  uppercase: (value) => typeof value === 'string' ? value.toUpperCase() : value,

  trim: (value) => typeof value === 'string' ? value.trim() : value,

  split_name: (value) => {
    if (!value || typeof value !== 'string') return { first_name: '', last_name: '' };
    const trimmed = value.trim();
    // Handle "Last, First" format
    if (trimmed.includes(',')) {
      const [last, ...rest] = trimmed.split(',').map(s => s.trim());
      return { first_name: rest.join(' '), last_name: last };
    }
    // Handle "First Middle Last" format
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return { first_name: parts[0], last_name: '' };
    if (parts.length === 2) return { first_name: parts[0], last_name: parts[1] };
    // 3+ parts: last token is last name, rest is first name
    const lastName = parts.pop()!;
    return { first_name: parts.join(' '), last_name: lastName };
  },

  parse_date: (value, _row, context) => {
    if (!value) return null;
    const str = String(value).trim();

    // Excel serial date number (days since 1900-01-01)
    if (/^\d{5}$/.test(str)) {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + parseInt(str) * 86400000);
      return date.toISOString();
    }

    // Unix timestamp (seconds or milliseconds)
    if (/^\d{10}$/.test(str)) return new Date(parseInt(str) * 1000).toISOString();
    if (/^\d{13}$/.test(str)) return new Date(parseInt(str)).toISOString();

    // ISO 8601
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return new Date(str).toISOString();

    // US format: MM/DD/YYYY
    const usMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (usMatch) {
      const [, month, day, year] = usMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
    }

    // European format: DD.MM.YYYY or DD-MM-YYYY
    const euMatch = str.match(/^(\d{1,2})[.\-](\d{1,2})[.\-](\d{4})$/);
    if (euMatch) {
      const [, day, month, year] = euMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
    }

    // Natural language: "Jan 15, 2024" or "15 January 2024"
    const natural = new Date(str);
    if (!isNaN(natural.getTime())) return natural.toISOString();

    throw new TransformError(`Cannot parse date: "${str}"`);
  },

  parse_currency: (value) => {
    if (!value) return 0;
    const str = String(value).trim();
    // Remove currency symbols
    const stripped = str.replace(/[^\d.,\-]/g, '');
    if (!stripped) return 0;

    // Detect decimal separator
    const lastDot = stripped.lastIndexOf('.');
    const lastComma = stripped.lastIndexOf(',');

    let normalized: string;
    if (lastComma > lastDot && lastComma === stripped.length - 3) {
      // European: 1.234,56 → 1234.56
      normalized = stripped.replace(/\./g, '').replace(',', '.');
    } else if (lastDot > lastComma) {
      // US: 1,234.56 → 1234.56
      normalized = stripped.replace(/,/g, '');
    } else {
      normalized = stripped.replace(/,/g, '');
    }

    return Math.round(parseFloat(normalized) * 100); // Convert to cents
  },

  normalize_phone: (value, _row, context) => {
    if (!value) return null;
    const str = String(value).trim();
    // Strip all formatting
    const digits = str.replace(/[\s\-\(\)\.\+ext]/gi, '');
    if (digits.length < 7) return null; // Too short for a phone number

    // If starts with country code, keep it
    if (str.startsWith('+')) return `+${digits}`;

    // Infer country code from locale
    const countryCode = COUNTRY_CODES[context.locale] || '1'; // Default to US
    return `+${countryCode}${digits}`;
  },

  html_to_markdown: (value) => {
    if (!value) return '';
    // Use a library like turndown for production
    return value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p>/gi, '')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<ul>/gi, '').replace(/<\/ul>/gi, '')
      .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<[^>]+>/g, '') // Strip remaining tags
      .trim();
  },

  csv_to_array: (value) => {
    if (!value) return [];
    return String(value).split(/[,;]/).map(s => s.trim()).filter(Boolean);
  },

  enum_map: (value, _row, _context) => {
    // Actual mapping is provided in the FieldMapping.enumMap config
    // This is a placeholder — the pipeline applies enumMap before calling this
    return value;
  },

  fk_resolve: async (value, _row, context) => {
    if (!value) return null;
    // Look up the target record by external ID or name
    const cached = context.lookupCache.get(value);
    if (cached) return cached;

    const resolved = await db.query(
      `SELECT id FROM target_table WHERE external_id = $1 OR name = $2`,
      [value, value]
    );
    if (resolved.rows.length > 0) {
      context.lookupCache.set(value, resolved.rows[0].id);
      return resolved.rows[0].id;
    }
    return null; // Orphaned reference — logged as warning
  },

  download_file: async (value) => {
    if (!value || !isUrl(value)) return null;
    const fileId = await downloadAndStore(value);
    return fileId;
  },

  generate_uuid: () => crypto.randomUUID(),

  custom: (value, row, context) => {
    // Custom transformations are defined inline in the mapping config
    return value;
  },
};
```

---

## 3. Data Type Conversion Matrix

| Source Type | Target Type | Conversion | Loss Risk | Example |
|-----------|-------------|------------|-----------|---------|
| string → string | Direct | None | `"Hello"` → `"Hello"` |
| string → integer | Parse, strip non-numeric | Precision if decimal | `"42"` → `42` |
| string → decimal | Parse, handle locale separators | None | `"1,234.56"` → `1234.56` |
| string → boolean | Map common values | Ambiguity | `"yes"` → `true` |
| string → date | Multi-format parse | Ambiguity (MM/DD vs DD/MM) | `"01/02/2024"` → `?` |
| string → enum | Lookup mapping table | Unmapped values | `"Active"` → `"active"` |
| string → array | Split on delimiter | Delimiter guessing | `"a,b,c"` → `["a","b","c"]` |
| number → string | Cast | None | `42` → `"42"` |
| number → date | Excel serial or epoch | Format guessing | `45292` → `2024-01-01` |
| HTML → markdown | Tag-to-syntax convert | Complex HTML (tables, images) | `<b>x</b>` → `**x**` |
| URL → file | Download + re-host | Broken/expired URLs | CDN URL → stored file |
| int → UUID | FK resolution lookup | Orphaned references | `123` → `uuid-abc-def` |
| comma-list → JSON array | Split, trim, filter | Encoding of delimiters | `"a,b,c"` → `["a","b","c"]` |

---

## 4. Relationship Mapping (Foreign Keys & References)

### Import Ordering

Entities with foreign key dependencies must be imported in topological order. Parents before children. If a contact belongs to an organization, organizations must be imported first so that the organization ID is available when contacts are processed.

```typescript
// src/migration/mapping/dependency-resolver.ts
interface EntityDependency {
  entity: string;
  dependsOn: string[];
}

const ENTITY_DEPENDENCIES: EntityDependency[] = [
  { entity: 'organizations', dependsOn: [] },
  { entity: 'contacts', dependsOn: ['organizations'] },
  { entity: 'deals', dependsOn: ['contacts', 'organizations'] },
  { entity: 'activities', dependsOn: ['contacts', 'deals'] },
  { entity: 'tasks', dependsOn: ['contacts', 'deals'] },
  { entity: 'notes', dependsOn: ['contacts', 'deals'] },
  { entity: 'attachments', dependsOn: ['contacts', 'deals', 'notes'] },
  { entity: 'tags', dependsOn: [] },
  { entity: 'custom_fields', dependsOn: [] },
];

export function getImportOrder(entities: string[]): string[] {
  const relevant = ENTITY_DEPENDENCIES.filter(e => entities.includes(e.entity));
  return topologicalSort(relevant);
}

function topologicalSort(deps: EntityDependency[]): string[] {
  const sorted: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(entity: string): void {
    if (visited.has(entity)) return;
    if (visiting.has(entity)) {
      throw new Error(`Circular dependency detected involving ${entity}`);
    }

    visiting.add(entity);
    const dep = deps.find(d => d.entity === entity);
    if (dep) {
      for (const parent of dep.dependsOn) {
        visit(parent);
      }
    }
    visiting.delete(entity);
    visited.add(entity);
    sorted.push(entity);
  }

  for (const dep of deps) {
    visit(dep.entity);
  }

  return sorted;
}
```

### Foreign Key Resolution

```typescript
// src/migration/mapping/fk-resolver.ts
/**
 * During import, source IDs (e.g., competitor's integer IDs) must be
 * resolved to target IDs (e.g., UUIDs in our database).
 *
 * The ID map is built incrementally as parent entities are imported.
 */
export class ForeignKeyResolver {
  private idMap: Map<string, Map<string, string>> = new Map();
  // Structure: entityType -> (sourceId -> targetId)

  registerMapping(entityType: string, sourceId: string, targetId: string): void {
    if (!this.idMap.has(entityType)) {
      this.idMap.set(entityType, new Map());
    }
    this.idMap.get(entityType)!.set(sourceId, targetId);
  }

  resolve(entityType: string, sourceId: string): string | null {
    return this.idMap.get(entityType)?.get(sourceId) || null;
  }

  resolveOrThrow(entityType: string, sourceId: string): string {
    const resolved = this.resolve(entityType, sourceId);
    if (!resolved) {
      throw new ForeignKeyError(
        `Cannot resolve ${entityType} reference: source ID "${sourceId}" was not found ` +
        `in the import batch. The referenced record may not have been imported.`
      );
    }
    return resolved;
  }

  getStats(): Record<string, { total: number; resolved: number; orphaned: number }> {
    const stats: Record<string, any> = {};
    for (const [entity, map] of this.idMap) {
      stats[entity] = {
        total: map.size,
        resolved: [...map.values()].filter(v => v !== null).length,
        orphaned: [...map.values()].filter(v => v === null).length,
      };
    }
    return stats;
  }
}
```

---

## 5. Default Value Strategy

When source data is missing a field that the target schema requires, a default value strategy determines what to insert.

| Strategy | When to Use | Risk |
|----------|------------|------|
| **Static default** | Field has a natural default (e.g., status = "active") | Masks missing data |
| **Import timestamp** | Date fields (created_at, updated_at) | Loses original timeline |
| **Null** | Optional fields | No risk — but downstream features may not work |
| **Prompt user** | Critical fields with no safe default | Adds friction to wizard flow |
| **Infer from context** | Derive from other fields (e.g., country from phone prefix) | Inference may be wrong |
| **Flag for review** | Import with a marker, review later | Delays data completeness |

```typescript
// src/migration/mapping/defaults.ts
interface DefaultStrategy {
  field: string;
  strategy: 'static' | 'timestamp' | 'null' | 'prompt' | 'infer' | 'flag';
  value?: any;
  inferFrom?: string;
  inferFn?: (row: Record<string, any>) => any;
}

const DEFAULT_STRATEGIES: DefaultStrategy[] = [
  { field: 'status', strategy: 'static', value: 'active' },
  { field: 'created_at', strategy: 'timestamp' },
  { field: 'updated_at', strategy: 'timestamp' },
  { field: 'owner_id', strategy: 'static', value: '{{IMPORTING_USER_ID}}' },
  { field: 'source', strategy: 'static', value: 'import' },
  { field: 'import_batch_id', strategy: 'static', value: '{{IMPORT_ID}}' },
  { field: 'country', strategy: 'infer', inferFrom: 'phone', inferFn: inferCountryFromPhone },
  { field: 'timezone', strategy: 'infer', inferFrom: 'country', inferFn: inferTimezoneFromCountry },
];
```

---

## 6. Custom Field Handling

Competitors allow custom fields that do not exist in the {{PROJECT_NAME}} schema. These must be dynamically created during import.

```typescript
// src/migration/mapping/custom-field-handler.ts
interface CustomFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi_select' | 'url';
  options?: string[]; // For select/multi_select
  sourceField: string;
}

export async function handleCustomFields(
  sourceFields: string[],
  knownMappings: FieldMapping[],
  sampleData: Record<string, string>[]
): Promise<CustomFieldDefinition[]> {
  const mappedSourceFields = new Set(knownMappings.map(m => m.sourceField));
  const unmappedFields = sourceFields.filter(f => !mappedSourceFields.has(f));

  const customFields: CustomFieldDefinition[] = [];

  for (const field of unmappedFields) {
    const samples = sampleData.map(row => row[field]).filter(Boolean);
    const inferredType = inferFieldType(samples);

    customFields.push({
      name: slugify(field),
      label: titleCase(field),
      type: mapInferredToCustomType(inferredType),
      options: inferredType === 'enum' ? extractUniqueValues(samples) : undefined,
      sourceField: field,
    });
  }

  // Create custom field definitions in the database
  for (const cf of customFields) {
    await db.query(
      `INSERT INTO custom_field_definitions (name, label, type, options, entity_type, created_by)
       VALUES ($1, $2, $3, $4, $5, 'migration')
       ON CONFLICT (name, entity_type) DO NOTHING`,
      [cf.name, cf.label, cf.type, JSON.stringify(cf.options), 'contact']
    );
  }

  return customFields;
}
```

---

## 7. Mapping Validation Rules

Before processing begins, validate the mapping configuration itself — not the data, but the mapping logic.

### Validation Checklist

- [ ] Every required target field has a source mapping or a default value
- [ ] No target field is mapped twice (ambiguous source)
- [ ] Enum mappings cover all values found in sample data
- [ ] Foreign key dependencies are satisfiable (parent entities are included in import)
- [ ] Date format assumptions are validated against sample data
- [ ] Custom fields do not collide with existing field names
- [ ] File/attachment mappings have storage capacity for estimated volume
- [ ] Transformation functions handle null/empty input gracefully

```typescript
// src/migration/mapping/mapping-validator.ts
interface MappingValidationResult {
  valid: boolean;
  errors: MappingValidationError[];
  warnings: MappingValidationWarning[];
}

export function validateMappingConfig(
  config: MappingConfig,
  targetSchema: TargetSchema,
  sampleData: Record<string, any>[]
): MappingValidationResult {
  const errors: MappingValidationError[] = [];
  const warnings: MappingValidationWarning[] = [];

  // Check required fields
  for (const field of targetSchema.fields.filter(f => f.required)) {
    const mapping = config.mappings.find(m => {
      const targets = Array.isArray(m.targetField) ? m.targetField : [m.targetField];
      return targets.includes(field.name);
    });
    if (!mapping && !field.defaultValue) {
      errors.push({
        type: 'missing_required_mapping',
        field: field.name,
        message: `Required field "${field.label}" has no source mapping and no default value`,
      });
    }
  }

  // Check for duplicate target mappings
  const targetCounts = new Map<string, number>();
  for (const mapping of config.mappings) {
    const targets = Array.isArray(mapping.targetField) ? mapping.targetField : [mapping.targetField];
    for (const target of targets) {
      targetCounts.set(target, (targetCounts.get(target) || 0) + 1);
    }
  }
  for (const [target, count] of targetCounts) {
    if (count > 1) {
      errors.push({
        type: 'duplicate_target',
        field: target,
        message: `Target field "${target}" is mapped ${count} times. Each target should have one source.`,
      });
    }
  }

  // Validate enum mappings against sample data
  for (const mapping of config.mappings.filter(m => m.enumMap)) {
    const sampleValues = new Set(sampleData.map(row => row[mapping.sourceField]).filter(Boolean));
    for (const value of sampleValues) {
      if (!mapping.enumMap![value]) {
        warnings.push({
          type: 'unmapped_enum_value',
          field: mapping.sourceField,
          message: `Source value "${value}" in field "${mapping.sourceField}" has no enum mapping. ` +
            `It will be imported as-is or rejected depending on target field constraints.`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```
