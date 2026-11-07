import { describe, expect, test, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import RootLayout, { metadata } from './layout'

vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-variable' }),
}))

const mockConfig = vi.hoisted(() => ({ isReadOnly: false }))

vi.mock('@/config', async () => ({
  ...(await vi.importActual('@/config')),
  SITE_URL: 'http://localhost:4000',
  get IS_READ_ONLY() {
    return mockConfig.isReadOnly
  },
}))

vi.mock('@/components/app-toasts', () => {
  const pendingPromise = new Promise(() => {})

  return {
    AppToasts: function SuspendingAppToasts() {
      throw pendingPromise
    },
  }
})

vi.mock('@/components/header', () => {
  return {
    Header: function Header({ isReadOnly }) {
      return <header>{isReadOnly ? 'Header read-only' : 'Header'}</header>
    },
  }
})

vi.mock('@/components/footer', () => {
  return {
    Footer: function Footer() {
      return <footer>Footer</footer>
    },
  }
})

describe('Root Layout', () => {
  test('renders the page content on the server while the toasts are suspended', () => {
    const html = renderToString(
      <RootLayout>
        <h1>Page heading</h1>
      </RootLayout>,
    )

    expect(html).toContain('<h1>Page heading</h1>')
  })

  test('renders the header and the footer on the server while the toasts are suspended', () => {
    const html = renderToString(
      <RootLayout>
        <h1>Page heading</h1>
      </RootLayout>,
    )

    expect(html).toContain('<header>Header</header>')
    expect(html).toContain('<footer>Footer</footer>')
  })

  test('tells the header the site is read-only', () => {
    mockConfig.isReadOnly = true

    const html = renderToString(<RootLayout>content</RootLayout>)

    mockConfig.isReadOnly = false

    expect(html).toContain('<header>Header read-only</header>')
  })

  test('sets no robots rule, so a 404 carries only the noindex Next.js adds', () => {
    expect(metadata.robots).toBeUndefined()
  })
})
