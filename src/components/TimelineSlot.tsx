import { formatHour } from '../lib/date'
import { isOwnReservation } from '../lib/ownReservations'
import { Icon } from './Icon'
import type { PublicReservation, TimelineSlot as SlotType } from '../types/reservation'

interface Props {
  slot: SlotType
  onReserve: (slot: SlotType) => void
  onCancel: (reservation: PublicReservation) => void
}

export function TimelineSlot({ slot, onReserve, onCancel }: Props) {
  const state = slot.isPast ? 'past' : slot.reservation ? 'busy' : 'free'
  const isOwn = state === 'busy' && isOwnReservation(slot.reservation!.id)

  return (
    <div className="timeline-row">
      <span className={`timeline-dot timeline-dot--${state}`} />
      <div className={`slot-card slot-card--${state}`}>
        <div className="slot-card__info">
          <span className="slot-card__hour">{formatHour(slot.start)}</span>

          {state === 'free' && <span className="slot-card__status slot-card__status--free">Livre</span>}

          {state === 'busy' && (
            <span className="slot-card__apto slot-card__apto--busy">Apto {slot.reservation!.apartamento}</span>
          )}

          {state === 'past' && <span className="slot-card__status slot-card__status--past">Encerrado</span>}
        </div>

        <div className="slot-card__action">
          {state === 'free' && (
            <button className="btn-pill btn-pill--free" onClick={() => onReserve(slot)}>
              Reservar
            </button>
          )}

          {state === 'busy' && isOwn && (
            <button className="btn-pill btn-pill--danger" onClick={() => onCancel(slot.reservation!)}>
              Cancelar
            </button>
          )}

          {state === 'busy' && !isOwn && <span className="badge badge--busy">Reservado</span>}

          {state === 'past' && (
            <span className="icon-circle icon-circle--muted">
              <Icon name="lock" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
