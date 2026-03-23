# Placeholder Registry

> **Total Unique Placeholders:** ~540
> **Pattern:** `{{UPPERCASE_WITH_UNDERSCORES}}` (double curly braces)
> **Resolution:** All placeholders are resolved during ORCHESTRATOR Step 1 (Intake) via conversational Q&A and auto-detection from the codebase.

---

## How Placeholders Work

1. **Auto-detected** — Stack, framework, and path placeholders are inferred from `package.json`, `requirements.txt`, `go.mod`, `Gemfile`, etc.
2. **Asked during intake** — Business-specific values (project name, MVP scope, team size) are gathered conversationally.
3. **Defaulted** — Many have sensible defaults (ports, page sizes, coverage thresholds).
4. **Conditional sections** — Templates use `<!-- IF {{VAR}} == "value" -->...<!-- ENDIF -->` to include/exclude stack-specific content.

---

## Project Identity (12)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `PROJECT_NAME` | Display name | `Fleet Manager` |
| `PROJECT_SLUG` | URL/package-safe name | `fleet-manager` |
| `PROJECT_DESCRIPTION` | One-line description | `SaaS platform for logistics` |
| `PROJECT_LOCAL_PATH` | Absolute path on dev machine | `c:\Users\dev\Projects\fleet-manager` |
| `PROJECT_ROOT` | Root dir (used in commands) | `.` or absolute path |
| `PROJECT_OWNER` | Team or individual owner | `logistics-team` |
| `PROJECT_STAGE` | Current maturity | `mvp` / `growth` / `mature` |
| `GITHUB_ORG` | GitHub organization | `acme-logistics` |
| `REPO_NAME` | GitHub repository name | `Fleet-Manager` |
| `REPO_URL` | Full clone URL | `https://github.com/acme/fleet.git` |
| `START_DATE` | Project start date | `2026-03-01` |
| `TARGET_LAUNCH_DATE` | MVP target date | `2026-06-01` |
| `GOLDEN_RULE_STATEMENT` | Project's north-star principle — echoed at every session boundary | `Every EMS crew trusts this system with their patient's life` |
| `COMPLIANCE_REQUIREMENTS` | Applicable regulatory frameworks | `none` / `hipaa` / `pci` / `gdpr` / `soc2` |
| `PROJECT_SHORT` | Short project identifier (3-6 chars, uppercase) used in kit feedback candidate IDs | `FLEET` |

---

## AI Agent Persona (9)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `AGENT_ARCHETYPE` | Selected archetype from persona decision tree | `saas-cto` / `ecommerce-lead` / `fintech-engineer` / `consumer-app-lead` / `devtools-architect` / `content-platform-lead` / `healthcare-engineer` / `agency-project-lead` |
| `AGENT_IDENTITY_BLOCK` | Generated identity statement with role, project context, and real consequences | *(Multi-line block generated at Step 2.5)* |
| `AGENT_DOMAIN_KNOWLEDGE` | Project-specific domain expertise, terminology, business rules, gotchas | *(Multi-line block generated at Step 2.5)* |
| `AGENT_PRIME_DIRECTIVES` | Non-negotiable behavioral rules with "Why" rationale | *(Multi-line block generated at Step 2.5)* |
| `AGENT_PERSPECTIVE_CHECKS` | Multi-stakeholder viewpoint gates with failure examples | *(Multi-line block generated at Step 2.5)* |
| `AGENT_ANTI_PATTERNS` | Domain-specific "never do this" rules with harm and alternatives | *(Multi-line block generated at Step 2.5)* |
| `PROJECT_STAKES` | What goes wrong when the AI makes mistakes (3-5 concrete consequences) | `A false alert causes a customer to waste $2,000 on unnecessary parts` |
| `ROLE_TITLE` | The AI agent's role title for this project | `Technical Co-Founder and Head of Product` |
| `CONSULTANT_ROLE` | Currently active consultant persona for the current orchestrator phase | `technical-consultant` / `financial-consultant` / `marketing-consultant` |

> **Resolution:** `AGENT_ARCHETYPE` is selected during Step 1 intake based on project type. All other persona placeholders are generated at Step 2.5 (Agent Persona Generation) using the selected archetype as a base, customized with project-specific details from intake answers. `CONSULTANT_ROLE` changes dynamically as the orchestrator progresses through phases.

---

## Stakeholder Communications (10)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `STAKEHOLDER_1_NAME` | First stakeholder name | `Sarah Chen` |
| `STAKEHOLDER_1_ROLE` | First stakeholder role | `CEO` |
| `STAKEHOLDER_1_TYPE` | Audience type | `executive` / `investor` / `client` / `team` |
| `STAKEHOLDER_1_CHANNEL` | Preferred channel | `Email` / `Slack` / `Video Call` |
| `STAKEHOLDER_1_CADENCE` | Update frequency | `weekly` / `bi-weekly` / `monthly` / `quarterly` |
| `STAKEHOLDER_1_CONCERNS` | Primary concerns | `Timeline, budget, feature scope` |
| `COMMS_CADENCE` | Default update frequency | `weekly` / `biweekly` / `sprint-aligned` |
| `PRIMARY_AUDIENCE` | Primary stakeholder type | `executive` / `investor` / `client` / `team` |
| `REPORT_WEEK` | Current report week | `2026-W12` |
| `CURRENT_SPRINT` | Current sprint number | `Sprint 3` |

> **Resolution:** Asked during Step 1.7 (Stakeholder Communication Setup). Stakeholder entries repeat for each stakeholder (STAKEHOLDER_2_*, STAKEHOLDER_3_*, etc.). `REPORT_WEEK` and `CURRENT_SPRINT` are auto-detected at report generation time.

---

## Diagram Generation (35)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `CLOUD_PROVIDER` | Cloud hosting provider | `aws` / `gcp` / `azure` / `vercel` / `railway` |
| `CONTAINER_ORCHESTRATOR` | Container platform | `docker-compose` / `kubernetes` / `ecs` / `none` |
| `CI_TOOL` | CI/CD platform | `github-actions` / `gitlab-ci` / `circleci` / `jenkins` |
| `REGISTRY_PROVIDER` | Container/package registry | `ghcr.io` / `ecr` / `dockerhub` |
| `DEPLOY_TARGET` | Deployment target | `vercel` / `aws-ecs` / `k8s` / `railway` / `fly.io` |
| `CDN_PROVIDER` | CDN service | `cloudflare` / `cloudfront` / `vercel-edge` / `none` |
| `LOG_AGGREGATOR` | Log collection service | `datadog` / `elastic` / `loki` / `cloudwatch` |
| `APM_TOOL` | Application performance monitoring | `datadog-apm` / `newrelic` / `sentry` / `none` |
| `SECRETS_PROVIDER` | Secret management service | `aws-ssm` / `vault` / `doppler` / `vercel-env` |
| `RTO_TARGET` | Recovery time objective | `< 1 hour` / `< 4 hours` / `< 24 hours` |
| `RPO_TARGET` | Recovery point objective | `0 (real-time)` / `< 1 hour` / `< 24 hours` |
| `FAILOVER_REGION` | DR failover region | `us-west-2` / `eu-west-1` / `none` |
| `BACKUP_FREQUENCY` | Database backup frequency | `continuous` / `hourly` / `daily` |
| `ROLE_1` | First role name (repeats: ROLE_2, etc.) | `Super Admin` / `Admin` / `Manager` / `User` / `Guest` |
| `PERMISSION_CATEGORY_1` | Permission group (repeats) | `user-management` / `billing` / `content` / `analytics` |
| `MOBILE_TAB_1` | Mobile tab navigator item (repeats) | `Home` / `Schedule` / `Messages` / `Profile` |
| `MOBILE_SCREEN_1` | Mobile screen name (repeats) | `Dashboard` / `Detail View` / `Edit Form` |
| `VALUE_PROP_1` | Value proposition (repeats) | `Eliminate manual scheduling` |
| `TARGET_MARKET` | Primary target market | `Mid-market healthcare orgs (50-500 employees)` |
| `COMPETITOR_1_NAME` | Competitor name (repeats) | `LegacyCorp` / `ModernApp` / `EnterpriseSuite` |
| `COMPETITOR_1_STRENGTH` | Competitor main strength (repeats) | `Market share` / `Feature depth` / `Price` |
| `MRR_TARGET` | Monthly recurring revenue target | `$50K` / `$100K` / `$500K` |
| `CAC` | Customer acquisition cost | `$2,000` / `$5,000` |
| `LTV` | Customer lifetime value | `$24,000` / `$60,000` |
| `PAYBACK_MONTHS` | CAC payback period | `3` / `6` / `12` |
| `SMALL_CUSTOMER_USERS` | Small customer user count | `10` / `25` |
| `MEDIUM_CUSTOMER_USERS` | Medium customer user count | `50` / `100` |
| `LARGE_CUSTOMER_USERS` | Large customer user count | `250` / `500` |
| `HAS_REALTIME` | Project uses WebSocket/SSE | `true` / `false` |
| `HAS_COMPETITORS` | Competitors identified in Tribunal | `true` / `false` |
| `IS_B2B` | B2B product model | `true` / `false` |
| `HAS_OFFLINE` | Mobile app has offline support | `true` / `false` |
| `IS_MULTI_TENANT` | Multi-tenant architecture | `true` / `false` |
| `INTEGRATION_PHASE_COUNT` | Number of integration phases | `1` / `2` / `3` |
| `GENERATION_DATE` | Diagram generation date | `2026-03-15` |

> **Resolution:** Infrastructure placeholders (`CLOUD_PROVIDER`, `CI_TOOL`, `DEPLOY_TARGET`, etc.) are resolved during Steps 1-2 (auto-detect + intake) and refined during Step 11 (Infrastructure Setup). Role and permission placeholders are resolved during Step 5 (Service Specs). Mobile placeholders during Step 3.5/5.5. Stakeholder and financial placeholders during Step 1 (Intake). Boolean flags (`HAS_*`, `IS_*`) are set during Step 1 (Intake) based on project scope. `GENERATION_DATE` is auto-set at generation time.

---

## Stack Detection (16)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `FRONTEND_FRAMEWORK` | Frontend framework | `next` / `react` / `vue` / `none` |
| `BACKEND_FRAMEWORK` | Backend framework | `nestjs` / `express` / `fastapi` / `django` / `rails` / `none` |
| `DATABASE` | Primary database | `postgresql` / `mysql` / `mongodb` |
| `ORM` | ORM/query builder | `prisma` / `typeorm` / `sqlalchemy` / `django-orm` / `activerecord` |
| `CSS_FRAMEWORK` | Styling solution | `tailwind` / `css-modules` / `styled-components` |
| `MONOREPO_TOOL` | Monorepo manager | `turborepo` / `nx` / `lerna` / `none` |
| `DESIGN_SYSTEM_LIBRARY` | Component library | `shadcn/ui` / `mantine` / `chakra` / `custom` |
| `STACK` | Language family | `javascript` / `python` / `ruby` / `go` |
| `BUILD_TOOL` | Build system | `vite` / `webpack` / `esbuild` |
| `FRONTEND_VERSION` | Framework version | `16` / `19` / `3` |
| `BACKEND_VERSION` | Framework version | `10` / `4` / `0.100` |
| `DATABASE_VERSION` | DB version | `16` / `8.0` / `7` |
| `ORM_VERSION` | ORM version | `0.42` / `6.0` / `2.0` |
| `CSS_VERSION` | CSS framework version | `4` / `3` / `6` |
| `AUTH_VERSION` | Auth library version | `1.4` / `5.0` |
| `REACT_VERSION` | React version (peer dep) | `19` / `20` |

> **Resolution:** Technology names are detected during Step 1 (auto-detect + intake). **Version numbers (`*_VERSION`) are resolved during Step 1.5 via live MCP lookups — never from AI training data.** For existing codebases, versions are read from lock files / config. For greenfield projects, versions are looked up live.

---

## Mobile Platform (5)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `HAS_MOBILE` | Whether project includes a mobile app | `"true"` / `"false"` |
| `MOBILE_FRAMEWORK` | Mobile framework choice | `react-native` / `expo` / `flutter` / `none` |
| `MOBILE_PLATFORM` | Target mobile platforms | `ios` / `android` / `both` |
| `MOBILE_MIN_OS_IOS` | Minimum iOS version | `16.0` / `17.0` |
| `MOBILE_MIN_OS_ANDROID` | Minimum Android API level | `26` / `28` / `30` |

> **Resolution:** `HAS_MOBILE` is asked during Step 1 intake. If `"true"`, `MOBILE_FRAMEWORK` is selected during Step 3.5 (Mobile Framework Selection). Remaining mobile placeholders are resolved during Steps 11.5-14.5.

---

## Feature Toggle Config Options (6)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `MOBILE_FULL_PARITY` | Generate full mobile planning (22-27 files) vs minimal (2 files) | `"true"` / `"false"` |
| `SEED_DATA` | Generate seed data planning step | `"true"` / `"false"` |
| `MASTER_TRACKER` | Generate 6-file master tracker suite | `"true"` / `"false"` |
| `COMPETITIVE_BATTLE_CARDS` | Generate per-competitor battle cards + win/loss playbook | `"true"` / `"false"` |
| `DOMAIN_SPECS` | Generate per-domain specification files (Repurpose path) | `"true"` / `"false"` |
| `MODULE_HUBS` | Generate module-level hub files (8-15 per service) | `"true"` / `"false"` |
| `MOCK_SERVER` | Generate API mock server for parallel development | `"true"` / `"false"` |

> **Resolution:** Asked during Step 1 intake Phase 5 (scope & timeline). Defaults: `MOBILE_FULL_PARITY = "true"` if `HAS_MOBILE == "true"`, `SEED_DATA = "true"`, `MASTER_TRACKER = "true"`, `COMPETITIVE_BATTLE_CARDS = "true"` if marketing steps run, `DOMAIN_SPECS = "true"` if Repurpose path, `MODULE_HUBS = "true"`.

---

## Paths & File Locations (25)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `FRONTEND_APP_PATH` | App/pages directory | `apps/web/app` |
| `BACKEND_APP_PATH` | Backend module root | `apps/api/src` |
| `COMPONENT_LIBRARY_PATH` | UI components dir | `apps/web/components` |
| `BACKEND_SRC` | Backend source root | `apps/api/src` |
| `FRONTEND_SRC` | Frontend source root | `apps/web` |
| `SERVICE_HUB_PATH` | Service hub files | `dev_docs/services` |
| `STATUS_FILE_PATH` | Task dashboard | `dev_docs/STATUS.md` |
| `TASK_FILES_PATH` | Task files dir | `dev_docs/tasks` |
| `SHARED_PACKAGES_PATH` | Shared packages | `packages/` |
| `DOCS_PATH` | Documentation root | `dev_docs` |
| `SPEC_LAYER_PATH` | Spec docs | `dev_docs/specs` |
| `EXECUTION_LAYER_PATH` | Execution docs | `dev_docs` |
| `SCHEMA_FILE` | DB schema file | `apps/api/prisma/schema.prisma` |
| `DESIGN_SPECS_PATH` | Design spec files | `dev_docs/specs/screens` |
| `CONTRACT_REGISTRY_PATH` | API contracts | `dev_docs/specs/contracts` |
| `WORK_LOG_PATH` | Work log file | `dev_docs/weekly-reports/work-log.md` |
| `GLOBALS_CSS_PATH` | Global CSS file | `apps/web/app/globals.css` |
| `API_CLIENT_PATH` | API client module | `apps/web/lib/api-client.ts` |
| `TASK_TRACKER_PATH` | Task tracking file | `dev_docs/STATUS.md` |
| `REPORTS_OUTPUT_DIR` | Weekly reports dir | `dev_docs/weekly-reports` |
| `SCREEN_CATALOG_PATH` | Screen catalog | `dev_docs/specs/screen-catalog.md` |
| `STORIES_PATH` | Storybook stories | `apps/web/stories` |
| `SHARED_TYPES_PATH` | Shared type defs | `packages/shared/types` |
| `SEED_DATA_PATH` | Seed scripts | `apps/api/prisma/seed.ts` |
| `TRIBUNAL_OUTPUT_PATH` | Tribunal output | `dev_docs/tribunal` |

---

## Commands (10)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `PKG_MANAGER` | Package manager | `pnpm` / `npm` / `yarn` / `bun` |
| `BUILD_CMD` | Build command | `pnpm build` / `npm run build` |
| `TEST_CMD` | Test command | `pnpm test` / `pytest` / `bundle exec rspec` |
| `LINT_CMD` | Lint command | `pnpm lint` / `ruff check .` / `rubocop` |
| `TYPE_CHECK_CMD` | Type check command | `pnpm check-types` / `mypy .` |
| `TYPE_GEN_CMD` | Type generation | `pnpm prisma generate` |
| `DEV_CMD` | Dev server command | `pnpm dev` |
| `MIGRATE_CMD` | Migration command | `prisma migrate dev` / `python manage.py migrate` |
| `SEED_CMD` | Seed command | `prisma db seed` / `python manage.py loaddata` |
| `E2E_CMD` | E2E test command | `pnpm test:e2e` / `pytest --e2e` |

---

## Ports & URLs (9)

| Placeholder | Description | Default |
|-------------|-------------|---------|
| `FRONTEND_PORT` | Frontend dev server | `3000` |
| `BACKEND_PORT` | Backend API server | `3001` |
| `DB_PORT` | Database port | `5432` / `3306` / `27017` |
| `REDIS_PORT` | Redis port | `6379` |
| `API_URL_DEFAULT` | Default API URL | `http://localhost:3001` |
| `API_BASE_URL` | API base in tests | `http://localhost:3001/api` |
| `API_PREFIX` | API route prefix | `/api/v1` |
| `API_DOCS_URL` | Swagger/OpenAPI URL | `/api/docs` |
| `API_DOCS_TOOL` | API docs tool | `swagger` / `redoc` |

