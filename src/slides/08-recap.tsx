import { Stage, Display, Eyebrow, Rise, Block, Split } from '../deck/primitives'

const LINES: [string, string][] = [
  ['The 4-R loop', 'Retrieve → Reuse → Revise → Retain. Retain makes the next Retrieve smarter; Revise keeps it honest.'],
  ['Memory needs an index', 'Destination coordinates + time of day turn a full scan into a guided tree walk.'],
  ['The worked order', '08:12 to cell C-14 walked to x=1 / y=4 / morning peak / moderate, retrieved R-0512 at 0.998, adapted around a closure, retained as N-1187 — which split the drawer.'],
  ['Table vs tree', 'Tables exact, trees fast. Production runs the hybrid: tree shortlist + weighted metric re-rank.'],
  ['Maintenance is a feature', 'Utility-weighted forgetting, footprint pruning, expiry, regime tags, re-indexing keep the base small, fast and fresh.'],
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
              <p className="w-52 shrink-0 font-display text-xl font-medium" style={{ color: 'var(--section-accent)' }}>
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

      <Rise i={8} className="mt-12">
        <Split ratio="50/50">
          <div>
            <h3 className="font-display text-lg font-medium">References</h3>
            <ul className="mt-2 space-y-2 text-base text-ink-soft">
              <li><span className="prose-strong">Aamodt & Plaza (1994)</span> — the four Rs this deck is built on</li>
              <li><span className="prose-strong">Smyth & Keane (1995)</span> — footprint-based competence models for forgetting</li>
              <li><span className="prose-strong">Leake & Wilson (1998)</span> — CBR maintenance: efficiency + accuracy</li>
              <li>Anatomy figure: <span className="mono">figure/build.mjs</span>; shared source: <span className="mono">shared/cases.json</span></li>
              <li>Deploy: <span className="mono">.github/workflows/deploy.yml</span> builds & publishes to Pages on push</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium">Built with</h3>
            <ul className="mt-2 space-y-1.5 text-base text-ink-soft">
              <li>React Bits — SplitText, DotGrid, SoftAurora, SpotlightCard, Counter</li>
              <li>Originkit — dash-cursor, weight-hover, frost-glass-card (fetched by script)</li>
              <li>Anatomy — case-memory sorter figure (MIT)</li>
              <li>Vite · React · TypeScript · Tailwind v4</li>
            </ul>
          </div>
        </Split>
      </Rise>
    </Stage>
  )
}