import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ArrowLeft } from "lucide-react"
import { products } from "@/lib/products"
import ProductCard from "@/components/ProductCard"
import AnimatedSection from "@/components/AnimatedSection"
import ProductActions from "@/components/ProductActions" // Import the new component

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = products.find((p) => p.id === id)
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.name} - Sacred Samagri`,
    description: product.description,
  }
}

const features = [
  "100% authentic and natural materials",
  "Handcrafted by traditional artisans",
  "Quality checked before shipping",
  "Eco-friendly packaging",
  "Suitable for daily pooja and festivals",
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) notFound()

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  // If not enough related products in same category, fill with others
  const moreProducts =
    relatedProducts.length < 3
      ? [
          ...relatedProducts,
          ...products
            .filter(
              (p) =>
                p.id !== product.id &&
                !relatedProducts.find((r) => r.id === p.id)
            )
            .slice(0, 3 - relatedProducts.length),
        ]
      : relatedProducts

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-sandal)] hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="mt-4 animate-fade-in-up font-serif text-3xl font-bold text-[var(--color-sandal)] md:text-4xl">
            {product.name}
          </h1>
        </div>
      </section>

      {/* Product detail */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Image */}
            <AnimatedSection>
              <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-[var(--color-deep-maroon)]/20 shadow-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </AnimatedSection>

            {/* Details */}
            <AnimatedSection delay={150}>
              <div>
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  {product.category.replace("-", " ")}
                </span>
                <h2 className="mt-4 font-serif text-2xl font-bold text-foreground md:text-3xl">
                  {product.name}
                </h2>
                <p className="mt-2 text-3xl font-bold text-secondary">
                  {"₹"}{product.price.toLocaleString("en-IN")}
                </p>
                <p className="mt-6 leading-relaxed text-muted-foreground">
                  {product.description}
                </p>

                {/* Features */}
                <ul className="mt-8 flex flex-col gap-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Product Actions - Client Component */}
                <ProductActions product={product} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Reviews */}
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
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <svg
                        key={j}
                        className="h-4 w-4 fill-primary text-primary"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground italic">
                    {`"${review.text}"`}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-foreground">
                    {review.name}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Related products */}
      {moreProducts.length > 0 && (
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
              {moreProducts.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 100}>
                  <ProductCard product={p} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}