---

## Auth & Security (12)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `AUTH_GUARD_NAME` | Auth guard/decorator | `JwtAuthGuard` / `@authenticate` |
| `AUTH_STRATEGY` | Auth strategy | `jwt` / `session` / `oauth2` |
| `AUTH_METHOD` | Auth mechanism | `jwt` / `session` |
| `AUTH_LIBRARY` | Auth package | `passport` / `next-auth` |
| `AUTH_HOOK_PATH` | Auth hook location | `lib/hooks/useAuth` |
| `AUTHZ_METHOD` | Authorization type | `rbac` / `abac` |
| `ROLES_LIST` | Available roles | `admin, manager, dispatcher, driver` |
| `SECRETS_MANAGEMENT` | Secret storage | `env-vars` / `vault` |
| `RATE_LIMIT_AUTH` | Auth rate limit | `60` |
| `RATE_LIMIT_UNAUTH` | Unauth rate limit | `20` |
| `TENANT_STRATEGY` | Tenant isolation | `row-level` / `schema` / `database` |
| `TENANT_ID_FIELD` | Tenant field name | `tenantId` |

---

## Infrastructure (16)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `DB_NAME` | Database name | `fleet_manager_dev` |
| `DATABASE_URL_DEFAULT` | Default DB URL | `postgresql://postgres:postgres@localhost:5432/dev` |
| `SOFT_DELETE` | Soft delete enabled | `"true"` / `"false"` |
| `SOFT_DELETE_RETENTION` | Retention days | `90` |
| `MULTI_TENANT` | Multi-tenant enabled | `"true"` / `"false"` |
| `CACHE` | Cache technology | `redis` / `memcached` / `none` |
| `JOB_QUEUE` | Background jobs | `bull` / `celery` / `sidekiq` / `none` |
| `LOGGING` | Logging library | `winston` / `pino` / `python-logging` |
| `MONITORING` | Monitoring tool | `sentry` / `datadog` / `none` |
| `CI_CD` | CI/CD platform | `github-actions` / `gitlab-ci` / `circleci` |
| `CI_PROVIDER` | CI provider name | `GitHub Actions` |
| `CONTAINER_TECH` | Container runtime | `docker` / `podman` |
| `HOSTING_PROVIDER` | Hosting platform | `vercel` / `aws` / `railway` / `fly.io` |
| `GATEWAY_TECHNOLOGY` | API gateway | `nginx` / `traefik` / `none` |
| `SEARCH_ENGINE` | Search technology | `elasticsearch` / `meilisearch` / `none` |
| `REALTIME_TECHNOLOGY` | Real-time tech | `websocket` / `sse` / `socket.io` / `none` |

