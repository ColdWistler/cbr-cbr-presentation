import { Stage, Split, Display, Eyebrow, Rise, Block, Dot } from '../deck/primitives'
import FrostGlassCard from '../components/originkit/frost-glass-card'
import MemoryDiagram from '../components/visuals/MemoryDiagram'
import { tableRows, hhmm, leaf, Q } from '../data/cases'

const MAP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#f7f3ea"/>
  ${[0, 1, 2, 3].map((i) => `<line x1="${128 + i * 160}" y1="0" x2="${128 + i * 160}" y2="400" stroke="#e2d9c6" stroke-width="1"/>`).join('')}
  ${[0, 1, 2, 3, 4].map((i) => `<line x1="0" y1="${10 + i * 80}" x2="640" y2="${10 + i * 80}" stroke="#e2d9c6" stroke-width="1"/>`).join('')}
  <line x1="128" y1="170" x2="608" y2="170" stroke="#6d28d9" stroke-width="1.4" stroke-dasharray="6 6"/>
  <text x="132" y="164" font-family="monospace" font-size="15" fill="#6d28d9">walked branch · morning peak · moderate</text>
  ${tableRows
    .filter((r) => r.dest.y > 2.5)
    .map((r) => {
      const sx = 128 + (r.dest.x - 0.5) * 160
      const sy = 410 - (r.dest.y - 2.5) * 80
      const on = leaf.some((l) => l.c.id === r.id)
      return `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${on ? 9 : 6}" fill="${on ? '#6d28d9' : '#c9c0aa'}"${on ? ' stroke="#6d28d9" stroke-opacity="0.35" stroke-width="6"' : ''}/>`
    })
    .join('')}
  ${(() => {
    const sx = 128 + (Q.dest.x - 0.5) * 160
    const sy = 410 - (Q.dest.y - 2.5) * 80
    return `<rect x="${(sx - 10).toFixed(1)}" y="${(sy - 10).toFixed(1)}" width="20" height="20" fill="none" stroke="#211f1e" stroke-width="2.4"/>
    <text x="${(sx + 16).toFixed(1)}" y="${(sy - 14).toFixed(1)}" font-family="monospace" font-size="17" font-weight="700" fill="#211f1e">N</text>`
  })()}
  <text x="132" y="386" font-family="monospace" font-size="14" fill="#57534e">1 km grid · depot at origin · dots = past cases (purple = this branch's leaf)</text>
</svg>`

const mapDataUri = `data:image/svg+xml,${encodeURIComponent(MAP_SVG)}`

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
            <MemoryDiagram />
          </Rise>
          <Rise i={2}>
            <FrostGlassCard
              image={{ src: mapDataUri, alt: 'Map of the leaf neighbourhood with the new order N' }}
              title="Where order N lands"
              description="Purple dots = the three cases in the walked branch. Frosted glass clears under your pointer."
              cardWidth={620}
              cardHeight={390}
              textColor="#211f1e"
              subColor="#57534e"
              blur={26}
              rounded={16}
              tint="rgba(247,243,234,0.32)"
            />
          </Rise>
          <Rise i={3}>
            <Block className="mt-4">
              <h3 className="font-display text-lg font-medium">The discrimination tree</h3>
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