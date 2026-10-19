import { Link } from 'react-router-dom'
import { useT } from '../i18n'

export default function NotFound() {
  const t = useT()
  return (
    <div className="empty">
      <h1>404</h1>
      <h2>{t('notFound.title')}</h2>
      <p>{t('notFound.text')}</p>
      <Link to="/" className="btn btn-sm">
        {t('common.home')}
      </Link>
    </div>
  )
}
