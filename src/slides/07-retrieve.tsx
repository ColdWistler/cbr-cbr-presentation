import { Stage, Split, Display, Eyebrow, Block, Rise, Lead } from '../deck/primitives'
import { W, SIGMA } from '../data/cases'

const WEIGHTS: [string, string, string][] = [
  ['Destination distance', W.coord.toFixed(2), `exp(−d²/2σ²), σ = ${SIGMA.coordKm} km`],
  ['Time of day', W.time.toFixed(2), `exp(−Δt²/2σ²), σ = ${SIGMA.timeMin} min`],
  ['Traffic level', W.traffic.toFixed(2), '1 same · 0.6 adjacent · 0.2 opposite'],
  ['Day type', W.dayType.toFixed(2), '1 same · 0.3 weekday vs weekend'],
  ['Weather', W.weather.toFixed(2), '1 same · 0.4 different'],
]

export default function Retrieve() {
  return (
    <Stage accent="blue">
      <Split ratio="55/45">
        <div>
          <Eyebrow>The CBR cycle · R1</Eyebrow>
          <Display className="mt-4">Retrieve = weighted nearest neighbours</Display>
          <Lead className="mt-6">
            The new order is the <span className="prose-strong">target problem</span>; every stored
            route is a past problem with a solved answer. Similarity is one weighted sum over
            normalised features, so a feature's weight says how much the fleet trusts it.
          </Lead>
          <Rise i={2}>
            <Block className="mt-6">
              <p className="mono">sim(N, C) = Σ wᵢ · sᵢ(N, C)</p>
              <p className="mt-2 text-sm text-ink-soft">
                k-NN with k = 3 returns a shortlist, not a verdict — the index shortlists, the
                metric ranks, and Revise confirms.
              </p>
            </Block>
          </Rise>
        </div>
        <div>
          <Rise i={1}>
            <Block>
              <h3 className="font-display text-xl font-medium">The weights, and why</h3>
              <table className="mt-4 w-full text-base">
                <thead>
                  <tr className="text-left text-sm text-ink-soft">
                    <th className="pb-2 font-medium">Feature</th>
                    <th className="pb-2 font-medium">w</th>
                    <th className="pb-2 font-medium">sᵢ</th>
                  </tr>
                </thead>
                <tbody>
                  {WEIGHTS.map(([f, w, s]) => (
                    <tr key={f} className="border-t border-hairline">
                      <td className="py-2 pr-3">{f}</td>
                      <td className="numeral py-2 pr-3 font-semibold" style={{ color: 'var(--section-accent)' }}>
                        {w}
                      </td>
                      <td className="mono py-2 text-sm text-ink-soft">{s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Block>
          </Rise>
          <Rise i={2}>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Distance dominates because two orders 1.5 km apart share most of a route; two orders
              in the same kilometre an hour apart share its traffic. Weather barely matters, so it
              gets a token weight — the metric, not the index, is where this is decided.
            </p>
          </Rise>
        </div>
      </Split>
    </Stage>
  )
}
