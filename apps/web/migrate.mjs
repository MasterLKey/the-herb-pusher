#!/usr/bin/env node
/**
 * ESM-native migration runner.
 * Runs via tsx (which handles .mjs as ESM, supporting top-level await).
 *
 * WHY THIS FILE EXISTS:
 * The Payload CLI uses tsx's CJS register hook, which cannot load
 * @payloadcms/richtext-lexical (it has top-level await).
 * Running a .mjs file via `tsx migrate.mjs` uses the ESM pipeline for
 * our top-level code, but Payload's internal require() chain still
 * goes through tsx's CJS hook.
 *
 * A SECOND PROBLEM: Payload's loadEnv.js does:
 *   import nextEnvImport from '@next/env'
 *   const { loadEnvConfig } = nextEnvImport   // <— crashes
 * because @next/env has __esModule:true but no .default export.
 * When tsx transforms this ESM import to CJS, it accesses import_env.default
 * which is undefined. Payload has its OWN nested copy of @next/env so we must
 * patch THAT specific instance before any Payload module is required.
 */

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'

Error.stackTraceLimit = 50

// ── Patch Payload's own copy of @next/env ───────────────────────────────────
// Resolve @next/env as Payload itself would (from Payload's package directory).
// We can't use 'payload/package.json' (not exported), so navigate from the
// main entry (dist/index.js) up two levels to the package root.
const payloadEntryUrl = import.meta.resolve('payload')
const payloadEntryPath = fileURLToPath(payloadEntryUrl)
// dist/index.js → dist → package root
const payloadDir = path.resolve(path.dirname(payloadEntryPath), '..')
const requireFromPayload = createRequire(path.join(payloadDir, 'package.json'))

const nextEnv = requireFromPayload('@next/env')
if (!nextEnv.default) {
  // @next/env sets __esModule:true but exports no .default.
  // tsx's CJS interop accesses import_env.default, so make .default === module.
  Object.defineProperty(nextEnv, 'default', { value: nextEnv, enumerable: false })
}

// ── Now safe to load Payload ────────────────────────────────────────────────
console.log('[migrate] Loading Payload…')
const { getPayload } = await import('payload')

console.log('[migrate] Loading config…')
const { default: config } = await import('./src/payload.config.ts')

console.log('[migrate] Connecting…')
const payload = await getPayload({ config })

// Generate a migration file from the current schema.
// skipEmpty:true means no file is created if nothing changed.
// On a fresh install this creates the initial SQL migration file.
console.log('[migrate] Generating migration file from current schema…')
try {
  await payload.db.createMigration({
    forceAcceptWarning: true,
    migrationName: 'initial',
    payload,
    skipEmpty: true,
  })
  console.log('[migrate] Migration file ready')
} catch (err) {
  const msg = String(err?.message ?? '')
  // These are expected when schema is already in sync
  if (
    msg.toLowerCase().includes('no changes') ||
    msg.toLowerCase().includes('already exists') ||
    msg.toLowerCase().includes('nothing to migrate') ||
    msg.toLowerCase().includes('empty')
  ) {
    console.log('[migrate] Schema already up to date, no new file needed')
  } else {
    console.warn('[migrate] createMigration warning (continuing):', msg)
  }
}

console.log('[migrate] Applying pending migrations…')
try {
  await payload.db.migrate()
  console.log('[migrate] ✓ Done')
} catch (err) {
  console.error('[migrate] ✗ Failed:', err)
  process.exit(1)
}

process.exit(0)
