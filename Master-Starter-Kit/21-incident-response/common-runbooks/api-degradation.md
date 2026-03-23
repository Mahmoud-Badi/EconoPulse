# API Degradation Runbook

> Symptoms: High latency, elevated error rates, 429/500/503 responses | Likely Causes: Traffic spike, memory leak, CPU saturation, downstream dependency failure, bad deployment | Expected Resolution Time: 15-45 minutes

---

## Symptoms

- API response times exceed 2x normal baseline (e.g., P95 jumps from 300ms to 600ms+)
- Error rate climbs above 1% (normal baseline <0.1%)
- HTTP 500 (Internal Server Error) responses increasing
- HTTP 503 (Service Unavailable) responses appearing
- HTTP 429 (Too Many Requests) responses from rate limiting
- Client-side timeout errors reported by users or frontend monitoring
- Health check endpoint responds slowly or intermittently fails
- Load balancer marking instances as unhealthy
- CPU utilization >80% sustained across application servers
- Memory usage climbing steadily without leveling off (memory leak)
- Request queue depth growing (requests waiting to be processed)

---

## Diagnostic Steps

### 1. Confirm the Scope

```bash
# Check overall API health
curl -w "@curl-format.txt" -o /dev/null -s https://api.your-app.com/health

# Check error rates in your monitoring tool
# Look for: total requests, error count, error rate by endpoint

# Is it all endpoints or specific ones?
# Check your APM tool for per-endpoint latency and error rates
```

### 2. Check Resource Utilization

```bash
# CPU usage across application servers
# Look for: sustained >80%, single core at 100% (blocking code)

# Memory usage
# Look for: steady climb without plateauing (memory leak)
# Look for: OOM kills in system logs

# Disk I/O (if applicable)
# Look for: high I/O wait, saturated disk throughput

# Network
# Look for: high bandwidth utilization, connection limits, packet loss
```

### 3. Check for Traffic Anomalies

```bash
# Current request rate vs. normal baseline
# Look for: sudden spike (viral content, bot traffic, DDoS)

# Request patterns
# Look for: unusual user agents, IPs generating massive traffic
# Look for: automated/bot traffic hitting expensive endpoints

# Rate limiter status
# Are rate limits being hit? By whom?
```

### 4. Check Recent Deployments

```bash
# Was there a deployment in the last 2 hours?
# Check deployment logs and timestamps

# Compare current version metrics to previous version
# Look for: latency increase, error rate increase, memory usage increase

# Check the deployment diff — what changed?
```

### 5. Check Downstream Dependencies

```bash
# Database response times
# Check database connection pool, query latency, error rates

# Third-party API response times
# Check external service health pages
# Check your outbound request latency and error rates

# Cache hit rates
# A sudden drop in cache hit rate will increase load on backend
# Check Redis/Memcached connection and response times

# Message queue depth
# Growing queue depth means consumers cannot keep up
```

### 6. Check Application Logs

```bash
# Look for error patterns
# Common signals: OOM, connection refused, timeout, null pointer, stack overflow

# Look for error concentration
# Is it one endpoint, one server, one customer, or widespread?

# Look for panic/crash logs
# Application processes dying and restarting under load
```

---

## Mitigation Steps

### High Latency (No Errors Yet)

1. **Scale up** — Add more application instances or increase instance size
2. **Check and clear any bottleneck:** database slow queries, cache misses, external API delays
3. **Enable response caching** if not already active for the affected endpoints
4. **Reduce non-essential background work** — pause batch jobs, report generation, etc.
5. **Check if a recent deployment introduced a performance regression** — rollback if so

### Elevated Error Rates (5xx Errors)

1. **Check if a deployment caused it** — if yes, roll back immediately
2. **Check server health** — are instances crashing and restarting?
   - If OOM: increase memory or fix the leak (short-term: restart instances on a rolling basis)
   - If CPU: scale up or reduce traffic with rate limiting
3. **Check downstream dependencies** — is the API failing because a dependency is failing?
   - If database: see `database-outage.md`
   - If third-party: see `third-party-outage.md`
4. **Enable circuit breakers** for failing dependencies to prevent cascade
5. **Restart unhealthy instances** on a rolling basis (do not restart all at once)

### Rate Limit Breaches (429 Errors)

1. **Identify who is hitting rate limits** — legitimate traffic or abuse?
2. **If legitimate traffic spike:**
   - Temporarily increase rate limits
   - Scale up backend to handle the load
   - Enable or expand caching
3. **If abuse/bot traffic:**
   - Block offending IPs/user agents at the edge (WAF, CDN, or load balancer)
   - Tighten rate limits for unauthenticated requests
   - Enable CAPTCHA or challenge pages for suspicious traffic
4. **If DDoS:**
   - Enable DDoS protection at the CDN/edge level (Cloudflare, AWS Shield)
   - Notify your infrastructure/security team

### Memory Leak

1. **Identify the leaking process** — which server, which service?
2. **Restart the leaking instances** on a rolling basis to restore service
3. **Enable heap profiling** if available (do this on one instance, not all)
4. **Check recent deployments** for new dependencies, caching changes, or connection handling changes
5. **Set up automated restarts** as a temporary mitigation until the leak is fixed
6. **Create a ticket** for root cause investigation — memory leaks rarely fix themselves

### CPU Spike

1. **Identify the hot endpoint** — which API path is consuming the most CPU?
2. **Check for infinite loops or recursive calls** in recent code changes
3. **Check for expensive queries** triggered by the hot endpoint
4. **Scale horizontally** to distribute load across more instances
5. **Throttle or disable the expensive endpoint** if it is non-critical
6. **Roll back** if the CPU spike correlates with a deployment

---

## Resolution Steps

1. Confirm the root cause from diagnostics above
2. Implement the permanent fix (not just mitigation):
   - Fix the memory leak in code
   - Optimize the slow endpoint
   - Update rate limits to sustainable levels
   - Fix the failing dependency integration
3. Deploy the fix with canary/gradual rollout
4. Verify metrics return to baseline:
   - P50/P95/P99 latency at normal levels
   - Error rate <0.1%
   - CPU utilization <70%
   - Memory usage stable (not climbing)
   - Request throughput at expected levels
5. Monitor for 30 minutes for recurrence
6. Remove temporary mitigations (extra instances, increased rate limits, disabled features)

---

## Prevention

- **Set up latency alerts** at P95 and P99 percentiles, not just averages (averages hide problems)
- **Set up error rate alerts** with dynamic thresholds that account for baseline variance
- **Implement circuit breakers** for all downstream dependencies
- **Load test regularly** to know your capacity limits before you hit them in production
- **Profile memory and CPU** in staging with production-like traffic patterns
- **Use canary deployments** — route 5% of traffic to new code before full rollout
- **Implement request timeouts** at every layer (client, load balancer, application, database)
- **Cache aggressively** — every cache hit is a request that did not hit your backend
- **Rate limit by default** — every API endpoint should have a rate limit, even generous ones
- **Monitor third-party dependency latency** as carefully as your own — their problems become your problems
