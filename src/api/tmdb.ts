import type { GenreKey, Lang, Media, MediaRow, MediaType } from '../types'
import { TYPE_TO_SLUG } from '../lib/catalog'
import { normTitle } from '../lib/format'

/**
 * Клієнт TMDB (https://developer.themoviedb.org). Вмикається, якщо задано VITE_TMDB_KEY.
 * Це продукт TMDB — «This product uses the TMDB API but is not endorsed or certified by TMDB».
 */
const KEY = import.meta.env.VITE_TMDB_KEY as string | undefined
const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

export const tmdbEnabled = Boolean(KEY)

interface RawItem {
  id: number
  media_type?: string
  title?: string
  name?: string
  original_title?: string
  original_name?: string
  release_date?: string
  first_air_date?: string
  vote_average?: number
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
  runtime?: number
  episode_run_time?: number[]
}

interface RawList {
  results: RawItem[]
}

const GENRE_MAP: Record<number, GenreKey> = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'crime',
  99: 'documentary',
  18: 'drama',
  10751: 'family',
  14: 'fantasy',
  27: 'horror',
  10749: 'romance',
  878: 'scifi',
  53: 'thriller',
  10759: 'action',
  10765: 'scifi',
  10762: 'family',
  9648: 'thriller',
  10768: 'drama',
}

