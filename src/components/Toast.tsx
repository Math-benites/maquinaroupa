import { useEffect, useState } from 'react'
import { Icon } from './Icon'

interface Props {
  message: string
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: Props) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const hideTimer = setTimeout(() => setLeaving(true), 2600)
    const removeTimer = setTimeout(onDismiss, 2900)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [onDismiss])

  return (
    <div className={`toast ${leaving ? 'toast--leaving' : ''}`}>
      <span className="toast__icon">
        <Icon name="check" />
      </span>
      <span>{message}</span>
    </div>
  )
}
