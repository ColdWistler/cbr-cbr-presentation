import { Stage, Display, Eyebrow, Rise, Lead, Block } from '../deck/primitives'

// A route skeleton: copied streets solid, the hole where the problems differ.
function Skeleton() {
  return (
    <svg viewBox="0 0 420 150" className="w-full" role="img" aria-label="A reused route skeleton with one missing segment">
      <path d="M20 118 H150" stroke="#211f1e" strokeWidth="3" fill="none" />
      <path d="M150 118 V40 H262" stroke="#211f1e" strokeWidth="3" fill="none" />
      <path d="M262 40 V118 H390" stroke="#211f1e" strokeWidth="3" fill="none" strokeDasharray="7 7" />
      <circle cx="20" cy="118" r="6" fill="#0f766e" />
      <text x="20" y="142" className="numeral" fontSize="13" fill="#57534e">depot</text>
      <circle cx="390" cy="118" r="6" fill="#211f1e" />
      <text x="368" y="142" className="numeral" fontSize="13" fill="#57534e">dest</text>
      <rect x="255" y="33" width="14" height="14" fill="none" stroke="#b3261e" strokeWidth="2" />
      <text x="232" y="24" className="numeral" fontSize="13" fill="#b3261e">hole</text>
      <text x="150" y="76" className="numeral" fontSize="13" fill="#57534e">copied</text>
    </svg>
  )
}

export default function Reuse() {
  return (
    <Stage accent="blue">
      <Eyebrow>The CBR cycle · R2</Eyebrow>
      <Display className="mt-4 max-w-[22ch]">Reuse copies the parts that transfer</Display>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <Rise i={1}>
          <Lead>
            The retrieved case contributes a <span className="prose-strong">solution skeleton</span>:
            an ordered list of streets with timing per segment. Reuse copies what the new order
            shares, and marks what it does not.
          </Lead>
          <ul className="mt-6 space-y-3 text-base text-ink-soft">
            <li>
              <span className="prose-strong">Copied:</span> the general corridor and its turn
              sequence — the parts decided by where the two destinations are.
            </li>
            <li>
              <span className="prose-strong">Left open:</span> stop order for multi-drop runs, and
              anything the similarity metric scored below its weight — those get rebuilt, not copied.
            </li>
          </ul>
        </Rise>
        <Rise i={2}>
          <Block>
            <Skeleton />
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              The dashed leg is the hole Revise fills. Rule of thumb: the lower a feature's
              similarity, the more of the solution over it is rebuilt rather than reused — which
              is why the weights on the previous slide are also the reuse policy.
            </p>
          </Block>
        </Rise>
      </div>
    </Stage>
  )
}
