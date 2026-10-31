import { Stage, Display, Eyebrow, Rise, Lead } from '../deck/primitives'
import SpotlightCard from '../components/reactbits/SpotlightCard'

const STEPS = [
  {
    r: 'Retrieve',
    line: 'Given the new problem, find the most similar solved case — weighted nearest neighbours over the case features.',
  },
  {
    r: 'Reuse',
    line: 'Map the retrieved solution onto the new problem: copy the route skeleton, leave holes where the problems differ.',
  },
  {
    r: 'Revise',
    line: 'Test the reused solution against live traffic and closure feeds, repair it, and score the repaired route.',
  },
  {
    r: 'Retain',
    line: 'Store problem + repaired solution + outcome so the next similar order is faster to answer.',
  },
]

export default function Loop() {
  return (
    <Stage accent="blue">
      <Eyebrow>The CBR cycle</Eyebrow>
      <Display className="mt-4 max-w-[24ch]">The loop, once, in delivery terms</Display>

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
          measure and the adaptation knowledge. Three of the four are learned from the deliveries
          this deck walks through.
        </Lead>
      </Rise>
    </Stage>
  )
}
