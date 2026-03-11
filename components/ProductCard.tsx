"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, ArrowRight } from "lucide-react"
import SparklerEffect from "./SparklerEffect"
import { useCart } from "@/context/CartContext"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
}

const categoryLabels: Record<string, string> = {
  incense: "Incense",
  idols: "Idols",
  diyas: "Diyas",
  "pooja-kits": "Pooja Kits",
}

/* Inline lotus petal SVG used as a divider between image and content */
function LotusDivider() {
  return (
    <svg
      viewBox="0 0 320 48"
      fill="none"
      className="w-full"
      aria-hidden="true"
    >
      {/* background fill to cover gap */}
      <rect y="24" width="320" height="24" fill="var(--card)" />

      {/* petals - left side */}
      <path
        d="M100 48 Q110 16 130 24 Q120 8 140 24 Q130 0 160 18"
        fill="var(--card)"
        stroke="var(--color-saffron)"
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* petals - right side (mirrored) */}
      <path
        d="M220 48 Q210 16 190 24 Q200 8 180 24 Q190 0 160 18"
        fill="var(--card)"
        stroke="var(--color-saffron)"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* center lotus bloom */}
      {/* outer petals */}
      <path d="M160 18 Q148 6 138 24 Q148 16 160 18Z" fill="var(--color-saffron)" opacity="0.2" className="transition-opacity duration-500 group-hover:opacity-40" />
      <path d="M160 18 Q172 6 182 24 Q172 16 160 18Z" fill="var(--color-saffron)" opacity="0.2" className="transition-opacity duration-500 group-hover:opacity-40" />
      <path d="M160 18 Q150 2 142 20 Q152 10 160 18Z" fill="var(--color-deep-maroon)" opacity="0.15" className="transition-opacity duration-500 group-hover:opacity-30" />
      <path d="M160 18 Q170 2 178 20 Q168 10 160 18Z" fill="var(--color-deep-maroon)" opacity="0.15" className="transition-opacity duration-500 group-hover:opacity-30" />

      {/* center dot */}
      <circle cx="160" cy="20" r="3" fill="var(--color-saffron)" className="transition-all duration-500 group-hover:r-[4]" opacity="0.6" />

      {/* flowing curves left & right */}
      <path d="M0 48 Q40 30 80 38 Q120 24 160 20" stroke="var(--color-saffron)" strokeWidth="0.8" fill="none" opacity="0.2" />
      <path d="M320 48 Q280 30 240 38 Q200 24 160 20" stroke="var(--color-saffron)" strokeWidth="0.8" fill="none" opacity="0.2" />
    </svg>
  )
}

/* Small lotus icon used as a badge accent */
function LotusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* left petal */}
      <path d="M12 14 Q8 6 4 12 Q8 10 12 14Z" fill="currentColor" opacity="0.6" />
      {/* right petal */}
      <path d="M12 14 Q16 6 20 12 Q16 10 12 14Z" fill="currentColor" opacity="0.6" />
      {/* center petal */}
      <path d="M12 14 Q10 4 12 2 Q14 4 12 14Z" fill="currentColor" opacity="0.8" />
      {/* base */}
      <ellipse cx="12" cy="15" rx="5" ry="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showSparkler, setShowSparkler] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const { addItem, openCart } = useCart()

  const handleViewDetails = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Get click position for sparkler effect
    const rect = e.currentTarget.getBoundingClientRect()
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    
    // Trigger sparkler
    setShowSparkler(true)
    setIsNavigating(true)
    
    // Navigate after sparkler effect
    setTimeout(() => {
      setShowSparkler(false)
      router.push(`/products/${product.id}`)
    }, 1000)
  }
