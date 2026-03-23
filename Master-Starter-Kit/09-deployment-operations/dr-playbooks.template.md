# Disaster Recovery Playbooks

> Scenario-specific recovery procedures for **{{PROJECT_NAME}}**. Each playbook is standalone — hand it to the on-call engineer and they can execute without prior context. Review and drill quarterly.

---

## Playbook 1: Database Corruption

**Severity:** Critical | **Detection:** Integrity checks fail, constraint violations, users report missing data.

**Immediate (0-15 min):** Confirm scope (single table vs. full DB). Set read-only mode: `{{READ_ONLY_MODE_COMMAND}}`. Alert {{INCIDENT_CHANNEL}}. Snapshot corrupted state for forensics.

**Short-Term (15 min - 4 hr):** Find last good backup: `{{BACKUP_LIST_COMMAND}}`. Spin up recovery instance. Execute point-in-time recovery: `{{PITR_COMMAND}}`. Validate against integrity checks.

**Recovery:** Restore to primary. Replay valid transactions. Run `{{DATA_VALIDATION_SCRIPT}}`. Remove read-only mode. Monitor 2 hours.

**Verify:** All tables pass integrity checks. Health endpoint returns 200. Sample queries correct for {{VERIFICATION_TENANT}}.

**Prevent:** WAL archiving enabled. Daily integrity checks: `{{INTEGRITY_CHECK_COMMAND}}`. Backup retention: {{BACKUP_RETENTION_DAYS}} days.

---

## Playbook 2: Hosting Provider Outage

**Severity:** High | **Detection:** {{UPTIME_MONITOR}} alerts, {{HOSTING_PROVIDER}} status page shows incident.

**Immediate (0-15 min):** Check `{{HOSTING_STATUS_URL}}`. Confirm provider-side outage. Post on {{STATUS_PAGE_URL}}. Alert {{INCIDENT_CHANNEL}}.

**Short-Term (15 min - 4 hr):** If estimate > 1 hour, failover to {{FAILOVER_PROVIDER}}. Update DNS: `{{DNS_FAILOVER_COMMAND}}`. Check replication lag: `{{REPLICATION_CHECK_COMMAND}}`.

**Recovery:** When primary recovers, verify fully operational. Sync failover data back. Restore DNS: `{{DNS_RESTORE_COMMAND}}`. Update status page.

**Verify:** Primary health check passes. DNS propagated. No data loss. Status page updated.

---

## Playbook 3: Ransomware Response

**Severity:** Critical | **Detection:** Files encrypted, ransom notes, mass file modification alerts.

**Immediate (0-15 min):** Isolate affected systems from network. Do NOT power off (preserve memory). Alert {{INCIDENT_CHANNEL}}, {{SECURITY_CONTACT}}, {{LEGAL_CONTACT}}. Do NOT pay ransom or contact attacker.

**Short-Term (15 min - 4 hr):** Identify variant and infection vector. Assess blast radius. Rotate all credentials: `{{CREDENTIAL_ROTATION_SCRIPT}}`. Engage IR firm: {{IR_FIRM_CONTACT}}.

**Recovery:** Restore from clean backups (verify not infected). Rebuild from infrastructure-as-code. Re-deploy from clean Git. Add access controls before going live.

**Prevent:** MFA on all infra accounts. Offline/air-gapped backups. Quarterly security audits. Patch within {{PATCH_SLA_DAYS}} days.

---

## Playbook 4: Data Center / Region Loss

**Severity:** Critical | **Detection:** Complete connectivity loss to {{PRIMARY_REGION}}, provider confirms regional outage.

**Immediate (0-15 min):** Confirm regional outage. Activate {{FAILOVER_REGION}}. Post on {{STATUS_PAGE_URL}}.

**Short-Term (15 min - 4 hr):** Promote read replica: `{{PROMOTE_REPLICA_COMMAND}}`. Update DNS. Verify replication lag within {{MAX_REPLICATION_LAG}}. Scale failover to full load.

**Recovery:** Do NOT switch back immediately — verify primary for 24 hours. Re-establish replication. Schedule controlled switchback window.

---

## Playbook 5: Key Person Unavailable

**Severity:** Medium | **Detection:** Team member with critical knowledge unreachable > {{KEY_PERSON_SLA_HOURS}} hours.

**Immediate (0-15 min):** Attempt all contact channels. Check `{{KNOWLEDGE_BASE_PATH}}` for needed knowledge. Assign temporary owner.

**Short-Term (15 min - 4 hr):** Review their recent commits/PRs. Check `dev_docs/` and `CLAUDE.md`. Use deployment runbook: `{{DEPLOYMENT_RUNBOOK_PATH}}`. Use infra access guide: `{{INFRA_ACCESS_PATH}}`.

**Prevent:** No single points of knowledge (2+ people per critical system). Up-to-date runbooks. Quarterly knowledge transfer. Document tribal knowledge in `dev_docs/decisions/`.

---

## Playbook 6: Vendor Discontinuation

**Severity:** Medium | **Detection:** Vendor announces EOL, acquisition, or unviable pricing change.

**Immediate (0-15 min):** Confirm announcement. Identify timeline. Alert team and stakeholders.

**Short-Term (15 min - 4 hr):** Inventory vendor touchpoints: `{{VENDOR_GREP_COMMAND}}`. Review API contract registry. Identify alternatives. Estimate migration effort.

**Recovery:** Select replacement vendor. Implement adapter pattern. Run parallel for {{PARALLEL_RUN_WEEKS}} weeks. Cut over. Remove old vendor code.

---

## Playbook 7: Mass Data Breach

**Severity:** Critical | **Detection:** Unauthorized data access in logs, external exposure report, security researcher disclosure.

<!-- IF {{COMPLIANCE_LEVEL}} == "hipaa" -->
**HIPAA:** Notify HHS within 60 days (if > 500 individuals). Individual notification within 60 days. Media notification if > 500 in one state.
<!-- ENDIF -->

**Immediate (0-15 min):** Confirm unauthorized access. Contain: revoke credentials, block IPs, disable API keys. Alert {{SECURITY_CONTACT}}, {{LEGAL_CONTACT}}, {{EXECUTIVE_CONTACT}}. Preserve all logs.

**Short-Term (15 min - 4 hr):** Determine scope (data, records, tenants). Identify attack vector. Patch vulnerability. Engage legal and forensics: {{FORENSICS_FIRM_CONTACT}}.

**Recovery:** Complete forensic investigation. Notify affected individuals ({{NOTIFICATION_DEADLINE}}). Notify regulators. Offer credit monitoring if PII exposed. Publish post-incident report.

**Prevent:** Quarterly pen testing. Encrypt PII at rest and in transit. Least-privilege access. Audit logging on all data access. IR retainer with {{IR_FIRM_CONTACT}}.

---

## Drill Schedule

| Quarter | Drill | Participants | Duration |
|---------|-------|-------------|----------|
| Q1 | Database recovery from backup | Backend team | 2 hours |
| Q2 | Hosting failover | DevOps + backend | 3 hours |
| Q3 | Key person scenario | Full team | 1 hour |
| Q4 | Tabletop: breach response | Full team + legal | 2 hours |

After each drill, update the relevant playbook with findings and timing data.
