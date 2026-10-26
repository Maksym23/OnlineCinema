import { Link } from 'react-router-dom'
import { useT } from '../i18n'

/** Банер каталогу серіалів (за макетом). */
export default function SpiderHero() {
  const t = useT()
  return (
    <section className="spider-hero" aria-label={t('hero.spiderTitle')}>
      <img className="spider-art" src={`${import.meta.env.BASE_URL}hero/spiderman.webp`} alt="" fetchPriority="high" />
      <div className="spider-copy">
        <h1 className="spider-title">{t('hero.spiderTitle')}</h1>
        <span className="spider-meta">16+ · 2026 · {t('genre.action')}</span>
        <Link to="/movie/d3" className="btn btn-white">
          {t('hero.cta2')}
        </Link>
      </div>
    </section>
  )
}
