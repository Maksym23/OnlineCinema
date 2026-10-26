import type { CountryKey, GenreKey, Media, MediaType } from '../types'

export type YearKey = 'any' | '2026' | '2025' | '2020-2024' | '2010-2019' | 'older'

export interface Filters {
  type: 'all' | MediaType
  genre: GenreKey | null
  year: YearKey
  country: CountryKey | 'all'
  /** мінімальний рейтинг; 0 — будь-який */
  rating: number
}

export const EMPTY_FILTERS: Filters = { type: 'all', genre: null, year: 'any', country: 'all', rating: 0 }

export const FILTER_GENRES: GenreKey[] = [
  'comedy',
  'drama',
  'romance',
  'action',
  'thriller',
  'horror',
  'scifi',
  'fantasy',
  'crime',
  'adventure',
]

export const YEAR_KEYS: YearKey[] = ['any', '2026', '2025', '2020-2024', '2010-2019', 'older']
export const RATING_STEPS = [0, 7, 8, 9]

function inYear(year: number | undefined, key: YearKey): boolean {
  if (key === 'any') return true
  if (year === undefined) return false
  switch (key) {
    case '2026':
      return year === 2026
    case '2025':
      return year === 2025
    case '2020-2024':
      return year >= 2020 && year <= 2024
    case '2010-2019':
      return year >= 2010 && year <= 2019
    case 'older':
      return year < 2010
  }
}

export function applyFilters(items: Media[], f: Filters): Media[] {
  return items.filter(
    (m) =>
      (f.type === 'all' || m.type === f.type) &&
      (f.genre === null || m.genres.includes(f.genre)) &&
      inYear(m.year, f.year) &&
      (f.country === 'all' || m.country === f.country) &&
      (m.rating ?? 0) >= f.rating,
  )
}

export function activeFilterCount(f: Filters): number {
  return [f.type !== 'all', f.genre !== null, f.year !== 'any', f.country !== 'all', f.rating > 0].filter(Boolean).length
}
