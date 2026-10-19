import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useCatalogRowsQuery, useDetailsQuery } from '../api/baseApi'
import { HeartIcon, PlayIcon, StarIcon } from '../components/Icons'
import PosterCard from '../components/PosterCard'
import { ErrorBox } from '../components/QueryState'
import { toggleFavorite } from '../features/favoritesSlice'
import { useT } from '../i18n'
import { artStyle, formatTime } from '../lib/format'
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
  return <Details media={data} />
}

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

  const bg = media.backdrop ? { backgroundImage: `url(${media.backdrop})` } : artStyle(media.hue)

  return (
    <article className="details">
      <div className="details-hero" style={bg}>
        <div className="details-shade" />
        <div className="details-body">
          <div className="details-poster" style={artStyle(media.hue)}>
            {media.poster ? <img src={media.poster} alt="" /> : <span className="card-art-text">{media.title}</span>}
          </div>
          <div className="details-info">
            <p className="eyebrow">{t(`type.${media.type}` as const)}</p>
            <h1>{media.title}</h1>
            {media.titleEn && media.titleEn !== media.title && (
              <p className="muted">
                {t('details.originalTitle')}: {media.titleEn}
              </p>
            )}
            <ul className="meta">
              {media.year && <li>{media.year}</li>}
              {media.rating !== undefined && (
                <li className="rating">
                  <StarIcon size={14} /> {media.rating}
                </li>
              )}
              {media.duration ? <li>{t('common.minutes', { n: media.duration })}</li> : null}
              {media.genres.map((g) => (
                <li key={g} className="tag">
                  {t(`genre.${g}` as const)}
                </li>
              ))}
            </ul>
            <p className="overview">{media.overview ?? t('details.noOverview')}</p>

            <div className="actions">
              <button
                type="button"
                className="btn"
                onClick={() => requireAuth(() => navigate(`/watch/${media.id}`))}
              >
                <PlayIcon size={16} />
                {!user
                  ? t('details.signInToWatch')
                  : resumeAt
                    ? t('details.continue', { time: formatTime(resumeAt) })
                    : t('details.watch')}
              </button>
              <button
                type="button"
                className={isFav ? 'btn btn-outline on' : 'btn btn-outline'}
                onClick={() => requireAuth(() => dispatch(toggleFavorite(media.id)))}
                aria-pressed={isFav}
              >
                <HeartIcon size={16} filled={isFav} />
                {isFav ? t('card.removeFavorite') : t('card.addFavorite')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>{t('details.similar')}</h2>
          </div>
          <div className="grid grid-poster">
            {related.map((m) => (
              <PosterCard key={m.id} item={m} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
