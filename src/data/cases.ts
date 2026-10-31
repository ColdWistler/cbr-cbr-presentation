// The worked example's data and arithmetic. Same source of truth as the
// Anatomy figure: ../shared/cases.json, consumed by figure/model.mjs.
import raw from '../../shared/cases.json'

export const DATA = raw
export const Q = raw.query
export const W = raw.weights
export const SIGMA = raw.sigma
export const SPLIT = raw.index.split
export const LEAF_CAP = raw.index.leafCap

export interface SimDetail {
  id: string
  d: number
  sCoord: number
  sTime: number
  sTraffic: number
  sDay: number
  sWeather: number
  sim: number
}

export const zoneOf = (dest: { x: number; y: number }) => ({
  x: Math.floor(dest.x),
  y: Math.floor(dest.y),
})
export const cell = (dest: { x: number; y: number }) => `C-${Math.floor(dest.x)}-${Math.floor(dest.y)}`
export const distKm = (dest: { x: number; y: number }) =>
  Math.hypot(dest.x - raw.depot.x, dest.y - raw.depot.y)
export const bucketOf = (minutes: number) =>
  raw.buckets.find((b) => minutes >= b.from && minutes < b.to) ?? raw.buckets[raw.buckets.length - 1]
export const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

const expSim = (delta: number, sigma: number) => Math.exp(-(delta * delta) / (2 * sigma * sigma))
const trafficSim = (a: string, b: string) =>
  a === b ? 1 : (a === 'light' && b === 'heavy') || (a === 'heavy' && b === 'light') ? 0.2 : 0.6

export function similarity(problem: typeof Q, c: (typeof raw.cases)[number]): SimDetail {
  const d = Math.hypot(problem.dest.x - c.dest.x, problem.dest.y - c.dest.y)
  const sCoord = expSim(d, SIGMA.coordKm)
  const sTime = expSim(Math.abs(problem.minutes - c.minutes), SIGMA.timeMin)
  const sTraffic = trafficSim(problem.traffic, c.traffic)
  const sDay = problem.dayType === c.dayType ? 1 : 0.3
  const sWeather = problem.weather === c.weather ? 1 : 0.4
  return {
    id: c.id,
    d,
    sCoord,
    sTime,
    sTraffic,
    sDay,
    sWeather,
    sim: W.coord * sCoord + W.time * sTime + W.traffic * sTraffic + W.dayType * sDay + W.weather * sWeather,
  }
}

/** The discrimination-tree walk: index attributes in order, then the leaf set. */
export const walkPath = [
  { attribute: 'zoneX', test: `dest x-band = ${zoneOf(Q.dest).x}` },
  { attribute: 'zoneY', test: `dest y-band = ${zoneOf(Q.dest).y}` },
  { attribute: 'bucket', test: `time = ${bucketOf(Q.minutes).id}` },
  { attribute: 'traffic', test: `traffic = ${Q.traffic}` },
]

export const leaf: (SimDetail & { c: (typeof raw.cases)[number] })[] = raw.cases
  .filter(
    (c) =>
      zoneOf(c.dest).x === zoneOf(Q.dest).x &&
      zoneOf(c.dest).y === zoneOf(Q.dest).y &&
      bucketOf(c.minutes).id === bucketOf(Q.minutes).id &&
      c.traffic === Q.traffic,
  )
  .map((c) => ({ ...similarity(Q, c), c }))

export const retrieved = leaf.reduce((top, one) => (one.sim > top.sim ? one : top), leaf[0])
export const splitSide = (dest: { x: number; y: number }) =>
  distKm(dest) <= SPLIT.cutKm ? 'low' : 'high'
export const tableRows = raw.cases.map((c) => ({
  ...c,
  zone: `C-${Math.floor(c.dest.x)}-${Math.floor(c.dest.y)}`,
  dist: distKm(c.dest),
  bucket: bucketOf(c.minutes).id,
  inLeaf: leaf.some((l) => l.c.id === c.id),
}))
export const LEAF_IDS = leaf.map((l) => l.c.id)
