import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './TourCard.css'

// category keys match data keys → translated label
const CAT_KEYS = {
  'горы': 'mountains',
  'озёра': 'lakes',
  'культура': 'culture',
  'приключения': 'adventure',
}

export default function TourCard({ tour }) {
  const { t } = useLang()

  // map difficulty to translation key
  const diffMap = { 'Лёгкий': 'easy', 'Средний': 'medium', 'Сложный': 'hard' }
  const diffKey = diffMap[tour.difficulty] || 'easy'
  const diffLabel = t.card.difficulty[diffKey]

  const diffColor = { easy: '#27ae60', medium: '#e8a020', hard: '#c0392b' }

  const catLabel = t.tours.cats[CAT_KEYS[tour.category]] || tour.category

  return (
    <div className="tour-card">
      <div className="tour-card__img-wrap">
        <img src={tour.image} alt={tour.title} className="tour-card__img" loading="lazy" />
        <span className="tour-card__category">{catLabel}</span>
        <span className="tour-card__difficulty" style={{ background: diffColor[diffKey] }}>
          {diffLabel}
        </span>
      </div>

      <div className="tour-card__body">
        <div className="tour-card__meta">
          <span>⏱ {tour.duration}</span>
          <span>👥 {tour.groupSize}</span>
        </div>

        <h3 className="tour-card__title">{tour.title}</h3>
        <p className="tour-card__subtitle">{tour.subtitle}</p>

        <div className="tour-card__rating">
          <span className="tour-card__stars">{'★'.repeat(Math.round(tour.rating))}</span>
          <span className="tour-card__rating-val">{tour.rating}</span>
          <span className="tour-card__reviews">({tour.reviews})</span>
        </div>

        <div className="tour-card__footer">
          <div className="tour-card__price">
            <span className="tour-card__price-from">{t.card.from}</span>
            <span className="tour-card__price-val">{tour.price.toLocaleString('ru')} ₸</span>
          </div>
          <Link to="/contact" className="tour-card__btn">
            {t.card.details}
          </Link>
        </div>
      </div>
    </div>
  )
}
