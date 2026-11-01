import { Stage, Split, Display, Eyebrow, Rise, Block, Dot } from '../deck/primitives' 

export default function Memory() {
  return (
    <Stage accent="purple">
      <Split ratio="55/45">
        <div>
          <Eyebrow>Case memory</Eyebrow>
          <Display className="mt-4 max-w-[26ch]">The table + the discrimination tree</Display>

          <Rise i={1}>
            <Block className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="text-ink-soft">
                    <th className="pb-2 pr-3 font-medium">case</th>
                    <th className="pb-2 pr-3 font-medium">destination (x, y)</th>
                    <th className="pb-2 pr-3 font-medium">zone</th>
                    <th className="pb-2 pr-3 font-medium">km</th>
                    <th className="pb-2 pr-3 font-medium">time</th>
                    <th className="pb-2 pr-3 font-medium">bucket</th>
                    <th className="pb-2 pr-3 font-medium">traffic</th>
                    <th className="pb-2 pr-3 font-medium">actual time</th>
                    <th className="pb-2 pr-0 font-medium">result</th>
                  </tr>
                </thead>
                <tbody className="numeral">
                  {tableRows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-hairline"
                      style={r.inLeaf ? { background: 'color-mix(in oklab, var(--section-accent) 8%, transparent)' } : undefined}
                    >
                      <td className="py-1.5 pr-3 font-semibold" style={r.inLeaf ? { color: 'var(--section-accent)' } : undefined}>
                        {r.id}
                      </td>
                      <td className="py-1.5 pr-3">{r.dest.x.toFixed(2)}, {r.dest.y.toFixed(2)}</td>
                      <td className="py-1.5 pr-3">{r.zone}</td>
                      <td className="py-1.5 pr-3">{r.dist.toFixed(2)}</td>
                      <td className="py-1.5 pr-3">{hhmm(r.minutes)}</td>
                      <td className="py-1.5 pr-3">{r.bucket}</td>
                      <td className="py-1.5 pr-3">{r.traffic}</td>
                      <td className="py-1.5 pr-3">{r.actualMin.toFixed(1)} min</td>
                      <td className="py-1.5 pr-0">{r.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Block>
          </Rise>

          <Rise i={2}>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Ten of 40,000 rows. Highlighted = the three cases order N reaches.
              <span className="prose-strong">This table is the case base</span> — the tree is just an index on top of it.
            </p>
          </Rise>
        </div>
        <div>
          <Rise i={1}>
            <div className="card-surface overflow-hidden" style={{ borderWidth: '4px' }}>
              <iframe
                src="./figure/memory-sorter-light.html"
                title="Anatomy diagram: case memory sorter"
                className="w-full h-[420px] border-0"
                loading="lazy"
              />
            </div>
          </Rise>
          <Rise i={2}>
            <Block className="mt-4">
              <h3 className="font-display text-lg font-extrabold uppercase">The discrimination tree</h3>
              <ul className="mt-2 space-y-2 text-base text-ink-soft">
                <li><Dot className="mr-2" /> Index attributes, in order: <span className="mono">x-band → y-band → time bucket → traffic</span></li>
                <li><Dot className="mr-2" /> Fan-out = number of possible values; leaf cap = 3 cases</li>
                <li><Dot className="mr-2" /> Insert = walk to a leaf and store; when a leaf exceeds 3, it splits on the next unused attribute</li>
              </ul>
            </Block>
          </Rise>
        </div>
      </Split>
    </Stage>
  )
}