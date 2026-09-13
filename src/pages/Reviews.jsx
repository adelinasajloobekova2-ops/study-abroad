import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  collection, addDoc, getDocs, query,
  where, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useLang } from '../i18n/LanguageContext'
import { toast } from 'react-toastify'
import { FiStar, FiArrowRight, FiSend, FiAlertCircle } from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa'
import PageLoader from '../components/PageLoader'
import './Reviews.css'

const STATIC_REVIEWS = [
  { id: 's1', name: 'Алексей Воронов', country: 'Россия',    flag: '🇷🇺', tour: 'Иссык-Куль',   rating: 5, date: 'Июль 2024',      avatar: 'А', text: 'Поездка на Иссык-Куль превзошла все ожидания. Организация на высшем уровне, гид знал всё о каждом камне. Обязательно вернёмся!' },
  { id: 's2', name: 'Sara Müller',      country: 'Germany',   flag: '🇩🇪', tour: 'Nomadic Life',  rating: 5, date: 'August 2024',    avatar: 'S', text: 'Incredible experience! The nomadic life tour was absolutely authentic. Sleeping in a yurt under the Milky Way was magical.' },
  { id: 's3', name: 'Дмитрий Ким',     country: 'Казахстан', flag: '🇰🇿', tour: 'Ала-Арча',      rating: 5, date: 'Июнь 2024',      avatar: 'Д', text: 'Ала-Арча — незабываемо. Два дня в горах, чистейший воздух, профессиональный гид. Рекомендую всем, кто ищет активный отдых.' },
  { id: 's4', name: 'Yuki Tanaka',      country: 'Japan',     flag: '🇯🇵', tour: 'Tian-Shan',     rating: 5, date: 'September 2023', avatar: 'Y', text: 'The Tian-Shan expedition was challenging but incredibly beautiful. A team of professionals who cared about our safety every step of the way.' },
  { id: 's5', name: 'Ahmed Al-Rashid', country: 'UAE',        flag: '🇦🇪', tour: 'Каракол',       rating: 5, date: 'Май 2024',       avatar: 'A', text: 'Каракол превзошёл мои самые смелые ожидания. Ущелья, ледники, кочевники — всё в одном туре. Это must-see!' },
  { id: 's6', name: 'Мария Петрова',   country: 'Украина',   flag: '🇺🇦', tour: 'Сары-Челек',    rating: 5, date: 'Август 2023',    avatar: 'М', text: 'Сары-Челек — жемчужина, о которой мало кто знает. Изумрудное озеро в окружении ореховых лесов.' },
  { id: 's7', name: 'James Wilson',    country: 'UK',         flag: '🇬🇧', tour: 'Issyk-Kul',     rating: 5, date: 'July 2023',      avatar: 'J', text: 'I have travelled half the world, but Kyrgyzstan surprised me the most. Issyk-Kul is like the Swiss Alps without the tourist crowds.' },
  { id: 's8', name: 'Li Wei',          country: 'China',      flag: '🇨🇳', tour: 'Nomadic Life',  rating: 5, date: 'June 2024',      avatar: 'L', text: 'I was looking for an authentic experience — and found it here. A yurt, national food, komuz music. It changed my perception of Central Asia.' },
  { id: 's9', name: 'Fatima Benali',   country: 'Morocco',    flag: '🇲🇦', tour: 'Ала-Арча',      rating: 5, date: 'October 2023',   avatar: 'F', text: 'Trekking in Ala-Archa was exactly what I dreamed of. Professional guide, stunning landscapes and everything perfectly organised.' },
]

const RATING_SUMMARY = { 5: 87, 4: 9, 3: 3, 2: 1, 1: 0 }
const TOUR_OPTIONS   = ['Иссык-Куль', 'Ала-Арча', 'Сары-Челек', 'Каракол', 'Кочевая жизнь', 'Тянь-Шань']
const EMPTY_FORM     = { name: '', country: '', tour: '', rating: 5, text: '' }

