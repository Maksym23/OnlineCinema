import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { showToast } from '../../features/uiSlice'
import { useT } from '../../i18n'
import { FILTER_GENRES } from '../../lib/filters'
import { addAdminTitle } from '../../lib/adminTitles'
import type { GenreKey, MediaType } from '../../types'
import Modal from '../Modal'

const THIS_YEAR = String(new Date().getFullYear())

/** Форма додавання тайтлу (демо: зберігається в localStorage). */
export default function AddFilmModal({ onClose }: { onClose: () => void }) {
  const t = useT()
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(THIS_YEAR)
  const [type, setType] = useState<MediaType>('movie')
  const [genre, setGenre] = useState<GenreKey>('drama')
  const [errors, setErrors] = useState<{ title?: boolean; year?: boolean }>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const y = Number(year)
    const next = { title: !title.trim(), year: !(Number.isInteger(y) && y >= 1900 && y <= 2030) }
    setErrors({ title: next.title, year: next.year })
    if (next.title || next.year) return
    addAdminTitle({ id: `a${Date.now()}`, title: title.trim(), year: y, type, genre })
    dispatch(showToast(t('admin.content.added', { title: title.trim() })))
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={t('admin.add.title')}>
      <form className="form" onSubmit={submit} noValidate>
        <label className={errors.title ? 'field has-error' : 'field'}>
          <span>{t('admin.add.name')}</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} autoFocus aria-invalid={Boolean(errors.title)} />
          {errors.title && <small className="error">{t('admin.add.errName')}</small>}
        </label>
        <label className={errors.year ? 'field has-error' : 'field'}>
          <span>{t('admin.add.year')}</span>
          <input value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" maxLength={4} aria-invalid={Boolean(errors.year)} />
          {errors.year && <small className="error">{t('admin.add.errYear')}</small>}
        </label>
        <div className="adm-two">
          <label className="field">
            <span>{t('admin.add.type')}</span>
            <select className="adm-select" value={type} onChange={(e) => setType(e.target.value as MediaType)}>
              <option value="movie">{t('type.movie')}</option>
              <option value="series">{t('type.series')}</option>
              <option value="cartoon">{t('type.cartoon')}</option>
            </select>
          </label>
          <label className="field">
            <span>{t('admin.add.genre')}</span>
            <select className="adm-select" value={genre} onChange={(e) => setGenre(e.target.value as GenreKey)}>
              {FILTER_GENRES.map((g) => (
                <option key={g} value={g}>
                  {t(`genre.${g}` as const)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <button type="submit" className="btn btn-sm">
            {t('admin.add.submit')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
