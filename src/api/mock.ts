import type { GenreKey, Lang, Media, MediaRow, MediaType } from '../types'
import { TYPE_TO_SLUG } from '../lib/catalog'

/** [укр. назва, англ. назва, тип, жанри] — демо-каталог за макетами Starlicht */
type Def = [uk: string, en: string, type: MediaType, genres: GenreKey[]]

const DEFS: Def[] = [
  // ——— Фільми
  ['Дюна: Частина друга', 'Dune: Part Two', 'movie', ['scifi', 'adventure']],
  ['Каскадер', 'The Fall Guy', 'movie', ['action', 'comedy']],
  ['Проєкт «Аве Марія»', 'Project Hail Mary', 'movie', ['scifi', 'adventure']],
  ['Людина-павук', 'Spider-Man', 'movie', ['action', 'adventure']],
  ['Кіллхаус', 'Killhouse', 'movie', ['action', 'thriller']],
  ['Потяг у 31 грудня', 'The 31st of December Train', 'movie', ['drama', 'comedy']],
  ['Хрещатик 48/2', 'Khreshchatyk 48/2', 'movie', ['comedy']],
  ['ГУР. Код: Сікора', 'HUR. Code: Sikora', 'movie', ['action', 'thriller']],
  ['Ти — космос', 'You Are the Cosmos', 'movie', ['scifi', 'drama']],
  ['Заколот', 'Mutiny', 'movie', ['action', 'thriller']],
  ['Серце звіра', 'Heart of the Beast', 'movie', ['action', 'drama']],
  ['Сузір’я Великого Пса', 'Canis Major Constellation', 'movie', ['adventure', 'family']],
  ['Одісея', 'The Odyssey', 'movie', ['adventure', 'fantasy']],
  ['Пікселі', 'Pixels', 'movie', ['comedy', 'scifi']],
  ['Джуманджі', 'Jumanji', 'movie', ['adventure', 'comedy']],
  ['Wicked: Чародійка', 'Wicked', 'movie', ['fantasy', 'drama']],
  ['Три мушкетери: Д’Артаньян', 'The Three Musketeers: D’Artagnan', 'movie', ['adventure', 'action']],
  ['Мисливці на привидів', 'Ghostbusters', 'movie', ['comedy', 'fantasy']],
  ['Розкриття', 'Disclosure Day', 'movie', ['scifi', 'thriller']],
  ['У сірій зоні', 'In the Grey', 'movie', ['action', 'thriller']],
  ['Володарі Всесвіту', 'Masters of the Universe', 'movie', ['fantasy', 'action']],
  ['Відважна дівчина', 'Brave Girl', 'movie', ['romance', 'drama']],
  ['Пригоди козака Виговського', 'Adventures of Cossack Vyhovsky', 'movie', ['adventure', 'comedy']],
  ['Батьківські збори', 'Parent Meeting', 'movie', ['comedy', 'family']],
  ['Перші ластівки', 'First Swallows', 'movie', ['romance', 'drama']],
  ['Песики', 'Puppies', 'movie', ['romance', 'comedy']],
  ['Людина війни', 'Man of War', 'movie', ['action']],
  ['Рейс 298', 'Flight 298', 'movie', ['drama', 'thriller']],
  ['Потяг «Червона рута»', 'Red Rue Train', 'movie', ['comedy', 'drama']],
  ['Шепотун', 'The Whisperer', 'movie', ['thriller', 'horror']],
  ['Всесвітній потоп', 'The Great Flood', 'movie', ['scifi', 'thriller']],
  ['Нижній бар', 'Lower Bar', 'movie', ['drama']],
  ['Вовчаня', 'Teen Wolf: The Movie', 'movie', ['fantasy', 'action']],
  ['Документальний фільм про ШІ', 'The A.I. Doc', 'movie', ['documentary']],
  ['RAFA', 'RAFA', 'movie', ['documentary', 'sport']],
  ['Моя учителька-восьминога', 'My Octopus Teacher', 'movie', ['documentary']],
  ['Динозаври', 'Walking with Dinosaurs', 'movie', ['documentary']],
  ['Аферист із Tinder', 'The Tinder Swindler', 'movie', ['documentary', 'crime']],
  ['Пізня ніч з дияволом', 'Late Night with the Devil', 'movie', ['horror']],
  ['Тихе місце: Частина II', 'A Quiet Place Part II', 'movie', ['horror', 'thriller']],
  ['Кімната внизу', 'The Room Below', 'movie', ['horror', 'thriller']],
  ['Катастрофа рейсу', 'Flight Disaster', 'movie', ['thriller', 'drama']],
  ['Поховати диявола', 'Bury the Devil', 'movie', ['horror']],
  ['Місія нездійсненна: Розплата', 'Mission: Impossible — Dead Reckoning', 'movie', ['action', 'adventure']],
  ['Уявні друзі', 'IF', 'movie', ['family', 'comedy']],
  ['Той, що біжить по лезу', 'Blade Runner 2049', 'movie', ['scifi', 'thriller']],

  // ——— Серіали
  ['Дім Дракона', 'House of the Dragon', 'series', ['fantasy', 'drama']],
  ['Чужий: Земля', 'Alien: Earth', 'series', ['scifi', 'horror']],
  ['Пінгвін', 'The Penguin', 'series', ['crime', 'drama']],
  ['Задача трьох тіл', '3 Body Problem', 'series', ['scifi', 'drama']],
  ['Спіймати Кайдаша', 'Catch Kaidash', 'series', ['comedy', 'drama']],
  ['Перевізниця', 'The Carrier', 'series', ['thriller']],
  ['Перші дні', 'First Days', 'series', ['drama']],
  ['Тиха нива', 'Quiet Field', 'series', ['drama', 'thriller']],
  ['24', '24', 'series', ['action', 'thriller']],
  ['Лицар Семи Королівств', 'A Knight of the Seven Kingdoms', 'series', ['fantasy', 'adventure']],
  ['Ласкаво просимо в Деррі', 'Welcome to Derry', 'series', ['horror']],
  ['Той, що біжить по лезу 2099', 'Blade Runner 2099', 'series', ['scifi']],
  ['Кристальне озерце', 'Crystal Lake', 'series', ['horror', 'thriller']],
  ['Спартак: Дім Ашура', 'Spartacus: House of Ashur', 'series', ['action', 'drama']],
  ['Тед Лассо', 'Ted Lasso', 'series', ['comedy', 'sport']],
  ['Ебботт Елементарі', 'Abbott Elementary', 'series', ['comedy']],
  ['Шіттс Крік', 'Schitt’s Creek', 'series', ['comedy']],
  ['Дивовижна місіс Мейзел', 'The Marvelous Mrs. Maisel', 'series', ['comedy', 'drama']],
  ['Дівчата Гілмор', 'Gilmore Girls', 'series', ['drama', 'comedy']],
  ['Спайдер-Нуар', 'Spider-Noir', 'series', ['action', 'crime']],
  ['Зоряні ліхтарі', 'Starlight Lanterns', 'series', ['scifi', 'adventure']],
  ['Зоряне місто', 'Star City', 'series', ['scifi', 'drama']],
  ['Сварка', 'Feud', 'series', ['drama']],
  ['Копи на вертольотах', 'Cops on Helicopters', 'series', ['comedy', 'action']],
  ['Бріджертони', 'Bridgerton', 'series', ['romance', 'drama']],
  ['Емілі в Парижі', 'Emily in Paris', 'series', ['romance', 'comedy']],
  ['Чужоземка', 'Outlander', 'series', ['romance', 'fantasy']],
  ['Знову любов', 'Love Again', 'series', ['romance']],
  ['Один день', 'One Day', 'series', ['romance', 'drama']],
  ['Наша планета', 'Our Planet', 'series', ['documentary']],
  ['Останній танець', 'The Last Dance', 'series', ['documentary', 'sport']],
  ['Король тигрів', 'Tiger King', 'series', ['documentary', 'crime']],
  ['Формула 1: Драйв, щоб вижити', 'Formula 1: Drive to Survive', 'series', ['documentary', 'sport']],
  ['Світ очима тварин', 'The World Through Animal Eyes', 'series', ['documentary']],
  ['Закулісся', 'Backrooms', 'series', ['horror']],
  ['Смерть Робіна Гуда', 'Death of Robin Hood', 'series', ['drama', 'action']],
  ['Дивні дива', 'Stranger Things', 'series', ['scifi', 'horror']],
  ['Чорне дзеркало', 'Black Mirror', 'series', ['scifi', 'thriller']],
  ['Штам', 'The Strain', 'series', ['horror', 'thriller']],
  ['Персі Джексон та Олімпійці', 'Percy Jackson and the Olympians', 'series', ['adventure', 'fantasy']],
  ['Ван-Піс', 'One Piece', 'series', ['adventure', 'action']],
  ['Мандалорець', 'The Mandalorian', 'series', ['scifi', 'adventure']],
  ['Зоряний шлях: Дивовижні нові світи', 'Star Trek: Strange New Worlds', 'series', ['scifi', 'adventure']],
  ['Гра Престолів', 'Game of Thrones', 'series', ['fantasy', 'drama']],
  ['Мавка. Справжній міф', 'Mavka. The Real Myth', 'series', ['fantasy', 'drama']],
  ['Надприродне', 'Supernatural', 'series', ['horror', 'drama']],
  ['Гострі картузи', 'Peaky Blinders', 'series', ['crime', 'drama']],
  ['Шерлок', 'Sherlock', 'series', ['crime', 'thriller']],

  // ——— Мультфільми
  ['Аватар: Останній захисник', 'Avatar: The Last Airbender', 'cartoon', ['animation', 'adventure']],
  ['Губка Боб Квадратні Штани', 'SpongeBob SquarePants', 'cartoon', ['animation', 'comedy']],
  ['Легенда про Корру', 'The Legend of Korra', 'cartoon', ['animation', 'adventure']],
  ['Черепашки-ніндзя', 'Teenage Mutant Ninja Turtles', 'cartoon', ['animation', 'action']],
  ['Загарбник Зім', 'Invader Zim', 'cartoon', ['animation', 'comedy']],
  ['Робокар Полі', 'Robocar Poli', 'cartoon', ['animation', 'family']],
  ['Тачки', 'Cars', 'cartoon', ['animation', 'family']],
  ['Віллі: Швидкісний капкейк', 'Wheely: The Speedy Cupcake', 'cartoon', ['animation', 'family']],
  ['Тачки на дорозі', 'Cars on the Road', 'cartoon', ['animation', 'family']],
  ['Вруміз', 'Vroomiz', 'cartoon', ['animation', 'family']],
  ['Дикий робот', 'The Wild Robot', 'cartoon', ['animation', 'adventure']],
  ['ВАЛЛ-І', 'WALL-E', 'cartoon', ['animation', 'scifi']],
  ['Сталевий гігант', 'The Iron Giant', 'cartoon', ['animation', 'scifi']],
  ['Роботи', 'Robots', 'cartoon', ['animation', 'comedy']],
  ['Супер шістка', 'Big Hero 6', 'cartoon', ['animation', 'action']],
  ['Мавка. Лісова пісня', 'Mavka: The Forest Song', 'cartoon', ['animation', 'fantasy']],
  ['Викрадена принцеса', 'The Stolen Princess', 'cartoon', ['animation', 'adventure']],
  ['Микита Кожум’яка', 'Mykyta Kozhumyaka', 'cartoon', ['animation', 'fantasy']],
  ['Клара та чарівний дракон', 'Klara and the Magic Dragon', 'cartoon', ['animation', 'fantasy']],
  ['Бабай', 'Babai', 'cartoon', ['animation', 'comedy']],
  ['Bluey', 'Bluey', 'cartoon', ['animation', 'family']],
  ['Finding Nemo', 'Finding Nemo', 'cartoon', ['animation', 'family']],
  ['Toy Story', 'Toy Story', 'cartoon', ['animation', 'family']],
  ['Inside Out', 'Inside Out', 'cartoon', ['animation', 'family']],
  ['Ґравіті Фолз', 'Gravity Falls', 'cartoon', ['animation', 'adventure']],
  ['Час пригод', 'Adventure Time', 'cartoon', ['animation', 'adventure']],
  ['Голубоокий самурай', 'Blue Eye Samurai', 'cartoon', ['animation', 'action']],
  ['Совиний дім', 'The Owl House', 'cartoon', ['animation', 'fantasy']],
  ['Суперкрила', 'Super Wings', 'cartoon', ['animation', 'family']],
  ['Білосніжка та сім гномів', 'Snow White and the Seven Dwarfs', 'cartoon', ['animation', 'fantasy']],
  ['Русалонька', 'The Little Mermaid', 'cartoon', ['animation', 'fantasy']],
  ['Аладдін', 'Aladdin', 'cartoon', ['animation', 'adventure']],
  ['Мулан', 'Mulan', 'cartoon', ['animation', 'adventure']],
  ['Холодне серце', 'Frozen', 'cartoon', ['animation', 'family']],
  ['Переліт', 'The Flight', 'cartoon', ['animation', 'adventure']],
  ['Вартовий місяця', 'The Moon Guardian', 'cartoon', ['animation', 'fantasy']],
  ['Родина Адамсів', 'The Addams Family', 'cartoon', ['animation', 'comedy']],
  ['Спіріт: Душа прерій', 'Spirit: Stallion of the Cimarron', 'cartoon', ['animation', 'adventure']],
  ['Леді Баг і Супер-Кіт', 'Miraculous: Ladybug & Cat Noir', 'cartoon', ['animation', 'action']],
  ['Посіпаки і Монстрики', 'Minions & Monsters', 'cartoon', ['animation', 'comedy']],
  ['У чужій шкурі', 'Walking in Their Skin', 'cartoon', ['animation', 'comedy']],
]

