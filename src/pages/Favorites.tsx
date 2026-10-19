import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useMediaListQuery } from '../api/baseApi'
import { HeartIcon } from '../components/Icons'
import PosterCard from '../components/PosterCard'
import { ErrorBox, RowsSkeleton } from '../components/QueryState'
import { useT } from '../i18n'

export default function Favorites() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const ids = useAppSelector((s) => s.favorites.ids)
  const { data, isLoading, isError, refetch } = useMediaListQuery({ ids, lang }, { skip: ids.length === 0 })

  // показуємо лише те, що досі в обраному (список реагує на видалення миттєво)
  const items = (data ?? []).filter((m) => ids.includes(m.id))

  return (
    <>
      <div className="page-head">
        <h1>{t('favorites.title')}</h1>
      </div>

      {ids.length === 0 && (
        <div className="empty">
          <HeartIcon size={40} />
          <h2>{t('favorites.empty')}</h2>
          <p>{t('favorites.emptyHint')}</p>
          <Link to="/catalog/movies" className="btn btn-sm">
            {t('favorites.browse')}
          </Link>
        </div>
      )}
      {ids.length > 0 && isLoading && <RowsSkeleton rows={1} />}
      {isError && <ErrorBox onRetry={refetch} />}
      {items.length > 0 && (
        <div className="grid grid-wrap">
          {items.map((m) => (
            <PosterCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </>
  )
}
