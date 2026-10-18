import { ArrowRight, ClipboardList, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { peso, shortDate } from '../utils/format'

const studentNextStatus = { Pending: 'Preparing', Preparing: 'Ready', Ready: 'Completed' }

export default function Orders() {
  const { user, orders, setOrders, notify } = useApp()
  const [filter, setFilter] = useState('All')
  const visibleOrders = useMemo(() => orders.filter((order) => user.role === 'admin' || order.userId === user.id).filter((order) => filter === 'All' || order.status === filter), [orders, user, filter])

  const cancelOrder = (order) => {
    if (!window.confirm(`Cancel order ${order.orderNumber}? This is only allowed while Pending.`)) return
    setOrders((current) => current.map((item) => item.id === order.id && item.status === 'Pending' ? { ...item, status: 'Cancelled' } : item))
    notify('Your pending order was cancelled.')
  }

  return (
    <section className="page-section page-container">
      <PageHeading eyebrow={user.role === 'admin' ? 'CANTEEN OPERATIONS' : 'YOUR ORDER HISTORY'} title={user.role === 'admin' ? 'Orders overview.' : 'Your orders.'} description={user.role === 'admin' ? 'Review orders and keep pickup moving smoothly.' : 'Check each order, its pickup time, and current status.'} />
      <div className="orders-filter-row"><div className="filter-tabs">{['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((status) => <button key={status} className={filter === status ? 'active' : ''} type="button" onClick={() => setFilter(status)}>{status}</button>)}</div><span>{visibleOrders.length} {visibleOrders.length === 1 ? 'order' : 'orders'}</span></div>
      {visibleOrders.length ? <div className="orders-list">{visibleOrders.map((order) => <article className="order-card" key={order.id}>
        <div className="order-card-top"><div><span className="order-number">{order.orderNumber}</span><span className="order-created">{shortDate(order.createdAt)}</span></div><StatusBadge status={order.status} /></div>
        <div className="order-card-body"><div className="order-items-preview">{order.items.slice(0, 3).map((item) => <img key={item.id} src={item.image} alt={item.name} title={item.name} />)}<span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div><div className="order-pickup"><span>Pickup time</span><strong>{order.pickupSlot}</strong></div><div className="order-total"><span>Total</span><strong>{peso(order.totalAmount)}</strong></div></div>
        {order.notes && <p className="order-notes"><strong>Note:</strong> {order.notes}</p>}
        <div className="order-card-footer">{order.status === 'Pending' && order.userId === user.id && user.role !== 'admin' && <button type="button" className="button button-outline button-small" onClick={() => cancelOrder(order)}>Cancel order</button>}{user.role === 'admin' ? <Link className="text-link" to="/admin">Manage orders <ArrowRight size={15} /></Link> : <span className="order-footer-note">{order.status === 'Ready' ? 'Your order is ready for pickup.' : order.status === 'Completed' ? 'Thanks for ordering with us!' : order.status === 'Cancelled' ? 'This order was cancelled.' : 'We’ll update the status as your order is prepared.'}</span>}</div>
      </article>)}</div> : <div className="empty-state"><span className="empty-icon"><ClipboardList size={34} /></span><h2>No orders to show</h2><p>{filter === 'All' ? 'When you place an order, it will show up here.' : `You do not have any ${filter.toLowerCase()} orders.`}</p><Link to="/menu" className="button button-primary">Browse menu <ArrowRight size={16} /></Link></div>}
    </section>
  )
}
