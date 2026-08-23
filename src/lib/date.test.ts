import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDateHeader, formatDayMonth, formatHour, formatShortLabel, getDayBounds, spDateKey } from './date'

function spNoonUTC(y: number, m: number, d: number): Date {
  // Meio-dia em São Paulo (UTC-3) = 15:00 UTC.
  return new Date(Date.UTC(y, m - 1, d, 15, 0, 0))
}

describe('spDateKey', () => {
  it('usa a data local de São Paulo, não a data UTC', () => {
    // 02:00 UTC = 23:00 SP do dia anterior.
    expect(spDateKey(new Date('2026-01-15T02:00:00.000Z'))).toBe('2026-01-14')
    // 03:00 UTC = 00:00 SP do mesmo dia.
    expect(spDateKey(new Date('2026-01-15T03:00:00.000Z'))).toBe('2026-01-15')
  })
})

describe('getDayBounds', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // "Agora" = 2026-01-15T15:30:00Z (12:30 SP).
    vi.setSystemTime(new Date('2026-01-15T15:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('offset 0 retorna os limites do dia atual em SP', () => {
    const { key, start, end } = getDayBounds(0)
    expect(key).toBe('2026-01-15')
    expect(start.toISOString()).toBe('2026-01-15T03:00:00.000Z')
    expect(end.toISOString()).toBe('2026-01-16T03:00:00.000Z')
  })

  it('offset positivo/negativo desloca a chave em dias corridos', () => {
    expect(getDayBounds(1).key).toBe('2026-01-16')
    expect(getDayBounds(-1).key).toBe('2026-01-14')
  })
})

describe('formatDateHeader', () => {
  it('capitaliza a primeira letra do dia da semana formatado em pt-BR', () => {
    const raw = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(spNoonUTC(2026, 1, 15))
    const expected = raw.charAt(0).toUpperCase() + raw.slice(1)
    expect(formatDateHeader('2026-01-15')).toBe(expected)
  })
})

describe('formatShortLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T15:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('trata hoje e amanhã como casos especiais', () => {
    expect(formatShortLabel(0)).toBe('Hoje')
    expect(formatShortLabel(1)).toBe('Amanhã')
  })

  it('demais offsets voltam no formato dd/mm', () => {
    const expected = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
    }).format(spNoonUTC(2026, 1, 20))
    expect(formatShortLabel(5)).toBe(expected)
  })
})

describe('formatHour', () => {
  it('formata a hora no fuso de São Paulo, 24h', () => {
    expect(formatHour(new Date('2026-01-15T15:00:00.000Z'))).toBe('12:00')
    expect(formatHour(new Date('2026-01-15T03:00:00.000Z'))).toBe('00:00')
  })
})

describe('formatDayMonth', () => {
  it('formata dd/mm/yyyy no fuso de São Paulo', () => {
    expect(formatDayMonth(new Date('2026-01-15T15:00:00.000Z'))).toBe('15/01/2026')
    // 02:00 UTC de dia 15 ainda é 23:00 SP do dia 14.
    expect(formatDayMonth(new Date('2026-01-15T02:00:00.000Z'))).toBe('14/01/2026')
  })
})
