import { useId, useState } from 'react'
import { useT } from '../i18n'
import { EyeIcon, EyeOffIcon } from './Icons'

interface Props {
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete: 'current-password' | 'new-password'
}

export default function PasswordField({ value, onChange, error, autoComplete }: Props) {
  const t = useT()
  const id = useId()
  const [shown, setShown] = useState(false)

  return (
    <div className={error ? 'field has-error' : 'field'}>
      <label htmlFor={id}>{t('auth.password')}</label>
      <div className="input-wrap">
        <input
          id={id}
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
        />
        <button
          type="button"
          className="input-eye"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? t('auth.hidePassword') : t('auth.showPassword')}
          aria-pressed={shown}
        >
          {shown ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
        </button>
      </div>
      {error && (
        <small id={`${id}-err`} className="field-error">
          {error}
        </small>
      )}
    </div>
  )
}
