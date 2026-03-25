import { Router, Request, Response } from 'express'
import { cacheOrFetch } from '../lib/cache'
import { getMacroData } from '../services/alphaVantageService'

const router = Router()

interface MacroPoint { date: string; value: string }

const FALLBACK_DATA: Record<string, MacroPoint[]> = {
  REAL_GDP: [
    { date: '2024-01-01', value: '22671.867' }, { date: '2023-01-01', value: '22369.725' },
    { date: '2022-01-01', value: '21822.038' }, { date: '2021-01-01', value: '21346.360' },
    { date: '2020-01-01', value: '20143.752' }, { date: '2019-01-01', value: '21372.577' },
    { date: '2018-01-01', value: '20897.804' }, { date: '2017-01-01', value: '20182.256' },
    { date: '2016-01-01', value: '19536.025' }, { date: '2015-01-01', value: '18992.253' },
  ],
  INFLATION: [
    { date: '2024-01-01', value: '2.9' }, { date: '2023-01-01', value: '4.1' },
    { date: '2022-01-01', value: '8.0' }, { date: '2021-01-01', value: '4.7' },
    { date: '2020-01-01', value: '1.2' }, { date: '2019-01-01', value: '1.8' },
    { date: '2018-01-01', value: '2.4' }, { date: '2017-01-01', value: '2.1' },
    { date: '2016-01-01', value: '1.3' }, { date: '2015-01-01', value: '0.1' },
  ],
  CPI: [
    { date: '2025-01-01', value: '317.671' }, { date: '2024-12-01', value: '317.353' },
    { date: '2024-11-01', value: '316.440' }, { date: '2024-10-01', value: '315.664' },
    { date: '2024-09-01', value: '315.301' }, { date: '2024-08-01', value: '314.796' },
    { date: '2024-07-01', value: '314.540' }, { date: '2024-06-01', value: '314.175' },
    { date: '2024-05-01', value: '314.069' }, { date: '2024-04-01', value: '313.548' },
    { date: '2024-03-01', value: '312.332' }, { date: '2024-02-01', value: '311.054' },
  ],
  UNEMPLOYMENT: [
    { date: '2025-01-01', value: '4.0' }, { date: '2024-12-01', value: '4.1' },
    { date: '2024-11-01', value: '4.2' }, { date: '2024-10-01', value: '4.1' },
    { date: '2024-09-01', value: '4.1' }, { date: '2024-08-01', value: '4.2' },
    { date: '2024-07-01', value: '4.3' }, { date: '2024-06-01', value: '4.1' },
    { date: '2024-05-01', value: '4.0' }, { date: '2024-04-01', value: '3.9' },
    { date: '2024-03-01', value: '3.8' }, { date: '2024-02-01', value: '3.9' },
    { date: '2024-01-01', value: '3.7' }, { date: '2023-12-01', value: '3.7' },
    { date: '2023-11-01', value: '3.7' }, { date: '2023-10-01', value: '3.9' },
    { date: '2023-09-01', value: '3.8' }, { date: '2023-08-01', value: '3.8' },
    { date: '2023-07-01', value: '3.5' }, { date: '2023-06-01', value: '3.6' },
    { date: '2023-05-01', value: '3.7' }, { date: '2023-04-01', value: '3.4' },
    { date: '2023-03-01', value: '3.5' }, { date: '2023-02-01', value: '3.6' },
  ],
  FEDERAL_FUNDS_RATE: [
    { date: '2025-01-01', value: '4.33' }, { date: '2024-12-01', value: '4.33' },
    { date: '2024-11-01', value: '4.58' }, { date: '2024-10-01', value: '4.83' },
    { date: '2024-09-01', value: '4.95' }, { date: '2024-08-01', value: '5.33' },
    { date: '2024-07-01', value: '5.33' }, { date: '2024-06-01', value: '5.33' },
    { date: '2024-05-01', value: '5.33' }, { date: '2024-04-01', value: '5.33' },
    { date: '2024-03-01', value: '5.33' }, { date: '2024-02-01', value: '5.33' },
    { date: '2024-01-01', value: '5.33' }, { date: '2023-12-01', value: '5.33' },
    { date: '2023-11-01', value: '5.33' }, { date: '2023-10-01', value: '5.33' },
    { date: '2023-09-01', value: '5.33' }, { date: '2023-08-01', value: '5.33' },
    { date: '2023-07-01', value: '5.33' }, { date: '2023-06-01', value: '5.08' },
    { date: '2023-05-01', value: '5.06' }, { date: '2023-04-01', value: '4.83' },
    { date: '2023-03-01', value: '4.65' }, { date: '2023-02-01', value: '4.57' },
  ],
  TREASURY_YIELD: [
    { date: '2025-01-01', value: '4.63' }, { date: '2024-12-01', value: '4.39' },
    { date: '2024-11-01', value: '4.34' }, { date: '2024-10-01', value: '4.10' },
    { date: '2024-09-01', value: '3.73' }, { date: '2024-08-01', value: '3.86' },
    { date: '2024-07-01', value: '4.20' }, { date: '2024-06-01', value: '4.32' },
    { date: '2024-05-01', value: '4.48' }, { date: '2024-04-01', value: '4.59' },
    { date: '2024-03-01', value: '4.20' }, { date: '2024-02-01', value: '4.27' },
    { date: '2024-01-01', value: '4.10' }, { date: '2023-12-01', value: '3.97' },
    { date: '2023-11-01', value: '4.44' }, { date: '2023-10-01', value: '4.80' },
    { date: '2023-09-01', value: '4.43' }, { date: '2023-08-01', value: '4.25' },
    { date: '2023-07-01', value: '3.96' }, { date: '2023-06-01', value: '3.81' },
    { date: '2023-05-01', value: '3.57' }, { date: '2023-04-01', value: '3.46' },
    { date: '2023-03-01', value: '3.56' }, { date: '2023-02-01', value: '3.75' },
  ],
}

function createMacroRoute(path: string, indicator: string, count: number) {
  router.get(path, async (_req: Request, res: Response) => {
    const { data, cached } = await cacheOrFetch(`macro_${indicator}`, 3600, async () => {
      try {
        const response = await getMacroData(indicator)
        const raw = (response as Record<string, unknown>).data ?? response
        const points = Array.isArray(raw) ? (raw as MacroPoint[]) : []
        if (points.length > 0) return points.slice(0, count)
      } catch (_) { /* fall through to fallback */ }
      return (FALLBACK_DATA[indicator] ?? []).slice(0, count)
    })
    return res.json({ cached, data })
  })
}

createMacroRoute('/gdp', 'REAL_GDP', 10)
createMacroRoute('/inflation', 'INFLATION', 10)
createMacroRoute('/cpi', 'CPI', 12)
createMacroRoute('/unemployment', 'UNEMPLOYMENT', 24)
createMacroRoute('/interest-rate', 'FEDERAL_FUNDS_RATE', 24)
createMacroRoute('/treasury-yield', 'TREASURY_YIELD', 24)

export default router
