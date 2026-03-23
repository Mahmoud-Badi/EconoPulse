# Value Proposition Canvas: {{PROJECT_NAME}}

> **Purpose:** This canvas maps exactly how {{PROJECT_NAME}} creates value for customers. It connects customer needs to product capabilities, ensuring every feature, message, and marketing claim is grounded in real customer value. Use this as the foundation for all marketing copy, sales conversations, and product decisions.
>
> **Last updated:** {{DATE}}
> **Owner:** {{MARKETING_OWNER}}
> **Target audience segment:** {{PRIMARY_PERSONA}}
> **Version:** 1.0

---

## Table of Contents

1. [Customer Profile](#1-customer-profile)
2. [Value Map](#2-value-map)
3. [Fit Analysis](#3-fit-analysis)
4. [Value Proposition Statements](#4-value-proposition-statements)
5. [Feature-Benefit-Proof Chains](#5-feature-benefit-proof-chains)
6. [Quantified Value Statements](#6-quantified-value-statements)
7. [Emotional vs Rational Value Balance](#7-emotional-vs-rational-value-balance)
8. [Before/After Scenarios](#8-beforeafter-scenarios)
9. [Value Proposition Testing](#9-value-proposition-testing)

---

## 1. Customer Profile

The customer profile describes who your customer is, what they are trying to accomplish, what frustrates them, and what success looks like -- all from **their** perspective, not yours.

### 1.1 Customer Jobs

Customer jobs are the things your customers are trying to get done in their work or life. They are the tasks they are trying to perform, the problems they are trying to solve, and the needs they are trying to satisfy.

#### Functional Jobs (Tasks to Accomplish)

These are the practical, tangible things your customer needs to do.

| Priority | Job Description | Current Solution | Satisfaction Level |
|----------|----------------|-----------------|-------------------|
| Critical | {{FUNCTIONAL_JOB_1}} | {{CURRENT_SOLUTION_1}} | {{SATISFACTION_1}} (1-5) |
| Critical | {{FUNCTIONAL_JOB_2}} | {{CURRENT_SOLUTION_2}} | {{SATISFACTION_2}} (1-5) |
| High | {{FUNCTIONAL_JOB_3}} | {{CURRENT_SOLUTION_3}} | {{SATISFACTION_3}} (1-5) |
| High | {{FUNCTIONAL_JOB_4}} | {{CURRENT_SOLUTION_4}} | {{SATISFACTION_4}} (1-5) |
| Medium | {{FUNCTIONAL_JOB_5}} | {{CURRENT_SOLUTION_5}} | {{SATISFACTION_5}} (1-5) |
| Medium | {{FUNCTIONAL_JOB_6}} | {{CURRENT_SOLUTION_6}} | {{SATISFACTION_6}} (1-5) |

**How to identify functional jobs:**
- What tasks does your customer complete on a daily/weekly basis?
- What would they hire someone (or something) to do for them?
- What process takes too long, costs too much, or fails too often?

#### Social Jobs (How They Want to Be Perceived)

These are about how customers want to be seen by others -- colleagues, bosses, peers, or the market.

| Social Job | Who They Want to Impress | Current Status |
|-----------|-------------------------|----------------|
| {{SOCIAL_JOB_1}} | {{AUDIENCE_1}} | {{SOCIAL_STATUS_1}} |
| {{SOCIAL_JOB_2}} | {{AUDIENCE_2}} | {{SOCIAL_STATUS_2}} |
| {{SOCIAL_JOB_3}} | {{AUDIENCE_3}} | {{SOCIAL_STATUS_3}} |

**Common social jobs by product type:**

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
- Look like an innovator who brings smart tools to the team
- Be seen as data-driven and efficient by leadership
- Demonstrate that their department is modern and well-run
- Get credit for improvements in team productivity
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
- Be recognized as someone who uses the best tools
- Demonstrate engineering excellence to peers
- Ship high-quality code that earns respect in code review
- Contribute to open source and community credibility
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
- Be seen as someone who is organized / healthy / cultured / ahead of trends
- Share accomplishments or experiences with friends
- Feel part of a community of like-minded people
<!-- ENDIF -->

#### Emotional Jobs (How They Want to Feel)

These are the feelings your customer wants to experience (or avoid experiencing).

| Desired Feeling | Current Feeling | Gap |
|----------------|----------------|-----|
| {{DESIRED_FEELING_1}} | {{CURRENT_FEELING_1}} | {{FEELING_GAP_1}} |
| {{DESIRED_FEELING_2}} | {{CURRENT_FEELING_2}} | {{FEELING_GAP_2}} |
| {{DESIRED_FEELING_3}} | {{CURRENT_FEELING_3}} | {{FEELING_GAP_3}} |
| {{DESIRED_FEELING_4}} | {{CURRENT_FEELING_4}} | {{FEELING_GAP_4}} |

**Common emotional jobs:**
- Feel confident they are making the right decision
- Feel in control of a chaotic situation
- Feel relieved that a painful problem is solved
- Feel pride in the quality of their work
- Feel calm knowing things are working as expected
- Feel excited about new possibilities

---

### 1.2 Customer Pains

Pains are anything that annoys, frustrates, or prevents your customer from getting a job done. They include risks, undesired outcomes, and obstacles.

#### Frustrations and Annoyances

| Pain | Severity (1-10) | Frequency | Current Workaround |
|------|-----------------|-----------|-------------------|
| {{PAIN_FRUSTRATION_1}} | {{SEVERITY_1}} | {{FREQUENCY_1}} | {{WORKAROUND_1}} |
| {{PAIN_FRUSTRATION_2}} | {{SEVERITY_2}} | {{FREQUENCY_2}} | {{WORKAROUND_2}} |
| {{PAIN_FRUSTRATION_3}} | {{SEVERITY_3}} | {{FREQUENCY_3}} | {{WORKAROUND_3}} |
| {{PAIN_FRUSTRATION_4}} | {{SEVERITY_4}} | {{FREQUENCY_4}} | {{WORKAROUND_4}} |
| {{PAIN_FRUSTRATION_5}} | {{SEVERITY_5}} | {{FREQUENCY_5}} | {{WORKAROUND_5}} |

#### Obstacles and Barriers

| Obstacle | What It Prevents | Impact on Business/Life |
|----------|-----------------|------------------------|
| {{OBSTACLE_1}} | {{PREVENTS_1}} | {{IMPACT_1}} |
| {{OBSTACLE_2}} | {{PREVENTS_2}} | {{IMPACT_2}} |
| {{OBSTACLE_3}} | {{PREVENTS_3}} | {{IMPACT_3}} |

#### Risks and Fears

| Risk/Fear | Likelihood | Consequence | How They Manage It Now |
|-----------|-----------|-------------|----------------------|
| {{RISK_1}} | {{LIKELIHOOD_1}} | {{CONSEQUENCE_1}} | {{MANAGEMENT_1}} |
| {{RISK_2}} | {{LIKELIHOOD_2}} | {{CONSEQUENCE_2}} | {{MANAGEMENT_2}} |
| {{RISK_3}} | {{LIKELIHOOD_3}} | {{CONSEQUENCE_3}} | {{MANAGEMENT_3}} |

---

### 1.3 Customer Gains

Gains are the outcomes and benefits your customers want. They range from expected basics to unexpected delights.

#### Required Gains (Must-Haves)

Without these, the customer will not even consider the solution.

| Required Gain | Minimum Acceptable Threshold |
|--------------|------------------------------|
| {{REQUIRED_GAIN_1}} | {{THRESHOLD_1}} |
| {{REQUIRED_GAIN_2}} | {{THRESHOLD_2}} |
| {{REQUIRED_GAIN_3}} | {{THRESHOLD_3}} |

#### Expected Gains (Should-Haves)

The customer expects these from a good solution in this category.

| Expected Gain | Current Benchmark (from competitors or alternatives) |
|--------------|-----------------------------------------------------|
| {{EXPECTED_GAIN_1}} | {{BENCHMARK_1}} |
| {{EXPECTED_GAIN_2}} | {{BENCHMARK_2}} |
| {{EXPECTED_GAIN_3}} | {{BENCHMARK_3}} |

#### Desired Gains (Nice-to-Haves)

The customer would love these but does not expect them.

| Desired Gain | Value to Customer |
|-------------|-------------------|
| {{DESIRED_GAIN_1}} | {{DESIRED_VALUE_1}} |
| {{DESIRED_GAIN_2}} | {{DESIRED_VALUE_2}} |
| {{DESIRED_GAIN_3}} | {{DESIRED_VALUE_3}} |

#### Unexpected Gains (Delighters)

Things the customer never thought to ask for but would be thrilled to discover.

| Unexpected Gain | Why It Delights |
|----------------|-----------------|
| {{UNEXPECTED_GAIN_1}} | {{DELIGHT_REASON_1}} |
| {{UNEXPECTED_GAIN_2}} | {{DELIGHT_REASON_2}} |

---

## 2. Value Map

The value map describes how {{PROJECT_NAME}} creates value. It maps directly to the customer profile above.

### 2.1 Products and Services

| Offering | Description | Primary Job It Addresses |
|----------|------------|-------------------------|
| {{OFFERING_1}} | {{OFFERING_1_DESC}} | {{OFFERING_1_JOB}} |
| {{OFFERING_2}} | {{OFFERING_2_DESC}} | {{OFFERING_2_JOB}} |
| {{OFFERING_3}} | {{OFFERING_3_DESC}} | {{OFFERING_3_JOB}} |
| {{OFFERING_4}} | {{OFFERING_4_DESC}} | {{OFFERING_4_JOB}} |
| {{OFFERING_5}} | {{OFFERING_5_DESC}} | {{OFFERING_5_JOB}} |

### 2.2 Pain Relievers

For each customer pain identified above, describe exactly how {{PROJECT_NAME}} alleviates it.

| Customer Pain | How {{PROJECT_NAME}} Relieves It | Proof/Evidence |
|--------------|----------------------------------|----------------|
| {{PAIN_FRUSTRATION_1}} | {{PAIN_RELIEVER_1}} | {{PROOF_1}} |
| {{PAIN_FRUSTRATION_2}} | {{PAIN_RELIEVER_2}} | {{PROOF_2}} |
| {{PAIN_FRUSTRATION_3}} | {{PAIN_RELIEVER_3}} | {{PROOF_3}} |
| {{PAIN_FRUSTRATION_4}} | {{PAIN_RELIEVER_4}} | {{PROOF_4}} |
| {{PAIN_FRUSTRATION_5}} | {{PAIN_RELIEVER_5}} | {{PROOF_5}} |
| {{OBSTACLE_1}} | {{OBSTACLE_RELIEVER_1}} | {{OBSTACLE_PROOF_1}} |
| {{OBSTACLE_2}} | {{OBSTACLE_RELIEVER_2}} | {{OBSTACLE_PROOF_2}} |
| {{RISK_1}} | {{RISK_RELIEVER_1}} | {{RISK_PROOF_1}} |
| {{RISK_2}} | {{RISK_RELIEVER_2}} | {{RISK_PROOF_2}} |

### 2.3 Gain Creators

For each customer gain identified above, describe exactly how {{PROJECT_NAME}} delivers it.

| Customer Gain | How {{PROJECT_NAME}} Creates It | Measurement |
|--------------|----------------------------------|-------------|
| {{REQUIRED_GAIN_1}} | {{GAIN_CREATOR_R1}} | {{METRIC_R1}} |
| {{REQUIRED_GAIN_2}} | {{GAIN_CREATOR_R2}} | {{METRIC_R2}} |
| {{EXPECTED_GAIN_1}} | {{GAIN_CREATOR_E1}} | {{METRIC_E1}} |
| {{EXPECTED_GAIN_2}} | {{GAIN_CREATOR_E2}} | {{METRIC_E2}} |
| {{DESIRED_GAIN_1}} | {{GAIN_CREATOR_D1}} | {{METRIC_D1}} |
| {{DESIRED_GAIN_2}} | {{GAIN_CREATOR_D2}} | {{METRIC_D2}} |
| {{UNEXPECTED_GAIN_1}} | {{GAIN_CREATOR_U1}} | {{METRIC_U1}} |

---

## 3. Fit Analysis

### Pain-to-Pain Reliever Fit

Rate the strength of fit between each customer pain and your pain relievers.

| Customer Pain | Pain Reliever | Fit Strength | Notes |
|--------------|---------------|-------------|-------|
| {{PAIN_FRUSTRATION_1}} | {{PAIN_RELIEVER_1}} | Strong / Moderate / Weak | {{FIT_NOTE_1}} |
| {{PAIN_FRUSTRATION_2}} | {{PAIN_RELIEVER_2}} | Strong / Moderate / Weak | {{FIT_NOTE_2}} |
| {{PAIN_FRUSTRATION_3}} | {{PAIN_RELIEVER_3}} | Strong / Moderate / Weak | {{FIT_NOTE_3}} |
| {{PAIN_FRUSTRATION_4}} | {{PAIN_RELIEVER_4}} | Strong / Moderate / Weak | {{FIT_NOTE_4}} |
| {{PAIN_FRUSTRATION_5}} | {{PAIN_RELIEVER_5}} | Strong / Moderate / Weak | {{FIT_NOTE_5}} |

### Gain-to-Gain Creator Fit

| Customer Gain | Gain Creator | Fit Strength | Notes |
|--------------|-------------|-------------|-------|
| {{REQUIRED_GAIN_1}} | {{GAIN_CREATOR_R1}} | Strong / Moderate / Weak | {{GAIN_FIT_NOTE_1}} |
| {{REQUIRED_GAIN_2}} | {{GAIN_CREATOR_R2}} | Strong / Moderate / Weak | {{GAIN_FIT_NOTE_2}} |
| {{EXPECTED_GAIN_1}} | {{GAIN_CREATOR_E1}} | Strong / Moderate / Weak | {{GAIN_FIT_NOTE_3}} |
| {{EXPECTED_GAIN_2}} | {{GAIN_CREATOR_E2}} | Strong / Moderate / Weak | {{GAIN_FIT_NOTE_4}} |

### Fit Summary

```
TOTAL PAINS IDENTIFIED:         {{TOTAL_PAINS}}
PAINS WITH STRONG RELIEF:       {{STRONG_RELIEF_COUNT}}
PAINS WITH MODERATE RELIEF:     {{MODERATE_RELIEF_COUNT}}
PAINS WITH WEAK/NO RELIEF:      {{WEAK_RELIEF_COUNT}}

TOTAL GAINS IDENTIFIED:         {{TOTAL_GAINS}}
GAINS WITH STRONG CREATION:     {{STRONG_CREATION_COUNT}}
GAINS WITH MODERATE CREATION:   {{MODERATE_CREATION_COUNT}}
GAINS WITH WEAK/NO CREATION:    {{WEAK_CREATION_COUNT}}

OVERALL FIT SCORE:              {{FIT_SCORE}} / 10

TOP 3 STRONGEST FITS (lead with these in messaging):
1. {{STRONGEST_FIT_1}}
2. {{STRONGEST_FIT_2}}
3. {{STRONGEST_FIT_3}}

GAPS TO ADDRESS (pains/gains not well served):
1. {{GAP_1}}
2. {{GAP_2}}
```

---

## 4. Value Proposition Statements

Use multiple frameworks to articulate your value proposition. Test each version with real customers to see which resonates most.

### Framework 1: The Classic Formula

> **For** {{TARGET_CUSTOMER}}
> **who** {{CUSTOMER_NEED_OR_OPPORTUNITY}},
> **{{PROJECT_NAME}} is a** {{PRODUCT_CATEGORY}}
> **that** {{KEY_BENEFIT}}.
> **Unlike** {{COMPETITOR_OR_ALTERNATIVE}},
> **we** {{PRIMARY_DIFFERENTIATOR}}.

### Framework 2: The Jobs-to-Be-Done Formula

> **When** {{SITUATION_OR_TRIGGER}},
> {{TARGET_CUSTOMER}} **want to** {{DESIRED_OUTCOME}}
> **so they can** {{HIGHER_LEVEL_GOAL}}.
> **{{PROJECT_NAME}} helps them** {{HOW_YOU_HELP}}
> **without** {{PAIN_YOU_ELIMINATE}}.

### Framework 3: The Before-After-Bridge

> **Before:** {{BEFORE_STATE}}
> **After:** {{AFTER_STATE}}
> **Bridge:** {{PROJECT_NAME}} -- {{HOW_YOU_BRIDGE}}

### Framework 4: The "So What?" Chain

Start with a feature and keep asking "So what?" until you reach the ultimate benefit.

| Level | Statement |
|-------|-----------|
| Feature | {{PROJECT_NAME}} has {{FEATURE}} |
| So what? | This means {{ADVANTAGE}} |
| So what? | Which allows you to {{BENEFIT}} |
| So what? | Ultimately, you {{ULTIMATE_OUTCOME}} |

### Framework 5: The XYZ Formula (Google's internal format)

> **We help** {{TARGET_CUSTOMER}}
> **do** {{JOB_TO_BE_DONE}}
> **by** {{HOW_YOU_DO_IT}}.

### Framework 6: Steve Blank's Formula

> **We help** {{TARGET_CUSTOMER}}
> **who want to** {{DESIRED_OUTCOME}}
> **by** {{PRODUCT_CAPABILITY}}
> **and** {{KEY_DIFFERENTIATOR}}.

### Framework 7: The Headline Test

Write your value proposition as a newspaper headline. If someone scanned it in 3 seconds, would they understand what you do and why it matters?

> **{{HEADLINE_VALUE_PROP}}**

### Chosen Value Proposition

After testing the frameworks above, select and refine your primary value proposition:

> **Primary value proposition:**
> {{PRIMARY_VALUE_PROPOSITION}}

> **Supporting value proposition (secondary):**
> {{SECONDARY_VALUE_PROPOSITION}}

---

## 5. Feature-Benefit-Proof Chains

For every major feature, build a complete chain from feature to proof. This ensures your marketing never stops at features and always connects to customer value.

### Feature 1: {{FEATURE_1_NAME}}

| Layer | Content |
|-------|---------|
| **Feature** | {{FEATURE_1_DESCRIPTION}} |
| **Advantage** | {{FEATURE_1_ADVANTAGE}} |
| **Benefit** | {{FEATURE_1_BENEFIT}} |
| **Emotional payoff** | {{FEATURE_1_EMOTION}} |
| **Proof point** | {{FEATURE_1_PROOF}} |
| **Marketing copy** | "{{FEATURE_1_COPY}}" |

### Feature 2: {{FEATURE_2_NAME}}

| Layer | Content |
|-------|---------|
| **Feature** | {{FEATURE_2_DESCRIPTION}} |
| **Advantage** | {{FEATURE_2_ADVANTAGE}} |
| **Benefit** | {{FEATURE_2_BENEFIT}} |
| **Emotional payoff** | {{FEATURE_2_EMOTION}} |
| **Proof point** | {{FEATURE_2_PROOF}} |
| **Marketing copy** | "{{FEATURE_2_COPY}}" |

### Feature 3: {{FEATURE_3_NAME}}

| Layer | Content |
|-------|---------|
| **Feature** | {{FEATURE_3_DESCRIPTION}} |
| **Advantage** | {{FEATURE_3_ADVANTAGE}} |
| **Benefit** | {{FEATURE_3_BENEFIT}} |
| **Emotional payoff** | {{FEATURE_3_EMOTION}} |
| **Proof point** | {{FEATURE_3_PROOF}} |
| **Marketing copy** | "{{FEATURE_3_COPY}}" |

### Feature 4: {{FEATURE_4_NAME}}

| Layer | Content |
|-------|---------|
| **Feature** | {{FEATURE_4_DESCRIPTION}} |
| **Advantage** | {{FEATURE_4_ADVANTAGE}} |
| **Benefit** | {{FEATURE_4_BENEFIT}} |
| **Emotional payoff** | {{FEATURE_4_EMOTION}} |
| **Proof point** | {{FEATURE_4_PROOF}} |
| **Marketing copy** | "{{FEATURE_4_COPY}}" |

### Feature 5: {{FEATURE_5_NAME}}

| Layer | Content |
|-------|---------|
| **Feature** | {{FEATURE_5_DESCRIPTION}} |
| **Advantage** | {{FEATURE_5_ADVANTAGE}} |
| **Benefit** | {{FEATURE_5_BENEFIT}} |
| **Emotional payoff** | {{FEATURE_5_EMOTION}} |
| **Proof point** | {{FEATURE_5_PROOF}} |
| **Marketing copy** | "{{FEATURE_5_COPY}}" |

**Template for additional features -- copy and fill:**

```markdown
### Feature N: {{FEATURE_N_NAME}}

| Layer | Content |
|-------|---------|
| **Feature** | What it does technically |
| **Advantage** | Why that capability matters (compared to alternatives) |
| **Benefit** | What the customer gets from it (in their language) |
| **Emotional payoff** | How it makes them feel |
| **Proof point** | Data, testimonial, case study, or demo that proves it |
| **Marketing copy** | One sentence ready for a landing page |
```

---

## 6. Quantified Value Statements

Numbers are more persuasive than adjectives. Quantify your value wherever possible.

### Time Savings

| Task | Without {{PROJECT_NAME}} | With {{PROJECT_NAME}} | Time Saved | Statement |
|------|--------------------------|------------------------|------------|-----------|
| {{TASK_1}} | {{TIME_WITHOUT_1}} | {{TIME_WITH_1}} | {{TIME_SAVED_1}} | "Save {{TIME_SAVED_1}} on {{TASK_1}} every {{PERIOD_1}}" |
| {{TASK_2}} | {{TIME_WITHOUT_2}} | {{TIME_WITH_2}} | {{TIME_SAVED_2}} | "Save {{TIME_SAVED_2}} on {{TASK_2}} every {{PERIOD_2}}" |
| {{TASK_3}} | {{TIME_WITHOUT_3}} | {{TIME_WITH_3}} | {{TIME_SAVED_3}} | "Save {{TIME_SAVED_3}} on {{TASK_3}} every {{PERIOD_3}}" |

### Cost Reduction

| Cost Area | Without {{PROJECT_NAME}} | With {{PROJECT_NAME}} | Savings | Statement |
|-----------|--------------------------|------------------------|---------|-----------|
| {{COST_AREA_1}} | {{COST_WITHOUT_1}} | {{COST_WITH_1}} | {{COST_SAVED_1}} | "Reduce {{COST_AREA_1}} costs by {{COST_PERCENTAGE_1}}%" |
| {{COST_AREA_2}} | {{COST_WITHOUT_2}} | {{COST_WITH_2}} | {{COST_SAVED_2}} | "Reduce {{COST_AREA_2}} costs by {{COST_PERCENTAGE_2}}%" |

### Performance Improvement

| Metric | Before | After | Improvement | Statement |
|--------|--------|-------|-------------|-----------|
| {{METRIC_1}} | {{BEFORE_METRIC_1}} | {{AFTER_METRIC_1}} | {{IMPROVEMENT_1}} | "Improve {{METRIC_1}} by {{IMPROVEMENT_1}}" |
| {{METRIC_2}} | {{BEFORE_METRIC_2}} | {{AFTER_METRIC_2}} | {{IMPROVEMENT_2}} | "Improve {{METRIC_2}} by {{IMPROVEMENT_2}}" |

### ROI Statement

> **For every $1 spent on {{PROJECT_NAME}}, customers see ${{ROI_MULTIPLIER}} in return through {{ROI_MECHANISM}}.**

**How to calculate your ROI:**
1. Monthly cost of {{PROJECT_NAME}}: ${{MONTHLY_COST}}
2. Monthly value delivered (time savings + cost reduction + revenue increase): ${{MONTHLY_VALUE}}
3. ROI = (Value - Cost) / Cost x 100 = {{ROI_PERCENTAGE}}%
4. Payback period: {{PAYBACK_PERIOD}}

### Value Statement Library

Ready-to-use quantified statements for marketing copy:

1. "{{PROJECT_NAME}} saves teams an average of {{HOURS_SAVED}} hours per {{TIME_PERIOD}}."
2. "Reduce {{PAIN_METRIC}} by {{REDUCTION_PERCENTAGE}}% in your first {{ONBOARDING_PERIOD}}."
3. "{{CUSTOMER_COUNT}}+ {{CUSTOMER_TYPE}} trust {{PROJECT_NAME}} to {{CORE_ACTION}}."
4. "Go from {{START_STATE}} to {{END_STATE}} in {{TIME_TO_VALUE}}."
5. "{{PROJECT_NAME}} customers report {{SATISFACTION_METRIC}}% satisfaction with {{SPECIFIC_AREA}}."

---

## 7. Emotional vs Rational Value Balance

Different audiences and buying stages respond to different value types. Map your value across both dimensions.

### Value Balance Matrix

| Value Type | Rational (Logic) | Emotional (Feeling) |
|-----------|------------------|---------------------|
| **Primary** | {{RATIONAL_PRIMARY}} | {{EMOTIONAL_PRIMARY}} |
| **Secondary** | {{RATIONAL_SECONDARY}} | {{EMOTIONAL_SECONDARY}} |
| **Tertiary** | {{RATIONAL_TERTIARY}} | {{EMOTIONAL_TERTIARY}} |

### When to Lead Rational vs Emotional

| Situation | Lead With | Support With | Example |
|-----------|-----------|-------------|---------|
| **First impression** (ads, social) | Emotional | Rational | "Stop dreading Mondays" (then: "automate 80% of your reporting") |
| **Consideration** (landing page) | Balanced | Both | "Take control of your data pipeline. 3x faster processing, zero config." |
| **Evaluation** (comparison page) | Rational | Emotional | Feature table + "Join 5,000 teams who sleep better at night" |
| **Decision** (pricing page) | Rational | Emotional | Clear pricing + "Risk-free for 14 days" |
| **Onboarding** (welcome flow) | Emotional | Rational | "Welcome! You made a great choice." + quick setup stats |
| **Retention** (in-product) | Balanced | Both | Achievement metrics + "You crushed it this week" |

### Emotional Value by Buyer Role

| Role | Primary Emotion | How We Trigger It |
|------|----------------|-------------------|
| **End user** | Relief, delight, empowerment | Instant results, beautiful UX, "aha" moments |
| **Manager/buyer** | Confidence, pride, security | Case studies, ROI data, team adoption metrics |
| **Executive sponsor** | Control, vision, risk reduction | Executive summaries, compliance, strategic alignment |
| **Technical evaluator** | Trust, respect, competence | Documentation quality, architecture transparency, honest limitations |

---

## 8. Before/After Scenarios

Use these for landing pages, ads, case studies, and sales conversations. Each scenario shows the transformation {{PROJECT_NAME}} creates.

### Scenario 1: {{SCENARIO_1_NAME}}

| Dimension | Before {{PROJECT_NAME}} | After {{PROJECT_NAME}} |
|-----------|------------------------|------------------------|
| **Daily reality** | {{BEFORE_DAILY_1}} | {{AFTER_DAILY_1}} |
| **Time spent** | {{BEFORE_TIME_1}} | {{AFTER_TIME_1}} |
| **Feeling** | {{BEFORE_FEELING_1}} | {{AFTER_FEELING_1}} |
| **Outcome quality** | {{BEFORE_QUALITY_1}} | {{AFTER_QUALITY_1}} |
| **Team impact** | {{BEFORE_TEAM_1}} | {{AFTER_TEAM_1}} |

**Marketing copy version:**
> "Before {{PROJECT_NAME}}, {{BEFORE_NARRATIVE_1}}. Now, {{AFTER_NARRATIVE_1}}."

### Scenario 2: {{SCENARIO_2_NAME}}

| Dimension | Before {{PROJECT_NAME}} | After {{PROJECT_NAME}} |
|-----------|------------------------|------------------------|
| **Daily reality** | {{BEFORE_DAILY_2}} | {{AFTER_DAILY_2}} |
| **Time spent** | {{BEFORE_TIME_2}} | {{AFTER_TIME_2}} |
| **Feeling** | {{BEFORE_FEELING_2}} | {{AFTER_FEELING_2}} |
| **Outcome quality** | {{BEFORE_QUALITY_2}} | {{AFTER_QUALITY_2}} |
| **Team impact** | {{BEFORE_TEAM_2}} | {{AFTER_TEAM_2}} |

**Marketing copy version:**
> "Before {{PROJECT_NAME}}, {{BEFORE_NARRATIVE_2}}. Now, {{AFTER_NARRATIVE_2}}."

### Scenario 3: {{SCENARIO_3_NAME}}

| Dimension | Before {{PROJECT_NAME}} | After {{PROJECT_NAME}} |
|-----------|------------------------|------------------------|
| **Daily reality** | {{BEFORE_DAILY_3}} | {{AFTER_DAILY_3}} |
| **Time spent** | {{BEFORE_TIME_3}} | {{AFTER_TIME_3}} |
| **Feeling** | {{BEFORE_FEELING_3}} | {{AFTER_FEELING_3}} |
| **Outcome quality** | {{BEFORE_QUALITY_3}} | {{AFTER_QUALITY_3}} |
| **Team impact** | {{BEFORE_TEAM_3}} | {{AFTER_TEAM_3}} |

**Marketing copy version:**
> "Before {{PROJECT_NAME}}, {{BEFORE_NARRATIVE_3}}. Now, {{AFTER_NARRATIVE_3}}."

### Before/After Copy Templates

Use these formulae to generate before/after copy for any scenario:

1. **The Transformation:** "Stop [painful activity]. Start [desired outcome]."
2. **The Comparison:** "You used to [old way]. Now you [new way]."
3. **The Time Machine:** "Imagine if [desired state]. That's what {{PROJECT_NAME}} delivers."
4. **The Contrast:** "[Bad stat] without us. [Good stat] with us."
5. **The Relief:** "No more [pain]. Just [gain]."
6. **The Upgrade:** "From [current state] to [aspirational state] in [time period]."

---

## 9. Value Proposition Testing

Your value proposition is a hypothesis until validated by real customers. Use this framework to test and refine.

### Testing Methods

| Method | What It Tests | Sample Size | Timeline | Cost |
|--------|--------------|-------------|----------|------|
| **A/B headline test** | Which framing resonates | 1,000+ visitors | 1-2 weeks | Free (your traffic) |
| **Landing page test** | Full proposition appeal | 500+ visitors | 2-4 weeks | Free-$500 |
| **Customer interviews** | Deep understanding | 5-10 people | 1-2 weeks | Free-$500 |
| **Survey** | Broad validation | 50-200 people | 1 week | Free-$200 |
| **Ad copy test** | Message-market fit | 5,000+ impressions | 3-7 days | $100-$500 |
| **Sales call testing** | Conversion impact | 20+ calls | 2-4 weeks | Free |

### Testing Scorecard

| Value Proposition Version | Channel Tested | Metric | Result | Winner? |
|---------------------------|---------------|--------|--------|---------|
| {{VP_VERSION_A}} | {{CHANNEL_A}} | {{METRIC_A}} | {{RESULT_A}} | |
| {{VP_VERSION_B}} | {{CHANNEL_B}} | {{METRIC_B}} | {{RESULT_B}} | |
| {{VP_VERSION_C}} | {{CHANNEL_C}} | {{METRIC_C}} | {{RESULT_C}} | |

### Interview Questions for Validation

Ask these to potential or existing customers:

1. "In your own words, what does {{PROJECT_NAME}} do?"
2. "What problem were you trying to solve when you found us?"
3. "What would you use if {{PROJECT_NAME}} did not exist?"
4. "What is the single biggest benefit you get from {{PROJECT_NAME}}?"
5. "How would you explain {{PROJECT_NAME}} to a colleague?"
6. "What almost stopped you from signing up?"
7. "If {{PROJECT_NAME}} disappeared tomorrow, what would you miss most?"

The answers to these questions ARE your value proposition -- in your customers' language.

---

## Appendix: Value Proposition Canvas Visual

```
+-------------------------------+    +-------------------------------+
|        CUSTOMER PROFILE       |    |          VALUE MAP            |
|                               |    |                               |
|  +----------+  +-----------+  |    |  +-----------+  +----------+ |
|  |   GAINS  |  |   JOBS    |  |    |  |   GAIN    |  | PRODUCTS | |
|  | (desired |  | (tasks to |  | <= |  | CREATORS  |  |    &     | |
|  | outcomes)|  | complete) |  | FIT|  | (how you  |  | SERVICES | |
|  +----------+  +-----------+  | => |  |  deliver) |  |          | |
|  +-----------+                |    |  +-----------+  +----------+ |
|  |   PAINS   |                |    |  +-----------+               |
|  | (frustra- |                |    |  |   PAIN    |               |
|  |  tions)   |                |    |  | RELIEVERS |               |
|  +-----------+                |    |  +-----------+               |
+-------------------------------+    +-------------------------------+
```

**The goal is FIT:** Every significant pain has a reliever. Every important gain has a creator. The strongest fits become your headline messages.

---

*This value proposition canvas is part of the {{PROJECT_NAME}} Master Starter Kit. Revisit this canvas whenever you pivot, add features, or enter a new market segment.*
