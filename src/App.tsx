import { lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
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
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const { theme, lang } = useAppSelector((s) => s.ui)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = lang
  }, [theme, lang])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog/:type" element={<Catalog />} />
        <Route path="search" element={<Search />} />
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
