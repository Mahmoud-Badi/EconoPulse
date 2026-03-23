# Design System & CI/CD Pipeline Overview — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

```mermaid
flowchart LR
    subgraph DesignSystem["Design System — {{FRONTEND_FRAMEWORK}}"]
        direction LR
        subgraph Tokens["Token Architecture"]
            PRIM_TOKENS["Primitive Tokens<br/>Colors, spacing, typography<br/>raw values"]
            SEM_TOKENS["Semantic Tokens<br/>color-primary, spacing-md<br/>intent-based aliases"]
            COMP_TOKENS["Component Tokens<br/>button-bg, card-radius<br/>component-specific"]

            PRIM_TOKENS -->|"referenced by"| SEM_TOKENS
            SEM_TOKENS -->|"consumed by"| COMP_TOKENS
        end

        subgraph CompLib["Component Library"]
            ATOMS["Atoms<br/>Button, Input, Icon,<br/>Badge, Avatar"]
            MOLECULES["Molecules<br/>FormField, SearchBar,<br/>NavItem, Card"]
            ORGANISMS["Organisms<br/>Header, Sidebar,<br/>DataTable, Modal"]
            TEMPLATES["Templates<br/>PageLayout, DashboardLayout,<br/>AuthLayout"]

            ATOMS -->|"compose into"| MOLECULES
            MOLECULES -->|"compose into"| ORGANISMS
            ORGANISMS -->|"compose into"| TEMPLATES
        end

        subgraph ThemeProvider["Theme Provider"]
            THEME_DEF["Theme Definition<br/>{{THEME_STRATEGY}}"]
            LIGHT["Light Theme"]
            DARK["Dark Theme"]
            CUSTOM["Custom Theme<br/>{{CUSTOM_THEME_NAME}}"]

            THEME_DEF --> LIGHT
            THEME_DEF --> DARK
            THEME_DEF --> CUSTOM
        end

        COMP_TOKENS -->|"feeds"| ATOMS
        THEME_DEF -->|"overrides tokens"| COMP_TOKENS
    end

    subgraph ConsumingApps["Consuming Applications"]
        APP_1["{{APP_1_NAME}}<br/>{{APP_1_FRAMEWORK}}"]
        APP_2["{{APP_2_NAME}}<br/>{{APP_2_FRAMEWORK}}"]
        APP_N["{{APP_N_NAME}}<br/>{{APP_N_FRAMEWORK}}"]
    end

    TEMPLATES -->|"installed via<br/>{{PACKAGE_MANAGER}}"| APP_1
    TEMPLATES -->|"installed via<br/>{{PACKAGE_MANAGER}}"| APP_2
    TEMPLATES -->|"installed via<br/>{{PACKAGE_MANAGER}}"| APP_N
```

```mermaid
flowchart LR
    subgraph CICD["CI/CD Pipeline — {{CI_TOOL}}"]
        COMMIT["Commit<br/>Push to {{BRANCH_STRATEGY}}"]
        LINT["Lint<br/>ESLint + Prettier<br/>~{{LINT_DURATION}}"]
        TYPE_CHECK["Type Check<br/>TypeScript tsc<br/>~{{TYPE_CHECK_DURATION}}"]
        UNIT_TEST["Unit Tests<br/>{{TEST_FRAMEWORK}}<br/>~{{UNIT_TEST_DURATION}}"]
        BUILD["Build<br/>{{BUILD_TOOL}}<br/>~{{BUILD_DURATION}}"]
        DEPLOY["Deploy<br/>{{DEPLOY_TARGET}}<br/>~{{DEPLOY_DURATION}}"]

        COMMIT --> LINT
        LINT -->|"pass"| TYPE_CHECK
        TYPE_CHECK -->|"pass"| UNIT_TEST
        UNIT_TEST -->|"pass"| BUILD
        BUILD -->|"pass"| DEPLOY

        %% Failure paths
        LINT -->|"fail"| BLOCK_1["Block Merge"]
        TYPE_CHECK -->|"fail"| BLOCK_2["Block Merge"]
        UNIT_TEST -->|"fail"| BLOCK_3["Block Merge"]
        BUILD -->|"fail"| BLOCK_4["Block Merge"]

        %% Gates
        GATE_1{{"Gate: Coverage<br/>>= {{MIN_COVERAGE}}%"}}
        GATE_2{{"Gate: Bundle Size<br/><= {{MAX_BUNDLE_SIZE}}"}}

        UNIT_TEST --> GATE_1
        GATE_1 -->|"pass"| BUILD
        BUILD --> GATE_2
        GATE_2 -->|"pass"| DEPLOY
    end

    style BLOCK_1 fill:#F44336,color:#fff
    style BLOCK_2 fill:#F44336,color:#fff
    style BLOCK_3 fill:#F44336,color:#fff
    style BLOCK_4 fill:#F44336,color:#fff
    style GATE_1 fill:#FF9800,color:#fff
    style GATE_2 fill:#FF9800,color:#fff
    style DEPLOY fill:#4CAF50,color:#fff
```

---

## Design Token Categories

| Category | Primitive Example | Semantic Alias | Component Usage | Format |
|---|---|---|---|---|
| Color | `blue-500: #2196F3` | `color-primary: blue-500` | `button-bg: color-primary` | CSS custom properties |
| Spacing | `space-4: 16px` | `spacing-md: space-4` | `card-padding: spacing-md` | rem / px |
| Typography | `font-size-16: 1rem` | `text-body: font-size-16` | `input-font: text-body` | rem |
| Border Radius | `radius-4: 4px` | `radius-md: radius-4` | `card-radius: radius-md` | px |
| Shadow | `shadow-2: 0 2px 4px...` | `shadow-card: shadow-2` | `card-shadow: shadow-card` | CSS box-shadow |
| Breakpoint | `bp-768: 768px` | `screen-md: bp-768` | Media query threshold | px |
| Z-Index | `z-100: 100` | `z-modal: z-100` | `modal-z: z-modal` | unitless |
| Animation | `dur-200: 200ms` | `transition-fast: dur-200` | `button-transition: transition-fast` | ms |

## Pipeline Stage Summary

| Stage | Tool | Estimated Duration | Failure Action | Required to Merge |
|---|---|---|---|---|
| Lint | ESLint + Prettier | ~{{LINT_DURATION}} | Block merge, show inline errors | Yes |
| Type Check | TypeScript (tsc --noEmit) | ~{{TYPE_CHECK_DURATION}} | Block merge, show type errors | Yes |
| Unit Tests | {{TEST_FRAMEWORK}} | ~{{UNIT_TEST_DURATION}} | Block merge, report failures | Yes |
| Coverage Gate | {{TEST_FRAMEWORK}} --coverage | Included in unit tests | Block if < {{MIN_COVERAGE}}% | Yes |
| Build | {{BUILD_TOOL}} | ~{{BUILD_DURATION}} | Block merge, report build errors | Yes |
| Bundle Size Gate | {{BUNDLE_ANALYZER}} | Included in build | Warn if > {{MAX_BUNDLE_SIZE}} | Advisory |
| Deploy | {{DEPLOY_TARGET}} via {{CI_TOOL}} | ~{{DEPLOY_DURATION}} | Alert team, auto-rollback | Yes (for main) |

---

## Cross-References

- **System Architecture:** `system-architecture-flowchart.template.md`
- **CI/CD Pipeline (detailed):** `infra-cicd-pipeline.template.md`
- **Deployment Topology:** `infra-deployment-topology.template.md`
- **Dependency Graph:** `dependency-graph.template.md`
- **Phased Roadmap:** `overview-phased-roadmap.template.md`
