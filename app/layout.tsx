import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from "@/components/CartDrawer"

// No CartProvider needed with Zustand!

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Mafroosh - Premium Furniture & Decor',
  description: 'Transform your space with Mafroosh premium furniture and home decor. Explore elegant designs, quality craftsmanship, and stylish pieces for every room.',
  keywords: 'furniture, home decor, interior design, sofas, tables, chairs, decor items, home furnishings, furniture store',
}

export const viewport = {
  themeColor: '#8B3A3A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {/* No CartProvider wrapper needed */}
        <CartDrawer />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}