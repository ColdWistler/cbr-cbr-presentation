import { Stage, Display, Eyebrow, Rise, Lead, Block, Dot } from '../deck/primitives'

export default function Tension() {
  return (
    <Stage accent="red" className="justify-center">
      <Eyebrow>The problem</Eyebrow>
      <Display as="h2" size="6xl" className="mt-6 max-w-[16ch]">
        What if the archive were the planner?
      </Display>

      <Rise i={2} className="mt-10">
        <Lead>
          Reusing a finished route is not laziness — it is a query. The cost moves from
          “plan from scratch” to “find, adapt, verify”, and the answer inherits the judgement of
          every driver who drew a route like it before.
        </Lead>
      </Rise>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Rise i={3}>
          <Block className="h-full">
            <h3 className="font-display text-xl font-medium">Two questions follow</h3>
            <ul className="mt-3 space-y-2 text-base text-ink-soft">
              <li>
                <Dot className="mr-2" />
                How do we find the right past route — fast, among tens of thousands?
              </li>
              <li>
                <Dot className="mr-2" />
                What do we do when the city has changed since it was driven?
              </li>
            </ul>
          </Block>
        </Rise>
        <Rise i={4}>
          <Block className="h-full">
            <h3 className="font-display text-xl font-medium">Said out loud, up front</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              Reuse breaks under cold start, under mid-route surprises, and if memory goes stale.
              Those are exactly the last three sections of this deck — the honest caveats are
              part of the argument, not a footnote.
            </p>
          </Block>
        </Rise>
      </div>
    </Stage>
  )
}
