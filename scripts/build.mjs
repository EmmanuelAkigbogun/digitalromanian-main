import { spawnSync } from 'node:child_process'

function run(command, args, { continueOnError = false } = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  })

  if (result.status !== 0) {
    if (continueOnError) {
      return false
    }

    process.exit(result.status ?? 1)
  }

  return true
}

const tinaClientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID || process.env.TINA_CLIENT_ID
const tinaToken = process.env.TINA_TOKEN || process.env.NEXT_PUBLIC_TINA_TOKEN

const hasTinaCloudConfig = Boolean(tinaClientId && tinaToken)

if (hasTinaCloudConfig) {
  console.log('TinaCloud credentials found. Running Tina build...')
  const strictTinaBuild = process.env.STRICT_TINA_BUILD === 'true'
  const ok = run('tinacms', ['build'], { continueOnError: !strictTinaBuild })

  if (!ok) {
    console.log(
      'Tina build failed. Continuing with Vite build. Set STRICT_TINA_BUILD=true to fail on Tina errors.',
    )
  }
} else {
  console.log(
    'Skipping Tina build: missing NEXT_PUBLIC_TINA_CLIENT_ID or TINA_TOKEN. Running Vite build only.',
  )
}

run('vite', ['build'])
