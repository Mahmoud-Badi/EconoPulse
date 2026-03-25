import * as Sentry from '@sentry/node'

// Initialise only when DSN is provided — gracefully no-ops in dev without config
export function initSentry() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: 0.2,
  })
}

export { Sentry }
