import { Stage, Eyebrow, Numeral, Rise } from '../deck/primitives'
import type { Accent } from '../deck/primitives'

export function Divider({
  index,
  title,
  blurb,
  accent,
}: {
  index: string
  title: string
  blurb: string
  accent: Accent
}) {
  return (
    <Stage
      accent={accent}
      className="justify-center overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 90% at 12% 20%, color-mix(in oklab, var(--section-accent) 14%, transparent), transparent 60%)',
        }}
      />
      <Numeral className="right-6 top-1/2 -translate-y-1/2">{index}</Numeral>
      <div className="max-w-[16ch]">
        <Eyebrow>Section {index}</Eyebrow>
        <h2 className="display mt-4 text-6xl">{title}</h2>
      </div>
      <Rise i={2}>
        <p className="mt-8 max-w-[64ch] text-lg leading-relaxed text-ink-soft">{blurb}</p>
      </Rise>
    </Stage>
  )
}

export default function DividerCycle() {
  return (
    <Divider
      index="01"
      title="The CBR cycle"
      blurb="Four steps from Aamodt & Plaza's 1994 formulation, read against a delivery fleet: a new problem retrieves a similar solved case, the solution is reused and repaired against live traffic and closures, and the finished delivery is retained so the next query is faster. The loop is what makes the system feel experienced."
      accent="blue"
    />
  )
}
