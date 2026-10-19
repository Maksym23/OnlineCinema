import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useHomeRowsQuery } from '../api/baseApi'
import Hero from '../components/Hero'
import { ErrorBox, RowsSkeleton } from '../components/QueryState'
import Row from '../components/Row'
import { useT } from '../i18n'
import type { GenreKey } from '../types'

const HOME_GENRES: { key: GenreKey; hue: number }[] = [
  { key: 'drama', hue: 340 },
  { key: 'action', hue: 20 },
  { key: 'thriller', hue: 220 },
  { key: 'scifi', hue: 270 },
  { key: 'comedy', hue: 45 },
]

export default function Home() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const { data, isLoading, isError, refetch } = useHomeRowsQuery(lang)

  return (
    <>
      <Hero />
      {isLoading && <RowsSkeleton />}
      {isError && <ErrorBox onRetry={refetch} />}
      {data?.map((row) => (
        <Fragment key={row.key}>
          {row.key === 'ukrainian' && (
            <section className="section genres-band" aria-label={t('home.genres')}>
              <h2>{t('home.genres')}</h2>
              <div className="grid grid-poster genres">
                {HOME_GENRES.map((g) => (
                  <Link
                    key={g.key}
                    to={`/catalog/movies?genre=${g.key}`}
                    className="genre-tile"
                    style={{ ['--h' as string]: g.hue }}
                  >
                    <span>{t(`genre.${g.key}` as const)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <Row row={row} />
        </Fragment>
      ))}
    </>
  )
}
