# Disaster Recovery Plan — {{PROJECT_NAME}}

## Recovery Objectives

| Metric | Target | Current |
|--------|--------|---------|
| **RPO** (Recovery Point Objective) | {{RPO_TARGET}} | |
| **RTO** (Recovery Time Objective) | {{RTO_TARGET}} | |
| **MTTR** (Mean Time to Recovery) | {{MTTR_TARGET}} | |

*RPO = max data you can afford to lose. RTO = max downtime you can afford.*

## Backup Strategy

### Database

| Database | Backup Type | Frequency | Retention | Storage |
|----------|-------------|-----------|-----------|---------|
| {{DATABASE}} (primary) | Automated snapshot | Every {{DB_BACKUP_FREQUENCY}} | {{DB_BACKUP_RETENTION}} | {{BACKUP_STORAGE}} |
| {{DATABASE}} (primary) | WAL/binlog streaming | Continuous | 7 days | {{BACKUP_STORAGE}} |
| Redis (cache) | RDB snapshot | Every 6 hours | 3 days | {{BACKUP_STORAGE}} |

**Backup verification schedule:** Test restore every {{BACKUP_TEST_FREQUENCY}} (monthly minimum).

### File Storage

| Storage | Backup Method | Frequency | Retention |
|---------|--------------|-----------|-----------|
| User uploads | Cross-region replication | Real-time | Indefinite |
| Generated files | Daily sync | 24 hours | 30 days |
| Configuration | Git (version controlled) | On change | Indefinite |

### Application State

| State | Recovery Method |
|-------|----------------|
| Environment variables | Stored in {{SECRET_MANAGER}} — versioned |
| Feature flags | Stored in {{FEATURE_FLAG_PROVIDER}} — replicated |
| Session data | Redis — ephemeral, users re-auth on loss |
| Cron schedules | Defined in code — redeployed with app |

## Failure Scenarios

### Scenario 1: Database Corruption or Loss

**Severity:** Critical
**RPO Impact:** Up to {{DB_BACKUP_FREQUENCY}} of data loss

**Recovery steps:**
1. Identify scope of corruption (single table vs entire database)
2. Stop writes to affected tables (enable maintenance mode)
3. Restore from latest verified backup
4. Apply WAL/binlog to recover transactions since last backup
5. Validate data integrity with checksums
6. Resume normal operations
7. Post-incident: verify backup frequency is sufficient

### Scenario 2: Complete Infrastructure Failure

**Severity:** Critical
**RTO Impact:** Full environment rebuild required

**Recovery steps:**
1. Activate incident response (see `21-incident-response/`)
2. Deploy to backup region/provider using IaC templates
3. Restore database from cross-region backup
4. Update DNS to point to new infrastructure
5. Verify all services are healthy
6. Resume normal operations

### Scenario 3: Accidental Data Deletion

**Severity:** High
**RPO Impact:** Depends on soft-delete implementation

**Recovery steps:**
<!-- IF {{SOFT_DELETE}} == "true" -->
1. Check soft-deleted records first (`deleted_at IS NOT NULL`)
2. If found: restore by setting `deleted_at = NULL`
3. If not found: restore from point-in-time backup
<!-- ELSE -->
1. Identify affected records from application logs
2. Restore from latest backup
3. Manually replay transactions from logs if needed
<!-- ENDIF -->

### Scenario 4: Security Breach

**Severity:** Critical

**Recovery steps:**
1. Isolate affected systems immediately
2. Rotate all credentials and API keys
3. Revoke all active sessions
4. Audit access logs for scope of breach
5. Restore from pre-breach backup if data was modified
6. Notify affected users per legal requirements
7. Engage security team for forensic analysis

## Recovery Testing Schedule

| Test | Frequency | Last Tested | Next Due |
|------|-----------|-------------|----------|
| Database restore from backup | Monthly | | |
| Full environment rebuild | Quarterly | | |
| Failover to backup region | Quarterly | | |
| Data deletion recovery | Monthly | | |
| Incident response drill | Quarterly | | |

## Contacts

| Role | Name | Contact |
|------|------|---------|
| Incident Commander | {{INCIDENT_COMMANDER}} | |
| Database Admin | {{DBA_CONTACT}} | |
| Infrastructure Lead | {{INFRA_LEAD}} | |
| Security Lead | {{SECURITY_LEAD}} | |
| Legal/Compliance | {{LEGAL_CONTACT}} | |

## Post-Recovery Checklist

- [ ] All services healthy and responding
- [ ] Database integrity verified (row counts, checksums)
- [ ] No data loss beyond RPO threshold
- [ ] All external integrations reconnected
- [ ] Monitoring and alerting confirmed operational
- [ ] User-facing functionality manually tested
- [ ] Incident postmortem scheduled
- [ ] Backup schedule reviewed and adjusted if needed
