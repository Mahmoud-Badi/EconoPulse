# Business Rule Reference Table: {{RULE_DOMAIN}}

> **Purpose:** Definitive lookup table for domain-specific business rules that an AI agent cannot derive from context alone. If a service spec references an external standard, regulation, or classification system, the rules must be enumerated here — not left to the agent's training data.
>
> **Why this exists:** Service specs say things like "28 mandatory NEMSIS elements" or "ALS1 requires at least one ALS intervention" but never list them. Without this table, agents hallucinate regulatory/domain knowledge. This file IS the source of truth for this project.
>
> **Generate one file per rule domain.** Save to `dev_docs/specs/catalogs/business-rules/{{rule-domain-slug}}.md`

---

## Metadata

| Field | Value |
|-------|-------|
| **Rule Domain** | {{RULE_DOMAIN}} (e.g., "NEMSIS Compliance", "Service Level Determination", "Tax Jurisdiction Rules") |
| **Source Authority** | {{SOURCE_AUTHORITY}} (e.g., "NHTSA NEMSIS v3.5", "Medicare CFR 42 §410.40", "IRS Publication 15") |
| **Version/Revision** | {{STANDARD_VERSION}} |
| **Last Verified** | {{DATE}} |
| **Affected Services** | {{SERVICE_LIST}} |
| **Total Rules** | {{RULE_COUNT}} |

---

## How to Use This Reference

1. **During spec writing:** When a service spec describes a business rule that references this domain, cite the Rule ID from this table.
2. **During implementation:** Developers implement validation logic exactly as described in the "Validation Logic" column. No interpretation needed.
3. **During testing:** Use the "Test Scenarios" section to generate test cases. Every rule must have at least one passing and one failing test.
4. **During audit:** The CROSS-REFERENCE-VALIDATOR checks that every rule ID cited in service specs exists in this table.

---

## Rule Registry

| Rule ID | Rule Name | Description | Validation Logic | Affected Services | Affected Screens | Enforcement Point |
|---------|-----------|-------------|-----------------|-------------------|-----------------|-------------------|
| {{DOMAIN_PREFIX}}-001 | {{RULE_NAME}} | {{DESCRIPTION}} | {{EXACT_LOGIC}} (e.g., "field.length >= 3 && field.length <= 50") | {{SERVICE_LIST}} | {{SCREEN_LIST}} | {{WHEN}} (e.g., "on save", "on submit", "on export") |
| {{DOMAIN_PREFIX}}-002 | {{RULE_NAME}} | {{DESCRIPTION}} | {{EXACT_LOGIC}} | {{SERVICE_LIST}} | {{SCREEN_LIST}} | {{WHEN}} |
<!-- List EVERY rule. Never truncate with "etc." or "and more." If the standard has 28 elements, list all 28. -->

---

## Database Column Mapping

| Rule ID | Table | Column | Type | Constraints | Default |
|---------|-------|--------|------|-------------|---------|
| {{DOMAIN_PREFIX}}-001 | {{TABLE}} | {{COLUMN}} | {{TYPE}} | {{CONSTRAINTS}} (e.g., "NOT NULL, CHECK(length >= 3)") | {{DEFAULT}} |
<!-- Map every rule to its storage location. Rules enforced in application logic still need the data column documented. -->

---

## TypeScript Types

```typescript
// Enum or union type for classification rules
export const {{DOMAIN_PREFIX}}_VALUES = [
  // List every valid value
] as const;

export type {{DomainType}} = typeof {{DOMAIN_PREFIX}}_VALUES[number];

// Validation function signature
export function validate{{DomainName}}(input: {{InputType}}): {
  valid: boolean;
  violations: Array<{
    ruleId: string;
    message: string;
    field: string;
    expected: string;
    received: string;
  }>;
};
```

---

## Decision Tree

For classification/determination rules, provide the complete decision logic:

```
IF {{CONDITION_1}}
  AND {{CONDITION_2}}
  THEN → {{CLASSIFICATION_A}}
ELSE IF {{CONDITION_3}}
  THEN → {{CLASSIFICATION_B}}
ELSE
  → {{DEFAULT_CLASSIFICATION}}
```

<!-- Convert every multi-branch business rule into an explicit decision tree. No ambiguity. -->

---

## Test Scenarios

| # | Scenario | Input | Expected Output | Rule(s) Tested | Edge Case? |
|---|----------|-------|-----------------|----------------|------------|
| 1 | {{SCENARIO}} | {{INPUT_DATA}} | {{EXPECTED}} | {{RULE_IDS}} | No |
| 2 | {{SCENARIO}} | {{INPUT_DATA}} | {{EXPECTED}} | {{RULE_IDS}} | Yes |
<!-- Minimum 10 test scenarios per reference table. Include at least 3 edge cases. -->

---

## Edge Cases

| # | Edge Case | Correct Handling | Common Mistake |
|---|-----------|-----------------|----------------|
| 1 | {{EDGE_CASE}} | {{CORRECT_BEHAVIOR}} | {{WHAT_AGENTS_GET_WRONG}} |
<!-- Minimum 5 edge cases. Focus on scenarios where AI agents commonly hallucinate or guess wrong. -->

---

## Completeness Checklist

- [ ] Every rule from the source standard is listed (count matches {{RULE_COUNT}})
- [ ] Every rule has a database column mapping
- [ ] Every rule has validation logic specific enough to implement without interpretation
- [ ] TypeScript types cover all valid values
- [ ] Decision tree covers all branches (no "else handle appropriately")
- [ ] Minimum 10 test scenarios with expected outputs
- [ ] Minimum 5 edge cases documented
- [ ] No "see external documentation" references — this IS the documentation
