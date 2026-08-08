import localFont from 'next/font/local'
import { Suspense } from 'react'
import AppToasts from '@components/AppToasts'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Loader from '@components/Loader'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
} from '@config/site'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
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
    canonical: '/',
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
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/navIcon.png',
    shortcut: '/navIcon.png',
    apple: '/navIcon.png',
  },
}

export const viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light dark',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={<Loader />}>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <AppToasts />
          <Header />
          <main id="main-content" className="container mx-auto p-4">
            {children}
          </main>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
