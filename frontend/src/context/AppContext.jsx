import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialProducts } from '../data/products'

const AppContext = createContext(null)
const STORAGE_KEY = 'campus-canteen-react-state-v1'
const defaultSlots = [
  { id: 1, slotTime: '10:00 AM – 10:30 AM', maxOrders: 12, isOpen: true },
  { id: 2, slotTime: '10:30 AM – 11:00 AM', maxOrders: 12, isOpen: true },
  { id: 3, slotTime: '11:00 AM – 11:30 AM', maxOrders: 18, isOpen: true },
  { id: 4, slotTime: '11:30 AM – 12:00 PM', maxOrders: 18, isOpen: true },
  { id: 5, slotTime: '12:00 PM – 12:30 PM', maxOrders: 16, isOpen: true },
]

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }) {
  const saved = useMemo(loadState, [])
  const [products, setProducts] = useState(saved?.products ?? initialProducts)
  const [categories, setCategories] = useState(saved?.categories ?? ['Meals', 'Snacks', 'Drinks', 'Breakfast', 'Desserts'])
  const [slots, setSlots] = useState(saved?.slots ?? defaultSlots)
  const [orders, setOrders] = useState(saved?.orders ?? [])
  const [cart, setCart] = useState(saved?.cart ?? [])
  const [user, setUser] = useState(saved?.user ?? null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, categories, slots, orders, cart, user }))
  }, [products, categories, slots, orders, cart, user])

  const notify = (message, type = 'success') => {
    setNotice({ message, type, id: Date.now() })
    window.setTimeout(() => setNotice(null), 3500)
  }

  const addToCart = (product) => {
    if (!product.available) return notify('This item is currently sold out.', 'error')
    setCart((current) => {
      const found = current.find((item) => item.id === product.id)
      return found
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }]
    })
    notify(`${product.name} added to your cart.`)
  }

  const updateCartQuantity = (id, quantity) => {
    setCart((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item))
  }

  const placeOrder = ({ pickupSlotId, notes = '' }) => {
    if (!user) return { ok: false, message: 'Please sign in before placing an order.' }
    if (!cart.length) return { ok: false, message: 'Your cart is empty.' }
    const slot = slots.find((item) => item.id === Number(pickupSlotId))
    if (!slot || !slot.isOpen) return { ok: false, message: 'Choose an open pickup slot.' }
    const used = orders.filter((order) => order.pickupSlotId === slot.id && !['Cancelled', 'Completed'].includes(order.status)).length
    if (used >= slot.maxOrders) return { ok: false, message: 'This pickup slot is full. Choose another slot.' }
    if (cart.some((item) => !products.find((product) => product.id === item.id)?.available)) {
      return { ok: false, message: 'One or more items are unavailable. Update your cart first.' }
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = {
      id: Date.now(),
      orderNumber: `CC-${String(Date.now()).slice(-6)}`,
      userId: user.id,
      customerName: user.name,
      pickupSlotId: slot.id,
      pickupSlot: slot.slotTime,
      items: cart.map(({ id, name, price, quantity, image }) => ({ id, name, price, quantity, image, unitPrice: price })),
      totalAmount: total,
      status: 'Pending',
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    }
    setOrders((current) => [order, ...current])
    setCart([])
    return { ok: true, order }
  }

  const value = {
    products, setProducts, categories, setCategories, slots, setSlots, orders, setOrders,
    cart, setCart, user, setUser, notice, notify, addToCart, updateCartQuantity, placeOrder,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
