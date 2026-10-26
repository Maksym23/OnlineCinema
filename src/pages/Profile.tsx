import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useMediaListQuery } from '../api/baseApi'
import Breadcrumbs from '../components/Breadcrumbs'
import PosterCard from '../components/PosterCard'
import { getPlans } from '../data/content'
import { logout, updateProfile } from '../features/authSlice'
import { setLang, setTheme, showToast } from '../features/uiSlice'
import { useT } from '../i18n'
import type { TKey } from '../i18n'
import { formatDate } from '../lib/format'
import type { GenreKey, Lang, Theme } from '../types'

const TABS = ['videos', 'overview', 'devices', 'settings', 'billing'] as const
type Tab = (typeof TABS)[number]
const TAB_LABEL: Record<Tab, TKey> = {
  videos: 'profile.tabVideos',
  overview: 'profile.tabOverview',
  devices: 'profile.tabDevices',
  settings: 'profile.tabSettings',
  billing: 'profile.tabBilling',
}

const MAX_DEVICES: Record<string, number> = { basic: 1, standard: 2, premium: 5 }
// «наступна оплата» у демо — через 30 днів від моменту відкриття застосунку
const NEXT_PAYMENT = new Date(Date.now() + 30 * 86_400_000).toISOString()

export default function Profile() {
  const t = useT()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { lang, theme } = useAppSelector((s) => s.ui)
  const history = useAppSelector((s) => s.history.items)
  const favIds = useAppSelector((s) => s.favorites.ids)
  const [params, setParams] = useSearchParams()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [devices, setDevices] = useState(['Chrome · Windows', 'iPhone 15', 'Smart TV'])

  const histIds = useMemo(() => history.map((h) => h.id), [history])
  const allIds = useMemo(() => [...new Set([...histIds, ...favIds])], [histIds, favIds])
  const { data: media } = useMediaListQuery({ ids: allIds, lang }, { skip: allIds.length === 0 })

  if (!user) return <Navigate to="/login" replace />

  const tabParam = params.get('tab')
  const tab: Tab = TABS.find((x) => x === tabParam) ?? 'overview'
  const plan = getPlans(lang).find((p) => p.id === user.plan)
  const maxDevices = user.plan ? (MAX_DEVICES[user.plan] ?? 1) : 1
  const usedDevices = Math.min(devices.length + 1, maxDevices)

  const byId = new Map((media ?? []).map((m) => [m.id, m]))
  const watched = histIds.map((id) => byId.get(id)).filter((m) => m !== undefined)
  const favorites = favIds.map((id) => byId.get(id)).filter((m) => m !== undefined)

  const hours = history.reduce((sum, h) => sum + h.position, 0) / 3600
  const genreCount = new Map<GenreKey, number>()
  watched.forEach((m) => m.genres.forEach((g) => genreCount.set(g, (genreCount.get(g) ?? 0) + 1)))
  const topGenre = [...genreCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || (trimmed === user.name && phone.trim() === (user.phone ?? ''))) return
    setSaving(true)
    const res = await dispatch(updateProfile({ email: user.email, name: trimmed, phone: phone.trim() }))
    setSaving(false)
    if (updateProfile.fulfilled.match(res)) dispatch(showToast(t('profile.saved')))
  }

  const setTab = (next: Tab) => setParams({ tab: next }, { replace: true })

  return (
    <>
      <Breadcrumbs items={[{ label: t('crumb.home'), to: '/' }, { label: t('profile.title') }]} />

      <div className="profile-top">
        <section className="panel profile-card">
          <div className="avatar" aria-hidden="true">
            {(user.name[0] ?? '?').toUpperCase()}
          </div>
          <div className="profile-who">
            <h1>{user.name}</h1>
            <p className="muted small">{user.email}</p>
            <p className="small">{t('profile.devices', { used: usedDevices, max: maxDevices })}</p>
            <div className="profile-btns">
              <button type="button" className="btn btn-sm" onClick={() => setTab('settings')}>
                {t('profile.edit')}
              </button>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline btn-sm">
                  {t('profile.adminLink')}
                </Link>
              )}
              <button type="button" className="btn btn-outline btn-sm" onClick={() => dispatch(logout())}>
                {t('profile.logout')}
              </button>
            </div>
          </div>
        </section>

        <section className="panel plan-card">
          <div className="plan-card-head">
            <strong className="accent">{plan?.name ?? t('profile.noPlan')}</strong>
            {plan?.popular && <span className="badge-inline">{t('plans.popular')}</span>}
          </div>
          {plan && (
            <>
              <p className="muted small">{t('profile.nextPayment', { date: formatDate(NEXT_PAYMENT, lang) })}</p>
              <p className="plan-price">
                {plan.price} {t('plans.perMonth').split('/')[0].trim()}
              </p>
            </>
          )}
          <Link to="/subscription" className="btn btn-white btn-sm">
            {t('profile.changePlan')}
          </Link>
        </section>
      </div>

      <div className="tabbar" role="tablist" aria-label={t('profile.title')}>
        {TABS.map((x) => (
          <button
            key={x}
            type="button"
            role="tab"
            aria-selected={tab === x}
            className={tab === x ? 'tab on' : 'tab'}
            onClick={() => setTab(x)}
          >
            {t(TAB_LABEL[x])}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="stats">
            <div className="stat">
              <strong>{hours < 10 ? hours.toFixed(1) : Math.round(hours)}</strong>
              <span>{t('profile.hours')}</span>
            </div>
            <div className="stat">
              <strong>{history.length}</strong>
              <span>{t('profile.watchedCount')}</span>
            </div>
            <div className="stat">
              <strong>{topGenre ? t(`genre.${topGenre}` as const) : t('profile.noGenre')}</strong>
              <span>{t('profile.favGenre')}</span>
            </div>
          </div>
          <section className="section">
            <div className="section-head">
              <h2>{t('profile.continue')}</h2>
            </div>
            {watched.length === 0 ? (
              <p className="muted">{t('profile.noHistory')}</p>
            ) : (
              <div className="grid grid-poster">
                {watched.slice(0, 5).map((m) => (
                  <PosterCard key={m.id} item={m} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {tab === 'videos' && (
        <section className="section">
          {favorites.length === 0 ? (
            <p className="muted">{t('favorites.empty')}</p>
          ) : (
            <div className="grid grid-wrap">
              {favorites.map((m) => (
                <PosterCard key={m.id} item={m} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'devices' && (
        <section className="panel">
          <ul className="device-list">
            <li>
              <span>{t('profile.thisDevice')}</span>
            </li>
            {devices.map((d) => (
              <li key={d}>
                <span>{d}</span>
                <button type="button" className="link" onClick={() => setDevices((list) => list.filter((x) => x !== d))}>
                  {t('profile.removeDevice')}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'settings' && (
        <div className="profile-grid">
          <section className="panel">
            <form onSubmit={onSave} className="form">
              <label className="field">
                <span>{t('profile.name')}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required />
              </label>
              <label className="field">
                <span>{t('profile.phone')}</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+380 __ ___ __ __" />
              </label>
              <label className="field">
                <span>{t('profile.email')}</span>
                <input value={user.email} readOnly />
              </label>
              <button type="submit" className="btn" disabled={saving || !name.trim() || (name.trim() === user.name && phone.trim() === (user.phone ?? ''))}>
                {t('profile.save')}
              </button>
            </form>
          </section>
          <section className="panel">
            <h2>{t('profile.settings')}</h2>
            <div className="field">
              <span id="lang-label">{t('profile.language')}</span>
              <div className="segmented" role="radiogroup" aria-labelledby="lang-label">
                {(['uk', 'en'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={lang === l}
                    className={lang === l ? 'on' : ''}
                    onClick={() => dispatch(setLang(l))}
                  >
                    {l === 'uk' ? 'Українська' : 'English'}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <span id="theme-label">{t('profile.theme')}</span>
              <div className="segmented" role="radiogroup" aria-labelledby="theme-label">
                {(['dark', 'light'] as Theme[]).map((th) => (
                  <button
                    key={th}
                    type="button"
                    role="radio"
                    aria-checked={theme === th}
                    className={theme === th ? 'on' : ''}
                    onClick={() => dispatch(setTheme(th))}
                  >
                    {th === 'dark' ? t('profile.themeDark') : t('profile.themeLight')}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === 'billing' && (
        <section className="panel">
          {plan ? (
            <p>
              Mastercard •••• 4242 · {plan.name} — {plan.price} {t('plans.perMonth')}
            </p>
          ) : (
            <p className="muted">{t('profile.noBilling')}</p>
          )}
          <p className="muted small">{t('profile.billingDemo')}</p>
        </section>
      )}
    </>
  )
}
