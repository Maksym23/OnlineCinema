import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useMediaListQuery } from '../api/baseApi'
import Breadcrumbs from '../components/Breadcrumbs'
import FiltersModal from '../components/FiltersModal'
import { HeartIcon } from '../components/Icons'
import PosterCard from '../components/PosterCard'
import { ErrorBox, RowsSkeleton } from '../components/QueryState'
import { useT } from '../i18n'
import type { TKey } from '../i18n'
import { EMPTY_FILTERS, activeFilterCount, applyFilters } from '../lib/filters'
import type { Filters } from '../lib/filters'
import type { MediaType } from '../types'

const TABS: { type: MediaType; label: TKey }[] = [
  { type: 'movie', label: 'nav.movies' },
  { type: 'series', label: 'nav.series' },
  { type: 'cartoon', label: 'nav.cartoons' },
]

export default function Favorites() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const ids = useAppSelector((s) => s.favorites.ids)
  const { data, isLoading, isError, refetch } = useMediaListQuery({ ids, lang }, { skip: ids.length === 0 })
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [open, setOpen] = useState(false)

  // показуємо лише те, що досі в обраному (список реагує на видалення миттєво)
  const items = useMemo(() => (data ?? []).filter((m) => ids.includes(m.id)), [data, ids])
  const shown = useMemo(() => applyFilters(items, filters), [items, filters])
  const count = activeFilterCount(filters)

  return (
    <>
      <Breadcrumbs items={[{ label: t('crumb.home'), to: '/' }, { label: t('favorites.title') }]} />
      <div className="page-head">
        <h1>{t('favorites.title')}</h1>
      </div>

      {ids.length === 0 ? (
        <div className="empty">
          <HeartIcon size={40} />
          <h2>{t('favorites.empty')}</h2>
          <p>{t('favorites.emptyHint')}</p>
          <Link to="/catalog/movies" className="btn btn-sm">
            {t('favorites.browse')}
          </Link>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <div className="chips tabs" role="group" aria-label={t('filters.type')}>
              {TABS.map((x) => (
                <button
                  key={x.type}
                  type="button"
                  className={filters.type === x.type ? 'chip chip-white on' : 'chip chip-white'}
                  aria-pressed={filters.type === x.type}
                  onClick={() => setFilters((f) => ({ ...f, type: f.type === x.type ? 'all' : x.type }))}
                >
                  {t(x.label)}
                </button>
              ))}
            </div>
            <button type="button" className="chip chip-white" onClick={() => setOpen(true)} aria-haspopup="dialog">
              {t('filters.title')}
              {count > 0 && <span className="count">{count}</span>}
            </button>
          </div>

          {isLoading && <RowsSkeleton rows={1} />}
          {isError && <ErrorBox onRetry={refetch} />}
          {!isLoading && shown.length === 0 && items.length > 0 && (
            <div className="empty">
              <p>{t('filters.noMatches')}</p>
              <button type="button" className="btn btn-sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                {t('filters.reset')}
              </button>
            </div>
          )}
          {shown.length > 0 && (
            <div className="grid grid-wrap">
              {shown.map((m) => (
                <PosterCard key={m.id} item={m} />
              ))}
            </div>
          )}
        </>
      )}

      {open && <FiltersModal value={filters} onApply={setFilters} onClose={() => setOpen(false)} />}
    </>
  )
}
