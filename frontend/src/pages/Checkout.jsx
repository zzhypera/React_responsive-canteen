import { ArrowLeft, ArrowRight, Check, Clock3, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeading from '../components/PageHeading'
import { useApp } from '../context/AppContext'
import { peso } from '../utils/format'

export default function Checkout() {
  const { cart, slots, orders, placeOrder, notify } = useApp()
  const [pickupSlotId, setPickupSlotId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const availableSlots = slots.map((slot) => {
    const used = orders.filter((order) => order.pickupSlotId === slot.id && !['Cancelled', 'Completed'].includes(order.status)).length
    return { ...slot, used, remaining: Math.max(0, slot.maxOrders - used), full: used >= slot.maxOrders }
  })

  const submit = (event) => {
    event.preventDefault()
    setError('')
    const result = placeOrder({ pickupSlotId, notes })
    if (!result.ok) return setError(result.message)
    notify(`Order ${result.order.orderNumber} has been placed.`)
    navigate('/orders', { state: { newOrderNumber: result.order.orderNumber } })
  }

  if (!cart.length) return <section className="page-section page-container"><div className="empty-state"><ShoppingBag size={34} /><h2>Your cart is empty</h2><p>Add menu items before checking out.</p><Link className="button button-primary" to="/menu">Browse menu</Link></div></section>

  return (
    <section className="page-section page-container">
      <PageHeading eyebrow="ALMOST THERE" title="Reserve your pickup." description="Choose an open pickup slot and add any notes for the canteen." />
      <form className="checkout-layout" onSubmit={submit} noValidate>
        <div className="checkout-form-column">
          {error && <div className="inline-error" role="alert">{error}</div>}
          <section className="checkout-section">
            <span className="section-number">01</span><div className="checkout-section-title"><h2>Pickup time</h2><p>Slots have a limited number of orders.</p></div>
            <div className="pickup-slot-list">
              {availableSlots.map((slot) => <label className={`pickup-slot ${Number(pickupSlotId) === slot.id ? 'selected' : ''} ${(!slot.isOpen || slot.full) ? 'pickup-slot-disabled' : ''}`} key={slot.id}>
                <input type="radio" name="pickupSlot" value={slot.id} checked={Number(pickupSlotId) === slot.id} onChange={(event) => setPickupSlotId(event.target.value)} disabled={!slot.isOpen || slot.full} />
                <span className="slot-time-icon"><Clock3 size={18} /></span>
                <span className="slot-time"><strong>{slot.slotTime}</strong><small>Pickup window</small></span>
                <span className="slot-card-side">
                  <span className={`slot-capacity ${slot.remaining < 4 && !slot.full ? 'slot-capacity-low' : ''}`}>{!slot.isOpen ? 'Closed' : slot.full ? 'Full' : `${slot.remaining} spots left`}</span>
                  <span className="slot-capacity-track" aria-hidden="true"><span style={{ width: `${Math.min(slot.used / Math.max(slot.maxOrders, 1) * 100, 100)}%` }} /></span>
                </span>
                <span className="slot-select-indicator" aria-hidden="true"><Check size={13} /></span>
              </label>)}
            </div>
          </section>
          <section className="checkout-section">
            <span className="section-number">02</span><div className="checkout-section-title"><h2>Order notes <span className="optional-label">Optional</span></h2><p>Share any helpful pickup instructions.</p></div>
            <label className="field-label" htmlFor="notes">Notes for the canteen</label>
            <textarea id="notes" rows="3" maxLength="250" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Example: Please pack the sauce separately." />
            <span className="field-help">{notes.length}/250 characters</span>
          </section>
          <section className="checkout-section payment-notice"><div className="payment-notice-icon"><ShoppingBag size={18} /></div><div><strong>Pay at pickup</strong><p>Payment is collected by canteen staff at the counter. This app does not charge you online.</p></div></section>
        </div>
        <aside className="order-summary-card checkout-summary"><h2>Order summary</h2><div className="checkout-mini-list">{cart.map((item) => <div className="checkout-mini-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>Qty {item.quantity} × {peso(item.price)}</span></div><b>{peso(item.price * item.quantity)}</b></div>)}</div><div className="summary-line"><span>Subtotal</span><span>{peso(total)}</span></div><div className="summary-line"><span>Pickup fee</span><span className="free-label">Free</span></div><div className="summary-line summary-total"><strong>Total</strong><strong>{peso(total)}</strong></div><button type="submit" className="button button-primary button-full" disabled={!pickupSlotId}>Place order <ArrowRight size={16} /></button><Link to="/cart" className="summary-back"><ArrowLeft size={14} /> Back to cart</Link></aside>
      </form>
    </section>
  )
}
