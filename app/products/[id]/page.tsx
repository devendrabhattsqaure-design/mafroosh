import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ArrowLeft, Star, Truck, Shield, Package, Sparkles } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import AnimatedSection from "@/components/AnimatedSection"
import ProductActions from "@/components/ProductActions"

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Types
interface ProductImage {
  image_url: string
  is_primary: boolean
  display_order: number
}

interface Product {
  product_id: number | string  // API might return number
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
}

// Fetch function with org_id header
async function fetchWithOrg(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'x-org-id': '1',
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }
  return response.json()
}

// Fetch product by ID
async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetchWithOrg(`/products/${id}`)
    return response.data || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Fetch related products
async function getRelatedProducts(categoryId: number, currentProductId: string): Promise<Product[]> {
  try {
    const response = await fetchWithOrg(`/products?category_id=${categoryId}&limit=4`)
    // Filter out current product and limit to 3
    return (response.data || [])
      .filter((p: Product) => String(p.product_id) !== currentProductId)
      .slice(0, 3)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

// Generate static params for build time
export async function generateStaticParams() {
  try {
    const response = await fetchWithOrg('/products?limit=100')
    const products = response.data || []
    
    // Convert product_id to string for each param
    return products.map((product: Product) => ({ 
      id: String(product.product_id) // Ensure ID is string
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [] // Return empty array to skip static generation
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {
      title: "Product Not Found - mafroosh",
      description: "The requested product could not be found.",
    }
  }
  
  return {
    title: `${product.product_name} - mafroosh`,
    description: product.short_description || product.description,
    openGraph: {
      title: product.product_name,
      description: product.short_description || product.description,
      images: product.images?.[0]?.image_url ? [{ url: product.images[0].image_url }] : [],
    },
  }
}

const features = [
  {
    icon: Check,
    text: "100% authentic and natural materials",
  },
  {
    icon: Sparkles,
    text: "Handcrafted by traditional artisans",
  },
  {
    icon: Shield,
    text: "Quality checked before shipping",
  },
  {
    icon: Package,
    text: "Eco-friendly packaging",
  },
]

const reviews = [
  {
    name: "Anita Verma",
    text: "Excellent quality! The craftsmanship is truly divine. I use it every day for my morning pooja.",
    rating: 5,
  },
  {
    name: "Suresh Kumar",
    text: "Very happy with the product. Authentic and beautifully made. Will order again for sure.",
    rating: 5,
  },
  {
    name: "Lakshmi Iyer",
    text: "Packaging was excellent and delivery was fast. The product exceeded my expectations in quality.",
    rating: 4,
  },
]

// Transform product for ProductCard
const transformProductForCard = (product: Product) => ({
  id: String(product.product_id), // Ensure ID is string
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category_id, id)

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary to-secondary/95 py-16 md:py-20 overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-sandal)] hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <h1 className="font-serif text-3xl font-bold text-[var(--color-sandal)] md:text-4xl lg:text-5xl">
              {product.product_name}
            </h1>
            {product.is_new_arrival && (
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                NEW ARRIVAL
              </span>
            )}
            {product.is_bestseller && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-600 text-xs font-semibold rounded-full">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Breadcrumb */}
          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-sandal)]/70">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category_name?.toLowerCase()}`} className="hover:text-primary transition-colors">
              {product.category_name || "Category"}
            </Link>
          </div>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <AnimatedSection className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 shadow-xl bg-muted group">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images.find(img => img.is_primary)?.image_url || product.images[0].image_url}
                    alt={product.product_name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Package className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}

                {/* Sale badge */}
                {product.is_on_sale && product.compare_price && product.compare_price > product.price && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                    {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                  </div>
                )}

                {/* Stock status */}
                <div className="absolute top-4 right-4 z-10">
                  {product.stock_quantity > 0 ? (
                    <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      In Stock ({product.stock_quantity})
                    </div>
                  ) : (
                    <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-lg overflow-hidden border border-border/50 cursor-pointer hover:border-primary transition-colors"
                    >
                      <Image
                        src={image.image_url}
                        alt={`${product.product_name} - View ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 10vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>

            {/* Product Details */}
            <AnimatedSection delay={150}>
              <div>
                {/* Category and SKU */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    {product.category_name || "Uncategorized"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    SKU: {product.sku || "N/A"}
                  </span>
                </div>

                {/* Title and price */}
                <h2 className="mt-6 font-serif text-2xl font-bold text-foreground md:text-3xl">
                  {product.product_name}
                </h2>
                
                <div className="mt-4 flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-primary">
                    {"₹"}{product.price.toLocaleString("en-IN")}
                  </p>
                  {product.compare_price && product.compare_price > product.price && (
                    <p className="text-lg text-muted-foreground line-through">
                      {"₹"}{product.compare_price.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({Math.floor(Math.random() * 50) + 10} reviews)
                    </span>
                  </div>
                )}

                {/* Description */}
                <div className="mt-6 space-y-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  {product.short_description && (
                    <p className="text-sm text-muted-foreground/80 italic">
                      {product.short_description}
                    </p>
                  )}
                </div>

                {/* Key Features */}
                <ul className="mt-8 flex flex-col gap-3">
                  {features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <feature.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* Product Specifications */}
                {(product.material || product.color || product.dimensions || product.weight) && (
                  <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border/50">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {product.material && (
                        <div>
                          <span className="text-muted-foreground">Material:</span>
                          <p className="font-medium text-foreground">{product.material}</p>
                        </div>
                      )}
                      {product.color && (
                        <div>
                          <span className="text-muted-foreground">Color:</span>
                          <p className="font-medium text-foreground">{product.color}</p>
                        </div>
                      )}
                      {product.dimensions && (
                        <div>
                          <span className="text-muted-foreground">Dimensions:</span>
                          <p className="font-medium text-foreground">{product.dimensions}</p>
                        </div>
                      )}
                      {product.weight && (
                        <div>
                          <span className="text-muted-foreground">Weight:</span>
                          <p className="font-medium text-foreground">{product.weight} kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery info */}
                <div className="mt-6 flex items-center gap-6 p-4 bg-primary/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-sm">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm">2-Year Warranty</span>
                  </div>
                </div>

                {/* Product Actions - Client Component */}
                <ProductActions product={transformProductForCard(product)} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Reviews
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              What Customers Say
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {reviews.map((review, i) => (
              <AnimatedSection key={review.name} delay={i * 100}>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground italic">
                    {`"${review.text}"`}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {review.name[0]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.name}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Write review button */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
              Write a Review
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <AnimatedSection className="text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                You May Also Like
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
                Related Products
              </h2>
            </AnimatedSection>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p, i) => (
                <AnimatedSection key={p.product_id} delay={i * 100}>
                  <ProductCard product={transformProductForCard(p)} index={i} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}