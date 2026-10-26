import { lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'

const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
const Sport = lazy(() => import('./pages/Sport'))
const Tv = lazy(() => import('./pages/Tv'))
const Search = lazy(() => import('./pages/Search'))
const MovieDetails = lazy(() => import('./pages/MovieDetails'))
const Watch = lazy(() => import('./pages/Watch'))
const Favorites = lazy(() => import('./pages/Favorites'))
const History = lazy(() => import('./pages/History'))
const Profile = lazy(() => import('./pages/Profile'))
const Subscription = lazy(() => import('./pages/Subscription'))
const News = lazy(() => import('./pages/News'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminSubs = lazy(() => import('./pages/admin/Subscriptions'))
const AdminContent = lazy(() => import('./pages/admin/Content'))
const AdminPayments = lazy(() => import('./pages/admin/Payments'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const { theme, lang } = useAppSelector((s) => s.ui)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = lang
  }, [theme, lang])

  return (
    <Routes>
      <Route path="admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="subscriptions" element={<AdminSubs />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog/:type" element={<Catalog />} />
        <Route path="search" element={<Search />} />
        <Route path="sport" element={<Sport />} />
        <Route path="tv" element={<Tv />} />
        <Route path="movie/:id" element={<MovieDetails />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="news" element={<News />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="watch/:id" element={<Watch />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
