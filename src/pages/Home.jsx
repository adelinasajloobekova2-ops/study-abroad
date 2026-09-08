import { Link } from 'react-router-dom'
import { tours } from '../data/tours'
import TourCard from '../components/TourCard'
import { useLang } from '../i18n/LanguageContext'
import './Home.css'

const featured = tours.filter(t => t.featured)

const reviewAuthors = [
  { name: 'Алексей Воронов', country: '🇷🇺 Россия', rating: 5 },
  { name: 'Sara Müller',      country: '🇩🇪 Germany', rating: 5 },
  { name: 'Дмитрий Ким',     country: '🇰🇿 Казахстан', rating: 5 },
]

export default function Home() {
  const { t } = useLang()

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
            <Link to="/tours" className="btn-primary">{t.hero.cta}</Link>
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
          <div className="hero__scroll-line" />
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
            <Link to="/tours" className="btn-primary">{t.home.allTours}</Link>
          </div>
          <div className="tours-grid">
            {featured.map(tour => <TourCard key={tour.id} tour={tour} />)}
          </div>
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
                <div className="why-card__icon">{['🏔️','🛡️','🌿','💎'][i]}</div>
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
            {t.testimonials.map((rev, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-card__stars">{'★'.repeat(reviewAuthors[i].rating)}</div>
                <p className="testimonial-card__text">"{rev.text}"</p>
                <div className="testimonial-card__footer">
                  <div className="testimonial-card__avatar">{reviewAuthors[i].name[0]}</div>
                  <div>
                    <div className="testimonial-card__name">{reviewAuthors[i].name}</div>
                    <div className="testimonial-card__meta">{reviewAuthors[i].country} · {rev.tour}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
