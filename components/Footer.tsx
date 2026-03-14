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
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-transform group-hover:rotate-12">
                <Sofa className="h-6 w-6" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Mafroosh
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-white/60 font-light">
              Designing sanctuaries since 2010. We craft premium furniture and home decor that transforms your living spaces into elegant experiences.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-8">
              Explore
            </h3>
            <ul className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-all hover:text-secondary hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-8">
              Collections
            </h3>
            <ul className="flex flex-col gap-4">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-all hover:text-secondary hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-8">
              Atelier
            </h3>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span className="text-sm text-white/70 leading-relaxed font-light">
                  529C/011-CC, Ring Road, Vikas Nagar,
                  <br />
                  Lucknow, India - 226022
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                <span className="text-sm text-white/70 font-light">
                  +91 96213 74263
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-4 w-4 shrink-0 text-secondary" />
                <span className="text-sm text-white/70 font-light">
                  concierge@mafroosh.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-white/10 pt-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              &copy; {new Date().getFullYear()} Mafroosh - Artisan Furniture.
            </p>
            <div className="flex gap-8">
               <Link href="/privacy" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-secondary transition-colors">Privacy</Link>
               <Link href="/terms" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-secondary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
