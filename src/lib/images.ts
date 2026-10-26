import { useEffect, useRef, useState } from 'react'
import { findPoster, tmdbEnabled } from '../api/tmdb'
import type { SportKey } from '../data/sport'
import type { Media } from '../types'
import { hash, normTitle } from './format'
import { load, save } from './storage'

/**
 * Підбір зображень для тайтлів, спортивних подій і телеканалів.
 *
 * Зображення не лежать у проєкті: браузер шукає їх у відкритих джерелах і кешує адреси в localStorage.
 *  • фільми / серіали / мультфільми — TMDB (якщо задано VITE_TMDB_KEY), інакше Вікіпедія (постер із картки статті);
 *  • спорт — фото з Wikimedia Commons (вільні ліцензії);
 *  • телеканали — логотип зі статті у Вікіпедії.
 * Збіг назви — лише точний: краще градієнтна заглушка, ніж чужий постер.
 * Якщо нічого не знайдено або мережа недоступна — повертається null, і інтерфейс показує заглушку.
 */

const CACHE_KEY = 'starlicht_img_v1'
const OK_TTL = 30 * 86_400_000
const MISS_TTL = 3 * 86_400_000
const MAX_PARALLEL = 4
const DISABLED = import.meta.env.VITE_IMAGES === 'off'

type Value = string | string[] | null
interface Entry {
  u: Value
  t: number
}

let cache: Record<string, Entry> | null = null
let saveTimer: number | undefined

function store(): Record<string, Entry> {
  cache ??= load<Record<string, Entry>>(CACHE_KEY, {})
  return cache
}

const isFresh = (e: Entry) => Date.now() - e.t < (e.u === null ? MISS_TTL : OK_TTL)

/** undefined — у кеші немає (потрібен запит); null — шукали й не знайшли. */
function peek(key: string): Value | undefined {
  const e = store()[key]
  return e && isFresh(e) ? e.u : undefined
}

function remember(key: string, u: Value) {
  store()[key] = { u, t: Date.now() }
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => save(CACHE_KEY, store()), 400)
}

/* ——— черга: не більше MAX_PARALLEL запитів одночасно ——— */
let active = 0
const waiting: (() => void)[] = []
async function limited<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_PARALLEL) await new Promise<void>((r) => waiting.push(r))
  active++
  try {
    return await fn()
  } finally {
    active--
    waiting.shift()?.()
  }
}

const inflight = new Map<string, Promise<Value>>()

