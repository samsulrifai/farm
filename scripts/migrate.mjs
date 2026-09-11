import { readdir, readFile } from 'node:fs/promises'
import pg from 'pg'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try {
  await client.query('create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())')
  const applied = new Set((await client.query('select name from schema_migrations')).rows.map(x => x.name))
  const files = (await readdir(new URL('../db/', import.meta.url))).filter(x => x.endsWith('.sql')).sort()
  for (const file of files) {
    if (applied.has(file)) continue
    const baseline = { '001_init.sql': 'flocks', '002_users.sql': 'users' }[file]
    if (baseline && (await client.query("select to_regclass($1) table_name", [`public.${baseline}`])).rows[0].table_name) {
      await client.query('insert into schema_migrations(name) values($1)', [file]); continue
    }
    await client.query(await readFile(new URL(`../db/${file}`, import.meta.url), 'utf8'))
    await client.query('insert into schema_migrations(name) values($1)', [file])
  }
  console.log('migration=ok')
} finally { await client.end() }
// ponytail: baseline detects pre-existing v1 schema. Add checksums if migrations become team-managed.
