"use client"

import { useState } from "react"
import { MessageCircle, Check, Loader2 } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { motion, AnimatePresence } from "framer-motion"

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
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = () => {
    setIsAdding(true)
    
    // Add to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    
    // Show success animation
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(true)
      
      // Open cart after success
      openCart()
      
      // Reset success after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    }, 500)
  }

  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-1 rounded-xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Adding...</span>
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
            >
              <Check className="h-4 w-4" />
              <span>Added to Cart!</span>
            </motion.div>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Add to Cart
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      
      <a
        href={`https://wa.me/919621374263?text=Hi, I am interested in ${product.name} (₹${product.price})`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] px-8 py-3.5 font-semibold text-[#25D366] transition-all hover:bg-[#25D366]/10"
      >
        <MessageCircle className="h-5 w-5" />
        Order on WhatsApp
      </a>
    </div>
  )
}