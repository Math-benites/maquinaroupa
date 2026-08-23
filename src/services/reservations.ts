import { supabase } from '../lib/supabase'
import type { NewReservationInput, PublicReservation } from '../types/reservation'

const PUBLIC_COLUMNS = 'id, apartamento, inicio, fim, created_at'

export class ReservationConflictError extends Error {}

export async function fetchReservationsForDay(dayStart: Date, dayEnd: Date): Promise<PublicReservation[]> {
  const { data, error } = await supabase
    .from('reservas')
    .select(PUBLIC_COLUMNS)
    .gte('inicio', dayStart.toISOString())
    .lt('inicio', dayEnd.toISOString())
    .order('inicio', { ascending: true })

  if (error) throw error
  return data as PublicReservation[]
}

export interface CreatedReservation {
  id: string
  cancelToken: string
}

export async function createReservation(input: NewReservationInput): Promise<CreatedReservation> {
  const { data, error } = await supabase.rpc('criar_reserva', {
    p_nome: input.nome.trim(),
    p_apartamento: input.apartamento.trim(),
    p_inicio: input.inicio,
    p_fim: input.fim,
  })

  if (error) {
    if (error.code === '23P01') {
      throw new ReservationConflictError('Esse horário acabou de ser reservado por outro morador.')
    }
    if (error.code === '42501' || error.code === '22023') {
      throw new ReservationConflictError('Esse horário não está mais disponível.')
    }
    throw error
  }

  const row = Array.isArray(data) ? data[0] : data
  return { id: row.id, cancelToken: row.cancel_token }
}

export async function cancelReservation(id: string, cancelToken: string): Promise<void> {
  const { error } = await supabase.rpc('cancelar_reserva', { p_id: id, p_token: cancelToken })
  if (error) throw error
}

export async function fetchReservationsByIds(ids: string[]): Promise<PublicReservation[]> {
  if (ids.length === 0) return []

  const { data, error } = await supabase
    .from('reservas')
    .select(PUBLIC_COLUMNS)
    .in('id', ids)
    .order('inicio', { ascending: true })

  if (error) throw error
  return data as PublicReservation[]
}

export function subscribeToReservations(onChange: () => void) {
  const channel = supabase
    .channel('reservas-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, onChange)
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
