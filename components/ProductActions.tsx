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
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="group relative flex-1 overflow-hidden rounded-full bg-primary px-8 py-4 font-black uppercase tracking-widest text-primary-foreground shadow-2xl transition-all hover:bg-secondary hover:text-secondary-foreground active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
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
              <span>Updating...</span>
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Added to Collection</span>
            </motion.div>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <span>Add to Collection</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      
      <a
        href={`https://wa.me/919621374263?text=Hi, I am interested in ${product.name} (₹${product.price})`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 rounded-full border-2 border-primary/10 bg-white px-8 py-4 font-black uppercase tracking-widest text-primary transition-all hover:border-[#25D366] hover:text-[#25D366] hover:shadow-xl group"
      >
        <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
        Consult on WhatsApp
      </a>
    </div>
  )
}