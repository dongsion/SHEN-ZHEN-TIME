import test from 'node:test'
import assert from 'node:assert/strict'
import { estimateArrivals, formatCountdown } from './estimator.js'

const line1 = {
  id: '1',
  first: '06:20',
  last: '23:00',
  peak: 2,
  off: 4,
  late: 6,
  hop: 2.4,
  runStations: ['罗湖', '国贸', '老街', '大剧院']
}

test('before first train reports first eta', () => {
  const clock = { totalMin: 5 * 60 }
  const result = estimateArrivals(line1, '老街', '大剧院', clock)
  assert.equal(result.beforeFirst, true)
  assert.ok(result.arrivals.length > 0)
  assert.equal(result.firstEta, '06:24')
})

test('peak headway is denser than offpeak', () => {
  const peak = estimateArrivals(line1, '罗湖', '大剧院', { totalMin: 8 * 60 })
  const off = estimateArrivals(line1, '罗湖', '大剧院', { totalMin: 11 * 60 })
  const peakGap = peak.arrivals[1].etaMin - peak.arrivals[0].etaMin
  const offGap = off.arrivals[1].etaMin - off.arrivals[0].etaMin
  assert.ok(peakGap < offGap)
})

test('after last train is ended', () => {
  const result = estimateArrivals(line1, '罗湖', '大剧院', { totalMin: 23 * 60 + 40 })
  assert.equal(result.ended, true)
  assert.equal(result.arrivals.length, 0)
})

test('seconds left counts down inside the current minute', () => {
  const result = estimateArrivals(line1, '罗湖', '大剧院', { totalMin: 6 * 60 + 20 + 0.7 })
  assert.ok(result.arrivals[0].secondsLeft >= 0)
  assert.equal(result.arrivals[0].secondsLeft, Math.floor((result.arrivals[0].etaMin - (6 * 60 + 20 + 0.7)) * 60))
})

test('formatCountdown pads mm:ss', () => {
  assert.equal(formatCountdown(0), '00:00')
  assert.equal(formatCountdown(65), '01:05')
  assert.equal(formatCountdown(3723), '1:02:03')
})

test('bus headway is wider than metro', () => {
  const bus = {
    id: 'bus-1',
    first: '06:30',
    last: '22:30',
    peak: 8,
    off: 12,
    late: 20,
    hop: 2.0,
    runStations: ['火车站', '国贸', '东门', '布心总站']
  }
  const result = estimateArrivals(bus, '火车站', '布心总站', { totalMin: 8 * 60 })
  const gap = result.arrivals[1].etaMin - result.arrivals[0].etaMin
  assert.equal(result.beforeFirst, false)
  assert.ok(gap >= 8)
})
