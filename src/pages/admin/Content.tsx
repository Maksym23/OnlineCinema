import { useState, useSyncExternalStore } from 'react'
import { useAppDispatch } from '../../app/hooks'
import AddFilmModal from '../../components/admin/AddFilmModal'
import { PlusIcon } from '../../components/Icons'
import { showToast } from '../../features/uiSlice'
import { useT } from '../../i18n'
import { loadAdminTitles, removeAdminTitle } from '../../lib/adminTitles'
import type { AdminTitle } from '../../lib/adminTitles'

let cache: { raw: string; list: AdminTitle[] } = { raw: '', list: [] }
const snapshot = () => {
  const list = loadAdminTitles()
  const raw = JSON.stringify(list)
  if (raw !== cache.raw) cache = { raw, list }
  return cache.list
}
const subscribe = (cb: () => void) => {
  window.addEventListener('admin-titles', cb)
  return () => window.removeEventListener('admin-titles', cb)
}

export default function Content() {
  const t = useT()
  const dispatch = useAppDispatch()
  const [adding, setAdding] = useState(false)
  const titles = useSyncExternalStore(subscribe, snapshot, () => [])

  return (
    <>
      <div className="adm-head">
        <h1>{t('admin.content.title')}</h1>
        <button type="button" className="btn btn-sm" onClick={() => setAdding(true)}>
          <PlusIcon size={14} /> {t('admin.addFilm')}
        </button>
      </div>
      <section className="adm-card">
        {titles.length === 0 ? (
          <p className="muted adm-empty">{t('admin.content.empty')}</p>
        ) : (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.col.title')}</th>
                  <th>{t('admin.col.type')}</th>
                  <th>{t('admin.col.year')}</th>
                  <th>{t('admin.col.genre')}</th>
                  <th className="right">{t('admin.col.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {titles.map((x) => (
                  <tr key={x.id}>
                    <td><strong>{x.title}</strong></td>
                    <td>{t(`type.${x.type}` as const)}</td>
                    <td>{x.year}</td>
                    <td>{t(`genre.${x.genre}` as const)}</td>
                    <td className="right">
                      <button
                        type="button"
                        className="btn btn-dark btn-sm"
                        onClick={() => {
                          removeAdminTitle(x.id)
                          dispatch(showToast(x.title))
                        }}
                      >
                        {t('admin.content.remove')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="muted small adm-note">{t('admin.demoNote')}</p>
      {adding && <AddFilmModal onClose={() => setAdding(false)} />}
    </>
  )
}
