import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Pager, PlanBadge, StatusText } from '../../components/admin/parts'
import { shortDate } from '../../components/admin/format'
import { getUsers } from '../../data/admin'
import type { PlanId, UserStatus } from '../../data/admin'
import { showToast } from '../../features/uiSlice'
import { useT } from '../../i18n'
import { load, save } from '../../lib/storage'

const PER = 10
const BLOCK_KEY = 'starlicht_admin_blocked'

export default function Users() {
  const t = useT()
  const dispatch = useAppDispatch()
  const lang = useAppSelector((s) => s.ui.lang)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [plan, setPlan] = useState<'' | PlanId>('')
  const [status, setStatus] = useState<'' | UserStatus>('')
  const [page, setPage] = useState(1)
  const [overrides, setOverrides] = useState<Record<string, UserStatus>>(() => load(BLOCK_KEY, {}))

  const all = useMemo(() => getUsers(lang).map((u) => ({ ...u, status: overrides[u.id] ?? u.status })), [lang, overrides])
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return all.filter(
      (u) =>
        (!plan || u.plan === plan) &&
        (!status || u.status === status) &&
        (!n || `${u.name} ${u.phone} ${u.email}`.toLowerCase().includes(n)),
    )
  }, [all, q, plan, status])
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const cur = Math.min(page, pages)
  const rows = list.slice((cur - 1) * PER, cur * PER)

  const toggle = (id: string, name: string, now: UserStatus) => {
    const next: UserStatus = now === 'blocked' ? 'active' : 'blocked'
    const o = { ...overrides, [id]: next }
    setOverrides(o)
    save(BLOCK_KEY, o)
    dispatch(showToast(`${name}: ${t(next === 'blocked' ? 'admin.status.blocked' : 'admin.status.active')}`))
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{t('admin.users.title')}</h1>
          <p className="muted small">{t('admin.users.found', { n: list.length })}</p>
        </div>
      </div>
      <div className="adm-filters">
        <input
          className="adm-select grow"
          type="search"
          value={q}
          placeholder={t('admin.users.search')}
          aria-label={t('admin.users.search')}
          onChange={(e) => {
            setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })
            setPage(1)
          }}
        />
        <select className="adm-select" value={plan} aria-label={t('admin.col.plan')} onChange={(e) => { setPlan(e.target.value as '' | PlanId); setPage(1) }}>
          <option value="">{t('admin.users.allPlans')}</option>
          <option value="basic">Starter</option>
          <option value="standard">Optimal</option>
          <option value="premium">Premium</option>
        </select>
        <select className="adm-select" value={status} aria-label={t('admin.col.status')} onChange={(e) => { setStatus(e.target.value as '' | UserStatus); setPage(1) }}>
          <option value="">{t('admin.users.allStatuses')}</option>
          <option value="active">{t('admin.status.active')}</option>
          <option value="pending">{t('admin.status.pending')}</option>
          <option value="blocked">{t('admin.status.blocked')}</option>
        </select>
      </div>
      <section className="adm-card">
        {rows.length === 0 ? (
          <p className="muted adm-empty">{t('admin.users.empty')}</p>
        ) : (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.col.user')}</th>
                  <th>{t('admin.col.plan')}</th>
                  <th>{t('admin.col.status')}</th>
                  <th>{t('admin.col.registered')}</th>
                  <th className="right">{t('admin.col.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="adm-person">
                        <span className="adm-initials" aria-hidden="true">{u.initials}</span>
                        <span>
                          <strong>{u.name}</strong>
                          <span className="muted small">{u.phone} · {u.email}</span>
                        </span>
                      </div>
                    </td>
                    <td><PlanBadge plan={u.plan} lang={lang} /></td>
                    <td><StatusText status={u.status} /></td>
                    <td>{shortDate(u.registered, lang)}</td>
                    <td className="right">
                      <button type="button" className="btn btn-dark btn-sm" onClick={() => toggle(u.id, u.name, u.status)}>
                        {t(u.status === 'blocked' ? 'admin.users.unblock' : 'admin.users.block')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={cur} pages={pages} onPage={setPage} />
      </section>
    </>
  )
}
