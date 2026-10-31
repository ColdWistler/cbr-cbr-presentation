import { Stage, Display, Eyebrow, Rise, Block, Mark } from '../deck/primitives'
import { Q, DATA, leaf, retrieved, distKm, SPLIT, LEAF_CAP, hhmm, cell } from '../data/cases'

const n = (v: number, d = 3) => v.toFixed(d)

export default function Worked() {
  const s = DATA.storm
  const low = leaf.filter((l) => distKm(l.c.dest) <= SPLIT.cutKm)
  const high = leaf.filter((l) => distKm(l.c.dest) > SPLIT.cutKm)
  const retained = DATA.retained

  return (
    <Stage accent="blue">
      <Eyebrow>Worked example</Eyebrow>
      <Display className="mt-4 max-w-[28ch]">Order N at 08:12 — the whole story</Display>

      <Rise i={1} className="mt-8">
        <Block>
          <Mark>order N · 08:12 · target ≤ 25 min</Mark>
          <dl className="mt-4 grid gap-2 sm:grid-cols-2 text-base">
            <div><dt className="text-ink-soft">Destination</dt><dd className="mono">({Q.dest.x.toFixed(2)}, {Q.dest.y.toFixed(2)}) km · cell {cell(Q.dest)}</dd></div>
            <div><dt className="text-ink-soft">Time of day</dt><dd className="mono">{hhmm(Q.minutes)} · morning peak</dd></div>
            <div><dt className="text-ink-soft">Traffic</dt><dd className="mono">{DATA.query.traffic}</dd></div>
            <div><dt className="text-ink-soft">Day / weather</dt><dd className="mono">{DATA.query.dayType} · {DATA.query.weather}</dd></div>
          </dl>
        </Block>
      </Rise>

      <Rise i={2}>
        <Block className="mt-4 overflow-x-auto">
          <h3 className="font-display text-lg font-medium">Step 1 — walk the tree</h3>
          <p className="mt-2 text-base text-ink-soft">
            Root → <span className="mono">x = 1</span> → <span className="mono">y = 4</span> → <span className="mono">morning peak</span> → <span className="mono">moderate</span>
          </p>
          <p className="mt-2 text-base text-ink-soft">
            Leaf: {leaf.map((l) => l.c.id).join(', ')} — three candidates out of 40,000 rows
          </p>
        </Block>
      </Rise>

      <Rise i={3}>
        <Block className="mt-4 overflow-x-auto">
          <h3 className="font-display text-lg font-medium">Step 2 — rank by full similarity</h3>
          <table className="mt-2 w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="text-ink-soft">
                <th className="pb-2 pr-3 font-medium">candidate</th>
                <th className="pb-2 pr-3 font-medium">distance (km)</th>
                <th className="pb-2 pr-3 font-medium">coord score</th>
                <th className="pb-2 pr-3 font-medium">time diff (min)</th>
                <th className="pb-2 pr-3 font-medium">time score</th>
                <th className="pb-2 pr-3 font-medium">traffic</th>
                <th className="pb-2 pr-3 font-medium">day</th>
                <th className="pb-2 pr-3 font-medium">weather</th>
                <th className="pb-2 pr-0 font-medium">total sim</th>
              </tr>
            </thead>
            <tbody className="numeral">
              {leaf.map((l) => {
                const isBest = l.c.id === retrieved.c.id
                return (
                  <tr
                    key={l.c.id}
                    className="border-t border-hairline"
                    style={isBest ? { background: 'color-mix(in oklab, var(--section-accent) 10%, white)' } : undefined}
                  >
                    <td className="py-1.5 pr-3 font-semibold" style={isBest ? { color: 'var(--section-accent)' } : undefined}>
                      {l.c.id} {isBest && <span className="ml-2 text-xs font-medium">← picked</span>}
                    </td>
                    <td className="py-1.5 pr-3">{n(l.d, 3)}</td>
                    <td className="py-1.5 pr-3">{n(l.sCoord)}</td>
                    <td className="py-1.5 pr-3">{Math.abs(Q.minutes - l.c.minutes)}</td>
                    <td className="py-1.5 pr-3">{n(l.sTime)}</td>
                    <td className="py-1.5 pr-3">{n(l.sTraffic, 1)}</td>
                    <td className="py-1.5 pr-3">{n(l.sDay, 1)}</td>
                    <td className="py-1.5 pr-3">{n(l.sWeather, 1)}</td>
                    <td className="py-1.5 pr-0 font-semibold" style={{ color: 'var(--section-accent)' }}>
                      {n(l.sim)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mono mt-3 text-sm text-ink-soft">
            sim = 0.40×coord + 0.25×time + 0.20×traffic + 0.10×day + 0.05×weather
          </p>
        </Block>
      </Rise>

      <Rise i={4}>
        <Block className="mt-4">
          <Mark>Picked: {retrieved.c.id} · sim {n(retrieved.sim)}</Mark>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            Reused R-0512's route (driven {retrieved.c.actualMin.toFixed(1)} min on a comparable morning).
            Runner-up at {n(leaf[0].c.id === retrieved.c.id ? leaf[1].sim : leaf[0].sim)}.
          </p>
        </Block>
      </Rise>

      <Rise i={5}>
        <Block className="mt-4">
          <Mark>Revise</Mark>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            {s.event}, window {s.window}. N would hit it at ~08:30. Substitute {s.fix}: +{s.extraKm} km, +{s.extraMin} min,
            re-verified at {s.plan} min → delivered {s.actual} min, on time.
          </p>
        </Block>
      </Rise>

      <Rise i={6}>
        <Block className="mt-4">
          <Mark>Retain & split</Mark>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            N-1187 filed under the same branch → leaf now has {leaf.length + 1} cases, over cap of {LEAF_CAP}.
            Splits on next unused attribute: <span className="mono">{SPLIT.label} at {SPLIT.cutKm} km</span>.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-hairline p-3">
              <p className="mono text-sm font-semibold" style={{ color: 'var(--section-accent)' }}>{SPLIT.low}</p>
              <ul className="mt-1 space-y-1 text-sm text-ink-soft">
                {low.map((l) => (
                  <li key={l.c.id}><span className="mono">{l.c.id}</span> · {distKm(l.c.dest).toFixed(2)} km</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-hairline p-3">
              <p className="mono text-sm font-semibold" style={{ color: 'var(--section-accent)' }}>{SPLIT.high}</p>
              <ul className="mt-1 space-y-1 text-sm text-ink-soft">
                {high.map((l) => (
                  <li key={l.c.id}><span className="mono">{l.c.id}</span> · {distKm(l.c.dest).toFixed(2)} km</li>
                ))}
                <li><span className="mono">{retained.id}</span> · {distKm(retained.dest).toFixed(2)} km · the new case</li>
              </ul>
            </div>
          </div>
        </Block>
      </Rise>
    </Stage>
  )
}