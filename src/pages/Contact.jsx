import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useLang } from '../i18n/LanguageContext'
import { toast } from 'react-toastify'
import {
  FiMapPin, FiPhone, FiMail, FiClock,
  FiSend, FiCheckCircle
} from 'react-icons/fi'
import {
  FaInstagram, FaTelegramPlane, FaWhatsapp, FaYoutube
} from 'react-icons/fa'
import './Contact.css'

const tourOptions = [
  'Иссык-Куль / Issyk-Kul / Ысык-Көл',
  'Ала-Арча / Ala-Archa',
  'Сары-Челек / Sary-Chelek',
  'Каракол / Karakol',
  'Кочевая жизнь / Nomadic Life / Көчмөн жашоо',
  'Тянь-Шань / Tian-Shan',
]

const infoIconsList = [
  <FiMapPin size={20} />,
  <FiPhone size={20} />,
  <FiMail size={20} />,
  <FiClock size={20} />,
]

export default function Contact() {
  const { t } = useLang()
  const c = t.contact

  const [form, setForm] = useState({
    name: '', email: '', phone: '', tour: '', people: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]     = useState(false)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await addDoc(collection(db, 'bookings'), {
        ...form,
        people:    form.people ? Number(form.people) : null,
        status:    'new',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      toast.success('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.')
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при отправке. Проверьте соединение и попробуйте снова.')
    }
    setSending(false)
  }

  const resetForm = () => {
    setSubmitted(false)
    setForm({ name: '', email: '', phone: '', tour: '', people: '', message: '' })
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="contact-hero">
        <div className="contact-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1400&q=80"
            alt="Contact"
          />
          <div className="contact-hero__overlay" />
        </div>
        <div className="container contact-hero__content">
          <span className="badge" style={{ background: 'rgba(232,160,32,0.25)', color: '#f8d07a' }}>
            {c.badge}
          </span>
          <h1 className="contact-hero__title">{c.title}</h1>
          <p className="contact-hero__subtitle">{c.subtitle}</p>
        </div>
      </div>

      <div className="container contact-content">
        {/* Info cards */}
        <div className="contact-info-grid">
          {c.info.map((item, i) => (
            <div key={i} className="contact-info-card">
              <span className="contact-info-card__icon">{infoIconsList[i]}</span>
              <div>
                <div className="contact-info-card__label">{item.label}</div>
                <div className="contact-info-card__val">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-main">
          {/* Form */}
          <div className="contact-form-wrap">
            <h2 className="contact-form-title">{c.formTitle}</h2>
            <p className="contact-form-subtitle">{c.formSubtitle}</p>

            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <FiCheckCircle size={52} color="#27ae60" />
                </div>
                <h3>{c.successTitle}</h3>
                <p>{c.successText}</p>
                <button className="btn-primary" onClick={resetForm}>
                  {c.successBtn}
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{c.name}</label>
                    <input id="name" name="name" type="text" placeholder={c.namePh}
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{c.email}</label>
                    <input id="email" name="email" type="email" placeholder={c.emailPh}
                      value={form.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">{c.phone}</label>
                    <input id="phone" name="phone" type="tel" placeholder={c.phonePh}
                      value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="people">{c.people}</label>
                    <input id="people" name="people" type="number" min="1" max="30"
                      placeholder={c.peoplePh} value={form.people} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tour">{c.tour}</label>
                  <select id="tour" name="tour" value={form.tour} onChange={handleChange}>
                    <option value="">{c.tourPh}</option>
                    {tourOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{c.message}</label>
                  <textarea id="message" name="message" rows={4}
                    placeholder={c.messagePh} value={form.message} onChange={handleChange} />
                </div>

                <button
                  type="submit"
                  className="btn-primary contact-form__submit"
                  disabled={sending}
                >
                  {sending
                    ? <><span className="contact-spinner" /> Отправка...</>
                    : <><FiSend size={16} /> {c.submit}</>
                  }
                </button>
              </form>
            )}
          </div>

          {/* Side */}
          <div className="contact-side">
            <div className="contact-map">
              <div className="contact-map__placeholder">
                <FiMapPin size={32} color="var(--accent)" />
                <p>г. Бишкек, ул. Орозбекова 136</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                  Кыргызстан, 720000
                </p>
              </div>
            </div>

            <div className="contact-socials">
              <h4>{c.socialsTitle}</h4>
              <div className="contact-socials__grid">
                <a href="#" className="contact-social-btn">
                  <FaInstagram size={18} /> Instagram
                </a>
                <a href="#" className="contact-social-btn">
                  <FaTelegramPlane size={18} /> Telegram
                </a>
                <a href="#" className="contact-social-btn">
                  <FaWhatsapp size={18} /> WhatsApp
                </a>
                <a href="#" className="contact-social-btn">
                  <FaYoutube size={18} /> YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
