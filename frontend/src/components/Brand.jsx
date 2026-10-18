import { Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Campus Canteen home">
      <span className="brand-mark"><Utensils size={18} strokeWidth={2.4} /></span>
      <span>campus<span className="brand-accent">canteen</span></span>
    </Link>
  )
}
