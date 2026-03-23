# State Machines — {{DOMAIN_GROUP}} — {{PROJECT_NAME}}

Paste the Mermaid blocks below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all `{{PLACEHOLDER}}` values with project-specific data before rendering.

**Grouping convention:** State machines are grouped by domain similarity rather than by service. For example, an "Order Lifecycle" domain group might contain state machines for Order, Payment, and Shipment -- even though these span multiple services. This grouping makes it easier to see how related entities interact and transition together.

---

## State Machine 1: {{ENTITY_1_NAME}}

```mermaid
stateDiagram-v2
    [*] --> {{ENTITY_1_STATE_1}}

    state {{ENTITY_1_STATE_1}} {
        [*] --> {{ENTITY_1_SUBSTATE_1A}}
        {{ENTITY_1_SUBSTATE_1A}} --> {{ENTITY_1_SUBSTATE_1B}}: {{ENTITY_1_SUBSTRANSITION_1}}
        {{ENTITY_1_SUBSTATE_1B}} --> [*]
    }

    {{ENTITY_1_STATE_1}} --> {{ENTITY_1_STATE_2}}: {{ENTITY_1_EVENT_1}} [{{ENTITY_1_GUARD_1}}]
    {{ENTITY_1_STATE_1}} --> {{ENTITY_1_STATE_REJECTED}}: {{ENTITY_1_REJECT_EVENT}} [{{ENTITY_1_REJECT_GUARD}}]

    {{ENTITY_1_STATE_2}} --> {{ENTITY_1_STATE_3}}: {{ENTITY_1_EVENT_2}} [{{ENTITY_1_GUARD_2}}]
    {{ENTITY_1_STATE_2}} --> {{ENTITY_1_STATE_1}}: {{ENTITY_1_RETURN_EVENT}}

    state {{ENTITY_1_STATE_3}} {
        [*] --> {{ENTITY_1_SUBSTATE_3A}}
        {{ENTITY_1_SUBSTATE_3A}} --> {{ENTITY_1_SUBSTATE_3B}}: {{ENTITY_1_SUBSTRANSITION_3}}
        {{ENTITY_1_SUBSTATE_3B}} --> [*]
    }

    {{ENTITY_1_STATE_3}} --> {{ENTITY_1_STATE_4}}: {{ENTITY_1_EVENT_3}}
    {{ENTITY_1_STATE_3}} --> {{ENTITY_1_STATE_FAILED}}: {{ENTITY_1_FAIL_EVENT}} [{{ENTITY_1_FAIL_GUARD}}]

    {{ENTITY_1_STATE_4}} --> {{ENTITY_1_STATE_5}}: {{ENTITY_1_EVENT_4}}
    {{ENTITY_1_STATE_4}} --> {{ENTITY_1_STATE_3}}: {{ENTITY_1_RETRY_EVENT}} [{{ENTITY_1_RETRY_GUARD}}]

    {{ENTITY_1_STATE_5}} --> [*]

    {{ENTITY_1_STATE_REJECTED}} --> [*]
    {{ENTITY_1_STATE_FAILED}} --> {{ENTITY_1_STATE_3}}: {{ENTITY_1_RETRY_EVENT}}
    {{ENTITY_1_STATE_FAILED}} --> [*]: {{ENTITY_1_ABANDON_EVENT}}

    note right of {{ENTITY_1_STATE_1}}
        Entry: {{ENTITY_1_STATE_1_ENTRY_ACTION}}
        Exit: {{ENTITY_1_STATE_1_EXIT_ACTION}}
    end note

    note right of {{ENTITY_1_STATE_3}}
        Entry: {{ENTITY_1_STATE_3_ENTRY_ACTION}}
        Exit: {{ENTITY_1_STATE_3_EXIT_ACTION}}
    end note

    note right of {{ENTITY_1_STATE_5}}
        Entry: {{ENTITY_1_STATE_5_ENTRY_ACTION}}
        This is a terminal state.
    end note
```

---

## State Machine 2: {{ENTITY_2_NAME}}

