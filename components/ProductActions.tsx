"use client"

import { useCart } from "@/context/CartContext"
import { MessageCircle } from "lucide-react"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    category: string
  }
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    openCart()
  }

  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleAddToCart}
        className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
      >
        Add to Cart
      </button>
      <a
        href={`https://wa.me/918840403939?text=Hi, I am interested in ${product.name} (₹${product.price})`}
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] px-8 py-3.5 font-semibold text-[#25D366] transition-all hover:bg-[#25D366]/10"
      >
        <MessageCircle className="h-5 w-5" />
        Order on WhatsApp
      </a>
    </div>
  )
}