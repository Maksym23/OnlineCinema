import type { Lang, NewsItem, Plan } from '../types'

interface NewsDef {
  id: string
  date: string
  hue: number
  uk: { title: string; text: string }
  en: { title: string; text: string }
}

const NEWS: NewsDef[] = [
  {
    id: 'n1',
    date: '2026-10-15',
    hue: 268,
    uk: {
      title: 'Осіння добірка: серіали для затишних вечорів',
      text: 'Ми зібрали добірку «Осінній вайб» — від детективів до теплих комедій. Додайте улюблене в «Обране», і ми збережемо його на всіх ваших пристроях.',
    },
    en: {
      title: 'Autumn picks: series for cosy evenings',
      text: 'We have put together the “Autumn vibes” collection — from detectives to warm comedies. Add your favourites to the list and they will follow you across all your devices.',
    },
  },
  {
    id: 'n2',
    date: '2026-10-09',
    hue: 200,
    uk: {
      title: 'Тепер можна дивитися в режимі «Картинка в картинці»',
      text: 'Відео продовжує грати в маленькому вікні поверх інших застосунків. Кнопка PiP з’явилася в плеєрі поруч із повноекранним режимом.',
    },
    en: {
      title: 'Picture-in-Picture is here',
      text: 'Keep watching in a small floating window above your other apps. The PiP button now sits in the player next to fullscreen.',
    },
  },
  {
    id: 'n3',
    date: '2026-10-02',
    hue: 48,
    uk: {
      title: 'Українські прем’єри жовтня',
      text: 'У каталозі з’явилися нові українські фільми та серіали — шукайте їх у рядку «Наше українське» на головній сторінці.',
    },
    en: {
      title: 'Ukrainian premieres of October',
      text: 'New Ukrainian films and series have landed in the catalogue — look for them in the “Our Ukrainian” row on the home page.',
    },
  },
  {
    id: 'n4',
    date: '2026-09-24',
    hue: 330,
    uk: {
      title: 'Новий тариф «Сімейний»: до п’яти пристроїв',
      text: 'Преміум-тариф тепер підтримує одночасний перегляд на п’яти пристроях. Керувати підпискою можна в розділі «Тарифи».',
    },
    en: {
      title: 'Family plan: up to five devices',
      text: 'The Premium plan now supports watching on five devices at the same time. Manage your subscription in the Plans section.',
    },
  },
  {
    id: 'n5',
    date: '2026-09-12',
    hue: 160,
    uk: {
      title: 'Світла тема та дві мови інтерфейсу',
      text: 'Перемикайте темну та світлу тему й обирайте українську або англійську мову в шапці сайту — вибір запам’ятовується.',
    },
    en: {
      title: 'Light theme and two interface languages',
      text: 'Switch between dark and light themes and pick Ukrainian or English from the header — your choice is remembered.',
    },
  },
  {
    id: 'n6',
    date: '2026-09-01',
    hue: 12,
    uk: {
      title: 'Продовжуйте з того місця, де зупинилися',
      text: 'Starlicht запам’ятовує момент, на якому ви завершили перегляд, і показує його в «Історії». Натисніть «Продовжити» — і плеєр почне з потрібної хвилини.',
    },
    en: {
      title: 'Pick up right where you left off',
      text: 'Starlicht remembers where you stopped and lists it in History. Hit “Continue” and the player starts from the right minute.',
    },
  },
]

export function getNews(lang: Lang): NewsItem[] {
  return NEWS.map((n) => ({
    id: n.id,
    date: n.date,
    hue: n.hue,
    title: n[lang].title,
    text: n[lang].text,
    image: `${import.meta.env.BASE_URL}news/${n.id}.webp`,
  }))
}

interface PlanDef {
  id: string
  price: number
  popular?: boolean
  uk: { name: string; features: string[]; highlights: [string, string][] }
  en: { name: string; features: string[]; highlights: [string, string][] }
}

const PLANS: PlanDef[] = [
  {
    id: 'basic',
    price: 100,
    uk: {
      name: 'Стартова',
      features: ['Каталог фільмів і серіалів', 'Якість HD', '1 пристрій', 'З рекламою'],
      highlights: [['500+', 'Фільмів'], ['10 000+', 'Годин контенту']],
    },
    en: {
      name: 'Starter',
      features: ['Movies and series catalogue', 'HD quality', '1 device', 'With ads'],
      highlights: [['500+', 'Movies'], ['10,000+', 'Hours of content']],
    },
  },
  {
    id: 'standard',
    price: 200,
    popular: true,
    uk: {
      name: 'Оптимальна',
      features: ['Усе зі Стартової', 'Без реклами', 'Full HD', '2 пристрої'],
      highlights: [['1 000+', 'Фільмів і серіалів'], ['20 000+', 'Годин контенту']],
    },
    en: {
      name: 'Optimal',
      features: ['Everything in Starter', 'No ads', 'Full HD', '2 devices'],
      highlights: [['1,000+', 'Movies and series'], ['20,000+', 'Hours of content']],
    },
  },
  {
    id: 'premium',
    price: 400,
    uk: {
      name: 'Преміум',
      features: ['Усе з Оптимальної', 'Ultra HD 4K', 'До 5 пристроїв', 'Завантаження офлайн'],
      highlights: [['2 000+', 'Фільмів і серіалів'], ['50 000+', 'Годин контенту']],
    },
    en: {
      name: 'Premium',
      features: ['Everything in Optimal', 'Ultra HD 4K', 'Up to 5 devices', 'Offline downloads'],
      highlights: [['2,000+', 'Movies and series'], ['50,000+', 'Hours of content']],
    },
  },
]

export function getPlans(lang: Lang): Plan[] {
  return PLANS.map((p) => ({
    id: p.id,
    price: p.price,
    popular: p.popular,
    name: p[lang].name,
    features: p[lang].features,
    highlights: p[lang].highlights.map(([value, label]) => ({ value, label })),
  }))
}

export interface Addon {
  id: string
  price: number
  name: string
}

const ADDONS: { id: string; price: number; uk: string; en: string }[] = [
  { id: 'kids', price: 90, uk: 'Дитяча', en: 'Kids' },
  { id: 'adult', price: 70, uk: 'Доросла', en: 'Adult' },
  { id: 'youtube', price: 70, uk: 'YouTube Premium', en: 'YouTube Premium' },
]

export function getAddons(lang: Lang): Addon[] {
  return ADDONS.map((a) => ({ id: a.id, price: a.price, name: a[lang] }))
}
