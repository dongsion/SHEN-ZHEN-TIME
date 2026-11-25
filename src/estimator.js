const TZ = 'Asia/Shanghai'

export function nowInShenzhen(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date)
  const pick = (type) => Number(parts.find((p) => p.type === type).value)
  return {
    year: pick('year'),
    month: pick('month'),
    day: pick('day'),
    hour: pick('hour'),
    minute: pick('minute'),
    second: pick('second'),
    totalMin: pick('hour') * 60 + pick('minute') + pick('second') / 60
  }
}

function parseHm(hm) {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

function headwayAt(line, totalMin) {
  if (totalMin >= 7 * 60 && totalMin < 9 * 60) return line.peak
  if (totalMin >= 17 * 60 + 30 && totalMin < 19 * 60 + 30) return line.peak
  if (totalMin >= 21 * 60 + 30) return line.late
  return line.off
}

function formatClock(totalMin) {
  const wrapped = ((totalMin % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(wrapped / 60)
  const m = Math.floor(wrapped % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function estimateArrivals(line, stationId, directionId, clock) {
  const stations = line.runStations
  const index = stations.indexOf(stationId)
  const dest = stations.indexOf(directionId)
  if (index < 0 || dest < 0 || index === dest) {
    return { arrivals: [], firstEta: null, lastEta: null, ended: true, beforeFirst: false }
  }

  const forward = dest > index
  const originIndex = forward ? 0 : stations.length - 1
  const hopsFromOrigin = Math.abs(index - originIndex)
  const offset = hopsFromOrigin * line.hop
  const firstAtStation = parseHm(line.first) + offset
  const lastAtStation = parseHm(line.last) + offset
  const nowMin = clock.totalMin

  const arrivals = []
  let t = firstAtStation
  let guard = 0
  while (t <= lastAtStation + 0.01 && guard < 800) {
    const step = headwayAt(line, t)
    if (t >= nowMin - 0.01) {
      const secondsLeft = Math.max(0, Math.floor((t - nowMin) * 60))
      const minutesLeft = Math.floor(secondsLeft / 60)
      const arriving = secondsLeft < 60
      arrivals.push({
        id: `${line.id}-${directionId}-${Math.round(t * 60)}`,
        etaMin: t,
        eta: formatClock(t),
        minutesLeft,
        secondsLeft,
        arriving,
        missed: t < nowMin
      })
    }
    t += step
    guard += 1
  }

  const upcoming = arrivals.filter((a) => !a.missed)
  return {
    arrivals: upcoming.slice(0, 8),
    firstEta: formatClock(firstAtStation),
    lastEta: formatClock(lastAtStation),
    ended: nowMin > lastAtStation,
    beforeFirst: nowMin < firstAtStation
  }
}

export function formatCountdown(secondsLeft) {
  const sec = Math.max(0, Math.floor(secondsLeft))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function markTarget(arrivals, targetId, nowMin) {
  if (!arrivals.length) {
    return { target: null, missed: false, next: null }
  }
  const hit = arrivals.find((a) => a.id === targetId)
  if (!hit) {
    return { target: arrivals[0], missed: false, next: arrivals[1] || null }
  }
  if (hit.etaMin < nowMin) {
    return { target: hit, missed: true, next: arrivals[0] }
  }
  return { target: hit, missed: false, next: arrivals.find((a) => a.id !== hit.id) || null }
}
