import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span>🏔️</span>
              <div>
                <div className="footer__logo-main">Nomad Tour KG</div>
                <div className="footer__logo-sub">Kyrgyzstan</div>
              </div>
            </div>
            <p className="footer__desc">{f.desc}</p>
            <div className="footer__socials">
              <a href="#" aria-label="Instagram" className="footer__social">📷</a>
              <a href="#" aria-label="Telegram"  className="footer__social">✈️</a>
              <a href="#" aria-label="WhatsApp"  className="footer__social">💬</a>
              <a href="#" aria-label="YouTube"   className="footer__social">▶️</a>
            </div>
          </div>

          {/* Directions */}
          <div className="footer__col">
            <h4 className="footer__col-title">{f.directions}</h4>
            <ul className="footer__list">
              <li><Link to="/tours">Иссык-Куль</Link></li>
              <li><Link to="/tours">Ала-Арча</Link></li>
              <li><Link to="/tours">Сары-Челек</Link></li>
              <li><Link to="/tours">Хан-Тенгри</Link></li>
              <li><Link to="/tours">Каракол</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4 className="footer__col-title">{f.company}</h4>
            <ul className="footer__list">
              <li><Link to="/about">{f.links.about}</Link></li>
              <li><Link to="/tours">{f.links.tours}</Link></li>
              <li><Link to="/contact">{f.links.contact}</Link></li>
              <li><Link to="/contact">{f.links.reviews}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">{f.contacts}</h4>
            <ul className="footer__contact-list">
              <li>📍 г. Бишкек, ул. Чуй 123</li>
              <li>📞 +996 700 123 456</li>
              <li>✉️ info@nomadtourkg.com</li>
              <li>{f.hours}</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>{f.rights}</p>
          <p>{f.license}</p>
        </div>
      </div>
    </footer>
  )
}
