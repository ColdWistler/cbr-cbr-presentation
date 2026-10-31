import { Stage, Display, Eyebrow, Rise, Lead } from '../deck/primitives'
import SpotlightCard from '../components/reactbits/SpotlightCard'

const STEPS = [
  {
    r: 'Retrieve',
    line: 'Find the closest past order — weighted by distance (40%), time of day (25%), traffic (20%), day type (10%), weather (5%)',
  },
  {
    r: 'Reuse',
    line: 'Copy the route skeleton (streets + timings); leave holes where the new order differs',
  },
  {
    r: 'Revise',
    line: 'Test against live traffic and road closures, repair any mismatches, re-score before sending the driver',
  },
  {
    r: 'Retain',
    line: 'Save the new order, its adapted route, and the outcome — so the next similar order is faster',
  },
]

export default function Cycle() {
  return (
    <Stage accent="blue">
      <Eyebrow>The CBR cycle</Eyebrow>
      <Display className="mt-4 max-w-[24ch]">The 4-R loop in plain language</Display>

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
          The loop feeds itself: <span className="prose-strong">Retain makes the next Retrieve smarter</span>.
          The system has four knowledge pieces — the case library, the vocabulary, the similarity measure,
          and the adaptation rules. Three of them are learned from actual deliveries.
        </Lead>
      </Rise>
    </Stage>
  )
}