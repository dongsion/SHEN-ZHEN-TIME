export function searchStations(stations, query) {
  const q = query.trim().toLowerCase()
  if (!q) return stations.slice(0, 40)
  const scored = []
  for (const station of stations) {
    const name = station.name.toLowerCase()
    const py = station.pinyin
    const abbr = station.abbr
    let score = -1
    if (name === q) score = 100
    else if (name.startsWith(q)) score = 90
    else if (name.includes(q)) score = 80
    else if (py === q) score = 70
    else if (py.startsWith(q)) score = 60
    else if (abbr === q) score = 55
    else if (abbr.startsWith(q)) score = 50
    else if (py.includes(q) || abbr.includes(q)) score = 30
    if (score >= 0) scored.push({ station, score })
  }
  scored.sort((a, b) => b.score - a.score || a.station.pinyin.localeCompare(b.station.pinyin))
  return scored.slice(0, 40).map((s) => s.station)
}
