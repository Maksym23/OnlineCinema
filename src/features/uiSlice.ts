import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { load } from '../lib/storage'
import type { Lang, Theme } from '../types'

export const UI_KEY = 'starlicht_ui'

interface UiState {
  theme: Theme
  lang: Lang
  toast: { id: number; text: string } | null
}

const stored = load<Partial<Pick<UiState, 'theme' | 'lang'>>>(UI_KEY, {})

const initialState: UiState = {
  theme: stored.theme === 'light' ? 'light' : 'dark',
  lang: stored.lang === 'en' ? 'en' : 'uk',
  toast: null,
}

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setLang(state, action: PayloadAction<Lang>) {
      state.lang = action.payload
    },
    showToast(state, action: PayloadAction<string>) {
      state.toast = { id: Date.now(), text: action.payload }
    },
    hideToast(state) {
      state.toast = null
    },
  },
})

export const { setTheme, toggleTheme, setLang, showToast, hideToast } = slice.actions
export default slice.reducer
