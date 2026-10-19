import type { CSSProperties } from 'react'
import type { Lang } from '../types'

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const ss = String(s).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}

export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'uk' ? 'uk-UA' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export const artStyle = (hue: number): CSSProperties => ({
  background: `linear-gradient(160deg, hsl(${hue} 68% 44%), hsl(${(hue + 50) % 360} 60% 14%))`,
})
