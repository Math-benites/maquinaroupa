import { TimelineSlot } from './TimelineSlot'
import type { PublicReservation, TimelineSlot as SlotType } from '../types/reservation'

interface Props {
  slots: SlotType[]
  onReserve: (slot: SlotType) => void
  onCancel: (reservation: PublicReservation) => void
}

export function Timeline({ slots, onReserve, onCancel }: Props) {
  return (
    <div className="timeline">
      {slots.map((slot) => (
        <TimelineSlot key={slot.hour} slot={slot} onReserve={onReserve} onCancel={onCancel} />
      ))}
    </div>
  )
}
