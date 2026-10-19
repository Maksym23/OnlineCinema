import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { load } from '../lib/storage'
import { SESSION_KEY, confirmRegistration, login, logout } from './authSlice'
import type { AuthUser } from '../api/authApi'

export const historyKey = (email: string) => `starlicht_history_${email}`

export interface HistoryItem {
  id: string
  /** секунди */
  position: number
  duration: number
  watchedAt: number
}

interface HistoryState {
  items: HistoryItem[]
}

const session = load<AuthUser | null>(SESSION_KEY, null)

const initialState: HistoryState = {
  items: session ? load<HistoryItem[]>(historyKey(session.email), []) : [],
}

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    recordProgress(state, action: PayloadAction<{ id: string; position: number; duration: number }>) {
      const { id, position, duration } = action.payload
      const rest = state.items.filter((i) => i.id !== id)
      state.items = [{ id, position, duration, watchedAt: Date.now() }, ...rest].slice(0, 100)
    },
    removeFromHistory(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    clearHistory(state) {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.items = []
      })
      .addMatcher(isAnyOf(login.fulfilled, confirmRegistration.fulfilled), (state, { payload }) => {
        state.items = load<HistoryItem[]>(historyKey(payload.email), [])
      })
  },
})

export const { recordProgress, removeFromHistory, clearHistory } = slice.actions
export default slice.reducer
