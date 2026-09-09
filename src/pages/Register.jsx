import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import './Auth.css'

function mapError(code, a) {
  const map = {
    'auth/email-already-in-use':  a.errEmailUsed,
    'auth/invalid-email':         a.errInvalidEmail,
    'auth/weak-password':         a.errWeakPass,
    'auth/popup-closed-by-user':  a.errPopup,
  }
  return map[code] || a.errDefault
}

export default function Register() {
  const { register, loginWithGoogle } = useAuth()
  const { t } = useLang()
  const nav = useNavigate()
  const a = t.auth

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState('')

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setErr('')
    if (form.password !== form.confirm) { setErr(a.errPassMatch); return }
    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      nav('/')
    } catch (e) {
      setErr(mapError(e.code, a))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setErr('')
    setLoading(true)
    try {
      await loginWithGoogle()
      nav('/')
    } catch (e) {
      setErr(mapError(e.code, a))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80" alt="" />
        <div className="auth-bg__overlay" />
      </div>

      <div className="auth-card">
        <div className="auth-card__logo">
          <span>🏔️</span>
          <span>Nomad Tour KG</span>
        </div>

        <h1 className="auth-card__title">{a.registerTitle}</h1>
        <p className="auth-card__subtitle">{a.registerSubtitle}</p>

        <button className="auth-google-btn" onClick={handleGoogle} disabled={loading} type="button">
          <GoogleIcon />
          {a.continueGoogle}
        </button>

        <div className="auth-divider"><span>{a.or}</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="r-name">{a.name}</label>
            <input id="r-name" name="name" type="text"
              placeholder={a.namePh} value={form.name}
              onChange={onChange} required autoComplete="name" />
          </div>
          <div className="form-group">
            <label htmlFor="r-email">{a.email}</label>
            <input id="r-email" name="email" type="email"
              placeholder={a.emailPh} value={form.email}
              onChange={onChange} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="r-password">{a.password}</label>
            <input id="r-password" name="password" type="password"
              placeholder={a.passwordPh} value={form.password}
              onChange={onChange} required autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label htmlFor="r-confirm">{a.confirmPassword}</label>
            <input id="r-confirm" name="confirm" type="password"
              placeholder={a.confirmPasswordPh} value={form.confirm}
              onChange={onChange} required autoComplete="new-password" />
          </div>

          {err && <div className="auth-error">⚠️ {err}</div>}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : a.registerBtn}
          </button>
        </form>

        <p className="auth-switch">
          {a.hasAccount} <Link to="/login">{a.loginLink}</Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
