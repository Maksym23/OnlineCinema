import type { Lang } from '../types'
import { hash } from '../lib/format'

/** Демо-дані адмін-панелі: усе згенеровано, жодних реальних людей і платежів. */

export type UserStatus = 'active' | 'pending' | 'blocked'
export type PlanId = 'basic' | 'standard' | 'premium'

export interface AdminUser {
  id: string
  name: string
  initials: string
  phone: string
  email: string
  plan: PlanId | null
  status: UserStatus
  /** ISO-дата реєстрації */
  registered: string
}

const NAMES: [uk: string, en: string][] = [
  ['Олександра Коваленко', 'Oleksandra Kovalenko'],
  ['Дмитро Шевченко', 'Dmytro Shevchenko'],
  ['Ірина Мельник', 'Iryna Melnyk'],
  ['Андрій Лисенко', 'Andrii Lysenko'],
  ['Софія Бондар', 'Sofiia Bondar'],
  ['Максим Ткаченко', 'Maksym Tkachenko'],
  ['Наталія Кравченко', 'Nataliia Kravchenko'],
  ['Олег Савченко', 'Oleh Savchenko'],
  ['Вікторія Поліщук', 'Viktoriia Polishchuk'],
  ['Богдан Руденко', 'Bohdan Rudenko'],
  ['Каріна Мороз', 'Karina Moroz'],
  ['Тарас Гончаренко', 'Taras Honcharenko'],
]
const PLANS: (PlanId | null)[] = ['standard', 'premium', 'basic', 'standard', 'premium', null, 'basic', 'standard']
const STATUSES: UserStatus[] = ['active', 'active', 'pending', 'blocked', 'active', 'active', 'pending', 'active']
const OPERATORS = ['67', '50', '63', '93', '96', '73']

const pad = (n: number) => String(n).padStart(2, '0')

/** Перші п’ять записів збігаються з макетом дашборда. */
const DESIGN_FIRST: { phone: string; plan: PlanId | null; status: UserStatus }[] = [
  { phone: '+380 67 123 45 67', plan: 'standard', status: 'active' },
  { phone: '+380 50 987 65 43', plan: 'premium', status: 'active' },
  { phone: '+380 93 456 12 78', plan: 'basic', status: 'pending' },
  { phone: '+380 66 321 09 87', plan: 'standard', status: 'blocked' },
  { phone: '+380 73 555 44 21', plan: 'premium', status: 'active' },
]

export function getUsers(lang: Lang): AdminUser[] {
  return Array.from({ length: 36 }, (_, i) => {
    const [uk, en] = NAMES[i % NAMES.length]
    const name = lang === 'uk' ? uk : en
    const h = hash(en + i)
    const day = new Date(Date.UTC(2026, 9, i < 5 ? 14 - i : 14 - Math.floor(i * 1.3)))
    const fixed = DESIGN_FIRST[i]
    return {
      id: `u${i + 1}`,
      name,
      initials: name
        .split(' ')
        .map((w) => w[0])
        .join(''),
      phone: fixed?.phone ?? `+380 ${OPERATORS[h % OPERATORS.length]} ${String(100 + (h % 900))} ${pad(h % 100)} ${pad((h >> 3) % 100)}`,
      email: `${en.toLowerCase().replace(/[^a-z]+/g, '.')}${i}@example.com`,
      plan: fixed ? fixed.plan : PLANS[(i * 3 + 1) % PLANS.length],
      status: fixed ? fixed.status : STATUSES[(i * 5 + 2) % STATUSES.length],
      registered: day.toISOString(),
    }
  })
}

export type PaymentStatus = 'paid' | 'refund' | 'failed'
export interface Payment {
  id: string
  date: string
  user: string
  plan: PlanId
  amount: number
  method: 'Mastercard' | 'VISA'
  status: PaymentStatus
}

const PRICE: Record<PlanId, number> = { basic: 100, standard: 200, premium: 400 }
export const planPrice = (p: PlanId) => PRICE[p]

export function getPayments(lang: Lang): Payment[] {
  const users = getUsers(lang).filter((u) => u.plan)
  return users.slice(0, 30).map((u, i) => {
    const plan = u.plan as PlanId
    return {
      id: `p${1000 + i}`,
      date: new Date(Date.UTC(2026, 9, 18 - Math.floor(i / 2), 9 + (i % 9), (i * 7) % 60)).toISOString(),
      user: u.name,
      plan,
      amount: PRICE[plan],
      method: i % 3 === 0 ? 'VISA' : 'Mastercard',
      status: i % 11 === 4 ? 'refund' : i % 13 === 7 ? 'failed' : 'paid',
    }
  })
}

export interface Kpi {
  key: 'users' | 'subs' | 'revenue' | 'views'
  value: number
  /** зміна до минулого місяця, % */
  delta: number
}

export const KPIS: Kpi[] = [
  { key: 'users', value: 48320, delta: 8.4 },
  { key: 'subs', value: 31905, delta: 5.1 },
  { key: 'revenue', value: 5_480_000, delta: 12.3 },
  { key: 'views', value: 1_260_000, delta: -2.1 },
]

export const SUBSCRIBERS: Record<PlanId, number> = { basic: 9840, standard: 14260, premium: 7805 }
export const ADDON_SUBS = [
  { id: 'kids', price: 90, count: 4120 },
  { id: 'adult', price: 70, count: 2380 },
  { id: 'youtube', price: 70, count: 3015 },
]
