export interface Reservation {
  id: string
  nome: string
  apartamento: string
  inicio: string
  fim: string
  created_at: string
  cancelado_em: string | null
}

export type PublicReservation = Omit<Reservation, 'nome'>

export interface NewReservationInput {
  nome: string
  apartamento: string
  inicio: string
  fim: string
}

export interface TimelineSlot {
  hour: number
  start: Date
  end: Date
  isPast: boolean
  isCurrent: boolean
  progress: number
  reservation: PublicReservation | null
}
