import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { load } from '../lib/storage'
import { SESSION_KEY, confirmRegistration, login, logout } from './authSlice'
import type { AuthUser } from '../api/authApi'

export const channelFavKey = (email: string) => `starlicht_tvfav_${email}`

interface ChannelsState {
  favorites: string[]
}

const session = load<AuthUser | null>(SESSION_KEY, null)

const initialState: ChannelsState = {
  favorites: session ? load<string[]>(channelFavKey(session.email), []) : [],
}

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    toggleChannelFavorite(state, action: PayloadAction<string>) {
      const id = action.payload
      state.favorites = state.favorites.includes(id) ? state.favorites.filter((x) => x !== id) : [id, ...state.favorites]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.favorites = []
      })
      .addMatcher(isAnyOf(login.fulfilled, confirmRegistration.fulfilled), (state, { payload }) => {
        state.favorites = load<string[]>(channelFavKey(payload.email), [])
      })
  },
})

export const { toggleChannelFavorite } = slice.actions
export default slice.reducer
