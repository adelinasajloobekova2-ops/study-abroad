import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { FiClock, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi'
import './TourCard.css'

const CAT_KEYS = {
  'горы': 'mountains',
  'озёра': 'lakes',
  'культура': 'culture',
  'приключения': 'adventure',
}

export default function TourCard({ tour }) {
  const { t } = useLang()

  const diffMap = { 'Лёгкий': 'easy', 'Средний': 'medium', 'Сложный': 'hard' }
  const diffKey = diffMap[tour.difficulty] || 'easy'
  const diffLabel = t.card.difficulty[diffKey]

  const diffColor = { easy: '#27ae60', medium: '#e8a020', hard: '#c0392b' }

  const catLabel = t.tours.cats[CAT_KEYS[tour.category]] || tour.category

  return (
    <div className="tour-card">
      <div className="tour-card__img-wrap">
        {tour.image
          ? <img src={tour.image} alt={tour.title} className="tour-card__img" loading="lazy" />
          : <div className="tour-card__img-placeholder"><FiClock size={32} color="var(--gray-400)" /></div>
        }
        <span className="tour-card__category">{catLabel}</span>
        <span className="tour-card__difficulty" style={{ background: diffColor[diffKey] }}>
          {diffLabel}
        </span>
      </div>

      <div className="tour-card__body">
        <div className="tour-card__meta">
          <span><FiClock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{tour.duration}</span>
          <span><FiUsers size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{tour.groupSize}</span>
        </div>

        <h3 className="tour-card__title">{tour.title}</h3>
        <p className="tour-card__subtitle">{tour.subtitle}</p>

        <div className="tour-card__rating">
          <span className="tour-card__stars">
            {[1,2,3,4,5].map(i => (
              <FiStar key={i} size={13} className={i <= Math.round(tour.rating) ? 'star-filled' : 'star-empty'} />
            ))}
          </span>
          <span className="tour-card__rating-val">{tour.rating}</span>
          <span className="tour-card__reviews">({tour.reviews})</span>
        </div>

        <div className="tour-card__footer">
          <div className="tour-card__price">
            <span className="tour-card__price-from">{t.card.from}</span>
            <span className="tour-card__price-val">{tour.price.toLocaleString('ru')} с</span>
          </div>
          <Link to="/contact" className="tour-card__btn">
            {t.card.details} <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
