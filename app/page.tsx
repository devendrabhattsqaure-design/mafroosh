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
        title="Curating Elegance for Every Corner"
        subtitle="Exclusive Premium Decor, Artisanal Accents & Statement Pieces for the Modern Sanctuary"
        size="large"
        videoSrc="/images/video2.mp4"
        videoType="mp4"
      >
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
          <Link
            href="/products"
            className="group relative px-12 py-5 bg-secondary text-white text-[11px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:pr-16"
          >
            <span className="relative z-10 transition-all group-hover:tracking-[0.4em]">Shop Collection</span>
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:right-8 h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="px-12 py-5 border border-white/40 text-white text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-black"
          >
            Design Consultation
          </Link>
        </div>
      </HeroSection>

      {/* Interactive Furniture Showcase */}
      <InteractiveFurnitureShowcase />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <AnimatedSection className="text-center mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                Our Collections
              </span>
              <h2 className="mt-4 font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl text-balance">
                Shop by Space
              </h2>
              <div className="mx-auto mt-6 h-1 w-20 bg-secondary" />
            </AnimatedSection>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16">
              {categories.map((category, index) => (
                <AnimatedSection key={category.category_id} delay={index * 100}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group flex flex-col items-center text-center gap-6"
                  >
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 overflow-hidden rounded-full border-2 border-transparent group-hover:border-secondary transition-all duration-700 shadow-sm hover:shadow-2xl bg-muted ring-offset-4 ring-0 group-hover:ring-2 ring-secondary/20">
                      <Image
                        src={category.image_url || '/images/category-placeholder.jpg'}
                        alt={category.category_name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                      />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="font-serif text-xl font-medium text-black group-hover:text-secondary transition-colors duration-500">
                        {category.category_name}
                      </h3>
                      <div className="h-0.5 w-0 bg-secondary transition-all duration-500 group-hover:w-8" />
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-black pb-12">
            <AnimatedSection>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4 block">
                The Collection
              </span>
              <h2 className="font-serif text-5xl font-medium text-black md:text-7xl tracking-tighter">
                Masterpieces in Wood & Fabric
              </h2>
            </AnimatedSection>
            
            <Link
              href="/products"
              className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-black hover:text-secondary transition-all group"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product, i) => (
                <AnimatedSection key={product.product_id} delay={i * 100}>
                  <ProductCard product={transformProduct(product)} index={i} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-dashed border-border">
              <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-6" />
              <p className="text-muted-foreground font-light tracking-widest uppercase text-xs">Curating New Arrivals</p>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story / Legacy */}
      <section className="py-24 md:py-32 overflow-hidden border-t border-border">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative flex flex-col gap-8">
              <div className="relative aspect-[4/5] overflow-hidden group border border-border">
                <Image 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000" 
                  alt="Premium Interior" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xl font-serif italic">"Curating beauty, one space at a time."</p>
                </div>
              </div>
              
              <div className="absolute -right-12 -bottom-12 w-2/3 aspect-square hidden xl:block border-8 border-white overflow-hidden shadow-2xl group">
                <Image 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000" 
                  alt="Decor Detail" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </div>
            
            <AnimatedSection>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-8 block">
                Our Heritage
              </span>
              <h2 className="font-serif text-6xl font-medium text-black md:text-8xl leading-[0.9] tracking-tighter mb-12">
                The Legacy <br /> of Elegance
              </h2>
              <div className="space-y-8 text-black/60 text-lg leading-relaxed font-light tracking-wide max-w-xl">
                <p>
                  For over three decades, Mafroosh has been the premier destination for discerning homeowners looking to infuse their spaces with character. Our journey began with a passion for handcrafted accents that turn a house into a home.
                </p>
                <p>
                  We believe that the smallest details make the biggest impact. From hand-blown glass vases to intricately woven textiles, our curators travel the globe to bring you pieces that are as unique as your story.
                </p>
              </div>
              
              <div className="mt-20 grid grid-cols-2 gap-12 border-t border-border pt-12">
                <div>
                  <h4 className="text-4xl font-serif text-black mb-2">30+</h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Years of Curation</p>
                </div>
                <div>
                  <h4 className="text-4xl font-serif text-black mb-2">10k+</h4>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Adorned Homes</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
             <AnimatedSection>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-6 block">
                  The Mafroosh Standard
                </span>
                <h2 className="font-serif text-5xl font-medium text-black md:text-7xl leading-[0.9] tracking-tighter mb-12">
                  Crafting Perfection <br /> for Your Sanctuary
                </h2>
                <p className="text-xl text-muted-foreground/80 leading-relaxed font-light tracking-wide max-w-xl mb-20">
                  We believe that every home has a soul. Our mission is to provide the pieces that help you express it. Quality, durability, and timeless design are at the heart of everything we do.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
                   {features.map((f, i) => (
                     <div key={i} className="flex flex-col gap-4 border-l border-black/5 pl-6 hover:border-secondary transition-colors duration-500">
                        <div className="text-secondary">
                           <f.icon className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-xl font-medium">{f.title}</h4>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed font-light tracking-wide">{f.description}</p>
                     </div>
                   ))}
                </div>
             </AnimatedSection>
             
             <AnimatedSection className="relative">
                <div className="aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-premium">
                   <Image 
                     src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace" 
                     alt="Interior Design Detail" 
                     fill 
                     className="object-cover"
                   />
                </div>
                <div className="absolute -bottom-12 -left-12 bg-black p-12 shadow-2xl hidden xl:block max-w-sm">
                   <p className="text-white font-serif text-2xl italic font-light leading-relaxed">
                      "Furniture is the foundation of a home's character."
                   </p>
                   <div className="mt-8 h-0.5 w-12 bg-secondary" />
                </div>
             </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 relative overflow-hidden border-t border-border">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 translate-x-1/2" />
        
        <div className="mx-auto max-w-7xl px-8 relative z-10">
          <AnimatedSection className="mb-24 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-6 block font-sans">
              Testimonials
            </span>
            <h2 className="font-serif text-5xl font-medium text-black md:text-7xl tracking-tighter leading-[0.9]">
              Voices of Satisfaction
            </h2>
          </AnimatedSection>
 
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <AnimatedSection key={testimonial.name} delay={i * 100}>
                <div className="h-full bg-white p-12 border border-border flex flex-col group hover:shadow-premium transition-all duration-700">
                  <div className="flex gap-1 mb-8">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-3 w-3 fill-secondary text-secondary"
                      />
                    ))}
                  </div>
                  <p className="text-xl leading-relaxed text-black/70 italic font-light tracking-wide mb-12">
                    {`"${testimonial.text}"`}
                  </p>
                  <div className="mt-auto flex items-center gap-5">
                    <div className="h-10 w-10 bg-secondary flex items-center justify-center font-serif font-medium text-white text-lg">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-black uppercase tracking-[0.2em] text-[10px]">
                        {testimonial.name}
                      </p>
                      <p className="text-[10px] text-black/30 uppercase tracking-widest mt-1">
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
      <section className="py-24 md:py-32 relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-secondary rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="mx-auto max-w-4xl px-8 relative z-10 text-center">
          <AnimatedSection>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-8 block">
              Redefine Your Lifestyle
            </span>
            <h2 className="font-serif text-6xl font-medium text-black md:text-8xl leading-[0.9] tracking-tighter mb-10">
              Ready to Define <br /> Your Space?
            </h2>
            <p className="mx-auto max-max-xl text-lg text-black/50 leading-relaxed font-light tracking-wide mb-16 px-4">
              Join thousands of satisfied homeowners who have transformed their lives with Mafroosh. Experience the pinnacle of design and comfort.
            </p>
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
              <Link
                href="/products"
                className="px-14 py-6 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-secondary hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                Start Exploring
              </Link>
              <Link
                href="/contact"
                className="px-14 py-6 border border-border text-black text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-black hover:text-white"
              >
                Get in Touch
              </Link>
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