const BY_UK = new Map<string, number>(DEFS.map((d, i) => [d[0], i]))

function toMedia(i: number, lang: Lang): Media {
  const [uk, en, type, genres] = DEFS[i]
  return {
    id: `d${i}`,
    type,
    title: lang === 'uk' ? uk : en,
    titleEn: en,
    genres,
    hue: (i * 37 + 11) % 360,
  }
}

function pick(titles: string[], lang: Lang): Media[] {
  const out: Media[] = []
  for (const t of titles) {
    const i = BY_UK.get(t)
    if (i !== undefined) out.push(toMedia(i, lang))
  }
  return out
}

interface RowDef {
  key: string
  uk: string
  en: string
  titles: string[]
  to?: string
  variant?: 'wide'
}

function build(defs: RowDef[], lang: Lang): MediaRow[] {
  return defs.map((d) => ({
    key: d.key,
    title: lang === 'uk' ? d.uk : d.en,
    items: pick(d.titles, lang),
    to: d.to,
    variant: d.variant,
  }))
}

const HOME: RowDef[] = [
  {
    key: 'top10',
    uk: 'Топ 10 фільмів і серіалів на Starlicht',
    en: 'Top 10 movies & series on Starlicht',
    variant: 'wide',
    to: '/catalog/movies',
    titles: ['Дім Дракона', 'Мавка. Справжній міф', 'Надприродне', 'Одісея'],
  },
  {
    key: 'new',
    uk: 'Новеньке на Starlicht',
    en: 'New on Starlicht',
    to: '/catalog/movies',
    titles: ['Одісея', 'Людина війни', 'Потяг «Червона рута»', 'Рейс 298', 'Посіпаки і Монстрики'],
  },
  {
    key: 'popular',
    uk: 'Найпопулярніші фільми',
    en: 'Most popular movies',
    to: '/catalog/movies',
    titles: ['Заколот', 'Одісея', 'Шепотун', 'Всесвітній потоп', 'У чужій шкурі'],
  },
  {
    key: 'autumn',
    uk: 'Осінній вайб',
    en: 'Autumn vibes',
    to: '/catalog/series',
    titles: ['Чорне дзеркало', 'Нижній бар', 'Гострі картузи', 'Вовчаня', 'Шерлок'],
  },
  {
    key: 'childhood',
    uk: 'Поринь у своє дитинство',
    en: 'Dive into your childhood',
    to: '/catalog/cartoons',
    titles: ['Переліт', 'Вартовий місяця', 'Родина Адамсів', 'Спіріт: Душа прерій', 'Леді Баг і Супер-Кіт'],
  },
  {
    key: 'ukrainian',
    uk: 'Наше українське',
    en: 'Our Ukrainian',
    to: '/catalog/movies',
    titles: ['Відважна дівчина', 'Пригоди козака Виговського', 'Батьківські збори', 'Перші ластівки', 'Песики'],
  },
]

