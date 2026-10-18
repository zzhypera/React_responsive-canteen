import { useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Activity, ArrowUpRight, Box, CalendarClock, CheckCircle2, ChevronRight, CircleDollarSign, ClipboardList, LayoutDashboard, Plus, Search, Settings2, Soup, X } from 'lucide-react'
import PageHeading from '../components/PageHeading'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { peso, shortDate } from '../utils/format'

const orderFlow = ['Pending', 'Preparing', 'Ready', 'Completed']

function AdminLayout({ children }) {
  const { user } = useApp()
  const location = useLocation()
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/menu', label: 'Menu items', icon: Soup },
    { to: '/admin/categories', label: 'Categories', icon: Box },
    { to: '/admin/pickup-slots', label: 'Pickup slots', icon: CalendarClock },
  ]
  const current = navItems.find((item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to))
  return (
    <section className="admin-page page-container">
      <div className="admin-welcome-bar"><div><span className="eyebrow">CANTEEN MANAGEMENT</span><h1>Admin workspace.</h1><p>Good day, {user.name.split(' ')[0]}. Here's what's happening today.</p></div><span className="admin-role-pill"><span /> Administrator access</span></div>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <span className="sidebar-label">WORKSPACE</span>
          <nav>{navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><Icon size={17} /><span>{label}</span>{label === 'Orders' && <span className="admin-nav-chevron"><ChevronRight size={15} /></span>}</NavLink>)}</nav>
          <div className="admin-sidebar-bottom"><Settings2 size={16} /><span>Campus Canteen</span><small>Local preview</small></div>
        </aside>
        <div className="admin-main-content"><div className="admin-content-heading"><div><span className="eyebrow">OVERVIEW / {current?.label?.toUpperCase() || 'WORKSPACE'}</span><h2>{current?.label || 'Dashboard'}</h2></div><span className="admin-today">{new Date().toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>{children}</div>
      </div>
    </section>
  )
}

