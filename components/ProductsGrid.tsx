"use client"

import { useState } from "react"
import ProductCard from "@/components/ProductCard"
import AnimatedSection from "@/components/AnimatedSection"
import { products } from "@/lib/products"

const categories = [
  { value: "all", label: "All" },
  { value: "incense", label: "Incense" },
  { value: "idols", label: "Idols" },
  { value: "diyas", label: "Diyas" },
  { value: "pooja-kits", label: "Pooja Kits" },
]

export default function ProductsGrid() {
  const [active, setActive] = useState("all")

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.category === active)

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Category filters */}
        <AnimatedSection className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                active === cat.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </AnimatedSection>

        {/* Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 80}>
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  )
}
