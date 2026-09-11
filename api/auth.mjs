import { clearSession, requireAuth, setSession } from '../lib/auth.mjs'
import { verifyPassword } from '../lib/password.mjs'
import { asyncRoute, db, text } from './shared.mjs'

export function registerAuth(app) {
  app.post('/api/auth/login', asyncRoute(async (req, res) => { const password = text(req.body?.password); const { rows } = await db.query("select id,password_hash,role from users where username='owner' and active=true"); if (!rows[0] || !password || !(await verifyPassword(password, rows[0].password_hash))) return res.status(401).json({ error: 'Password salah.' }); setSession(res, rows[0]); res.json({ ok: true }) }))
  app.post('/api/auth/logout', (_req, res) => { clearSession(res); res.status(204).end() })
  app.get('/api/auth/me', requireAuth, (req, res) => res.json({ role: req.user.role }))
}
export { requireAuth }
