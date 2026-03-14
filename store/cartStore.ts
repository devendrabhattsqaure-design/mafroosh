import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

interface CartStore {
  // State
  items: CartItem[]
  isCartOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

// Create the store
export const useCartStore = create<CartStore>((set, get) => ({
  // Initial state
  items: [],
  isCartOpen: false,
  
  // Actions
  addItem: (newItem) => set((state) => {
    console.log('Adding item:', newItem)
    const existingItem = state.items.find(item => item.id === newItem.id)
    
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
    }
    
    return {
      items: [...state.items, { ...newItem, quantity: 1 }]
    }
  }),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  updateQuantity: (id, quantity) => set((state) => {
    if (quantity < 1) {
      return {
        items: state.items.filter(item => item.id !== id)
      }
    }
    
    return {
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }
  }),
  
  clearCart: () => set({ items: [] }),
  
  openCart: () => set({ isCartOpen: true }),
  
  closeCart: () => set({ isCartOpen: false }),
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}))

// Individual selectors
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartOpen = () => useCartStore((state) => state.isCartOpen)
export const useCartCount = () => 
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))
export const useCartSubtotal = () => 
  useCartStore((state) => 
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

// Action hooks
export const useCartActions = () => {
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)
  const toggleCart = useCartStore((state) => state.toggleCart)
  
  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }
}