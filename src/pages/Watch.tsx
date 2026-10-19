import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { demoIndexOf } from '../api'
import { useDetailsQuery } from '../api/baseApi'
import { ArrowLeftIcon } from '../components/Icons'
import { ErrorBox } from '../components/QueryState'
import VideoPlayer from '../components/VideoPlayer'
import { useT } from '../i18n'
import { hash } from '../lib/format'
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

  return (
    <>
      <div className="page-head watch-head">
        <Link to={`/movie/${id}`} className="back">
          <ArrowLeftIcon size={18} /> {t('common.back')}
        </Link>
        <h1>{data.title}</h1>
      </div>
      <VideoPlayer
        src={sampleVideoFor(index)}
        mediaId={id}
        title={data.title}
        poster={data.backdrop}
        startAt={startAt}
      />
      <p className="muted watch-note">{t('player.demoNote')}</p>
    </>
  )
}
