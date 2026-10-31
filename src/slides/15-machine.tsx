import { Stage, Display, Eyebrow, Rise, Lead } from '../deck/primitives'

export default function Machine() {
  return (
    <Stage accent="purple">
      <Eyebrow>Case memory</Eyebrow>
      <Display className="mt-4 max-w-[26ch]">The memory as a machine</Display>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <Rise i={1}>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
            {/* Anatomy figure: the discrimination tree as a ticket-sorting cabinet */}
            <iframe
              src="figure/memory-sorter-light.html"
              title="Anatomy figure: the case memory as a ticket-sorting cabinet"
              className="block h-[64vh] min-h-[420px] w-full border-0"
              loading="lazy"
            />
          </div>
        </Rise>
        <div className="space-y-4">
          <Rise i={2}>
            <Lead>
              The same walk, built as a physical thing. A selector is set for each index attribute
              in turn; the matching gate opens; the order ticket drops into the branch drawer;
              the best card rises.
            </Lead>
          </Rise>
          <Rise i={3}>
            <ul className="space-y-2 text-base text-ink-soft">
              <li><span className="prose-strong">Insert order N</span> — ticket enters, four gates read x-band, y-band, bucket and traffic.</li>
              <li><span className="prose-strong">Retrieved</span> — case R-0512 lifts out of the drawer at similarity 0.998.</li>
              <li><span className="prose-strong">Retain N-1187</span> — a fourth card files into the over-cap drawer, which splits on distance band.</li>
              <li><span className="prose-strong">Keys</span> — Enter inserts, R retains, 0 resets. Or use the buttons inside the figure.</li>
            </ul>
          </Rise>
          <Rise i={4}>
            <p className="text-sm leading-relaxed text-ink-soft">
              Figure built with the Anatomy skill: an isometric machine whose working <em>is</em> the
              concept — every number on its readout comes from the same case model as this deck.
            </p>
          </Rise>
        </div>
      </div>
    </Stage>
  )
}
