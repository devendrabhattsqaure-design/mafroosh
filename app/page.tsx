import Link from "next/link"
import Image from "next/image"
import { Shield, Truck, Star, Heart, Sparkles, HandHeart } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import ProductCard from "@/components/ProductCard"
import AnimatedSection from "@/components/AnimatedSection"
import InteractiveFurnitureShowcase from "@/components/InteractiveFurnitureShowcase"
import { products } from "@/lib/products"

const featuredProducts = products.slice(0, 4)

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

export default function HomePage() {
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
            className="rounded-xl   border-2 border-[var(--color-gold)] bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
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

        {/* Floating diyas */}
        {/* <div className="pointer-events-none absolute bottom-8 left-8 text-4xl opacity-30 animate-float-diya" aria-hidden="true">
          <DivaIcon />
        </div>
        <div className="pointer-events-none absolute right-12 top-16 text-3xl opacity-20 animate-float-diya-slow" aria-hidden="true">
          <DivaIcon />
        </div>
        <div className="pointer-events-none absolute bottom-20 right-1/3 text-2xl opacity-25 animate-float-diya" aria-hidden="true">
          <DivaIcon />
        </div> */}
      </HeroSection>

      {/* Interactive Furniture Showcase */}
      <InteractiveFurnitureShowcase />

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

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 100}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block rounded-xl bg-secondary px-8 py-3.5 font-semibold text-secondary-foreground transition-all hover:bg-secondary/90 hover:shadow-md"
            >
              View All Products
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
                <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
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
      <section className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
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
                className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border-2 border-[var(--color-gold)] px-8 py-3.5 font-semibold text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/10"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

/* Decorative diya SVG icon */
function DivaIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="20" cy="30" rx="14" ry="6" fill="#D2B48C" />
      <ellipse cx="20" cy="28" rx="10" ry="4" fill="#F8843F" opacity="0.5" />
      <path
        d="M20 8C20 8 16 16 16 20C16 22.2 17.8 24 20 24C22.2 24 24 22.2 24 20C24 16 20 8 20 8Z"
        fill="#F8843F"
      />
      <path
        d="M20 12C20 12 18 16 18 18C18 19.1 18.9 20 20 20C21.1 20 22 19.1 22 18C22 16 20 12 20 12Z"
        fill="#FFD700"
        opacity="0.7"
      />
    </svg>
  )
}
