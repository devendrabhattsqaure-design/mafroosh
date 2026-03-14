"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ShoppingCart ,PlusIcon} from "lucide-react"
import { useCartStore } from "@/store/cartStore"
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
    y: 50,
    productId: "4",
  },
]

export default function InteractiveFurnitureShowcase() {
  const { addItem } = useCartStore()
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
    })
    setAddedToCart(productId)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  // Product data mapping
  const productData = {
    "1": {
      name: "Luxe Velvet Sofa",
      price: 45999,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      category: "sofa"
    },
    "2": {
      name: "Modern Coffee Table",
      price: 12999,
      image: "https://img-us.aosomcdn.com/thumbnail/100/n0/product/2024/09/27/mqMc83192326e2257.jpg",
      category: "table"
    },
    "3": {
      name: "Ornate Wall Mirror",
      price: 8999,
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
      category: "mirror"
    },
    "4": {
      name: "Comfort Dining Chair Set",
      price: 24999,
      image: "https://media.landmarkshops.in/cdn-cgi/image/h=750,w=750,q=85,fit=cover/homecentre/1000014310415-1000014310414_02-2100.jpg",
      category: "chairs"
    },
  }

  const handleHotspotClick = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation()
    const product = productData[hotspot.productId as keyof typeof productData]
    handleAddToCart(
      hotspot.productId,
      product.name,
      product.price,
      product.image,
      product.category
    )
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
            {hotspots.map((hotspot) => {
              const product = productData[hotspot.productId as keyof typeof productData]
              const isAdded = addedToCart === hotspot.productId
              
              return (
                <div
                  key={hotspot.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    hoveredHotspot === hotspot.id ? "scale-110" : "scale-100"
                  }`}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                  }}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  {/* Main hotspot button with cart icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedHotspot(hotspot.id)
                    }}
                    className="relative group"
                    aria-label={`Click to view ${hotspot.name}`}
                  >
                    {/* Pulsing background */}
                    {/* <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse" style={{width: 56, height: 56, marginLeft: -28, marginTop: -28}} /> */}
                    
                    {/* Hotspot circle with cart icon */}
                    <div className="relative w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer group-hover:bg-primary/90">
                      <ShoppingCart className="w-6 h-6 text-primary-foreground" />
                      
                      {/* Quick add indicator */}
                      {/* <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-[10px] font-bold text-secondary-foreground"> <PlusIcon /> </span>
                      </div> */}
                    </div>

                    {/* Quick add button (appears on hover) */}
                    {hoveredHotspot === hotspot.id && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
                        {/* <button
                          onClick={(e) => handleHotspotClick(hotspot, e)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-lg flex items-center gap-1 ${
                            isAdded
                              ? "bg-green-500 text-white"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          {isAdded ? "Added!" : "Quick Add"}
                        </button> */}
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold">
                          {hotspot.label}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Product detail popup */}
          {selectedHotspot && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedHotspot(null)}
            >
              <div 
                className="relative bg-card rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in scale-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
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

                  const product = productData[hotspot.productId as keyof typeof productData]

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
                            View 
                          </Link>
                          <button 
                            type="button"
                            onClick={() => {
                              handleAddToCart(
                                hotspot.productId,
                                product?.name || "",
                                product?.price || 0,
                                product?.image || "",
                                product?.category || hotspot.id
                              )
                              setSelectedHotspot(null)
                            }}
                            className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                              addedToCart === hotspot.productId
                                ? "bg-green-500 text-white"
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