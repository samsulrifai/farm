import { createHmac, timingSafeEqual } from 'node:crypto'

const cookie = (request, name) => (request.headers.cookie ?? '').split(';').map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1)
const sign = value => createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('base64url')

export function requireAuth(req, res, next) {
  const value = cookie(req, 'farmtelur_session'); const [payload, signature] = value?.split('.') ?? []
  if (!payload || !signature || !process.env.SESSION_SECRET) return res.status(401).json({ error: 'Silakan login.' })
  const expected = sign(payload)
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return res.status(401).json({ error: 'Sesi tidak valid.' })
  try { const user = JSON.parse(Buffer.from(payload, 'base64url').toString()); if (user.exp < Date.now()) throw new Error(); req.user = user; next() } catch { return res.status(401).json({ error: 'Sesi berakhir.' }) }
}

export function setSession(res, user) {
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is not configured')
  const payload = Buffer.from(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url')
  res.setHeader('Set-Cookie', `farmtelur_session=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`)
}

export function clearSession(res) { res.setHeader('Set-Cookie', 'farmtelur_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0') }
// ponytail: sessions are stateless. Add server-side session revocation for remote logout.
