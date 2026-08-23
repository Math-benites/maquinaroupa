const TIMEZONE = 'America/Sao_Paulo'
// Brasil não observa horário de verão desde 2019: offset fixo -03:00.
const SP_OFFSET_HOURS = -3

const keyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function spDateKey(date: Date): string {
  return keyFormatter.format(date)
}

function addDaysToKey(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number)
  const utc = Date.UTC(y, m - 1, d) + days * 86400000
  return new Date(utc).toISOString().slice(0, 10)
}

function spDayStartUTC(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, -SP_OFFSET_HOURS, 0, 0))
}

export function getDayBounds(offsetDays: number) {
  const todayKey = spDateKey(new Date())
  const key = addDaysToKey(todayKey, offsetDays)
  const start = spDayStartUTC(key)
  const end = spDayStartUTC(addDaysToKey(key, 1))
  return { key, start, end }
}

export function formatDateHeader(key: string): string {
  const noon = spDayStartUTC(key)
  noon.setUTCHours(noon.getUTCHours() + 12)
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(noon)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatShortLabel(offsetDays: number): string {
  if (offsetDays === 0) return 'Hoje'
  if (offsetDays === 1) return 'Amanhã'
  const { key } = getDayBounds(offsetDays)
  const noon = spDayStartUTC(key)
  noon.setUTCHours(noon.getUTCHours() + 12)
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
  }).format(noon)
}

export function formatHour(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatDayMonth(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
