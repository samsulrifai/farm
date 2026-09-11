import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
export async function hashPassword(password) { const salt = randomBytes(16).toString('base64url'); const hash = await scrypt(password, salt, 64); return `scrypt$${salt}$${Buffer.from(hash).toString('base64url')}` }
export async function verifyPassword(password, stored) { const [scheme, salt, encoded] = String(stored).split('$'); if (scheme !== 'scrypt' || !salt || !encoded) return false; const hash = Buffer.from(await scrypt(password, salt, 64)); const expected = Buffer.from(encoded, 'base64url'); return hash.length === expected.length && timingSafeEqual(hash, expected) }
// ponytail: scrypt parameters use Node defaults. Rehash on login if parameters change.
