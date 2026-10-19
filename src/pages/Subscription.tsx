import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { getPlans } from '../data/content'
import { updateProfile } from '../features/authSlice'
import { showToast } from '../features/uiSlice'
import { useT } from '../i18n'

export default function Subscription() {
  const t = useT()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const lang = useAppSelector((s) => s.ui.lang)
  const user = useAppSelector((s) => s.auth.user)
  const [busy, setBusy] = useState<string | null>(null)
  const plans = getPlans(lang)

  const choose = async (planId: string | null) => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    setBusy(planId ?? 'cancel')
    const res = await dispatch(updateProfile({ email: user.email, plan: planId }))
    setBusy(null)
    if (updateProfile.fulfilled.match(res)) {
      const name = plans.find((p) => p.id === planId)?.name ?? ''
      dispatch(showToast(planId ? t('plans.changed', { name }) : t('plans.cancelled')))
    }
  }

  return (
    <>
      <div className="page-head center">
        <h1>{t('plans.title')}</h1>
        <p className="muted">{t('plans.subtitle')}</p>
      </div>

      <div className="plans">
        {plans.map((p) => {
          const current = user?.plan === p.id
          return (
            <article key={p.id} className={`plan${p.popular ? ' popular' : ''}${current ? ' current' : ''}`}>
              {p.popular && <span className="badge">{t('plans.popular')}</span>}
              <h2>{p.name}</h2>
              <p className="price">
                <strong>{p.price}</strong> <span>{t('plans.perMonth')}</span>
              </p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                type="button"
                className={current ? 'btn btn-outline' : 'btn'}
                disabled={current || busy !== null}
                onClick={() => choose(p.id)}
              >
                {current ? t('plans.current') : t('plans.choose')}
              </button>
            </article>
          )
        })}
      </div>

      <div className="plans-foot">
        <p className="muted small">{t('plans.demoNote')}</p>
        {user?.plan && (
          <button type="button" className="link" disabled={busy !== null} onClick={() => choose(null)}>
            {t('plans.cancel')}
          </button>
        )}
      </div>
    </>
  )
}