---

## Design System (20)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `BRAND_HUE` | Primary color hue | `220` (navy) |
| `BRAND_SATURATION` | Primary saturation | `60%` |
| `BRAND_LIGHTNESS` | Primary lightness | `45%` |
| `BRAND_FONT` | Primary font | `Inter` |
| `BRAND_RADIUS` | Border radius | `0.5rem` |
| `BRAND_BORDER_COLOR` | Border color | `hsl(30, 10%, 85%)` |
| `COMPONENT_PREFIX` | Domain component prefix | `tms` / `app` / `fleet` |
| `TOKEN_ARCHITECTURE_DESCRIPTION` | Token system summary | `3-layer: brand > semantic > Tailwind` |
| `DESIGN_SYSTEM_STATUS` | Current status | `approved` / `draft` / `in-progress` |
| `STORYBOOK_FRAMEWORK` | Storybook renderer | `react-vite` / `vue-vite` |
| `STORYBOOK_CMD` | Storybook command | `pnpm storybook` |
| `STATUS_MAPPING_TABLE` | Status color map | *(table of status → color mappings)* |
| `ICON_LIBRARY` | Icon library package | `lucide-react` / `heroicons` / `phosphor` |
| `PRIMARY_FONT` | Primary UI font | `Inter` / `Plus Jakarta Sans` |
| `MONO_FONT` | Monospace font | `JetBrains Mono` / `Fira Code` |
| `ENTITY_NAME` | Primary domain entity | `Ride` / `Order` / `Ticket` |
| `ENTITY_NAME_PLURAL` | Plural entity name | `Rides` / `Orders` / `Tickets` |
| `ENTITY_PLURAL` | URL-safe plural | `rides` / `orders` / `tickets` |
| `ENTITY_SLUG` | Prop name for entity | `ride` / `order` / `ticket` |
| `ENTITY_PRIMARY_FIELD` | Main display field | `rideNumber` / `orderName` / `title` |

---

## Testing (16)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `FRONTEND_TEST_CMD` | FE test command | `pnpm --filter web test` |
| `BACKEND_TEST_CMD` | BE test command | `pnpm --filter api test` |
| `FRONTEND_TEST_CONFIG` | FE Jest config | `apps/web/jest.config.ts` |
| `BACKEND_TEST_CONFIG` | BE Jest config | `apps/api/jest.config.ts` |
| `TEST_SETUP_PATH` | Test setup file | `test/setup.ts` |
| `E2E_TOOL` | E2E framework | `playwright` / `cypress` |
| `TEST_RUNNER` | Test runner | `jest` / `vitest` / `pytest` / `rspec` |
| `UNIT_COVERAGE_TARGET` | Unit coverage % | `80` |
| `INTEGRATION_COVERAGE_TARGET` | Integration % | `60` |
| `OVERALL_COVERAGE_TARGET` | Overall coverage | `70` |
| `COVERAGE_THRESHOLD` | Min threshold | `70` |
| `COVERAGE_BRANCHES` | Branch coverage | `70` |
| `COVERAGE_FUNCTIONS` | Function coverage | `80` |
| `COVERAGE_LINES` | Line coverage | `80` |
| `COVERAGE_STATEMENTS` | Statement coverage | `80` |
| `TEST_COUNT` | Total test count | `72` |

---

## API & Response Format (8)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `API_STYLE` | API architecture | `rest` / `graphql` |
| `API_ENVELOPE_DATA_KEY` | Data field name | `data` |
| `API_ENVELOPE_META_KEY` | Meta/pagination key | `pagination` / `meta` |
| `API_ENVELOPE_MESSAGE_KEY` | Message key | `error` / `message` |
| `API_CLIENT` | HTTP client library | `axios` / `fetch` / `ky` |
| `API_VERSIONING_STRATEGY` | Versioning approach | `url-prefix` / `header` |

---

## MVP & Project Configuration (30+)

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `MVP_SERVICE_COUNT` | Number of MVP services | `7` |
| `MVP_SCREEN_COUNT` | Number of MVP screens | `25` |
| `MVP_TIMELINE` | MVP timeline | `12 weeks` |
| `MVP_SCOPE_SUMMARY` | Scope one-liner | `Core logistics with 7 services` |
| `MVP_SUCCESS_CRITERIA` | Definition of done | `All 7 services functional` |
| `TEAM_SIZE` | Number of developers | `2` |
| `TEAM_CAPACITY` | Total dev hours | `360h` |
| `TOTAL_TASK_COUNT` | Tasks in backlog | `72` |
| `ESTIMATED_HOURS` | Total estimated hours | `420h` |
| `COMPLETION_PERCENT` | Current progress | `14%` |
| `DEFAULT_PAGE_SIZE` | List pagination default | `20` |
| `MAX_PAGE_SIZE` | Max items per page | `100` |
| `MAX_UPLOAD_SIZE` | Upload size limit | `10MB` |
| `DEFAULT_BRANCH` | Git default branch | `main` |
| `REQUIRED_REVIEWERS` | PR reviewers needed | `1` |
| `DATE_FORMAT` | Date display format | `YYYY-MM-DD` |

---

## Internationalization (5)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `I18N_ENABLED` | i18n support | `"true"` / `"false"` |
| `I18N_LIBRARY` | i18n library | `next-intl` / `react-intl` / `i18next` / `vue-i18n` |
| `I18N_DEFAULT_LOCALE` | Default locale | `en` |
| `I18N_SUPPORTED_LOCALES` | Supported locales | `en, es, fr, de` |
| `I18N_FALLBACK_LOCALE` | Fallback locale | `en` |

---

