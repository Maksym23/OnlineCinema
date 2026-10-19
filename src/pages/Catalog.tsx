import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useCatalogRowsQuery } from '../api/baseApi'
import Hero from '../components/Hero'
import PosterCard from '../components/PosterCard'
import { ErrorBox, RowsSkeleton } from '../components/QueryState'
import Row from '../components/Row'
import { useT } from '../i18n'
import { ALL_GENRES, SLUG_TO_TYPE } from '../lib/catalog'
import type { GenreKey, Media } from '../types'
import NotFound from './NotFound'

export default function Catalog() {
  const { type: slug = '' } = useParams()
  const type = SLUG_TO_TYPE[slug]
  if (!type) return <NotFound />
  return <CatalogInner slug={slug} type={type} />
}

function CatalogInner({ slug, type }: { slug: string; type: 'movie' | 'series' | 'cartoon' }) {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const [params, setParams] = useSearchParams()
  const genre = params.get('genre') as GenreKey | null
  const { data, isLoading, isError, refetch } = useCatalogRowsQuery({ type, lang })

  const filtered = useMemo<Media[]>(() => {
    if (!genre || !data) return []
    const seen = new Map<string, Media>()
    for (const row of data) for (const m of row.items) if (m.genres.includes(genre)) seen.set(m.id, m)
    return [...seen.values()]
  }, [data, genre])

  const choose = (g: GenreKey | null) => {
    const next = new URLSearchParams(params)
    if (g) next.set('genre', g)
    else next.delete('genre')
    setParams(next, { replace: true })
  }

  const title = t(`catalog.${slug as 'movies' | 'series' | 'cartoons'}`)

  return (
    <>
      <Hero />
      <div className="page-head">
        <h1>{title}</h1>
      </div>

      <div className="chips" role="group" aria-label={t('home.genres')}>
        <button type="button" className={!genre ? 'chip on' : 'chip'} onClick={() => choose(null)}>
          {t('catalog.allGenres')}
        </button>
        {ALL_GENRES.map((g) => (
          <button key={g} type="button" className={genre === g ? 'chip on' : 'chip'} onClick={() => choose(g)}>
            {t(`genre.${g}` as const)}
          </button>
        ))}
      </div>

      {isLoading && <RowsSkeleton />}
      {isError && <ErrorBox onRetry={refetch} />}

      {data && !genre && data.map((row) => <Row key={row.key} row={{ ...row, to: undefined }} />)}

      {data && genre && (
        <section className="section">
          {filtered.length === 0 ? (
            <div className="empty">
              <p>{t('catalog.empty')}</p>
              <Link to={`/catalog/${slug}`} className="btn btn-sm" onClick={() => choose(null)}>
                {t('catalog.allGenres')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-wrap">
              {filtered.map((m) => (
                <PosterCard key={m.id} item={m} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}
