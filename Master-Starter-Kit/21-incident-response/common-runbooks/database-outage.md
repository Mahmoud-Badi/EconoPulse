# Database Outage Runbook

> Symptoms: Connection errors, query timeouts, 500 errors on all write operations | Likely Causes: Connection pool exhaustion, disk full, replication lag, misconfiguration, deadlocks | Expected Resolution Time: 15-60 minutes

---

## Symptoms

- Application returns 500 errors on pages that require database access
- "Connection refused" or "too many connections" errors in application logs
- Query timeouts exceeding normal thresholds (>5s for reads, >10s for writes)
- Connection pool metrics show 100% utilization
- Replication lag alerts firing (replica >30s behind primary)
- Disk usage alerts on database server (>85% full)
- Slow query log filling rapidly
- Application health check endpoint fails (if it checks DB connectivity)
- Background jobs failing with database errors
- Write operations fail but reads still work (or vice versa)

---

## Diagnostic Steps

### 1. Confirm the Issue Is Database-Related

```bash
# Check application error logs for database-specific errors
# Look for: connection refused, timeout, too many connections, deadlock

# Check the database health endpoint (if you have one)
curl -s https://your-app.com/health/db

# Check application error rates — are they correlated with DB metrics?
# Open your monitoring dashboard and correlate error spike with DB metrics
```

### 2. Check Database Server Status

```bash
# Is the database process running?
# For PostgreSQL:
pg_isready -h <host> -p 5432

# For MySQL:
mysqladmin ping -h <host>

# Check database server resource usage
# CPU, memory, disk I/O, network — look for anything maxed out
```

### 3. Check Connection Pool Status

```bash
# PostgreSQL — check active connections
SELECT count(*) FROM pg_stat_activity;
SELECT max_conn FROM pg_settings WHERE name = 'max_connections';

# Check connections by state
SELECT state, count(*) FROM pg_stat_activity GROUP BY state;

# Check connections by application
SELECT application_name, count(*) FROM pg_stat_activity GROUP BY application_name;

# Look for idle connections that should have been released
SELECT * FROM pg_stat_activity WHERE state = 'idle' AND query_start < now() - interval '5 minutes';
```

### 4. Check Disk Space

```bash
# Check database disk usage
df -h /var/lib/postgresql/data  # PostgreSQL
df -h /var/lib/mysql            # MySQL

# Check for large tables or indexes
# PostgreSQL:
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 10;
```

### 5. Check Replication Status

```bash
# PostgreSQL — check replication lag on replica
SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;

# PostgreSQL — check replication status on primary
SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn,
       (sent_lsn - replay_lsn) AS byte_lag
FROM pg_stat_replication;

# MySQL — check replication status on replica
SHOW SLAVE STATUS\G
# Look for: Seconds_Behind_Master, Slave_IO_Running, Slave_SQL_Running
```

### 6. Check for Long-Running Queries and Deadlocks

```bash
# PostgreSQL — find long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '1 minute'
ORDER BY duration DESC;

# PostgreSQL — check for locks
SELECT blocked_locks.pid AS blocked_pid,
       blocking_locks.pid AS blocking_pid,
       blocked_activity.query AS blocked_query,
       blocking_activity.query AS blocking_query
FROM pg_locks blocked_locks
JOIN pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

---

## Mitigation Steps

### Connection Pool Exhaustion

1. **Kill idle connections** that are holding pool slots:
   ```sql
   -- PostgreSQL: terminate idle connections older than 10 minutes
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity
   WHERE state = 'idle' AND query_start < now() - interval '10 minutes';
   ```
2. **Restart the application** to reset the connection pool
3. **Temporarily increase max connections** if the database server can handle it
4. **Identify the connection leak** — check which application or job is not releasing connections

### Disk Space Full

1. **Identify the largest consumers:**
   ```bash
   du -sh /var/lib/postgresql/data/*
   ```
2. **Clear WAL/binlog archives** if they are safe to remove
3. **Vacuum the database** (PostgreSQL):
   ```sql
   VACUUM FULL; -- WARNING: This locks tables. Use VACUUM (without FULL) first.
   ```
4. **Delete old backups or logs** from the database disk
5. **Expand the disk** if on cloud infrastructure (EBS volume resize, etc.)

### Replication Lag

1. **Check if the replica is still replicating** (connection active, no errors)
2. **Reduce write load** on primary if possible (pause non-critical background jobs)
3. **Check replica resources** — is it CPU/IO bound?
4. **If lag is >5 minutes:** Redirect all reads to primary temporarily to avoid serving stale data
5. **If replica is broken:** Rebuild from a fresh snapshot of the primary

### Query Timeouts / Slow Queries

1. **Kill the offending long-running queries:**
   ```sql
   -- PostgreSQL
   SELECT pg_cancel_backend(<pid>);    -- Gentle: cancel the query
   SELECT pg_terminate_backend(<pid>); -- Forceful: kill the connection
   ```
2. **Check for missing indexes** on the slow query
3. **Check if table statistics are stale:**
   ```sql
   ANALYZE <table_name>;
   ```
4. **Check for table bloat** and run VACUUM if needed

### Complete Database Unavailability

1. **Check if the process is running.** Restart if not.
2. **Check cloud provider status** (RDS, Cloud SQL, etc.) for regional issues
3. **Failover to replica** if available and replication lag is acceptable
4. **Restore from backup** as a last resort — check your RPO (Recovery Point Objective)
5. **Notify stakeholders** — this is likely a SEV1

---

## Resolution Steps

1. Confirm the root cause from the diagnostic steps above
2. Implement the appropriate fix (not just the mitigation)
3. Verify database metrics return to baseline:
   - Connection count within normal range
   - Query latency at normal levels
   - Disk usage has headroom (>20% free)
   - Replication lag <1 second
4. Verify application error rates return to normal
5. Monitor for 30 minutes for recurrence
6. Remove any temporary mitigations (increased connection limits, paused jobs)

---

## Prevention

- **Monitor connection pool utilization** with alerts at 70% (warn) and 90% (critical)
- **Set query timeout limits** at the application and database level (e.g., 30s for web requests, 5m for background jobs)
- **Monitor disk usage** with alerts at 70% and 85%
- **Set up replication lag alerts** at 10s (warn) and 60s (critical)
- **Run VACUUM/ANALYZE on a schedule** (PostgreSQL) or OPTIMIZE TABLE (MySQL)
- **Use connection pooling** (PgBouncer for PostgreSQL, ProxySQL for MySQL) to prevent pool exhaustion
- **Test your backup restoration process** quarterly — a backup you cannot restore is not a backup
- **Implement slow query logging** and review weekly
- **Use read replicas** to offload read traffic from the primary
- **Set up automated disk expansion** if your cloud provider supports it
