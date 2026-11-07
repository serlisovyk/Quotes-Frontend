import { afterEach, describe, expect, test, vi } from 'vitest'
import { DARK_SCHEME_QUERY } from '@/constants'
import { getIsSystemDark, subscribeToSystemScheme } from './system-scheme.util.js'

const stubMatchMedia = (matches) => {
  const queryList = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => queryList),
  )

  return queryList
}

describe('system scheme', () => {
  afterEach(() => vi.unstubAllGlobals())

  test.each([true, false])('reads whether the system is dark: %s', (isDark) => {
    stubMatchMedia(isDark)

    expect(getIsSystemDark()).toBe(isDark)
    expect(matchMedia).toHaveBeenCalledWith(DARK_SCHEME_QUERY)
  })

  test('listens for changes and stops after unsubscribe', () => {
    const queryList = stubMatchMedia(false)
    const onChange = vi.fn()

    const unsubscribe = subscribeToSystemScheme(onChange)

    expect(queryList.addEventListener).toHaveBeenCalledWith('change', onChange)

    unsubscribe()

    expect(queryList.removeEventListener).toHaveBeenCalledWith('change', onChange)
  })
})
