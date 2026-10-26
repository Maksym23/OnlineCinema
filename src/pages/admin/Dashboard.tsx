import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import AddFilmModal from '../../components/admin/AddFilmModal'
import { PlanBadge, StatusText } from '../../components/admin/parts'
import { locale, shortDate, useMoney } from '../../components/admin/format'
import { PlusIcon } from '../../components/Icons'
import { KPIS, getUsers } from '../../data/admin'
import { useT } from '../../i18n'
import type { TKey } from '../../i18n'

export default function Dashboard() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const money = useMoney(lang)
  const [adding, setAdding] = useState(false)
  const recent = getUsers(lang).slice(0, 5)
  const month = new Intl.DateTimeFormat(locale(lang), { month: 'long', year: 'numeric' }).format(new Date(Date.UTC(2026, 9, 15))).replace(/\s*р\.$/, '')

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{t('admin.dashboard.title')}</h1>
          <p className="muted small">{t('admin.dashboard.sub', { month })}</p>
        </div>
        <button type="button" className="btn btn-sm" onClick={() => setAdding(true)}>
          <PlusIcon size={14} /> {t('admin.addFilm')}
        </button>
      </div>

      <div className="adm-kpis">
        {KPIS.map((k) => {
          const up = k.delta >= 0
          const value =
            k.key === 'revenue'
              ? money(k.value)
              : k.key === 'views'
                ? new Intl.NumberFormat(locale(lang), { notation: 'compact', maximumFractionDigits: 2 }).format(k.value)
                : k.value.toLocaleString(locale(lang))
          return (
            <article key={k.key} className="adm-kpi">
              <p className="muted small">{t(`admin.kpi.${k.key}` as TKey)}</p>
              <strong>{value}</strong>
              <p className="small">
                <span className={up ? 'delta up' : 'delta down'}>
                  {up ? '+' : '−'}
                  {Math.abs(k.delta).toLocaleString(locale(lang), { minimumFractionDigits: 1 })}%
                </span>{' '}
                <span className="muted">{t('admin.kpi.vsLast')}</span>
              </p>
            </article>
          )
        })}
      </div>

      <section className="adm-card adm-recent">
        <div className="adm-card-head">
          <h2>{t('admin.recentUsers')}</h2>
          <Link to="/admin/users" className="link small">
            {t('admin.allUsers')} →
          </Link>
        </div>
        <div className="adm-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>{t('admin.col.user')}</th>
                <th>{t('admin.col.plan')}</th>
                <th className="center">{t('admin.col.status')}</th>
                <th className="right">{t('admin.col.registered')}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="adm-person">
                      <span className="adm-initials" aria-hidden="true">
                        {u.initials}
                      </span>
                      <span>
                        <strong>{u.name}</strong>
                        <span className="muted small">{u.phone}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <PlanBadge plan={u.plan} lang={lang} />
                  </td>
                  <td className="center">
                    <StatusText status={u.status} />
                  </td>
                  <td className="right">{shortDate(u.registered, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="muted small adm-note">{t('admin.demoNote')}</p>

      {adding && <AddFilmModal onClose={() => setAdding(false)} />}
    </>
  )
}
