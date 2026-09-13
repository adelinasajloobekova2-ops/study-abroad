import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useTours } from '../firebase/useTours'
import TourCard from '../components/TourCard'
import { useLang } from '../i18n/LanguageContext'
import {
  FiArrowDown, FiArrowRight, FiStar,
  FiMapPin, FiShield, FiHeart, FiAward
} from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa'
import './Home.css'

// Fallback отзывы — показываются пока в Firestore нет одобренных
const STATIC_REVIEWS = [
  {
    id: 'sf1',
    name: 'Алексей Воронов', country: 'Россия', flag: '🇷🇺',
    rating: 5, tour: 'Иссык-Куль', avatar: 'А',
    text: 'Поездка на Иссык-Куль превзошла все ожидания. Организация на высшем уровне, гид знал всё о каждом камне. Обязательно вернёмся!',
  },
  {
    id: 'sf2',
    name: 'Sara Müller', country: 'Germany', flag: '🇩🇪',
    rating: 5, tour: 'Nomadic Life', avatar: 'S',
    text: 'Incredible experience! The nomadic life tour was absolutely authentic. Sleeping in a yurt under the Milky Way was magical.',
  },
  {
    id: 'sf3',
    name: 'Дмитрий Ким', country: 'Казахстан', flag: '🇰🇿',
    rating: 5, tour: 'Ала-Арча', avatar: 'Д',
    text: 'Ала-Арча — незабываемо. Два дня в горах, чистейший воздух, профессиональный гид. Рекомендую всем, кто ищет активный отдых.',
  },
]

const whyIcons = [
  <FiMapPin size={28} />,
  <FiShield size={28} />,
  <FiHeart size={28} />,
  <FiAward size={28} />,
]

export default function Home() {
  const { t } = useLang()

  // Firestore туры — только featured
  const { tours: allTours, loading: toursLoading } = useTours()
  const featured = allTours.filter(tour => tour.featured)

  // Firestore approved reviews
  const [homeReviews, setHomeReviews] = useState([])

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
          limit(3)
        )
        const snap = await getDocs(q)
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setHomeReviews(list.length > 0 ? list : STATIC_REVIEWS)
      } catch {
        setHomeReviews(STATIC_REVIEWS)
      }
    }
    loadReviews()
  }, [])

  const statsData = [
    { value: '500+', label: t.stats.tourists },
    { value: '30+',  label: t.stats.routes   },
    { value: '9',    label: t.stats.years    },
    { value: '4.9★', label: t.stats.rating   },
  ]

  return (
    <div className="home">
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1626773552771-e8d2faf79499?w=1600&q=80"
            alt="Кыргызстан"
            className="hero__bg-img"
          />
          <div className="hero__overlay" />
        </div>

        <div className="container hero__content">
          <span className="badge hero__badge">{t.hero.badge}</span>
          <h1 className="hero__title">
            {t.hero.title1}{' '}
            <span className="hero__title-accent">{t.hero.title2}</span>
            <br />{t.hero.titleEnd}
          </h1>
          <p className="hero__subtitle">{t.hero.subtitle}</p>

          <div className="hero__actions">
            <Link to="/tours" className="btn-primary">
              {t.hero.cta} <FiArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-outline">{t.hero.ctaAbout}</Link>
          </div>

          <div className="hero__stats">
            {statsData.map(s => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-val">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__scroll">
          <span>{t.hero.scroll}</span>
          <FiArrowDown size={16} className="hero__scroll-arrow" />
        </div>
      </section>

      {/* ─── FEATURED TOURS ─── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="badge">{t.home.popularBadge}</span>
              <h2 className="section-title" style={{ marginTop: '10px' }}>{t.home.popularTitle}</h2>
              <p className="section-subtitle">{t.home.popularSubtitle}</p>
            </div>
            <Link to="/tours" className="btn-primary">
              {t.home.allTours} <FiArrowRight size={15} />
            </Link>
          </div>

          {toursLoading ? (
            <div className="home-tours-loading">
              <span className="tours-spinner" />
            </div>
          ) : featured.length > 0 ? (
            <div className="tours-grid">
              {featured.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          ) : (
            <div className="home-tours-empty">
              <p>Туры скоро появятся. Следите за обновлениями!</p>
              <Link to="/contact" className="btn-primary" style={{ marginTop: 16 }}>
                Связаться с нами
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="section why-section">
        <div className="container">
          <div className="why__header">
            <span className="badge">{t.home.whyBadge}</span>
            <h2 className="section-title" style={{ marginTop: '10px' }}>{t.home.whyTitle}</h2>
            <p className="section-subtitle">{t.home.whySubtitle}</p>
          </div>
          <div className="why__grid">
            {t.why.map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-card__icon">{whyIcons[i]}</div>
                <h3 className="why-card__title">{w.title}</h3>
                <p className="why-card__desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BANNER ─── */}
      <section className="landscape-banner">
        <div className="landscape-banner__bg">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
            alt="Горы Кыргызстана"
          />
          <div className="landscape-banner__overlay" />
        </div>
        <div className="container landscape-banner__content">
          <h2>{t.home.bannerTitle}</h2>
          <p>{t.home.bannerSubtitle}</p>
          <Link to="/contact" className="btn-primary">{t.home.bannerCta}</Link>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <span className="badge">{t.home.reviewsBadge}</span>
            <h2 className="section-title" style={{ marginTop: '10px' }}>{t.home.reviewsTitle}</h2>
          </div>

          <div className="testimonials-grid">
            {homeReviews.map((rev) => (
              <div key={rev.id} className="testimonial-card">
                <FaQuoteLeft className="testimonial-card__quote-icon" />
                <div className="testimonial-card__stars">
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s} size={14}
                      className={s <= (rev.rating || 5) ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <p className="testimonial-card__text">"{rev.text}"</p>
                <div className="testimonial-card__footer">
                  <div className="testimonial-card__avatar">
                    {rev.avatar || rev.name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="testimonial-card__name">{rev.name}</div>
                    <div className="testimonial-card__meta">
                      {rev.flag && `${rev.flag} `}{rev.country}
                      {rev.tour && ` · ${rev.tour}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials-cta">
            <Link to="/reviews" className="btn-outline-dark">
              {t.home.allReviews} <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
