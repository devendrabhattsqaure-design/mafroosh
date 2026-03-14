"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useCartCount, useCartActions } from "@/store/cartStore"  
import Image from "next/image"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartCount()
  const { openCart } = useCartActions()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image
            src="/images/Logo New.png"
            alt="Mafroosh Logo"
            width={160}
            height={40}
            className="object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-12 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative py-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-secondary transition-all duration-500 ease-in-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Cart + CTA + Mobile toggle */}
        <div className="flex items-center gap-8">
          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="group relative flex h-10 w-10 items-center justify-center text-foreground transition-all hover:scale-110"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-primary text-[8px] font-bold text-white shadow-lg animate-in fade-in zoom-in duration-300">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/products"
            className="hidden px-8 py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-secondary hover:text-white lg:inline-block shadow-[4px_4px_0px_0px_rgba(212,175,55,0.4)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Explore Shop
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center text-foreground lg:hidden hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[89px] z-50 bg-white px-8 pb-10 md:hidden animate-in fade-in slide-in-from-right duration-500">
          <ul className="flex flex-col gap-6 pt-12">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 text-sm font-bold uppercase tracking-[0.2em] transition-all ${
                      isActive
                        ? "text-secondary border-b border-secondary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="mt-16 block w-full py-5 bg-primary text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl"
          >
            Explore Collection
          </Link>
        </div>
      )}
    </header>
  )
}