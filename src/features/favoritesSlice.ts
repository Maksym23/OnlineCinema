import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { load } from '../lib/storage'
import { SESSION_KEY, confirmRegistration, login, logout } from './authSlice'
import type { AuthUser } from '../api/authApi'

export const favKey = (email: string) => `starlicht_fav_${email}`

interface FavoritesState {
  ids: string[]
}

const session = load<AuthUser | null>(SESSION_KEY, null)

const initialState: FavoritesState = {
  ids: session ? load<string[]>(favKey(session.email), []) : [],
}

const slice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload
      state.ids = state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [id, ...state.ids]
    },
    clearFavorites(state) {
      state.ids = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.ids = []
      })
      .addMatcher(isAnyOf(login.fulfilled, confirmRegistration.fulfilled), (state, { payload }) => {
        state.ids = load<string[]>(favKey(payload.email), [])
      })
  },
})

export const { toggleFavorite, clearFavorites } = slice.actions
export default slice.reducer
