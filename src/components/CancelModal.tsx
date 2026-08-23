import { formatDayMonth, formatHour } from '../lib/date'
import type { PublicReservation } from '../types/reservation'

interface Props {
  reservation: PublicReservation
  submitting: boolean
  error: string | null
  onClose: () => void
  onConfirm: () => void
}

export function CancelModal({ reservation, submitting, error, onClose, onConfirm }: Props) {
  const start = new Date(reservation.inicio)
  const end = new Date(reservation.fim)

  return (
    <div className="modal-overlay">
      <button type="button" className="modal-overlay__backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="modal-sheet">
        <h2 className="modal-title">Cancelar reserva</h2>
        <div className="modal-date">{formatDayMonth(start)}</div>
        <div className="modal-time">
          {formatHour(start)} — {formatHour(end)}
        </div>
        <div className="modal-date">Apartamento {reservation.apartamento}</div>

        {error && <div className="modal-error">{error}</div>}

        <button
          type="button"
          className="modal-confirm-btn modal-confirm-btn--danger"
          disabled={submitting}
          onClick={onConfirm}
        >
          {submitting ? 'Cancelando...' : 'Confirmar cancelamento'}
        </button>
        <button type="button" className="modal-secondary-btn" disabled={submitting} onClick={onClose}>
          Voltar
        </button>
      </div>
    </div>
  )
}
