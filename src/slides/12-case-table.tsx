import { Stage, Display, Eyebrow, Rise, Lead, Block } from '../deck/primitives'
import { tableRows, hhmm } from '../data/cases'

export default function CaseTable() {
  return (
    <Stage accent="purple">
      <Eyebrow>Case memory</Eyebrow>
      <Display className="mt-4 max-w-[26ch]">The case table — the memory itself</Display>

      <Rise i={1}>
        <Block className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-base">
            <thead>
              <tr className="text-sm text-ink-soft">
                <th className="pb-3 pr-4 font-medium">case</th>
                <th className="pb-3 pr-4 font-medium">dest (x, y)</th>
                <th className="pb-3 pr-4 font-medium">zone</th>
                <th className="pb-3 pr-4 font-medium">km</th>
                <th className="pb-3 pr-4 font-medium">time</th>
                <th className="pb-3 pr-4 font-medium">bucket</th>
                <th className="pb-3 pr-4 font-medium">traffic</th>
                <th className="pb-3 pr-4 font-medium">actual</th>
                <th className="pb-3 pr-4 font-medium">outcome</th>
                <th className="pb-3 pr-4 font-medium">uses</th>
                <th className="pb-3 pr-0 font-medium">last used</th>
              </tr>
            </thead>
            <tbody className="numeral">
              {tableRows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-hairline"
                  style={
                    r.inLeaf
                      ? { background: 'color-mix(in oklab, var(--section-accent) 8%, transparent)' }
                      : undefined
                  }
                >
                  <td className="py-2 pr-4 font-semibold" style={r.inLeaf ? { color: 'var(--section-accent)' } : undefined}>
                    {r.id}
                  </td>
                  <td className="py-2 pr-4">
                    {r.dest.x.toFixed(2)}, {r.dest.y.toFixed(2)}
                  </td>
                  <td className="py-2 pr-4">{r.zone}</td>
                  <td className="py-2 pr-4">{r.dist.toFixed(2)}</td>
                  <td className="py-2 pr-4">{hhmm(r.minutes)}</td>
                  <td className="py-2 pr-4">{r.bucket}</td>
                  <td className="py-2 pr-4">{r.traffic}</td>
                  <td className="py-2 pr-4">{r.actualMin.toFixed(1)} min</td>
                  <td className="py-2 pr-4">{r.outcome}</td>
                  <td className="py-2 pr-4">{r.uses}</td>
                  <td className="py-2 pr-0">{r.lastUsedDays} d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>
      </Rise>

      <Rise i={2} className="mt-6">
        <Lead>
          Ten of the fleet's 40,000 rows. The three highlighted rows are the ones order N will
          reach. <span className="prose-strong">This table is the case base</span> — everything
          else, including the tree on slide 14, is only an index over it.
        </Lead>
      </Rise>
    </Stage>
  )
}
