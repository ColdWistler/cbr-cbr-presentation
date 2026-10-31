import { Stage, Split, Display, Eyebrow, Rise, Block, Lead, Mark, Dot } from '../deck/primitives'
import { DATA, leaf } from '../data/cases'

const utility = (id: string) => {
  const c = DATA.cases.find((x) => x.id === id)!
  return ((c.outcome === 'on-time' ? 1 : 0.5) * c.uses) / (1 + c.lastUsedDays)
}
const sorted = [...leaf].sort((a, b) => utility(b.c.id) - utility(a.c.id))

const PRUNE = [
  { title: 'Budget', body: 'Cap by rows (30k), memory, or query-latency SLA. Without a number, every policy is a vibe.' },
  { title: 'Utility-weighted forgetting', body: 'U(c) = success rate × reuses ÷ (1 + days since last use). Delete lowest U under budget; random is baseline.' },
  { title: 'Footprint pruning', body: 'Delete cases whose neighbours already cover the same competence region — redundancy, not value, bloats the base.' },
  { title: 'Condensation', body: 'Cluster old quiet regions; keep exemplars (medoids). Cold regions shrink to a handful instead of thousands of near-duplicates.' },
]

const STALE = [
  { title: 'Age: expiry + decay', body: 'Retire cases > 90 days; multiply similarity by exp(−λ·age). Old-but-good still competes, loses ties.' },
  { title: 'Events beat clocks', body: 'Topology change (new bridge, permanent closure) invalidates a region immediately — purge or re-tag, don\'t wait for expiry.' },
  { title: 'Regimes & provenance', body: 'Tag cases pre/post each event; retrieval prefers current regime. Provenance makes "why this route?" answerable.' },
  { title: 'Watch the drift', body: 'Track recall@1 offline, index drift (best cases outside walked branch), Revise failure rate — that last one is the staleness alarm.' },
]

export default function Maintenance() {
  return (
    <Stage accent="green">
      <Split ratio="50/50">
        <div>
          <Eyebrow>Maintenance</Eyebrow>
          <Display className="mt-4 max-w-[18ch]">Prune on purpose</Display>

          <Rise i={1} className="mt-6">
            <Block>
              <h3 className="font-display text-lg font-medium">The same three leaf cases, scored for forgetting</h3>
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="text-ink-soft">
                    <th className="pb-2 pr-3 font-medium">case</th>
                    <th className="pb-2 pr-3 font-medium">uses</th>
                    <th className="pb-2 pr-3 font-medium">outcome</th>
                    <th className="pb-2 pr-3 font-medium">TSK (days)</th>
                    <th className="pb-2 pr-0 font-medium">U</th>
                  </tr>
                </thead>
                <tbody className="numeral">
                  {sorted.map((l) => (
                    <tr key={l.c.id} className="border-t border-hairline">
                      <td className="py-1.5 pr-3 font-semibold">{l.c.id}</td>
                      <td className="py-1.5 pr-3">{l.c.uses}</td>
                      <td className="py-1.5 pr-3">{l.c.outcome}</td>
                      <td className="py-1.5 pr-3">{l.c.lastUsedDays}</td>
                      <td className="py-1.5 pr-0 font-semibold" style={{ color: 'var(--section-accent)' }}>
                        {utility(l.c.id).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Utility ranks R-0512 first — the case retrieve keeps choosing — and R-0450 last.
                Forgetting is the <span className="prose-strong">only</span> policy that removes a case the tree still finds useful.
              </p>
            </Block>
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
              Fight staleness, not size
            </Display>
            <Lead>
              A case base that never grows gets slow; one that never forgets gets{' '}
              <span className="prose-strong">wrong</span>. Staleness is measured, not guessed.
            </Lead>
          </Rise>

          {STALE.map((t, i) => (
            <Rise i={i + 2} key={t.title}>
              <Block className="h-full">
                <Mark>{`S${i + 1}`}</Mark>
                <h3 className="mt-2 font-display text-lg font-medium">
                  <Dot className="mr-2" />
                  {t.title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-ink-soft">{t.body}</p>
              </Block>
            </Rise>
          ))}
        </div>
      </Split>
    </Stage>
  )
}