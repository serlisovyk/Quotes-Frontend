import localFont from 'next/font/local'
import { Suspense } from 'react'
import AppToasts from '@components/AppToasts'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Loader from '@components/Loader'
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
  title: 'Quotes app',
  description: 'Frontend app for working with quotes API',
  icons: {
    icon: '/navIcon.png',
    shortcut: '/navIcon.png',
    apple: '/navIcon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={<Loader />}>
          <AppToasts />
          <Header />
          <main className="container mx-auto p-4">{children}</main>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
