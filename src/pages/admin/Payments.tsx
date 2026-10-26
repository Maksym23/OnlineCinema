import { useMemo, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { Pager, PayStatus } from '../../components/admin/parts'
import { planName, shortDate, useMoney } from '../../components/admin/format'
import { getPayments } from '../../data/admin'
import { useT } from '../../i18n'

const PER = 10

export default function Payments() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const money = useMoney(lang)
  const [page, setPage] = useState(1)
  const list = useMemo(() => getPayments(lang), [lang])
  const total = list.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const rows = list.slice((page - 1) * PER, page * PER)

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{t('admin.payments.title')}</h1>
          <p className="muted small">{t('admin.payments.total')}: <strong>{money(total)}</strong></p>
        </div>
      </div>
      <section className="adm-card">
        <div className="adm-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>{t('admin.col.date')}</th>
                <th>{t('admin.col.user')}</th>
                <th>{t('admin.col.plan')}</th>
                <th>{t('admin.col.method')}</th>
                <th>{t('admin.col.status')}</th>
                <th className="right">{t('admin.col.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{shortDate(p.date, lang)}</td>
                  <td><strong>{p.user}</strong></td>
                  <td>{planName(p.plan, lang)}</td>
                  <td>{p.method}</td>
                  <td><PayStatus status={p.status} /></td>
                  <td className="right">{p.amount} {t('admin.currency')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} onPage={setPage} />
      </section>
      <p className="muted small adm-note">{t('admin.demoNote')}</p>
    </>
  )
}