function DashboardHome() {
  const { products, orders, slots } = useApp()
  const todayKey = new Date().toDateString()
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === todayKey)
  const pending = orders.filter((order) => order.status === 'Pending').length
  const salesToday = todayOrders.filter((order) => order.status !== 'Cancelled').reduce((sum, order) => sum + order.totalAmount, 0)
  const itemCounts = {}
  orders.filter((order) => order.status !== 'Cancelled').forEach((order) => order.items.forEach((item) => { itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity }))
  const bestseller = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No orders yet'
  const busiestSlot = slots.map((slot) => ({ ...slot, count: orders.filter((order) => order.pickupSlotId === slot.id && order.status !== 'Cancelled').length })).sort((a, b) => b.count - a.count)[0]
  const metrics = [
    { label: 'Orders today', value: todayOrders.length, note: 'Orders placed today', icon: ClipboardList, color: 'green' },
    { label: 'Pending orders', value: pending, note: 'Need staff attention', icon: Activity, color: 'amber' },
    { label: 'Sales today', value: peso(salesToday), note: 'Excludes cancelled orders', icon: CircleDollarSign, color: 'blue' },
    { label: 'Menu items', value: products.length, note: `${products.filter((item) => item.available).length} currently available`, icon: Soup, color: 'purple' },
  ]
  const statusCounts = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((status) => ({ status, count: orders.filter((order) => order.status === status).length }))
  return (
    <>
      <div className="metric-grid">{metrics.map(({ label, value, note, icon: Icon, color }) => <article className="metric-card" key={label}><div className={`metric-icon metric-${color}`}><Icon size={19} /></div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-note">{note}</span></article>)}</div>
      <div className="dashboard-content-grid">
        <section className="admin-panel"><div className="admin-panel-heading"><div><h3>Recent orders</h3><p>Latest orders from your canteen</p></div><Link to="/admin/orders" className="text-link">View all <ChevronRight size={15} /></Link></div>
          {orders.length ? <div className="recent-orders-list">{orders.slice(0, 6).map((order) => <div className="recent-order-row" key={order.id}><div className="recent-order-avatar">{order.customerName?.charAt(0) || 'S'}</div><div className="recent-order-details"><strong>{order.customerName}</strong><span>{order.orderNumber} · {shortDate(order.createdAt)}</span></div><div className="recent-order-meta"><strong>{peso(order.totalAmount)}</strong><StatusBadge status={order.status} /></div></div>)}</div> : <div className="admin-empty"><ClipboardList size={25} /><strong>No orders yet</strong><span>Student orders will appear here.</span></div>}
        </section>
        <section className="admin-panel"><div className="admin-panel-heading"><div><h3>Order status</h3><p>Current workflow breakdown</p></div></div><div className="status-overview">{statusCounts.map(({ status, count }) => <div className="status-overview-row" key={status}><span className={`status-dot status-dot-${status.toLowerCase()}`} /><span>{status}</span><div className="status-track"><span style={{ width: `${orders.length ? Math.max(count / orders.length * 100, count ? 4 : 0) : 0}%` }} /></div><strong>{count}</strong></div>)}</div><div className="admin-insight"><div className="insight-icon"><Soup size={17} /></div><div><small>BEST SELLING ITEM</small><strong>{bestseller}</strong></div><ArrowUpRight size={17} /></div><div className="admin-insight"><div className="insight-icon insight-icon-orange"><CalendarClock size={17} /></div><div><small>BUSIEST PICKUP SLOT</small><strong>{busiestSlot?.count ? busiestSlot.slotTime : 'No pickup data yet'}</strong></div><span className="insight-count">{busiestSlot?.count || 0} orders</span></div></section>
      </div>
      <div className="dashboard-shortcuts"><Link to="/admin/menu"><span className="shortcut-icon"><Plus size={17} /></span><span><strong>Manage menu</strong><small>Add items or update availability</small></span><ChevronRight size={17} /></Link><Link to="/admin/pickup-slots"><span className="shortcut-icon shortcut-orange"><CalendarClock size={17} /></span><span><strong>Pickup slots</strong><small>Control slot capacity and opening</small></span><ChevronRight size={17} /></Link></div>
    </>
  )
}

function AdminOrders() {
  const { orders, setOrders, notify } = useApp()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const filtered = orders.filter((order) => {
    const q = search.toLowerCase()
    return (!q || `${order.orderNumber} ${order.customerName} ${order.pickupSlot}`.toLowerCase().includes(q)) && (status === 'All' || order.status === status)
  })

  const advance = (order, nextStatus) => {
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: nextStatus } : item))
    notify(`${order.orderNumber} updated to ${nextStatus}.`)
  }
  const cancel = (order) => {
    if (!window.confirm(`Delete order ${order.orderNumber}? This cannot be undone.`)) return
    setOrders((current) => current.filter((item) => item.id !== order.id))
    notify('Order record deleted.')
  }

  return <>
    <div className="admin-filter-bar"><label className="search-box search-box-admin"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders or students..." /></label><select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="admin-data-list">{filtered.length ? filtered.map((order) => {
      const next = orderFlow[orderFlow.indexOf(order.status) + 1]
      return <article className="admin-order-card" key={order.id}><div className="admin-order-card-top"><div><strong>{order.orderNumber}</strong><span>{shortDate(order.createdAt)}</span></div><StatusBadge status={order.status} /></div><div className="admin-order-customer"><div className="recent-order-avatar">{order.customerName?.charAt(0) || 'S'}</div><div><strong>{order.customerName}</strong><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {order.items.map((item) => item.name).join(', ')}</span></div></div><div className="admin-order-meta-grid"><div><span>Pickup slot</span><strong>{order.pickupSlot}</strong></div><div><span>Total amount</span><strong>{peso(order.totalAmount)}</strong></div></div>{order.notes && <p className="admin-order-note">Customer note: {order.notes}</p>}<div className="admin-order-actions">{next && order.status !== 'Cancelled' ? <button className="button button-primary button-small" onClick={() => advance(order, next)} type="button">{next === 'Completed' ? <CheckCircle2 size={15} /> : <ArrowUpRight size={15} />} Mark as {next}</button> : <span className="order-footer-note">{order.status === 'Completed' ? 'Order completed' : order.status}</span>}{order.status === 'Pending' && <button className="button button-outline button-small" type="button" onClick={() => advance(order, 'Cancelled')}>Cancel</button>}<button type="button" className="admin-delete-button" onClick={() => cancel(order)} aria-label={`Delete ${order.orderNumber}`}><X size={16} /></button></div></article>
    }) : <div className="admin-empty"><ClipboardList size={26} /><strong>No matching orders</strong><span>Try changing your search or status filter.</span></div>}</div>
  </>
}

