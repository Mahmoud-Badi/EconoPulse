# Backup and Recovery Plan

> Defines how {{PROJECT_NAME}} protects against data loss, how quickly it can recover, and what to do when things go wrong. Review quarterly; test recovery procedures at least once per quarter.

---

## Recovery Objectives

| Metric | Definition | Target | Justification |
|--------|-----------|--------|---------------|
| **RPO** (Recovery Point Objective) | Maximum acceptable data loss measured in time | {{RPO, e.g., 1 hour}} | {{REASON, e.g., "Transactional data is critical, 1 hour max loss"}} |
| **RTO** (Recovery Time Objective) | Maximum acceptable downtime | {{RTO, e.g., 4 hours}} | {{REASON, e.g., "Users expect availability but not 99.99% SLA"}} |

RPO determines backup frequency. RTO determines how fast your recovery procedures must be.

---

## Database Backup

### Automated Backups

**Supabase (managed):**
- Automatic daily backups included on Pro plan (7-day retention)
- Point-in-time recovery available on Pro plan (up to 7 days)
- No configuration needed; verify in Dashboard > Settings > Database > Backups

**Self-hosted PostgreSQL:**
```bash
# Daily backup via cron — add to crontab with `crontab -e`
0 2 * * * pg_dump -Fc -h {{DB_HOST}} -U {{DB_USER}} {{DB_NAME}} \
  > /backups/{{DB_NAME}}_$(date +\%Y\%m\%d).dump \
  && gzip /backups/{{DB_NAME}}_$(date +\%Y\%m\%d).dump

# Retention: keep 30 days of daily backups
0 3 * * * find /backups -name "*.dump.gz" -mtime +30 -delete
```

**AWS RDS:**
- Enable automated backups in RDS console (default: 7-day retention, configurable to 35 days)
- Automated snapshots taken daily during the backup window
- Enable "Copy tags to snapshots" for cost tracking

### Point-in-Time Recovery

**PostgreSQL WAL Archiving:**
```bash
# In postgresql.conf
archive_mode = on
archive_command = 'aws s3 cp %p s3://{{BUCKET}}/wal/%f'
```
This allows recovery to any point in time, not just the last snapshot.

**RDS:** Point-in-time recovery is automatic — restore to any second within the retention period via the AWS console.

---

## Backup Verification Testing

Backups that have never been tested are not backups. Schedule monthly verification.

### Monthly Restore Test Procedure

1. **Provision a test environment** (separate database instance, not production)
2. **Restore the latest backup:**
   ```bash
   # PostgreSQL
   pg_restore -h {{TEST_DB_HOST}} -U {{DB_USER}} -d {{TEST_DB_NAME}} \
     /backups/latest.dump.gz

   # RDS: Restore snapshot to a new instance via AWS Console
   ```
3. **Verify data integrity:**
   - [ ] Row counts match expected values (compare with production)
   - [ ] Spot-check 5 recent records for correctness
   - [ ] Run application health checks against the restored database
4. **Record the result** in the backup verification log:

| Date | Backup Source | Restore Time | Data Verified | Result | Notes |
|------|--------------|-------------|---------------|--------|-------|
| {{DATE}} | Daily snapshot | {{MINUTES}} min | Yes | Pass | |

5. **Tear down** the test environment to avoid cost

---

## File Storage Backup

### S3 / Cloudflare R2

- **Enable versioning** on all buckets containing user data:
  ```bash
  aws s3api put-bucket-versioning --bucket {{BUCKET}} \
    --versioning-configuration Status=Enabled
  ```
- **Cross-region replication** for critical assets:
  ```bash
  # Configure replication rule in AWS Console or via Terraform
  # Source: {{PRIMARY_REGION}}  →  Destination: {{DR_REGION}}
  ```
- **Lifecycle rules:** Transition old versions to Glacier after 30 days, delete after 90 days

### Supabase Storage
- Files stored in S3-compatible storage with Supabase-managed backups
- For critical files, maintain a secondary copy in a separate S3 bucket using a nightly sync job

---

## Application State Backup

Not all critical state lives in the database. Back up these items too:

| Item | Location | Backup Method | Frequency |
|------|----------|--------------|-----------|
| Environment variables | {{PLATFORM}} dashboard | Export to encrypted file in password manager | On every change |
| API keys and secrets | {{SECRET_MANAGER}} | Stored in secret manager with versioning | On every change |
| DNS configuration | {{DNS_PROVIDER}} | Export zone file, store in git | On every change |
| CI/CD configuration | `.github/workflows/` | In git (already versioned) | Automatic |
| Infrastructure config | Terraform/Pulumi state | Remote state backend with versioning | Automatic |
| SSL certificates | {{PROVIDER}} | Usually auto-renewed; document manual steps if applicable | Before expiry |

