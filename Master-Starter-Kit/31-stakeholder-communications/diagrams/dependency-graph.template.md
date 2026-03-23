# Dependency Graph — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer. Replace all `{{PLACEHOLDER}}` values before rendering.

```mermaid
flowchart LR
    subgraph Foundation["Foundation (Phase 0)"]
        CICD["CI/CD Pipeline"]
        DS["Design System"]
        SCHEMA["Database Schema"]
        AUTH["Authentication<br/>({{AUTH_PROVIDER}})"]
    end

    subgraph CoreMVP["Core MVP (Phase 1)"]
        F1["{{MVP_FEATURE_1}}"]
        F2["{{MVP_FEATURE_2}}"]
        F3["{{MVP_FEATURE_3}}"]
        F4["{{MVP_FEATURE_4}}"]
        F5["{{MVP_FEATURE_5}}"]
        DASH["{{PERSONA_1}} Dashboard"]
    end

    subgraph Enhanced["Enhanced (Phase 2)"]
        E1["{{ENHANCED_FEATURE_1}}"]
        E2["{{ENHANCED_FEATURE_2}}"]
        E3["{{ENHANCED_FEATURE_3}}"]
        NOTIF["Notifications"]
        REPORT["Reporting & Analytics"]
        ADMIN["Admin Tools"]
    end

    subgraph Growth["Growth (Phase 3)"]
        G1["{{GROWTH_FEATURE_1}}"]
        G2["{{GROWTH_FEATURE_2}}"]
        G3["{{GROWTH_FEATURE_3}}"]
        API["Public API"]
        INTEG["Integrations Marketplace"]
    end

    subgraph External["External Dependencies"]
        EXT_PAY["{{PAYMENT_PROVIDER}}"]
        EXT_EMAIL["{{EMAIL_PROVIDER}}"]
        EXT_STORE["{{STORAGE_PROVIDER}}"]
        EXT_ANALYTICS["{{ANALYTICS_PROVIDER}}"]
    end

    %% Foundation dependencies
    CICD --> F1
    CICD --> F2
    DS --> DASH
    DS --> F1
    SCHEMA --> F1
    SCHEMA --> F2
    AUTH --> F1
    AUTH --> F2
    AUTH --> DASH

    %% Core MVP internal dependencies
    F1 --> F3
    F2 --> F4
    F3 --> F5
    F1 --> DASH
    F2 --> DASH

    %% Enhanced dependencies on Core MVP
    F1 --> E1
    F2 --> E2
    F3 --> E3
    DASH --> ADMIN
    F5 --> NOTIF
    F1 --> REPORT
    F2 --> REPORT

    %% Growth dependencies on Enhanced
    E1 --> G1
    E2 --> G2
    REPORT --> G3
    E3 --> API
    API --> INTEG

    %% External dependencies
    EXT_PAY -.->|"required for"| F2
    EXT_EMAIL -.->|"required for"| NOTIF
    EXT_STORE -.->|"required for"| F3
    EXT_ANALYTICS -.->|"required for"| REPORT

    %% Critical path highlighting
    style AUTH fill:#ff8a80
    style F1 fill:#ff8a80
    style F3 fill:#ff8a80
    style E1 fill:#ff8a80
    style G1 fill:#ff8a80

    style Foundation fill:#e3f2fd
    style CoreMVP fill:#e8f5e9
    style Enhanced fill:#fff3e0
    style Growth fill:#f3e5f5
    style External fill:#f5f5f5
```

**Legend:**
- Red-highlighted nodes indicate the **critical path** — the longest chain of dependent tasks that determines the minimum project duration.
- Dashed arrows from external services indicate **third-party dependencies** that require vendor setup or API access.
- Adjust node connections to match your actual feature dependency structure.
