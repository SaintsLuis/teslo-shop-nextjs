import { CartProduct } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  cart: CartProduct[]

  //
  getTotalItems: () => number
  getSummaryInformation: () => {
    numberOfItems: number
    subtotal: number
    tax: number
    total: number
  }
  addProductToCart: (product: CartProduct) => void
  updateProductQuantity: (product: CartProduct, quantity: number) => void
  removeProductFromCart: (product: CartProduct) => void
  clearCart: () => void
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      getTotalItems: () => {
        const { cart } = get()
        return cart.reduce((total, product) => total + product.quantity, 0)
      },

      getSummaryInformation: () => {
        const { cart } = get()
        const numberOfItems = cart.reduce(
          (total, product) => total + product.quantity,
          0
        )
        const subtotal = cart.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        )
        const taxRate = 0.18 // 18% tax rate
        const tax = subtotal * taxRate
        const total = subtotal + tax

        return {
          numberOfItems,
          subtotal,
          tax,
          total,
        }
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get()

        // Check if the product is already in the cart
        const existingProduct = cart.some(
          (item) => item.id === product.id && item.size === product.size
        )

        if (!existingProduct) {
          // If the product is not in the cart, add it
          set({ cart: [...cart, product] })
          return
        }

        // If the product is already in the cart, update the quantity
        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
            }
          }
          return item
        })

        set({ cart: updatedCart })
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get()

        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return {
              ...item,
              quantity,
            }
          }
          return item
        })

        set({ cart: updatedCart })
      },

      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get()

        // Filter out the product to be removed
        const updatedCart = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        )

        set({ cart: updatedCart })
      },

      clearCart: () => set({ cart: [] }),
    }),

    {
      name: 'cart-storage', // unique name
      skipHydration: true, // Skip hydration for server-side rendering
    }
  )
)
