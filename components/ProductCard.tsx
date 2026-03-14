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
  const { toast } = useToast()

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
    })
    
    // Show toast notification
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
      type: "success",
      duration: 3000,
      action: {
        label: "View Cart",
        onClick: openCart
      }
    } as any) // Cast to any because of potential strict type mismatch with custom ToastActionElement
  }, [product, discountedPrice, addItem, openCart, toast])

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(prev => !prev)
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
      type: "success",
      duration: 2000,
    } as any)
    
   
  }, [isWishlisted, product.id, product.name, toast])

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
        className={`group relative flex overflow-hidden bg-white border border-border transition-all duration-700 ${
          variant === 'grid' && 'hover:shadow-premium'
        } ${isNavigating ? 'pointer-events-none opacity-50' : ''} ${
          cardClasses[variant]
        }`}
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
          <div className={`relative overflow-hidden bg-muted/30 ${imageContainerClasses[variant]}`}>
            {/* Image with loading state */}
            <div className={`relative w-full h-full transition-all duration-1000 ${
              isImageLoading ? 'scale-110 blur-xl' : 'scale-100 blur-0'
            }`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-1000 group-hover:scale-110 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority || index < 4}
                onLoadingComplete={() => setIsImageLoading(false)}
              />
            </div>

            {/* Badges Container */}
            <div className="absolute left-0 top-6 flex flex-col gap-1 z-20">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white ${badge.color} shadow-sm`}
                >
                  {badge.text}
                </span>
              ))}
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center gap-4">
                <button
                  onClick={handleQuickView}
                  className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300 shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-12 h-12 flex items-center justify-center transition-colors duration-300 shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200 ${
                    isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-black hover:bg-secondary hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <div className={`relative flex flex-1 flex-col ${contentClasses[variant]} border-t border-border/10`}>
          {/* Category */}
          <div className="mb-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
               {categoryLabels[product.category] || product.category}
            </span>
          </div>

          {/* Product name */}
          <Link 
            href={`/products/${product.id}`} 
            className="group/title"
            onClick={(e) => isNavigating && e.preventDefault()}
          >
            <h3 className={`font-serif text-foreground transition-colors group-hover/title:text-secondary leading-tight ${
              variant === 'compact' ? 'text-base' : 'text-2xl'
            }`}>
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {variant !== 'compact' && (
            <p className="mt-4 line-clamp-2 text-muted-foreground/80 leading-relaxed font-light text-sm tracking-wide">
              {product.description}
            </p>
          )}

          <div className="flex-1" />

          {/* Price and CTA */}
          <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
                <span className="font-bold text-black text-xl tracking-tight">
                  {formatPrice(discountedPrice)}
                </span>
                {product.discount && (
                  <span className="text-xs line-through text-muted-foreground/40 font-light">
                    {formatPrice(product.price)}
                  </span>
                )}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={product.inStock === false}
              className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                product.inStock === false
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-black text-white hover:bg-secondary shadow-[3px_3px_0px_0px_rgba(212,175,55,0.3)] hover:shadow-none translate-x-[-1px] translate-y-[-1px] hover:translate-x-0 hover:translate-y-0'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard)