import { Stage, Display, Eyebrow, Rise, Block, Mark } from '../deck/primitives'
import SimilarityChart from '../components/visuals/SimilarityChart'
import DrawerSplit from '../components/visuals/DrawerSplit'
import { DATA, Q, leaf, retrieved, hhmm, cell } from '../data/cases'



export default function Worked() {
  const s = DATA.storm
  
  
  

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
        <Block className="mt-4">
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
        <SimilarityChart />
      </Rise>

      <Rise i={4}>
        <Block className="mt-4">
          <Mark>Picked: {retrieved.c.id} · {(retrieved.sim * 100).toFixed(1)}% match</Mark>
          <p className="mt-2 text-base leading-relaxed text-ink-soft">
            Reused R-0512's route (driven {retrieved.c.actualMin.toFixed(1)} min on a comparable morning).
            Runner-up at {(leaf[0].c.id === retrieved.c.id ? leaf[1].sim : leaf[0].sim * 100).toFixed(1)}%.
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
        <DrawerSplit />
      </Rise>
    </Stage>
  )
}