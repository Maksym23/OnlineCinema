import { Suspense, useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/authSlice'
import { useT } from '../../i18n'
import type { TKey } from '../../i18n'
import { BellIcon, CardIcon, ChevronDownIcon, FilmIcon, GridIcon, LogoutIcon, SearchIcon, SettingsIcon, UsersIcon, WalletIcon } from '../Icons'
import Logo from '../Logo'
import Toast from '../Toast'

const NAV: { to: string; label: TKey; icon: typeof GridIcon; end?: boolean }[] = [
  { to: '/admin', label: 'admin.nav.dashboard', icon: GridIcon, end: true },
  { to: '/admin/users', label: 'admin.nav.users', icon: UsersIcon },
  { to: '/admin/subscriptions', label: 'admin.nav.subs', icon: CardIcon },
  { to: '/admin/content', label: 'admin.nav.content', icon: FilmIcon },
  { to: '/admin/payments', label: 'admin.nav.payments', icon: WalletIcon },
]

const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'adm-link on' : 'adm-link')

export default function AdminLayout() {
  const t = useT()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const [q, setQ] = useState('')

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/admin/users?q=${encodeURIComponent(q.trim())}` : '/admin/users')
  }
  const name = user?.name ?? t('admin.defaultName')

  return (
    <div className="adm">
      <aside className="adm-side">
        <Logo />
        <nav className="adm-nav" aria-label={t('admin.menu')}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={18} /> <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="adm-nav adm-nav-bottom">
          <NavLink to="/admin/settings" className={linkClass}>
            <SettingsIcon size={18} /> <span>{t('admin.nav.settings')}</span>
          </NavLink>
          <button
            type="button"
            className="adm-link"
            onClick={() => {
              dispatch(logout())
              navigate('/')
            }}
          >
            <LogoutIcon size={18} /> <span>{t('admin.nav.logout')}</span>
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <form className="adm-search" role="search" onSubmit={onSearch}>
            <SearchIcon size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('admin.search')} aria-label={t('admin.search')} />
          </form>
          <button type="button" className="icon-btn adm-bell" aria-label={t('admin.notifications')}>
            <BellIcon />
            <span className="adm-bell-dot" aria-hidden="true" />
          </button>
          <div className="adm-user">
            <span className="adm-avatar" aria-hidden="true">
              {name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span className="adm-user-text">
              <strong>{name}</strong>
              <span className="muted">{t('admin.role')}</span>
            </span>
            <ChevronDownIcon size={16} />
          </div>
        </header>
        <main className="adm-content">
          <Suspense fallback={<p className="loading">{t('common.loading')}</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Toast />
    </div>
  )
}
