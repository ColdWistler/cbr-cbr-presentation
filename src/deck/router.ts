import { useCallback, useEffect, useState } from 'react'

// Hash-routed so the build works on GitHub Pages from any repo name:
// #/1 … #/25 are deep-linkable and the browser back button behaves.
export function parseHash(hash: string): number | null {
  const m = /^#\/(\d+)$/.exec(hash)
  if (!m) return null
  const n = Number.parseInt(m[1], 10)
  return Number.isFinite(n) ? n : null
}

export function useHashRoute(total: number) {
  const [index, setIndex] = useState(() => {
    const fromHash = parseHash(window.location.hash)
    return fromHash && fromHash >= 1 && fromHash <= total ? fromHash - 1 : 0
  })

  useEffect(() => {
    const onHash = () => {
      const n = parseHash(window.location.hash)
      if (n && n >= 1 && n <= total) setIndex(n - 1)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [total])

  const go = useCallback(
    (slide: number) => {
      const clamped = Math.min(Math.max(slide, 1), total)
      window.location.hash = `#/${clamped}`
      setIndex(clamped - 1)
    },
    [total],
  )

  const next = useCallback(() => go(index + 2), [go, index])
  const prev = useCallback(() => go(index), [go, index])

  return { index, slide: index + 1, total, go, next, prev }
}