## Analytics & Tracking (7)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `ANALYTICS_PROVIDER` | Primary analytics tool (legacy, kept for backward compat) | `posthog` / `google-analytics` / `mixpanel` / `none` |
| `ANALYTICS_PROVIDERS` | All selected analytics tools (multi-select) | `google-analytics,posthog` / `mixpanel` / `none` |
| `ANALYTICS_KEY` | API key placeholder | `change-me-to-analytics-key` |
| `GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |
| `GSC_ENABLED` | Whether Google Search Console is configured | `true` / `false` |
| `CONVERSION_EVENTS` | Key conversion events to track (multi-select) | `signup,purchase,feature_activation` |
| `EVENT_TAXONOMY_PATH` | Path to generated event taxonomy document | `dev_docs/specs/analytics-event-taxonomy.md` |

> **Resolution:** `ANALYTICS_PROVIDERS`, `GA_MEASUREMENT_ID`, `GSC_ENABLED`, and `CONVERSION_EVENTS` are asked during Step 1 intake (Phase 4 — Technical Decisions). `EVENT_TAXONOMY_PATH` is generated at Step 4.7 (Analytics Architecture). The legacy `ANALYTICS_PROVIDER` (singular) is auto-populated from the first entry in `ANALYTICS_PROVIDERS` for backward compatibility.

---

## Feature Flags (1)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `FEATURE_FLAG_PROVIDER` | Flag service | `env-based` / `unleash` / `launchdarkly` / `none` |

---

## SEO (9)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `SEO_ENABLED` | SEO optimization | `"true"` / `"false"` |
| `SITE_URL` | Production URL | `https://myapp.com` |
| `OG_IMAGE_DEFAULT` | Default OG image | `/og-image.png` |
| `SEO_MATURITY_TIER` | Current SEO maturity level (from `36-seo/seo-maturity-assessment.md`) | `1` / `2` / `3` / `4` |
| `TARGET_KEYWORDS` | Primary keyword targets | `["deployment tool", "CI/CD platform"]` |
| `SEO_TOOL_STACK` | SEO tools in use | `["search-console", "ahrefs", "screaming-frog"]` |
| `HREFLANG_ENABLED` | International SEO active | `"true"` / `"false"` |
| `LOCAL_SEO_ENABLED` | Local SEO active | `"true"` / `"false"` |
| `ECOMMERCE_SEO_ENABLED` | E-commerce SEO active | `"true"` / `"false"` |

---

## Observability (5)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `ERROR_REPORTING` | Error service | `sentry` / `bugsnag` / `none` |
| `SENTRY_DSN` | Sentry DSN | `https://xxx@sentry.io/yyy` |
| `LOG_LEVEL` | Default log level | `info` / `debug` / `warn` |
| `HEALTH_CHECK_PATH` | Health endpoint | `/health` |
| `UPTIME_MONITOR` | Uptime service | `uptimerobot` / `betterstack` / `none` |

---

## Performance (4)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `PERFORMANCE_BUDGET_JS` | JS bundle limit | `200KB` |
| `PERFORMANCE_BUDGET_CSS` | CSS bundle limit | `50KB` |
| `LCP_TARGET` | LCP target | `2.5s` |
| `LIGHTHOUSE_MIN_SCORE` | Min Lighthouse score | `90` |

---

## User Documentation (8)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `USER_DOCS_PATH` | Path to user docs directory | `user_docs/` |
| `DOCS_SITE_FRAMEWORK` | Documentation site platform | `docusaurus` / `nextra` / `gitbook` / `mintlify` / `none` |
| `DOCS_SITE_URL` | Deployed docs site URL | `https://docs.fleet-manager.com` |
| `SUPPORT_URL` | Support/contact page URL | `https://fleet-manager.com/support` |
| `HAS_APP_STORE` | Whether to generate store listing content | `"true"` / `"false"` |
| `HAS_APP_CLIPS` | Whether the iOS app supports App Clips | `"true"` / `"false"` |
| `HAS_ADMIN_ROLE` | Whether the app has an admin user role | `"true"` / `"false"` |
| `STATUS_PAGE_URL` | Service status page URL | `https://status.fleet-manager.com` |

---

## Marketing (15)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `PRODUCT_TYPE` | Product category for marketing | `saas` / `mobile_app` / `marketplace` / `dev_tool` / `client_site` |
| `TARGET_AUDIENCE` | Primary marketing audience | `small business owners` / `developers` / `marketing teams` |
| `MARKETING_BUDGET` | Monthly marketing budget tier | `bootstrap` / `small` / `medium` / `growth` |
| `LAUNCH_TIMELINE` | Target launch/marketing date | `2026-04-01` |
| `REVENUE_GOAL` | First revenue milestone target | `first-1k` / `first-10k` / `first-100k` |
| `MONETIZATION_MODEL` | Revenue model | `subscription` / `freemium` / `one-time` / `marketplace-fee` / `usage-based` |
| `PRIMARY_CHANNELS` | Top marketing channels | `["seo", "twitter", "product-hunt"]` |
| `BRAND_VOICE` | Brand personality and tone | `professional` / `casual` / `technical` / `playful` |
| `DEMO_MODE` | Walkthrough demo interaction mode | `guided` / `free` / `hybrid` |
| `DEMO_PLATFORM` | Demo target platform | `web` / `mobile` / `both` |
| `DEMO_APPROACH` | Demo implementation approach | `simulated` / `cloned-frontend` |
| `DEMO_ENTRY_GATE` | Whether email gate is shown before demo | `"true"` / `"false"` |
| `DEMO_CTA_WEBHOOK` | Webhook URL for lead capture form submissions | `https://hooks.zapier.com/...` |
| `DEMO_ANALYTICS_PROVIDER` | Analytics provider for demo tracking | `ga4` / `mixpanel` / `amplitude` / `custom` |
| `DEMO_ANALYTICS_ID` | Analytics tracking ID for demo events | `G-XXXXXXXXXX` / `project-token` |

---

## Post-Launch Lifecycle (3)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `RELEASE_CADENCE` | How often releases ship | `weekly` / `biweekly` / `continuous` |
| `FEEDBACK_CHANNEL` | Primary user feedback collection method | `in-app` / `email` / `discord` / `github-issues` |
| `PUBLIC_ROADMAP` | Whether product roadmap is publicly visible | `"true"` / `"false"` |

---

## Incident Response (3)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `STATUS_PAGE_PROVIDER` | Status page hosting service | `betteruptime` / `instatus` / `self-hosted` |
| `ONCALL_TOOL` | On-call alerting tool | `pagerduty` / `opsgenie` / `none` |
| `SEV1_RESPONSE_TIME` | Maximum response time for SEV1 incidents | `15 minutes` / `30 minutes` |

---

## CI/CD Pipeline (3)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `DEPLOY_STRATEGY` | Deployment pattern | `blue-green` / `rolling` / `canary` / `recreate` |
| `IAC_TOOL` | Infrastructure as Code tool | `terraform` / `pulumi` / `sst` / `cdk` / `none` |
| `CONTAINER_STRATEGY` | Container orchestration approach | `serverless` / `docker-compose` / `kubernetes` / `none` |

---

## Customer Support (3)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `SUPPORT_PLATFORM` | Help desk / support tool | `intercom` / `zendesk` / `crisp` / `helpscout` / `self-built` |
| `SUPPORT_CHANNELS` | Active support channels (comma-separated) | `email,chat,discord` / `email,phone,chat` |
| `FREE_TIER_SLA` | Response time SLA for free-tier users | `48 hours` / `24 hours` / `none` |

---

## AI/ML Integration (4)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `AI_FEATURES` | Whether product ships AI-powered features to users | `"true"` / `"false"` |
| `AI_PROVIDER` | Primary LLM / AI model provider | `anthropic` / `openai` / `google` / `self-hosted` |
| `VECTOR_DB` | Vector database for embeddings/RAG | `pgvector` / `pinecone` / `chroma` / `weaviate` / `none` |
| `AI_FRAMEWORK` | AI SDK or framework | `vercel-ai` / `langchain` / `llamaindex` / `direct-api` |

---