function AdminMenu() {
  const { products, setProducts, categories, notify } = useApp()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const filtered = products.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()))
  const startCreate = () => { setForm({ name: '', description: '', price: '', category: categories[0] || 'Meals', image: '', available: true }); setErrors({}); setEditing('new') }
  const startEdit = (product) => { setForm({ ...product }); setErrors({}); setEditing(product.id) }
  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name?.trim()) nextErrors.name = 'Item name is required.'
    if (!(Number(form.price) >= 0.01)) nextErrors.price = 'Enter a price greater than zero.'
    if (!form.category) nextErrors.category = 'Choose a category.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const product = { ...form, name: form.name.trim(), description: form.description.trim(), price: Number(form.price), image: form.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', available: Boolean(form.available), id: editing === 'new' ? Date.now() : editing }
    setProducts((current) => editing === 'new' ? [...current, product] : current.map((item) => item.id === editing ? product : item))
    setEditing(null)
    notify(editing === 'new' ? 'Menu item created.' : 'Menu item updated.')
  }
  const remove = (item) => {
    if (!window.confirm(`Delete "${item.name}" from the menu?`)) return
    setProducts((current) => current.filter((product) => product.id !== item.id))
    notify('Menu item deleted.')
  }
  const toggle = (item) => setProducts((current) => current.map((product) => product.id === item.id ? { ...product, available: !product.available } : product))

  return <>
    <div className="admin-filter-bar"><label className="search-box search-box-admin"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu items..." /></label><button type="button" className="button button-primary button-small" onClick={startCreate}><Plus size={16} /> Add menu item</button></div>
    <div className="admin-data-list">{filtered.map((item) => <article className="admin-menu-item" key={item.id}><img src={item.image} alt={item.name} /><div className="admin-menu-item-info"><span className="food-category">{item.category}</span><strong>{item.name}</strong><span>{item.description}</span><b>{peso(item.price)}</b></div><div className="admin-menu-item-actions"><button type="button" className={`availability-toggle ${item.available ? 'toggle-on' : ''}`} onClick={() => toggle(item)}><span />{item.available ? 'Available' : 'Sold out'}</button><button type="button" className="button button-outline button-small" onClick={() => startEdit(item)}>Edit</button><button type="button" className="admin-delete-button" onClick={() => remove(item)} aria-label={`Delete ${item.name}`}><X size={16} /></button></div></article>)}</div>
    {editing !== null && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null) }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="menu-modal-title"><div className="modal-header"><div><span className="eyebrow">{editing === 'new' ? 'ADD TO THE MENU' : 'EDIT MENU ITEM'}</span><h2 id="menu-modal-title">{editing === 'new' ? 'New menu item' : 'Update item'}</h2></div><button className="icon-button" onClick={() => setEditing(null)} type="button" aria-label="Close dialog"><X size={19} /></button></div><form onSubmit={submit} className="admin-edit-form" noValidate><label className="field-label" htmlFor="itemName">Name</label><input id="itemName" className="text-input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />{errors.name && <span className="field-error">{errors.name}</span>}<label className="field-label" htmlFor="itemDescription">Description</label><textarea id="itemDescription" className="text-input" rows="2" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /><div className="form-two-columns"><div><label className="field-label" htmlFor="itemPrice">Price (₱)</label><input id="itemPrice" className="text-input" type="number" min="0.01" step="0.01" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value })} />{errors.price && <span className="field-error">{errors.price}</span>}</div><div><label className="field-label" htmlFor="itemCategory">Category</label><select id="itemCategory" className="text-input" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div></div><label className="field-label" htmlFor="itemImage">Image URL</label><input id="itemImage" className="text-input" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /><label className="checkbox-row"><input type="checkbox" checked={Boolean(form.available)} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Item available to order</label><div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="button button-primary">{editing === 'new' ? 'Create item' : 'Save changes'}</button></div></form></section></div>}
  </>
}

function AdminCategories() {
  const { categories, setCategories, products, setProducts, notify } = useApp()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const addCategory = (event) => {
    event.preventDefault()
    const cleaned = name.trim()
    if (!cleaned) return setError('Category name is required.')
    if (categories.some((item) => item.toLowerCase() === cleaned.toLowerCase())) return setError('That category already exists.')
    setCategories((current) => [...current, cleaned])
    setName(''); setError(''); notify('Category created.')
  }
  const remove = (category) => {
    if (products.some((item) => item.category === category) && !window.confirm(`"${category}" is assigned to menu items. Delete it and move those items to "${categories.find((item) => item !== category) || 'Meals'}"?`)) return
    const fallback = categories.find((item) => item !== category) || 'Meals'
    setProducts((current) => current.map((item) => item.category === category ? { ...item, category: fallback } : item))
    setCategories((current) => current.filter((item) => item !== category))
    notify('Category deleted.')
  }
  return <><form className="category-create-form" onSubmit={addCategory}><div><label className="field-label" htmlFor="categoryName">Create category</label><input id="categoryName" className="text-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rice meals" />{error && <span className="field-error">{error}</span>}</div><button type="submit" className="button button-primary"><Plus size={16} /> Add category</button></form><div className="admin-data-list">{categories.map((category) => <article className="category-admin-row" key={category}><span className="category-row-icon"><Box size={18} /></span><div><strong>{category}</strong><span>{products.filter((item) => item.category === category).length} menu items</span></div><button type="button" className="admin-delete-button" aria-label={`Delete ${category}`} onClick={() => remove(category)}><X size={16} /></button></article>)}</div></>
}

