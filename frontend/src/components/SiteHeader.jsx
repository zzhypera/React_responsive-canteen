import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, UserRound, LayoutDashboard, LogOut } from 'lucide-react'
import Brand from './Brand'
import { useApp } from '../context/AppContext'

export default function SiteHeader() {
  const { cart, user, setUser, notify } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const close = () => setMobileOpen(false)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') close()
    }
    const closeOnDesktop = (event) => {
      if (event.matches) close()
    }
    const desktopQuery = window.matchMedia('(min-width: 821px)')

    document.addEventListener('keydown', closeOnEscape)
    desktopQuery.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      desktopQuery.removeEventListener('change', closeOnDesktop)
    }
  }, [])

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('canteen_api_token')
    notify('You have signed out.')
    navigate('/')
    close()
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button
          className="mobile-menu-toggle icon-button"
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="site-navigation"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
        <nav id="site-navigation" className={`main-nav ${mobileOpen ? 'main-nav-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/menu" onClick={close}>Menu</NavLink>
          <NavLink to="/favorites" onClick={close}>Favorites</NavLink>
          {user && <NavLink to="/orders" onClick={close}>My orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" onClick={close}>Dashboard</NavLink>}
        </nav>
        <div className={`header-actions ${mobileOpen ? 'header-actions-open' : ''}`}>
          <Link className="cart-link" to="/cart" onClick={close} aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={18} /><span>Cart</span>{count > 0 && <b>{count}</b>}
          </Link>
          {user ? (
            <div className="account-actions">
              {user.role === 'admin' && <Link className="header-admin-link" to="/admin" onClick={close}><LayoutDashboard size={16} /> Admin</Link>}
              <span className="user-chip"><span>{(user.name || 'U').charAt(0).toUpperCase()}</span>{user.name.split(' ')[0]}</span>
              <button className="text-button signout-button" onClick={signOut} type="button"><LogOut size={15} /> Sign out</button>
            </div>
          ) : (
            <Link to="/login" className="header-login" onClick={close}><UserRound size={16} /> Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}
