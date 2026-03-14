"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Shield, Truck, Star, Sparkles, HandHeart, ChevronRight, Package, ArrowRight } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import ProductCard from "@/components/ProductCard"
import AnimatedSection from "@/components/AnimatedSection"
import InteractiveFurnitureShowcase from "@/components/InteractiveFurnitureShowcase"


// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Types
interface Product {
  product_id: string
  product_name: string
  description: string
  short_description: string
  price: number
  category_id: number
  category_name: string
  images: Array<{ image_url: string; is_primary: boolean }>
  is_featured: boolean
  is_bestseller: boolean
  is_new_arrival: boolean
  is_on_sale: boolean
  stock_quantity: number
  rating?: number
  slug: string
  material?: string
  dimensions?: string
}

interface Category {
  category_id: number
  category_name: string
  slug: string
  description: string
  image_url: string
}

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    description:
      "Every piece is crafted using the finest materials and superior craftsmanship to ensure durability and elegance.",
  },
  {
    icon: Sparkles,
    title: "Modern Designs",
    description:
      "Contemporary furniture and decor items that blend style with functionality for your modern lifestyle.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description:
      "Fast and secure shipping across India with professional handling to ensure your items arrive in perfect condition.",
  },
  {
    icon: HandHeart,
    title: "Customer First",
    description:
      "Dedicated customer support and hassle-free returns to ensure your complete satisfaction with every purchase.",
  },
]

// Function to fetch with org_id header
const fetchWithOrg = async (endpoint: string) => {
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

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch featured products
        const productsData = await fetchWithOrg('/products?featured=true')
        setFeaturedProducts(productsData.data || [])
        
        // Fetch categories with images
        const categoriesData = await fetchWithOrg('/categories')
        setCategories(categoriesData.data || [])
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Transform API product to match ProductCard props
  const transformProduct = (product: Product) => ({
    id: product.product_id,
    name: product.product_name,
    description: product.short_description || product.description,
    price: product.price,
    image: product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || '/images/placeholder.jpg',
    category: product.category_name?.toLowerCase().replace(' ', '-') || 'uncategorized',
    material: product.material,
    dimensions: product.dimensions,
    inStock: product.stock_quantity > 0,
    isNew: product.is_new_arrival,
    isBestseller: product.is_bestseller,
    discount: product.is_on_sale ? 10 : undefined, // You can calculate actual discount from compare_price
    rating: product.rating || 4.5,
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading beautiful furniture for you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Package className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Transform Your Home with Elegance"
        subtitle="Premium Furniture & Decor by Mafroosh"
        size="large"
        videoSrc="/images/video2.mp4"
        videoType="mp4"
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="rounded-xl border-2 border-[var(--color-gold)] bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Explore Products
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border-2 border-[var(--color-gold)] px-8 py-3.5 font-semibold text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/10"
          >
            Visit Our Store
          </Link>
        </div>
      </HeroSection>

      {/* Interactive Furniture Showcase */}
      <InteractiveFurnitureShowcase />

      {/* Categories Section with Images */}
      {categories.length > 0 && (
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <AnimatedSection className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Shop by Category
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
                Explore Our Collections
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
                Browse through our carefully curated categories to find the perfect pieces for your home
              </p>
            </AnimatedSection>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 4).map((category, index) => (
                <AnimatedSection key={category.category_id} delay={index * 100}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group relative block overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Category Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={category.image_url || '/images/category-placeholder.jpg'}
                        alt={category.category_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Category name and description */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-serif text-xl font-bold mb-2">
                          {category.category_name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-white/80 line-clamp-2 mb-3">
                            {category.description}
                          </p>
                        )}
                        
                        {/* Shop now indicator */}
                        <div className="flex items-center gap-2 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                          <span>Shop Now</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            {/* View All Categories Button */}
            <AnimatedSection className="mt-12 text-center">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3.5 font-semibold text-secondary-foreground transition-all hover:bg-secondary/90 hover:shadow-md group"
              >
                View All Categories
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Our Collection
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Featured Furniture & Decor
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
              Discover our handpicked selection of premium furniture and home decor pieces, crafted with elegance and quality.
            </p>
          </AnimatedSection>

          {featuredProducts.length > 0 ? (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product, i) => (
                <AnimatedSection key={product.product_id} delay={i * 100}>
                  <ProductCard product={transformProduct(product)} index={i} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="mt-14 text-center py-12 bg-muted/30 rounded-2xl">
              <Package className="h-16 w-16 text-primary/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No featured products available at the moment.</p>
            </div>
          )}

          <AnimatedSection className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3.5 font-semibold text-secondary-foreground transition-all hover:bg-secondary/90 hover:shadow-md group"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Why Choose Us
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Why Mafroosh is Your Choice
            </h2>
          </AnimatedSection>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 100}>
                <div className="rounded-xl bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Testimonials
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              Love from Our Customers
            </h2>
          </AnimatedSection>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <AnimatedSection key={testimonial.name} delay={i * 100}>
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
                    {`"${testimonial.text}"`}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-serif font-bold text-primary">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-20 md:py-28 relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <AnimatedSection className="text-center">
            <h2 className="font-serif text-3xl font-bold text-[var(--color-gold)] md:text-4xl text-balance">
              Start Creating Your Dream Home Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/80 leading-relaxed">
              Explore our complete collection of premium furniture and decor pieces to bring elegance and comfort to your space.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md hover:scale-105"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border-2 border-[var(--color-gold)] px-8 py-3.5 font-semibold text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/10 hover:scale-105"
              >
                Contact Us
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-secondary-foreground/60">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free Shipping*</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>2-Year Warranty</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "The sofa from Mafroosh transformed my living room! The quality is exceptional and the design is absolutely stunning. Highly recommended!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    text: "Excellent furniture pieces with outstanding craftsmanship. The dining chairs are super comfortable and look elegant. Great value for money.",
    rating: 5,
  },
  {
    name: "Anjali Desai",
    location: "Bangalore",
    text: "Mafroosh has everything I needed to decorate my home. The area rug and pillows complement each other perfectly. Amazing experience!",
    rating: 5,
  },
]