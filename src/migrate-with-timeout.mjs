import { execSync } from 'child_process'

const TIMEOUT_MS = 60_000 // 60 seconds

console.log('[migrate] Running payload migrate with timeout...')

try {
  execSync('npx payload migrate', {
    timeout: TIMEOUT_MS,
    stdio: 'inherit',
    env: { ...process.env },
  })
  console.log('[migrate] Migration completed successfully.')
} catch (error) {
  if (error.killed) {
    console.warn(`[migrate] Migration timed out after ${TIMEOUT_MS / 1000}s — skipping. Tables may already exist.`)
  } else if (error.status) {
    console.warn(`[migrate] Migration exited with code ${error.status} — continuing build.`)
  } else {
    console.warn('[migrate] Migration failed — continuing build.', error.message)
  }
}
