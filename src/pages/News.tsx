import { useState } from 'react'
import { useAppSelector } from '../app/hooks'
import { useNewsQuery } from '../api/baseApi'
import { ErrorBox, RowsSkeleton } from '../components/QueryState'
import { useT } from '../i18n'
import { artStyle, formatDate } from '../lib/format'

export default function News() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const { data, isLoading, isError, refetch } = useNewsQuery(lang)
  const [open, setOpen] = useState<string | null>(null)

  return (
    <>
      <div className="page-head">
        <h1>{t('news.title')}</h1>
      </div>

      {isLoading && <RowsSkeleton rows={1} />}
      {isError && <ErrorBox onRetry={refetch} />}

      <div className="news-grid">
        {data?.map((n) => {
          const expanded = open === n.id
          return (
            <article key={n.id} className="news-card">
              <div className="news-art" style={artStyle(n.hue)} aria-hidden="true" />
              <div className="news-body">
                <time dateTime={n.date} className="muted small">
                  {formatDate(n.date, lang)}
                </time>
                <h2>{n.title}</h2>
                <p className={expanded ? '' : 'clamp-2'}>{n.text}</p>
                <button
                  type="button"
                  className="link"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : n.id)}
                >
                  {expanded ? t('news.collapse') : t('news.expand')}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
