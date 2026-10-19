import type { Lang, Media, MediaRow, MediaType, NewsItem } from '../types'
import { getNews } from '../data/content'
import * as mock from './mock'
import * as tmdb from './tmdb'

const delay = (ms = 250) => new Promise<void>((r) => setTimeout(r, ms))

/** TMDB, якщо задано ключ; у разі помилки мережі — тихий перехід на демо-дані. */
async function withFallback<T>(live: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!tmdb.tmdbEnabled) {
    await delay()
    return fallback()
  }
  try {
    return await live()
  } catch (e) {
    console.warn('[api] TMDB недоступний, використовую демо-дані', e)
    return fallback()
  }
}

export const api = {
  homeRows: (lang: Lang): Promise<MediaRow[]> => withFallback(() => tmdb.homeRows(lang), () => mock.homeRows(lang)),

  catalogRows: (type: MediaType, lang: Lang): Promise<MediaRow[]> =>
    withFallback(() => tmdb.catalogRows(type, lang), () => mock.catalogRows(type, lang)),

  search: (query: string, lang: Lang): Promise<Media[]> =>
    withFallback(() => tmdb.search(query, lang), () => mock.search(query, lang)),

  details: async (id: string, lang: Lang): Promise<Media | null> => {
    if (id.startsWith('tmdb-') && tmdb.tmdbEnabled) {
      try {
        return await tmdb.mediaById(id, lang)
      } catch (e) {
        console.warn('[api] TMDB details failed', e)
        return null
      }
    }
    await delay(120)
    return mock.mediaById(id, lang)
  },

  mediaList: async (ids: string[], lang: Lang): Promise<Media[]> => {
    const items = await Promise.all(ids.map((id) => api.details(id, lang)))
    return items.filter((m): m is Media => m !== null)
  },

  news: async (lang: Lang): Promise<NewsItem[]> => {
    await delay(150)
    return getNews(lang)
  },
}

export { indexOf as demoIndexOf } from './mock'
export { tmdbEnabled } from './tmdb'
