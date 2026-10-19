import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

const quickAccounts = [
  { label: 'Admin', email: 'admin@canteen.local', password: 'admin123', badge: 'A', role: 'admin' },
  { label: 'Demo student', email: 'student@campus.local', password: 'student123', badge: 'S', role: 'student' },
]

export default function Login() {
  const { user, setUser, notify } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const chooseAccount = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  if (user) return <div className="auth-redirect"><h2>You're already signed in.</h2><Link className="button button-primary" to={user.role === 'admin' ? '/admin' : '/menu'}>Continue <ArrowRight size={16} /></Link></div>

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await api.post('/login', { email: email.trim().toLowerCase(), password })
      localStorage.setItem('canteen_api_token', response.data.token)
      setUser(response.data.user)
      notify(`Welcome, ${response.data.user.name.split(' ')[0]}!`)
      navigate(location.state?.from || (response.data.user.role === 'admin' ? '/admin' : '/menu'), { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.errors?.email?.[0] || requestError.response?.data?.message || 'Could not sign in. Check your details and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page auth-page-login page-container">
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
          <label className="field-label" htmlFor="password">Password</label><div className="input-with-icon"><LockKeyhole size={17} /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /><button type="button" className="show-password login-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls="password" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}<span>{showPassword ? 'Hide' : 'Show'}</span></button></div>
          <button type="submit" className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'} {!isSubmitting && <ArrowRight size={16} />}</button>
        </form>
        <div className="quick-access">
          <div className="quick-access-heading">QUICK FILL <span>SEEDED ACCOUNTS</span></div>
          {quickAccounts.map((account) => (
            <button className="quick-account" type="button" key={account.role} onClick={() => chooseAccount(account)}>
              <span className={`quick-avatar ${account.role}`}>{account.badge}</span>
              <span className="quick-account-copy"><strong>{account.label}</strong><small>{account.email}</small></span>
              <span className="quick-fill">Use</span>
            </button>
          ))}
          <p>Choose an account to fill the sign-in form, then press Sign in.</p>
        </div>
        <p className="auth-switch">New to campus canteen? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  )
}
