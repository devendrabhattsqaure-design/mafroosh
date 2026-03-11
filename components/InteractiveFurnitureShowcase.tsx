"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import AnimatedSection from "@/components/AnimatedSection"

interface Hotspot {
  id: string
  name: string
  label: string
  x: number
  y: number
  productId: string
}

const hotspots: Hotspot[] = [
  {
    id: "sofa",
    name: "Luxe Velvet Sofa",
    label: "Sofa",
    x: 25,
    y: 45,
    productId: "1",
  },
  {
    id: "table",
    name: "Modern Coffee Table",
    label: "Table",
    x: 50,
    y: 65,
    productId: "2",
  },
  {
    id: "mirror",
    name: "Ornate Wall Mirror",
    label: "Mirror",
    x: 78,
    y: 35,
    productId: "3",
  },
  {
    id: "chairs",
    name: "Comfort Dining Chair Set",
    label: "Chairs",
    x: 70,
    y: 70,
    productId: "4",
  },
]

export default function InteractiveFurnitureShowcase() {
  const { addItem } = useCart()
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const handleAddToCart = (productId: string, productName: string, price: number, image: string, category: string) => {
    addItem({
      id: productId,
      name: productName,
      price,
      image,
      category,
      quantity: 1,
    })
    setAddedToCart(productId)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Explore Our Collection
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            Interactive Room Showcase
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Click on any furniture item in the room to explore details and add to your cart
          </p>
        </AnimatedSection>

        <AnimatedSection className="relative mx-auto max-w-4xl">
          {/* Main showcase image */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-muted">
            <Image
              src="/images/furniture-showcase.jpg"
              alt="Mafroosh Furniture Showcase"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />

            {/* Interactive hotspots */}
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => setSelectedHotspot(hotspot.id)}
                onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  hoveredHotspot === hotspot.id ? "scale-125" : "scale-100"
                }`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                }}
                aria-label={`Click to view ${hotspot.name}`}
              >
                {/* Pulsing circle indicator */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/40 animate-pulse" style={{width: 60, height: 60, marginLeft: -30, marginTop: -30}} />
                  <div className="relative w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                  </div>
                </div>

                {/* Tooltip */}
                {hoveredHotspot === hotspot.id && (
                  <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold">
                      {hotspot.label}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Product detail popup */}
          {selectedHotspot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="relative bg-card rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in scale-95 duration-300">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="absolute right-4 top-4 z-10 p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                {(() => {
                  const hotspot = hotspots.find((h) => h.id === selectedHotspot)
                  if (!hotspot) return null

                  const product = {
                    1: {
                      name: "Luxe Velvet Sofa",
                      price: 45999,
                      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
                    },
                    2: {
                      name: "Modern Coffee Table",
                      price: 12999,
                      image: "https://img-us.aosomcdn.com/thumbnail/100/n0/product/2024/09/27/mqMc83192326e2257.jpg",
                    },
                    3: {
                      name: "Ornate Wall Mirror",
                      price: 8999,
                      image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
                    },
                    4: {
                      name: "Comfort Dining Chair Set",
                      price: 24999,
                      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
                    },
                  }[hotspot.productId as keyof typeof product]

                  return (
                    <>
                      <div className="relative w-full h-48 bg-muted overflow-hidden">
                        <Image
                          src={product?.image || "/images/placeholder.jpg"}
                          alt={product?.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-xl font-bold text-foreground">
                          {product?.name}
                        </h3>
                        <p className="mt-2 text-lg font-semibold text-primary">
                          ₹{product?.price?.toLocaleString()}
                        </p>
                        <div className="mt-6 flex gap-3">
                          <Link
                            href={`/products/${hotspot.productId}`}
                            onClick={() => setSelectedHotspot(null)}
                            className="flex-1 inline-block rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground text-center transition-all hover:bg-primary/90"
                          >
                            View Details
                          </Link>
                          <button 
                            type="button"
                            onClick={() => {
                              handleAddToCart(
                                hotspot.productId,
                                product?.name || "",
                                product?.price || 0,
                                product?.image || "",
                                hotspot.id
                              )
                              setSelectedHotspot(null)
                            }}
                            className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                              addedToCart === hotspot.productId
                                ? "bg-primary text-primary-foreground"
                                : "border-2 border-primary text-primary hover:bg-primary/10"
                            }`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {addedToCart === hotspot.productId ? "Added!" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}
