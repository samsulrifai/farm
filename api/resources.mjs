import { asyncRoute, audit, date, db, one } from './shared.mjs'

function resource(app, route, table, dateColumn, fields) {
  app.get(`/api/${route}`, asyncRoute(async (req, res) => { if (!date(req.query.date)) return res.status(400).json({ error: 'Tanggal tidak valid.' }); const { rows } = await db.query(`select *,to_char(${dateColumn},'YYYY-MM-DD') date from ${table} where ${dateColumn}=$1 order by created_at desc`, [req.query.date]); res.json(rows) }))
  app.post(`/api/${route}`, asyncRoute(async (req, res) => { const row = await one(db, `insert into ${table}(${fields.join(',')}) values(${fields.map((_, index) => `$${index + 1}`).join(',')}) returning *`, fields.map(field => req.body?.[field]), 'Gagal menyimpan data.'); await audit(db, route, row); res.status(201).json(row) }))
  app.delete(`/api/${route}/:id`, asyncRoute(async (req, res) => { const row = await one(db, `delete from ${table} where id=$1 returning *`, [req.params.id], 'Data tidak ditemukan.'); await audit(db, route, row, 'delete'); res.status(204).end() }))
}

export function registerResources(app) {
  resource(app, 'expenses', 'expenses', 'spent_on', ['spent_on', 'category', 'amount', 'note'])
  resource(app, 'health-records', 'health_records', 'recorded_on', ['flock_id', 'recorded_on', 'kind', 'detail', 'quantity', 'next_on', 'note'])
}
// ponytail: generic resource only supports two simple tables. Extract validation per resource when fields diverge.
