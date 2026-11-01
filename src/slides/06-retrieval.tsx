import { Stage, Display, Eyebrow, Rise, Lead } from '../deck/primitives'
import RetrievalRadar from '../components/visuals/RetrievalRadar'

export default function Retrieval() {
  return (
    <Stage accent="amber">
      <Eyebrow>Retrieval compared</Eyebrow>
      <Display className="mt-4 max-w-[22ch]">Table vs Tree vs Hybrid</Display>

      <Rise i={1}>
        <RetrievalRadar />
      </Rise>

      <Rise i={2} className="mt-6">
        <Lead>
          The tree is <span className="prose-strong">fast but approximate</span>; the table is exact but slow.
          Production uses the hybrid: the tree proposes a shortlist, the weighted metric decides —
          the same division of labour the CBR cycle uses everywhere else.
        </Lead>
      </Rise>
    </Stage>
  )
}