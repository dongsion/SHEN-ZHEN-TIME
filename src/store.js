const KEY = 'szmetro-watch-v1'

export function loadWatch() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data.stationId || !data.lineId || !data.directionId) return null
    return data
  } catch {
    return null
  }
}

export function saveWatch(watch) {
  localStorage.setItem(KEY, JSON.stringify(watch))
}
