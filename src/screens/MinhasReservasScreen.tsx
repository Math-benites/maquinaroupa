import { useCallback, useEffect, useState } from 'react'
import { formatDayMonth, formatHour } from '../lib/date'
import { getAllOwnIds } from '../lib/ownReservations'
import { fetchReservationsByIds, subscribeToReservations } from '../services/reservations'
import { OwnListSkeleton } from '../components/Skeletons'
import type { PublicReservation } from '../types/reservation'

interface Props {
  refreshKey: number
  onCancelRequest: (reservation: PublicReservation) => void
}

export function MinhasReservasScreen({ refreshKey, onCancelRequest }: Props) {
  const [reservations, setReservations] = useState<PublicReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await fetchReservationsByIds(getAllOwnIds())
      setReservations(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  useEffect(() => {
    return subscribeToReservations(() => load())
  }, [load])

  return (
    <>
      <div className="section-title">
        <h2>Minhas reservas</h2>
        <div className="section-subtitle">Reservas feitas neste aparelho</div>
      </div>

      {loading && <OwnListSkeleton />}

      {!loading && error && (
        <div className="app-message app-message--error">
          Não foi possível carregar suas reservas.
          <button className="retry-btn" onClick={load}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && reservations.length === 0 && (
        <div className="app-message">Você ainda não tem reservas neste aparelho.</div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="own-list">
          {reservations.map((r) => (
            <div className="own-card" key={r.id}>
              <div className="own-card__info">
                <div className="own-card__date">{formatDayMonth(new Date(r.inicio))}</div>
                <div className="own-card__time">
                  {formatHour(new Date(r.inicio))} — {formatHour(new Date(r.fim))}
                </div>
                <div className="own-card__apto">Apto {r.apartamento}</div>
              </div>
              <button className="btn-pill btn-pill--danger" onClick={() => onCancelRequest(r)}>
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
