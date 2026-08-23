import { formatDateHeader } from '../lib/date'
import { Icon } from './Icon'

interface Props {
  dayKey: string
  offsetDays: number
  maxOffsetDays: number
  onChange: (offset: number) => void
  onOpenPicker: () => void
}

export function DateNavigator({ dayKey, offsetDays, maxOffsetDays, onChange, onOpenPicker }: Props) {
  const canGoBack = offsetDays > 0
  const canGoForward = offsetDays < maxOffsetDays

  return (
    <div className="date-nav">
      <button
        className="date-nav__btn"
        disabled={!canGoBack}
        onClick={() => onChange(offsetDays - 1)}
        aria-label="Dia anterior"
      >
        <Icon name="chevron_left" />
      </button>
      <button className="date-nav__label" onClick={onOpenPicker}>
        <span className="date-nav__icon">
          <Icon name="calendar_today" />
        </span>
        {formatDateHeader(dayKey)}
      </button>
      <button
        className="date-nav__btn"
        disabled={!canGoForward}
        onClick={() => onChange(offsetDays + 1)}
        aria-label="Próximo dia"
      >
        <Icon name="chevron_right" />
      </button>
    </div>
  )
}
