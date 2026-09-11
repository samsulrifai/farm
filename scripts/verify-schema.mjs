import assert from 'node:assert/strict'
import pg from 'pg'

const { Client } = pg
const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const required = ['flocks', 'production_entries', 'feed_movements', 'sales', 'payments', 'expenses', 'health_records', 'audit_log']
const { rows } = await client.query("select tablename from pg_tables where schemaname = 'public'")
const actual = new Set(rows.map(row => row.tablename))
for (const table of required) assert(actual.has(table), `missing table: ${table}`)
const { rows: constraints } = await client.query("select conname from pg_constraint where conrelid = 'production_entries'::regclass")
assert(constraints.some(row => row.conname === 'production_entries_flock_id_recorded_on_key'), 'missing one-entry-per-flock/day constraint')
await client.end()
console.log('schema=ok')