export default function Reviews() {
  const { t } = useLang()
  const rv = t.reviews

  const [firestoreReviews, setFirestoreReviews] = useState([])
  const [loadingReviews, setLoadingReviews]     = useState(true)

  const [form, setForm]             = useState(EMPTY_FORM)
  const [sending, setSending]       = useState(false)
  const [sent, setSent]             = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        setFirestoreReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        setFirestoreReviews([])
      }
      setLoadingReviews(false)
    }
    load()
  }, [])

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.text.trim().length < 20) {
      toast.warning('Напишите отзыв (минимум 20 символов).')
      return
    }
    setSending(true)
    try {
      await addDoc(collection(db, 'reviews'), {
        name:      form.name.trim(),
        country:   form.country.trim(),
        tour:      form.tour,
        rating:    Number(form.rating),
        text:      form.text.trim(),
        avatar:    form.name.trim()[0]?.toUpperCase() || '?',
        status:    'pending',
        createdAt: serverTimestamp(),
      })
      setSent(true)
      setForm(EMPTY_FORM)
      toast.success('Спасибо! Отзыв отправлен на проверку.')
    } catch {
      toast.error('Ошибка при отправке. Попробуйте снова.')
    }
    setSending(false)
  }

  const allReviews = [...STATIC_REVIEWS, ...firestoreReviews]

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="reviews-hero">
        <div className="reviews-hero__bg">
          <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80" alt="Reviews" />
          <div className="reviews-hero__overlay" />
        </div>
        <div className="container reviews-hero__content">
          <span className="badge" style={{ background: 'rgba(232,160,32,0.25)', color: '#f8d07a' }}>
            {rv.badge}
          </span>
          <h1 className="reviews-hero__title">{rv.title}</h1>
          <p className="reviews-hero__subtitle">{rv.subtitle}</p>
        </div>
      </div>

      <div className="container">
        {/* Summary */}
        <div className="reviews-summary">
          <div className="reviews-summary__score">
            <div className="reviews-summary__num">4.9</div>
            <div className="reviews-summary__stars">
              {[1,2,3,4,5].map(s => <FiStar key={s} size={22} className="star-filled" />)}
            </div>
            <div className="reviews-summary__count">{rv.basedOn}</div>
          </div>
          <div className="reviews-summary__bars">
            {[5,4,3,2,1].map(n => (
              <div key={n} className="reviews-summary__bar-row">
                <span className="reviews-summary__bar-label">{n}</span>
                <FiStar size={12} className="star-filled" />
                <div className="reviews-summary__bar-track">
                  <div className="reviews-summary__bar-fill" style={{ width: `${RATING_SUMMARY[n]}%` }} />
                </div>
                <span className="reviews-summary__bar-pct">{RATING_SUMMARY[n]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews grid */}
        {loadingReviews ? (
          <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
            <PageLoader text="Загружаем отзывы..." />
          </div>
        ) : (
          <div className="reviews-grid">
            {allReviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <FaQuoteLeft className="review-card__quote" />
                <div className="review-card__stars">
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s} size={14} className={s <= rev.rating ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <p className="review-card__text">"{rev.text}"</p>
                <div className="review-card__meta">
                  <span className="review-card__tour">{rev.tour}</span>
                  <span className="review-card__date">
                    {rev.date || (rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleDateString('ru') : '')}
                  </span>
                </div>
                <div className="review-card__author">
                  <div className="review-card__avatar">{rev.avatar}</div>
                  <div>
                    <div className="review-card__name">{rev.name}</div>
                    <div className="review-card__country">{rev.flag && `${rev.flag} `}{rev.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write a review */}
        <div className="reviews-write">
          <div className="reviews-write__header">
            <span className="badge">{rv.writeBadge}</span>
            <h2 className="section-title" style={{ marginTop: 10 }}>{rv.writeTitle}</h2>
            <p className="section-subtitle">{rv.writeSubtitle}</p>
          </div>

          {sent ? (
            <div className="reviews-write__success">
              <div className="reviews-write__success-icon">✅</div>
              <h3>{rv.writeSuccessTitle}</h3>
              <p>{rv.writeSuccessText}</p>
              <button className="btn-primary" onClick={() => setSent(false)}>
                {rv.writeSuccessBtn}
              </button>
            </div>
          ) : (
            <form className="reviews-write__form" onSubmit={handleSubmit}>
              <div className="reviews-write__grid">
                <div className="reviews-write__group">
                  <label>{rv.writeName} *</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder={rv.writeNamePh} required />
                </div>
                <div className="reviews-write__group">
                  <label>{rv.writeCountry}</label>
                  <input name="country" value={form.country} onChange={handleChange}
                    placeholder={rv.writeCountryPh} />
                </div>
              </div>

              <div className="reviews-write__group">
                <label>{rv.writeTour}</label>
                <select name="tour" value={form.tour} onChange={handleChange}>
                  <option value="">{rv.writeTourPh}</option>
                  {TOUR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Star picker */}
              <div className="reviews-write__group">
                <label>{rv.writeRating}</label>
                <div className="reviews-write__stars">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button"
                      className={`reviews-star-btn ${s <= (hoverRating || form.rating) ? 'active' : ''}`}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setForm(prev => ({ ...prev, rating: s }))}
                      aria-label={`${s} stars`}
                    >
                      <FiStar size={28} />
                    </button>
                  ))}
                  <span className="reviews-write__rating-val">{form.rating} / 5</span>
                </div>
              </div>

              <div className="reviews-write__group reviews-write__group--full">
                <label>{rv.writeText} *</label>
                <textarea name="text" rows={4} value={form.text}
                  onChange={handleChange} placeholder={rv.writeTextPh} required
                  maxLength={500}
                />
                <span className="reviews-write__char">{form.text.length} / 500</span>
              </div>

              <div className="reviews-write__note">
                <FiAlertCircle size={13} /> {rv.writeNote}
              </div>

              <button type="submit" className="btn-primary reviews-write__submit" disabled={sending}>
                {sending
                  ? <><span className="reviews-write__spinner" /> {rv.writeSending}</>
                  : <><FiSend size={15} /> {rv.writeBtn}</>
                }
              </button>
            </form>
          )}
        </div>

        {/* CTA */}
        <div className="reviews-cta">
          <h3>{rv.ctaTitle}</h3>
          <p>{rv.ctaSubtitle}</p>
          <Link to="/contact" className="btn-primary">
            {rv.ctaBtn} <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
