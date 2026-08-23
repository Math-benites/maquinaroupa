import { useLayoutEffect, useRef, useState } from 'react'
import { TimelineSlot } from './TimelineSlot'
import type { PublicReservation, TimelineSlot as SlotType } from '../types/reservation'

interface Props {
  slots: SlotType[]
  onReserve: (slot: SlotType) => void
  onCancel: (reservation: PublicReservation) => void
}

interface Segment {
  top: number
  left: number
  height: number
  color: string
}

interface NowMarker {
  top: number
  left: number
  color: string
}

const FALLBACK_ROW_DISTANCE = 72

export function Timeline({ slots, onReserve, onCancel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<Map<number, HTMLSpanElement>>(new Map())
  const [segments, setSegments] = useState<Segment[]>([])
  const [nowMarker, setNowMarker] = useState<NowMarker | null>(null)

  const currentIndex = slots.findIndex((slot) => slot.isCurrent)

  useLayoutEffect(() => {
    if (currentIndex === -1 || !containerRef.current) {
      setSegments([])
      setNowMarker(null)
      return
    }

    const currentDot = dotRefs.current.get(currentIndex)
    if (!currentDot) {
      setSegments([])
      setNowMarker(null)
      return
    }

    const containerRect = containerRef.current.getBoundingClientRect()
    const rectOf = (el: HTMLSpanElement) => {
      const rect = el.getBoundingClientRect()
      return {
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
        x: rect.left + rect.width / 2 - containerRect.left,
      }
    }

    const current = rectOf(currentDot)
    const prevDot = dotRefs.current.get(currentIndex - 1)
    const nextDot = dotRefs.current.get(currentIndex + 1)

    const next: Segment[] = []

    if (prevDot) {
      const prev = rectOf(prevDot)
      next.push({
        top: prev.bottom,
        left: current.x,
        height: current.top - prev.bottom,
        color: 'var(--primary)',
      })
    }

    const slot = slots[currentIndex]
    const nextTop = nextDot ? rectOf(nextDot).top : current.bottom + FALLBACK_ROW_DISTANCE
    const forwardDistance = nextTop - current.bottom
    const color = slot.reservation ? 'var(--red)' : 'var(--primary)'
    const markerTop = current.bottom + forwardDistance * slot.progress

    next.push({ top: current.bottom, left: current.x, height: forwardDistance * slot.progress, color })

    setSegments(next)
    setNowMarker({ top: markerTop, left: current.x, color })
  }, [slots, currentIndex])

  return (
    <div className="timeline" ref={containerRef}>
      {segments.map((seg, i) => (
        <div
          key={i}
          className="timeline-progress-line"
          style={{ top: seg.top, left: seg.left, height: seg.height, background: seg.color }}
        />
      ))}
      {nowMarker && (
        <div
          className="timeline-now-marker"
          style={{ top: nowMarker.top, left: nowMarker.left, borderTopColor: nowMarker.color }}
        />
      )}
      {slots.map((slot, i) => (
        <TimelineSlot
          key={slot.hour}
          slot={slot}
          onReserve={onReserve}
          onCancel={onCancel}
          dotRef={(el) => {
            if (el) dotRefs.current.set(i, el)
            else dotRefs.current.delete(i)
          }}
        />
      ))}
    </div>
  )
}
