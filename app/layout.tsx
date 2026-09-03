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
  title: 'ماضي الثقة العقارية | Madi Al-Thiqa Real Estate',
  description:
    'منصة ماضي الثقة العقارية لبيع وتسويق العقارات في الرياض والخرج: أراضي، شاليهات، غرف، أحواش واستراحات في أفضل الأحياء.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1c1c2e',
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