const MOVIES: RowDef[] = [
  { key: 'top10', uk: 'ТОП 10 фільмів тижня', en: 'Top 10 movies of the week', variant: 'wide', titles: ['Дюна: Частина друга', 'Каскадер', 'Проєкт «Аве Марія»', 'Людина-павук'] },
  { key: 'ukTop', uk: 'Українські ТОП фільми', en: 'Top Ukrainian movies', titles: ['Кіллхаус', 'Потяг у 31 грудня', 'Хрещатик 48/2', 'ГУР. Код: Сікора', 'Ти — космос'] },
  { key: 'premieres', uk: 'Прем’єри', en: 'Premieres', titles: ['Заколот', 'Серце звіра', 'Сузір’я Великого Пса', 'Одісея', 'Людина-павук'] },
  { key: 'evening', uk: 'Фільми на вечір', en: 'Movies for tonight', titles: ['Пікселі', 'Джуманджі', 'Wicked: Чародійка', 'Три мушкетери: Д’Артаньян', 'Мисливці на привидів'] },
  { key: 'y2026', uk: 'Фільми 2026 року', en: 'Movies of 2026', titles: ['Розкриття', 'У сірій зоні', 'Одісея', 'Людина-павук', 'Володарі Всесвіту'] },
  { key: 'romance', uk: 'Романтика', en: 'Romance', titles: ['Відважна дівчина', 'Пригоди козака Виговського', 'Батьківські збори', 'Перші ластівки', 'Песики'] },
  { key: 'docs', uk: 'Документальні фільми', en: 'Documentary films', titles: ['Документальний фільм про ШІ', 'RAFA', 'Моя учителька-восьминога', 'Динозаври', 'Аферист із Tinder'] },
  { key: 'horror', uk: 'Жахи', en: 'Horror', titles: ['Пізня ніч з дияволом', 'Тихе місце: Частина II', 'Кімната внизу', 'Катастрофа рейсу', 'Поховати диявола'] },
  { key: 'adventure', uk: 'Пригоди', en: 'Adventure', titles: ['Проєкт «Аве Марія»', 'Дюна: Частина друга', 'Місія нездійсненна: Розплата', 'Уявні друзі', 'Той, що біжить по лезу'] },
]

