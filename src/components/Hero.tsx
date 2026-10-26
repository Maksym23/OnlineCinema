import { useCallback, useEffect, useState } from 'react'
import type { TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, SparkleIcon } from './Icons'

const SLIDES = [
  { hue: 300, to: '/movie/d12', cls: 'slide-a', odyssey: true },
  { hue: 215, to: '/catalog/cartoons', cls: 'slide-b', image: 'cartoons.webp' },
  { hue: 175, to: '/sport', cls: 'slide-c', image: 'sport.webp' },
]

export default function Hero() {
  const t = useT()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [touchX, setTouchX] = useState<number | null>(null)

  const go = useCallback((n: number) => setIndex((n + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [paused])

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    setTouchX(null)
  }

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      {SLIDES.map((s, i) =>
        s.image ? (
          <Link
            key={s.cls}
            to={s.to}
            className={`slide slide-image${i === index ? ' active' : ''}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <img src={`${import.meta.env.BASE_URL}hero/${s.image}`} alt={`${t('hero.line1')} ${t('hero.line2')}`} />
          </Link>
        ) : s.odyssey ? (
          <div
            key={s.cls}
            className={`slide slide-odyssey${i === index ? ' active' : ''}`}
            aria-hidden={i !== index}
          >
            <img
              className="odyssey-art"
              src={`${import.meta.env.BASE_URL}hero/odyssey.webp`}
              alt=""
              fetchPriority="high"
            />
            <div className="odyssey-copy">
              <span className="odyssey-tag">{t('hero.odysseyNew')}</span>
              <h2 className="odyssey-title">{t('hero.odysseyTitle')}</h2>
              <span className="odyssey-meta">18+ · 2026 · {t('genre.scifi')}</span>
              <Link to={s.to} className="btn btn-white" tabIndex={i === index ? 0 : -1}>
                {t('hero.cta2')}
              </Link>
            </div>
          </div>
        ) : (
        <div
          key={s.cls}
          className={`slide ${s.cls}${i === index ? ' active' : ''}`}
          aria-hidden={i !== index}
          style={{ ['--h' as string]: s.hue }}
        >
          <SparkleIcon className="spark spark-1" size={28} />
          <SparkleIcon className="spark spark-2" size={16} />
          <SparkleIcon className="spark spark-3" size={22} />
          <div className="hero-orb" />

          <div className="hero-copy">
            <span className="hero-brand">
              STARLICHT<sup>+</sup>
            </span>
            <h1>
              <span className="hero-line1">{t('hero.line1')}</span>
              <span className="hero-line2">{t('hero.line2')}</span>
            </h1>
            <p>{t('hero.sub')}</p>
            <ul className="hero-feats">
              <li>{t('hero.movies')}</li>
              <li>{t('hero.series')}</li>
              <li>{t('hero.cartoons')}</li>
              <li>{t('hero.noAds')}</li>
            </ul>
            <Link to={s.to} className="btn" tabIndex={i === index ? 0 : -1}>
              <PlayIcon size={16} />
              {t('hero.cta')}
            </Link>
          </div>

          <ul className="hero-devices" aria-hidden="true">
            <li>{t('hero.phone')}</li>
            <li>{t('hero.tablet')}</li>
            <li>{t('hero.laptop')}</li>
            <li>{t('hero.tv')}</li>
          </ul>
        </div>
        ),
      )}

      <button type="button" className="hero-arrow left" onClick={() => go(index - 1)} aria-label={t('hero.prev')}>
        <ChevronLeftIcon />
      </button>
      <button type="button" className="hero-arrow right" onClick={() => go(index + 1)} aria-label={t('hero.next')}>
        <ChevronRightIcon />
      </button>

      <div className="hero-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.cls}
            type="button"
            className={i === index ? 'dot active' : 'dot'}
            onClick={() => go(i)}
            aria-label={t('hero.goto', { n: i + 1 })}
            aria-current={i === index}
          />
        ))}
      </div>
    </section>
  )
}
