#!/usr/bin/env node
/**
 * ESM-native migration runner.
 * Runs via tsx (which handles .mjs as ESM, supporting top-level await).
 * Patches the @next/env CJS-interop bug in Payload's loadEnv.js before
 * any Payload module is loaded.
 */

// ── Increase stack depth so we can see the full require chain ──────────────
Error.stackTraceLimit = 50

// ── Patch @next/env to add the missing .default export that Payload expects ─
// payload/dist/bin/loadEnv.js does:  const { loadEnvConfig } = nextEnvImport
// where nextEnvImport = import_env.default  (tsx's CJS interop)
// But @next/env sets __esModule:true without a .default, so .default is undef.
// Pre-loading via createRequire puts a patched copy in the CJS module cache
// before tsx's hook can load the unpatched version.
import { createRequire } from 'module'
const _require = createRequire(import.meta.url)
const nextEnv = _require('@next/env')
if (!nextEnv.default) {
  // Make .default point to the module itself so Payload's destructure works
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
