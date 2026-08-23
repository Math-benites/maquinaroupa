import { LAUNDRY_CONFIG } from '../config/laundry'
import type { PublicReservation, TimelineSlot } from '../types/reservation'

export function buildTimelineSlots(dayStart: Date, reservations: PublicReservation[]): TimelineSlot[] {
  const now = new Date()
  const slots: TimelineSlot[] = []

  for (let hour = LAUNDRY_CONFIG.openingHour; hour < LAUNDRY_CONFIG.closingHour; hour++) {
    const start = new Date(dayStart.getTime() + hour * 60 * 60 * 1000)
    const end = new Date(start.getTime() + LAUNDRY_CONFIG.reservationDurationMinutes * 60 * 1000)

    const reservation = reservations.find((r) => new Date(r.inicio).getTime() === start.getTime()) ?? null

    const isCurrent = start.getTime() <= now.getTime() && now.getTime() < end.getTime()
    const progress = isCurrent
      ? (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())
      : 0

    slots.push({
      hour,
      start,
      end,
      isPast: end.getTime() <= now.getTime(),
      isCurrent,
      progress,
      reservation,
    })
  }

  return slots
}

export function filterVisibleSlots(slots: TimelineSlot[]): TimelineSlot[] {
  const pastSlots = slots.filter((slot) => slot.isPast)
  const lastPast = pastSlots[pastSlots.length - 1]
  return slots.filter((slot) => !slot.isPast || slot === lastPast)
}

export function findActiveReservation(reservations: PublicReservation[]): PublicReservation | null {
  const now = Date.now()
  return (
    reservations.find((r) => new Date(r.inicio).getTime() <= now && now < new Date(r.fim).getTime()) ?? null
  )
}

export function findNextAvailable(reservations: PublicReservation[], dayStart: Date): Date | null {
  const now = Date.now()

  for (let hour = LAUNDRY_CONFIG.openingHour; hour < LAUNDRY_CONFIG.closingHour; hour++) {
    const start = new Date(dayStart.getTime() + hour * 60 * 60 * 1000)
    if (start.getTime() < now) continue

    const reserved = reservations.some((r) => new Date(r.inicio).getTime() === start.getTime())
    if (!reserved) return start
  }

  return null
}

export function findNextReservationStart(reservations: PublicReservation[]): Date | null {
  const now = Date.now()
  const next = reservations
    .filter((r) => new Date(r.inicio).getTime() > now)
    .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())[0]

  return next ? new Date(next.inicio) : null
}

export function findFreeUntil(reservations: PublicReservation[], dayStart: Date): Date {
  const next = findNextReservationStart(reservations)
  const closingTime = new Date(dayStart.getTime() + LAUNDRY_CONFIG.closingHour * 60 * 60 * 1000)
  return next ?? closingTime
}
