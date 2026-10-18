import { ArrowRight, ChevronRight, Clock3, ShieldCheck, ShoppingBasket, Soup, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { useApp } from '../context/AppContext'

const featuredIds = [1, 2, 3, 5]
const steps = [
  { number: '01', title: 'Choose your food', description: 'Browse the menu, find your favorites, and add them to your cart.', icon: ShoppingBasket },
  { number: '02', title: 'Reserve a pickup slot', description: 'Choose an available time so your order is ready when you arrive.', icon: Clock3 },
  { number: '03', title: 'Pick up and enjoy', description: 'Follow the order status and collect your food when it is ready.', icon: Soup },
]

export default function Home() {
  const { products, addToCart } = useApp()
  return (
    <>
      <section className="hero-section">
        <div className="hero-content page-container">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> CAMPUS FOOD, MADE SIMPLE</span>
            <h1>Good food.<br /><em>Less waiting.</em></h1>
            <p>Order your favorite canteen meals before you reach the counter. Pick up, eat, and get back to campus life.</p>
            <div className="hero-actions">
              <Link to="/menu" className="button button-primary">Browse menu <ArrowRight size={17} /></Link>
              <Link to="/orders" className="button button-link">Track my order <ChevronRight size={17} /></Link>
            </div>
            <div className="hero-proof">
              <span><ShieldCheck size={16} /> Easy pickup reservations</span>
              <span><Clock3 size={16} /> Spend less time in line</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <img src="https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=90" alt="A freshly prepared campus meal" />
            </div>
            <div className="hero-sticker"><span className="sticker-icon"><Soup size={18} /></span><div><small>Today's pick</small><strong>Chicken Rice Meal</strong><b>₱85 <span>· Ready in 10–15 min</span></b></div></div>
            <div className="hero-decor">GOOD<br />FOOD CLUB</div>
          </div>
        </div>
        <div className="hero-bottom-strip"><span>FRESHLY PREPARED</span><span>MADE FOR CAMPUS LIFE</span><span>ORDER AHEAD · PICK UP EASY</span></div>
      </section>

      <section className="section-block page-container">
        <div className="section-heading">
          <div><span className="eyebrow">POPULAR ON CAMPUS</span><h2>What are you craving?</h2><p>Student favorites, ready for your next break.</p></div>
          <Link to="/menu" className="text-link">Explore the full menu <ArrowRight size={16} /></Link>
        </div>
        <div className="food-grid">
          {products.filter((product) => featuredIds.includes(product.id)).map((product) => <FoodCard key={product.id} product={product} onAdd={addToCart} />)}
        </div>
      </section>

      <section className="how-section">
        <div className="page-container how-inner">
          <div className="how-copy"><span className="eyebrow eyebrow-light">QUICK, EASY, CONVENIENT</span><h2>From hungry to happy in three steps.</h2><p>Good food should fit your schedule, not the other way around.</p><Link to="/menu" className="button button-white">Order something good <ArrowRight size={16} /></Link></div>
          <div className="step-list">{steps.map(({ number, title, description, icon: Icon }) => <div className="step-row" key={number}><span className="step-number">{number}</span><div className="step-icon"><Icon size={21} /></div><div><h3>{title}</h3><p>{description}</p></div></div>)}</div>
        </div>
      </section>
      <section className="closing-cta page-container"><div><span className="eyebrow">YOUR NEXT BREAK STARTS HERE</span><h2>Good things are on the menu.</h2><p>Choose your meal, reserve your pickup time, and make the most of your break.</p></div><Link to="/menu" className="button button-primary">View the menu <ArrowRight size={17} /></Link></section>
    </>
  )
}