```mermaid
stateDiagram-v2
    [*] --> {{ENTITY_2_STATE_1}}

    {{ENTITY_2_STATE_1}} --> {{ENTITY_2_STATE_2}}: {{ENTITY_2_EVENT_1}} [{{ENTITY_2_GUARD_1}}]
    {{ENTITY_2_STATE_1}} --> {{ENTITY_2_STATE_CANCELLED}}: {{ENTITY_2_CANCEL_EVENT}}

    {{ENTITY_2_STATE_2}} --> {{ENTITY_2_STATE_3}}: {{ENTITY_2_EVENT_2}}
    {{ENTITY_2_STATE_2}} --> {{ENTITY_2_STATE_1}}: {{ENTITY_2_RETURN_EVENT}} [{{ENTITY_2_RETURN_GUARD}}]
    {{ENTITY_2_STATE_2}} --> {{ENTITY_2_STATE_CANCELLED}}: {{ENTITY_2_CANCEL_EVENT}}

    state {{ENTITY_2_STATE_3}} {
        [*] --> {{ENTITY_2_SUBSTATE_3A}}
        {{ENTITY_2_SUBSTATE_3A}} --> {{ENTITY_2_SUBSTATE_3B}}: {{ENTITY_2_SUBSTRANSITION_3A}}
        {{ENTITY_2_SUBSTATE_3B}} --> {{ENTITY_2_SUBSTATE_3C}}: {{ENTITY_2_SUBSTRANSITION_3B}}
        {{ENTITY_2_SUBSTATE_3C}} --> [*]
    }

    {{ENTITY_2_STATE_3}} --> {{ENTITY_2_STATE_4}}: {{ENTITY_2_EVENT_3}} [{{ENTITY_2_GUARD_3}}]
    {{ENTITY_2_STATE_3}} --> {{ENTITY_2_STATE_FAILED}}: {{ENTITY_2_FAIL_EVENT}}

    {{ENTITY_2_STATE_4}} --> {{ENTITY_2_STATE_5}}: {{ENTITY_2_EVENT_4}}
    {{ENTITY_2_STATE_5}} --> [*]

    {{ENTITY_2_STATE_CANCELLED}} --> [*]
    {{ENTITY_2_STATE_FAILED}} --> {{ENTITY_2_STATE_2}}: {{ENTITY_2_RETRY_EVENT}}
    {{ENTITY_2_STATE_FAILED}} --> [*]: {{ENTITY_2_ABANDON_EVENT}}

    note right of {{ENTITY_2_STATE_1}}
        Entry: {{ENTITY_2_STATE_1_ENTRY_ACTION}}
    end note

    note right of {{ENTITY_2_STATE_4}}
        Entry: {{ENTITY_2_STATE_4_ENTRY_ACTION}}
        Exit: {{ENTITY_2_STATE_4_EXIT_ACTION}}
    end note
```

---

## State Machine 3: {{ENTITY_3_NAME}}

```mermaid
stateDiagram-v2
    [*] --> {{ENTITY_3_STATE_1}}

    {{ENTITY_3_STATE_1}} --> {{ENTITY_3_STATE_2}}: {{ENTITY_3_EVENT_1}}
    {{ENTITY_3_STATE_1}} --> {{ENTITY_3_STATE_EXPIRED}}: {{ENTITY_3_EXPIRE_EVENT}} [{{ENTITY_3_EXPIRE_GUARD}}]

    {{ENTITY_3_STATE_2}} --> {{ENTITY_3_STATE_3}}: {{ENTITY_3_EVENT_2}} [{{ENTITY_3_GUARD_2}}]
    {{ENTITY_3_STATE_2}} --> {{ENTITY_3_STATE_1}}: {{ENTITY_3_RETURN_EVENT}}

    {{ENTITY_3_STATE_3}} --> {{ENTITY_3_STATE_4}}: {{ENTITY_3_EVENT_3}}
    {{ENTITY_3_STATE_3}} --> {{ENTITY_3_STATE_FAILED}}: {{ENTITY_3_FAIL_EVENT}}

    {{ENTITY_3_STATE_4}} --> [*]
    {{ENTITY_3_STATE_EXPIRED}} --> [*]
    {{ENTITY_3_STATE_FAILED}} --> {{ENTITY_3_STATE_2}}: {{ENTITY_3_RETRY_EVENT}}
    {{ENTITY_3_STATE_FAILED}} --> [*]: {{ENTITY_3_ABANDON_EVENT}}

    note right of {{ENTITY_3_STATE_1}}
        Entry: {{ENTITY_3_STATE_1_ENTRY_ACTION}}
    end note

    note right of {{ENTITY_3_STATE_4}}
        Terminal state.
        Entry: {{ENTITY_3_STATE_4_ENTRY_ACTION}}
    end note
```

---

## State Transition Tables

### {{ENTITY_1_NAME}} Transitions

