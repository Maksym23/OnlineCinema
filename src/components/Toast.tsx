import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { hideToast } from '../features/uiSlice'

export default function Toast() {
  const toast = useAppSelector((s) => s.ui.toast)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => dispatch(hideToast()), 3000)
    return () => clearTimeout(id)
  }, [toast, dispatch])

  if (!toast) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      {toast.text}
    </div>
  )
}
