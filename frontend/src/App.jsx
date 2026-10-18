import { useCallback } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import Toast from './components/Toast'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import { useApp } from './context/AppContext'

function ProtectedRoute({ children, admin = false }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { notice, setNotice } = useApp()
  const closeToast = useCallback(() => setNotice(null), [setNotice])

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
      <Toast notice={notice} onClose={closeToast} />
    </div>
  )
}
