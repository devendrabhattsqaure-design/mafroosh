"use client"

import { ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

export default function CartIcon() {
  const { itemCount, openCart } = useCartStore()

  return (
    <button
      onClick={openCart}
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </button>
  )
}