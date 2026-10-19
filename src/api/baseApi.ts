import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Lang, Media, MediaRow, MediaType, NewsItem } from '../types'
import { api } from './index'

async function run<T>(fn: () => Promise<T>): Promise<{ data: T } | { error: string }> {
  try {
    return { data: await fn() }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<string>(),
  keepUnusedDataFor: 300,
  endpoints: (build) => ({
    homeRows: build.query<MediaRow[], Lang>({
      queryFn: (lang) => run(() => api.homeRows(lang)),
    }),
    catalogRows: build.query<MediaRow[], { type: MediaType; lang: Lang }>({
      queryFn: ({ type, lang }) => run(() => api.catalogRows(type, lang)),
    }),
    search: build.query<Media[], { q: string; lang: Lang }>({
      queryFn: ({ q, lang }) => run(() => api.search(q, lang)),
    }),
    details: build.query<Media | null, { id: string; lang: Lang }>({
      queryFn: ({ id, lang }) => run(() => api.details(id, lang)),
    }),
    mediaList: build.query<Media[], { ids: string[]; lang: Lang }>({
      queryFn: ({ ids, lang }) => run(() => api.mediaList(ids, lang)),
    }),
    news: build.query<NewsItem[], Lang>({
      queryFn: (lang) => run(() => api.news(lang)),
    }),
  }),
})

export const {
  useHomeRowsQuery,
  useCatalogRowsQuery,
  useSearchQuery,
  useDetailsQuery,
  useMediaListQuery,
  useNewsQuery,
} = baseApi
