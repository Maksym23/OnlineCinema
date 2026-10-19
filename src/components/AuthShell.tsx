import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { showToast } from '../features/uiSlice'
import { useT } from '../i18n'
import { AppleIcon, CloseIcon, FacebookIcon, GoogleIcon, SparkleIcon } from './Icons'

interface Props {
  mode: 'login' | 'register'
  title: string
  children: ReactNode
}

/** Двопанельна картка входу/реєстрації з макета: ліворуч вибір дії та соцмережі, праворуч форма. */
export default function AuthShell({ mode, title, children }: Props) {
  const t = useT()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const keep = { state: location.state }
  const social = () => dispatch(showToast(t('auth.social')))

  return (
    <div className="auth-wrap">
      <div className="auth" role="dialog" aria-labelledby="auth-title">
        <aside className="auth-side">
          <SparkleIcon className="a-spark s1" size={22} />
          <SparkleIcon className="a-spark s2" size={12} />
          <SparkleIcon className="a-spark s3" size={18} />
          <SparkleIcon className="a-spark s4" size={10} />

          <Link to="/register" {...keep} className={mode === 'register' ? 'btn' : 'btn btn-dark'} replace>
            {t('auth.register')}
          </Link>
          <Link to="/login" {...keep} className={mode === 'login' ? 'btn' : 'btn btn-dark'} replace>
            {t('auth.login')}
          </Link>

          <div className="or">
            <span>{t('auth.or')}</span>
          </div>
          <div className="socials-row">
            <button type="button" className="btn btn-dark btn-sm" onClick={social} title={t('auth.social')}>
              <AppleIcon size={14} /> Apple
            </button>
            <button type="button" className="btn btn-dark btn-sm" onClick={social} title={t('auth.social')}>
              <GoogleIcon size={14} /> Google
            </button>
            <button type="button" className="btn btn-dark btn-sm" onClick={social} title={t('auth.social')}>
              <FacebookIcon size={14} /> Facebook
            </button>
          </div>
        </aside>

        <section className="auth-main">
          <button type="button" className="auth-close" onClick={() => navigate('/')} aria-label={t('common.close')}>
            <CloseIcon size={18} />
          </button>
          <h1 id="auth-title">{title}</h1>
          {children}
        </section>
      </div>
    </div>
  )
}