function AdminPickupSlots() {
  const { slots, setSlots, orders, notify } = useApp()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const save = (event) => {
    event.preventDefault()
    const max = Number(form.maxOrders)
    if (!form.slotTime?.trim() || !Number.isInteger(max) || max < 1) return notify('Enter a slot name and capacity of at least one.', 'error')
    setSlots((current) => editing === 'new' ? [...current, { ...form, slotTime: form.slotTime.trim(), id: Date.now(), maxOrders: max, isOpen: Boolean(form.isOpen) }] : current.map((slot) => slot.id === editing ? { ...slot, ...form, slotTime: form.slotTime.trim(), maxOrders: max, isOpen: Boolean(form.isOpen) } : slot))
    setEditing(null); notify('Pickup slot saved.')
  }
  const toggle = (slot) => setSlots((current) => current.map((item) => item.id === slot.id ? { ...item, isOpen: !item.isOpen } : item))
  return <>
    <div className="admin-filter-bar"><p className="admin-helper-copy">Control available collection windows and maximum order capacity.</p><button className="button button-primary button-small" onClick={() => { setForm({ slotTime: '', maxOrders: 10, isOpen: true }); setEditing('new') }} type="button"><Plus size={16} /> Add pickup slot</button></div>
    <div className="slot-admin-list">{slots.map((slot) => { const used = orders.filter((order) => order.pickupSlotId === slot.id && !['Cancelled', 'Completed'].includes(order.status)).length; const remaining = Math.max(0, slot.maxOrders - used); return <article className="slot-admin-card" key={slot.id}><div className="slot-admin-icon"><CalendarClock size={21} /></div><div className="slot-admin-main"><strong>{slot.slotTime}</strong><span>{used} active orders · capacity {slot.maxOrders}</span><div className="capacity-track"><span style={{ width: `${Math.min(used / Math.max(slot.maxOrders, 1) * 100, 100)}%` }} /></div></div><div className="slot-admin-remaining"><strong>{remaining}</strong><span>spots left</span></div><button className={`availability-toggle ${slot.isOpen ? 'toggle-on' : ''}`} onClick={() => toggle(slot)} type="button"><span />{slot.isOpen ? 'Open' : 'Closed'}</button><button type="button" className="button button-outline button-small" onClick={() => { setForm({ slotTime: slot.slotTime, maxOrders: slot.maxOrders, isOpen: slot.isOpen }); setEditing(slot.id) }}>Edit</button></article>})}</div>
    {editing !== null && <div className="modal-backdrop"><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="slot-modal-title"><div className="modal-header"><div><span className="eyebrow">PICKUP CAPACITY</span><h2 id="slot-modal-title">{editing === 'new' ? 'New pickup slot' : 'Edit pickup slot'}</h2></div><button className="icon-button" onClick={() => setEditing(null)} type="button" aria-label="Close"><X size={19} /></button></div><form onSubmit={save} className="admin-edit-form"><label className="field-label" htmlFor="slotTime">Pickup time label</label><input id="slotTime" className="text-input" value={form.slotTime || ''} onChange={(e) => setForm({ ...form, slotTime: e.target.value })} placeholder="11:00 AM – 11:30 AM" required /><label className="field-label" htmlFor="maxOrders">Maximum orders</label><input id="maxOrders" className="text-input" type="number" min="1" step="1" value={form.maxOrders ?? 10} onChange={(e) => setForm({ ...form, maxOrders: e.target.value })} required /><label className="checkbox-row"><input type="checkbox" checked={Boolean(form.isOpen)} onChange={(e) => setForm({ ...form, isOpen: e.target.checked })} /> Open for new orders</label><div className="modal-actions"><button className="button button-outline" type="button" onClick={() => setEditing(null)}>Cancel</button><button className="button button-primary" type="submit">Save slot</button></div></form></section></div>}
  </>
}

export default function AdminDashboard() {
  return <AdminLayout><Routes><Route index element={<DashboardHome />} /><Route path="orders" element={<AdminOrders />} /><Route path="menu" element={<AdminMenu />} /><Route path="categories" element={<AdminCategories />} /><Route path="pickup-slots" element={<AdminPickupSlots />} /></Routes></AdminLayout>
}
