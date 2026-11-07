import { beforeEach, describe, expect, test } from 'vitest'
import { THEME_COLORS, THEMES } from '@/constants'
import { applyTheme } from './apply-theme.util.js'

const addThemeColorMeta = (media) => {
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = '#000000'
  if (media) meta.media = media
  document.head.append(meta)
}

const getThemeColors = () =>
  [...document.querySelectorAll('meta[name="theme-color"]')].map(
    (meta) => meta.content,
  )

describe('applyTheme', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    delete document.documentElement.dataset.theme
  })

  test.each([THEMES.LIGHT, THEMES.DARK])('sets data-theme to %s', (theme) => {
    applyTheme(theme)

    expect(document.documentElement.dataset.theme).toBe(theme)
  })

  test('sets the colour of every theme-color meta, whatever its media', () => {
    addThemeColorMeta('(prefers-color-scheme: light)')
    addThemeColorMeta('(prefers-color-scheme: dark)')

    applyTheme(THEMES.DARK)

    expect(getThemeColors()).toEqual([THEME_COLORS.dark, THEME_COLORS.dark])
  })

  test('works without a theme-color meta', () => {
    expect(() => applyTheme(THEMES.LIGHT)).not.toThrow()
  })

  test('writes nothing when the page already has the theme', () => {
    addThemeColorMeta()
    applyTheme(THEMES.DARK)
    const observer = new MutationObserver(() => {})
    observer.observe(document.documentElement, { attributes: true })
    observer.observe(document.head, { attributes: true, subtree: true })

    applyTheme(THEMES.DARK)

    expect(observer.takeRecords()).toHaveLength(0)
    observer.disconnect()
  })
})
