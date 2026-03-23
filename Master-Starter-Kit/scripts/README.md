# Scripts

## validate-kit.sh

Self-validation script that checks the Master Starter Kit for completeness and consistency.

### Usage

```bash
cd Master-Starter-Kit/
bash scripts/validate-kit.sh
```

### What It Checks

1. **Core files** — ORCHESTRATOR.md, README.md, PLACEHOLDER-REGISTRY.md, VERSION, CLAUDE.md, etc.
2. **Section directories** — All 20 sections (00-19) exist
3. **Template count** — At least 150 template files present
4. **Example count** — At least 20 example files in `12-examples/`
5. **ORCHESTRATOR integrity** — Step continuity (0-28), gate checkpoints, STATE BLOCK, COMPLETED array
6. **Key template files** — Critical templates from architecture, docs, workflow sections
7. **Capabilities wiring** — Files in `11-new-capabilities/` that Step 17 references
8. **Placeholder registry** — Core placeholders are documented
9. **Version file** — Valid semver format

### Output

Each check prints PASS, FAIL, or WARN. Exit code 0 means all checks passed; exit code 1 means at least one failure was found.
