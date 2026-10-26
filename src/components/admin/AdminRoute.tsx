import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

/** Лише для адміністраторів: гість іде на вхід, звичайний користувач — на головну. */
export default function AdminRoute() {
  const user = useAppSelector((s) => s.auth.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
