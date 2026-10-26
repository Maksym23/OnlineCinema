import { useState } from 'react'
import { useT } from '../i18n'
import type { TKey } from '../i18n'
import { COUNTRIES } from '../data/details'
import { EMPTY_FILTERS, FILTER_GENRES, RATING_STEPS, YEAR_KEYS } from '../lib/filters'
import type { Filters, YearKey } from '../lib/filters'
import type { GenreKey, MediaType } from '../types'
import Modal from './Modal'

interface Props {
  value: Filters
  onApply: (f: Filters) => void
  onClose: () => void
}

const TYPES: { key: Filters['type']; label: TKey }[] = [
  { key: 'all', label: 'filters.any' },
  { key: 'movie' satisfies MediaType, label: 'nav.movies' },
  { key: 'series' satisfies MediaType, label: 'nav.series' },
  { key: 'cartoon' satisfies MediaType, label: 'nav.cartoons' },
]

/** Назви жанрів у фільтрах — як у макеті. */
const GENRE_LABEL: Partial<Record<GenreKey, TKey>> = {
  romance: 'filters.g.romance',
  action: 'filters.g.action',
  crime: 'filters.g.crime',
}

const yearLabel = (k: YearKey, t: ReturnType<typeof useT>) =>
  k === 'any' ? t('filters.anyYear') : k === 'older' ? t('filters.older') : k.replace('-', '–')

/** Монтуйте лише коли відкрито — чернетка ініціалізується з поточних фільтрів. */
export default function FiltersModal({ value, onApply, onClose }: Props) {
  const t = useT()
  const [draft, setDraft] = useState<Filters>(value)
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setDraft((d) => ({ ...d, [k]: v }))

  const chip = (on: boolean, label: string, onClick: () => void) => (
    <button key={label} type="button" className={on ? 'chip on' : 'chip'} aria-pressed={on} onClick={onClick}>
      {label}
    </button>
  )

  return (
    <Modal open onClose={onClose} title={t('filters.title')} className="filters">
      <div className="filter-group">
        <h3>{t('filters.type')}</h3>
        <div className="chips">{TYPES.map((x) => chip(draft.type === x.key, t(x.label), () => set('type', x.key)))}</div>
      </div>
      <div className="filter-group">
        <h3>{t('filters.genre')}</h3>
        <div className="chips">
          {FILTER_GENRES.map((g) =>
            chip(draft.genre === g, t(GENRE_LABEL[g] ?? (`genre.${g}` as const)), () => set('genre', draft.genre === g ? null : g)),
          )}
        </div>
      </div>
      <div className="filter-group">
        <h3>{t('filters.year')}</h3>
        <div className="chips">{YEAR_KEYS.map((y) => chip(draft.year === y, yearLabel(y, t), () => set('year', y)))}</div>
      </div>
      <div className="filter-group">
        <h3>{t('filters.country')}</h3>
        <div className="chips">
          {chip(draft.country === 'all', t('filters.any'), () => set('country', 'all'))}
          {COUNTRIES.map((c) => chip(draft.country === c, t(`country.${c}` as const), () => set('country', c)))}
        </div>
      </div>
      <div className="filter-group">
        <h3>{t('filters.rating')}</h3>
        <div className="filter-foot">
          <div className="chips">
            {RATING_STEPS.map((r) => chip(draft.rating === r, r === 0 ? t('filters.anyRating') : `${r}+`, () => set('rating', r)))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-dark btn-sm" onClick={() => setDraft(EMPTY_FILTERS)}>
              {t('filters.reset')}
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                onApply(draft)
                onClose()
              }}
            >
              {t('filters.apply')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