const handleQuickAdd = (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
  })
  openCart() // Open cart drawer to show the item was added
}
  return (
    <>
      <SparklerEffect isActive={showSparkler} x={clickPosition.x} y={clickPosition.y} />
      <div
        className={`group relative flex flex-col overflow-hidden rounded-2xl bg-card product-card-lotus transition-all duration-500 hover:-translate-y-3 ${
          isNavigating ? 'pointer-events-none opacity-70' : ''
        }`}
      >
        {/* Wrap only the image in Link for the main navigation */}
        <Link
          href={`/products/${product.id}`}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={(e) => {
            if (isNavigating) {
              e.preventDefault()
            }
          }}
        >
          {/* Top lotus accent bar */}
          <div className="absolute left-0 right-0 top-0 z-20 flex h-1 items-center" aria-hidden="true">
            <div className="h-full flex-1 bg-[var(--color-deep-maroon)] transition-colors duration-500 group-hover:bg-[var(--color-saffron)]" />
            <div className="relative -mt-1">
              <LotusIcon className="h-5 w-5 text-[var(--color-deep-maroon)] transition-all duration-500 group-hover:text-[var(--color-saffron)] group-hover:scale-125" />
            </div>
            <div className="h-full flex-1 bg-[var(--color-deep-maroon)] transition-colors duration-500 group-hover:bg-[var(--color-saffron)]" />
          </div>

          {/* Image area with rounded inner mask */}
          <div className="relative m-3 mt-4 aspect-square overflow-hidden rounded-xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 bg-[var(--color-dark-brown)]/0 transition-all duration-500 group-hover:bg-[var(--color-dark-brown)]/30"
              aria-hidden="true"
            />

            {/* Category badge with lotus */}
            <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-[var(--color-dark-brown)]/80 px-3 py-1 backdrop-blur-sm">
              <LotusIcon className="h-3 w-3 text-[var(--color-saffron)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sandal)]">
                {categoryLabels[product.category] || product.category}
              </span>
            </div>

            {/* Quick-shop floating button */}
           <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
  <button
    onClick={handleQuickAdd}
    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-110"
    aria-label="Add to cart"
  >
    <ShoppingBag className="h-4 w-4" />
  </button>
</div>

            {/* Price tag on image */}
            <div className="absolute bottom-3 left-3 translate-y-4 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="rounded-lg bg-card/90 px-3 py-1.5 text-lg font-bold text-secondary shadow-lg backdrop-blur-sm">
                {"₹"}{product.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </Link>

        {/* Lotus divider between image and content */}
        <div className="-mt-2 px-3">
          <LotusDivider />
        </div>

        {/* Content area */}
        <div className="relative flex flex-1 flex-col px-5 pb-5 -mt-1">
          {/* Product name - clickable */}
          <Link href={`/products/${product.id}`} className="hover:underline decoration-primary underline-offset-2">
            <h3 className="text-center font-serif text-lg font-bold text-foreground leading-snug tracking-wide">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-1.5 line-clamp-2 text-center text-[13px] leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="flex-1" />

          {/* Bottom CTA row */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-bold text-secondary">
              {"₹"}{product.price.toLocaleString("en-IN")}
            </p>
            <div
              onClick={handleViewDetails}
              className="group/btn flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleViewDetails(e as any)
                }
              }}
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Corner lotus petals - decorative */}
        <div className="pointer-events-none absolute -bottom-2 -right-2 opacity-0 transition-all duration-700 group-hover:opacity-100" aria-hidden="true">
          <svg viewBox="0 0 60 60" fill="none" className="h-16 w-16">
            <path d="M60 60 Q40 50 50 30 Q55 45 60 60Z" fill="var(--color-saffron)" opacity="0.12" />
            <path d="M60 60 Q35 55 40 35 Q50 50 60 60Z" fill="var(--color-deep-maroon)" opacity="0.08" />
          </svg>
        </div>
        <div className="pointer-events-none absolute -left-2 -top-2 opacity-0 transition-all duration-700 group-hover:opacity-100" aria-hidden="true">
          <svg viewBox="0 0 60 60" fill="none" className="h-16 w-16">
            <path d="M0 0 Q20 10 10 30 Q5 15 0 0Z" fill="var(--color-saffron)" opacity="0.12" />
            <path d="M0 0 Q25 5 20 25 Q10 10 0 0Z" fill="var(--color-deep-maroon)" opacity="0.08" />
          </svg>
        </div>
      </div>
    </>
  )
}