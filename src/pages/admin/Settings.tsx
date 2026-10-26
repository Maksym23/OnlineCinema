import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setLang, toggleTheme } from '../../features/uiSlice'
import { useT } from '../../i18n'

export default function Settings() {
  const t = useT()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { theme, lang } = useAppSelector((s) => s.ui)

  return (
    <>
      <div className="adm-head"><h1>{t('admin.settings.title')}</h1></div>
      <section className="adm-card adm-pad">
        <h2>{t('admin.settings.account')}</h2>
        <dl className="adm-dl">
          <dt className="muted">{t('admin.col.user')}</dt><dd>{user?.name}</dd>
          <dt className="muted">{t('admin.settings.email')}</dt><dd>{user?.email}</dd>
          <dt className="muted">{t('admin.settings.theme')}</dt>
          <dd><button type="button" className="btn btn-dark btn-sm" onClick={() => dispatch(toggleTheme())}>{theme === 'dark' ? '☾' : '☀'} {theme}</button></dd>
          <dt className="muted">{t('admin.settings.lang')}</dt>
          <dd><button type="button" className="btn btn-dark btn-sm" onClick={() => dispatch(setLang(lang === 'uk' ? 'en' : 'uk'))}>{lang === 'uk' ? 'УКР → ENG' : 'ENG → УКР'}</button></dd>
        </dl>
      </section>
      <p className="muted small adm-note">{t('admin.settings.note')}</p>
    </>
  )
}
