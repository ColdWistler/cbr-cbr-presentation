import { Stage, Display, Eyebrow, Rise, Lead, Block, Mark } from '../deck/primitives'
import { DATA, Q } from '../data/cases'

export default function Revise() {
  const s = DATA.storm
  return (
    <Stage accent="blue">
      <Eyebrow>The CBR cycle · R3</Eyebrow>
      <Display className="mt-4 max-w-[20ch]">Revise tests the answer in the world</Display>

      <Lead className="mt-6">
        Reuse proposes; the world disposes. The reused route is replayed against live traffic and
        closure feeds, mismatches are repaired, and the repaired route is scored again{' '}
        <span className="prose-strong">before</span> it is dispatched.
      </Lead>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Rise i={1}>
          <Block className="h-full">
            <Mark>Detect</Mark>
            <h3 className="mt-3 font-display text-lg font-medium">{s.event}</h3>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              Closure window {s.window}. N's plan reaches Elm St at ~08:30 — inside the window.
              The reuse is wrong, and it is wrong in a way only the world knows.
            </p>
          </Block>
        </Rise>
        <Rise i={2}>
          <Block className="h-full">
            <Mark>Repair</Mark>
            <h3 className="mt-3 font-display text-lg font-medium">Substitute {s.fix}</h3>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              +{s.extraKm} km, +{s.extraMin} min. The repair itself is reusable knowledge — “swap a
              closed Elm St for Pine St” adapts a whole family of routes, not just this one.
            </p>
          </Block>
        </Rise>
        <Rise i={3}>
          <Block className="h-full">
            <Mark>Re-test</Mark>
            <h3 className="mt-3 font-display text-lg font-medium">Verify with live traffic</h3>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              The repaired plan re-scores at {s.plan} min against a {Q.target} min target. Revise
              ends with a confirmed answer — or a rejection that sends the order back to full
              planning.
            </p>
          </Block>
        </Rise>
      </div>

      <Rise i={4} className="mt-8">
        <p className="text-base leading-relaxed text-ink-soft">
          Revise is also the deck's honesty check: a CBR system that never fails to reuse has
          stopped testing its answers.
        </p>
      </Rise>
    </Stage>
  )
}