const SERIES: RowDef[] = [
  { key: 'top10', uk: 'ТОП 10 серіалів тижня', en: 'Top 10 series of the week', variant: 'wide', titles: ['Дім Дракона', 'Чужий: Земля', 'Пінгвін', 'Задача трьох тіл'] },
  { key: 'ukTop', uk: 'Українські ТОП серіали', en: 'Top Ukrainian series', titles: ['Спіймати Кайдаша', 'Перевізниця', 'Перші дні', 'Тиха нива', '24'] },
  { key: 'premieres', uk: 'Прем’єри', en: 'Premieres', titles: ['Лицар Семи Королівств', 'Ласкаво просимо в Деррі', 'Той, що біжить по лезу 2099', 'Кристальне озерце', 'Спартак: Дім Ашура'] },
  { key: 'evening', uk: 'Серіали на вечір', en: 'Series for tonight', titles: ['Тед Лассо', 'Ебботт Елементарі', 'Шіттс Крік', 'Дивовижна місіс Мейзел', 'Дівчата Гілмор'] },
  { key: 'y2026', uk: 'Серіали 2026 року', en: 'Series of 2026', titles: ['Спайдер-Нуар', 'Зоряні ліхтарі', 'Зоряне місто', 'Сварка', 'Копи на вертольотах'] },
  { key: 'romance', uk: 'Романтика', en: 'Romance', titles: ['Бріджертони', 'Емілі в Парижі', 'Чужоземка', 'Знову любов', 'Один день'] },
  { key: 'docs', uk: 'Документальні серіали', en: 'Documentary series', titles: ['Наша планета', 'Останній танець', 'Король тигрів', 'Формула 1: Драйв, щоб вижити', 'Світ очима тварин'] },
  { key: 'horror', uk: 'Жахи', en: 'Horror', titles: ['Закулісся', 'Смерть Робіна Гуда', 'Дивні дива', 'Чорне дзеркало', 'Штам'] },
  { key: 'adventure', uk: 'Пригоди', en: 'Adventure', titles: ['Персі Джексон та Олімпійці', 'Ван-Піс', 'Мандалорець', 'Зоряний шлях: Дивовижні нові світи', 'Гра Престолів'] },
]

