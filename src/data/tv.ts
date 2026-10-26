import type { Lang } from '../types'
import { hash } from '../lib/format'

export type TvCategory = 'entertainment' | 'news' | 'kids'

export interface Channel {
  id: string
  name: string
  /** текст у «логотипі» */
  badge: string
  hue: number
  category: TvCategory
  free: boolean
  genre: string
  about: string
  /** стаття у Вікіпедії, з якої беремо логотип */
  wiki: { host: 'uk' | 'en'; title: string }
  /** власний логотип (файл у public/logos), має пріоритет над Вікіпедією */
  logo?: string
}

export interface Show {
  title: string
  text: string
  img?: string
}

interface Def {
  id: string
  name: string
  badge: string
  hue: number
  category: TvCategory
  free: boolean
  genre: Record<Lang, string>
  wiki: string
  logo?: string
  about?: Record<Lang, string>
}

const ENT: Record<Lang, string> = { uk: 'Розважальний, Україна', en: 'Entertainment, Ukraine' }
const KIDS: Record<Lang, string> = { uk: 'Дитячий', en: 'Kids' }
const NEWS: Record<Lang, string> = { uk: 'Новинний, Україна', en: 'News, Ukraine' }

const DEFS: Def[] = [
  {
    id: 'plus1',
    name: '1+1 Україна',
    badge: '1+1',
    hue: 355,
    category: 'entertainment',
    free: true,
    genre: ENT, wiki: '1+1 (телеканал)',
    about: {
      uk: '1+1 Україна — загальнонаціональний український телеканал, який працює з 1995 року. В ефірі каналу представлені інформаційні та аналітичні програми, розважальні шоу, документальні проєкти, серіали, фільми, дитячий контент і мультфільми. Значну частину ефіру займають власні проєкти українського виробництва.',
      en: '1+1 Ukraine is a nationwide Ukrainian TV channel on air since 1995. Its schedule includes news and analytical programmes, entertainment shows, documentaries, series, films and children’s content. A large share of the airtime is original Ukrainian production.',
    },
  },
  { id: 'twoplus2', name: '2+2 HD', badge: '2+2', hue: 40, category: 'entertainment', free: false, genre: ENT, wiki: '2+2 (телеканал)' },
  { id: 'tet', name: 'ТЕТ HD', badge: 'ТЕТ', hue: 330, category: 'entertainment', free: true, genre: ENT, wiki: 'ТЕТ (телеканал)' },
  { id: 'ictv', name: 'ICTV HD', badge: 'ICTV', hue: 28, category: 'entertainment', free: false, genre: ENT, wiki: 'ICTV (телеканал)' },
  { id: 'stb', name: 'СТБ HD', badge: 'СТБ', hue: 350, category: 'entertainment', free: false, genre: ENT, wiki: 'СТБ (телеканал)' },
  { id: 'novy', name: 'Новий канал HD', badge: 'НК', hue: 150, category: 'entertainment', free: true, genre: ENT, wiki: 'Новий канал' },
  { id: 'plusplus', name: 'ПЛЮС ПЛЮС', badge: 'ПЛЮС', hue: 50, category: 'kids', free: true, genre: KIDS, wiki: 'Плюс Плюс' },
  { id: 'nickelodeon', name: 'Nickelodeon', badge: 'nick', hue: 275, category: 'kids', free: false, genre: KIDS, wiki: 'Nickelodeon' },
  { id: 'disney', name: 'Disney Channel', badge: 'Disney', hue: 215, category: 'kids', free: false, genre: KIDS, wiki: 'Disney Channel', logo: 'disney-channel.svg' },
  { id: 'cbeebies', name: 'Cbeebies BBC', badge: 'CBeebies', hue: 220, category: 'kids', free: false, genre: KIDS, wiki: 'CBeebies' },
  { id: 'pryamyi', name: 'Прямий', badge: 'П', hue: 215, category: 'news', free: true, genre: NEWS, wiki: 'Прямий (телеканал)' },
  { id: 'espreso', name: 'Еспресо', badge: 'Е', hue: 12, category: 'news', free: true, genre: NEWS, wiki: 'Еспресо TV' },
  { id: 'suspilne', name: 'Суспільне Новини', badge: 'СН', hue: 175, category: 'news', free: true, genre: NEWS, wiki: 'Суспільне Новини' },
]

const GENERIC_ABOUT: Record<Lang, string> = {
  uk: '{name} — телеканал у каталозі Starlicht+. Дивіться ефір онлайн, переглядайте телепрограму та додавайте канали в обране, щоб швидко повертатися до улюблених програм.',
  en: '{name} is a TV channel in the Starlicht+ catalogue. Watch live, browse the programme guide and add channels to favourites to quickly return to your favourite shows.',
}

export const getKidsChannels = (lang: Lang): Channel[] => getChannels(lang).filter((c) => c.category === 'kids')

