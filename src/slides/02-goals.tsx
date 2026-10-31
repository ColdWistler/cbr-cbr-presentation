import { Stage, Split, Display, Eyebrow, Block, Rise, Lead } from '../deck/primitives'

const TAKEAWAYS = [
  {
    n: '01',
    title: 'The 4-R cycle',
    body: 'Retrieve, Reuse, Revise, Retain — the loop that turns finished deliveries into future speed, and the knowledge containers that hold it.',
  },
  {
    n: '02',
    title: 'Case memory as table and tree',
    body: 'One flat table of past routes, plus a discrimination tree indexed on destination coordinates and time of day so a query never scans everything.',
  },
  {
    n: '03',
    title: 'One worked example, end to end',
    body: 'An order at 08:12 walks the tree to a branch, retrieves case R-0512 at similarity 0.998, is adapted around a closure, and is retained as N-1187.',
  },
  {
    n: '04',
    title: 'Retrieval compared, memory maintained',
    body: 'Tabular vs tree-based retrieval, where the tree misleads, and how forgetting, pruning and expiry keep the case base small and fresh.',
  },
]

export default function Goals() {
  return (
    <Stage accent="teal">
      <Split ratio="40/60">
        <div>
          <Eyebrow>Opening</Eyebrow>
          <Display className="mt-4">Goals for today</Display>
          <Lead className="mt-6">
            Four things to take away, in the order the deck earns them. Everything else on a
            slide is there to serve one of these four.
          </Lead>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {TAKEAWAYS.map((t, i) => (
            <Rise i={i + 1} key={t.n}>
              <Block className="h-full">
                <p className="numeral text-sm font-semibold" style={{ color: 'var(--section-accent)' }}>
                  {t.n}
                </p>
                <h3 className="mt-2 font-display text-xl font-medium">{t.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">{t.body}</p>
              </Block>
            </Rise>
          ))}
        </div>
      </Split>
    </Stage>
  )
}
