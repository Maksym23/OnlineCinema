import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setLang, toggleTheme } from '../features/uiSlice'
import { useT } from '../i18n'
import type { Lang } from '../types'
import { BookmarkIcon, ChevronDownIcon, CloseIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon, UserIcon } from './Icons'
import Logo from './Logo'

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-link active' : 'nav-link')

export default function Header() {
  const t = useT()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { theme, lang } = useAppSelector((s) => s.ui)
  const { pathname } = useLocation()
  // Меню «відкрите» лише для сторінки, на якій його відкрили, тож при навігації воно закривається саме.
  const [menuAt, setMenuAt] = useState<string | null>(null)
  const [moreAt, setMoreAt] = useState<string | null>(null)
  const menuOpen = menuAt === pathname
  const moreOpen = moreAt === pathname
  const setMenuOpen = (fn: (v: boolean) => boolean) => setMenuAt(fn(menuOpen) ? pathname : null)
  const setMoreOpen = (v: boolean | ((v: boolean) => boolean)) =>
    setMoreAt((typeof v === 'function' ? v(moreOpen) : v) ? pathname : null)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!moreOpen) return
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreAt(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreAt(null)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  const onLang = (e: ChangeEvent<HTMLSelectElement>) => dispatch(setLang(e.target.value as Lang))

  return (
    <header className="header">
      <div className="container">
        <div className="header-bar">
          <Logo />

          <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main">
            <NavLink to="/catalog/movies" className={navClass}>
              {t('nav.movies')}
            </NavLink>
            <NavLink to="/catalog/series" className={navClass}>
              {t('nav.series')}
            </NavLink>
            <NavLink to="/catalog/cartoons" className={navClass}>
              {t('nav.cartoons')}
            </NavLink>
            <NavLink to="/subscription" className={navClass}>
              {t('nav.plans')}
            </NavLink>

            <div className="more" ref={moreRef}>
              <button
                type="button"
                className={moreOpen ? 'nav-link more-btn active' : 'nav-link more-btn'}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                onClick={() => setMoreOpen((v) => !v)}
              >
                {t('nav.more')}
                <ChevronDownIcon size={14} />
              </button>
              {moreOpen && (
                <div className="more-menu" role="menu">
                  <Link to="/news" role="menuitem">
                    {t('nav.news')}
                  </Link>
                  <Link to="/favorites" role="menuitem">
                    {t('nav.favorites')}
                  </Link>
                  <Link to="/history" role="menuitem">
                    {t('nav.history')}
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="header-actions">
            <select className="lang-select" value={lang} onChange={onLang} aria-label={t('nav.language')}>
              <option value="uk">УКР</option>
              <option value="en">ENG</option>
            </select>
            <Link to="/search" className="icon-btn" aria-label={t('nav.search')}>
              <SearchIcon />
            </Link>
            <Link to="/favorites" className="icon-btn hide-sm" aria-label={t('nav.favorites')}>
              <BookmarkIcon />
            </Link>
            <button
              type="button"
              className="icon-btn"
              onClick={() => dispatch(toggleTheme())}
              aria-label={theme === 'dark' ? t('nav.themeToLight') : t('nav.themeToDark')}
              title={theme === 'dark' ? t('nav.themeToLight') : t('nav.themeToDark')}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link
              to={user ? '/profile' : '/login'}
              className="icon-btn"
              aria-label={user ? t('nav.profile') : t('nav.login')}
            >
              <UserIcon />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-sm hide-sm">
                {t('nav.register')}
              </Link>
            )}
            <button
              type="button"
              className="icon-btn burger"
              aria-label={t('nav.menu')}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
