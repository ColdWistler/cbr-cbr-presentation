import { Stage, Display, Eyebrow, Rise, Lead } from '../deck/primitives'
import SpotlightCard from '../components/reactbits/SpotlightCard'

const STEPS = [
  {
    r: 'Retrieve',
    line: 'Weighted k-NN over normalised features: coord 0.40, time 0.25, traffic 0.20, day 0.10, weather 0.05',
  },
  {
    r: 'Reuse',
    line: 'Copy the route skeleton (ordered streets, timings); leave holes where the problems differ',
  },
  {
    r: 'Revise',
    line: 'Test against live traffic & closures, repair mismatches, re-score before dispatch',
  },
  {
    r: 'Retain',
    line: 'Store problem + repaired solution + outcome → next similar order is faster to answer',
  },
]

export default function Cycle() {
  return (
    <Stage accent="blue">
      <Eyebrow>The CBR cycle</Eyebrow>
      <Display className="mt-4 max-w-[24ch]">The 4-R loop in delivery terms</Display>

      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Rise i={i + 1} key={s.r} className="relative">
            <SpotlightCard
              theme="light"
              spotlightColor="rgba(29,78,216,0.14)"
              className="h-full rounded-2xl border border-hairline bg-surface p-5"
              spotlightSize={260}
              proximity={90}
            >
              <p className="numeral text-sm font-semibold" style={{ color: 'var(--section-accent)' }}>
                R{i + 1}
              </p>
              <h3 className="mt-1 font-display text-2xl font-medium">{s.r}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">{s.line}</p>
            </SpotlightCard>
            {i < STEPS.length - 1 && (
              <span
                className="pointer-events-none absolute top-1/2 -right-3 hidden -translate-y-1/2 text-lg lg:block"
                style={{ color: 'var(--section-accent)' }}
                aria-hidden="true"
              >
                →
              </span>
            )}
          </Rise>
        ))}
      </div>

      <Rise i={6} className="mt-10">
        <Lead>
          The loop closes on itself: <span className="prose-strong">Retain feeds Retrieve</span>.
          CBR's knowledge sits in four containers — the case base, the vocabulary, the similarity
          measure and the adaptation knowledge. Three of the four are learned from deliveries.
        </Lead>
      </Rise>
    </Stage>
  )
}