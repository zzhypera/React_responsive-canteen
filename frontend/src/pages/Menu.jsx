import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import PageHeading from '../components/PageHeading'
import FoodCard from '../components/FoodCard'
import { useApp } from '../context/AppContext'

export default function Menu() {
  const { products, categories, addToCart } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [availability, setAvailability] = useState('All items')

  const filtered = useMemo(() => products.filter((product) => {
    const normalized = query.trim().toLowerCase()
    const matchesText = !normalized || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(normalized)
    const matchesCategory = category === 'All' || product.category === category
    const matchesAvailability = availability === 'All items' || (availability === 'Available' ? product.available : !product.available)
    return matchesText && matchesCategory && matchesAvailability
  }), [products, query, category, availability])

  return (
    <section className="page-section page-container">
      <PageHeading eyebrow="THE CANTEEN MENU" title="Find something delicious." description="Fresh campus favorites at student-friendly prices." />
      <div className="menu-toolbar">
        <label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search meals, snacks, drinks..." aria-label="Search menu" />{query && <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}</label>
        <label className="availability-select"><SlidersHorizontal size={17} /><select value={availability} onChange={(event) => setAvailability(event.target.value)} aria-label="Filter availability"><option>All items</option><option>Available</option><option>Sold out</option></select></label>
      </div>
      <div className="category-list" aria-label="Filter by category">
        {['All', ...categories].map((item) => <button type="button" key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="result-summary"><span><strong>{filtered.length}</strong> menu {filtered.length === 1 ? 'item' : 'items'}</span>{(query || category !== 'All' || availability !== 'All items') && <button type="button" className="text-button" onClick={() => { setQuery(''); setCategory('All'); setAvailability('All items') }}>Clear filters <X size={14} /></button>}</div>
      {filtered.length ? <div className="food-grid">{filtered.map((product) => <FoodCard key={product.id} product={product} onAdd={addToCart} />)}</div> : <div className="empty-state"><span className="empty-illustration">⌕</span><h2>No menu items found</h2><p>Try another keyword or remove one of the filters.</p><button className="button button-primary" onClick={() => { setQuery(''); setCategory('All'); setAvailability('All items') }}>Show all items</button></div>}
    </section>
  )
}
