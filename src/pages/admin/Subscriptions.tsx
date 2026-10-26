import { useAppSelector } from '../../app/hooks'
import { locale, planName, useMoney } from '../../components/admin/format'
import { ADDON_SUBS, SUBSCRIBERS, planPrice } from '../../data/admin'
import type { PlanId } from '../../data/admin'
import { useT } from '../../i18n'

const ADDON_NAME: Record<string, { uk: string; en: string }> = {
  kids: { uk: 'Дитячий', en: 'Kids' },
  adult: { uk: 'Дорослий', en: 'Adult' },
  youtube: { uk: 'YouTube Premium', en: 'YouTube Premium' },
}

export default function Subscriptions() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const money = useMoney(lang)
  const num = (n: number) => n.toLocaleString(locale(lang))
  const plans = Object.keys(SUBSCRIBERS) as PlanId[]

  return (
    <>
      <div className="adm-head"><h1>{t('admin.subs.title')}</h1></div>
      {[
        { title: t('admin.subs.plans'), rows: plans.map((p) => ({ k: p, name: planName(p, lang), price: planPrice(p), n: SUBSCRIBERS[p] })) },
        { title: t('admin.subs.addons'), rows: ADDON_SUBS.map((a) => ({ k: a.id, name: ADDON_NAME[a.id]?.[lang] ?? a.id, price: a.price, n: a.count })) },
      ].map((g) => (
        <section key={g.title} className="adm-card">
          <div className="adm-card-head"><h2>{g.title}</h2></div>
          <div className="adm-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.col.title')}</th>
                  <th className="right">{t('admin.col.price')}</th>
                  <th className="right">{t('admin.col.count')}</th>
                  <th className="right">{t('admin.col.revenue')}</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.k}>
                    <td><strong>{r.name}</strong></td>
                    <td className="right">{r.price} {t('admin.currency')}</td>
                    <td className="right">{num(r.n)}</td>
                    <td className="right">{money(r.price * r.n)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <p className="muted small adm-note">{t('admin.demoNote')}</p>
    </>
  )
}
