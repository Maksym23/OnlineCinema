import { Link } from 'react-router-dom'
import { useT } from '../i18n'

const BASE = import.meta.env.BASE_URL
const POSTERS = ['dune-2.webp', 'house-of-the-dragon.webp', '../hero/odyssey.webp']

/** Банер «Добірка новинок» для каталогу фільмів (за макетом). */
export default function NewHero() {
  const t = useT()
  return (
    <section className="new-hero" aria-label={t('hero.newTitle')}>
      <div className="new-hero-posters" aria-hidden="true">
        {POSTERS.map((p) => (
          <img key={p} src={`${BASE}posters/${p}`} alt="" />
        ))}
      </div>
      <div className="new-hero-copy">
        <span className="new-hero-tag">{t('hero.newTag')}</span>
        <h1 className="new-hero-title">{t('hero.newTitle')}</h1>
        <Link to="/movie/d0" className="btn btn-white">
          {t('hero.cta2')}
        </Link>
      </div>
    </section>
  )
}