## Financial Modeling (21)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `MONTHLY_GROWTH_RATE` | Expected month-over-month user/revenue growth | `10%` / `15%` / `20%` |
| `AVERAGE_REVENUE_PER_USER` | Average revenue per user (ARPU) | `$29/mo` / `$49/mo` / `$99/mo` |
| `MONTHLY_CHURN_RATE` | Monthly customer churn rate | `3%` / `5%` / `8%` |
| `GROSS_MARGIN` | Revenue minus cost of goods sold | `80%` / `70%` / `60%` |
| `CASH_IN_BANK` | Current cash position for runway calculation | `$10,000` / `$50,000` / `$250,000` |
| `PRICE_RANGE` | Target price range per customer per month | `$0-10` / `$10-50` / `$50-200` / `$200-1000` / `$1000+` |
| `BILLING_CYCLE` | Billing frequency | `monthly` / `annual` / `both` / `usage-based` |
| `FREE_TIER_MODEL` | Free tier or trial structure | `free-forever` / `7-day-trial` / `14-day-trial` / `30-day-trial` / `none` |
| `TARGET_GEOGRAPHY` | Geographic scope of the business | `single-country` / `single-continent` / `global` / `local` |
| `TARGET_REGIONS` | Specific regions targeted (multi-select) | `north-america,europe` / `global` |
| `TAM_SIZE` | Total addressable market size | `<10K` / `10K-100K` / `100K-1M` / `1M-10M` / `10M+` |
| `BUSINESS_MODEL_TYPE` | B2B vs B2C classification | `b2b` / `b2c` / `b2b2c` / `prosumer` |
| `DEAL_SIZE` | Average deal size / customer lifetime value | `<$100` / `$100-1K` / `$1K-10K` / `$10K-100K` / `$100K+` |
| `PRIMARY_ACQUISITION_CHANNEL` | Main customer acquisition channel | `organic` / `paid` / `community` / `partnerships` / `sales` / `plg` |
| `VISITOR_TO_SIGNUP_RATE` | Expected visitor → signup conversion | `1-2%` / `3-5%` / `5-10%` / `10%+` |
| `SIGNUP_TO_PAID_RATE` | Expected signup → paid conversion | `1-3%` / `3-10%` / `10-25%` / `25-50%` |
| `EXPECTED_CHURN_RATE` | Expected monthly churn rate | `<2%` / `2-5%` / `5-10%` / `10-15%` |
| `KEY_CONVERSION_STEP` | Critical activation metric | `onboarding-complete` / `first-value` / `upgrade` / `invite-team` / `connect-integration` |
| `CASH_POSITION` | Current cash position | `bootstrapped` / `<50K` / `50K-250K` / `250K-1M` / `1M-5M` / `5M+` |
| `MONTHLY_BURN` | Current monthly burn rate | `solo-founder` / `<5K` / `5K-20K` / `20K-50K` / `50K+` |
| `BIGGEST_COST_CATEGORY` | Largest spending category | `infrastructure` / `salaries` / `marketing` / `tools` / `ai-api` |
| `REVENUE_TIMELINE` | When revenue generation is expected | `already-generating` / `0-3mo` / `3-6mo` / `6-12mo` / `12mo+` |
| `FUNDRAISING_STAGE` | Current or planned fundraising round | `bootstrapping` / `pre-seed` / `seed` / `series-a` / `funded` |

> **Resolution:** All financial placeholders are now resolved during Step 17.5 (Financial Modeling Intake) via the `25-financial-modeling/financial-intake-questionnaire.md` progressive disclosure questionnaire. The original 5 placeholders remain for backward compatibility but are now populated alongside 16 new placeholders. Deep-dive branches add additional placeholders specific to geo, infrastructure, team, and investor modeling.

---

## Multi-Tenant SaaS (3)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `BILLING_PROVIDER` | Payment/subscription billing platform | `stripe` / `lemonsqueezy` / `paddle` |
| `CUSTOM_DOMAIN_ENABLED` | Whether tenants can use custom domains | `"true"` / `"false"` |
| `FREE_TIER_RATE_LIMIT` | API rate limit for free-tier tenants | `100 req/hr` / `1000 req/hr` |

---

## Team Communication (3)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `SPRINT_DURATION` | Sprint length for agile ceremonies | `1 week` / `2 weeks` |
| `STANDUP_FORMAT` | Daily standup format | `sync` / `async` |
| `TEAM_COMMUNICATION_TOOL` | Primary team communication platform | `slack` / `discord` / `teams` / `none` |

---

## Legal & Compliance (14)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `COMPANY_NAME` | Legal entity name | `Acme Logistics Inc.` |
| `COMPANY_ADDRESS` | Registered business address | `123 Main St, San Francisco, CA 94102` |
| `PRIVACY_EMAIL` | Privacy inquiry email | `privacy@acme.com` |
| `DPO_EMAIL` | Data Protection Officer email | `dpo@acme.com` |
| `SUPPORT_EMAIL` | General support email | `support@acme.com` |
| `LEGAL_EMAIL` | Legal inquiry email | `legal@acme.com` |
| `MINIMUM_AGE` | Minimum user age requirement | `13` / `16` / `18` |
| `GOVERNING_JURISDICTION` | Legal jurisdiction for disputes | `State of California, USA` |
| `TARGET_JURISDICTIONS` | Countries/regions served | `US, EU, UK, Canada` |
| `HAS_UGC` | Whether app has user-generated content | `"true"` / `"false"` |
| `HAS_MOBILE_APP` | Whether app has a mobile component (alias for `HAS_MOBILE` in legal context) | `"true"` / `"false"` |
| `APPLICABLE_REGULATIONS` | Data regulations that apply | `GDPR, CCPA` |
| `DATA_TYPES_COLLECTED` | All personal data types collected | `name, email, IP, usage data` |
| `PAYMENT_PROCESSOR` | Payment processing provider (for legal docs) | `Stripe` / `Paddle` / `LemonSqueezy` |

---

## Billing & Payments (10)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `PAYMENT_PROCESSING` | Whether product accepts payments | `"true"` / `"false"` |
| `BILLING_MODEL` | Revenue/billing model | `subscription` / `usage-based` / `hybrid` / `marketplace` / `one-time` |
| `BILLING_CYCLE` | Billing frequency | `monthly` / `annual` / `both` |
| `BILLING_CURRENCY` | Primary billing currency | `USD` / `EUR` / `GBP` |
| `GRACE_PERIOD_DAYS` | Days after payment failure before restriction | `7` / `14` |
| `CANCELLATION_DAYS` | Days after failure for final cancellation | `30` |
| `REFUND_WINDOW` | Days allowed for refund requests | `14` / `30` |
| `PRICE_CHANGE_NOTICE_PERIOD` | Days notice before price changes | `30` / `60` |
| `DATA_RETENTION_AFTER_CANCEL` | Days data retained after cancellation | `30` / `90` |
| `LIABILITY_LOOKBACK_PERIOD` | Months for liability cap calculation | `12` |

---

## Integration Strategy (22)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `INTEGRATION_COUNT` | Number of third-party integrations | `3` / `8` / `15` |
| `INTEGRATION_MATURITY_LEVEL` | Integration architecture maturity tier | `basic` / `standard` / `complex` / `enterprise` |
| `SECRETS_MANAGER` | Secrets management solution | `vercel-env` / `aws-secrets-manager` / `vault` / `doppler` |
| `INTEGRATION_BUDGET_MONTHLY` | Monthly budget for API/SaaS costs | `$50` / `$500` / `$5000` |
| `WEBHOOK_QUEUE_PROVIDER` | Queue for async webhook processing | `bullmq` / `sqs` / `rabbitmq` / `in-process` |
| `WEBHOOK_DLQ_RETENTION_DAYS` | Dead letter queue retention period | `7` / `30` / `90` |
| `WEBHOOK_SIGNATURE_ALGORITHM` | Default signature verification method | `hmac-sha256` / `ed25519` |
| `FALLBACK_ENABLED` | Whether multi-provider fallback is used | `true` / `false` |
| `FALLBACK_ERROR_THRESHOLD` | Error rate triggering failover | `5%` / `10%` |
| `FALLBACK_COOLDOWN_MINUTES` | Minutes before retrying primary after failover | `5` / `15` / `60` |
| `HEALTH_CHECK_INTERVAL_SECONDS` | Integration health check frequency | `30` / `60` / `300` |
| `HEALTH_ALERT_CHANNEL` | Where integration alerts are sent | `slack-#ops` / `pagerduty` / `email` |
| `INTEGRATION_SLA_TARGET` | Target uptime for integration layer | `99.9%` / `99.5%` |
| `QUEUE_PROVIDER` | Job queue system | `bullmq` / `sqs` / `celery` / `sidekiq` |
| `QUEUE_REDIS_URL` | Redis URL for queue | `redis://localhost:6379` |
| `QUEUE_CONCURRENCY` | Worker concurrency | `5` / `10` / `25` |
| `QUEUE_DASHBOARD_ENABLED` | Whether queue admin UI is deployed | `true` / `false` |
| `AUTH_SSO_PROVIDER` | SSO/OAuth provider | `auth0` / `clerk` / `supabase-auth` / `custom` |
| `AUTH_SSO_PROVIDERS` | Social login providers enabled | `google, github` / `google, github, microsoft` |
| `COMMUNICATION_PLATFORM` | Primary communication integration | `slack` / `discord` / `teams` / `none` |
| `ECOMMERCE_PLATFORM` | E-commerce platform if applicable | `shopify` / `woocommerce` / `none` |
| `CRM_PLATFORM` | CRM system | `hubspot` / `salesforce` / `none` |
| `CDP_PLATFORM` | Customer data platform | `segment` / `rudderstack` / `none` |

---

## Quality & Anti-Patterns (7)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `ANTI_PATTERN_COUNT` | Number of active anti-patterns tracked | `11` |
| `QUALITY_GATE_MVP` | Minimum score for MVP readiness | `6.0` |
| `QUALITY_GATE_PRODUCTION` | Minimum score for production | `8.0` |
| `PROTECTION_THRESHOLD` | Score threshold for protection list | `8` |
| `QUALITY_RUBRIC_WEIGHTS` | Scoring dimension weights | `Func:30,Data:20,UI:20,State:15,A11y:10,Code:5` |
| `DEFINITION_OF_DONE_ITEMS` | Number of DoD checklist items | `10` |
| `FOUR_UI_STATES` | Required states for data components | `loading, empty, error, populated` |

