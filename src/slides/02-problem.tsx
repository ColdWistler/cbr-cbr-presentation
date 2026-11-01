import { Stage, Display, Eyebrow, Rise, Lead } from '../deck/primitives'
import ProblemFlow from '../components/visuals/ProblemFlow'

export default function Problem() {
  return (
    <Stage accent="red">
      <Eyebrow>The problem</Eyebrow>
      <Display className="mt-4 max-w-[20ch]">Every route we need has already been driven</Display>

      <Rise i={1} className="mt-10">
        <ProblemFlow />
      </Rise>

      <Rise i={2} className="mt-10">
        <Lead>
          The archive is a liability only because nothing in it can be found in time. We already
          own the answer; <span className="prose-strong">the problem is retrieval, not planning</span>.
        </Lead>
      </Rise>
    </Stage>
  )
}