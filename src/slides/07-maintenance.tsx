import { Stage, Split, Display, Eyebrow, Rise, Block, Mark, Dot } from '../deck/primitives'
import PruneChart from '../components/visuals/PruneChart'
import StalenessTimeline from '../components/visuals/StalenessTimeline'
import { DATA, leaf } from '../data/cases'

const utility = (id: string) => {
  const c = DATA.cases.find((x) => x.id === id)!
  return ((c.outcome === 'on-time' ? 1 : 0.5) * c.uses) / (1 + c.lastUsedDays)
}
const sorted = [...leaf].sort((a, b) => utility(b.c.id) - utility(a.c.id))

const PRUNE = [
  { title: 'Set a budget', body: 'Cap by rows (30k), memory, or query-time SLA. Without a number, every policy is just a vibe.' },
  { title: 'Utility-weighted forgetting', body: 'U(c) = success rate × reuses ÷ (1 + days since last use). Delete the lowest U under budget; random deletion is the baseline.' },
  { title: 'Footprint pruning', body: 'Delete cases whose neighbours already cover the same area — redundancyot value, bloats the base.' },
  { title: 'Condensation', body: 'Cluster old quiet regions; keep the exemplars. Cold regions shrink to a handful instead of thousands of near-duplicates.' },
]

export default function Maintenance() {
  return (
    <Stage accent="green">
      <Split ratio="50/50">
        <div>
          <Eyebrow>Maintenance</Eyebrow>
          <Display className="mt-4 max-w-[18ch]">Prune on purpose</Display>

          <Rise i={1} className="mt-6">
            <PruneChart />
          </Rise>

          {PRUNE.map((p, i) => (
            <Rise i={i + 2} key={p.title}>
              <Block className="h-full">
                <Mark>{`P${i + 1}`}</Mark>
                <h3 className="mt-2 font-display text-lg font-medium">
                  <Dot className="mr-2" />
                  {p.title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-ink-soft">{p.body}</p>
              </Block>
            </Rise>
          ))}
        </div>
        <div className="space-y-4">
          <Rise i={1}>
            <Display as="h2" size="2xl" className="mt-4 max-w-[18ch]">
              Fight stalenessot size
            </Display>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              A case base that never grows gets slow; one that never forgets gets{' '}
              <span className="prose-strong">wrong</span>. Staleness is measuredot guessed.
            </p>
          </Rise>

          <Rise i={2}>
            <StalenessTimeline />
          </Rise>
        </div>
      </Split>
    </Stage>
  )
}