---

## Security Framework (8)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `SECURITY_SEVERITY_MODEL` | Severity classification tiers | `SEV-1,SEV-2,SEV-3,SEV-4` |
| `SECURITY_SEV1_SLA` | SLA for critical security findings | `4 hours` |
| `SECURITY_SEV2_SLA` | SLA for high security findings | `24 hours` |
| `SECURITY_SEV3_SLA` | SLA for medium findings | `next sprint` |
| `SECURITY_SEV4_SLA` | SLA for low findings | `backlog` |
| `SECURITY_STOP_SHIP_CRITERIA` | What blocks deployment | `auth bypass, data leak, injection, privilege escalation` |
| `SECURITY_AUDIT_FREQUENCY` | How often to run security audits | `per-sprint` / `per-phase` / `monthly` |
| `SECURITY_HARDENING_SPRINT` | Dedicated security sprint in plan | `MP-01` / `none` |

---

## Performance Budget (8)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `PERFORMANCE_API_P95` | API latency target (p95) | `500ms` |
| `PERFORMANCE_API_P99` | API latency target (p99) | `1000ms` |
| `PERFORMANCE_LCP_TARGET` | Largest Contentful Paint target | `2.5s` |
| `PERFORMANCE_FCP_TARGET` | First Contentful Paint target | `1.8s` |
| `PERFORMANCE_CLS_TARGET` | Cumulative Layout Shift target | `0.1` |
| `PERFORMANCE_INP_TARGET` | Interaction to Next Paint target | `200ms` |
| `PERFORMANCE_BUNDLE_LIMIT` | Total JS bundle size budget | `200KB` |
| `PERFORMANCE_IMAGE_LIMIT` | Max individual image size | `200KB` |

---

## Rate Limiting (4)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `RATE_LIMIT_DEFAULT` | Default API rate limit | `100 req/min` |
| `RATE_LIMIT_AUTH_ENDPOINTS` | Auth endpoint rate limit | `10 req/min` |
| `RATE_LIMIT_PASSWORD_RESET` | Password reset rate limit | `3 req/hr` |
| `RATE_LIMIT_FILE_UPLOAD` | File upload rate limit | `20 req/hr` |

---

## Tribunal & Audit (5)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `HUB_VERIFICATION_FREQUENCY` | How often to verify hub files | `per-sprint` / `per-phase` |
| `CCF_PROMOTION_THRESHOLD` | Modules affected before local → systemic | `3` |
| `PST_BATCH_SIZE` | Services per tribunal batch | `3` / `5` |
| `PST_VERDICT_CATEGORIES` | Available tribunal verdicts | `AFFIRM, MODIFY, REVERSE, DEFER` |
| `TRIBUNAL_FORMAT` | Tribunal style | `5-round-adversarial` / `3-round-standard` |

---

## Customer Experience Operations (25)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `CX_MATURITY_LEVEL` | Current CX maturity tier | `reactive`, `structured`, `proactive`, `predictive` |
| `CX_TEAM_SIZE` | Number of support team members | `2`, `8`, `25` |
| `CX_CHANNELS` | Active support channels | `email, chat`, `email, chat, phone, social` |
| `CX_CHATBOT_PROVIDER` | AI chatbot platform or framework | `openai-assistants`, `custom-rag`, `intercom-fin` |
| `CX_LLM_MODEL` | LLM model used for chatbot | `gpt-4o`, `claude-3-sonnet`, `gemini-pro` |
| `CX_EMBEDDING_MODEL` | Embedding model for RAG retrieval | `text-embedding-3-small`, `voyage-3` |
| `CX_VECTOR_STORE` | Vector database for chatbot retrieval | `pinecone`, `weaviate`, `pgvector` |
| `CX_CONFIDENCE_THRESHOLD` | Chatbot confidence threshold for human handoff | `0.75`, `0.85` |
| `CX_KNOWLEDGE_CENTER_URL` | Self-service help center URL | `https://help.example.com` |
| `CX_COMMUNITY_URL` | Community forum URL | `https://community.example.com` |
| `CX_TICKETING_SYSTEM` | Ticketing system in use | `zendesk`, `linear`, `custom` |
| `CX_UNIFIED_INBOX` | Unified inbox platform | `intercom`, `front`, `missive` |
| `CX_NPS_TOOL` | NPS/CSAT survey tool | `delighted`, `typeform`, `custom` |
| `CX_NPS_FREQUENCY` | NPS survey send frequency | `quarterly`, `post-resolution`, `30-day` |
| `CX_CSAT_TARGET` | CSAT target score | `4.5/5`, `90%` |
| `CX_HEALTH_SCORE_SIGNALS` | Inputs to customer health score | `usage, tickets, nps, billing, engagement` |
| `CX_CHURN_THRESHOLD` | Health score threshold triggering intervention | `40`, `30` |
| `CX_QA_FREQUENCY` | QA review frequency | `weekly`, `bi-weekly` |
| `CX_QA_SAMPLE_SIZE` | Number of tickets reviewed per QA cycle | `5 per agent`, `10%` |
| `CX_ONBOARDING_DURATION` | New agent onboarding period | `30 days`, `6 weeks` |
| `CX_FIRST_RESPONSE_SLA` | First response time target | `1 hour`, `4 hours` |
| `CX_RESOLUTION_SLA` | Full resolution time target | `24 hours`, `48 hours` |
| `CX_SELF_SERVE_TARGET` | Target self-service resolution rate | `60%`, `75%` |
| `CX_ANALYTICS_TOOL` | CX analytics/dashboard platform | `metabase`, `looker`, `custom` |
| `CX_OPS_LEVEL` | CX operations depth level | `skip`, `reactive`, `structured`, `proactive`, `predictive` |

---

## Business Intelligence (14)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `BI_ENABLED` | Whether BI infrastructure is planned | `true`, `false` |
| `BI_WAREHOUSE` | Data warehouse platform | `snowflake`, `bigquery`, `redshift`, `postgres`, `clickhouse`, `duckdb` |
| `BI_ETL_TOOL` | ETL/ELT pipeline tool | `fivetran`, `airbyte`, `custom`, `stitch` |
| `BI_TRANSFORM_TOOL` | Transformation layer tool | `dbt`, `dataform`, `custom-sql` |
| `BI_PLATFORM` | BI visualization and dashboard tool | `metabase`, `looker`, `tableau`, `preset`, `powerbi`, `superset` |
| `BI_MATURITY_LEVEL` | Current BI maturity tier | `spreadsheet`, `tool-native`, `governed`, `predictive` |
| `BI_REFRESH_CADENCE` | Default data refresh frequency | `real-time`, `hourly`, `daily` |
| `BI_DATA_RETENTION_MONTHS` | Warehouse data retention period | `12`, `24`, `36`, `unlimited` |
| `BI_PII_STRATEGY` | PII handling approach in warehouse | `mask`, `hash`, `exclude`, `vault` |
| `BI_METRIC_OWNER_DEFAULT` | Default team owning metric definitions | `engineering`, `data-team`, `product`, `finance` |
| `BI_BOARD_CADENCE` | Board/investor reporting frequency | `monthly`, `quarterly` |
| `BI_DEPARTMENT_DASHBOARDS` | Departments needing dedicated dashboards | `["product", "engineering", "sales", "marketing", "support", "finance"]` |
| `BI_SELF_SERVE_ANALYTICS` | Whether to enable self-serve analytics for non-technical users | `true`, `false` |
| `BI_EMBEDDED_ANALYTICS` | Whether to embed analytics in the product UI | `true`, `false` |

> **Resolution:** Asked during Step 28.7 (Business Intelligence Setup). `BI_ENABLED` is asked at Step 1 intake as a boolean. If false, Step 28.7 is skipped. `BI_MATURITY_LEVEL` is determined via the maturity assessment decision tree. `BI_WAREHOUSE` and `BI_PLATFORM` are selected via their respective decision trees.

---

## Hardening Phase (18)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `HARDENING_AUDIT_ROUNDS` | Rounds executed in Step 29 | `3` |
| `HARDENING_AUDIT_FINDINGS` | Total findings from audit | `12` |
| `HARDENING_AUDIT_CRITICAL` | Critical findings from audit | `2` |
| `HARDENING_AUDIT_RESOLVED` | Findings resolved during audit | `12` |
| `HARDENING_ENHANCE_ROUNDS` | Rounds executed in Step 30 | `3` |
| `HARDENING_ENHANCE_TOTAL` | Total improvements applied | `47` |
| `HARDENING_ENHANCE_ADDED` | Missing items added | `18` |
| `HARDENING_ENHANCE_IMPROVED` | Existing items improved | `21` |
| `HARDENING_ENHANCE_STANDARDS` | Cross-cutting standards created | `3` |
| `HARDENING_DEPTH_ROUNDS` | Rounds executed in Step 31 | `5` |
| `HARDENING_DEPTH_SERVICE_THRESHOLD` | Elevated service spec depth threshold | `9` (out of 10) |
| `HARDENING_DEPTH_SCREEN_THRESHOLD` | Elevated screen spec depth threshold | `8` (out of 10) |
| `HARDENING_DEPTH_TASK_THRESHOLD` | Elevated task layer threshold | `7` (out of 8) |
| `HARDENING_DEEPDIVE_ROUNDS` | Rounds executed in Step 32 | `3` |
| `HARDENING_DEEPDIVE_NICETOHAVES` | Nice-to-have features identified | `14` |
| `HARDENING_EXPANSION_FEATURES` | Post-MVP features planned | `15` |
| `HARDENING_EXPANSION_QUARTERS` | Quarters in roadmap | `3` |
| `HARDENING_TOTAL_IMPROVEMENTS` | Total improvements across all hardening steps | `113` |

