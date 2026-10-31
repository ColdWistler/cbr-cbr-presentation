import { Stage, Split, Display, Eyebrow, Block, Rise, Lead } from '../deck/primitives'
import { DATA } from '../data/cases'

const BUCKETS = DATA.buckets.map((b) => ({ id: b.id, label: b.label }))

export default function Index() {
  return (
    <Stage accent="purple">
      <Split ratio="55/45">
        <div>
          <Eyebrow>Case memory</Eyebrow>
          <Display className="mt-4 max-w-[20ch]">Index attributes decide the query's fate</Display>
          <Lead className="mt-6">
            A full scan compares the new order against every row: 40,000 rows × 12,000 orders a
            day is <span className="prose-strong">480 million similarity computations</span> — too
            slow to be interactive. An index attribute is a feature the tree can branch on; a
            retrieval feature is one the metric scores. They are different jobs.
          </Lead>
          <Rise i={2}>
            <Block className="mt-6">
              <h3 className="font-display text-lg font-medium">Index attributes, in order</h3>
              <ol className="mt-3 space-y-2 text-base text-ink-soft">
                <li><span className="prose-strong">1 · Destination coordinates</span> → grid cell (1 km), coarse first</li>
                <li><span className="prose-strong">2 · Time of day</span> → the bucket at right</li>
                <li><span className="prose-strong">3 · Observed traffic</span> → light / moderate / heavy</li>
              </ol>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Everything else — weather, day type, vehicle — stays a retrieval feature, so
                weights can change without rebuilding the tree.
              </p>
            </Block>
          </Rise>
        </div>
        <div className="space-y-4">
          <Rise i={1}>
            <Block>
              <h3 className="font-display text-lg font-medium">Time-of-day buckets</h3>
              <ul className="mt-3 space-y-2">
                {BUCKETS.map((b) => (
                  <li key={b.id} className="flex items-baseline justify-between gap-4 border-b border-hairline pb-2 text-base last:border-0">
                    <span className="mono">{b.id}</span>
                    <span className="text-ink-soft">{b.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ink-soft">
                Buckets are coarser than minutes because two orders twenty minutes apart in the
                same bucket share the same congestion regime.
              </p>
            </Block>
          </Rise>
          <Rise i={2}>
            <p className="text-sm leading-relaxed text-ink-soft">
              Coordinates get two levels (x-band, then y-band) rather than one exact cell: an
              exact cell over-splits and starves the leaf, a band keeps neighbours reachable
              for the metric to rank.
            </p>
          </Rise>
        </div>
      </Split>
    </Stage>
  )
}
