import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useCatalogRowsQuery, useHomeRowsQuery, useSearchQuery } from '../api/baseApi'
import Breadcrumbs from '../components/Breadcrumbs'
import { SearchIcon } from '../components/Icons'
import PosterCard from '../components/PosterCard'
import { ErrorBox } from '../components/QueryState'
import { useT } from '../i18n'
import { useDebounced } from '../lib/hooks'
import { FILTER_GENRES } from '../lib/filters'
import { load, save } from '../lib/storage'
import type { GenreKey, Media, MediaType } from '../types'

type Filter = 'all' | MediaType

const HISTORY_KEY = 'starlicht_search_history'
const HISTORY_MAX = 10

const unique = (items: Media[]) => items.filter((m, i, all) => all.findIndex((x) => x.id === m.id) === i)

export default function Search() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const [params, setParams] = useSearchParams()
  const [text, setText] = useState(params.get('q') ?? '')
  const [filter, setFilter] = useState<Filter>('all')
  const [genre, setGenre] = useState<GenreKey | null>(null)
  const [history, setHistory] = useState<string[]>(() => load<string[]>(HISTORY_KEY, []))
  const q = useDebounced(text.trim(), 300)

  // синхронізуємо рядок пошуку з адресою (щоб результат можна було переслати посиланням)
  useEffect(() => {
    const current = params.get('q') ?? ''
    if (current === q) return
    const next = new URLSearchParams(params)
    if (q) next.set('q', q)
    else next.delete('q')
    setParams(next, { replace: true })
  }, [q, params, setParams])

  const { data, isFetching, isError, refetch } = useSearchQuery({ q, lang }, { skip: q.length === 0 })
  const home = useHomeRowsQuery(lang)
  const movies = useCatalogRowsQuery({ type: 'movie', lang })
  const series = useCatalogRowsQuery({ type: 'series', lang })
  const cartoons = useCatalogRowsQuery({ type: 'cartoon', lang })

  // усі відомі тайтли — для перегляду за жанром без текстового запиту
  const universe = useMemo(
    () => unique([movies.data, series.data, cartoons.data].flatMap((rows) => (rows ?? []).flatMap((r) => r.items))),
    [movies.data, series.data, cartoons.data],
  )
  const suggestions = useMemo(() => unique((home.data ?? []).flatMap((r) => r.items)).slice(0, 9), [home.data])

  const results = useMemo(() => {
    const base = q ? (data ?? []) : genre ? universe : []
    return base.filter((m) => (filter === 'all' || m.type === filter) && (!genre || m.genres.includes(genre)))
  }, [q, data, genre, universe, filter])
  const browsing = q.length > 0 || genre !== null

  const remember = (value: string) => {
    const v = value.trim()
    if (v.length < 2) return
    const next = [v, ...history.filter((h) => h.toLowerCase() !== v.toLowerCase())].slice(0, HISTORY_MAX)
    setHistory(next)
    save(HISTORY_KEY, next)
  }
  const clearHistory = () => {
    setHistory([])
    save(HISTORY_KEY, [])
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    remember(text)
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('search.all') },
    { key: 'movie', label: t('nav.movies') },
    { key: 'series', label: t('nav.series') },
    { key: 'cartoon', label: t('nav.cartoons') },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: t('crumb.home'), to: '/' }, { label: t('search.title') }]} />

      <div className="search-layout">
        <aside className="search-side panel">
          <form className="search-box" role="search" onSubmit={onSubmit}>
            <SearchIcon />
            <input
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => remember(text)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
              autoFocus
            />
          </form>
          <div className="history">
            <div className="history-head">
              <h2>{t('search.history')}</h2>
              {history.length > 0 && (
                <button type="button" className="link small" onClick={clearHistory}>
                  {t('search.clearHistory')}
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="muted small">{t('search.noHistory')}</p>
            ) : (
              <ul>
                {history.map((h) => (
                  <li key={h}>
                    <button type="button" onClick={() => setText(h)}>
                      {h}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section className="search-main">
          <h2 className="bar-title">{t('search.genres')}</h2>
          <div className="genre-grid">
            {FILTER_GENRES.map((g) => (
              <button
                key={g}
                type="button"
                className={genre === g ? 'genre-chip on' : 'genre-chip'}
                aria-pressed={genre === g}
                onClick={() => setGenre(genre === g ? null : g)}
              >
                {t(`genre.${g}` as const)}
              </button>
            ))}
          </div>

          {browsing && (
            <div className="chips">
              {filters.map((f) => (
                <button key={f.key} type="button" className={filter === f.key ? 'chip on' : 'chip'} onClick={() => setFilter(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {!browsing && (
            <>
              <h2 className="bar-title">{t('search.popular')}</h2>
              <div className="grid grid-poster popular">
                {suggestions.slice(0, 3).map((m) => (
                  <PosterCard key={m.id} item={m} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {!browsing && suggestions.length > 3 && (
        <section className="section">
          <div className="grid grid-poster six">
            {suggestions.slice(3).map((m) => (
              <PosterCard key={m.id} item={m} />
            ))}
          </div>
        </section>
      )}

      {q && isError && <ErrorBox onRetry={refetch} />}
      {browsing && !isError && !isFetching && results.length === 0 && (
        <div className="empty">
          <p>{q ? t('search.empty', { q }) : t('filters.noMatches')}</p>
        </div>
      )}
      {browsing && results.length > 0 && (
        <section className="section" aria-live="polite">
          <div className="grid grid-wrap">
            {results.map((m) => (
              <PosterCard key={m.id} item={m} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