---

## Codebase Metrics (7)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `METRICS_DATE` | When metrics were last verified | `2026-03-07` |
| `ROUTE_COUNT` | Frontend route count | `98` |
| `COMPONENT_COUNT` | UI component count | `304` |
| `HOOK_COUNT` | Custom hook count | `51` |
| `MODULE_COUNT` | Backend module count | `35` |
| `MODEL_COUNT` | Database model count | `260` |
| `COVERAGE_PCT` | Test coverage percentage | `8.7` |

---

## Fundraising (15)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `FUNDRAISING_ENABLED` | Whether fundraising section runs | `true`, `false` |
| `FUNDRAISING_STAGE` | Current fundraising stage | `pre-seed`, `seed`, `series-a` |
| `TARGET_RAISE_AMOUNT` | Capital target | `500000`, `2000000` |
| `CURRENT_RUNWAY_MONTHS` | Months of cash remaining | `8`, `14` |
| `PRE_MONEY_VALUATION` | Pre-money valuation | `5000000` |
| `FOUNDER_COUNT` | Number of co-founders | `1`, `2`, `3` |
| `OPTION_POOL_SIZE` | Employee option pool percentage | `10`, `15`, `20` |
| `INVESTOR_TYPE` | Target investor type | `angel`, `vc`, `strategic` |
| `BOARD_SIZE` | Board of directors size | `3`, `5` |
| `BOARD_MEETING_CADENCE` | Board meeting frequency | `monthly`, `quarterly` |
| `INVESTOR_UPDATE_CADENCE` | Investor email frequency | `monthly`, `quarterly` |
| `DATA_ROOM_TOOL` | Data room platform | `google-drive`, `docsend`, `notion` |
| `CAP_TABLE_TOOL` | Cap table management tool | `carta`, `pulley`, `spreadsheet` |
| `FUNDRAISING_CRM` | Investor pipeline tool | `affinity`, `notion`, `spreadsheet` |
| `SAFE_OR_PRICED` | Round instrument type | `safe`, `convertible-note`, `priced-round` |

> **Resolution:** Asked during Step 1 (Intake) when `FUNDRAISING_ENABLED` is `true`. `FUNDRAISING_STAGE` determines which downstream placeholders are relevant. Cap table and data room tool selections feed into Step 25 (Financial Modeling).

---

## Team & Hiring Ops (13)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `TEAM_GROWTH_PLAN` | Planned team size in 12 months | `10`, `30` |
| `HIRING_BUDGET_MONTHLY` | Monthly hiring spend | `0`, `2000`, `10000` |
| `COMPENSATION_MODEL` | Compensation approach | `market-rate`, `below-market-heavy-equity`, `above-market-no-equity` |
| `EQUITY_POOL_AVAILABLE` | Remaining option pool percent | `8`, `12` |
| `WORK_LOCATION_POLICY` | Work arrangement | `remote-first`, `hybrid`, `on-site` |
| `TIMEZONE_OVERLAP_HOURS` | Required overlap hours | `4`, `6` |
| `ENGINEERING_LEVELS` | Number of IC levels | `4`, `6` |
| `REVIEW_CADENCE` | Performance review frequency | `annual`, `semi-annual`, `quarterly` |
| `RECRUITER_MODEL` | Recruiting approach | `internal`, `external-agency`, `founder-led` |
| `INTERVIEW_ROUNDS` | Number of interview stages | `3`, `4`, `5` |
| `ONBOARDING_DURATION_DAYS` | Full onboarding period | `30`, `60`, `90` |
| `FIRST_HIRE_ROLE` | First planned hire role | `engineer`, `designer`, `operations` |
| `CULTURE_VALUES_COUNT` | Number of core values | `3`, `5`, `7` |

> **Resolution:** Asked during Step 1 (Intake) for team size and work policy. Detailed hiring ops placeholders are resolved during Step 27 (Team Communication) and feed into sprint capacity planning.

---

## Data Privacy Engineering (16)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `PRIVACY_JURISDICTIONS` | Applicable privacy jurisdictions | `gdpr`, `ccpa`, `gdpr,ccpa,lgpd` |
| `DATA_SENSITIVITY_LEVEL` | Highest data sensitivity level | `high`, `medium`, `low` |
| `CONSENT_MODEL` | Default consent model | `opt-in`, `opt-out`, `legitimate-interest` |
| `DPO_REQUIRED` | Whether DPO is legally required | `true`, `false` |
| `DPO_CONTACT` | Data Protection Officer contact | `dpo@example.com` |
| `DSR_SLA_DAYS` | Days to fulfill data subject requests | `30`, `45` |
| `DATA_RETENTION_DEFAULT` | Default data retention period | `24-months`, `36-months`, `indefinite` |
| `COOKIE_CONSENT_PLATFORM` | Cookie consent management tool | `onetrust`, `cookiebot`, `custom` |
| `CROSS_BORDER_MECHANISM` | Transfer mechanism used | `adequacy`, `scc`, `bcr`, `none` |
| `PROCESSING_ACTIVITY_COUNT` | Number of processing activities | `8`, `15`, `30` |
| `SUB_PROCESSOR_COUNT` | Number of sub-processors | `3`, `8`, `15` |
| `PRIVACY_BY_DESIGN_LEVEL` | Privacy engineering maturity | `basic`, `intermediate`, `advanced` |
| `AUTOMATED_DECISIONS` | Whether automated decision-making used | `none`, `recommendations`, `scoring`, `legal-effect` |
| `DATA_CLASSIFICATION_LEVELS` | Number of classification tiers | `3`, `4` |
| `PURGE_AUTOMATION` | Automated data purging level | `manual`, `semi-automated`, `fully-automated` |
| `PRIVACY_SHIELD_REGION` | Primary data processing region | `eu-west-1`, `us-east-1` |

> **Resolution:** `PRIVACY_JURISDICTIONS` and `DATA_SENSITIVITY_LEVEL` are resolved during Step 1 (Intake) based on `COMPLIANCE_REQUIREMENTS`. Detailed privacy engineering placeholders are resolved during Step 29 (Legal Documents) and feed into service specs for consent flows, data retention, and DSR handling.

---

## Partner & Channel Strategy (14)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `PARTNER_CHANNEL` | Whether partner channel enabled | `true`, `false` |
| `PARTNER_MODEL` | Primary partnership model | `reseller`, `referral`, `technology`, `white-label` |
| `PARTNER_REVENUE_SHARE` | Default partner revenue share % | `20`, `30`, `40` |
| `PARTNER_TIER_COUNT` | Number of partner tiers | `1`, `3`, `4` |
| `PARTNER_PORTAL_TYPE` | Partner portal implementation | `built-in`, `partnerstack`, `manual` |
| `WHITE_LABEL_ENABLED` | Whether white-labeling offered | `true`, `false` |
| `AFFILIATE_ENABLED` | Whether affiliate program exists | `true`, `false` |
| `AFFILIATE_COMMISSION` | Affiliate commission percentage | `10`, `20`, `30` |
| `AFFILIATE_COOKIE_DAYS` | Affiliate tracking cookie duration | `30`, `60`, `90` |
| `PARTNER_ONBOARDING_DAYS` | Partner activation target days | `7`, `14`, `30` |
| `CHANNEL_CONFLICT_POLICY` | How channel conflicts resolved | `first-touch`, `deal-registration`, `territory` |
| `PARTNER_API_TIER` | API access level for partners | `basic`, `standard`, `premium` |
| `MARKETPLACE_LISTING` | Whether listed on partner marketplaces | `true`, `false` |
| `CO_MARKETING_BUDGET` | Monthly co-marketing budget | `0`, `2000`, `10000` |

> **Resolution:** `PARTNER_CHANNEL` is asked at Step 1 (Intake) as a boolean. If true, detailed partner placeholders are resolved during Step 19 (Marketing) and Step 25 (Financial Modeling) for revenue share projections. `PARTNER_MODEL` and `PARTNER_TIER_COUNT` drive partner portal service spec generation.

---

