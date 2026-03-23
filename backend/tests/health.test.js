import request from 'supertest'
import app from '../server.js'

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.timestamp).toBeDefined()
  })

  it('sets Cache-Control: no-store', async () => {
    const res = await request(app).get('/api/health')
    expect(res.headers['cache-control']).toBe('no-store')
  })
})
