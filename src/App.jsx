import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LanguageProvider } from './i18n/LanguageContext'
import { AuthProvider, useAuth } from './firebase/AuthContext'
import Navbar     from './components/Navbar'
import Footer     from './components/Footer'
import Home       from './pages/Home'
import Tours      from './pages/Tours'
import About      from './pages/About'
import Contact    from './pages/Contact'
import Login      from './pages/Login'
import Register   from './pages/Register'
import AdminPanel from './pages/AdminPanel'
import Reviews    from './pages/Reviews'
import PageLoader from './components/PageLoader'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (!user.isAdmin) return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
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
          <Route path="/reviews"  element={<Reviews />}  />

          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>}    />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="/admin"    element={<AdminRoute><AdminPanel /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}

      {/* Global toast container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ zIndex: 9999 }}
      />
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
