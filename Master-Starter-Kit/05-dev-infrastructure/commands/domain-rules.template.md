# /domain-rules $ARGUMENT

Look up business rules for a specific domain topic in the project documentation.

## Configuration

Before using this command, set these values for your project:

- **{{DOMAIN}}**: Your business domain (e.g., "NEMT", "e-commerce", "SaaS", "healthcare")
- **{{DOCS_PATH}}**: Path to your docs folder (e.g., `docs/`)
- **{{TOPIC_LIST}}**: Available topics (e.g., "trips, billing, dispatch, drivers, vehicles, facilities, compliance, scheduling, routing")

## Steps

1. **Validate the topic**: Check that `$ARGUMENT` matches one of the documented topics.

   Available topics for {{DOMAIN}}:
   ```
   {TOPIC_LIST}
   ```

   If `$ARGUMENT` doesn't match any topic, list available topics and ask the user to pick one.

2. **Read the domain rules documentation**:
   ```
   {DOCS_PATH}/domain-rules/$ARGUMENT.md
   ```
   If no dedicated file exists, search for the topic across all docs:
   ```bash
   grep -rl "$ARGUMENT" {DOCS_PATH}/ --include="*.md" | head -10
   ```

3. **Extract and organize** the following information:

   ### State Transitions
   What states can this entity be in? What transitions are allowed?
   ```
   Example: Trip states
   scheduled → dispatched → in_progress → completed
   scheduled → cancelled
   in_progress → no_show
   ```
   - List every valid state
   - List every valid transition (from → to)
   - Note which transitions require specific roles (e.g., only admin can cancel after dispatch)

   ### Business Formulas
   Any calculations or formulas used in this domain area:
   ```
   Example: Billing formulas
   base_fare = rate_per_mile * distance_miles
   total_fare = base_fare + wait_time_charges + tolls + surcharges
   driver_pay = total_fare * driver_pay_percentage
   ```
   - List every formula with variable definitions
   - Note rounding rules (round to cents, round up/down)
   - Note any minimum/maximum constraints

   ### Compliance Notes
   Regulatory requirements, industry standards, or legal constraints:
   ```
   Example: NEMT compliance
   - Driver must have valid CDL
   - Vehicle inspection required every 6 months
   - Trip records retained for 7 years
   - PHI data encrypted at rest
   ```
   - List every compliance requirement
   - Note the source regulation (HIPAA, DOT, state law, etc.)
   - Flag anything that affects data model or API design

   ### Edge Cases
   Known edge cases, exceptions, and special handling:
   ```
   Example: Trip edge cases
   - Round trip: two separate trip records linked by round_trip_id
   - Multi-stop: ordered stops array, each with address and wait time
   - Cancelled after pickup: charge cancellation fee + partial fare
   - No-show: charge full fare, driver gets paid
   ```
   - List every known edge case
   - Describe the expected system behavior for each
   - Note any that are not yet implemented

   ### Implementation Guidance
   How these rules translate to code:
   ```
   Example:
   - State transitions: enforce via a state machine in the router (validate current → next)
   - Fare calculation: pure function in packages/validators/src/fare.ts
   - Compliance: validation middleware on create/update mutations
   - PHI fields: encrypted at rest, audit log on access
   ```
   - Map each rule to a specific code location or pattern
   - Note which rules are enforced in the database (constraints, triggers) vs application code (validation, middleware)

4. **Output the domain rules summary**:

   ```
   DOMAIN RULES: {DOMAIN} - $ARGUMENT
   =====================================

   State Transitions:
   {state diagram or list}

   Business Formulas:
   {formulas with explanations}

   Compliance Notes:
   {regulatory requirements}

   Edge Cases:
   {numbered list with handling}

   Implementation Guidance:
   {code-level recommendations}

   Source Documents:
   {list of docs that were read}
   ```

## Notes

- This command is read-only. It summarizes existing documentation; it does not generate or modify code.
- If documentation is incomplete for a topic, note what's missing and suggest the user document it.
- Domain rules should be the single source of truth. If code contradicts documented rules, flag the discrepancy.
- For new projects, create `{{DOCS_PATH}}/domain-rules/` and add one `.md` file per topic before using this command.
