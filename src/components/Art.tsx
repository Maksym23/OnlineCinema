import { useState } from 'react'
import type { ReactNode } from 'react'
import { useMediaImage } from '../lib/images'
import type { Media } from '../types'

interface Props {
  src: string | null | undefined
  /** що показати, поки зображення немає або воно не завантажилось */
  fallback?: ReactNode
  className?: string
}

/** Зображення з тихим переходом на заглушку, якщо адреса недоступна. */
export default function Art({ src, fallback = null, className }: Props) {
  const [failed, setFailed] = useState<string | null>(null)
  if (!src || failed === src) return <>{fallback}</>
  return (
    <img
      className={className}
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(src)}
    />
  )
}

/** Постер тайтлу з підбором зображення та заглушкою-назвою. */
export function MediaArt({ media, wide = false }: { media: Media; wide?: boolean }) {
  const poster = useMediaImage(media)
  const src = wide ? (media.backdrop ?? poster) : poster
  return <Art src={src} fallback={<span className="card-art-text">{media.title}</span>} />
}
