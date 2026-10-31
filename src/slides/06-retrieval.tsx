import { Stage, Display, Eyebrow, Rise, Block, Lead } from '../deck/primitives'

const ROWS: [string, string, string, string][] = [
  ['Query cost', 'O(N) — 40k similarity computations per order', 'O(log N) — ~10 nodes walked', 'O(log N) + k (tree shortlist, metric re-rank)'],
  ['Result quality', 'Exact nearest neighbour always', 'Approximate: best case may sit one branch over', 'As good as table for the shortlist it scores'],
  ['Weights', 'Any feature, any weight, free', 'Only index attributes reachable; rest need metric', 'Weights live in the re-rank, not the tree'],
  ['Staleness', 'Stale = fresh', 'Stale branch keeps attracting old queries', 'Regime tags filter before ranking'],
]

export default function Retrieval() {
  return (
    <Stage accent="amber">
      <Eyebrow>Retrieval compared</Eyebrow>
      <Display className="mt-4 max-w-[22ch]">Table vs Tree vs Hybrid</Display>

      <Rise i={1}>
        <Block className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-base">
            <thead>
              <tr className="text-sm">
                <th className="pb-2 pr-3 font-medium text-ink-soft" />
                <th className="pb-2 pr-3 font-medium text-ink-soft">Flat table scan</th>
                <th className="pb-2 pr-3 font-medium" style={{ color: 'var(--section-accent)' }}>
                  Discrimination tree
                </th>
                <th className="pb-2 pr-0 font-medium text-ink-soft">Hybrid (recommended)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b, c]) => (
                <tr key={k} className="border-t border-hairline align-top">
                  <td className="w-40 py-2 pr-3 font-semibold">{k}</td>
                  <td className="py-2 pr-3 text-ink-soft">{a}</td>
                  <td className="py-2 pr-3">{b}</td>
                  <td className="py-2 pr-0 text-ink-soft">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>
      </Rise>

      <Rise i={2} className="mt-6">
        <Lead>
          The tree is <span className="prose-strong">fast and lossy</span>; the table is exact and slow.
          Production runs the hybrid: the tree proposes a shortlist, the weighted metric decides —
          the same division of labour the CBR cycle uses everywhere else.
        </Lead>
      </Rise>
    </Stage>
  )
}