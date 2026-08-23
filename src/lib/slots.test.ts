import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildTimelineSlots,
  filterVisibleSlots,
  findActiveReservation,
  findFreeUntil,
  findNextAvailable,
  findNextReservationStart,
  isEndingSoon,
} from './slots'
import type { PublicReservation } from '../types/reservation'

// SP midnight de 2026-01-15 (SP = UTC-3, sem horário de verão).
const DAY_START = new Date('2026-01-15T03:00:00.000Z')
// "Agora" fixado às 15:30 UTC = 12:30 SP, dentro do horário 12:00-13:00 SP.
const NOW = new Date('2026-01-15T15:30:00.000Z')

function reservation(overrides: Partial<PublicReservation>): PublicReservation {
  return {
    id: 'id',
    apartamento: '1',
    inicio: new Date().toISOString(),
    fim: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('buildTimelineSlots', () => {
  it('gera um slot por hora, do horário de abertura ao de fechamento', () => {
    const slots = buildTimelineSlots(DAY_START, [])
    expect(slots).toHaveLength(24)
    expect(slots[0].start.getTime()).toBe(DAY_START.getTime())
    expect(slots[0].end.getTime()).toBe(DAY_START.getTime() + 60 * 60 * 1000)
  })

  it('marca como passado só o horário cujo fim já passou', () => {
    const slots = buildTimelineSlots(DAY_START, [])
    // hora 11 (14:00 UTC): fim 15:00 UTC <= agora (15:30 UTC) -> passado
    expect(slots[11].isPast).toBe(true)
    // hora 12 (15:00-16:00 UTC): ainda em andamento, não é "passado"
    expect(slots[12].isPast).toBe(false)
    expect(slots[13].isPast).toBe(false)
  })

  it('marca o horário em andamento e calcula o progresso decorrido', () => {
    const slots = buildTimelineSlots(DAY_START, [])
    expect(slots[12].isCurrent).toBe(true)
    expect(slots[12].progress).toBeCloseTo(0.5)
    expect(slots[11].isCurrent).toBe(false)
    expect(slots[13].isCurrent).toBe(false)
    expect(slots[13].progress).toBe(0)
  })

  it('associa a reserva cujo início bate exatamente com o horário do slot', () => {
    const slotFiveStart = new Date(DAY_START.getTime() + 5 * 60 * 60 * 1000)
    const res = reservation({
      id: 'r1',
      inicio: slotFiveStart.toISOString(),
      fim: new Date(slotFiveStart.getTime() + 60 * 60 * 1000).toISOString(),
    })
    const slots = buildTimelineSlots(DAY_START, [res])
    expect(slots[5].reservation).toEqual(res)
    expect(slots[4].reservation).toBeNull()
    expect(slots[6].reservation).toBeNull()
  })
})

describe('filterVisibleSlots', () => {
  it('mantém só o horário passado mais recente, escondendo os anteriores', () => {
    const slots = buildTimelineSlots(DAY_START, [])
    const visible = filterVisibleSlots(slots)
    // horas 0..10 (passadas) somem, fica só a 11 (última passada) + 12..23
    expect(visible).toHaveLength(1 + 12)
    expect(visible[0].hour).toBe(11)
    expect(visible[0].isPast).toBe(true)
    expect(visible[1].hour).toBe(12)
  })

  it('não filtra nada quando não há horário passado', () => {
    const futureSlots = buildTimelineSlots(DAY_START, []).filter((s) => !s.isPast)
    expect(filterVisibleSlots(futureSlots)).toHaveLength(futureSlots.length)
  })
})

describe('findActiveReservation', () => {
  it('retorna a reserva que cobre o instante atual', () => {
    const covering = reservation({
      id: 'ativa',
      inicio: '2026-01-15T15:00:00.000Z',
      fim: '2026-01-15T16:00:00.000Z',
    })
    const other = reservation({
      id: 'futura',
      inicio: '2026-01-15T18:00:00.000Z',
      fim: '2026-01-15T19:00:00.000Z',
    })
    expect(findActiveReservation([other, covering])).toEqual(covering)
  })

  it('retorna null quando nenhuma reserva cobre o instante atual', () => {
    const futureOnly = reservation({
      id: 'futura',
      inicio: '2026-01-15T18:00:00.000Z',
      fim: '2026-01-15T19:00:00.000Z',
    })
    expect(findActiveReservation([futureOnly])).toBeNull()
  })
})

describe('findNextAvailable', () => {
  it('ignora o horário em andamento e pula reservas seguidas', () => {
    // hora 12 já começou (15:00-16:00), hora 13 e 14 reservadas.
    const res13 = reservation({ inicio: '2026-01-15T16:00:00.000Z', fim: '2026-01-15T17:00:00.000Z' })
    const res14 = reservation({ inicio: '2026-01-15T17:00:00.000Z', fim: '2026-01-15T18:00:00.000Z' })
    const next = findNextAvailable([res13, res14], DAY_START)
    // deve pular a hora 12 (já começou) e as reservadas, achando a 15 (18:00 UTC)
    expect(next?.toISOString()).toBe('2026-01-15T18:00:00.000Z')
  })

  it('retorna null quando não há horário livre até o fechamento', () => {
    const all = buildTimelineSlots(DAY_START, []).filter((s) => !s.isPast)
    const reservations = all.map((s) =>
      reservation({ inicio: s.start.toISOString(), fim: s.end.toISOString() }),
    )
    expect(findNextAvailable(reservations, DAY_START)).toBeNull()
  })
})

describe('isEndingSoon', () => {
  it('true quando falta menos que o limite pro fim da reserva', () => {
    const res = reservation({ fim: '2026-01-15T15:33:00.000Z' }) // faltam 3min
    expect(isEndingSoon(res, 5)).toBe(true)
  })

  it('false quando falta mais que o limite', () => {
    const res = reservation({ fim: '2026-01-15T15:40:00.000Z' }) // faltam 10min
    expect(isEndingSoon(res, 5)).toBe(false)
  })

  it('false quando a reserva ja terminou', () => {
    const res = reservation({ fim: '2026-01-15T15:29:00.000Z' }) // terminou ha 1min
    expect(isEndingSoon(res, 5)).toBe(false)
  })

  it('true no limite exato do threshold', () => {
    const res = reservation({ fim: '2026-01-15T15:35:00.000Z' }) // faltam exatos 5min
    expect(isEndingSoon(res, 5)).toBe(true)
  })
})

describe('findNextReservationStart / findFreeUntil', () => {
  it('acha a próxima reserva futura mais próxima', () => {
    const perto = reservation({ inicio: '2026-01-15T17:00:00.000Z', fim: '2026-01-15T18:00:00.000Z' })
    const longe = reservation({ inicio: '2026-01-15T20:00:00.000Z', fim: '2026-01-15T21:00:00.000Z' })
    expect(findNextReservationStart([longe, perto])?.toISOString()).toBe('2026-01-15T17:00:00.000Z')
  })

  it('sem reserva futura, findFreeUntil cai no horário de fechamento', () => {
    expect(findNextReservationStart([])).toBeNull()
    // fechamento configurado as 24h -> meia-noite do dia seguinte
    expect(findFreeUntil([], DAY_START).toISOString()).toBe('2026-01-16T03:00:00.000Z')
  })

  it('com reserva futura, findFreeUntil usa o início dela', () => {
    const res = reservation({ inicio: '2026-01-15T17:00:00.000Z', fim: '2026-01-15T18:00:00.000Z' })
    expect(findFreeUntil([res], DAY_START).toISOString()).toBe('2026-01-15T17:00:00.000Z')
  })
})
