import { useState } from 'react'
import { Icon } from './Icon'
import { spDateKey } from '../lib/date'

interface Props {
  offsetDays: number
  maxOffsetDays: number
  onSelect: (offset: number) => void
  onClose: () => void
}

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const DAY_MS = 86400000

export function CalendarModal({ offsetDays, maxOffsetDays, onSelect, onClose }: Props) {
  const todayKey = spDateKey(new Date())
  const [todayY, todayM, todayD] = todayKey.split('-').map(Number)
  const todayUtc = Date.UTC(todayY, todayM - 1, todayD)
  const maxUtc = todayUtc + maxOffsetDays * DAY_MS

  const [viewYear, setViewYear] = useState(todayY)
  const [viewMonth, setViewMonth] = useState(todayM)

  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay()
  const totalDays = new Date(viewYear, viewMonth, 0).getDate()

  const cells: number[] = []
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  function goPrevMonth() {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1)
      setViewMonth(12)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function goNextMonth() {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1)
      setViewMonth(1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const viewedMonthUtc = Date.UTC(viewYear, viewMonth - 1, 1)
  const todayMonthUtc = Date.UTC(todayY, todayM - 1, 1)
  const canGoPrev = viewedMonthUtc > todayMonthUtc

  return (
    <div className="modal-overlay modal-overlay--center">
      <button type="button" className="modal-overlay__backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="calendar-modal">
        <div className="calendar-modal__header">
          <button
            type="button"
            className="date-nav__btn"
            disabled={!canGoPrev}
            onClick={goPrevMonth}
            aria-label="Mês anterior"
          >
            <Icon name="chevron_left" />
          </button>
          <span className="calendar-modal__title">
            {MONTH_LABELS[viewMonth - 1]} {viewYear}
          </span>
          <button type="button" className="date-nav__btn" onClick={goNextMonth} aria-label="Próximo mês">
            <Icon name="chevron_right" />
          </button>
        </div>

        <div className="calendar-modal__weekdays">
          {WEEKDAY_LABELS.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>

        <div className="calendar-modal__grid">
          {cells.map((day, i) => {
            const cellUtc = Date.UTC(viewYear, viewMonth - 1, day)
            const offset = Math.round((cellUtc - todayUtc) / DAY_MS)
            const inRange = cellUtc >= todayUtc && cellUtc <= maxUtc
            const isSelected = inRange && offset === offsetDays
            const isToday = cellUtc === todayUtc

            const classes = ['calendar-modal__cell']
            if (isSelected) classes.push('calendar-modal__cell--selected')
            if (isToday && !isSelected) classes.push('calendar-modal__cell--today')
            if (!inRange) classes.push('calendar-modal__cell--disabled')

            return (
              <button
                key={day}
                type="button"
                className={classes.join(' ')}
                disabled={!inRange}
                style={i === 0 ? { gridColumnStart: firstWeekday + 1 } : undefined}
                onClick={() => {
                  onSelect(offset)
                  onClose()
                }}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
