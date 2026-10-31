import { Stage, Mark, Rise } from '../deck/primitives'
import SplitText from '../components/reactbits/SplitText'
import SoftAurora from '../components/reactbits/SoftAurora'
import DashCursor from '../components/originkit/dash-cursor'
import WeightHover from '../components/originkit/weight-hover'

export default function Title() {
  return (
    <Stage accent="teal" className="justify-center overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <SoftAurora lightMode speed={0.35} brightness={0.5} color1="#0f766e" color2="#d9a441" scale={1.4} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DashCursor headColor="#211f1e" trailColor="#0f766e" trail={14} blockSize={22} label={false} />
      </div>

      <Rise i={0}>
        <Mark>Web deck · async · GitHub Pages</Mark>
      </Rise>

      <SplitText
        tag="h1"
        text="Case-Based Reasoning for a Smart Navigation & Delivery System"
        splitType="words"
        effect="rise"
        trigger="load"
        mask
        className="mt-8 max-w-[18ch] text-6xl sm:max-w-[22ch]"
        duration={0.9}
        delay={0.15}
      />

      <Rise i={2}>
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-ink-soft">
          A last-mile fleet that answers a new order by remembering the ones it already ran —
          the four Rs, a case memory built for retrieval, one worked example end to end, and
          how the memory is kept small and fresh.
        </p>
      </Rise>

      <Rise i={3} className="mt-10 inline-flex flex-col items-start gap-2">
        <WeightHover label="Plan less, remember better." fontSize={44} color="#211f1e" fromWeight={300} toWeight={700} staggerDuration={26} />
        <span className="text-sm text-ink-soft">hover the line — the weight follows the pointer</span>
      </Rise>

      <Rise i={5} className="mt-10">
        <p className="text-sm text-ink-soft">
          Built with React Bits · Originkit · Anatomy · Tailwind. Arrow keys or the buttons
          below move through the deck;{' '}
          <span className="mono">#/5</span> links straight to the worked example.
        </p>
      </Rise>
    </Stage>
  )
}