# Roadmap Gantt Chart — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub markdown, VS Code with Mermaid extension, Mermaid Live Editor).

Replace all `{{PLACEHOLDER}}` values with your project-specific dates and task names before rendering.

```mermaid
gantt
    title {{PROJECT_NAME}} — Project Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase 0: Foundation
        Project kickoff & planning          :done,    p0_1, {{PHASE_0_START_DATE}}, 7d
        Architecture & tech decisions       :done,    p0_2, after p0_1, 5d
        Dev environment & CI/CD setup       :done,    p0_3, after p0_1, 7d
        Design system & wireframes          :done,    p0_4, after p0_2, 7d
        Database schema design              :done,    p0_5, after p0_2, 5d
        Foundation complete                 :milestone, m0, after p0_5, 0d

    section Phase 1: Core MVP
        {{MVP_FEATURE_1}}                   :active,  p1_1, after m0, 14d
        {{MVP_FEATURE_2}}                   :active,  p1_2, after m0, 14d
        {{MVP_FEATURE_3}}                   :         p1_3, after p1_1, 10d
        {{MVP_FEATURE_4}}                   :         p1_4, after p1_2, 10d
        {{MVP_FEATURE_5}}                   :         p1_5, after p1_3, 7d
        Auth flows & user dashboard         :         p1_6, after p1_4, 7d
        Core MVP complete                   :milestone, m1, after p1_6, 0d

    section Phase 2: Enhanced
        {{ENHANCED_FEATURE_1}}              :         p2_1, after m1, 10d
        {{ENHANCED_FEATURE_2}}              :         p2_2, after m1, 10d
        {{ENHANCED_FEATURE_3}}              :         p2_3, after p2_1, 7d
        Notifications system                :         p2_4, after p2_2, 7d
        Reporting & analytics               :         p2_5, after p2_3, 7d
        Admin tooling                       :         p2_6, after p2_4, 5d
        Enhanced features complete          :milestone, m2, after p2_6, 0d

    section Testing & Stabilization
        End-to-end testing                  :         t1, after m2, 5d
        Load testing & security audit       :         t2, after t1, 5d
        Bug fixes & optimization            :         t3, after t2, 5d
        Testing complete                    :milestone, m3, after t3, 0d

    section Launch
        Staging deployment & UAT            :crit,    l1, after m3, 5d
        Final sign-off                      :crit,    l2, after l1, 3d
        Production deployment               :crit,    l3, after l2, 2d
        Launch                              :milestone, m4, after l3, 0d
```
