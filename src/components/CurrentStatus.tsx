import { formatHour } from '../lib/date'
import { Icon } from './Icon'
import { AutorenewIcon } from './icons/AutorenewIcon'
import type { PublicReservation } from '../types/reservation'

interface Props {
  isToday: boolean
  activeReservation: PublicReservation | null
  freeUntil: Date | null
  nextAvailable: Date | null
}

export function CurrentStatus({ isToday, activeReservation, freeUntil, nextAvailable }: Props) {
  if (!isToday) return null

  if (activeReservation) {
    return (
      <div className="status-card status-card--busy">
        <span className="status-card__icon status-card__icon--busy">
          <span className="status-card__icon-spin">
            <AutorenewIcon />
          </span>
        </span>
        <div className="status-card__text">
          <div className="status-card__title status-card__title--busy">OCUPADO AGORA</div>
          <div className="status-card__detail">
            {nextAvailable
              ? `Disponível a partir das ${formatHour(nextAvailable)}`
              : 'Sem horários livres hoje'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="status-card status-card--free">
      <span className="status-card__icon status-card__icon--free">
        <Icon name="check" />
      </span>
      <div className="status-card__text">
        <div className="status-card__title status-card__title--free">LIVRE AGORA</div>
        {freeUntil && <div className="status-card__detail">Disponível até {formatHour(freeUntil)}</div>}
      </div>
      <span className="status-card__illustration">
        <Icon name="local_laundry_service" />
      </span>
    </div>
  )
}
