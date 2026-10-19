import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import {
  FacebookIcon,
  HelpIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  ThreadsIcon,
  TikTokIcon,
} from './Icons'
import Logo from './Logo'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const t = useT()
  const [brand, ...rest] = t('footer.aboutText').split(' + ')

  return (
    <footer className="footer">
      <div className="container">
        <Logo />
        <div className="footer-grid">
          <div>
            <h3>{t('footer.about')}</h3>
            <p className="footer-about">
              <span className="accent">{brand} +</span> {rest.join(' + ')}
            </p>
            <h3 className="mt">{t('footer.contacts')}</h3>
            <ul className="footer-contacts">
              <li>
                <PhoneIcon size={16} className="accent" />
                <a href="tel:+380441234567">+380 44 123 45 67</a>
              </li>
              <li>
                <MailIcon size={16} className="accent" />
                <a href="mailto:hello@starlicht.com">hello@starlicht.com</a>
              </li>
              <li>
                <HelpIcon size={16} className="accent" />
                <span>{t('footer.faq')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3>{t('footer.nav')}</h3>
            <ul className="footer-links">
              <li>
                <Link to="/catalog/movies">{t('nav.movies')}</Link>
              </li>
              <li>
                <Link to="/catalog/series">{t('nav.series')}</Link>
              </li>
              <li>
                <Link to="/catalog/cartoons">{t('nav.cartoons')}</Link>
              </li>
              <li>
                <Link to="/subscription">{t('nav.plans')}</Link>
              </li>
              <li>
                <Link to="/news">{t('nav.news')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>{t('footer.legal')}</h3>
            <ul className="footer-links">
              <li>
                <span>{t('footer.terms')}</span>
              </li>
              <li>
                <span>{t('footer.privacy')}</span>
              </li>
              <li>
                <span>{t('footer.refund')}</span>
              </li>
            </ul>
            <ul className="socials">
              <li>
                <FacebookIcon size={16} /> Facebook
              </li>
              <li>
                <ThreadsIcon size={16} /> Threads
              </li>
              <li>
                <InstagramIcon size={16} /> Instagram
              </li>
              <li>
                <TikTokIcon size={16} /> Tik Tok
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-line" />
        <p className="copyright">
          © {YEAR} STARLICHT. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
