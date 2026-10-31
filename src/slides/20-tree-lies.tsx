import { Stage, Split, Display, Eyebrow, Block, Rise, Lead, Dot } from '../deck/primitives'

const FIXES = [
  ['Score siblings, not one branch', 'Walk the top-k children at each level when the leaf is thin, so a near-miss one cell over is still scored.'],
  ['Re-rank with the full metric', 'Use the tree for the shortlist and the weighted similarity for the verdict — the metric sees features the index cannot.'],
  ['Keep the index aligned with the weights', "When a feature's weight changes, ask whether the attribute order still discriminates; reorder or re-learn with explanation-based learning (EBL)."],
  ['Measure the drift', 'Track how often the best case comes from outside the walked branch. When it rises, rebuild — do not tune by feel.'],
]

export default function TreeLies() {
  return (
    <Stage accent="amber">
      <Split ratio="40/60">
        <div>
          <Eyebrow>Retrieval compared</Eyebrow>
          <Display className="mt-4 max-w-[20ch]">Where the tree lies to you</Display>
          <Lead className="mt-6">
            A tree split on zone then time cannot see similarity: it commits to one child per level
            before any distance is measured. With today's weights — distance at{' '}
            <span className="prose-strong">0.40</span> — the zone split usually protects the nearest
            neighbour. Change the weights, or add a constraint the index cannot express (a vehicle
            type, a delivery window), and the walked leaf can hold the wrong best case.
          </Lead>
        </div>
        <div className="space-y-4">
          {FIXES.map(([title, body], i) => (
            <Rise i={i + 1} key={title}>
              <Block className="h-full">
                <h3 className="font-display text-lg font-medium">
                  <Dot className="mr-2" />
                  {title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-ink-soft">{body}</p>
              </Block>
            </Rise>
          ))}
        </div>
      </Split>
    </Stage>
  )
}
