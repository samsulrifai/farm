import { asyncRoute, audit, date, db, one, positive, text } from './shared.mjs'

export function registerFlocks(app) {
  app.get('/api/flocks', asyncRoute(async (_req, res) => { const { rows } = await db.query("select id,name,strain,to_char(started_on,'YYYY-MM-DD') started_on,initial_hens,target_hd,active from flocks order by active desc,name"); res.json(rows) }))
  app.post('/api/flocks', asyncRoute(async (req, res) => { const { name, strain, startedOn, initialHens, targetHd } = req.body ?? {}; if (!text(name) || !text(strain) || !date(startedOn) || !Number.isInteger(initialHens) || initialHens < 1 || !positive(targetHd) || targetHd > 100) return res.status(400).json({ error: 'Data kandang tidak valid.' }); const row = await one(db, "insert into flocks(name,strain,started_on,initial_hens,target_hd) values($1,$2,$3,$4,$5) returning id,name,strain,to_char(started_on,'YYYY-MM-DD') started_on,initial_hens,target_hd,active", [text(name), text(strain), startedOn, initialHens, targetHd], 'Gagal menyimpan kandang.'); await audit(db, 'flock', row); res.status(201).json(row) }))
  app.patch('/api/flocks/:id/archive', asyncRoute(async (req, res) => { const row = await one(db, 'update flocks set active=false where id=$1 and active=true returning id,name,active', [req.params.id], 'Kandang tidak ditemukan.'); await audit(db, 'flock', row, 'archive'); res.json(row) }))
}
