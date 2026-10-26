import type { Lang } from '../types'

export type SportKey = 'football' | 'basketball' | 'tennis' | 'volleyball' | 'racing' | 'combat'

export interface SportEvent {
  id: string
  sport: SportKey
  title: string
  /** локалізована дата (і час), напр. «27 серпня 2026 о 19:35» */
  when: string
  hue: number
}

const MONTHS: Record<Lang, string[]> = {
  uk: ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

/** [день, місяць (1–12), час?] */
type When = [day: number, month: number, time?: string]

function fmt(w: When, lang: Lang, withYear: boolean): string {
  const [d, m, time] = w
  const month = MONTHS[lang][m - 1]
  const date = `${d} ${month}${withYear ? ' 2026' : ''}`
  if (!time) return date
  return lang === 'uk' ? `${date} о ${time}` : `${date}, ${time}`
}

interface Def {
  id: string
  sport: SportKey
  uk: string
  en: string
  when: When
  hue: number
}

const def = (id: string, sport: SportKey, uk: string, en: string, when: When, hue: number): Def => ({ id, sport, uk, en, when, hue })

const toEvent = (d: Def, lang: Lang, withYear = true): SportEvent => ({
  id: d.id,
  sport: d.sport,
  title: d[lang],
  when: fmt(d.when, lang, withYear),
  hue: d.hue,
})

/* ——— Головні спортивні події (дати без часу, як на макеті) ——— */
const MAIN: Def[] = [
  def('m1', 'football', 'Чехія — Україна', 'Czechia — Ukraine', [27, 9], 215),
  def('m2', 'football', 'Верес — Кудрівка', 'Veres — Kudrivka', [8, 10], 350),
  def('m3', 'football', 'Україна — Норвегія', 'Ukraine — Norway', [10, 10], 150),
  def('m4', 'football', 'Бельгія — Україна', 'Belgium — Ukraine', [15, 10], 25),
]

const WEEK: Def[] = [
  def('w1', 'football', 'Рома — Фіорентина', 'Roma — Fiorentina', [18, 10], 20),
  def('w2', 'football', 'Польща — Латвія', 'Poland — Latvia', [18, 10], 0),
  def('w3', 'volleyball', 'Чемпіонат Європи з волейболу. Німеччина — Франція', 'European Volleyball Championship. Germany — France', [19, 10], 200),
  def('w4', 'racing', 'Гран-Прі Нідерландів — гонка', 'Dutch Grand Prix — race', [19, 10], 260),
]

const BASKETBALL: Def[] = [
  def('b1', 'basketball', 'Фінляндія — Швеція', 'Finland — Sweden', [27, 8, '19:35'], 45),
  def('b2', 'basketball', 'Німеччина — Нідерланди', 'Germany — Netherlands', [27, 8, '20:55'], 30),
  def('b3', 'basketball', 'Франція — Словенія', 'France — Slovenia', [27, 8, '21:25'], 210),
  def('b4', 'basketball', 'Італія — Сербія', 'Italy — Serbia', [31, 8, '20:25'], 190),
  def('b5', 'basketball', 'Іспанія — Греція', 'Spain — Greece', [1, 9, '19:00'], 340),
  def('b6', 'basketball', 'Литва — Туреччина', 'Lithuania — Türkiye', [2, 9, '18:30'], 100),
]

const FOOTBALL: Def[] = [
  def('f1', 'football', 'Колос — Оболонь', 'Kolos — Obolon', [28, 8, '15:30'], 140),
  def('f2', 'football', 'Кудрівка — Епіцентр', 'Kudrivka — Epitsentr', [29, 8, '13:00'], 270),
  def('f3', 'football', 'Лівий берег — Карпати', 'Livyi Bereh — Karpaty', [29, 8, '14:25'], 230),
  def('f4', 'football', 'Шахтар — Полісся', 'Shakhtar — Polissya', [19, 8, '18:00'], 28),
  def('f5', 'football', 'Динамо — Зоря', 'Dynamo — Zorya', [30, 8, '17:00'], 215),
  def('f6', 'football', 'Рух — Минай', 'Rukh — Mynai', [30, 8, '19:30'], 120),
]

const TENNIS: Def[] = [
  def('t1', 'tennis', 'Джессіка Пегула — Іга Свьонтек', 'Jessica Pegula — Iga Świątek', [22, 8], 215),
  def('t2', 'tennis', 'Лоренцо Музетті — Френсіс Тіафо', 'Lorenzo Musetti — Frances Tiafoe', [20, 8], 20),
  def('t3', 'tennis', 'Сара Блейк — Медісон Кіз', 'Sara Blake — Madison Keys', [26, 8], 195),
  def('t4', 'tennis', 'Еліна Світоліна — Іга Свьонтек', 'Elina Svitolina — Iga Świątek', [27, 8], 160),
]

const COMBAT: Def[] = [
  def('c1', 'combat', 'Вечір боксу. Usyk 17 promotions', 'Boxing night. Usyk 17 promotions', [27, 8, '18:25'], 350),
  def('c2', 'combat', 'Турнір з ММА. Київ', 'MMA tournament. Kyiv', [28, 8, '20:00'], 10),
  def('c3', 'combat', 'Гран-прі з кікбоксингу', 'Kickboxing Grand Prix', [29, 8, '19:00'], 280),
  def('c4', 'combat', 'Чемпіонат Європи з боротьби', 'European Wrestling Championship', [31, 8, '16:30'], 170),
  def('c5', 'combat', 'Вечір боксу. Півфінали', 'Boxing night. Semi-finals', [1, 9, '19:30'], 330),
]

export interface SportSection {
  key: 'basketball' | 'football' | 'tennis' | 'combat'
  events: SportEvent[]
}

export function mainEvents(lang: Lang): SportEvent[] {
  return MAIN.map((d) => toEvent(d, lang, false))
}
export function weekEvents(lang: Lang): SportEvent[] {
  return WEEK.map((d) => toEvent(d, lang, false))
}
export function sportSections(lang: Lang): SportSection[] {
  const make = (key: SportSection['key'], defs: Def[]): SportSection => ({ key, events: defs.map((d) => toEvent(d, lang, Boolean(d.when[2]))) })
  return [make('basketball', BASKETBALL), make('football', FOOTBALL), make('tennis', TENNIS), make('combat', COMBAT)]
}

/** Спортивні канали (логотипи стилізовані, без сторонніх зображень). */
export const SPORT_CHANNELS = [
  { id: 'livetv', name: 'LIVE TV', cls: 'live' },
  { id: 'sportplus', name: 'Sport', cls: 'sportplus' },
  { id: 'setanta', name: 'SETANTA SPORTS', cls: 'setanta' },
  { id: 'suspilne', name: 'СУСПІЛЬНЕ СПОРТ', cls: 'suspilne' },
] as const
