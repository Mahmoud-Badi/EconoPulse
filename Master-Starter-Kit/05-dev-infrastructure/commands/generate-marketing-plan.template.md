# /generate-marketing-plan

Regenerate or update the full marketing strategy for {{PROJECT_NAME}}. Uses the marketing templates and generators from `19-marketing/` to produce a comprehensive, tailored marketing plan.

## When to Use

- After initial orchestrator run (Steps 19-28) to refresh the marketing plan
- When pivoting target audience, pricing, or channels
- When entering a new growth phase
- Quarterly marketing strategy review

## Steps

### Step 1: Read Current Marketing Config

Read the project's MARKETING_CONFIG from the orchestrator STATE BLOCK or existing marketing docs:
- `PRODUCT_TYPE`, `TARGET_AUDIENCE`, `MARKETING_BUDGET`, `MONETIZATION_MODEL`
- `PRIMARY_CHANNELS`, `BRAND_VOICE`, `LAUNCH_TIMELINE`, `REVENUE_GOAL`

If any values are missing, ask the user to provide them using `19-marketing/marketing-intake.md` as a guide.

### Step 2: Run Competitor Analysis

Run `19-marketing/generators/COMPETITOR-MARKETING-ANALYZER.md`:
- Use Firecrawl MCP to scrape competitor websites, pricing pages, and social profiles
- Use WebSearch to find recent competitor marketing campaigns
- Document competitor channels, messaging, and positioning
- Identify gaps and opportunities

If MCP servers are unavailable, fall back to WebFetch + WebSearch for manual research.

### Step 3: Generate Marketing Plan

Run `19-marketing/generators/MARKETING-PLAN-GENERATOR.md` with all gathered data:
- Executive summary
- Target audience analysis (from `19-marketing/market-research/audience-research.template.md`)
- Positioning strategy (from `19-marketing/market-research/positioning-strategy.template.md`)
- Channel strategy with priority ranking (from `19-marketing/channel-decision-tree.md`)
- 90-day roadmap (month by month)
- Budget allocation (from `19-marketing/marketing-budget-framework.md`)
- KPI targets (from `19-marketing/analytics-and-tracking/kpi-dashboard.template.md`)

### Step 4: Generate Supporting Documents

Based on the marketing plan, regenerate:
- Brand messaging framework (if not already generated)
- Content calendar (90-day plan)
- Email marketing sequences
- Social media content plan
- Launch/growth strategy updates

### Step 5: Save and Present

Save the marketing plan to `{{DOCS_PATH}}/marketing/MARKETING-PLAN.md`

### Output

```
MARKETING PLAN GENERATED
========================
Product: {{PROJECT_NAME}}
Product type: {type}
Target audience: {audience}
Budget: {tier} / month
Primary channels: {top 3-4}

Documents generated:
- Marketing plan: {path}
- Channel strategy: {path}
- 90-day roadmap: {path}
- Budget allocation: {path}

Key recommendations:
1. {top priority action}
2. {second priority}
3. {third priority}

Next: Review the plan and run /generate-landing-page to create landing page copy.
```

## Notes

- This command requires Firecrawl MCP and Gemini MCP for competitive research. Falls back to WebSearch/WebFetch if unavailable.
- The marketing plan should be reviewed quarterly and regenerated when strategy changes significantly.
- All generated content uses the brand voice defined in `19-marketing/brand-messaging/brand-voice-guide.template.md`.
