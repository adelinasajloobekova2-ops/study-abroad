import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import {
  FaInstagram, FaTelegramPlane, FaWhatsapp, FaYoutube
} from 'react-icons/fa'
import {
  FiMapPin, FiPhone, FiMail, FiClock
} from 'react-icons/fi'
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
              <span className="footer__logo-icon">🏔️</span>
              <div>
                <div className="footer__logo-main">Nomad Tour KG</div>
                <div className="footer__logo-sub">Kyrgyzstan</div>
              </div>
            </div>
            <p className="footer__desc">{f.desc}</p>
            <div className="footer__socials">
              <a href="#" aria-label="Instagram" className="footer__social">
                <FaInstagram size={18} />
              </a>
              <a href="#" aria-label="Telegram" className="footer__social">
                <FaTelegramPlane size={18} />
              </a>
              <a href="#" aria-label="WhatsApp" className="footer__social">
                <FaWhatsapp size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="footer__social">
                <FaYoutube size={18} />
              </a>
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
              <li><Link to="/reviews">{f.links.reviews}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">{f.contacts}</h4>
            <ul className="footer__contact-list">
              <li><FiMapPin size={14} className="footer__contact-icon" /> г. Бишкек, ул. Орозбекова 136</li>
              <li><FiPhone size={14} className="footer__contact-icon" /> +996 0502054704</li>
              <li><FiMail size={14} className="footer__contact-icon" /> info@nomadtourkg.com</li>
              <li><FiClock size={14} className="footer__contact-icon" /> {f.hours}</li>
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
