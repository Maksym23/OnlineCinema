import { useCallback } from 'react'
import { useAppSelector } from '../app/hooks'
import { en } from './en'
import { uk } from './uk'

export type TKey = keyof typeof uk
export type Vars = Record<string, string | number>

const dict = { uk, en }

function format(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`))
}

export function useT() {
  const lang = useAppSelector((s) => s.ui.lang)
  return useCallback((key: TKey, vars?: Vars) => format(dict[lang][key] ?? uk[key] ?? key, vars), [lang])
}
