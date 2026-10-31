import { Stage, Display, Eyebrow, Rise, Lead, Block } from '../deck/primitives'

const NUMBERS = [
  { value: 12000, label: 'orders per day', note: 'each one planned from scratch right now' },
  { value: 40000, label: 'past routes in the archive', note: 'every one already driven and solved' },
  { value: 8, suffix: '–40 s', label: 'compute time per order', note: 'before the first parcel even moves' },
]

export default function Problem() {
  return (
    <Stage accent="red">
      <Eyebrow>The problem</Eyebrow>
      <Display className="mt-4 max-w-[20ch]">Every route we need has already been driven</Display>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {NUMBERS.map((n, i) => (
          <Rise i={i + 1} key={n.label}>
            <Block className="h-full">
              <p className="numeral font-display text-4xl font-medium text-ink">
                {n.value}
                {n.suffix && <span className="text-2xl text-ink-soft">{n.suffix}</span>}
              </p>
              <p className="mt-1 text-base font-medium">{n.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{n.note}</p>
            </Block>
          </Rise>
        ))}
      </div>

      <Rise i={5} className="mt-12">
        <Lead>
          The archive is a liability only because nothing in it can be found in time. We already
          own the answer; <span className="prose-strong">the problem is retrieval, not planning</span>.
        </Lead>
      </Rise>
    </Stage>
  )
}