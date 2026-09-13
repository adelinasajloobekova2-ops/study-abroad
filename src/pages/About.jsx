import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import {
  FiActivity, FiStar, FiDroplet, FiCamera, FiArrowRight
} from 'react-icons/fi'
import './About.css'

export default function About() {
  const { t } = useLang()
  const ab = t.about

  const statsData = [
    { value: '500+', label: t.stats.tourists },
    { value: '30+',  label: t.stats.routes   },
    { value: '9',    label: t.stats.years    },
    { value: '4.9★', label: t.stats.rating   },
  ]

  const teamIcons = [
    <FiActivity size={32} />,
    <FiStar size={32} />,
    <FiDroplet size={32} />,
    <FiCamera size={32} />,
  ]

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero__bg">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=80"
            alt="About"
          />
          <div className="about-hero__overlay" />
        </div>
        <div className="container about-hero__content">
          <span className="badge" style={{ background: 'rgba(232,160,32,0.25)', color: '#f8d07a' }}>
            {ab.badge}
          </span>
          <h1 className="about-hero__title">{ab.title}</h1>
          <p className="about-hero__subtitle">{ab.subtitle}</p>
        </div>
      </div>

      {/* Story */}
      <section className="container about-story">
        <div className="about-story__text">
          <span className="badge">{ab.storyBadge}</span>
          <h2 className="section-title" style={{ marginTop: '12px' }}>{ab.storyTitle}</h2>
          <p>{ab.storyP1}</p>
          <p>{ab.storyP2}</p>
          <Link to="/contact" className="btn-primary" style={{ marginTop: '24px' }}>
            {ab.storyCta} <FiArrowRight size={15} />
          </Link>
        </div>
        <div className="about-story__img">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80"
            alt="Mountains"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats-section">
        <div className="container about-stats">
          {statsData.map(s => (
            <div key={s.label} className="about-stat">
              <span className="about-stat__val">{s.value}</span>
              <span className="about-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container about-timeline-section">
        <div className="about-timeline-header">
          <span className="badge">{ab.milestonesBadge}</span>
          <h2 className="section-title" style={{ marginTop: '12px' }}>{ab.milestonesTitle}</h2>
        </div>
        <div className="about-timeline">
          {ab.milestones.map((m, i) => (
            <div key={m.year} className={`about-timeline__item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="about-timeline__year">{m.year}</div>
              <div className="about-timeline__dot" />
              <div className="about-timeline__text">{m.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about-team-section">
        <div className="container">
          <div className="about-team-header">
            <span className="badge">{ab.teamBadge}</span>
            <h2 className="section-title" style={{ marginTop: '12px' }}>{ab.teamTitle}</h2>
            <p className="section-subtitle">{ab.teamSubtitle}</p>
          </div>
          <div className="about-team-grid">
            {ab.team.map((p, i) => (
              <div key={i} className="team-card">
                <div className="team-card__avatar">{teamIcons[i]}</div>
                <h3 className="team-card__name">{p.name}</h3>
                <span className="team-card__role">{p.role}</span>
                <p className="team-card__bio">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
