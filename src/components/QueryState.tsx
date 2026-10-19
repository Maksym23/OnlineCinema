import { useT } from '../i18n'

export function RowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }, (_, r) => (
        <div className="section" key={r}>
          <div className="skeleton skeleton-title" />
          <div className="grid grid-poster">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorBox({ onRetry }: { onRetry?: () => void }) {
  const t = useT()
  return (
    <div className="empty" role="alert">
      <p>{t('common.error')}</p>
      {onRetry && (
        <button type="button" className="btn btn-sm" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}