| Current State | Event | Guard | Next State | Side Effects |
|--------------|-------|-------|------------|-------------|
| -- (initial) | create | -- | {{ENTITY_1_STATE_1}} | {{ENTITY_1_STATE_1_ENTRY_ACTION}} |
| {{ENTITY_1_STATE_1}} | {{ENTITY_1_EVENT_1}} | {{ENTITY_1_GUARD_1}} | {{ENTITY_1_STATE_2}} | {{ENTITY_1_SIDE_EFFECT_1}} |
| {{ENTITY_1_STATE_1}} | {{ENTITY_1_REJECT_EVENT}} | {{ENTITY_1_REJECT_GUARD}} | {{ENTITY_1_STATE_REJECTED}} | {{ENTITY_1_REJECT_SIDE_EFFECT}} |
| {{ENTITY_1_STATE_2}} | {{ENTITY_1_EVENT_2}} | {{ENTITY_1_GUARD_2}} | {{ENTITY_1_STATE_3}} | {{ENTITY_1_SIDE_EFFECT_2}} |
| {{ENTITY_1_STATE_2}} | {{ENTITY_1_RETURN_EVENT}} | -- | {{ENTITY_1_STATE_1}} | {{ENTITY_1_RETURN_SIDE_EFFECT}} |
| {{ENTITY_1_STATE_3}} | {{ENTITY_1_EVENT_3}} | -- | {{ENTITY_1_STATE_4}} | {{ENTITY_1_SIDE_EFFECT_3}} |
| {{ENTITY_1_STATE_3}} | {{ENTITY_1_FAIL_EVENT}} | {{ENTITY_1_FAIL_GUARD}} | {{ENTITY_1_STATE_FAILED}} | {{ENTITY_1_FAIL_SIDE_EFFECT}} |
| {{ENTITY_1_STATE_4}} | {{ENTITY_1_EVENT_4}} | -- | {{ENTITY_1_STATE_5}} | {{ENTITY_1_SIDE_EFFECT_4}} |
| {{ENTITY_1_STATE_4}} | {{ENTITY_1_RETRY_EVENT}} | {{ENTITY_1_RETRY_GUARD}} | {{ENTITY_1_STATE_3}} | {{ENTITY_1_RETRY_SIDE_EFFECT}} |
| {{ENTITY_1_STATE_FAILED}} | {{ENTITY_1_RETRY_EVENT}} | -- | {{ENTITY_1_STATE_3}} | {{ENTITY_1_RETRY_SIDE_EFFECT}} |
| {{ENTITY_1_STATE_FAILED}} | {{ENTITY_1_ABANDON_EVENT}} | -- | (terminal) | {{ENTITY_1_ABANDON_SIDE_EFFECT}} |

### {{ENTITY_2_NAME}} Transitions

| Current State | Event | Guard | Next State | Side Effects |
|--------------|-------|-------|------------|-------------|
| -- (initial) | create | -- | {{ENTITY_2_STATE_1}} | {{ENTITY_2_STATE_1_ENTRY_ACTION}} |
| {{ENTITY_2_STATE_1}} | {{ENTITY_2_EVENT_1}} | {{ENTITY_2_GUARD_1}} | {{ENTITY_2_STATE_2}} | {{ENTITY_2_SIDE_EFFECT_1}} |
| {{ENTITY_2_STATE_1}} | {{ENTITY_2_CANCEL_EVENT}} | -- | {{ENTITY_2_STATE_CANCELLED}} | {{ENTITY_2_CANCEL_SIDE_EFFECT}} |
| {{ENTITY_2_STATE_2}} | {{ENTITY_2_EVENT_2}} | -- | {{ENTITY_2_STATE_3}} | {{ENTITY_2_SIDE_EFFECT_2}} |
| {{ENTITY_2_STATE_2}} | {{ENTITY_2_RETURN_EVENT}} | {{ENTITY_2_RETURN_GUARD}} | {{ENTITY_2_STATE_1}} | {{ENTITY_2_RETURN_SIDE_EFFECT}} |
| {{ENTITY_2_STATE_2}} | {{ENTITY_2_CANCEL_EVENT}} | -- | {{ENTITY_2_STATE_CANCELLED}} | {{ENTITY_2_CANCEL_SIDE_EFFECT}} |
| {{ENTITY_2_STATE_3}} | {{ENTITY_2_EVENT_3}} | {{ENTITY_2_GUARD_3}} | {{ENTITY_2_STATE_4}} | {{ENTITY_2_SIDE_EFFECT_3}} |
| {{ENTITY_2_STATE_3}} | {{ENTITY_2_FAIL_EVENT}} | -- | {{ENTITY_2_STATE_FAILED}} | {{ENTITY_2_FAIL_SIDE_EFFECT}} |
| {{ENTITY_2_STATE_4}} | {{ENTITY_2_EVENT_4}} | -- | {{ENTITY_2_STATE_5}} | {{ENTITY_2_SIDE_EFFECT_4}} |
| {{ENTITY_2_STATE_FAILED}} | {{ENTITY_2_RETRY_EVENT}} | -- | {{ENTITY_2_STATE_2}} | {{ENTITY_2_RETRY_SIDE_EFFECT}} |
| {{ENTITY_2_STATE_FAILED}} | {{ENTITY_2_ABANDON_EVENT}} | -- | (terminal) | {{ENTITY_2_ABANDON_SIDE_EFFECT}} |

