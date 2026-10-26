import type { GenreKey, MediaType } from '../types'
import { load, save } from './storage'

export interface AdminTitle {
  id: string
  title: string
  year: number
  type: MediaType
  genre: GenreKey
}

const KEY = 'starlicht_admin_titles'

export const loadAdminTitles = (): AdminTitle[] => load<AdminTitle[]>(KEY, [])

export function addAdminTitle(t: AdminTitle): void {
  save(KEY, [t, ...loadAdminTitles()])
  window.dispatchEvent(new Event('admin-titles'))
}

export function removeAdminTitle(id: string): void {
  save(KEY, loadAdminTitles().filter((x) => x.id !== id))
  window.dispatchEvent(new Event('admin-titles'))
}