function resolveCached(key: string, loader: () => Promise<Value>): Promise<Value> {
  const hit = peek(key)
  if (hit !== undefined) return Promise.resolve(hit)
  let p = inflight.get(key)
  if (!p) {
    p = limited(loader)
      .catch((): Value => null)
      .then((u) => {
        remember(key, u)
        inflight.delete(key)
        return u
      })
    inflight.set(key, p)
  }
  return p
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

/* ——— Вікіпедія ——— */
interface WikiResponse {
  query?: { pages?: Record<string, { title: string; index?: number; thumbnail?: { source: string } }> }
}

const wikiUrl = (host: string, params: Record<string, string>) =>
  `https://${host}.wikipedia.org/w/api.php?${new URLSearchParams({ action: 'query', format: 'json', origin: '*', redirects: '1', ...params })}`

/** Пошук статті за назвою; беремо лише ту, назва якої точно збігається. */
async function wikiPoster(host: 'en' | 'uk', title: string, word: string): Promise<string | null> {
  const data = await fetchJson<WikiResponse>(
    wikiUrl(host, {
      generator: 'search',
      gsrsearch: `${title} ${word}`,
      gsrlimit: '5',
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '342',
    }),
  )
  const want = normTitle(title)
  const pages = Object.values(data?.query?.pages ?? {}).sort((a, b) => (a.index ?? 99) - (b.index ?? 99))
  return pages.find((p) => p.thumbnail && normTitle(p.title) === want)?.thumbnail?.source ?? null
}

/** Зображення зі статті за точною назвою (логотип каналу). */
async function wikiLead(host: 'en' | 'uk', title: string, width: number): Promise<string | null> {
  const data = await fetchJson<WikiResponse>(
    wikiUrl(host, { titles: title, prop: 'pageimages', piprop: 'thumbnail', pithumbsize: String(width) }),
  )
  return Object.values(data?.query?.pages ?? {}).find((p) => p.thumbnail)?.thumbnail?.source ?? null
}

const WORDS: Record<Media['type'], { en: string[]; uk: string[] }> = {
  movie: { en: ['film'], uk: ['фільм'] },
  series: { en: ['TV series'], uk: ['телесеріал'] },
  cartoon: { en: ['animated film', 'animated TV series'], uk: ['мультфільм'] },
}

async function loadMedia(m: Media): Promise<string | null> {
  if (tmdbEnabled) {
    const url = await findPoster(m.titleEn, m.type === 'series' ? 'tv' : 'movie').catch(() => null)
    if (url) return url
  }
  for (const word of WORDS[m.type].en) {
    const url = await wikiPoster('en', m.titleEn, word)
    if (url) return url
  }
  if (m.titleUk) {
    for (const word of WORDS[m.type].uk) {
      const url = await wikiPoster('uk', m.titleUk, word)
      if (url) return url
    }
  }
  return null
}

/* ——— Wikimedia Commons: фото для видів спорту ——— */
const SPORT_TERMS: Record<SportKey, string> = {
  football: 'association football match',
  basketball: 'basketball game',
  tennis: 'tennis match',
  volleyball: 'volleyball match',
  racing: 'Formula One race',
  combat: 'boxing match',
}

interface CommonsResponse {
  query?: {
    pages?: Record<string, { index?: number; imageinfo?: { thumburl?: string; thumbwidth?: number; thumbheight?: number }[] }>
  }
}

async function loadSportPhotos(sport: SportKey): Promise<string[]> {
  const data = await fetchJson<CommonsResponse>(
    `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      generator: 'search',
      gsrsearch: `${SPORT_TERMS[sport]} filetype:bitmap`,
      gsrnamespace: '6',
      gsrlimit: '20',
      prop: 'imageinfo',
      iiprop: 'url|size',
      iiurlwidth: '480',
    })}`,
  )
  return Object.values(data?.query?.pages ?? {})
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99))
    .map((p) => p.imageinfo?.[0])
    .filter((i) => i?.thumburl && /\.jpe?g$/i.test(i.thumburl) && (i.thumbwidth ?? 0) >= (i.thumbheight ?? 1))
    .map((i) => i?.thumburl as string)
}

/* ——— React-хуки ——— */
function useResolved(key: string | null, loader: () => Promise<Value>): Value {
  const [state, setState] = useState<{ key: string | null; value: Value }>({ key: null, value: null })
  const loaderRef = useRef(loader)
  useEffect(() => {
    loaderRef.current = loader
  })

  useEffect(() => {
    if (!key || DISABLED) return
    let alive = true
    resolveCached(key, () => loaderRef.current()).then((value) => alive && setState({ key, value }))
    return () => {
      alive = false
    }
  }, [key])

  if (!key || DISABLED) return null
  const cached = peek(key)
  if (cached !== undefined) return cached
  return state.key === key ? state.value : null
}

/** Постер тайтлу: власний (TMDB-каталог) або підібраний. */
export function useMediaImage(m: Media | null | undefined): string | null {
  const own = m?.poster ?? null
  const found = useResolved(!m || own ? null : `m:${m.id}:${m.titleEn}`, () => (m ? loadMedia(m) : Promise.resolve(null)))
  return own ?? (typeof found === 'string' ? found : null)
}

/** Події, для яких у public/sport є фото з макета. */
const LOCAL_SPORT = new Set(['m1', 'm2', 'm3', 'm4', 'w1', 'w2', 'w3', 'w4', 'b1', 'b2', 'b3', 'b4', 'f1', 'f2', 'f3', 'f4', 't1', 't2', 't3', 'c1', 'c2', 'c3', 'c4'])

/** Фото для спортивної події; різні події одного виду спорту отримують різні фото. */
export function useSportImage(sport: SportKey, eventId: string): string | null {
  const own = LOCAL_SPORT.has(eventId) ? `${import.meta.env.BASE_URL}sport/${eventId}.webp` : null
  const list = useResolved(`s:${sport}`, () => loadSportPhotos(sport))
  if (own) return own
  return Array.isArray(list) && list.length > 0 ? list[hash(eventId) % list.length] : null
}

/** Логотип телеканалу зі Вікіпедії. */
export function useChannelLogo(wiki: { host: 'uk' | 'en'; title: string }): string | null {
  const url = useResolved(`c:${wiki.host}:${wiki.title}`, () => wikiLead(wiki.host, wiki.title, 160))
  return typeof url === 'string' ? url : null
}
