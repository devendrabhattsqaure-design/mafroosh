// components/ProductsGrid.tsx
"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import AnimatedSection from "@/components/AnimatedSection"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, Loader2, Package, X } from "lucide-react"

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Types
interface ProductImage {
  image_url: string
  is_primary: boolean
  display_order: number
}

interface Product {
  product_id: number | string
  product_name: string
  description: string
  short_description: string
  price: number
  compare_price: number
  category_id: number
  category_name: string
  images: ProductImage[]
  material: string
  color: string
  dimensions: string
  weight: number
  stock_quantity: number
  is_featured: boolean
  is_bestseller: boolean
  is_new_arrival: boolean
  is_on_sale: boolean
  brand: string
  sku: string
  slug: string
  rating?: number
}

interface Category {
  category_id: number
  category_name: string
  slug: string
  description?: string
  image_url?: string
}

// Fetch function with org_id header
async function fetchWithOrg(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'x-org-id': '1',
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }
  return response.json()
}

// Transform product for ProductCard
const transformProductForCard = (product: Product) => ({
  id: String(product.product_id),
  name: product.product_name,
  description: product.short_description || product.description,
  price: product.price,
  image: product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || '/images/placeholder.jpg',
  category: product.category_name?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized',
  material: product.material,
  dimensions: product.dimensions,
  inStock: product.stock_quantity > 0,
  isNew: product.is_new_arrival,
  isBestseller: product.is_bestseller,
  discount: product.is_on_sale && product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : undefined,
  rating: product.rating || 4.5,
})

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [sortBy, setSortBy] = useState<string>("default")

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories first
        const categoriesData = await fetchWithOrg('/categories')
        setCategories(categoriesData.data || [])
        
        // Fetch all products
        const productsData = await fetchWithOrg('/products?limit=100')
        setProducts(productsData.data || [])
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products by category
  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => 
        p.category_name?.toLowerCase().replace(/\s+/g, '-') === activeCategory ||
        String(p.category_id) === activeCategory
      )

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0)
      case "bestseller":
        return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0)
      default:
        return 0
    }
  })

  // Build category options from API data
  const categoryOptions = [
    { value: "all", label: "All Products", count: products.length },
    ...categories.map(cat => ({
      value: cat.slug || String(cat.category_id),
      label: cat.category_name,
      count: products.filter(p => p.category_id === cat.category_id).length
    }))
  ]

  if (loading) {
    return (
      <section className="bg-background py-20 md:py-28 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading our divine collection...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-background py-20 md:py-28 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Package className="h-16 w-16 text-primary/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header with filters and sort */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between mb-12">
          {/* Mobile filter button */}
          <button
            onClick={() => setShowMobileFilter(true)}
            className="md:hidden flex items-center justify-between gap-4 w-full bg-white border border-black px-6 py-5 text-black font-bold"
          >
            <div className="flex items-center gap-3">
               <Filter className="h-4 w-4" />
               <span className="uppercase tracking-[0.3em] text-[10px]">Filter Collection</span>
            </div>
            <span className="text-secondary uppercase tracking-widest text-[10px]">{activeCategory === 'all' ? 'All' : activeCategory}</span>
          </button>

          {/* Desktop categories */}
          <AnimatedSection className="hidden md:flex flex-wrap items-center gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`relative px-8 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 ${
                  activeCategory === cat.value
                    ? "bg-black text-white"
                    : "bg-white border border-border text-black/60 hover:border-black hover:text-black"
                }`}
              >
                {cat.label}
                {cat.count > 0 && (
                  <span className={`ml-3 text-[9px] font-medium ${
                    activeCategory === cat.value
                      ? "text-secondary"
                      : "text-muted-foreground/50"
                  }`}>
                    {cat.count}
                  </span>
                )}
                {activeCategory === cat.value && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary"
                  />
                )}
              </button>
            ))}
          </AnimatedSection>

          {/* Sort dropdown */}
          <AnimatedSection delay={100} className="flex items-center gap-6">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 hidden sm:block">Sort By</span>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-border rounded-none px-10 py-4 pr-14 text-[10px] font-bold uppercase tracking-[0.3em] text-black focus:outline-none focus:border-black transition-all cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="newest">Newest</option>
                <option value="bestseller">Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                 <Filter className="h-3 w-3" />
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {showMobileFilter && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 right-0 z-50 w-64 bg-card shadow-2xl md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-bold">Categories</h3>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setActiveCategory(cat.value)
                        setShowMobileFilter(false)
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                        activeCategory === cat.value
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeCategory === cat.value
                          ? "bg-primary-foreground text-primary"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <AnimatedSection delay={150} className="mb-6 text-sm text-muted-foreground">
          Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
        </AnimatedSection>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product, i) => (
              <AnimatedSection key={product.product_id} delay={i * 80}>
                <ProductCard product={transformProductForCard(product)} index={i} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center py-16 bg-muted/30 rounded-2xl"
          >
            <Package className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeCategory === "all" 
                ? "No products available in this category." 
                : "Try selecting a different category."}
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                View All Products
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}