import { createInterface } from 'node:readline/promises'
import pg from 'pg'
import { hashPassword } from '../lib/password.mjs'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
const prompt = createInterface({ input: process.stdin, output: process.stdout })
const password = await prompt.question('Password Owner (min. 12 karakter): ')
prompt.close()
if (password.length < 12 || password.length > 200) throw new Error('Password harus 12–200 karakter')
const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
try {
  const { rows } = await db.query("select id from users where username='owner'")
  if (rows[0]) throw new Error('Owner sudah ada; jangan membuat ulang tanpa proses reset password.')
  await db.query("insert into users(username,password_hash,role) values('owner',$1,'Owner')", [await hashPassword(password)])
  console.log('owner=created')
} finally { await db.end() }
// ponytail: initial owner only. Add an authenticated password-reset flow before multi-user use.
