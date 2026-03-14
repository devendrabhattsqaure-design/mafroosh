"use client"

import { useState, memo, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, ArrowRight, Eye, Star, Heart } from "lucide-react"
import dynamic from 'next/dynamic'
import { useCartStore } from "@/store/cartStore"
import { useToast } from "@/hooks/use-toast"



const SparklerEffect = dynamic(() => import("./SparklerEffect"), { ssr: false })

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  material?: string
  dimensions?: string
  inStock?: boolean
  isNew?: boolean
  isBestseller?: boolean
  discount?: number
  rating?: number
  reviewCount?: number
  colors?: string[]
}

interface ProductCardProps {
  product: Product
  index?: number
  priority?: boolean
  onQuickView?: (product: Product) => void
  variant?: 'grid' | 'list' | 'compact'
}

const categoryLabels: Record<string, string> = {
  table: "Tables",
  sofas: "Sofas",
  almirah: "Almirahs",
  chairs: "Chairs",
  beds: "Beds",
  decor: "Decor",
}

// Utility function for price formatting
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Calculate discounted price
const getDiscountedPrice = (price: number, discount?: number): number => {
  return discount ? price - (price * discount) / 100 : price
}

function ProductCard({ 
  product, 
  index = 0, 
  priority = false,
  onQuickView,
  variant = 'grid' 
}: ProductCardProps) {
  const [showSparkler, setShowSparkler] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [isNavigating, setIsNavigating] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showQuickAddFeedback, setShowQuickAddFeedback] = useState(false)
  
  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const { showToast } = useToast()

  // Memoized calculations
  const discountedPrice = useMemo(() => 
    getDiscountedPrice(product.price, product.discount), 
    [product.price, product.discount]
  )

  const savingsAmount = useMemo(() => 
    product.discount ? product.price - discountedPrice : 0,
    [product.price, discountedPrice, product.discount]
  )

  const handleViewDetails = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    
    
    // Get click position for sparkler effect
    const rect = e.currentTarget.getBoundingClientRect()
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    
    // Trigger sparkler and navigation
    setShowSparkler(true)
    setIsNavigating(true)
    
    // Navigate after sparkler effect
    setTimeout(() => {
      setShowSparkler(false)
      router.push(`/products/${product.id}`)
    }, 800)
  }, [product.id, product.name, product.category, index, router])

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Show immediate feedback
    setShowQuickAddFeedback(true)
    setTimeout(() => setShowQuickAddFeedback(false), 1500)
    
    // Add to cart
    addItem({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      originalPrice: product.discount ? product.price : undefined,
      image: product.image,
      category: product.category,
      quantity: 1,
    })
    
    // Track analytics
    
    
    // Show toast notification
    showToast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
      type: "success",
      duration: 3000,
      action: {
        label: "View Cart",
        onClick: openCart
      }
    })
  }, [product, discountedPrice, addItem, openCart, showToast])

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(prev => !prev)
    
    showToast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
      type: "success",
      duration: 2000,
    })
    
   
  }, [isWishlisted, product.id, product.name, showToast])

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
    
   
  }, [onQuickView, product])

  // Badge determination
  const badges = useMemo(() => {
    const badgeList = []
    if (product.isNew) badgeList.push({ text: "New", color: "bg-emerald-500" })
    if (product.isBestseller) badgeList.push({ text: "Bestseller", color: "bg-amber-500" })
    if (product.discount) badgeList.push({ 
      text: `${product.discount}% OFF`, 
      color: "bg-rose-500" 
    })
    if (product.inStock === false) badgeList.push({ 
      text: "Out of Stock", 
      color: "bg-gray-500" 
    })
    return badgeList
  }, [product.isNew, product.isBestseller, product.discount, product.inStock])

  // Conditional classes based on variant
  const cardClasses = {
    grid: "flex-col",
    list: "flex-row items-stretch gap-4",
    compact: "flex-col p-2"
  }

  const imageContainerClasses = {
    grid: "m-3 mt-4 aspect-square",
    list: "w-48 aspect-square m-2",
    compact: "aspect-square m-1"
  }

  const contentClasses = {
    grid: "px-5 pb-5 -mt-1",
    list: "flex-1 py-4 pr-4",
    compact: "p-2"
  }

  return (
    <>
      <SparklerEffect isActive={showSparkler} x={clickPosition.x} y={clickPosition.y} />
      <article
        className={`group relative flex overflow-hidden rounded-2xl bg-card product-card-lotus transition-all duration-500 ${
          variant === 'grid' && 'hover:-translate-y-2'
        } ${isNavigating ? 'pointer-events-none opacity-70' : ''} ${
          variant === 'list' ? 'hover:shadow-xl' : ''
        } ${cardClasses[variant]}`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Image Section */}
        <Link
          href={`/products/${product.id}`}
          className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            variant === 'list' ? 'shrink-0' : ''
          }`}
          onClick={(e) => isNavigating && e.preventDefault()}
          aria-label={`View details for ${product.name}`}
        >
          <div className={`relative overflow-hidden rounded-xl ${imageContainerClasses[variant]}`}>
            {/* Image with loading state */}
            <div className={`relative w-full h-full transition-all duration-700 ${
              isImageLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'
            }`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority || index < 4}
                onLoadingComplete={() => setIsImageLoading(false)}
              />
            </div>

            {/* Loading skeleton */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            )}

            {/* Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden="true"
            />

            {/* Badges Container */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className={`${badge.color} px-2.5 py-1 text-xs font-bold text-white rounded-full shadow-lg backdrop-blur-sm`}
                >
                  {badge.text}
                </span>
              ))}
            </div>

            {/* Category badge */}
            <div className="absolute left-2 bottom-2 flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                {categoryLabels[product.category] || product.category}
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-400 group-hover:translate-y-0">
              <div className="flex justify-center gap-2 p-3 bg-gradient-to-t from-black/80 to-transparent">
                {/* Quick View Button */}
                {onQuickView && (
                  <button
                    onClick={handleQuickView}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-transform hover:scale-110"
                    aria-label="Quick view"
                    title="Quick view"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    isWishlisted 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-white/90 text-gray-800 hover:bg-white'
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Add Button */}
                <button
                  onClick={handleQuickAdd}
                  disabled={product.inStock === false}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    product.inStock === false
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                  aria-label="Quick add to cart"
                  title={product.inStock === false ? "Out of stock" : "Add to cart"}
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick add feedback indicator */}
            {showQuickAddFeedback && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                <div className="bg-white rounded-full p-2 shadow-lg animate-bounce">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
            )}

            {/* Price tag on image (for grid view) */}
            {variant === 'grid' && (
              <div className="absolute right-2 bottom-2 translate-y-4 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-lg font-bold text-gray-900 shadow-lg backdrop-blur-sm">
                  {formatPrice(discountedPrice)}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className={`relative flex flex-1 flex-col ${contentClasses[variant]}`}>
          {/* Rating (if available) */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {product.reviewCount && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Product name */}
          <Link 
            href={`/products/${product.id}`} 
            className="hover:underline decoration-primary underline-offset-2"
            onClick={(e) => isNavigating && e.preventDefault()}
          >
            <h3 className={`font-serif font-bold text-foreground leading-snug tracking-wide ${
              variant === 'compact' ? 'text-sm' : 'text-lg'
            }`}>
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {variant !== 'compact' && (
            <p className={`mt-1.5 line-clamp-2 text-muted-foreground ${
              variant === 'list' ? 'text-sm' : 'text-[13px]'
            }`}>
              {product.description}
            </p>
          )}

          {/* Product specs (for list view) */}
          {variant === 'list' && product.material && (
            <p className="mt-2 text-xs text-muted-foreground">
              Material: {product.material}
              {product.dimensions && ` | Dimensions: ${product.dimensions}`}
            </p>
          )}

          {/* Color options (if available) */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mt-2">
              {product.colors.slice(0, 3).map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={`Available in ${color}`}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex-1" />

          {/* Price and CTA row */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className={`font-bold text-secondary ${
                  variant === 'compact' ? 'text-base' : 'text-xl'
                }`}>
                  {formatPrice(discountedPrice)}
                </span>
                {product.discount && (
                  <span className="text-xs line-through text-muted-foreground">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.discount && (
                <span className="text-xs text-green-600 font-semibold">
                  Save {formatPrice(savingsAmount)}
                </span>
              )}
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleQuickAdd}
              disabled={product.inStock === false}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                product.inStock === false
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary-dark'
              }`}
              aria-label={product.inStock === false ? "Out of stock" : "Add to cart"}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>

          {/* View details button (for list view) */}
          {variant === 'list' && (
            <button
              onClick={handleViewDetails}
              className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* Decorative lotus petals */}
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
      </article>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard)