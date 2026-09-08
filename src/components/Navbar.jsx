import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logoImg from '../assets/WhatsApp Image 2026-09-08 at 20.41.48.jpeg'
import { useLang } from '../i18n/LanguageContext'
import './Navbar.css'

const LANGS = [
  { code: 'ky', label: 'КЫР' },
  { code: 'en', label: 'ENG' },
  { code: 'ru', label: 'РУС' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { lang, setLang, t } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

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
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: lang switcher + CTA */}
        <div className="navbar__right">
          {/* Language switcher */}
          <div className="lang-switcher">
            {LANGS.map(l => (
              <button
                key={l.code}
                className={`lang-btn ${lang === l.code ? 'lang-btn--active' : ''}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link to="/contact" className="navbar__cta">
            {t.nav.book}
          </Link>
        </div>

        {/* Burger */}
        <button
          className={`navbar__burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Меню"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `navbar__mobile-link ${isActive ? 'active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}

        {/* Mobile lang switcher */}
        <div className="lang-switcher lang-switcher--mobile">
          {LANGS.map(l => (
            <button
              key={l.code}
              className={`lang-btn ${lang === l.code ? 'lang-btn--active' : ''}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <Link to="/contact" className="btn-primary" style={{ marginTop: '8px', justifyContent: 'center' }}>
          {t.nav.book}
        </Link>
      </div>
    </header>
  )
}