const CARTOONS: RowDef[] = [
  { key: 'top', uk: 'Найкращі ТОП мультфільми', en: 'Best top cartoons', titles: ['Аватар: Останній захисник', 'Губка Боб Квадратні Штани', 'Легенда про Корру', 'Черепашки-ніндзя', 'Загарбник Зім'] },
  { key: 'cars', uk: 'Мультфільми про машини', en: 'Cartoons about cars', titles: ['Робокар Полі', 'Тачки', 'Віллі: Швидкісний капкейк', 'Тачки на дорозі', 'Вруміз'] },
  { key: 'robots', uk: 'Мультфільми про роботів', en: 'Cartoons about robots', titles: ['Дикий робот', 'ВАЛЛ-І', 'Сталевий гігант', 'Роботи', 'Супер шістка'] },
  { key: 'ukrainian', uk: 'Українські мультфільми', en: 'Ukrainian cartoons', titles: ['Мавка. Лісова пісня', 'Викрадена принцеса', 'Микита Кожум’яка', 'Клара та чарівний дракон', 'Бабай'] },
  { key: 'english', uk: 'Мультфільми англійською мовою', en: 'English-language cartoons', titles: ['Bluey', 'Finding Nemo', 'Тачки', 'Toy Story', 'Inside Out'] },
  { key: 'multiseries', uk: 'Мультсеріали', en: 'Animated series', titles: ['Ґравіті Фолз', 'Час пригод', 'Голубоокий самурай', 'Совиний дім', 'Суперкрила'] },
  { key: 'disney', uk: 'Чарівний світ Disney', en: 'The magical world of Disney', titles: ['Білосніжка та сім гномів', 'Русалонька', 'Аладдін', 'Мулан', 'Холодне серце'] },
]

export function homeRows(lang: Lang): MediaRow[] {
  return build(HOME, lang)
}

export function catalogRows(type: MediaType, lang: Lang): MediaRow[] {
  const defs = type === 'movie' ? MOVIES : type === 'series' ? SERIES : CARTOONS
  return build(defs, lang).map((r) => ({ ...r, to: `/catalog/${TYPE_TO_SLUG[type]}` }))
}

export function search(query: string, lang: Lang): Media[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const out: Media[] = []
  DEFS.forEach((d, i) => {
    if (d[0].toLowerCase().includes(q) || d[1].toLowerCase().includes(q)) out.push(toMedia(i, lang))
  })
  return out.slice(0, 60)
}

export function mediaById(id: string, lang: Lang): Media | null {
  const m = /^d(\d+)$/.exec(id)
  if (!m) return null
  const i = Number(m[1])
  return i >= 0 && i < DEFS.length ? toMedia(i, lang) : null
}

/** Порядковий номер у демо-каталозі — для вибору відео-прикладу. */
export function indexOf(id: string): number {
  const m = /^d(\d+)$/.exec(id)
  return m ? Number(m[1]) : 0
}
