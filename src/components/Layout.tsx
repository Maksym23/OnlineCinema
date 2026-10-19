import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useT } from '../i18n'
import Footer from './Footer'
import Header from './Header'
import Toast from './Toast'

export default function Layout() {
  const { pathname } = useLocation()
  const t = useT()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <Header />
      <main className="container main">
        <Suspense fallback={<p className="loading">{t('common.loading')}</p>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
