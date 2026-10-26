import { useT } from '../../i18n'
import type { PlanId } from '../../data/admin'
import type { Lang } from '../../types'

export const locale = (lang: Lang) => (lang === 'uk' ? 'uk-UA' : 'en-GB')

export function useMoney(lang: Lang) {
  const t = useT()
  return (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toLocaleString(locale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('admin.million')} ${t('admin.currency')}`
      : `${n.toLocaleString(locale(lang))} ${t('admin.currency')}`
}

export const shortDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(locale(lang), { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))

const PLAN_NAME: Record<PlanId, Record<Lang, string>> = {
  basic: { uk: 'Стартова', en: 'Starter' },
  standard: { uk: 'Оптимальна', en: 'Optimal' },
  premium: { uk: 'Преміум', en: 'Premium' },
}
export const planName = (p: PlanId, lang: Lang) => PLAN_NAME[p][lang]


