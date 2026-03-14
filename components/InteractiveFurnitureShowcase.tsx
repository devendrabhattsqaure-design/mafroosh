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
    <section className="bg-white py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid lg:grid-cols-3 gap-16 items-start mb-20">
          <AnimatedSection className="lg:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-6 block">
              Experience
            </span>
            <h2 className="font-serif text-5xl font-medium text-black md:text-6xl tracking-tighter mb-8 leading-tight">
              Interactive <br /> Living Spaces
            </h2>
            <div className="h-0.5 w-16 bg-secondary mb-10" />
            <p className="text-muted-foreground/80 leading-relaxed font-light tracking-wide text-lg">
              Explore our curated environments. Click on the golden markers to discover the pieces that define the room's character and add them directly to your collection.
            </p>
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-2 relative">
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
                    {/* Elegant Hotspot Marker */}
                    <div className="relative flex items-center justify-center">
                      {/* Pulse effect */}
                      <div className="absolute h-10 w-10 rounded-full bg-secondary/30 animate-ping opacity-75" />
                      
                      {/* Core circle */}
                      <div className="relative h-6 w-6 rounded-full bg-secondary border-2 border-white shadow-xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-125">
                         <div className="h-full w-full bg-gradient-to-tr from-secondary/80 to-white/20" />
                      </div>
                      
                      {/* Label that appears on hover */}
                      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-2xl">
                        {hotspot.label}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black" />
                      </div>
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
    </div>
  </section>
)
}