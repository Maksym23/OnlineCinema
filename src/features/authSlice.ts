import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import * as authApi from '../api/authApi'
import type { AuthErrorCode, AuthUser } from '../api/authApi'
import { load } from '../lib/storage'

export const SESSION_KEY = 'starlicht_session'

interface AuthState {
  user: AuthUser | null
  /** email, що очікує підтвердження після реєстрації */
  pending: string | null
}

const initialState: AuthState = {
  user: load<AuthUser | null>(SESSION_KEY, null),
  pending: null,
}

type Cfg = { rejectValue: AuthErrorCode }

const toCode = (e: unknown): AuthErrorCode => (e instanceof authApi.AuthError ? e.code : 'unknown')

export const login = createAsyncThunk<AuthUser, { email: string; password: string }, Cfg>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authApi.login(email, password)
    } catch (e) {
      return rejectWithValue(toCode(e))
    }
  },
)

export const register = createAsyncThunk<string, { email: string; password: string }, Cfg>(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await authApi.register(email, password)
      return email.trim().toLowerCase()
    } catch (e) {
      return rejectWithValue(toCode(e))
    }
  },
)

export const confirmRegistration = createAsyncThunk<AuthUser, { email: string; code: string }, Cfg>(
  'auth/confirm',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      return await authApi.confirm(email, code)
    } catch (e) {
      return rejectWithValue(toCode(e))
    }
  },
)

export const updateProfile = createAsyncThunk<
  AuthUser,
  { email: string; name?: string; plan?: string | null; phone?: string },
  Cfg
>('auth/update', async ({ email, ...patch }, { rejectWithValue }) => {
  try {
    return await authApi.updateUser(email, patch)
  } catch (e) {
    return rejectWithValue(toCode(e))
  }
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.pending = null
    },
    setPending(state, action: PayloadAction<string | null>) {
      state.pending = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.pending = payload
      })
      .addCase(confirmRegistration.fulfilled, (state, { payload }) => {
        state.user = payload
        state.pending = null
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.user = payload
      })
  },
})

export const { logout, setPending } = slice.actions
export default slice.reducer
