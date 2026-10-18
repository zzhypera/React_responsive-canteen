import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeading from '../components/PageHeading'
import { useApp } from '../context/AppContext'
import { peso } from '../utils/format'

export default function Cart() {
  const { cart, updateCartQuantity, user } = useApp()
  const navigate = useNavigate()
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <section className="page-section page-container">
      <PageHeading eyebrow="YOUR ORDER" title="Your cart." description="Review your items before reserving a pickup time." />
      {!cart.length ? <div className="empty-state cart-empty"><span className="empty-icon"><ShoppingBag size={34} /></span><h2>Your cart is taking a break.</h2><p>Add something delicious from the menu to get started.</p><Link to="/menu" className="button button-primary">Browse the menu <ArrowRight size={16} /></Link></div> : (
        <div className="cart-page-layout">
          <div className="cart-items-panel">
            <div className="cart-panel-heading"><span>Item details</span><span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
            <div className="cart-item-list">{cart.map((item) => <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info"><span className="food-category">{item.category}</span><h3>{item.name}</h3><p>{peso(item.price)} each</p><button className="remove-item" type="button" onClick={() => updateCartQuantity(item.id, 0)}><Trash2 size={14} /> Remove</button></div>
              <div className="quantity-control"><button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button></div>
              <strong className="cart-line-price">{peso(item.price * item.quantity)}</strong>
            </article>)}</div>
            <Link to="/menu" className="back-to-menu"><ArrowLeft size={15} /> Continue browsing</Link>
          </div>
          <aside className="order-summary-card"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><span>{peso(subtotal)}</span></div><div className="summary-line"><span>Pickup fee</span><span className="free-label">Free</span></div><div className="summary-line summary-total"><strong>Total</strong><strong>{peso(subtotal)}</strong></div><p className="summary-note">Your payment is made at the canteen counter during pickup.</p><button className="button button-primary button-full" onClick={() => navigate(user ? '/checkout' : '/login')}>Continue to pickup <ArrowRight size={16} /></button>{!user && <p className="summary-login-note">You'll need to sign in before checking out.</p>}</aside>
        </div>
      )}
    </section>
  )
}
