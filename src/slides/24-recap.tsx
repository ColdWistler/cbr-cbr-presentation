import { Stage, Display, Eyebrow, Rise, Block } from '../deck/primitives'

const LINES: [string, string][] = [
  ['The 4-R loop', 'Retrieve → Reuse → Revise → Retain. Retain is what makes the next Retrieve smarter; Revise is what keeps it honest.'],
  ['Memory needs an index', 'Destination coordinates + time of day as index attributes turn an O(N) scan into a guided walk down the discrimination tree.'],
  ['The worked order', '08:12 to cell C-14 walked to branch x=1 / y=4 / morning peak / moderate, retrieved R-0512 at 0.998, was adapted around a closure, and was retained as N-1187 — which split the drawer.'],
  ['Table vs tree', 'Tables are exact and flexible, trees are fast and lossy. Production runs the hybrid: tree shortlist, weighted metric re-rank.'],
  ['Maintenance is a feature', 'Utility-weighted forgetting, footprint pruning, expiry, regime tags and re-indexing keep the case base small, fast and fresh.'],
]

export default function Recap() {
  return (
    <Stage accent="teal">
      <Eyebrow>Close</Eyebrow>
      <Display className="mt-4">Recap</Display>
      <div className="mt-8 space-y-4">
        {LINES.map(([k, v], i) => (
          <Rise i={i + 1} key={k}>
            <Block className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <p className="w-56 shrink-0 font-display text-xl font-medium" style={{ color: 'var(--section-accent)' }}>
                {k}
              </p>
              <p className="max-w-[80ch] text-base leading-relaxed text-ink-soft">{v}</p>
            </Block>
          </Rise>
        ))}
      </div>
      <Rise i={7} className="mt-10">
        <p className="font-display text-4xl font-medium text-ink">
          Plan less, remember better — index it, revise it, prune it.
        </p>
      </Rise>
    </Stage>
  )
}
