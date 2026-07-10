#!/usr/bin/env node
/**
 * ESM-native migration runner.
 * Bypasses the Payload CLI (which uses tsx's CJS require hook and chokes on
 * richtext-lexical's top-level await).  Running this file as .mjs means tsx
 * uses its ESM loader pipeline where top-level await is fully supported.
 *
 * Usage: node --import tsx/esm migrate.mjs
 */
import { getPayload } from 'payload'

// Dynamic import keeps this file loadable even before tsx registers
const { default: config } = await import('./src/payload.config.ts')

console.log('[migrate] Connecting to database…')
const payload = await getPayload({ config })

console.log('[migrate] Running pending migrations…')
try {
  await payload.db.migrate()
  console.log('[migrate] ✓ Migrations applied')
} catch (err) {
  // No migration files yet — generate them from the current schema
  if (
    err?.message?.includes('no migration') ||
    err?.message?.includes('No migration') ||
    err?.code === 'ENOENT'
  ) {
    console.log('[migrate] No migration files found — creating initial migration…')
    await payload.db.migrateCreate({ name: 'initial' })
    await payload.db.migrate()
    console.log('[migrate] ✓ Initial migration applied')
  } else {
    console.error('[migrate] ✗ Migration failed:', err)
    process.exit(1)
  }
}

process.exit(0)
