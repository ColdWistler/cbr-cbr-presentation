import { Stage, Display, Eyebrow, Block, Rise, Mark, Dot } from '../deck/primitives'
import { DATA, Q, leaf, retrieved, distKm, SPLIT, LEAF_CAP } from '../data/cases'

export default function Adapt() {
  const s = DATA.storm
  const low = leaf.filter((l) => distKm(l.c.dest) <= SPLIT.cutKm)
  const high = leaf.filter((l) => distKm(l.c.dest) > SPLIT.cutKm)
  const retained = DATA.retained

  return (
    <Stage accent="blue">
      <Eyebrow>Worked example</Eyebrow>
      <Display className="mt-4 max-w-[26ch]">Revise it, then retain it</Display>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Rise i={1}>
          <Block className="h-full">
            <Mark>Revise</Mark>
            <h3 className="mt-3 font-display text-lg font-medium">{s.event}</h3>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              {retrieved.c.id}'s route crosses Elm St, closed {s.window} for works. N would hit it
              at ~08:30. Substitute {s.fix}: +{s.extraKm} km, +{s.extraMin} min, re-verified at{' '}
              {s.plan} min against the {Q.target} min target. Outcome: delivered {s.actual} min, on time.
            </p>
          </Block>
        </Rise>
        <Rise i={2}>
          <Block className="h-full">
            <Mark>Retain</Mark>
            <h3 className="mt-3 font-display text-lg font-medium">Store {retained.id}</h3>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              Problem, repaired solution and outcome, tagged{' '}
              <span className="mono">adapted_from {retrieved.c.id}</span> and{' '}
              <span className="mono">regime {retained.regime}</span>. Filed under the branch the
              walk already found.
            </p>
          </Block>
        </Rise>
        <Rise i={3}>
          <Block className="h-full">
            <Mark>Which branch</Mark>
            <h3 className="mt-3 font-display text-lg font-medium">Root → x=1 → y=4 → morning → moderate</h3>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              The leaf now holds {leaf.length + 1} cases — one over its cap of {LEAF_CAP} — so it
              splits on the next unused index attribute, {SPLIT.label} at {SPLIT.cutKm} km.
            </p>
          </Block>
        </Rise>
      </div>

      <Rise i={4} className="mt-8">
        <Block>
          <h3 className="font-display text-lg font-medium">The drawer after the split</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-hairline p-4">
              <p className="mono text-sm font-semibold" style={{ color: 'var(--section-accent)' }}>
                {SPLIT.low}
              </p>
              <ul className="mt-2 space-y-1 text-base text-ink-soft">
                {low.map((l) => (
                  <li key={l.c.id}>
                    <Dot className="mr-2" />
                    <span className="mono">{l.c.id}</span> · {distKm(l.c.dest).toFixed(2)} km
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-hairline p-4">
              <p className="mono text-sm font-semibold" style={{ color: 'var(--section-accent)' }}>
                {SPLIT.high}
              </p>
              <ul className="mt-2 space-y-1 text-base text-ink-soft">
                {high.map((l) => (
                  <li key={l.c.id}>
                    <Dot className="mr-2" />
                    <span className="mono">{l.c.id}</span> · {distKm(l.c.dest).toFixed(2)} km
                  </li>
                ))}
                <li>
                  <Dot className="mr-2" />
                  <span className="mono">{retained.id}</span> · {distKm(retained.dest).toFixed(2)} km ·{' '}
                  <span className="text-sm">the new case</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Same query tomorrow walks one level deeper and lands on a two-case leaf — the tree
            refines itself where the traffic of orders actually lands.
          </p>
        </Block>
      </Rise>
    </Stage>
  )
}
