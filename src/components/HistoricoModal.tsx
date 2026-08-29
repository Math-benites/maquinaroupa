import { formatDayMonth, formatHour } from '../lib/date'
import { Icon } from './Icon'
import type { PublicReservation } from '../types/reservation'

interface Props {
  reservations: PublicReservation[]
  onClose: () => void
}

export function HistoricoModal({ reservations, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <button type="button" className="modal-overlay__backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="modal-sheet">
        <div className="modal-header">
          <h2 className="modal-title">Histórico de reservas</h2>
          <button type="button" className="modal-close-btn" aria-label="Fechar" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="own-list">
          {reservations.map((r) => (
            <div className="own-card own-card--history" key={r.id}>
              <div className="own-card__info">
                <div className="own-card__date">{formatDayMonth(new Date(r.inicio))}</div>
                <div className="own-card__time">
                  {formatHour(new Date(r.inicio))} — {formatHour(new Date(r.fim))}
                </div>
                <div className="own-card__apto">Apto {r.apartamento}</div>
              </div>
              {r.cancelado_em && (
                <span className="own-card__tag">
                  Cancelada
                  <br />
                  {formatDayMonth(new Date(r.cancelado_em))} {formatHour(new Date(r.cancelado_em))}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
