import { Stage, Display, Eyebrow, Block, Rise, Lead, Mark } from '../deck/primitives'
import { leaf, retrieved, W, Q } from '../data/cases'

const n = (v: number, d = 3) => v.toFixed(d)

export default function Similarity() {
  return (
    <Stage accent="blue">
      <Eyebrow>Worked example</Eyebrow>
      <Display className="mt-4 max-w-[24ch]">Which case is retrieved</Display>

      <Rise i={1}>
        <Block className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-base">
            <thead>
              <tr className="text-sm text-ink-soft">
                <th className="pb-3 pr-4 font-medium">candidate</th>
                <th className="pb-3 pr-4 font-medium">d (km)</th>
                <th className="pb-3 pr-4 font-medium">s_coord</th>
                <th className="pb-3 pr-4 font-medium">Δt (min)</th>
                <th className="pb-3 pr-4 font-medium">s_time</th>
                <th className="pb-3 pr-4 font-medium">traffic</th>
                <th className="pb-3 pr-4 font-medium">day</th>
                <th className="pb-3 pr-4 font-medium">weather</th>
                <th className="pb-3 pr-0 font-medium">sim</th>
              </tr>
            </thead>
            <tbody className="numeral">
              {leaf.map((l) => {
                const isBest = l.c.id === retrieved.c.id
                return (
                  <tr
                    key={l.c.id}
                    className="border-t border-hairline"
                    style={isBest ? { background: 'color-mix(in oklab, var(--section-accent) 10%, white)' } : undefined}
                  >
                    <td className="py-2.5 pr-4 font-semibold" style={isBest ? { color: 'var(--section-accent)' } : undefined}>
                      {l.c.id}
                      {isBest && <span className="ml-2 text-xs font-medium">← retrieved</span>}
                    </td>
                    <td className="py-2.5 pr-4">{n(l.d, 3)}</td>
                    <td className="py-2.5 pr-4">{n(l.sCoord)}</td>
                    <td className="py-2.5 pr-4">{Math.abs(Q.minutes - l.c.minutes)}</td>
                    <td className="py-2.5 pr-4">{n(l.sTime)}</td>
                    <td className="py-2.5 pr-4">{n(l.sTraffic, 1)}</td>
                    <td className="py-2.5 pr-4">{n(l.sDay, 1)}</td>
                    <td className="py-2.5 pr-4">{n(l.sWeather, 1)}</td>
                    <td className="py-2.5 pr-0 font-semibold" style={{ color: 'var(--section-accent)' }}>
                      {n(l.sim)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Block>
      </Rise>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Rise i={2}>
          <Block>
            <Mark>retrieved</Mark>
            <p className="mt-3 font-display text-2xl font-medium">
              {retrieved.c.id} · similarity {n(retrieved.sim)}
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              Reused solution: R-0512's route, driven {retrieved.c.actualMin.toFixed(1)} min on a
              comparable morning. Runner-up {leaf[0].c.id === retrieved.c.id ? leaf[1].c.id : leaf[0].c.id} at{' '}
              {n(leaf[0].c.id === retrieved.c.id ? leaf[1].sim : leaf[0].sim)} — close enough that the
              shortlist is worth scoring.
            </p>
            <p className="mono mt-3 text-sm text-ink-soft">
              sim = {W.coord}·s_coord + {W.time}·s_time + {W.traffic}·s_traffic + {W.dayType}·s_day + {W.weather}·s_weather
            </p>
          </Block>
        </Rise>
        <Rise i={3}>
          <Lead>
            Three candidates were scored, not one: similarity over index attributes found the
            branch, similarity over all weights ranks inside it. The k = 3 shortlist exists
            because the branch itself can be wrong — which is exactly the next-but-one section.
          </Lead>
        </Rise>
      </div>
    </Stage>
  )
}
