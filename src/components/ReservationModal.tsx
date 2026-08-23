import { useState } from 'react'
import { formatDayMonth, formatHour } from '../lib/date'
import { saveOwnReservation } from '../lib/ownReservations'
import { createReservation, ReservationConflictError } from '../services/reservations'
import { APARTAMENTOS } from '../config/laundry'
import type { TimelineSlot } from '../types/reservation'

interface Props {
  slot: TimelineSlot
  onClose: () => void
  onConfirmed: () => void
}

const NOME_REGEX = /^[\p{L}\s]+$/u

const STORAGE_KEY_NOME = 'lavanderia:nome'
const STORAGE_KEY_APARTAMENTO = 'lavanderia:apartamento'

function sanitizeNome(value: string): string {
  return value.replace(/[^\p{L}\s]/gu, '')
}

export function ReservationModal({ slot, onClose, onConfirmed }: Props) {
  const [nome, setNome] = useState(() => sanitizeNome(localStorage.getItem(STORAGE_KEY_NOME) ?? ''))
  const [apartamento, setApartamento] = useState(() => localStorage.getItem(STORAGE_KEY_APARTAMENTO) ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nomeValido = NOME_REGEX.test(nome.trim()) && nome.trim().length <= 80
  const apartamentoValido = (APARTAMENTOS as readonly string[]).includes(apartamento)
  const podeConfirmar = nomeValido && apartamentoValido && !submitting

  async function handleSubmit() {
    if (!podeConfirmar) return
    setSubmitting(true)
    setError(null)

    try {
      const created = await createReservation({
        nome,
        apartamento,
        inicio: slot.start.toISOString(),
        fim: slot.end.toISOString(),
      })
      saveOwnReservation(created.id, created.cancelToken)
      onConfirmed()
      onClose()
    } catch (err) {
      if (err instanceof ReservationConflictError) {
        setError(err.message)
      } else {
        setError('Não foi possível realizar a reserva. Tente novamente.')
      }
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <button type="button" className="modal-overlay__backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="modal-sheet">
        <h2 className="modal-title">Reservar horário</h2>
        <div className="modal-date">{formatDayMonth(slot.start)}</div>
        <div className="modal-time">
          {formatHour(slot.start)} — {formatHour(slot.end)}
        </div>

        <label className="modal-field">
          <span>Nome</span>
          <input
            value={nome}
            onChange={(e) => {
              const sanitized = sanitizeNome(e.target.value)
              setNome(sanitized)
              localStorage.setItem(STORAGE_KEY_NOME, sanitized)
            }}
            maxLength={80}
            placeholder="Seu nome"
          />
        </label>

        <label className="modal-field">
          <span>Apartamento</span>
          <select
            value={apartamento}
            onChange={(e) => {
              setApartamento(e.target.value)
              localStorage.setItem(STORAGE_KEY_APARTAMENTO, e.target.value)
            }}
          >
            <option value="" disabled>
              Selecione
            </option>
            {APARTAMENTOS.map((apto) => (
              <option key={apto} value={apto}>
                Apto {apto}
              </option>
            ))}
          </select>
        </label>

        {error && <div className="modal-error">{error}</div>}

        <button type="button" className="modal-confirm-btn" disabled={!podeConfirmar} onClick={handleSubmit}>
          {submitting ? 'Reservando...' : 'Confirmar reserva'}
        </button>
      </div>
    </div>
  )
}
