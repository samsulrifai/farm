import pg from 'pg'

export const db = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 })
export const asyncRoute = handler => (req, res) => Promise.resolve(handler(req, res)).catch(error => { console.error(error.message); res.status(error.status ?? 500).json({ error: error.status ? error.message : 'Terjadi kesalahan server.' }) })
export const text = value => typeof value === 'string' ? value.trim() : ''
export const date = value => /^\d{4}-\d{2}-\d{2}$/.test(text(value))
export const positive = value => Number.isFinite(value) && value > 0
export const nonNegative = value => Number.isFinite(value) && value >= 0
export const one = async (client, sql, values, message) => { const { rows } = await client.query(sql, values); if (!rows[0]) throw Object.assign(new Error(message), { status: 404 }); return rows[0] }
export const audit = (client, entity, row, action = 'create') => client.query('insert into audit_log (entity,entity_id,action,snapshot) values($1,$2,$3,$4)', [entity, row.id, action, row])
// ponytail: one shared pool per serverless instance. Tune max if Vercel concurrency grows.
