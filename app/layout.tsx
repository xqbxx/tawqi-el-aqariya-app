import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { El_Messiri } from 'next/font/google'
import './globals.css'

const elMessiri = El_Messiri({
  subsets: ['arabic', 'latin'],
  variable: '--font-el-messiri',
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
    <html lang="ar" dir="rtl" className={`${elMessiri.variable} ${elMessiri.className} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
