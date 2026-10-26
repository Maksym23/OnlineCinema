import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { demoIndexOf } from '../api'
import { useCatalogRowsQuery, useDetailsQuery } from '../api/baseApi'
import Breadcrumbs from '../components/Breadcrumbs'
import { BookmarkIcon, ChevronRightIcon, PlayIcon } from '../components/Icons'
import Modal from '../components/Modal'
import PosterCard from '../components/PosterCard'
import { ErrorBox } from '../components/QueryState'
import { ageRating, castFor, episodesOf, seasonCount } from '../data/details'
import { toggleFavorite } from '../features/favoritesSlice'
import { useT } from '../i18n'
import { sampleVideoFor, TYPE_TO_SLUG } from '../lib/catalog'
import { artStyle, formatDuration, formatTime, hash } from '../lib/format'
import { useMediaImage } from '../lib/images'
import type { Media } from '../types'

export default function MovieDetails() {
  const { id = '' } = useParams()
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const { data, isLoading, isError, refetch } = useDetailsQuery({ id, lang })

  if (isLoading) return <div className="skeleton details-skeleton" aria-hidden="true" />
  if (isError) return <ErrorBox onRetry={refetch} />
  if (!data)
    return (
      <div className="empty">
        <h1>{t('details.notFound')}</h1>
        <Link to="/" className="btn btn-sm">
          {t('common.home')}
        </Link>
      </div>
    )
  // key — щоб при переході між схожими фільмами стан (сезон, трейлер) скидався
  return <Details key={data.id} media={data} />
}

const EPISODES_PAGE = 8

