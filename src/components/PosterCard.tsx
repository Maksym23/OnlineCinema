import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { toggleFavorite } from '../features/favoritesSlice'
import { artStyle } from '../lib/format'
import { useT } from '../i18n'
import type { Media } from '../types'
import { HeartIcon } from './Icons'

interface Props {
  item: Media
  variant?: 'poster' | 'wide'
}

export default function PosterCard({ item, variant = 'poster' }: Props) {
  const t = useT()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((s) => s.auth.user)
  const isFav = useAppSelector((s) => s.favorites.ids.includes(item.id))
  const img = variant === 'wide' ? (item.backdrop ?? item.poster) : item.poster

  const onFav = (e: MouseEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    dispatch(toggleFavorite(item.id))
  }

  return (
    <div className={`card card-${variant}`}>
      <Link to={`/movie/${item.id}`} className="card-art" style={artStyle(item.hue)} tabIndex={-1} aria-hidden="true">
        {img ? <img src={img} alt="" loading="lazy" /> : <span className="card-art-text">{item.title}</span>}
      </Link>
      <button
        type="button"
        className={isFav ? 'fav on' : 'fav'}
        onClick={onFav}
        aria-pressed={isFav}
        aria-label={isFav ? t('card.removeFavorite') : t('card.addFavorite')}
      >
        <HeartIcon size={16} filled={isFav} />
      </button>
      <Link to={`/movie/${item.id}`} className="card-title">
        {item.title}
      </Link>
    </div>
  )
}
