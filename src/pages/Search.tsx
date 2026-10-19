import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useSearchQuery } from '../api/baseApi'
import { SearchIcon } from '../components/Icons'
import PosterCard from '../components/PosterCard'
import { ErrorBox } from '../components/QueryState'
import { useT } from '../i18n'
import { useDebounced } from '../lib/hooks'
import type { MediaType } from '../types'

type Filter = 'all' | MediaType

export default function Search() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const [params, setParams] = useSearchParams()
  const [text, setText] = useState(params.get('q') ?? '')
  const [filter, setFilter] = useState<Filter>('all')
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

  const results = useMemo(() => (data ?? []).filter((m) => filter === 'all' || m.type === filter), [data, filter])

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('search.all') },
    { key: 'movie', label: t('nav.movies') },
    { key: 'series', label: t('nav.series') },
    { key: 'cartoon', label: t('nav.cartoons') },
  ]

  return (
    <>
      <div className="page-head">
        <h1>{t('search.title')}</h1>
      </div>

      <form className="search-box" role="search" onSubmit={(e) => e.preventDefault()}>
        <SearchIcon />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          autoFocus
        />
      </form>

      <div className="chips">
        {filters.map((f) => (
          <button key={f.key} type="button" className={filter === f.key ? 'chip on' : 'chip'} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {!q && (
        <div className="empty">
          <p>{t('search.hint')}</p>
        </div>
      )}
      {q && isError && <ErrorBox onRetry={refetch} />}
      {q && !isError && !isFetching && results.length === 0 && (
        <div className="empty">
          <p>{t('search.empty', { q })}</p>
        </div>
      )}
      {q && results.length > 0 && (
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
