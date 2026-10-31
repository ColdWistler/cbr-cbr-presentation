import { Stage, Display, Eyebrow, Block, Rise, Lead } from '../deck/primitives'

const ROWS: [string, string, string, string][] = [
  ['Query cost', 'O(N) — 40,000 similarity computations per order', 'O(log N) — one child per level, ~10 nodes walked', 'tree shortlist, then metric ranks — O(log N) + k'],
  ['Result quality', 'exact nearest neighbour, always', 'approximate: the best case may sit one branch over', 'as good as the table for the shortlist it scores'],
  ['Index build', 'none', 'choose attribute order, split over-cap leaves', 'one tree build; re-learn when drift is measured'],
  ['Insert / update', 'append a row', 'walk to a leaf; split on overflow', 'same, plus re-rank is a read path only'],
  ['Weights', 'any feature, any weight, free', 'only index attributes are reachable; the rest need the metric', 'weights live in the re-rank, not the tree'],
  ['Staleness', 'stale rows score the same as fresh ones', 'stale branch keeps attracting its old queries', 'regime tags filter before ranking'],
  ['Complexity', 'a table and a for-loop', 'a tree, splits, and a monitoring story', 'both, plus the glue'],
]

export default function Compare() {
  return (
    <Stage accent="amber">
      <Eyebrow>Retrieval compared</Eyebrow>
      <Display className="mt-4 max-w-[22ch]">Two ways to find a case — and the one that ships</Display>

      <Rise i={1}>
        <Block className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-base">
            <thead>
              <tr className="text-sm">
                <th className="pb-3 pr-4 font-medium text-ink-soft" />
                <th className="pb-3 pr-4 font-medium text-ink-soft">Flat table scan</th>
                <th className="pb-3 pr-4 font-medium" style={{ color: 'var(--section-accent)' }}>
                  Discrimination tree
                </th>
                <th className="pb-3 pr-0 font-medium text-ink-soft">Hybrid (recommended)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b, c]) => (
                <tr key={k} className="border-t border-hairline align-top">
                  <td className="w-40 py-2.5 pr-4 font-semibold">{k}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{a}</td>
                  <td className="py-2.5 pr-4">{b}</td>
                  <td className="py-2.5 pr-0 text-ink-soft">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>
      </Rise>

      <Rise i={2} className="mt-6">
        <Lead>
          The tree is <span className="prose-strong">fast and lossy</span>; the table is exact and
          slow. Production runs the hybrid: the tree proposes a shortlist, the weighted metric
          decides — the same division of labour the CBR cycle uses everywhere else.
        </Lead>
      </Rise>
    </Stage>
  )
}
