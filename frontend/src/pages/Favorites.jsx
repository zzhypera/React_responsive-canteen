import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import PageHeading from '../components/PageHeading'
import { useApp } from '../context/AppContext'

export default function Favorites() {
  const { products, favorites, addToCart } = useApp()
  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  return (
    <section className="page-section page-container">
      <PageHeading eyebrow="YOUR SAVED PICKS" title="Your favorites." description="Keep the meals you love close at hand." />
      {favoriteProducts.length ? (
        <>
          <div className="result-summary"><span><strong>{favoriteProducts.length}</strong> saved {favoriteProducts.length === 1 ? 'item' : 'items'}</span><Link className="text-link" to="/menu">Browse menu</Link></div>
          <div className="food-grid">{favoriteProducts.map((product) => <FoodCard key={product.id} product={product} onAdd={addToCart} />)}</div>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-icon"><Heart size={25} /></span>
          <h2>No favorites yet</h2>
          <p>Tap the heart on a menu item to save it here.</p>
          <Link className="button button-primary" to="/menu">Explore the menu</Link>
        </div>
      )}
    </section>
  )
}
