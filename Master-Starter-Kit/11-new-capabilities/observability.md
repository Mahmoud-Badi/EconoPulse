# Observability

## Purpose

Set up production observability across the three pillars (logs, metrics, traces) so your team can detect, diagnose, and resolve incidents quickly. This guide prioritizes practical, cost-effective tooling suitable for startups through mid-stage companies.

## The Three Pillars

| Pillar  | What It Answers                        | Tool Examples                       |
| ------- | -------------------------------------- | ----------------------------------- |
| Logs    | What happened? What was the context?   | Structured JSON logs, Loki, Datadog |
| Metrics | How is the system performing overall?  | Prometheus, Grafana, CloudWatch     |
| Traces  | Where did this specific request spend time? | OpenTelemetry, Jaeger, Sentry  |

All three are needed. Logs alone cannot show you latency trends. Metrics alone cannot explain why one request failed. Traces alone cannot show aggregate error rates.

## OpenTelemetry Setup (Node.js)

```bash
npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-http @opentelemetry/exporter-metrics-otlp-http
```

```typescript
// instrumentation.ts (load before anything else)
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

const sdk = new NodeSDK({
  serviceName: "{{PROJECT_NAME}}",
  traceExporter: new OTLPTraceExporter({
    url: "{{OTEL_COLLECTOR_URL}}/v1/traces", // e.g., http://localhost:4318/v1/traces
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: "{{OTEL_COLLECTOR_URL}}/v1/metrics",
    }),
    exportIntervalMillis: 30_000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": { enabled: false }, // noisy; disable
    }),
  ],
});

sdk.start();
process.on("SIGTERM", () => sdk.shutdown());
```

For Next.js, add to `next.config.js`:

```javascript
// next.config.js
module.exports = {
  experimental: { instrumentationHook: true },
};
```

## Distributed Tracing Configuration

Trace context propagates automatically via `traceparent` HTTP headers when using OpenTelemetry auto-instrumentation. For custom spans:

```typescript
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("{{PROJECT_NAME}}");

export async function processOrder(orderId: string) {
  return tracer.startActiveSpan("processOrder", async (span) => {
    try {
      span.setAttribute("order.id", orderId);
      const result = await chargePayment(orderId);
      span.setAttribute("payment.status", result.status);
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: 2, message: (error as Error).message }); // ERROR status
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## Health Check Endpoint Template

```typescript
// app/api/health/route.ts
interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: Record<string, { status: "pass" | "fail"; latencyMs: number; message?: string }>;
}

export async function GET(): Promise<Response> {
  const checks: HealthCheck["checks"] = {};

  // Database check
  const dbStart = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = { status: "pass", latencyMs: Date.now() - dbStart };
  } catch (e) {
    checks.database = { status: "fail", latencyMs: Date.now() - dbStart, message: (e as Error).message };
  }

  // Redis check
  const redisStart = Date.now();
  try {
    await redis.ping();
    checks.redis = { status: "pass", latencyMs: Date.now() - redisStart };
  } catch (e) {
    checks.redis = { status: "fail", latencyMs: Date.now() - redisStart, message: (e as Error).message };
  }

  const allPassing = Object.values(checks).every((c) => c.status === "pass");
  const anyFailing = Object.values(checks).some((c) => c.status === "fail");

  const health: HealthCheck = {
    status: anyFailing ? "unhealthy" : allPassing ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "unknown",
    checks,
  };

  return Response.json(health, { status: health.status === "unhealthy" ? 503 : 200 });
}
```

Create a separate `/api/ready` endpoint for Kubernetes readiness probes that includes dependency checks, versus `/api/health` (liveness) which just confirms the process is running.

## Uptime Monitoring Setup

Use an external service to monitor your health endpoint from outside your infrastructure.

| Service       | Free Tier               | Setup                                    |
| ------------- | ----------------------- | ---------------------------------------- |
| UptimeRobot   | 50 monitors, 5-min      | Add `{{BASE_URL}}/api/health`, expect 200|
| Better Stack   | 5 monitors, 3-min      | Add URL + status page                   |
| Checkly       | 5 checks, browser checks| API + browser monitoring                 |

Configure at minimum:
- `{{BASE_URL}}/api/health` checked every 1-5 minutes.
- Alert via Slack / email / PagerDuty on 2 consecutive failures.
- A public status page at `status.{{DOMAIN}}` (Better Stack or Instatus).

## Alerting Rules

Define alerts based on symptoms, not causes. Start with these essentials:

| Alert                       | Condition                           | Severity | Action                      |
| --------------------------- | ----------------------------------- | -------- | --------------------------- |
| High Error Rate             | 5xx rate > 5% for 5 min            | Critical | Page on-call                |
| Elevated Latency            | p95 latency > 2s for 5 min         | Warning  | Notify Slack                |
| Health Check Down           | 2+ consecutive failures             | Critical | Page on-call                |
| Disk Usage High             | Disk > 85%                          | Warning  | Notify Slack                |
| Database Connection Pool    | Active connections > 80% of max     | Warning  | Notify Slack                |
| Queue Depth Growing         | Queue size > 1000 for 10 min        | Warning  | Investigate backlog         |

## Structured Logging Format

Use JSON logs with consistent fields. Plain text logs are impossible to query at scale.

```typescript
// lib/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: "{{PROJECT_NAME}}",
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
  },
});

