import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LanguageProvider } from './i18n/LanguageContext'
import { AuthProvider, useAuth } from './firebase/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home     from './pages/Home'
import Tours    from './pages/Tours'
import About    from './pages/About'
import Contact  from './pages/Contact'
import Login    from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

// Только для авторизованных
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading">⏳</div>
  return user ? children : <Navigate to="/login" replace />
}

// Только для администратора
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading">⏳</div>
  if (!user) return <Navigate to="/login" replace />
  if (!user.isAdmin) return <Navigate to="/" replace />
  return children
}

// Редирект если уже вошёл
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading">⏳</div>
  return user ? <Navigate to="/" replace /> : children
}

function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/"         element={<Home />}     />
          <Route path="/tours"    element={<Tours />}    />
          <Route path="/about"    element={<About />}    />
          <Route path="/contact"  element={<Contact />}  />

          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>}    />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="/admin"    element={<AdminRoute><AdminPanel /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