async function get<T>(path: string, lang: Lang, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE + path)
  url.searchParams.set('api_key', KEY ?? '')
  url.searchParams.set('language', lang === 'uk' ? 'uk-UA' : 'en-US')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB ${res.status}`)
  return (await res.json()) as T
}

function toMedia(raw: RawItem, kind: 'movie' | 'tv'): Media {
  const ids = raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? []
  const genres = [...new Set(ids.map((i) => GENRE_MAP[i]).filter((g): g is GenreKey => Boolean(g)))]
  const type: MediaType = ids.includes(16) ? 'cartoon' : kind === 'tv' ? 'series' : 'movie'
  const date = raw.release_date ?? raw.first_air_date ?? ''
  return {
    id: `tmdb-${kind}-${raw.id}`,
    type,
    title: raw.title ?? raw.name ?? '',
    titleEn: raw.original_title ?? raw.original_name ?? '',
    genres,
    hue: (raw.id * 47) % 360,
    year: date ? Number(date.slice(0, 4)) : undefined,
    rating: raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : undefined,
    duration: raw.runtime ?? raw.episode_run_time?.[0] ?? undefined,
    overview: raw.overview || undefined,
    poster: raw.poster_path ? `${IMG}/w342${raw.poster_path}` : undefined,
    backdrop: raw.backdrop_path ? `${IMG}/w1280${raw.backdrop_path}` : undefined,
  }
}

const mapList = (list: RawList, kind: 'movie' | 'tv', limit = 10): Media[] =>
  list.results.slice(0, limit).map((r) => toMedia(r, kind))

const T = {
  uk: {
    top10: 'Топ 10 тижня',
    now: 'Новеньке на Starlicht',
    popular: 'Найпопулярніші фільми',
    tv: 'Популярні серіали',
    cartoons: 'Мультфільми',
    ukrainian: 'Наше українське',
    topRated: 'Найвище оцінені',
    upcoming: 'Скоро',
    onAir: 'У ефірі',
    today: 'Сьогодні в ефірі',
    horror: 'Жахи',
    docs: 'Документальні',
    romance: 'Романтика',
    adventure: 'Пригоди',
    crime: 'Кримінал',
    scifi: 'Фантастика',
    action: 'Екшн і пригоди',
    cartoonSeries: 'Мультсеріали',
  },
  en: {
    top10: 'Top 10 this week',
    now: 'New on Starlicht',
    popular: 'Most popular movies',
    tv: 'Popular series',
    cartoons: 'Cartoons',
    ukrainian: 'Our Ukrainian',
    topRated: 'Top rated',
    upcoming: 'Coming soon',
    onAir: 'On the air',
    today: 'Airing today',
    horror: 'Horror',
    docs: 'Documentaries',
    romance: 'Romance',
    adventure: 'Adventure',
    crime: 'Crime',
    scifi: 'Sci-Fi & Fantasy',
    action: 'Action & Adventure',
    cartoonSeries: 'Animated series',
  },
} as const

export async function homeRows(lang: Lang): Promise<MediaRow[]> {
  const t = T[lang]
  const [trending, now, popular, tv, anim, ua] = await Promise.all([
    get<RawList>('/trending/all/week', lang),
    get<RawList>('/movie/now_playing', lang),
    get<RawList>('/movie/popular', lang),
    get<RawList>('/tv/popular', lang),
    get<RawList>('/discover/movie', lang, { with_genres: '16', sort_by: 'popularity.desc' }),
    get<RawList>('/discover/movie', lang, { with_original_language: 'uk', sort_by: 'popularity.desc' }),
  ])
  return [
    {
      key: 'top10',
      title: t.top10,
      variant: 'wide',
      to: '/catalog/movies',
      items: trending.results.slice(0, 4).map((r) => toMedia(r, r.media_type === 'tv' ? 'tv' : 'movie')),
    },
    { key: 'new', title: t.now, to: '/catalog/movies', items: mapList(now, 'movie', 5) },
    { key: 'popular', title: t.popular, to: '/catalog/movies', items: mapList(popular, 'movie', 5) },
    { key: 'tv', title: t.tv, to: '/catalog/series', items: mapList(tv, 'tv', 5) },
    { key: 'childhood', title: t.cartoons, to: '/catalog/cartoons', items: mapList(anim, 'movie', 5) },
    { key: 'ukrainian', title: t.ukrainian, to: '/catalog/movies', items: mapList(ua, 'movie', 5) },
  ]
}

export async function catalogRows(type: MediaType, lang: Lang): Promise<MediaRow[]> {
  const t = T[lang]
  const to = `/catalog/${TYPE_TO_SLUG[type]}`
  const row = (key: string, title: string, list: RawList, kind: 'movie' | 'tv', variant?: 'wide'): MediaRow => ({
    key,
    title,
    to,
    variant,
    items: mapList(list, kind, variant === 'wide' ? 4 : 5),
  })

  if (type === 'movie') {
    const [pop, top, up, now, h, d, r, a] = await Promise.all([
      get<RawList>('/movie/popular', lang),
      get<RawList>('/movie/top_rated', lang),
      get<RawList>('/movie/upcoming', lang),
      get<RawList>('/movie/now_playing', lang),
      get<RawList>('/discover/movie', lang, { with_genres: '27' }),
      get<RawList>('/discover/movie', lang, { with_genres: '99' }),
      get<RawList>('/discover/movie', lang, { with_genres: '10749' }),
      get<RawList>('/discover/movie', lang, { with_genres: '12' }),
    ])
    return [
      row('top10', t.top10, pop, 'movie', 'wide'),
      row('topRated', t.topRated, top, 'movie'),
      row('upcoming', t.upcoming, up, 'movie'),
      row('now', t.now, now, 'movie'),
      row('romance', t.romance, r, 'movie'),
      row('docs', t.docs, d, 'movie'),
      row('horror', t.horror, h, 'movie'),
      row('adventure', t.adventure, a, 'movie'),
    ]
  }

  if (type === 'series') {
    const [pop, top, air, today, crime, docs, sf, act] = await Promise.all([
      get<RawList>('/tv/popular', lang),
      get<RawList>('/tv/top_rated', lang),
      get<RawList>('/tv/on_the_air', lang),
      get<RawList>('/tv/airing_today', lang),
      get<RawList>('/discover/tv', lang, { with_genres: '80' }),
      get<RawList>('/discover/tv', lang, { with_genres: '99' }),
      get<RawList>('/discover/tv', lang, { with_genres: '10765' }),
      get<RawList>('/discover/tv', lang, { with_genres: '10759' }),
    ])
    return [
      row('top10', t.top10, pop, 'tv', 'wide'),
      row('topRated', t.topRated, top, 'tv'),
      row('onAir', t.onAir, air, 'tv'),
      row('today', t.today, today, 'tv'),
      row('crime', t.crime, crime, 'tv'),
      row('docs', t.docs, docs, 'tv'),
      row('scifi', t.scifi, sf, 'tv'),
      row('action', t.action, act, 'tv'),
    ]
  }

  const [movies, top, series] = await Promise.all([
    get<RawList>('/discover/movie', lang, { with_genres: '16', sort_by: 'popularity.desc' }),
    get<RawList>('/discover/movie', lang, { with_genres: '16', sort_by: 'vote_average.desc', 'vote_count.gte': '500' }),
    get<RawList>('/discover/tv', lang, { with_genres: '16', sort_by: 'popularity.desc' }),
  ])
  return [
    row('top', t.cartoons, movies, 'movie', 'wide'),
    row('topRated', t.topRated, top, 'movie'),
    row('series', t.cartoonSeries, series, 'tv'),
  ]
}

export async function search(query: string, lang: Lang): Promise<Media[]> {
  const q = query.trim()
  if (!q) return []
  const data = await get<RawList>('/search/multi', lang, { query: q, include_adult: 'false' })
  return data.results
    .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
    .map((r) => toMedia(r, r.media_type === 'tv' ? 'tv' : 'movie'))
}

export async function mediaById(id: string, lang: Lang): Promise<Media | null> {
  const m = /^tmdb-(movie|tv)-(\d+)$/.exec(id)
  if (!m) return null
  const kind = m[1] as 'movie' | 'tv'
  const raw = await get<RawItem>(`/${kind}/${m[2]}`, lang)
  return toMedia(raw, kind)
}

/** Постер за точною назвою (для демо-каталогу, коли є ключ TMDB). Повертає null, якщо збігу немає. */
export async function findPoster(title: string, kind: 'movie' | 'tv'): Promise<string | null> {
  const data = await get<RawList>(`/search/${kind}`, 'en', { query: title, include_adult: 'false' })
  const want = normTitle(title)
  const hit = data.results.find(
    (r) =>
      r.poster_path &&
      [r.title, r.name, r.original_title, r.original_name].some((n) => n && normTitle(n) === want),
  )
  return hit?.poster_path ? `${IMG}/w342${hit.poster_path}` : null
}
