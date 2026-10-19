import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { getPlans } from '../data/content'
import { logout, updateProfile } from '../features/authSlice'
import { setLang, setTheme, showToast } from '../features/uiSlice'
import { useT } from '../i18n'
import type { Lang, Theme } from '../types'

export default function Profile() {
  const t = useT()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { lang, theme } = useAppSelector((s) => s.ui)
  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  const plan = getPlans(lang).find((p) => p.id === user.plan)

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed === user.name) return
    setSaving(true)
    const res = await dispatch(updateProfile({ email: user.email, name: trimmed }))
    setSaving(false)
    if (updateProfile.fulfilled.match(res)) dispatch(showToast(t('profile.saved')))
  }

  return (
    <>
      <div className="page-head">
        <h1>{t('profile.title')}</h1>
      </div>

      <div className="profile-grid">
        <section className="panel">
          <div className="avatar" aria-hidden="true">
            {(user.name[0] ?? '?').toUpperCase()}
          </div>
          <form onSubmit={onSave} className="form">
            <label className="field">
              <span>{t('profile.name')}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required />
            </label>
            <label className="field">
              <span>{t('profile.email')}</span>
              <input value={user.email} readOnly />
            </label>
            <div className="field">
              <span>{t('profile.plan')}</span>
              <div className="plan-line">
                <strong>{plan?.name ?? t('profile.noPlan')}</strong>
                <Link to="/subscription" className="link">
                  {t('profile.managePlan')}
                </Link>
              </div>
            </div>
            <button type="submit" className="btn" disabled={saving || !name.trim() || name.trim() === user.name}>
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
          <button type="button" className="btn btn-outline" onClick={() => dispatch(logout())}>
            {t('profile.logout')}
          </button>
        </section>
      </div>
    </>
  )
}
