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

export interface Media {
  id: string
  type: MediaType
  title: string
  titleEn: string
  genres: GenreKey[]
  hue: number
  year?: number
  rating?: number
  /** хвилини; для серіалів — тривалість епізоду */
  duration?: number
  overview?: string
  poster?: string
  backdrop?: string
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
}

export interface Plan {
  id: string
  price: number
  name: string
  features: string[]
  popular?: boolean
}