---

## Disaster Recovery Scenarios

### Scenario 1: Database Corruption
| Step | Action | Owner | Time Estimate |
|------|--------|-------|--------------|
| 1 | Detect via monitoring alert or user report | On-call | 0-15 min |
| 2 | Stop writes to prevent further corruption (enable maintenance mode) | On-call | 5 min |
| 3 | Identify corruption scope (which tables, when it started) | DBA/Lead | 15-30 min |
| 4 | Restore from point-in-time backup to just before corruption | DBA/Lead | 30-60 min |
| 5 | Verify restored data, disable maintenance mode | Team | 15-30 min |
| 6 | Post-mortem: identify root cause | Team | Next day |

### Scenario 2: Region Outage
| Step | Action | Owner | Time Estimate |
|------|--------|-------|--------------|
| 1 | Detect via uptime monitoring (Vercel/AWS status page) | On-call | 0-5 min |
| 2 | Assess: is it a brief blip or sustained outage? | On-call | 15 min |
| 3 | If sustained: failover DNS to secondary region | DevOps | 15-30 min |
| 4 | Promote read replica to primary (if multi-region DB) | DBA/Lead | 15-30 min |
| 5 | Verify application functionality in the failover region | Team | 15 min |
| 6 | When primary region recovers: resync data, fail back | DevOps | 1-2 hours |

### Scenario 3: Account Compromise
| Step | Action | Owner | Time Estimate |
|------|--------|-------|--------------|
| 1 | Detect via unusual activity alerts or reports | Anyone | Variable |
| 2 | Rotate ALL credentials (API keys, database passwords, OAuth secrets) | Lead | 30-60 min |
| 3 | Review audit logs for unauthorized changes | Lead | 1-2 hours |
| 4 | Restore any modified data from backup | DBA/Lead | 30-60 min |
| 5 | Enable/verify 2FA on all service accounts | Team | 30 min |
| 6 | Notify affected users if user data was exposed | Lead/Legal | Same day |

---

## Failover Procedures

### DNS Failover
- Use a DNS provider that supports health checks and automatic failover (Cloudflare, Route 53)
- Configure health check on primary endpoint; failover to secondary IP/CNAME on failure
- TTL should be low enough for fast propagation (60-300 seconds)

### Read Replica Promotion (PostgreSQL/RDS)
```bash
# RDS: Promote read replica via AWS Console or CLI
aws rds promote-read-replica --db-instance-identifier {{REPLICA_ID}}
# Update connection string in application config / environment variables
```

### Blue-Green Deployment Rollback
- If a deployment causes issues, route traffic back to the previous (blue) environment
- On Vercel: revert to previous deployment via dashboard (instant)
- On AWS: update load balancer target group to point to the blue environment

---

## Incident Response Timeline

When an incident occurs, follow this timeline:

| Phase | Timeframe | Actions |
|-------|-----------|---------|
| **Detect** | 0-5 min | Automated alert fires or user reports issue |
| **Assess** | 5-15 min | Determine severity (P1-P4), identify affected systems |
| **Communicate** | 15-20 min | Notify stakeholders, update status page if applicable |
| **Recover** | 20 min - {{RTO}} | Execute the appropriate recovery procedure above |
| **Verify** | After recovery | Confirm all systems operational, data integrity intact |
| **Post-mortem** | Within 48 hours | Document timeline, root cause, action items to prevent recurrence |

---

## Backup Cost vs Risk Assessment

| Backup Level | Monthly Cost | RPO Achieved | RTO Achieved | Protects Against |
|-------------|-------------|-------------|-------------|-----------------|
| Daily snapshots only | ~$5-20 | 24 hours | 1-4 hours | Accidental deletion, corruption |
| + Point-in-time recovery | ~$10-40 | Minutes | 1-2 hours | Any data loss scenario |
| + Cross-region replication | ~$30-100 | Minutes | 30 min | Regional outages |
| + Multi-cloud backup | ~$50-200 | Minutes | 1-2 hours | Provider-level outages |

**Recommendation for most projects:** Daily snapshots + point-in-time recovery provides strong protection at low cost. Add cross-region replication only if your RTO requires it or if you serve a global user base.
