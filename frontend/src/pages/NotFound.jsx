import { ArrowLeft, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return <section className="not-found page-container"><span className="not-found-icon"><Utensils size={28} /></span><span className="eyebrow">404 · WRONG TURN</span><h1>Looks like this page left for lunch.</h1><p>The page you are looking for is not here. Let's get you back to the menu.</p><Link className="button button-primary" to="/"><ArrowLeft size={16} /> Back to home</Link></section>
}
