import { Stage, Split, Display, Eyebrow, Block, Rise } from '../deck/primitives'

const REFS = [
  ['Foundations', [
    ['Aamodt & Plaza (1994)', '“Case-Based Reasoning: Foundational Issues, Variations, and Approaches” — the four Rs this deck is built on.'],
    ['Kolodner (1993)', 'Case-Based Reasoning, Morgan Kaufmann — case memory, indexing, and the classic delivery-style examples.'],
    ['Richter & Weber', 'The knowledge containers: case base, vocabulary, similarity measure, adaptation knowledge.'],
  ]],
  ['Retention & maintenance', [
    ['Smyth & Keane (1995)', '“Remembering to forget” — footprint-based competence models for deciding what to delete.'],
    ['Leake & Wilson (1998)', 'CBR maintenance: combining efficiency and accuracy — retention policy as a wrapper around the reasoner.'],
    ['Lenz & Burkhard', 'Case retrieval nets — the graph alternative to the discrimination tree.'],
  ]],
  ['This deck', [
    ['figure/', 'The Anatomy figure’s Node build script; shared/cases.json is the single source of truth for every number shown.'],
    ['scripts/fetch-originkit.mjs', 'Pulls the Originkit components used here from their site’s payload.'],
    ['.github/workflows/deploy.yml', 'Builds the deck and publishes it to GitHub Pages on every push to main.'],
  ]],
]

export default function Resources() {
  return (
    <Stage accent="teal">
      <Split ratio="55/45">
        <div>
          <Eyebrow>Close</Eyebrow>
          <Display className="mt-4 max-w-[14ch]">Resources</Display>
          <Rise i={4}>
            <Block className="mt-8">
              <h3 className="font-display text-lg font-medium">Built with</h3>
              <ul className="mt-2 space-y-1.5 text-base text-ink-soft">
                <li>React Bits — SplitText, DotGrid, SoftAurora, SpotlightCard, Counter</li>
                <li>Originkit — dash-cursor, weight-hover, frost-glass-card (source fetched by script)</li>
                <li>Anatomy — the case-memory sorter figure (MIT)</li>
                <li>Vite · React · TypeScript · Tailwind v4</li>
              </ul>
            </Block>
          </Rise>
        </div>
        <div className="space-y-4">
          {REFS.map(([group, items], gi) => (
            <Rise i={gi + 1} key={group as string}>
              <Block>
                <h3 className="font-display text-lg font-medium">{group as string}</h3>
                <ul className="mt-2 space-y-2">
                  {(items as [string, string][]).map(([name, note]) => (
                    <li key={name} className="text-base leading-relaxed text-ink-soft">
                      <span className="prose-strong">{name}</span> — {note}
                    </li>
                  ))}
                </ul>
              </Block>
            </Rise>
          ))}
        </div>
      </Split>
    </Stage>
  )
}
