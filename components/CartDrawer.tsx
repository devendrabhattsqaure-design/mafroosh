"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"
import Lottie from "lottie-react"
import sparkle from "./sparkle.json"

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    isCartOpen,
    closeCart,
    clearCart,
  } = useCart()
  const [showSparkler, setShowSparkler] = useState(false)
  const [isCompletingOrder, setIsCompletingOrder] = useState(false)

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [closeCart])

  // Trigger sparkler when drawer opens
  useEffect(() => {
    if (isCartOpen) {
      setShowSparkler(true)
      const timer = setTimeout(() => setShowSparkler(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isCartOpen])

  const handleCheckout = () => {
    if (items.length === 0) return
    
    setIsCompletingOrder(true)
    setShowSparkler(true)

    // Close drawer and navigate to checkout
    setTimeout(() => {
      setShowSparkler(false)
      closeCart()
      setIsCompletingOrder(false)
      
      // Navigate to checkout page
      window.location.href = "/checkout"
    }, 3000)
  }

  if (!isCartOpen) return null

  return (
    <>
      {/* Lottie Sparkler Animation - Positioned on the right */}
      {showSparkler && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64">
            <Lottie
              animationData={sparkle}
              loop={false}
              autoplay={true}
              onComplete={() => setShowSparkler(false)}
            />
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[var(--color-cream)] shadow-xl transition-transform duration-500 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Your Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex h-[calc(100%-180px)] flex-col overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Your cart is empty
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add beautiful furniture pieces to get started
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-secondary"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-sm font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-bold text-secondary">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-6">
            {/* Subtotal */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Subtotal</span>
              <span className="text-lg font-bold text-secondary">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Shipping info */}
            <p className="mb-4 text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCompletingOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompletingOrder ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  )
}