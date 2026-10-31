import { Stage, Display, Eyebrow, Block, Rise, Lead, Mark, Dot } from '../deck/primitives'

const TOOLS = [
  {
    title: 'Age: expiry and decay',
    body: 'Retire cases older than a window (90 days here) and multiply similarity by exp(−λ·age): an old-but-good case still competes, but loses ties to fresh evidence.',
  },
  {
    title: 'Events beat clocks',
    body: 'A topology change — a new bridge, a permanent closure — invalidates a region immediately. Purge or re-tag the affected cases instead of waiting for expiry.',
  },
  {
    title: 'Regimes and provenance',
    body: 'Tag cases pre/post each event; retrieval prefers the current regime. Provenance makes “why did we route this way?” answerable — a compliance question as much as a debugging one.',
  },
  {
    title: 'Watch the drift',
    body: 'Track recall@1 offline, index drift (best cases found outside the walked branch), and the Revise failure rate — that last one is the staleness alarm, because stale cases are the ones Revise keeps repairing.',
  },
]

export default function Stale() {
  return (
    <Stage accent="green">
      <Eyebrow>Maintenance</Eyebrow>
      <Display className="mt-4 max-w-[24ch]">Fight staleness, not size</Display>

      <Rise i={1} className="mt-6">
        <Lead>
          A case base that never grows gets slow; one that never forgets gets{' '}
          <span className="prose-strong">wrong</span> — every stored route describes the city on
          the day it was driven. Staleness is the harder problem, and it is measured, not guessed.
        </Lead>
      </Rise>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {TOOLS.map((t, i) => (
          <Rise i={i + 2} key={t.title}>
            <Block className="h-full">
              <Mark>{`S${i + 1}`}</Mark>
              <h3 className="mt-2 font-display text-xl font-medium">
                <Dot className="mr-2" />
                {t.title}
              </h3>
              <p className="mt-1.5 text-base leading-relaxed text-ink-soft">{t.body}</p>
            </Block>
          </Rise>
        ))}
      </div>
    </Stage>
  )
}