### {{ENTITY_3_NAME}} Transitions

| Current State | Event | Guard | Next State | Side Effects |
|--------------|-------|-------|------------|-------------|
| -- (initial) | create | -- | {{ENTITY_3_STATE_1}} | {{ENTITY_3_STATE_1_ENTRY_ACTION}} |
| {{ENTITY_3_STATE_1}} | {{ENTITY_3_EVENT_1}} | -- | {{ENTITY_3_STATE_2}} | {{ENTITY_3_SIDE_EFFECT_1}} |
| {{ENTITY_3_STATE_1}} | {{ENTITY_3_EXPIRE_EVENT}} | {{ENTITY_3_EXPIRE_GUARD}} | {{ENTITY_3_STATE_EXPIRED}} | {{ENTITY_3_EXPIRE_SIDE_EFFECT}} |
| {{ENTITY_3_STATE_2}} | {{ENTITY_3_EVENT_2}} | {{ENTITY_3_GUARD_2}} | {{ENTITY_3_STATE_3}} | {{ENTITY_3_SIDE_EFFECT_2}} |
| {{ENTITY_3_STATE_2}} | {{ENTITY_3_RETURN_EVENT}} | -- | {{ENTITY_3_STATE_1}} | {{ENTITY_3_RETURN_SIDE_EFFECT}} |
| {{ENTITY_3_STATE_3}} | {{ENTITY_3_EVENT_3}} | -- | {{ENTITY_3_STATE_4}} | {{ENTITY_3_SIDE_EFFECT_3}} |
| {{ENTITY_3_STATE_3}} | {{ENTITY_3_FAIL_EVENT}} | -- | {{ENTITY_3_STATE_FAILED}} | {{ENTITY_3_FAIL_SIDE_EFFECT}} |
| {{ENTITY_3_STATE_FAILED}} | {{ENTITY_3_RETRY_EVENT}} | -- | {{ENTITY_3_STATE_2}} | {{ENTITY_3_RETRY_SIDE_EFFECT}} |
| {{ENTITY_3_STATE_FAILED}} | {{ENTITY_3_ABANDON_EVENT}} | -- | (terminal) | {{ENTITY_3_ABANDON_SIDE_EFFECT}} |

---

## Domain Group Metadata

| Property | Value |
|----------|-------|
| Domain Group | {{DOMAIN_GROUP}} |
| Entities | {{ENTITY_1_NAME}}, {{ENTITY_2_NAME}}, {{ENTITY_3_NAME}} |
| Total states | {{TOTAL_STATE_COUNT}} |
| Total transitions | {{TOTAL_TRANSITION_COUNT}} |
| Services involved | {{SERVICES_INVOLVED}} |
| Target node count | 40-75 per group |

---

## File Naming Convention

Generate one file per domain group using this naming pattern:

```
sm-{domain-group}.md
```

**Examples:**
- `sm-order-lifecycle.md` (Order, Payment, Shipment)
- `sm-user-account.md` (User, Subscription, Session)
- `sm-content-publishing.md` (Draft, Review, Publication)
- `sm-support-ticket.md` (Ticket, Assignment, Resolution)

Replace `{domain-group}` with the kebab-case domain group name. Group entities by domain similarity: entities that frequently transition together or whose states affect each other belong in the same file.

---

## Instructions

1. Copy this template once per domain group in your project.
2. Replace all `{{PLACEHOLDER}}` values with entity-specific states, events, guards, and actions from service specs.
3. Adjust the number of state machines per file (2-3 is typical). If a domain group has only 1 entity, it can stand alone.
4. Composite (nested) states are used when a state has internal sub-steps. Remove composite states for simpler entities.
5. Every transition should have an event label. Guards (conditions) are optional but recommended for non-trivial transitions.
6. Entry/exit actions in notes describe side effects (send email, update counter, trigger webhook, etc.).
7. Terminal states should be clearly marked. Failed/rejected states should show retry and abandon paths.
8. Update the State Transition Table to match the diagram exactly -- the table is the source of truth for implementation.
9. Target 40-75 nodes per domain group file. If a single entity exceeds 30 states, give it its own file.

---

## Cross-References

- **Workflow diagrams (cross-service flows):** `wf-workflow.template.md`
- **Service feature maps:** `svc-feature-map.template.md`
- **System architecture:** `system-architecture-flowchart.template.md`
- **MASTER mind map:** `MASTER-mind-map-generator.md`
- **Dependency graph:** `dependency-graph.template.md`
- **Data model (tables/columns):** service hub files in `dev_docs/services/`
