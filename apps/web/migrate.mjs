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
// Resolve @next/env as Payload itself would (from Payload's package directory)
const payloadPkgUrl = import.meta.resolve('payload/package.json')
const payloadDir = path.dirname(fileURLToPath(payloadPkgUrl))
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

console.log('[migrate] Running migrations…')
try {
  await payload.db.migrate()
  console.log('[migrate] ✓ Done')
} catch (err) {
  const msg = String(err?.message ?? '')
  if (msg.includes('no migration') || msg.includes('No migration') || err?.code === 'ENOENT') {
    console.log('[migrate] No migration files — creating initial migration…')
    await payload.db.migrateCreate({ name: 'initial' })
    await payload.db.migrate()
    console.log('[migrate] ✓ Initial migration applied')
  } else {
    console.error('[migrate] ✗ Failed:', err)
    process.exit(1)
  }
}

process.exit(0)
