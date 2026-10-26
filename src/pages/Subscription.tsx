import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Breadcrumbs from '../components/Breadcrumbs'
import { getAddons, getPlans } from '../data/content'
import { updateProfile } from '../features/authSlice'
import { showToast } from '../features/uiSlice'
import { useT } from '../i18n'
import type { TKey } from '../i18n'
import { artStyle } from '../lib/format'
import { load, save } from '../lib/storage'

const PERKS: { title: TKey; text: TKey; hue: number; img: string }[] = [
  { title: 'plans.perk1Title', text: 'plans.perk1Text', hue: 232, img: 'movies' },
  { title: 'plans.perk2Title', text: 'plans.perk2Text', hue: 350, img: 'tv' },
  { title: 'plans.perk3Title', text: 'plans.perk3Text', hue: 140, img: 'cartoons' },
]

const DEVICES = ['Android', 'iOS', 'Smart TV', 'Apple TV', 'Web']
const addonsKey = (email: string) => `starlicht_addons_${email}`

export default function Subscription() {
  const t = useT()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const lang = useAppSelector((s) => s.ui.lang)
  const user = useAppSelector((s) => s.auth.user)
  const [busy, setBusy] = useState<string | null>(null)
  const [enabled, setEnabled] = useState<string[]>(() => (user ? load<string[]>(addonsKey(user.email), []) : []))
  const plans = getPlans(lang)
  const addons = getAddons(lang)

  const needLogin = () => navigate('/login', { state: { from: location } })

  const choose = async (planId: string | null) => {
    if (!user) return needLogin()
    setBusy(planId ?? 'cancel')
    const res = await dispatch(updateProfile({ email: user.email, plan: planId }))
    setBusy(null)
    if (updateProfile.fulfilled.match(res)) {
      const name = plans.find((p) => p.id === planId)?.name ?? ''
      dispatch(showToast(planId ? t('plans.changed', { name }) : t('plans.cancelled')))
    }
  }

  const toggleAddon = (id: string, name: string) => {
    if (!user) return needLogin()
    const on = enabled.includes(id)
    const next = on ? enabled.filter((x) => x !== id) : [...enabled, id]
    setEnabled(next)
    save(addonsKey(user.email), next)
    dispatch(showToast(t(on ? 'plans.extraRemoved' : 'plans.extraAdded', { name })))
  }

  return (
    <>
      <Breadcrumbs items={[{ label: t('crumb.home'), to: '/' }, { label: t('plans.title') }]} />
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
              <div className="highlights">
                {p.highlights.map((h) => (
                  <p key={h.label}>
                    <strong>{h.value}</strong>
                    <span>{h.label}</span>
                  </p>
                ))}
              </div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                type="button"
                className={current ? 'btn btn-outline' : p.popular ? 'btn' : 'btn btn-white'}
                disabled={current || busy !== null}
                onClick={() => choose(p.id)}
              >
                {current ? t('plans.current') : t('plans.choose')}
              </button>
            </article>
          )
        })}
      </div>

      <section className="dx-section">
        <h2>{t('plans.extra')}</h2>
        <p className="muted small">{t('plans.extraHint')}</p>
        <div className="addons">
          {addons.map((a) => {
            const on = enabled.includes(a.id)
            return (
              <div key={a.id} className="addon">
                <div>
                  <strong>{a.name}</strong>
                  <p className="muted small">
                    {a.price} {t('plans.perMonth')}
                  </p>
                </div>
                <button
                  type="button"
                  className={on ? 'btn btn-outline btn-sm' : 'btn btn-white btn-sm'}
                  aria-pressed={on}
                  onClick={() => toggleAddon(a.id, a.name)}
                >
                  {on ? t('plans.subscribed') : t('plans.subscribe')}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="pay-row">
        <h2>{t('plans.payment')}</h2>
        <span className="pay-badge mastercard">Mastercard</span>
        <span className="pay-badge visa">VISA</span>
      </section>

      <section className="dx-section">
        <h2>{t('plans.youGet')}</h2>
        <div className="perks">
          {PERKS.map((p, i) => (
            <article key={p.title} className={i % 2 ? 'perk flip' : 'perk'}>
              <div className="perk-art" style={artStyle(p.hue)} aria-hidden="true">
                <img src={`${import.meta.env.BASE_URL}perks/${p.img}.webp`} alt="" loading="lazy" />
              </div>
              <div className="perk-text">
                <h3>{t(p.title)}</h3>
                <p>{t(p.text)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dx-section center">
        <h2>{t('plans.anyDevice')}</h2>
        <p className="muted small">{t('plans.anyDeviceHint')}</p>
        <ul className="device-pills">
          {DEVICES.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

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
