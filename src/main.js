import './style.css'
import { lines, stationById, lineById, linesAtStation } from './catalog.js'
import { estimateArrivals, nowInShenzhen, formatCountdown } from './estimator.js'
import { loadWatch, saveWatch } from './store.js'

const app = document.getElementById('app')
let watch = loadWatch()
let view = 'pick-line'
let pickLineId = watch?.lineId || '1'

function hasWatch() {
  return Boolean(watch?.stationId && watch?.lineId && watch?.directionId)
}

function setWatch(next) {
  watch = { ...(watch || {}), ...next }
  saveWatch(watch)
  render()
}

function clockLabel(clock) {
  const hh = String(clock.hour).padStart(2, '0')
  const mm = String(clock.minute).padStart(2, '0')
  const ss = String(clock.second).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function directionOptions(line, stationId) {
  const [a, b] = line.terminals
  if (stationId === a) return [b]
  if (stationId === b) return [a]
  return [a, b]
}

function renderCatch() {
  if (!hasWatch()) {
    view = 'pick-line'
    return renderPicker()
  }
  const station = stationById[watch.stationId]
  const line = lineById[watch.lineId]
  if (!station || !line || !line.runStations.includes(station.id)) {
    view = 'pick-line'
    return renderPicker()
  }
  const clock = nowInShenzhen()
  const dirs = directionOptions(line, station.id)
  if (!dirs.includes(watch.directionId)) watch.directionId = dirs[0]
  const result = estimateArrivals(line, station.id, watch.directionId, clock)
  const arrivals = result.arrivals
  const target = arrivals.find((a) => a.id === watch.targetId) || arrivals[0] || null
  const missedTarget = watch.targetId && !arrivals.some((a) => a.id === watch.targetId)

  let statusClass = 'ok'
  let statusText = '下一班估算到站'
  let remain = '--:--'
  if (result.ended) {
    statusClass = 'miss'
    statusText = '本方向今日已停运'
    remain = '00:00'
  } else if (result.beforeFirst && target) {
    statusClass = 'warn'
    statusText = `尚未运营 · 首班约 ${result.firstEta}`
    remain = formatCountdown(target.secondsLeft)
  } else if (missedTarget) {
    statusClass = 'miss'
    statusText = '要赶的那班已错过，下面是下一班'
    remain = target ? formatCountdown(target.secondsLeft) : '00:00'
  } else if (target?.arriving) {
    statusClass = 'ok'
    statusText = '即将到站'
    remain = formatCountdown(target.secondsLeft)
  } else if (target) {
    statusText = `估算 ${target.eta} 到站`
    remain = formatCountdown(target.secondsLeft)
  }

  const otherLines = linesAtStation(station.id)
  app.style.setProperty('--line-color', line.color)
  app.innerHTML = `
    <div class="topbar">
      <div class="brand">赶这班 · 深圳地铁</div>
      <div class="clock">${clockLabel(clock)}</div>
    </div>
    <section class="hero">
      <div class="line-chip"><span class="dot" style="background:${line.color}"></span>${line.name}</div>
      <div class="station-name">${station.name}</div>
      <div class="direction">开往 ${watch.directionId}</div>
      <div class="countdown">
        <div class="minutes">${remain}</div>
      </div>
      <div class="status ${statusClass}">${statusText}</div>
      <div class="note">按首末班与高峰/平峰间隔估算，非官方实时信号 · 更新于 ${clockLabel(clock)}</div>
    </section>
    <section class="section">
      <h2>方向</h2>
      <div class="list">
        ${dirs.map((d) => `
          <div class="row ${d === watch.directionId ? 'active' : ''}">
            <button data-dir="${d}">开往 ${d}</button>
          </div>
        `).join('')}
      </div>
    </section>
    <section class="section">
      <h2>随后班次</h2>
      ${arrivals.length ? `<div class="list">
        ${arrivals.map((a, i) => `
          <div class="row ${target && a.id === target.id ? 'active' : ''}">
            <button data-train="${a.id}">
              <span class="eta">${a.eta}${i === 0 ? ' · 最近' : ''}</span>
              <span class="left">${a.arriving ? '即将到站' : formatCountdown(a.secondsLeft)}</span>
            </button>
          </div>
        `).join('')}
      </div>` : `<div class="empty">${result.ended ? '今日已无列车' : '暂无班次'}</div>`}
    </section>
    ${otherLines.length > 1 ? `
    <section class="section">
      <h2>本站其他线路</h2>
      <div class="list">
        ${otherLines.filter((l) => l.id !== line.id).map((l) => `
          <div class="row">
            <button data-switch="${l.id}">
              <span>${l.name}</span>
              <span class="left">换乘</span>
            </button>
          </div>
        `).join('')}
      </div>
    </section>` : ''}
    <button class="btn" data-pick>换站点</button>
  `

  app.querySelectorAll('[data-dir]').forEach((el) => {
    el.onclick = () => setWatch({ directionId: el.dataset.dir, targetId: null })
  })
  app.querySelectorAll('[data-train]').forEach((el) => {
    el.onclick = () => setWatch({ targetId: el.dataset.train })
  })
  app.querySelectorAll('[data-switch]').forEach((el) => {
    el.onclick = () => {
      const next = lineById[el.dataset.switch]
      const nextDirs = directionOptions(next, station.id)
      setWatch({ lineId: next.id, directionId: nextDirs[0], targetId: null })
    }
  })
  app.querySelector('[data-pick]').onclick = () => {
    pickLineId = watch.lineId
    view = 'pick-line'
    render()
  }
}

function renderLinePicker(clock) {
  app.innerHTML = `
    <div class="topbar">
      ${hasWatch() ? '<button class="back" data-back>返回赶车</button>' : '<div class="brand">赶这班 · 深圳地铁</div>'}
      <div class="clock">${clockLabel(clock)}</div>
    </div>
    <div class="station-name page-title">先选线路</div>
    <div class="note" style="margin:0 0 14px">点线路，再点站点，不用打字</div>
    <div class="line-grid">
      ${lines.map((line) => `
        <button class="line-card" data-line="${line.id}" style="--c:${line.color}">
          <span class="line-bar"></span>
          <span class="line-card-name">${line.name}</span>
          <span class="line-card-ends">${line.stations[0]} — ${line.stations[line.stations.length - 1]}</span>
        </button>
      `).join('')}
    </div>
  `
  app.querySelectorAll('[data-line]').forEach((el) => {
    el.onclick = () => {
      pickLineId = el.dataset.line
      view = 'pick-station'
      render()
    }
  })
  const back = app.querySelector('[data-back]')
  if (back) {
    back.onclick = () => {
      view = 'catch'
      render()
    }
  }
}

function renderStationPicker(clock) {
  const line = lineById[pickLineId]
  app.style.setProperty('--line-color', line.color)
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-back>重选线路</button>
      <div class="clock">${clockLabel(clock)}</div>
    </div>
    <div class="line-chip"><span class="dot" style="background:${line.color}"></span>${line.name}</div>
    <div class="station-name page-title">点你的站</div>
    <div class="note" style="margin:0 0 12px">${line.stations[0]} 方向往下划</div>
    <div class="station-track">
      ${line.stations.map((name, i) => `
        <button class="stop" data-st="${name}">
          <span class="stop-rail" style="background:${line.color}"></span>
          <span class="stop-dot" style="border-color:${line.color}"></span>
          <span class="stop-name">${name}</span>
          <span class="stop-idx">${String(i + 1).padStart(2, '0')}</span>
        </button>
      `).join('')}
    </div>
  `
  app.querySelector('[data-back]').onclick = () => {
    view = 'pick-line'
    render()
  }
  app.querySelectorAll('[data-st]').forEach((el) => {
    el.onclick = () => {
      watch = { ...(watch || {}), stationId: el.dataset.st, lineId: line.id, targetId: null }
      view = 'pick-dir'
      render()
    }
  })
}

function renderDirPicker(clock) {
  const station = stationById[watch.stationId]
  const line = lineById[watch.lineId]
  const dirs = directionOptions(line, station.id)
  app.style.setProperty('--line-color', line.color)
  app.innerHTML = `
    <div class="topbar">
      <button class="back" data-back>重选站点</button>
      <div class="clock">${clockLabel(clock)}</div>
    </div>
    <div class="line-chip"><span class="dot" style="background:${line.color}"></span>${line.name}</div>
    <div class="station-name page-title">${station.name}</div>
    <div class="note" style="margin:0 0 12px">车往哪边开</div>
    <div class="picker">
      ${dirs.map((d) => `
        <button class="dir-card" data-go="${d}">
          <span class="dir-label">开往</span>
          <span class="dir-name">${d}</span>
        </button>
      `).join('')}
    </div>
  `
  app.querySelector('[data-back]').onclick = () => {
    pickLineId = line.id
    view = 'pick-station'
    render()
  }
  app.querySelectorAll('[data-go]').forEach((el) => {
    el.onclick = () => {
      view = 'catch'
      setWatch({
        stationId: station.id,
        lineId: line.id,
        directionId: el.dataset.go,
        targetId: null
      })
    }
  })
}

function renderPicker() {
  const clock = nowInShenzhen()
  if (view === 'pick-line') return renderLinePicker(clock)
  if (view === 'pick-station') return renderStationPicker(clock)
  return renderDirPicker(clock)
}

function render() {
  if (view === 'catch') renderCatch()
  else renderPicker()
}

function tickCatch() {
  const hero = app.querySelector('.minutes')
  if (!hero || !hasWatch()) return renderCatch()
  const station = stationById[watch.stationId]
  const line = lineById[watch.lineId]
  if (!station || !line) return renderCatch()
  const clock = nowInShenzhen()
  const result = estimateArrivals(line, station.id, watch.directionId, clock)
  const arrivals = result.arrivals
  const target = arrivals.find((a) => a.id === watch.targetId) || arrivals[0] || null
  const listed = [...app.querySelectorAll('[data-train]')].map((el) => el.dataset.train)
  const nextIds = arrivals.map((a) => a.id)
  if (listed.join() !== nextIds.join()) return renderCatch()

  const clockEl = app.querySelector('.clock')
  if (clockEl) clockEl.textContent = clockLabel(clock)
  if (result.ended) hero.textContent = '00:00'
  else if (target) hero.textContent = formatCountdown(target.secondsLeft)

  const status = app.querySelector('.status')
  if (status && target && !result.ended) {
    if (target.arriving) status.textContent = '即将到站'
    else if (result.beforeFirst) status.textContent = `尚未运营 · 首班约 ${result.firstEta}`
    else status.textContent = `估算 ${target.eta} 到站`
  }
  app.querySelectorAll('[data-train]').forEach((el, i) => {
    const left = el.querySelector('.left')
    const a = arrivals[i]
    if (left && a) left.textContent = a.arriving ? '即将到站' : formatCountdown(a.secondsLeft)
  })
}

render()
setInterval(() => {
  if (view === 'catch') tickCatch()
  else {
    const clock = app.querySelector('.clock')
    if (clock) clock.textContent = clockLabel(nowInShenzhen())
  }
}, 1000)
