import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useMediaListQuery } from '../api/baseApi'
import { PlayIcon, TrashIcon } from '../components/Icons'
import { ErrorBox, RowsSkeleton } from '../components/QueryState'
import { clearHistory, removeFromHistory } from '../features/historySlice'
import { useT } from '../i18n'
import { artStyle, formatDate, formatTime } from '../lib/format'

export default function History() {
  const t = useT()
  const dispatch = useAppDispatch()
  const lang = useAppSelector((s) => s.ui.lang)
  const entries = useAppSelector((s) => s.history.items)
  const ids = entries.map((e) => e.id)
  const { data, isLoading, isError, refetch } = useMediaListQuery({ ids, lang }, { skip: ids.length === 0 })
  const byId = new Map((data ?? []).map((m) => [m.id, m]))

  return (
    <>
      <div className="page-head page-head-row">
        <h1>{t('history.title')}</h1>
        {entries.length > 0 && (
          <button type="button" className="btn btn-outline btn-sm" onClick={() => dispatch(clearHistory())}>
            <TrashIcon size={16} />
            {t('history.clear')}
          </button>
        )}
      </div>

      {entries.length === 0 && (
        <div className="empty">
          <h2>{t('history.empty')}</h2>
          <p>{t('history.emptyHint')}</p>
          <Link to="/catalog/movies" className="btn btn-sm">
            {t('favorites.browse')}
          </Link>
        </div>
      )}
      {entries.length > 0 && isLoading && <RowsSkeleton rows={1} />}
      {isError && <ErrorBox onRetry={refetch} />}

      <ul className="history-list">
        {entries.map((e) => {
          const m = byId.get(e.id)
          if (!m) return null
          const percent = e.duration ? Math.min(100, Math.round((e.position / e.duration) * 100)) : 0
          return (
            <li key={e.id} className="history-item">
              <Link to={`/movie/${m.id}`} className="history-thumb" style={artStyle(m.hue)} aria-hidden="true" tabIndex={-1}>
                {m.poster ? <img src={m.poster} alt="" loading="lazy" /> : <span className="card-art-text">{m.title}</span>}
              </Link>
              <div className="history-info">
                <Link to={`/movie/${m.id}`} className="history-title">
                  {m.title}
                </Link>
                <p className="muted">
                  {formatDate(new Date(e.watchedAt).toISOString(), lang)} · {formatTime(e.position)} / {formatTime(e.duration)}
                </p>
                <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p className="muted small">{t('history.watched', { percent })}</p>
              </div>
              <div className="history-actions">
                <Link to={`/watch/${m.id}`} className="btn btn-sm">
                  <PlayIcon size={14} />
                  {t('history.continue')}
                </Link>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => dispatch(removeFromHistory(m.id))}
                  aria-label={t('history.remove')}
                  title={t('history.remove')}
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
