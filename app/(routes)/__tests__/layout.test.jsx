import { renderToString } from 'react-dom/server'
import RootLayout from '../layout'

jest.mock('next/font/local', () => () => ({ variable: 'font-variable' }))

jest.mock('@components/AppToasts', () => {
  const pendingPromise = new Promise(() => {})

  return function SuspendingAppToasts() {
    throw pendingPromise
  }
})

jest.mock('@components/Header', () => {
  return function Header() {
    return <header>Header</header>
  }
})

jest.mock('@components/Footer', () => {
  return function Footer() {
    return <footer>Footer</footer>
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