## Product-Led Growth (13)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `GROWTH_MODEL` | Primary growth model | `product-led`, `sales-led`, `hybrid` |
| `PLG_MOTION` | Primary PLG motion | `viral`, `usage-based`, `content-led`, `community-led` |
| `ACTIVATION_METRIC` | What defines activated user | `created-first-project`, `invited-teammate` |
| `TIME_TO_VALUE_TARGET` | Target time from signup to value | `5-minutes`, `1-hour`, `1-day` |
| `PQL_THRESHOLD` | PQL score threshold for sales | `70`, `80` |
| `PQL_SIGNALS` | Key PQL scoring signals | `feature-usage, team-size, engagement-frequency` |
| `SELF_SERVE_CEILING` | Max plan tier for self-serve | `pro`, `business`, `all` |
| `FREE_TIER_LIMITS` | Free tier usage limits | `3-projects, 1-user, 100mb` |
| `VIRAL_COEFFICIENT_TARGET` | Target K-factor | `0.5`, `1.0`, `1.5` |
| `EXPERIMENT_VELOCITY` | Growth experiments per month | `2`, `4`, `8` |
| `ANALYTICS_TOOL` | Product analytics platform | `amplitude`, `mixpanel`, `posthog`, `custom` |
| `PAYWALL_STRATEGY` | Where paywalls appear | `feature-based`, `usage-based`, `time-based`, `seat-based` |
| `UPGRADE_CONVERSION_TARGET` | Free-to-paid conversion rate target % | `3`, `5`, `10` |

> **Resolution:** `GROWTH_MODEL` is asked during Step 1 (Intake). If `product-led` or `hybrid`, PLG placeholders are resolved during Step 19 (Marketing) and Step 30 (Billing/Payments). `ACTIVATION_METRIC` and `TIME_TO_VALUE_TARGET` feed into onboarding service specs. `PQL_SIGNALS` and `PQL_THRESHOLD` feed into analytics and CRM integration specs.

---

## Customer Migration (12)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `MIGRATION_SUPPORT` | Whether migration tooling included | `true`, `false` |
| `MIGRATION_STRATEGY` | Primary migration approach | `self-serve`, `assisted`, `white-glove` |
| `IMPORT_FORMATS` | Supported import file formats | `csv`, `csv,xlsx,json` |
| `MAX_IMPORT_SIZE` | Maximum import file size | `10mb`, `100mb`, `1gb` |
| `IMPORT_RECORD_LIMIT` | Maximum records per import | `10000`, `100000`, `unlimited` |
| `COMPETITOR_IMPORTERS` | Competitors with dedicated import tools | `competitor-a, competitor-b` |
| `MIGRATION_QUEUE` | Job queue for background imports | `bull`, `rabbitmq`, `sqs` |
| `MIGRATION_WORKER_COUNT` | Number of import worker processes | `2`, `4`, `8` |
| `HISTORICAL_DATA_POLICY` | How much history to import | `full`, `rolling-12-months`, `summary-only` |
| `ROLLBACK_WINDOW_HOURS` | Hours users can undo migration | `24`, `48`, `168` |
| `IMPORT_NOTIFICATION_CHANNEL` | Completion notification method | `email`, `in-app`, `both` |
| `DATA_CLEANSING_LEVEL` | Auto cleaning aggressiveness | `minimal`, `moderate`, `aggressive` |

> **Resolution:** `MIGRATION_SUPPORT` is asked during Step 1 (Intake). If true, migration placeholders are resolved during Step 14 (Integrations) and feed into background job architecture, queue configuration, and import service specs. `COMPETITOR_IMPORTERS` is populated from Step 1 (Tribunal) competitive analysis.

---

## Marketplace & Plugin Ecosystem (16)

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `HAS_MARKETPLACE` | Whether marketplace/plugin ecosystem exists | `true`, `false` |
| `MARKETPLACE_TYPE` | Type of marketplace | `plugin`, `integration`, `theme`, `content` |
| `MARKETPLACE_GOVERNANCE` | Plugin governance model | `open`, `curated`, `partner-only` |
| `MARKETPLACE_MONETIZATION` | Marketplace monetization model | `free-only`, `revenue-share`, `listing-fee` |
| `PLATFORM_REVENUE_CUT` | Platform % of paid plugin revenue | `15`, `20`, `30` |
| `PLUGIN_ARCHITECTURE` | Plugin technical architecture | `iframe`, `api`, `sdk`, `hybrid` |
| `SDK_LANGUAGES` | SDK supported languages | `javascript`, `javascript,python,ruby` |
| `DEVELOPER_PROGRAM_SIZE` | Expected developer program scale | `small`, `medium`, `large` |
| `EXTENSION_POINT_COUNT` | Number of extension points | `5`, `10`, `20` |
| `PLUGIN_REVIEW_SLA_DAYS` | Days to review a plugin submission | `3`, `5`, `10` |
| `PLUGIN_SANDBOX_TYPE` | Sandboxing mechanism | `iframe`, `worker`, `container`, `none` |
| `DEVELOPER_PORTAL_URL` | Developer documentation URL | `https://developers.example.com` |
| `PLUGIN_API_VERSION` | Current plugin API version | `v1`, `v2` |
| `PLUGIN_RATE_LIMIT_DEFAULT` | Default rate limit for third-party apps | `100`, `1000` (requests/minute) |
| `MAX_PLUGIN_PERMISSIONS` | Maximum permission scopes per plugin | `5`, `10` |
| `DEVELOPER_SANDBOX_URL` | Sandbox environment URL | `https://sandbox.example.com` |

> **Resolution:** `HAS_MARKETPLACE` is asked during Step 1 (Intake). If true, marketplace placeholders are resolved during Step 14 (Integrations) and Step 32 (Deep Dive). `PLUGIN_ARCHITECTURE` and `SDK_LANGUAGES` feed into API and service spec generation. `MARKETPLACE_MONETIZATION` and `PLATFORM_REVENUE_CUT` feed into Step 25 (Financial Modeling) and Step 30 (Billing/Payments).

---

## Conditional Syntax Reference

Templates use three conditional styles depending on file type:

### Markdown files (most templates)
```markdown
<!-- IF {{DATABASE}} == "postgresql" -->
PostgreSQL-specific content here
<!-- ENDIF -->
```

### JavaScript/TypeScript files
```typescript
// <!-- IF {{FRONTEND_FRAMEWORK}} == "next" -->
import { useRouter } from 'next/navigation';
// <!-- ENDIF -->
```

### Config files (YAML, TOML, shell)
```yaml
# <!-- IF {{MONOREPO_TOOL}} == "turborepo" -->
turbo:
  tasks: ...
# <!-- ENDIF -->
```

### Boolean comparisons
Always use string values: `"true"` or `"false"` (not bare `true`/`false`):
```markdown
<!-- IF {{MULTI_TENANT}} == "true" -->
```

---

## Template-Instance Placeholders

These templates use **per-instance placeholders** — filled once per generated instance at the time the generator runs, NOT during project intake. They are not global project configuration and do not need to be resolved at Step 1.

| Template | Key Placeholders | Resolved During |
|----------|-----------------|-----------------|
| `03-documentation/spec-layer/catalogs/business-rule-reference.template.md` | `RULE_DOMAIN`, `SOURCE_AUTHORITY`, `STANDARD_VERSION`, `DOMAIN_PREFIX`, `RULE_COUNT`, `RULE_NAME` | Step 8.4 (Catalog Generation), once per rule domain (e.g., "NEMSIS Compliance", "Tax Rules") |
| `03-documentation/spec-layer/contracts/component-contract.template.md` | `COMPONENT_NAME`, `TIER`, `PROP_COUNT`, `SCREEN_LIST` | Step 8.1 (Component Catalog), once per complex component (3+ screens, 8+ props) |
| `32-integrations/integration-failure-spec.template.md` | `INTEGRATION_NAME`, `PROVIDER_NAME`, `CONNECT_TIMEOUT`, `READ_TIMEOUT`, `TOTAL_TIMEOUT`, `RETRY_COUNT`, `BASE_DELAY_MS`, `MAX_DELAY_MS`, `THRESHOLD`, `OPEN_DURATION`, `HALF_OPEN_COUNT` | Step 14.9 (Integrations), once per P0/P1 integration |

> **Note:** These placeholders are specific to each generated instance (each business rule domain, each component, each integration) and are not shared across the project. Refer to each template file for the complete placeholder list.

---

## Resolution Sources

| Source | Placeholders Resolved |
|--------|----------------------|
| **Auto-detected from codebase** | Stack, framework, ORM, paths, package manager, monorepo tool |
| **Asked during intake** | Project name/slug/description, MVP scope, team size, business info |
| **Derived from other values** | Commands (from PKG_MANAGER), URLs (from ports), paths (from framework) |
| **Sensible defaults** | Ports, page sizes, coverage targets, retention periods |
| **Per-instance at generation time** | Template-instance placeholders (see section above) |

---

*Generated from kit scan. Update when adding new placeholders to templates.*
