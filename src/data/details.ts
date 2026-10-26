import type { CountryKey, GenreKey, Lang, Media, MediaType } from '../types'
import { hash } from '../lib/format'
import { CAST, CAST_PHOTOS, NAMES_UK } from './cast'

/** Демо-дані для сторінок деталей: акторська команда, сезони, серії, вікові рейтинги. */

export const COUNTRIES: CountryKey[] = ['ua', 'us', 'gb', 'fr', 'kr']

const COUNTRY_BY_INDEX: CountryKey[] = ['us', 'ua', 'us', 'gb', 'us', 'fr', 'ua', 'kr', 'gb', 'us']

const OVERVIEW: Record<Lang, Record<MediaType, string>> = {
  uk: {
    movie:
      'Захопливий фільм про людей, які опиняються перед складним вибором. Їхня подорож випробує дружбу, мужність і віру в себе, а фінал змусить переглянути стрічку ще раз.',
    series:
      'Багатосезонна історія, у якій переплітаються долі героїв, таємниці минулого та несподівані союзи. Кожна серія розкриває нові деталі та тримає в напрузі до самого фіналу.',
    cartoon:
      'Яскрава та добра історія для всієї родини про дружбу, відвагу й пригоди. Герої разом долають труднощі та вчаться цінувати те, що справді важливо.',
  },
  en: {
    movie:
      'A gripping story about people facing a difficult choice. Their journey tests friendship, courage and self-belief, and the finale will make you want to watch it all over again.',
    series:
      'A multi-season story where the fates of its heroes, secrets of the past and unexpected alliances intertwine. Every episode reveals new details and keeps you hooked until the very end.',
    cartoon:
      'A bright and kind story for the whole family about friendship, courage and adventure. The heroes overcome obstacles together and learn to value what truly matters.',
  },
}

export function demoMeta(
  i: number,
  type: MediaType,
  genres: GenreKey[],
  lang: Lang,
): Pick<Media, 'year' | 'rating' | 'duration' | 'overview' | 'country'> {
  void genres
  return {
    year: 2019 + (i % 8),
    rating: Math.round((5.5 + ((i * 7) % 40) / 10) * 10) / 10,
    duration: type === 'series' ? 42 + (i % 4) * 5 : type === 'cartoon' ? 85 + (i % 5) * 4 : 92 + (i % 7) * 8,
    overview: OVERVIEW[lang][type],
    country: COUNTRY_BY_INDEX[i % COUNTRY_BY_INDEX.length],
  }
}

/** Віковий рейтинг за жанрами. */
export function ageRating(m: Media): string {
  if (m.type === 'cartoon') return '6+'
  if (m.genres.includes('horror')) return '18+'
  if (m.genres.some((g) => g === 'thriller' || g === 'crime' || g === 'action')) return '16+'
  if (m.genres.includes('family')) return '6+'
  return '12+'
}

export interface Person {
  name: string
  hue: number
  photo?: string
}

/** Акторський склад (для мультфільмів — озвучення); порожній, якщо для тайтла склад не внесено. */
export function castFor(m: Media, lang: Lang): Person[] {
  const names = m.titleUk ? CAST[m.titleUk] : undefined
  if (!names) return []
  return names.map((en) => {
    const name = lang === 'uk' ? (NAMES_UK[en] ?? en) : en
    const file = CAST_PHOTOS[en]
    return { name, hue: (hash(en) % 300) + 20, photo: file ? `${import.meta.env.BASE_URL}cast/${file}` : undefined }
  })
}

/** Реальна кількість серій по сезонах для окремих серіалів (ключ — українська назва). */
const EPISODES_BY_SEASON: Record<string, number[]> = {
  'Дім Дракона': [10, 8, 8],
  'Гра Престолів': [10, 10, 10, 10, 10, 10, 7, 6],
  'Надприродне': [22, 22, 16, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 20, 20],
  'Чужий: Земля': [9],
  'Пінгвін': [8],
  'Задача трьох тіл': [8],
  'Спіймати Кайдаша': [12],
  'Перевізниця': [10],
  'Перші дні': [6],
  'Тиха нива': [8],
  '24': [4],
  'Лицар Семи Королівств': [6],
  'Ласкаво просимо в Деррі': [8],
  'Той, що біжить по лезу 2099': [8],
  'Кристальне озерце': [8],
  'Спартак: Дім Ашура': [10],
  'Тед Лассо': [10,12,12,10],
  'Ебботт Елементарі': [13,22],
  'Шіттс Крік': [13,13,13,13,14,14],
  'Дивовижна місіс Мейзел': [8,10,8,8,9],
  'Дівчата Гілмор': [21,22,22,22,22,22,22],
  'Спайдер-Нуар': [8],
  'Зоряні ліхтарі': [8],
  'Зоряне місто': [8],
  'Сварка': [10,8],
  'Копи на вертольотах': [10,10],
  'Бріджертони': [8,8,8,8],
  'Емілі в Парижі': [10,10,10,10,10],
  'Чужоземка': [16,13,13,13,12,8,16,10],
  'Знову любов': [19,40],
  'Один день': [14],
  'Наша планета': [8,4],
  'Останній танець': [10],
  'Король тигрів': [8,5],
  'Формула 1: Драйв, щоб вижити': [10,10,10,10,10,10,10,8],
  'Світ очима тварин': [6],
  'Закулісся': [18],
  'Дивні дива': [8,9,8,9,8],
  'Чорне дзеркало': [3,3,6,6,3,5,6],
  'Штам': [13,13,10,10],
  'Персі Джексон та Олімпійці': [8,8],
  'Мандалорець': [8,8,8],
  'Зоряний шлях: Дивовижні нові світи': [10,10,7,10],
  'Відьмак': [8,8,8,8],
  'Володар перснів: Персні Влади': [8,8],
  'Рим': [12,19],
  'Ван-Піс': [8,8],
}

export function seasonCount(m: Media): number {
  const real = m.titleUk ? EPISODES_BY_SEASON[m.titleUk] : undefined
  if (real) return real.length
  return m.type === 'series' ? 2 + (hash(m.id) % 7) : 0
}

export interface Episode {
  n: number
  minutes: number
}

export function episodesOf(m: Media, season: number): Episode[] {
  const real = m.titleUk ? EPISODES_BY_SEASON[m.titleUk] : undefined
  const count = real?.[season - 1] ?? 8 + ((hash(m.id) + season) % 5)
  const base = m.duration ?? 45
  return Array.from({ length: count }, (_, k) => ({ n: k + 1, minutes: base - 6 + ((k * 3 + season) % 12) }))
}
