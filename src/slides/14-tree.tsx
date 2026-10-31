import { Stage, Split, Display, Eyebrow, Block, Rise } from '../deck/primitives'

type Node = { cx: number; cy: number; label: string; on?: boolean; sub?: string }

function NodeBox({ cx, cy, label, on, sub, w = 132, h = 30 }: Node & { w?: number; h?: number }) {
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={7}
        fill={on ? 'color-mix(in oklab, var(--section-accent) 12%, white)' : 'var(--color-surface)'}
        stroke={on ? 'var(--section-accent)' : 'var(--color-hairline)'}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight={on ? 600 : 400}
        fill={on ? 'var(--section-accent)' : 'var(--color-ink-soft)'}
        fontFamily="var(--font-mono)"
      >
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 17} textAnchor="middle" fontSize={11} fill="var(--color-ink-soft)" fontFamily="var(--font-mono)">
          {sub}
        </text>
      )}
    </g>
  )
}

function Edge({ x1, y1, x2, y2, on }: { x1: number; y1: number; x2: number; y2: number; on?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={on ? 'var(--section-accent)' : 'var(--color-hairline)'}
      strokeWidth={on ? 1.8 : 1}
    />
  )
}

function TreeDiagram() {
  const A = { accent: true }
  const root = { cx: 450, cy: 30 }
  const l1 = [160, 450, 740]
  const l2 = [70, 150, 230, 310, 390]
  const l3 = [180, 260, 340, 420, 500]
  const l4 = [180, 260, 340]
  const leafCx = 260
  return (
    <svg viewBox="0 0 900 480" className="w-full" role="img" aria-label="Discrimination tree walked by order N: x-band 1, y-band 4, morning peak, moderate">
      <Edge x1={root.cx} y1={root.cy + 15} x2={l1[0]} y2={100 - 15} on />
      <Edge x1={root.cx} y1={root.cy + 15} x2={l1[1]} y2={85} />
      <Edge x1={root.cx} y1={root.cy + 15} x2={l1[2]} y2={85} />
      <NodeBox cx={root.cx} cy={root.cy} label="case base · index: dest x-band" w={210} {...A} />
      <NodeBox cx={l1[0]} cy={100} label="x = 1" on />
      <NodeBox cx={l1[1]} cy={100} label="x = 2" sub="…" />
      <NodeBox cx={l1[2]} cy={100} label="x = 3" sub="…" />

      {l2.map((cx, i) => (
        <Edge key={`e2-${i}`} x1={l1[0]} y1={115} x2={cx} y2={185} on={i === 3} />
      ))}
      <NodeBox cx={l2[3]} cy={200} label="y = 4" on sub="y-band" />
      {l2.map((cx, i) => (i === 3 ? null : <NodeBox key={`n2-${i}`} cx={cx} cy={200} label={`y = ${i + 1}`} w={74} />))}

      {l3.map((cx, i) => (
        <Edge key={`e3-${i}`} x1={l2[3]} y1={215} x2={cx} y2={285} on={i === 1} />
      ))}
      <NodeBox cx={l3[1]} cy={300} label="morning peak" on sub="06–09:30" />
      {l3.map((cx, i) => (i === 1 ? null : <NodeBox key={`n3-${i}`} cx={cx} cy={300} label={['night', 'midday', 'evening', 'evening-2'][i] ?? '…'} w={92} />))}

      {l4.map((cx, i) => (
        <Edge key={`e4-${i}`} x1={l3[1]} y1={315} x2={cx} y2={385} on={i === 1} />
      ))}
      <NodeBox cx={l4[1]} cy={400} label="moderate" on />
      {l4.map((cx, i) => (i === 1 ? null : <NodeBox key={`n4-${i}`} cx={cx} cy={400} label={['light', 'heavy'][i] ?? '…'} w={92} />))}

      <Edge x1={l4[1]} y1={415} x2={leafCx} y2={440} on />
      <g>
        <rect x={leafCx - 150} y={440} width={300} height={30} rx={7} fill="color-mix(in oklab, var(--section-accent) 12%, white)" stroke="var(--section-accent)" strokeWidth={1.6} />
        <text x={leafCx} y={459} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--section-accent)" fontFamily="var(--font-mono)">
          leaf · R-0142 · R-0450 · R-0512 · cap 3
        </text>
      </g>

      <g fontFamily="var(--font-sans)" fontSize={12} fill="var(--color-ink-soft)">
        <circle cx={30} cy={30} r={5} fill="var(--section-accent)" />
        <text x={42} y={34}>order N's walk: x = 1 → y = 4 → morning peak → moderate</text>
        <circle cx={30} cy={52} r={5} fill="none" stroke="var(--color-hairline)" strokeWidth={1.4} />
        <text x={42} y={56}>unexpanded branches (the walk never reads them)</text>
      </g>
    </svg>
  )
}

export default function Tree() {
  return (
    <Stage accent="purple">
      <Split ratio="60/40">
        <div>
          <Eyebrow>Case memory</Eyebrow>
          <Display className="mt-4 max-w-[22ch]">The discrimination tree</Display>
          <div className="mt-4">
            <TreeDiagram />
          </div>
        </div>
        <div className="space-y-4">
          <Rise i={1}>
            <Block>
              <h3 className="font-display text-lg font-medium">What it is</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">
                A tree whose internal nodes test <span className="prose-strong">one index
                attribute</span> and whose leaves hold cases. Fan-out equals the attribute's
                cardinality; a walk follows one child per level.
              </p>
            </Block>
          </Rise>
          <Rise i={2}>
            <Block>
              <h3 className="font-display text-lg font-medium">How it is built</h3>
              <ul className="mt-2 space-y-2 text-base leading-relaxed text-ink-soft">
                <li>Attribute order = discriminative power: the most selective attribute splits first.</li>
                <li>Leaf cap L = 3 cases. Over-cap leaves split on the next unused attribute — an explanation-based index refinement.</li>
                <li>Insert = walk to a leaf and store; the tree grows where the queries land, not where the data is.</li>
              </ul>
            </Block>
          </Rise>
          <Rise i={3}>
            <p className="text-sm leading-relaxed text-ink-soft">
              Order N's walk touches four tests and lands on a three-case leaf. The next slide
              runs that walk on a machine.
            </p>
          </Rise>
        </div>
      </Split>
    </Stage>
  )
}
