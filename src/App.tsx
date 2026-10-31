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
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <DotGrid
          dotSize={3}
          gap={34}
          baseColor="#ded5c0"
          activeColor={accentHex}
          proximity={110}
          strength={0.35}
          glow={0.12}
          fade={0.55}
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
        <span className="numeral text-sm font-medium text-ink-soft" aria-live="polite">
          <span className="sr-only">Slide </span>
          {String(slide).padStart(2, '0')}
          <span aria-hidden="true"> / </span>
          <span className="sr-only">of </span>
          {TOTAL}
        </span>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-20 px-6 pb-5 sm:px-10 lg:px-16">
        <div className="rule h-[3px] w-full rounded-full">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${(slide / TOTAL) * 100}%`, background: accentHex }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-ink-soft">
          <p className="hidden sm:block">← → arrows · # for a link to any slide</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={slide === 1}
              className="rounded-full border border-hairline bg-surface px-4 py-1.5 font-medium text-ink disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={slide === TOTAL}
              className="rounded-full border px-4 py-1.5 font-medium text-white disabled:opacity-40"
              style={{ background: accentHex, borderColor: accentHex }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