// Usage
logger.info({ userId: "usr_123", action: "login", method: "google" }, "User logged in");
logger.error({ err, orderId: "ord_456", traceId }, "Payment processing failed");
```

Output format:

```json
{
  "level": "info",
  "time": "2026-02-18T10:30:00.000Z",
  "service": "{{PROJECT_NAME}}",
  "environment": "production",
  "userId": "usr_123",
  "action": "login",
  "method": "google",
  "msg": "User logged in"
}
```

### Logging Rules

- Always include `traceId` when available (from OpenTelemetry context).
- Always include `userId` for authenticated requests.
- Never log PII (email, password, tokens) in production.
- Use log levels consistently: `error` (action needed), `warn` (investigate soon), `info` (normal operations), `debug` (development only).

## Dashboard Templates

### Request Rate and Errors (Golden Signals)

| Panel              | Metric / Query                               | Visualization |
| ------------------ | -------------------------------------------- | ------------- |
| Request Rate       | `rate(http_requests_total[5m])`              | Line chart    |
| Error Rate (%)     | `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100` | Line chart |
| Latency p50/p95/p99| `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` | Line chart |
| Active Users       | Unique `userId` in traces per 5 min          | Single stat   |
| Health Status      | Health check up/down                          | Status map    |

## APM Integration

### Sentry Performance (Recommended for Startups)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "{{SENTRY_DSN}}",
  tracesSampleRate: 0.2,          // Sample 20% of transactions in production
  profilesSampleRate: 0.1,        // Sample 10% for profiling
  environment: process.env.NODE_ENV,
  integrations: [Sentry.browserTracingIntegration()],
});
```

Sentry captures errors, performance traces, and session replays in one platform. For startups, this is often sufficient without a separate metrics stack.

## Cost-Effective Observability Stack for Startups

| Layer          | Tool                  | Cost          | Notes                              |
| -------------- | --------------------- | ------------- | ---------------------------------- |
| Error tracking | Sentry                | Free tier     | 5K errors/month free               |
| Uptime         | UptimeRobot           | Free tier     | 50 monitors                        |
| Logging        | Axiom or Better Stack | Free tier     | 1-5 GB/month free                  |
| Metrics        | Grafana Cloud         | Free tier     | 10K series free                    |
| Tracing        | Sentry Performance    | Free tier     | Included with error tracking       |
| Status page    | Instatus              | Free tier     | Public status page                 |

**Total cost at startup scale: $0/month.** Upgrade to paid tiers as you scale beyond free limits. Avoid Datadog and New Relic until you need them; their costs scale aggressively with volume.
