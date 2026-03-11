import Link from "next/link"
import { Sofa, MapPin, Phone, Mail } from "lucide-react"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
]


const categories = [
  { href: "/products?category=sofas", label: "Sofas & Couches" },
  { href: "/products?category=tables", label: "Tables" },
  { href: "/products?category=chairs", label: "Chairs" },
  { href: "/products?category=decor", label: "Home Decor" },
]

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Sofa className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-[var(--color-gold)]">
                Mafroosh
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/80">
              Premium furniture and home decor that transforms your spaces into elegant sanctuaries.
              Your trusted choice for quality and style.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[var(--color-gold)]">
              Quick Links
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[var(--color-gold)]">
              Categories
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[var(--color-gold)]">
              Contact Us
            </h3>
            <ul className="mt-4 flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-secondary-foreground/80">
                  Vikas Khand -5 , Gomti Nagar,
                  <br />
                  Lucknow, India - 226010
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-secondary-foreground/80">
                  +91 8840403939
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-secondary-foreground/80">
                  info@sacredsamagri.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-secondary-foreground/60">
              &copy; {new Date().getFullYear()} Mafroosh. All rights reserved.
            </p>
            <p className="text-sm text-secondary-foreground/60">
              Premium furniture and decor for elegant living
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
