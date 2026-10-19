import { Plus, Check, Clock3, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { peso } from '../utils/format'

export default function FoodCard({ product, onAdd, compact = false }) {
  const { favorites, toggleFavorite } = useApp()
  const saved = favorites.includes(product.id)
  return (
    <article className={`food-card ${compact ? 'food-card-compact' : ''}`}>
      <div className="food-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80' }}
        />
        <span className={`availability-pill ${product.available ? 'available' : 'unavailable'}`}>
          <span />{product.available ? 'Available' : 'Sold out'}
        </span>
        <button type="button" className={`favorite-button ${saved ? 'favorite-active' : ''}`} aria-label={saved ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={saved} onClick={() => toggleFavorite(product.id)}>
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="food-card-body">
        <span className="food-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="food-card-bottom">
          <div><strong className="food-price">{peso(product.price)}</strong><span className="food-time"><Clock3 size={12} /> 10–15 min</span></div>
          <button type="button" className="add-food-button" onClick={() => onAdd(product)} disabled={!product.available}>
            {product.available ? <><Plus size={15} /> Add</> : <Check size={15} />}
          </button>
        </div>
      </div>
    </article>
  )
}
