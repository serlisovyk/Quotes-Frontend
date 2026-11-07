import localFont from 'next/font/local'
import { Suspense } from 'react'
import { AppToasts } from '@/components/app-toasts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
  SKIP_LINK_CLASS_NAME,
} from '@/config'
import { getThemeInitScript } from '@/utils/get-theme-init-script'
import {
  DARK_SCHEME_QUERY,
  LIGHT_SCHEME_QUERY,
  ROUTES,
  THEME_COLORS,
  THEMES,
} from '@/constants'
import './globals.css'

const geistSans = localFont({
  src: './fonts/geist-vf.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/geist-mono-vf.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: ROUTES.HOME,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE,
        alt: `${SITE_NAME} icon`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  icons: {
    icon: '/nav-icon.png',
    shortcut: '/nav-icon.png',
    apple: '/nav-icon.png',
  },
}

export const viewport = {
  themeColor: [
    { media: LIGHT_SCHEME_QUERY, color: THEME_COLORS[THEMES.LIGHT] },
    { media: DARK_SCHEME_QUERY, color: THEME_COLORS[THEMES.DARK] },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scrollbar-gutter-stable" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} m-0 flex min-h-screen flex-col bg-page font-sans text-body antialiased`}
      >
        <a href="#main-content" className={SKIP_LINK_CLASS_NAME}>
          Skip to content
        </a>

        <Suspense fallback={null}>
          <AppToasts />
        </Suspense>

        <Header />

        <main id="main-content" className="container mx-auto flex-1 p-4">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
