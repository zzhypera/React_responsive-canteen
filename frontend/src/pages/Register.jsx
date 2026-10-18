import { ArrowRight, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import { useApp } from '../context/AppContext'

export default function Register() {
  const { setUser, notify } = useApp()
  const [form, setForm] = useState({ name: '', studentId: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.'
    if (form.studentId.trim().length < 3) nextErrors.studentId = 'Enter your student ID.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const user = { id: Date.now(), name: form.name.trim(), studentId: form.studentId.trim(), email: form.email.trim().toLowerCase(), role: 'student' }
    setUser(user)
    notify('Your local preview account is ready.')
    navigate('/menu')
  }

  return (
    <section className="auth-page auth-page-register page-container">
      <div className="auth-side-story">
        <div className="auth-story-image"><img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=85" alt="Fresh food on a table" /></div>
        <span className="eyebrow eyebrow-light">MADE FOR YOUR CAMPUS</span><h2>Less waiting. More living.</h2><p>Create your student account to browse the menu, reserve a pickup slot, and keep your order history in one place.</p>
      </div>
      <div className="auth-panel">
        <Brand /><span className="eyebrow">JOIN THE CANTEEN</span><h1>Create your account.</h1><p className="auth-subtitle">Student registration for the campus canteen.</p>
        <form className="auth-form" onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="name">Full name</label><input className={`text-input ${errors.name ? 'input-invalid' : ''}`} id="name" name="name" value={form.name} onChange={update} placeholder="Your full name" autoComplete="name" />
          {errors.name && <span className="field-error">{errors.name}</span>}
          <label className="field-label" htmlFor="studentId">Student ID number</label><input className={`text-input ${errors.studentId ? 'input-invalid' : ''}`} id="studentId" name="studentId" value={form.studentId} onChange={update} placeholder="Enter your student ID" />
          {errors.studentId && <span className="field-error">{errors.studentId}</span>}
          <label className="field-label" htmlFor="email">Email address</label><input className={`text-input ${errors.email ? 'input-invalid' : ''}`} id="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@campus.edu" autoComplete="email" />
          {errors.email && <span className="field-error">{errors.email}</span>}
          <label className="field-label" htmlFor="password">Password</label><input className={`text-input ${errors.password ? 'input-invalid' : ''}`} id="password" name="password" type="password" value={form.password} onChange={update} placeholder="At least 8 characters" autoComplete="new-password" />
          {errors.password && <span className="field-error">{errors.password}</span>}
          <label className="field-label" htmlFor="confirmPassword">Confirm password</label><input className={`text-input ${errors.confirmPassword ? 'input-invalid' : ''}`} id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} placeholder="Enter your password again" autoComplete="new-password" />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          <button className="button button-primary button-full" type="submit">Create account <ArrowRight size={16} /></button>
        </form>
        <p className="auth-helper-note"><UserRound size={15} /> This local preview creates a browser-stored student session. Laravel registration must be connected for real accounts.</p>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </section>
  )
}
