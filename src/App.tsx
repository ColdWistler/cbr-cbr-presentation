import { useEffect } from 'react'
import { SLIDES, TOTAL } from './deck/slides'
import { useHashRoute } from './deck/router'
import { Eyebrow } from './deck/primitives'
import DotGrid from './components/reactbits/DotGrid'

const ACCENT_HEX: Record<string, string> = {
  teal: '#0f766e',
  red: '#b3261e',
  purple: '#6d28d9',
  blue: '#1d4ed8',
  amber: '#b45309',
  green: '#15803d',
}

export default function App() {
  const { index, slide, go, next, prev } = useHashRoute(TOTAL)
  const meta = SLIDES[index]
  const accentHex = ACCENT_HEX[meta.accent] ?? ACCENT_HEX.teal

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(target.tagName) && event.key === ' ') return
      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault()
          prev()
          break
        case 'Home':
          event.preventDefault()
          go(1)
          break
        case 'End':
          event.preventDefault()
          go(TOTAL)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go])

  return (
    <div className="relative min-h-dvh">
      {/* ambient dot field: pointer-reactive, palette-tinted per section */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <DotGrid
          dotSize={4}
          gap={28}
          baseColor="#000000"
          activeColor={accentHex}
          proximity={130}
          strength={0.5}
          glow={0.2}
          fade={0.4}
          mouseInteraction
        />
      </div>

      <div className="relative z-10">
        {/* key remounts on slide change so enter animations replay */}
        <meta.Component key={meta.slug} />
      </div>

      {/* deck chrome */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <Eyebrow>{meta.section}</Eyebrow>
        <span className="numeral text-sm font-extrabold bg-black text-white px-3 py-1 border-2 border-black" aria-live="polite">
          <span className="sr-only">Slide </span>
          {String(slide).padStart(2, '0')}
          <span aria-hidden="true"> / </span>
          <span className="sr-only">of </span>
          {TOTAL}
        </span>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-20 px-6 pb-5 sm:px-10 lg:px-16">
        <div className="rule h-[6px] w-full">
          <div
            className="h-full transition-[width] duration-400"
            style={{ width: `${(slide / TOTAL) * 100}%`, background: accentHex }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="hidden sm:block font-bold bg-white px-3 py-1 border-2 border-black">← → arrows · # for a link to any slide</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={slide === 1}
              className="nb-button bg-white px-4 py-2 font-extrabold text-black disabled:opacity-40"
            >
              ← BACK
            </button>
            <button
              type="button"
              onClick={next}
              disabled={slide === TOTAL}
              className="nb-button px-4 py-2 font-extrabold text-black disabled:opacity-40"
              style={{ background: accentHex }}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
