import { describe, expect, test, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import RootLayout from './layout'

vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-variable' }),
}))

vi.mock('@/config', async () => ({
  ...(await vi.importActual('@/config')),
  SITE_URL: 'http://localhost:4000',
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
    Header: function Header() {
      return <header>Header</header>
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
})
