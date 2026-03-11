"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Sofa, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
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
  const { itemCount, openCart } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-cream)]/95 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"> */}
            {/* <Sofa className="h-5 w-5 text-primary-foreground" /> */}
            <Image
              src="/images/Logo New.png"
              alt="Mafroosh Logo"
              width={160}
              height={40}
              className="object-contain"
            />
          {/* </div> */}
          {/* <div>
            <span className="font-serif text-xl font-bold tracking-tight text-primary">
              Mafroosh
            </span>
          </div> */}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative py-1 text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Cart + CTA + Mobile toggle */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-primary/10 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/products"
            className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md md:inline-block"
          >
            Shop Now
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-[var(--color-cream)] px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-1 pt-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
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
            className="mt-4 block rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-sm"
          >
            Shop Now
          </Link>
        </div>
      )}
    </header>
  )
}
