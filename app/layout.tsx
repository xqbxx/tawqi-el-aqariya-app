import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'توقيع العقارية | Tawqi\' El-Aqariya',
  description:
    'منصة توقيع العقارية لبيع وتسويق العقارات وإدارة الأملاك: أراضي، شاليهات، غرف وأحواش في مختلف المناطق.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#8c0000',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${cairo.className} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
