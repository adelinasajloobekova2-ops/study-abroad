import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logoImg from '../assets/WhatsApp Image 2026-09-08 at 20.41.48.jpeg'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../firebase/AuthContext'
import './Navbar.css'

const LANGS = [
  { code: 'ky', label: 'КЫР' },
  { code: 'en', label: 'ENG' },
  { code: 'ru', label: 'РУС' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [dropOpen, setDropOpen]   = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const { lang, setLang, t } = useLang()
  const { user, logout } = useAuth()
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const transparent = isHome && !scrolled

  const links = [
    { to: '/',        label: t.nav.home    },
    { to: '/tours',   label: t.nav.tours   },
    { to: '/about',   label: t.nav.about   },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <header className={`navbar ${transparent ? 'navbar--transparent' : 'navbar--solid'} ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src={logoImg} alt="Nomad Tour KG" className="navbar__logo-img" />
          <span className="navbar__logo-text">
            <span className="navbar__logo-main">Nomad</span>
            <span className="navbar__logo-sub">Tour KG</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="navbar__right">
          {/* Language switcher */}
          <div className="lang-switcher">
            {LANGS.map(l => (
              <button key={l.code}
                className={`lang-btn ${lang === l.code ? 'lang-btn--active' : ''}`}
                onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Auth area */}
          {user ? (
            <div className="navbar__user-wrap" ref={dropRef}>
              <button className="navbar__user-btn" onClick={() => setDropOpen(v => !v)}>
                <div className="navbar__user-avatar">
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" />
                    : (user.displayName || user.email || 'U')[0].toUpperCase()
                  }
                </div>
                <span className="navbar__user-name">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="navbar__user-caret">▾</span>
              </button>

              {dropOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-info">
                    <div className="navbar__dropdown-name">{user.displayName || '—'}</div>
                    <div className="navbar__dropdown-email">{user.email}</div>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  {user.isAdmin && (
                    <Link to="/admin" className="navbar__dropdown-item">
                      🛡️ {t.nav.admin}
                    </Link>
                  )}
                  <button className="navbar__dropdown-item navbar__dropdown-item--logout"
                    onClick={handleLogout}>
                    🚪 {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__cta">
              {t.nav.login}
            </Link>
          )}
        </div>

        {/* Burger */}
        <button className={`navbar__burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)} aria-label="Меню">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}
            className={({ isActive }) => `navbar__mobile-link ${isActive ? 'active' : ''}`}>
            {l.label}
          </NavLink>
        ))}

        <div className="lang-switcher lang-switcher--mobile">
          {LANGS.map(l => (
            <button key={l.code}
              className={`lang-btn ${lang === l.code ? 'lang-btn--active' : ''}`}
              onClick={() => setLang(l.code)}>
              {l.label}
            </button>
          ))}
        </div>

        {user ? (
          <div className="navbar__mobile-auth">
            <div className="navbar__mobile-user">
              {user.isAdmin && (
                <Link to="/admin" className="navbar__mobile-link">
                  🛡️ {t.nav.admin}
                </Link>
              )}
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center', background: '#c0392b' }}
              onClick={handleLogout}>
              🚪 {t.nav.logout}
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ marginTop: '8px', justifyContent: 'center' }}>
            {t.nav.login}
          </Link>
        )}
      </div>
    </header>
  )
}
