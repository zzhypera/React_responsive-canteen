import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import { useApp } from '../context/AppContext'

const demoAccounts = [
  { name: 'Canteen Administrator', email: 'admin@canteen.local', password: 'admin123', role: 'admin', id: 1 },
  { name: 'Campus Student', email: 'student@campus.local', password: 'student123', role: 'student', id: 2 },
]

export default function Login() {
  const { user, setUser, notify } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (user) return <div className="auth-redirect"><h2>You're already signed in.</h2><Link className="button button-primary" to={user.role === 'admin' ? '/admin' : '/menu'}>Continue <ArrowRight size={16} /></Link></div>

  const submit = (event) => {
    event.preventDefault()
    setError('')
    const normalized = email.trim().toLowerCase()
    const demoUser = demoAccounts.find((account) => account.email === normalized && account.password === password)
    if (!demoUser) {
      setError('The demo login details do not match. Use one of the demo accounts below.')
      return
    }
    const nextUser = { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: demoUser.role }
    setUser(nextUser)
    notify(`Welcome, ${demoUser.name.split(' ')[0]}!`)
    navigate(location.state?.from || (nextUser.role === 'admin' ? '/admin' : '/menu'), { replace: true })
  }

  const chooseDemo = (account) => { setEmail(account.email); setPassword(account.password); setError('') }

  return (
    <section className="auth-page page-container">
      <div className="auth-side-story">
        <div className="auth-story-image"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85" alt="A freshly prepared meal" /></div>
        <span className="eyebrow eyebrow-light">YOUR CAMPUS, YOUR CANTEEN</span><h2>Take your break back.</h2><p>Order ahead, skip the queue, and spend your break doing more of what you love.</p>
      </div>
      <div className="auth-panel">
        <Brand />
        <span className="eyebrow">WELCOME BACK</span><h1>Sign in to order.</h1><p className="auth-subtitle">Access your orders, pickup slots, and favorites.</p>
        {error && <div className="inline-error" role="alert">{error}</div>}
        <form className="auth-form" onSubmit={submit}>
          <label className="field-label" htmlFor="email">Email address</label><div className="input-with-icon"><UserRound size={17} /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@campus.edu" autoComplete="username" required /></div>
          <label className="field-label" htmlFor="password">Password</label><div className="input-with-icon"><LockKeyhole size={17} /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /><button type="button" className="show-password" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div>
          <button type="submit" className="button button-primary button-full">Sign in <ArrowRight size={16} /></button>
        </form>
        <div className="demo-access"><div className="demo-heading"><span>DEMO ACCESS</span><span>LOCAL PREVIEW</span></div><button type="button" onClick={() => chooseDemo(demoAccounts[0])}><span className="demo-avatar admin-avatar">A</span><span><strong>Administrator</strong><small>admin@canteen.local</small></span><span className="demo-fill">Use</span></button><button type="button" onClick={() => chooseDemo(demoAccounts[1])}><span className="demo-avatar student-avatar">S</span><span><strong>Student account</strong><small>student@campus.local</small></span><span className="demo-fill">Use</span></button><p>Demo account credentials are for the local UI preview only. Connect Laravel authentication before deployment.</p></div>
        <p className="auth-switch">New to campus canteen? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  )
}
