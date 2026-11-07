import { afterEach, describe, expect, test, vi } from 'vitest'

const loadConfig = async (value) => {
  vi.resetModules()
  vi.stubEnv('READ_ONLY', value)

  return import('./read-only.config.js')
}

describe('IS_READ_ONLY', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('is true when READ_ONLY is true', async () => {
    const { IS_READ_ONLY } = await loadConfig('true')

    expect(IS_READ_ONLY).toBe(true)
  })

  test.each(['', 'false', 'yes'])('is false when READ_ONLY is %j', async (value) => {
    const { IS_READ_ONLY } = await loadConfig(value)

    expect(IS_READ_ONLY).toBe(false)
  })
})
