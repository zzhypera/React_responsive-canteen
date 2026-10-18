import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useEffect } from 'react'

export default function Toast({ notice, onClose }) {
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(onClose, 3400)
    return () => window.clearTimeout(timer)
  }, [notice, onClose])

  if (!notice) return null
  const Icon = notice.type === 'error' ? AlertCircle : CheckCircle2
  return (
    <div className={`toast toast-${notice.type || 'success'}`} role="status">
      <Icon size={19} />
      <span>{notice.message}</span>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Dismiss notification"><X size={17} /></button>
    </div>
  )
}
