import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from '../api/baseApi'
import auth, { SESSION_KEY } from '../features/authSlice'
import favorites, { favKey } from '../features/favoritesSlice'
import history, { historyKey } from '../features/historySlice'
import ui, { UI_KEY } from '../features/uiSlice'
import { save } from '../lib/storage'

export const store = configureStore({
  reducer: {
    auth,
    favorites,
    history,
    ui,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

/** Збереження стану в localStorage — лише те, що змінилося. */
let prev = store.getState()
store.subscribe(() => {
  const s = store.getState()
  if (s.ui.theme !== prev.ui.theme || s.ui.lang !== prev.ui.lang) {
    save(UI_KEY, { theme: s.ui.theme, lang: s.ui.lang })
  }
  if (s.auth.user !== prev.auth.user) save(SESSION_KEY, s.auth.user)
  if (s.auth.user) {
    if (s.favorites !== prev.favorites) save(favKey(s.auth.user.email), s.favorites.ids)
    if (s.history !== prev.history) save(historyKey(s.auth.user.email), s.history.items)
  }
  prev = s
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