export function getChannels(lang: Lang): Channel[] {
  return DEFS.map((d) => ({
    id: d.id,
    name: d.name,
    badge: d.badge,
    hue: d.hue,
    category: d.category,
    free: d.free,
    genre: d.genre[lang],
    wiki: { host: 'uk', title: d.wiki },
    logo: d.logo ? `${import.meta.env.BASE_URL}logos/${d.logo}` : undefined,
    about: (d.about ?? GENERIC_ABOUT)[lang].replace('{name}', d.name),
  }))
}

const SHOWS_PLUS1: Record<Lang, Show[]> = {
  uk: [
    { img: 'snidanok.webp', title: 'Сніданок з 1+1', text: 'Бадьорий ранковий ефір з новинами, гостями, мотиваційними та корисними рубриками для всієї родини.' },
    { img: 'svit.webp', title: 'Світ навиворіт', text: 'Авторський тревел-проєкт Дмитра Комарова про незвичайні країни та людей.' },
    { img: 'klub1.webp', title: 'Клуб 1%', text: 'Інтелектуальне шоу, де знання та кмітливість перетворюються на виграш.' },
    { img: 'pisnya.webp', title: 'Пісня мого життя', text: 'Музично-розважальний проєкт про історії, що стоять за улюбленими піснями.' },
    { img: 'kvartal.webp', title: 'Вечірній Квартал', text: 'Гумористичне шоу з гострими скетчами та пародіями на актуальні події.' },
    { img: 'golos.webp', title: 'Голос країни', text: 'Найбільше вокальне шоу країни: сліпі прослуховування, битви та яскраві фінали.' },
  ],
  en: [
    { img: 'snidanok.webp', title: 'Breakfast with 1+1', text: 'A lively morning show with news, guests and useful features for the whole family.' },
    { img: 'svit.webp', title: 'World Inside Out', text: 'An author travel project about unusual countries and the people who live there.' },
    { img: 'klub1.webp', title: 'Club 1%', text: 'An intellectual game show where knowledge and wit turn into prizes.' },
    { img: 'pisnya.webp', title: 'Song of My Life', text: 'A music show about the stories behind much-loved songs.' },
    { img: 'kvartal.webp', title: 'Evening Quarter', text: 'A comedy show with sharp sketches and parodies of current events.' },
    { img: 'golos.webp', title: 'The Voice of the Country', text: 'The nation’s biggest vocal show: blind auditions, battles and bright finals.' },
  ],
}

const SHOWS_POOL: Record<Lang, Show[]> = {
  uk: [
    { title: 'Ранок на каналі', text: 'Новини, погода та корисні поради для гарного початку дня.' },
    { title: 'Головні новини', text: 'Головні події дня: коротко, чітко та без зайвого.' },
    { title: 'Вечірнє ток-шоу', text: 'Гості, дискусії та актуальні теми вечора.' },
    { title: 'Серіал дня', text: 'Улюблені українські та зарубіжні серіали в зручний час.' },
    { title: 'Кіновечір', text: 'Прем’єри та хіти кіно у вечірньому ефірі.' },
    { title: 'Розважальне шоу', text: 'Конкурси, музика та гумор для всієї родини.' },
  ],
  en: [
    { title: 'Morning on air', text: 'News, weather and handy tips for a good start to the day.' },
    { title: 'Top news', text: 'The day’s main events: short, clear and to the point.' },
    { title: 'Evening talk show', text: 'Guests, debates and the evening’s hot topics.' },
    { title: 'Series of the day', text: 'Favourite Ukrainian and foreign series at a convenient time.' },
    { title: 'Movie night', text: 'Premieres and hit films in the evening schedule.' },
    { title: 'Entertainment show', text: 'Contests, music and humour for the whole family.' },
  ],
}

export function showsFor(channel: Channel, lang: Lang): Show[] {
  if (channel.id === 'plus1') return SHOWS_PLUS1[lang]
  const pool = SHOWS_POOL[lang]
  const start = hash(channel.id) % pool.length
  return Array.from({ length: 5 }, (_, k) => pool[(start + k) % pool.length])
}

export interface GuideItem {
  time: string
  title: string
  /** це поточна передача */
  live: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Програма передач на добу: 8 блоків по 3 години, «зараз» — блок, що відповідає годині `hour`. */
export function guideFor(channel: Channel, lang: Lang, hour: number): GuideItem[] {
  const shows = showsFor(channel, lang)
  const nowSlot = Math.floor(hour / 3)
  return Array.from({ length: 8 }, (_, i) => ({
    time: `${pad(i * 3)}:00`,
    title: shows[(i + hash(channel.id)) % shows.length].title,
    live: i === nowSlot,
  }))
}

/** Хвилин до кінця поточної передачі — стабільно для каналу (демо). */
export function minutesLeft(channel: Channel): number {
  return 10 + (hash(channel.id) % 50)
}
