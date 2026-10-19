import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import AuthShell from '../components/AuthShell'
import PasswordField from '../components/PasswordField'
import { login, setPending } from '../features/authSlice'
import { showToast } from '../features/uiSlice'
import { useT } from '../i18n'
import type { TKey } from '../i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const t = useT()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((s) => s.auth.user)
  const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from
  const target = from ? `${from.pathname}${from.search ?? ''}` : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={target} replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!EMAIL_RE.test(email.trim())) next.email = t('auth.errEmail')
    if (password.length < 6) next.password = t('auth.errPassword')
    setErrors(next)
    if (next.email || next.password) return

    setBusy(true)
    const res = await dispatch(login({ email, password }))
    setBusy(false)

    if (login.rejected.match(res)) {
      const code = res.payload ?? 'unknown'
      if (code === 'unverified') {
        dispatch(setPending(email.trim().toLowerCase()))
        navigate('/register', { replace: true, state: location.state })
        return
      }
      setErrors({ form: t(`auth.err.${code}` as TKey) })
    } else {
      dispatch(showToast(t('auth.welcome', { name: res.payload.name })))
    }
  }

  return (
    <AuthShell mode="login" title={t('auth.login')}>
      <form onSubmit={onSubmit} className="form" noValidate>
        <div className={errors.email ? 'field has-error' : 'field'}>
          <label htmlFor="login-email">{t('auth.email')}</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>

        <PasswordField value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" />

        <button type="button" className="link small align-start" onClick={() => dispatch(showToast(t('auth.forgotInfo')))}>
          {t('auth.forgot')}
        </button>

        {errors.form && (
          <p className="form-error" role="alert">
            {errors.form}
          </p>
        )}

        <button type="submit" className="btn" disabled={busy}>
          {t('auth.continue')}
        </button>

        <p className="switch">
          <strong>{t('auth.firstTime')}</strong>
          <br />
          <Link to="/register" state={location.state} replace className="link">
            {t('auth.goRegister')}
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
