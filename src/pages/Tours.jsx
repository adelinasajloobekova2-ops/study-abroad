import { useState } from 'react'
import { useTours } from '../firebase/useTours'
import TourCard from '../components/TourCard'
import { useLang } from '../i18n/LanguageContext'
import {
  FiGlobe, FiTriangle, FiDroplet, FiBook, FiZap,
  FiArrowRight, FiSearch
} from 'react-icons/fi'
import './Tours.css'

const CAT_DATA_KEYS = ['все', 'горы', 'озёра', 'культура', 'приключения']
const CAT_I18N_KEYS = ['all', 'mountains', 'lakes', 'culture', 'adventure']

const catIcons = [
  <FiGlobe size={16} />,
  <FiTriangle size={16} />,
  <FiDroplet size={16} />,
  <FiBook size={16} />,
  <FiZap size={16} />,
]

export default function Tours() {
  const { t } = useLang()
  const { tours, loading } = useTours()

  const [activeCat, setActiveCat] = useState('все')
  const [sortBy, setSortBy]       = useState('rating')

  const filtered = tours
    .filter(tour => activeCat === 'все' || tour.category === activeCat)
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return (a.price || 0) - (b.price || 0)
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
      return (b.rating || 0) - (a.rating || 0)
    })

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="tours-page__hero">
        <div className="tours-page__hero-bg">
          <img
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80"
            alt="Tours"
          />
          <div className="tours-page__hero-overlay" />
        </div>
        <div className="container tours-page__hero-content">
          <span className="badge" style={{ background: 'rgba(232,160,32,0.25)', color: '#f8d07a' }}>
            {t.tours.badge}
          </span>
          <h1 className="tours-page__title">{t.tours.title}</h1>
          <p className="tours-page__subtitle">
            {loading ? '...' : tours.length} {t.tours.subtitle}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container">
        <div className="tours-filters">
          <div className="tours-filters__categories">
            {CAT_DATA_KEYS.map((dataKey, i) => (
              <button
                key={dataKey}
                className={`tours-filters__cat ${activeCat === dataKey ? 'active' : ''}`}
                onClick={() => setActiveCat(dataKey)}
              >
                {catIcons[i]}{' '}
                {t.tours.cats[CAT_I18N_KEYS[i]]}
              </button>
            ))}
          </div>

          <div className="tours-filters__sort">
            <label>{t.tours.sortLabel}</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rating">{t.tours.sortRating}</option>
              <option value="price-asc">{t.tours.sortPriceAsc}</option>
              <option value="price-desc">{t.tours.sortPriceDesc}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="tours-loading">
            <span className="tours-spinner" />
            <p>Загружаем туры...</p>
          </div>
        ) : (
          <>
            <p className="tours-page__count">
              {t.tours.found} <strong>{filtered.length}</strong> {t.tours.foundSuffix}
            </p>

            {filtered.length > 0 ? (
              <div className="tours-grid-page">
                {filtered.map(tour => <TourCard key={tour.id} tour={tour} />)}
              </div>
            ) : (
              <div className="tours-empty">
                <FiSearch size={40} color="var(--gray-400)" />
                <p>
                  {tours.length === 0
                    ? 'Туры ещё не добавлены. Зайдите в админ-панель и создайте первый тур.'
                    : t.tours.empty}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <div className="tours-cta container">
        <div className="tours-cta__card">
          <div>
            <h3>{t.tours.ctaTitle}</h3>
            <p>{t.tours.ctaSubtitle}</p>
          </div>
          <a href="/contact" className="btn-primary">
            {t.tours.ctaBtn} <FiArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}