function Details({ media }: { media: Media }) {
  const t = useT()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const lang = useAppSelector((s) => s.ui.lang)
  const user = useAppSelector((s) => s.auth.user)
  const isFav = useAppSelector((s) => s.favorites.ids.includes(media.id))
  const saved = useAppSelector((s) => s.history.items.find((i) => i.id === media.id))
  const similar = useCatalogRowsQuery({ type: media.type, lang })
  const [season, setSeason] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [trailer, setTrailer] = useState(false)
  const [trailerN, setTrailerN] = useState(0)

  const isSeries = media.type === 'series'
  const seasons = seasonCount(media)
  const episodes = isSeries ? episodesOf(media, season) : []
  const cast = castFor(media, lang)
  const index = media.id.startsWith('d') ? demoIndexOf(media.id) : hash(media.id)
  const art = useMediaImage(media)
  const resumeAt = saved && saved.position > 5 && saved.position < saved.duration - 10 ? saved.position : 0

  const related = (similar.data ?? [])
    .flatMap((r) => r.items)
    .filter((m, i, all) => m.id !== media.id && all.findIndex((x) => x.id === m.id) === i)
    .filter((m) => m.genres.some((g) => media.genres.includes(g)))
    .slice(0, 5)

  const requireAuth = (action: () => void) => {
    if (!user) navigate('/login', { state: { from: location } })
    else action()
  }

  const watchLabel = !user
    ? t('details.signInToWatch')
    : resumeAt
      ? t('details.continue', { time: formatTime(resumeAt) })
      : t(media.type === 'series' ? 'details.watchSeries' : media.type === 'cartoon' ? 'details.watchCartoon' : 'details.watchMovie')

  const genreText = media.genres.map((g) => t(`genre.${g}` as const).toLowerCase()).join(', ')
  const image = media.backdrop ?? art
  // зображення поверх градієнта: якщо воно не завантажиться — лишається градієнт
  const bg = image
    ? { ['--shade' as string]: ['Одісея', 'Гра Престолів', 'Стихії'].includes(media.titleUk ?? '') ? 0.3 : 0.85, background: `url("${image}") center ${media.titleUk === 'Одісея' ? '0%' : '22%'} / cover no-repeat, ${artStyle(media.hue).background as string}` }
    : artStyle(media.hue)
  const typeSlug = TYPE_TO_SLUG[media.type]
  const typeLabel = t(media.type === 'movie' ? 'nav.movies' : media.type === 'series' ? 'nav.series' : 'nav.cartoons')

  return (
    <article className="dx">
      <Breadcrumbs
        items={[{ label: t('crumb.home'), to: '/' }, { label: typeLabel, to: `/catalog/${typeSlug}` }, { label: media.title }]}
      />

      <div className="dx-hero" style={bg}>
        <div className="dx-shade" />
        <div className="dx-info">
          <h1>
            {media.title} <span className="age-badge">{ageRating(media)}</span>
          </h1>
          <ul className="dx-meta">
            <li>{genreText}</li>
            {media.year && <li>{media.year}</li>}
            {isSeries && seasons > 0 && <li>{t('details.seasonsShort', { n: seasons })}</li>}
            {media.duration ? <li>{formatDuration(media.duration, lang)}</li> : null}
          </ul>
          <div className="dx-actions">
            <button
              type="button"
              className={isFav ? 'icon-square on' : 'icon-square'}
              aria-pressed={isFav}
              aria-label={isFav ? t('card.removeFavorite') : t('card.addFavorite')}
              title={isFav ? t('card.removeFavorite') : t('card.addFavorite')}
              onClick={() => requireAuth(() => dispatch(toggleFavorite(media.id)))}
            >
              <BookmarkIcon size={18} filled={isFav} />
            </button>
            <button type="button" className="btn" onClick={() => requireAuth(() => navigate(`/watch/${media.id}`))}>
              <PlayIcon size={15} /> {watchLabel}
            </button>
            <button type="button" className="btn btn-white" onClick={() => setTrailer(true)}>
              {t('details.trailer')}
            </button>
          </div>
        </div>
      </div>

      <section className="dx-section">
        <h2>{t('details.description')}</h2>
        <p className="overview">{media.overview ?? t('details.noOverview')}</p>
      </section>

      {isSeries && (
        <section className="dx-section">
          <h2>{t('details.seasonsEpisodes')}</h2>
          <div className="season-tabs" role="tablist" aria-label={t('details.seasonsEpisodes')}>
            {Array.from({ length: seasons }, (_, k) => k + 1).map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={season === n}
                className={season === n ? 'chip on' : 'chip'}
                onClick={() => {
                  setSeason(n)
                  setShowAll(false)
                }}
              >
                {t('details.season', { n })}
              </button>
            ))}
          </div>
          <ul className="episodes">
            {(showAll ? episodes : episodes.slice(0, EPISODES_PAGE)).map((ep) => (
              <li key={ep.n}>
                <Link
                  to={`/watch/${media.id}?s=${season}&e=${ep.n}`}
                  className="episode"
                >
                  <span className="episode-art" style={artStyle((media.hue + ep.n * 23 + season * 40) % 360)}>
                    <PlayIcon size={22} />
                  </span>
                  <span className="episode-title">{t('details.episode', { n: ep.n })}</span>
                  <span className="muted small">{t('common.minutes', { n: ep.minutes })}</span>
                </Link>
              </li>
            ))}
          </ul>
          {!showAll && episodes.length > EPISODES_PAGE && (
            <div className="center-row">
              <button type="button" className="btn" onClick={() => setShowAll(true)}>
                {t('details.showMore')}
              </button>
            </div>
          )}
        </section>
      )}

      {cast.length > 0 && (
      <section className="dx-section">
        <h2>{t(media.type === 'cartoon' ? 'details.voice' : 'details.cast')}</h2>
        <ul className="cast">
          {cast.map((p) => (
            <li key={p.name}>
              <span className="cast-photo" style={artStyle(p.hue)} aria-hidden="true">
                {p.photo ? (
                  <img src={p.photo} alt="" loading="lazy" />
                ) : (
                  p.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                )}
              </span>
              <span>{p.name}</span>
              <span className="cast-role">{t(media.type === 'cartoon' ? 'details.roleVoice' : 'details.roleActor')}</span>
            </li>
          ))}
        </ul>
      </section>
      )}

      {related.length > 0 && (
        <section className="dx-section">
          <div className="section-head">
            <h2>{t('details.similar')}</h2>
            <Link to={`/catalog/${typeSlug}`} className="pill">
              {t('common.all')}
              <ChevronRightIcon size={14} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="grid grid-poster">
            {related.map((m) => (
              <PosterCard key={m.id} item={m} />
            ))}
          </div>
        </section>
      )}

      <Modal open={trailer} onClose={() => setTrailer(false)} title={t('details.trailerTitle', { title: media.title })} className="modal-wide">
        {media.trailers && media.trailers.length > 1 && (
          <div className="trailer-tabs" role="tablist">
            {media.trailers.map((_, i) => (
              <button key={i} type="button" role="tab" aria-selected={i === trailerN} className={i === trailerN ? 'chip on' : 'chip'} onClick={() => setTrailerN(i)}>
                {t('details.trailerN', { n: i + 1 })}
              </button>
            ))}
          </div>
        )}
        <video
          key={trailerN}
          className="trailer"
          src={media.trailers?.[trailerN] ?? media.trailer ?? sampleVideoFor(index + 1)}
          poster={image ?? undefined}
          controls
          autoPlay
          playsInline
        />
      </Modal>
    </article>
  )
}
