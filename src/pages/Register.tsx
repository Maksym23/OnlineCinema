import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import AuthShell from '../components/AuthShell'
import PasswordField from '../components/PasswordField'
import { DEMO_CODE } from '../api/authApi'
import { confirmRegistration, register, setPending } from '../features/authSlice'
import { showToast } from '../features/uiSlice'
import { useT } from '../i18n'
import type { TKey } from '../i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const t = useT()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { user, pending } = useAppSelector((s) => s.auth)
  const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from
  const target = from ? `${from.pathname}${from.search ?? ''}` : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; code?: string; form?: string }>({})
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={target} replace />

  const onRegister = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!EMAIL_RE.test(email.trim())) next.email = t('auth.errEmail')
    if (password.length < 6) next.password = t('auth.errPassword')
    setErrors(next)
    if (next.email || next.password) return

    setBusy(true)
    const res = await dispatch(register({ email, password }))
    setBusy(false)
    if (register.rejected.match(res)) setErrors({ form: t(`auth.err.${res.payload ?? 'unknown'}` as TKey) })
  }

  const onConfirm = async (e: FormEvent) => {
    e.preventDefault()
    if (!pending) return
    if (!/^\d{6}$/.test(code.trim())) {
      setErrors({ code: t('auth.errCode') })
      return
    }
    setErrors({})
    setBusy(true)
    const res = await dispatch(confirmRegistration({ email: pending, code }))
    setBusy(false)
    if (confirmRegistration.rejected.match(res)) setErrors({ form: t(`auth.err.${res.payload ?? 'unknown'}` as TKey) })
    else dispatch(showToast(t('auth.welcome', { name: res.payload.name })))
  }

  if (pending) {
    return (
      <AuthShell mode="register" title={t('auth.confirmTitle')}>
        <form onSubmit={onConfirm} className="form" noValidate>
          <p className="muted small center">{t('auth.confirmText', { email: pending })}</p>

          <div className={errors.code ? 'field has-error' : 'field'}>
            <label htmlFor="reg-code">{t('auth.code')}</label>
            <input
              id="reg-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              aria-invalid={Boolean(errors.code)}
            />
            {errors.code && <small className="field-error">{errors.code}</small>}
          </div>

          <p className="hint">{t('auth.demoCode', { code: DEMO_CODE })}</p>

          {errors.form && (
            <p className="form-error" role="alert">
              {errors.form}
            </p>
          )}

          <button type="submit" className="btn" disabled={busy}>
            {t('auth.continue')}
          </button>

          <p className="switch small">
            {t('auth.noCode')}{' '}
            <button type="button" className="link" onClick={() => dispatch(showToast(t('auth.resent')))}>
              {t('auth.resend')}
            </button>
            <br />
            <button type="button" className="link" onClick={() => dispatch(setPending(null))}>
              {t('common.back')}
            </button>
          </p>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell mode="register" title={t('auth.register')}>
      <form onSubmit={onRegister} className="form" noValidate>
        <div className={errors.email ? 'field has-error' : 'field'}>
          <label htmlFor="reg-email">{t('auth.email')}</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>

        <PasswordField value={password} onChange={setPassword} error={errors.password} autoComplete="new-password" />

        {errors.form && (
          <p className="form-error" role="alert">
            {errors.form}
          </p>
        )}

        <button type="submit" className="btn" disabled={busy}>
          {t('auth.continue')}
        </button>

        <p className="switch">
          <strong>{t('auth.haveAccount')}</strong>
          <br />
          <Link to="/login" state={location.state} replace className="link">
            {t('auth.goLogin')}
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
