import { Stage, Split, Display, Eyebrow, Block, Rise, Lead, Dot } from '../deck/primitives'

const LIMITS = [
  {
    title: 'Cold start',
    body: 'A region the fleet has never served has nothing to retrieve. Seed the optimiser, then start remembering — the case base is built from its own first deliveries.',
  },
  {
    title: 'Hard per-order constraints',
    body: 'A vehicle restriction or a delivery window can make a remembered route unusable. Reuse proposes; the optimiser finishes. The retrieved case is a seed, not the answer.',
  },
  {
    title: 'When no case is close',
    body: 'k-NN with nothing nearby returns noise dressed as an answer. Fall back to full planning, and retain that case first — it becomes the region’s first exemplar.',
  },
  {
    title: 'Audit-critical decisions',
    body: '“We reused this route because it matched” is thin. Keep provenance and the Revise record so every decision is reconstructable months later.',
  },
]

export default function Limits() {
  return (
    <Stage accent="amber">
      <Split ratio="40/60">
        <div>
          <Eyebrow>Maintenance</Eyebrow>
          <Display className="mt-4 max-w-[18ch]">When CBR is the wrong tool</Display>
          <Lead className="mt-6">
            The deck’s argument holds where experience transfers. It fails where it does not —
            and a design that says so out loud is easier to trust than one that hides it.
          </Lead>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {LIMITS.map((l, i) => (
            <Rise i={i + 1} key={l.title}>
              <Block className="h-full">
                <h3 className="font-display text-lg font-medium">
                  <Dot className="mr-2" />
                  {l.title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-ink-soft">{l.body}</p>
              </Block>
            </Rise>
          ))}
        </div>
      </Split>
    </Stage>
  )
}
