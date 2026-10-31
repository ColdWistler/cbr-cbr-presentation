import { Stage, Split, Display, Eyebrow, Block, Rise, Lead } from '../deck/primitives'

const FIELDS = [
  ['Problem', 'dest (1.40, 4.70) · 08:12 · moderate · weekday · clear'],
  ['Solution', 'adapted route via Pine St (from R-0512, around the Elm St closure)'],
  ['Outcome', 'delivered 24.6 min · on time'],
  ['Provenance', 'adapted_from R-0512 · regime post-closure-2026-10-14'],
]

export default function Retain() {
  return (
    <Stage accent="blue">
      <Split ratio="40/60">
        <div>
          <Eyebrow>The CBR cycle · R4</Eyebrow>
          <Display className="mt-4">Retain turns one delivery into future speed</Display>
          <Lead className="mt-6">
            A finished case is stored as problem + solution + outcome. Retain is not a single
            decision but three: <span className="prose-strong">what</span> to keep,{' '}
            <span className="prose-strong">where</span> to file it, and{' '}
            <span className="prose-strong">when to stop</span>.
          </Lead>
        </div>
        <div className="space-y-4">
          {FIELDS.map(([k, v], i) => (
            <Rise i={i + 1} key={k}>
              <Block className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                <p className="w-32 shrink-0 text-sm font-semibold" style={{ color: 'var(--section-accent)' }}>
                  {k}
                </p>
                <p className="mono text-base">{v}</p>
              </Block>
            </Rise>
          ))}
          <Rise i={5}>
            <p className="text-sm leading-relaxed text-ink-soft">
              Where to file it = which branch of the case memory it hangs on (slides 14–18). When
              to stop keeping things = the maintenance section (slides 21–22): the case base that
              only ever grows gets slow, then wrong.
            </p>
          </Rise>
        </div>
      </Split>
    </Stage>
  )
}
