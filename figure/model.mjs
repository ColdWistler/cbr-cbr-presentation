// The pure model behind the figure. Every number the drawing and the readout
// show comes from here, and from ../shared/cases.json only.
import raw from "../shared/cases.json" with { type: "json" };

export const DATA = raw;
export const Q = raw.query;
export const W = raw.weights;
export const SIGMA = raw.sigma;

export const zoneOf = (dest) => ({ x: Math.floor(dest.x), y: Math.floor(dest.y) });
export const cell = (dest) => `C-${Math.floor(dest.x)}-${Math.floor(dest.y)}`;
export const distKm = (dest) => Math.hypot(dest.x - raw.depot.x, dest.y - raw.depot.y);
export const bucketOf = (minutes) => raw.buckets.find((b) => minutes >= b.from && minutes < b.to) || raw.buckets[raw.buckets.length - 1];
export const hhmm = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const expSim = (delta, sigma) => Math.exp(-(delta * delta) / (2 * sigma * sigma));
export const trafficSim = (a, b) => (a === b ? 1 : (a === "light" && b === "heavy") || (a === "heavy" && b === "light") ? 0.2 : 0.6);
export const daySim = (a, b) => (a === b ? 1 : 0.3);
export const weatherSim = (a, b) => (a === b ? 1 : 0.4);

export function similarity(problem, c) {
  const d = Math.hypot(problem.dest.x - c.dest.x, problem.dest.y - c.dest.y);
  const sCoord = expSim(d, SIGMA.coordKm);
  const sTime = expSim(Math.abs(problem.minutes - c.minutes), SIGMA.timeMin);
  const sTraffic = trafficSim(problem.traffic, c.traffic);
  const sDay = daySim(problem.dayType, c.dayType);
  const sWeather = weatherSim(problem.weather, c.weather);
  const sim = W.coord * sCoord + W.time * sTime + W.traffic * sTraffic + W.dayType * sDay + W.weather * sWeather;
  return { d, sCoord, sTime, sTraffic, sDay, sWeather, sim };
}

// The discrimination tree walk: index attributes in raw.index.order.
export function walk(problem) {
  const zone = zoneOf(problem.dest);
  const bucket = bucketOf(problem.minutes);
  return {
    path: [
      { attribute: "zoneX", test: `dest x-band = ${zone.x}` },
      { attribute: "zoneY", test: `dest y-band = ${zone.y}` },
      { attribute: "bucket", test: `time = ${bucket.id}` },
      { attribute: "traffic", test: `traffic = ${problem.traffic}` },
    ],
    zone,
    bucket,
    cases: raw.cases.filter((c) => zoneOf(c.dest).x === zone.x && zoneOf(c.dest).y === zone.y && bucketOf(c.minutes).id === bucket.id && c.traffic === problem.traffic),
  };
}

export const scored = raw.cases.map((c) => ({ case: c, ...similarity(Q, c) }));
export const ranked = [...scored].sort((a, b) => b.sim - a.sim);
export const leaf = walk(Q).cases.map((c) => ({ case: c, ...similarity(Q, c) }));
export const best = leaf.reduce((top, one) => (one.sim > top.sim ? one : top), leaf[0]);

// Which side of the retain-split the new case lands on.
export const splitSide = (c) => (distKm(c.dest) <= raw.index.split.cutKm ? "low" : "high");

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("walk:", walk(Q).path.map((p) => p.test).join(" → "));
  console.log("leaf:", leaf.map((l) => `${l.case.id} ${l.sim.toFixed(3)}`).join(", "));
  console.log("retrieved:", best.case.id, best.sim.toFixed(3));
  console.log("global best:", ranked[0].case.id, ranked[0].sim.toFixed(3));
  console.log("split of N-1187:", splitSide(raw.retained), "· R-0512:", splitSide(raw.cases[7]));
}
