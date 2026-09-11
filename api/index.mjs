import express from 'express'
import { requireAuth, registerAuth } from './auth.mjs'
import { db } from './shared.mjs'
import { registerFlocks } from './flocks.mjs'
import { registerProduction } from './production.mjs'
import { registerFeed } from './feed.mjs'
import { registerSales } from './sales.mjs'
import { registerResources } from './resources.mjs'

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) throw new Error('DATABASE_URL and SESSION_SECRET are required')
const app = express()
app.use(express.json({ limit: '32kb' }))
registerAuth(app)
app.use('/api', requireAuth)
app.get('/api/health', async (_req, res, next) => { try { await db.query('select 1'); res.json({ ok: true }) } catch (error) { next(error) } })
registerFlocks(app)
registerProduction(app)
registerFeed(app)
registerSales(app)
registerResources(app)
export default app
// App composition only. Each resource owns its route contract.
