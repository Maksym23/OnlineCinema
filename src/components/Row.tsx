import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import type { MediaRow } from '../types'
import { ChevronRightIcon } from './Icons'
import PosterCard from './PosterCard'

export default function Row({ row }: { row: MediaRow }) {
  const t = useT()
  if (row.items.length === 0) return null
  const variant = row.variant ?? 'poster'

  return (
    <section className="section" aria-label={row.title}>
      <div className="section-head">
        <h2>{row.title}</h2>
        {row.to && (
          <Link to={row.to} className="pill">
            {t('common.all')}
            <ChevronRightIcon size={14} strokeWidth={2.4} />
          </Link>
        )}
      </div>
      <div className={`grid grid-${variant}`}>
        {row.items.map((item) => (
          <PosterCard key={item.id} item={item} variant={variant} />
        ))}
      </div>
    </section>
  )
}
