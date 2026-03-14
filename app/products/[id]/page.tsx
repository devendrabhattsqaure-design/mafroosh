"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Check, ArrowLeft, Star, Truck, Shield, Package, Sparkles, ChevronRight, Share2, Heart, ShieldCheck } from "lucide-react"
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
    rating: 5,
  },
]

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
  originalPrice: product.compare_price > product.price ? product.compare_price : undefined,
  rating: product.rating || 4.8,
})

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          headers: { 'x-org-id': '1' }
        })
        const data = await response.json()
        
        if (data.success && data.data) {
          setProduct(data.data)
          
          // Fetch related
          const relatedResponse = await fetch(`${API_BASE_URL}/products?category_id=${data.data.category_id}&limit=4`, {
            headers: { 'x-org-id': '1' }
          })
          const relatedData = await relatedResponse.json()
          setRelatedProducts((relatedData.data || []).filter((p: Product) => String(p.product_id) !== id).slice(0, 4))
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-r-transparent mx-auto" />
          <p className="mt-4 text-primary font-serif italic">Revealing excellence...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
    return null
  }

  return (
    <div className="bg-background">
      {/* Premium Hero / Breadcrumb Section */}
      <section className="relative overflow-hidden bg-primary py-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-secondary blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
                <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/products" className="hover:text-secondary transition-colors">Collection</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-secondary">{product.category_name}</span>
              </nav>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white">
                {product.product_name}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/20">
                  <Heart className="h-5 w-5" />
               </button>
               <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/20">
                  <Share2 className="h-5 w-5" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main product Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* Gallery */}
            <AnimatedSection>
              <div className="sticky top-24 space-y-6">
                <div className="group relative aspect-square overflow-hidden rounded-[2rem] bg-muted shadow-2xl transition-all">
                  {product.images?.[activeImage] ? (
                    <Image
                      src={product.images[activeImage].image_url}
                      alt={product.product_name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/5">
                      <Package className="h-20 w-20 text-primary/10" />
                    </div>
                  )}
                  
                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.is_new_arrival && (
                      <span className="rounded-full bg-secondary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-secondary-foreground shadow-lg">New Arrival</span>
                    )}
                    {product.is_bestseller && (
                      <span className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg border border-white/10">Bestseller</span>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${activeImage === i ? 'border-secondary scale-95 shadow-lg' : 'border-transparent hover:border-secondary/30'}`}
                      >
                        <Image src={img.image_url} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection delay={200}>
              <div className="flex flex-col h-full">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
                    {product.brand || "Authentic Collection"}
                  </span>
                  <div className="flex items-center gap-1.5 bg-secondary/10 px-3 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <span className="text-xs font-bold text-primary">4.8 / 5.0</span>
                  </div>
                </div>

                <h2 className="font-serif text-3xl font-bold text-primary md:text-5xl leading-tight mb-6">
                  Fine Artistry in Every Detail
                </h2>

                <div className="mb-8 flex items-baseline gap-4">
                  <span className="font-serif text-4xl font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.compare_price > product.price && (
                    <span className="text-xl text-muted-foreground line-through opacity-50">₹{product.compare_price.toLocaleString("en-IN")}</span>
                  )}
                  {product.compare_price > product.price && (
                    <span className="rounded-lg bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600">
                      -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                    </span>
                  )}
                </div>

                <p className="text-lg leading-relaxed text-muted-foreground font-light mb-8 italic border-l-2 border-secondary pl-6">
                  {product.short_description || "Experience the perfect blend of heritage and modern luxury. Each piece is meticulously curated to transform your living space into a sanctuary of elegance."}
                </p>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                   {[
                     { label: "Material", value: product.material },
                     { label: "Dimensions", value: product.dimensions },
                     { label: "Collection", value: product.category_name },
                     { label: "Availability", value: product.stock_quantity > 0 ? "In Stock" : "Limited Release" }
                   ].map((spec, i) => spec.value && (
                     <div key={i} className="rounded-2xl bg-muted/50 p-4 border border-border/40">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{spec.label}</p>
                        <p className="text-sm font-bold text-primary">{spec.value}</p>
                     </div>
                   ))}
                </div>

                {/* Main Action Component */}
                <div className="mt-auto">
                   <ProductActions product={transformProductForCard(product)} />
                </div>

                {/* Trust Section */}
                <div className="mt-12 grid grid-cols-2 gap-6 pt-12 border-t border-border/60">
                   <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                         <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-primary uppercase tracking-tighter">Lifetime Guarantee</p>
                         <p className="text-[10px] text-muted-foreground mt-0.5">Authenticity & Quality Certified</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                         <Truck className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-primary uppercase tracking-tighter">Artisan Handling</p>
                         <p className="text-[10px] text-muted-foreground mt-0.5">Premium pan-India delivery</p>
                      </div>
                   </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Extended Product Story / Description */}
      <section className="bg-muted/30 py-24">
         <div className="mx-auto max-w-4xl px-6 text-center">
            <AnimatedSection>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">The Narrative</span>
               <h3 className="mt-6 font-serif text-3xl font-bold text-primary md:text-5xl mb-10">Crafted for Connoisseurs</h3>
               <div className="mx-auto h-0.5 w-16 bg-secondary mb-12" />
               <div className="text-lg leading-[1.8] text-muted-foreground font-light text-balance space-y-6">
                  {product.description.split('\n').map((para, i) => (
                    <p key={i} className="text-primary/70">{para}</p>
                  ))}
               </div>
            </AnimatedSection>
         </div>
      </section>

      {/* Reviews */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <AnimatedSection>
              <h2 className="font-serif text-4xl font-bold text-primary">Guest Impressions</h2>
              <p className="text-muted-foreground mt-2 font-light">Authentic experiences from our cherished community.</p>
            </AnimatedSection>
            <button className="rounded-full bg-primary px-8 py-3 text-xs font-black uppercase tracking-widest text-primary-foreground transition-all hover:bg-secondary hover:text-secondary-foreground">Share Your Experience</button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((review, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                 <div className="rounded-3xl border border-border bg-white p-10 shadow-soft transition-all hover:shadow-xl group">
                   <div className="flex gap-1 mb-8">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                      ))}
                   </div>
                   <p className="text-lg font-light leading-relaxed italic text-primary/80 mb-10">"{review.text}"</p>
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground font-serif">{review.name[0]}</div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{review.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Verified Collector</p>
                      </div>
                   </div>
                 </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Related Selections */}
      {relatedProducts.length > 0 && (
        <section className="bg-muted/30 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <AnimatedSection className="mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">A Curated Pairing</span>
              <h2 className="mt-4 font-serif text-4xl font-bold text-primary">Discover Harmony</h2>
            </AnimatedSection>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                  <ProductCard product={transformProductForCard(p)} index={i} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}