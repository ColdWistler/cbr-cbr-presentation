import { Stage, Split, Display, Eyebrow, Block, Rise, Lead, Mark } from '../deck/primitives'
import FrostGlassCard from '../components/originkit/frost-glass-card'
import { Q, DATA, leaf, tableRows, hhmm, cell } from '../data/cases'

// A small plan of the leaf neighbourhood: 1 km grid cells, the ten sample
// cases, and the new order N. Fed to the Originkit frosted-glass card so the
// picture sharpens under the pointer.
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
  <text x="132" y="386" font-family="monospace" font-size="14" fill="#57534e">1 km cells · depot at origin · dots = past cases (purple = this branch's leaf)</text>
</svg>`

const mapDataUri = `data:image/svg+xml,${encodeURIComponent(MAP_SVG)}`

export default function Order() {
  return (
    <Stage accent="blue">
      <Split ratio="45/55">
        <div>
          <Eyebrow>Worked example</Eyebrow>
          <Display className="mt-4 max-w-[18ch]">A new order N arrives</Display>
          <Rise i={1}>
            <Block className="mt-6">
              <Mark>order N · 08:12</Mark>
              <dl className="mt-4 space-y-2 text-base">
                {[
                  ['Destination', `(${Q.dest.x.toFixed(2)}, ${Q.dest.y.toFixed(2)}) km · cell ${cell(Q.dest)}`],
                  ['Time of day', `${hhmm(Q.minutes)} · morning peak`],
                  ['Traffic', DATA.query.traffic],
                  ['Day / weather', `${DATA.query.dayType} · ${DATA.query.weather}`],
                  ['Target', `≤ ${Q.target} min`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-hairline pb-2 last:border-0">
                    <dt className="text-ink-soft">{k}</dt>
                    <dd className="mono text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          </Rise>
          <Rise i={2}>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              The tree is walked with exactly the index attributes — nothing else is read on the
              way down.
            </p>
          </Rise>
        </div>
        <div>
          <Rise i={2}>
            <FrostGlassCard
              image={{ src: mapDataUri, alt: 'Plan of the leaf neighbourhood with the new order N' }}
              title="Where order N lands"
              description="Purple dots: the three cases in the walked branch. Frosted glass clears under your pointer."
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
            <Lead className="mt-5">
              Step 1 — the walk: <span className="prose-strong">Root → x = 1 → y = 4 → morning peak
              → moderate</span>. Four tests, one leaf, three candidate cases — out of 40,000 rows.
            </Lead>
          </Rise>
        </div>
      </Split>
    </Stage>
  )
}
