import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { demoIndexOf } from '../api'
import { useDetailsQuery } from '../api/baseApi'
import { ArrowLeftIcon } from '../components/Icons'
import { ErrorBox } from '../components/QueryState'
import VideoPlayer from '../components/VideoPlayer'
import { useT } from '../i18n'
import { episodesOf, seasonCount } from '../data/details'
import { clamp, hash } from '../lib/format'
import { useMediaImage } from '../lib/images'
import { sampleVideoFor } from '../lib/catalog'

export default function Watch() {
  const { id = '' } = useParams()
  // key — щоб при переході між фільмами плеєр створювався заново
  return <WatchInner key={id} id={id} />
}

function WatchInner({ id }: { id: string }) {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const { data, isLoading, isError, refetch } = useDetailsQuery({ id, lang })
  const [params, setParams] = useSearchParams()
  const art = useMediaImage(data)
  // збережену позицію відновлюємо лише для серії, з якої відкрили сторінку
  const [initialEp] = useState(() => `${Number(params.get('s')) || 1}-${Number(params.get('e')) || 1}`)

  // позицію для продовження беремо один раз — при відкритті сторінки
  const saved = useAppSelector((s) => s.history.items.find((i) => i.id === id))
  const [startAt] = useState(() =>
    saved && saved.position > 5 && saved.position < saved.duration - 10 ? saved.position : 0,
  )

  if (isLoading) return <div className="skeleton player-skeleton" aria-hidden="true" />
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

  const index = id.startsWith('d') ? demoIndexOf(id) : hash(id)
  const isSeries = data.type === 'series'
  const seasons = seasonCount(data)
  const season = clamp(Number(params.get('s')) || 1, 1, Math.max(seasons, 1))
  const episodes = isSeries ? episodesOf(data, season) : []
  const episode = clamp(Number(params.get('e')) || 1, 1, Math.max(episodes.length, 1))
  const pick = (s: number, e: number) => setParams({ s: String(s), e: String(e) }, { replace: true })

  return (
    <>
      <div className="page-head watch-head">
        <Link to={`/movie/${id}`} className="back">
          <ArrowLeftIcon size={18} /> {t('common.back')}
        </Link>
        <h1>{data.title}</h1>
      </div>
      <div className="player-shell">
        {isSeries && (
          <div className="episode-picker">
            <select
              value={season}
              aria-label={t('details.season', { n: '' }).trim()}
              onChange={(e) => pick(Number(e.target.value), 1)}
            >
              {Array.from({ length: seasons }, (_, k) => k + 1).map((n) => (
                <option key={n} value={n}>
                  {t('details.season', { n })}
                </option>
              ))}
            </select>
            <select
              value={episode}
              aria-label={t('details.episode', { n: '' }).trim()}
              onChange={(e) => pick(season, Number(e.target.value))}
            >
              {episodes.map((ep) => (
                <option key={ep.n} value={ep.n}>
                  {t('details.episode', { n: ep.n })}
                </option>
              ))}
            </select>
          </div>
        )}
        <VideoPlayer
          key={`${season}-${episode}`}
          src={sampleVideoFor(index + season + episode)}
          mediaId={id}
          title={isSeries ? `${data.title} — ${t('details.season', { n: season })}, ${t('details.episode', { n: episode })}` : data.title}
          poster={data.backdrop ?? art ?? undefined}
          startAt={isSeries && `${season}-${episode}` !== initialEp ? 0 : startAt}
        />
      </div>
      <p className="muted watch-note">{t('player.demoNote')}</p>
    </>
  )
}
