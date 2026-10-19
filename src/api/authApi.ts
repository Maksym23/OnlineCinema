import { load, save } from '../lib/storage'

export const DEMO_CODE = '358564'

const USERS_KEY = 'starlicht_users'

export interface AuthUser {
  email: string
  name: string
  plan: string | null
}

interface StoredUser extends AuthUser {
  hash: string
  verified: boolean
}

export type AuthErrorCode = 'exists' | 'invalid' | 'unverified' | 'code' | 'unknown'

export class AuthError extends Error {
  code: AuthErrorCode
  constructor(code: AuthErrorCode) {
    super(code)
    this.code = code
  }
}

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms))
const norm = (email: string) => email.trim().toLowerCase()
const users = () => load<StoredUser[]>(USERS_KEY, [])
const toUser = (u: StoredUser): AuthUser => ({ email: u.email, name: u.name, plan: u.plan })

async function sha(text: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  return btoa(unescape(encodeURIComponent(text)))
}

export async function register(email: string, password: string): Promise<void> {
  await delay()
  const list = users()
  const e = norm(email)
  const existing = list.find((u) => u.email === e)
  if (existing?.verified) throw new AuthError('exists')
  const record: StoredUser = {
    email: e,
    name: e.split('@')[0],
    plan: null,
    hash: await sha(password),
    verified: false,
  }
  save(USERS_KEY, [...list.filter((u) => u.email !== e), record])
}

export async function confirm(email: string, code: string): Promise<AuthUser> {
  await delay()
  if (code.trim() !== DEMO_CODE) throw new AuthError('code')
  const list = users()
  const e = norm(email)
  const user = list.find((u) => u.email === e)
  if (!user) throw new AuthError('unknown')
  user.verified = true
  save(USERS_KEY, list)
  return toUser(user)
}

export async function login(email: string, password: string): Promise<AuthUser> {
  await delay()
  const e = norm(email)
  const user = users().find((u) => u.email === e)
  if (!user || user.hash !== (await sha(password))) throw new AuthError('invalid')
  if (!user.verified) throw new AuthError('unverified')
  return toUser(user)
}

export async function updateUser(email: string, patch: Partial<Pick<AuthUser, 'name' | 'plan'>>): Promise<AuthUser> {
  await delay(200)
  const list = users()
  const user = list.find((u) => u.email === norm(email))
  if (!user) throw new AuthError('unknown')
  Object.assign(user, patch)
  save(USERS_KEY, list)
  return toUser(user)
}
