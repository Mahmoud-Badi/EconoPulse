# /generate-email-sequence $ARGUMENT

Generate an email sequence with actual copy for {{PROJECT_NAME}}. The `$ARGUMENT` specifies the sequence type: `welcome`, `sales`, `winback`, `launch`, `newsletter`, or `onboarding`. Defaults to `welcome` if not specified.

## When to Use

- After brand messaging is defined (Step 20)
- When setting up email marketing (Step 24)
- When launching new campaigns or features
- When optimizing existing email sequences

## Steps

### Step 1: Read Brand Foundations

Read these files:
- `19-marketing/brand-messaging/brand-voice-guide.template.md`
- `19-marketing/brand-messaging/value-proposition-canvas.template.md`
- `19-marketing/brand-messaging/messaging-framework.template.md`

### Step 2: Read Email Strategy

Read the relevant email template based on `$ARGUMENT`:
- `welcome` → `19-marketing/email-marketing/welcome-sequence.template.md`
- `sales` → `19-marketing/email-marketing/sales-email-sequences.template.md`
- `winback` → `19-marketing/onboarding-retention/re-engagement-campaigns.template.md`
- `launch` → `19-marketing/launch-strategy/pre-launch-playbook.template.md`
- `newsletter` → `19-marketing/email-marketing/newsletter-strategy.template.md`
- `onboarding` → `19-marketing/onboarding-retention/user-onboarding-sequence.template.md`

Also read `19-marketing/legal-compliance/email-compliance.md` for compliance requirements.

### Step 3: Run Email Sequence Generator

Run `19-marketing/generators/EMAIL-SEQUENCE-GENERATOR.md` for the specified type.

For each email in the sequence, generate:
- **Subject line:** 3 A/B test variants
- **Preview text:** matching each subject line
- **Body copy:** full email with greeting, content blocks, CTA
- **CTA button text:** 2 variants
- **Send timing:** when to send relative to trigger event
- **Personalization:** variables used ({{FIRST_NAME}}, {{COMPANY_NAME}}, etc.)

### Step 4: Compliance Check

Verify each email includes:
- Unsubscribe link placement
- Physical address requirement (CAN-SPAM)
- Consent compliance (GDPR if applicable)
- Clear sender identification

### Step 5: Save

Save to `{{DOCS_PATH}}/marketing/email-sequences/{sequence-type}-sequence.md`

### Output

```
EMAIL SEQUENCE GENERATED
========================
Type: $ARGUMENT
Emails: {count}
Total subject line variants: {count}
Personalization variables: {list}

Sequence timeline:
  Email 1: {subject} — Day {N}
  Email 2: {subject} — Day {N}
  ...

Saved to: {path}

Next steps:
1. Import into email tool (ConvertKit / Mailchimp / Resend)
2. Set up automation triggers
3. A/B test subject lines
```

## Notes

- Each email is ready to copy-paste into any email marketing platform.
- Subject lines are designed for A/B testing — implement the variants in your email tool.
- Personalization variables ({{FIRST_NAME}} etc.) should be mapped to your email tool's merge fields.
- Always send a test email to yourself before activating the sequence.
