import { renderToString } from 'react-dom/server'
import RootLayout from './layout'

jest.mock('next/font/local', () => () => ({ variable: 'font-variable' }))

jest.mock('@/config', () => ({
  ...jest.requireActual('@/config'),
  SITE_URL: 'http://localhost:4000',
}))

jest.mock('@/components/app-toasts', () => {
  const pendingPromise = new Promise(() => {})

  return {
    AppToasts: function SuspendingAppToasts() {
      throw pendingPromise
    },
  }
})

jest.mock('@/components/header', () => {
  return {
    Header: function Header() {
      return <header>Header</header>
    },
  }
})

jest.mock('@/components/footer', () => {
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
