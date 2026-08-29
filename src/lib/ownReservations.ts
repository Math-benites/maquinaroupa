const STORAGE_KEY = 'lavanderia:reservas'
const NOTIFIED_KEY = 'lavanderia:notificados-fim'

function readMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeMap(map: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function saveOwnReservation(id: string, cancelToken: string) {
  const map = readMap()
  map[id] = cancelToken
  writeMap(map)
}

export function getOwnToken(id: string): string | null {
  return readMap()[id] ?? null
}

export function isOwnReservation(id: string): boolean {
  return getOwnToken(id) !== null
}

export function getAllOwnIds(): string[] {
  return Object.keys(readMap())
}

function readNotifiedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function wasEndingSoonNotified(id: string): boolean {
  return readNotifiedIds().includes(id)
}

export function markEndingSoonNotified(id: string) {
  const ids = readNotifiedIds()
  if (!ids.includes(id)) {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids, id]))
  }
}
