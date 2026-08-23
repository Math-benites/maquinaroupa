import { useCallback, useEffect, useState } from 'react'
import { CurrentStatus } from '../components/CurrentStatus'
import { DateNavigator } from '../components/DateNavigator'
import { Timeline } from '../components/Timeline'
import { ReservationModal } from '../components/ReservationModal'
import { CalendarModal } from '../components/CalendarModal'
import { RulesCard } from '../components/RulesCard'
import { StatusCardSkeleton, TimelineSkeleton } from '../components/Skeletons'
import { LAUNDRY_CONFIG } from '../config/laundry'
import { getDayBounds } from '../lib/date'
import {
  buildTimelineSlots,
  filterVisibleSlots,
  findActiveReservation,
  findFreeUntil,
  findNextAvailable,
} from '../lib/slots'
import { fetchReservationsForDay, subscribeToReservations } from '../services/reservations'
import type { PublicReservation, TimelineSlot as SlotType } from '../types/reservation'

interface Props {
  refreshKey: number
  onReserved: () => void
  onCancelRequest: (reservation: PublicReservation) => void
}

export function AgendarScreen({ refreshKey, onReserved, onCancelRequest }: Props) {
  const [offsetDays, setOffsetDays] = useState(0)
  const [reservations, setReservations] = useState<PublicReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [, setTick] = useState(0)

  const { key: dayKey, start: dayStart, end: dayEnd } = getDayBounds(offsetDays)

  const loadReservations = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await fetchReservationsForDay(dayStart, dayEnd)
      setReservations(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [dayStart.getTime(), dayEnd.getTime()])

  useEffect(() => {
    loadReservations()
  }, [loadReservations, refreshKey])

  useEffect(() => {
    return subscribeToReservations(() => loadReservations())
  }, [loadReservations])

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30000)
    return () => window.clearInterval(id)
  }, [])

  const slots = filterVisibleSlots(buildTimelineSlots(dayStart, reservations))
  const isToday = offsetDays === 0
  const activeReservation = isToday ? findActiveReservation(reservations) : null
  const freeUntil = isToday ? findFreeUntil(reservations, dayStart) : null
  const nextAvailable = isToday && activeReservation ? findNextAvailable(reservations, dayStart) : null

  return (
    <div className="screen">
      <div className="agendar-sticky-top">
        {loading ? (
          <StatusCardSkeleton />
        ) : (
          <CurrentStatus
            isToday={isToday}
            activeReservation={activeReservation}
            freeUntil={freeUntil}
            nextAvailable={nextAvailable}
          />
        )}

        <DateNavigator
          dayKey={dayKey}
          offsetDays={offsetDays}
          maxOffsetDays={LAUNDRY_CONFIG.advanceBookingDays - 1}
          onChange={setOffsetDays}
          onOpenPicker={() => setPickerOpen(true)}
        />

        <div className="section-title">
          <h2>Escolha um horário</h2>
        </div>
      </div>

      {loading && <TimelineSkeleton />}

      {!loading && error && (
        <div className="app-message app-message--error">
          Não foi possível carregar a agenda.
          <button className="retry-btn" onClick={loadReservations}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (
        <Timeline slots={slots} onReserve={setSelectedSlot} onCancel={onCancelRequest} />
      )}

      <RulesCard />

      {selectedSlot && (
        <ReservationModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} onConfirmed={onReserved} />
      )}

      {pickerOpen && (
        <CalendarModal
          offsetDays={offsetDays}
          maxOffsetDays={LAUNDRY_CONFIG.advanceBookingDays - 1}
          onSelect={setOffsetDays}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
