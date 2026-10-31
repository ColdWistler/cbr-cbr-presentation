import { Stage, Display, Eyebrow, Block, Rise, Mark } from '../deck/primitives'
import { DATA, leaf } from '../data/cases'

const POLICIES = [
  {
    title: 'A budget, stated as a number',
    body: 'Retention is a policy, not a habit: cap the case base by rows, by memory, or by a query-latency SLA. Without a number, every policy argument is a vibe. This fleet caps at 30,000 cases.',
  },
  {
    title: 'Utility-weighted forgetting',
    body: 'Keep the cases that earn their keep: U(c) = success rate × reuses ÷ (1 + days since last use). Delete the lowest U under budget; random deletion is the baseline that shows the gain.',
  },
  {
    title: 'Footprint pruning',
    body: 'Delete cases whose neighbours already cover the same competence region — redundancy, not value, is what bloats a case base (Smyth & Keane, 1995).',
  },
  {
    title: 'Condensation',
    body: 'Cluster old, quiet regions and keep the exemplar (medoid) of each; archive the rest. Cold regions shrink to a handful of representatives instead of thousands of near-duplicates.',
  },
]

export default function Prune() {
  const utility = (id: string) => {
    const c = DATA.cases.find((x) => x.id === id)!
    return ((c.outcome === 'on-time' ? 1 : 0.5) * c.uses) / (1 + c.lastUsedDays)
  }
  const sorted = [...leaf].sort((a, b) => utility(b.c.id) - utility(a.c.id))

  return (
    <Stage accent="green">
      <Eyebrow>Maintenance</Eyebrow>
      <Display className="mt-4 max-w-[22ch]">Prune on purpose</Display>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {POLICIES.map((p, i) => (
          <Rise i={i + 1} key={p.title}>
            <Block className="h-full">
              <Mark>{`P${i + 1}`}</Mark>
              <h3 className="mt-2 font-display text-xl font-medium">{p.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">{p.body}</p>
            </Block>
          </Rise>
        ))}
      </div>

      <Rise i={5} className="mt-8">
        <Block>
          <h3 className="font-display text-lg font-medium">The same three leaf cases, scored for forgetting</h3>
          <table className="mt-3 w-full text-left text-base">
            <thead>
              <tr className="text-sm text-ink-soft">
                <th className="pb-2 pr-4 font-medium">case</th>
                <th className="pb-2 pr-4 font-medium">uses</th>
                <th className="pb-2 pr-4 font-medium">outcome</th>
                <th className="pb-2 pr-4 font-medium">TSK (days)</th>
                <th className="pb-2 pr-0 font-medium">U</th>
              </tr>
            </thead>
            <tbody className="numeral">
              {sorted.map((l) => (
                <tr key={l.c.id} className="border-t border-hairline">
                  <td className="py-2 pr-4 font-semibold">{l.c.id}</td>
                  <td className="py-2 pr-4">{l.c.uses}</td>
                  <td className="py-2 pr-4">{l.c.outcome}</td>
                  <td className="py-2 pr-4">{l.c.lastUsedDays}</td>
                  <td className="py-2 pr-0 font-semibold" style={{ color: 'var(--section-accent)' }}>
                    {utility(l.c.id).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Utility ranks R-0512 first — the case retrieve keeps choosing — and R-0450 last. Note
            that forgetting is the <span className="prose-strong">only</span> policy here that
            ever removes a case the tree still finds useful; the others just keep the base honest.
          </p>
        </Block>
      </Rise>
    </Stage>
  )
}
