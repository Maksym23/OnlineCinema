export type Lang = 'uk' | 'en'
export type Theme = 'dark' | 'light'
export type MediaType = 'movie' | 'series' | 'cartoon'

export type GenreKey =
  | 'drama'
  | 'action'
  | 'thriller'
  | 'scifi'
  | 'comedy'
  | 'romance'
  | 'horror'
  | 'adventure'
  | 'documentary'
  | 'animation'
  | 'family'
  | 'fantasy'
  | 'crime'
  | 'sport'

export type CountryKey = 'ua' | 'us' | 'gb' | 'fr' | 'kr'

export interface Media {
  id: string
  type: MediaType
  title: string
  titleEn: string
  /** українська назва — для пошуку зображень (якщо відома) */
  titleUk?: string
  genres: GenreKey[]
  hue: number
  year?: number
  country?: CountryKey
  rating?: number
  /** хвилини; для серіалів — тривалість епізоду */
  duration?: number
  overview?: string
  poster?: string
  backdrop?: string
  /** адреса відео трейлера (інакше — демо-відео) */
  trailer?: string
  /** додаткові трейлери (перший збігається з trailer) */
  trailers?: string[]
}

export interface MediaRow {
  key: string
  title: string
  items: Media[]
  to?: string
  variant?: 'poster' | 'wide'
}

export interface NewsItem {
  id: string
  date: string
  title: string
  text: string
  hue: number
  image?: string
}

export interface Plan {
  id: string
  price: number
  name: string
  features: string[]
  popular?: boolean
  /** великі цифри в картці тарифу */
  highlights: { value: string; label: string }[]
}
