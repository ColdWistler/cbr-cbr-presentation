import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type Accent = 'teal' | 'red' | 'purple' | 'blue' | 'amber' | 'green'

const ACCENT_VAR: Record<Accent, string> = {
  teal: 'var(--color-teal)',
  red: 'var(--color-red)',
  purple: 'var(--color-purple)',
  blue: 'var(--color-blue)',
  amber: 'var(--color-amber)',
  green: 'var(--color-green)',
}

/** Full-bleed slide surface: owns the palette accent for this section. */
export function Stage({
  accent = 'teal',
  children,
  className,
  id,
}: {
  accent?: Accent
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn('relative mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col px-6 py-16 sm:px-10 lg:px-16', className)}
      style={{ '--section-accent': ACCENT_VAR[accent] } as CSSProperties}
    >
      {children}
    </section>
  )
}

/** The headline. One per slide; weight and tracking settle on entry. */
export function Display({
  children,
  size = '4xl',
  className,
  as: Tag = 'h2',
}: {
  children: ReactNode
  size?: '2xl' | '4xl' | '6xl' | 'display'
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
}) {
  const sizeClass = { '2xl': 'text-2xl', '4xl': 'text-4xl', '6xl': 'text-6xl', display: 'text-display' }[size]
  return <Tag className={cn('display', sizeClass, className)}>{children}</Tag>
}

/** Top-left section label: all caps, tracked wide, the current accent. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('eyebrow', className)}>{children}</p>
}

/** Asymmetric split at a fixed ratio (never 63/37 twice in one deck). */
export function Split({
  ratio = '60/40',
  children,
  className,
}: {
  ratio?: '60/40' | '55/45' | '70/30' | '40/60' | '45/55' | '30/70'
  children: [ReactNode, ReactNode]
  className?: string
}) {
  const [left, right] = children
  const grid = {
    '60/40': 'lg:grid-cols-[1.5fr_1fr]',
    '55/45': 'lg:grid-cols-[1.22fr_1fr]',
    '70/30': 'lg:grid-cols-[2.33fr_1fr]',
    '40/60': 'lg:grid-cols-[1fr_1.5fr]',
    '45/55': 'lg:grid-cols-[1fr_1.22fr]',
    '30/70': 'lg:grid-cols-[1fr_2.33fr]',
  }[ratio]
  return (
    <div className={cn('grid gap-10 lg:gap-14', grid, className)}>
      <div className="min-w-0">{left}</div>
      <div className="min-w-0">{right}</div>
    </div>
  )
}

/** Bordered region: the slide's card, in the palette's hairline. */
export function Block({
  children,
  className,
  tone = 'surface',
}: {
  children: ReactNode
  className?: string
  tone?: 'surface' | 'plain'
}) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 sm:p-6',
        tone === 'surface' ? 'card-surface' : 'border border-hairline',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Pill label for a category or a product name. */
export function Mark({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
        className,
      )}
      style={{ borderColor: 'var(--section-accent)', color: 'var(--section-accent)' }}
    >
      {children}
    </span>
  )
}

/** Oversized zero-padded number as marginalia. */
export function Numeral({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn('numeral pointer-events-none absolute select-none text-[26vw] leading-none font-light opacity-[0.07] lg:text-[13vw]', className)}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}

/** Staggered rise: index is data (--i), not markup. */
export function Rise({
  children,
  i = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  i?: number
  className?: string
  as?: 'div' | 'li' | 'p' | 'span'
}) {
  return (
    <Tag className={cn('rise', className)} style={{ '--i': i } as CSSProperties}>
      {children}
    </Tag>
  )
}

/** Bold lead-in plus explanation: the body's workhorse. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('max-w-[68ch] text-lg leading-relaxed text-ink-soft', className)}>{children}</p>
}

export function Dot({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-block size-1.5 rounded-full align-middle', className)}
      style={{ background: 'var(--section-accent)' }}
      aria-hidden="true"
    />
  )
}
