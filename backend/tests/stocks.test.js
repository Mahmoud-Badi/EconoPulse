import request from 'supertest'
import { describe, it, expect } from 'vitest'

// Import app after VITEST env var is set (no port binding in tests)
const app = (await import('../server.js')).default

describe('GET /api/stocks/quotes', () => {
  it('returns a valid JSON response (never crashes)', async () => {
    const res = await request(app).get('/api/stocks/quotes')
    expect([200, 500]).toContain(res.status)
    expect(res.headers['content-type']).toMatch(/json/)
    // On success: { cached, data }. On failure: { error, message }
    expect(res.body).toBeDefined()
  })

  it('responds with json content-type', async () => {
    const res = await request(app).get('/api/stocks/quotes')
    expect(res.headers['content-type']).toMatch(/json/)
  })

  it('sets Cache-Control: public, max-age=60', async () => {
    const res = await request(app).get('/api/stocks/quotes')
    expect(res.headers['cache-control']).toBe('public, max-age=60')
  })

  it('on success, data is an array of stock objects', async () => {
    const res = await request(app).get('/api/stocks/quotes')
    if (res.status === 200) {
      expect(Array.isArray(res.body.data)).toBe(true)
      if (res.body.data.length > 0) {
        const stock = res.body.data[0]
        expect(stock).toHaveProperty('symbol')
        expect(stock).toHaveProperty('price')
        expect(stock).toHaveProperty('change')
        expect(stock).toHaveProperty('changePercent')
      }
    }
  })
})

describe('GET /api/stocks/indices', () => {
  it('returns a valid JSON response (never crashes)', async () => {
    const res = await request(app).get('/api/stocks/indices')
    expect([200, 500]).toContain(res.status)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body).toBeDefined()
  })

  it('sets Cache-Control: public, max-age=60', async () => {
    const res = await request(app).get('/api/stocks/indices')
    expect(res.headers['cache-control']).toBe('public, max-age=60')
  })
})

describe('GET /api/crypto/listings', () => {
  it('sets Cache-Control: public, max-age=300', async () => {
    const res = await request(app).get('/api/crypto/listings')
    expect(res.headers['cache-control']).toBe('public, max-age=300')
  })
})

describe('GET /api/macro/gdp', () => {
  it('sets Cache-Control: public, max-age=86400', async () => {
    const res = await request(app).get('/api/macro/gdp')
    expect(res.headers['cache-control']).toBe('public, max-age=86400')
  })

  it('returns an array (real or fallback data)', async () => {
    const res = await request(app).get('/api/macro/gdp')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
  })
})
