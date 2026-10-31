# Compact Deck plan — Case-Based Reasoning for a Smart Navigation & Delivery System

Audience: academic classroom. Setting: asynchronous / self-reading. Venue: bright room → light "paper" palette. Length: ~8 slides. Output: web deck (Vite + React + TypeScript, hash-routed), GitHub Pages.

## Spine (abridged)

- **Once upon a time:** every route a last-mile fleet needs has already been driven, thousands of times.
- **Every day:** dispatch re-plans each order from scratch and throws the archive away.
- **One day:** a new order asks the archive before it plans — and gets an answer in milliseconds.
- **Because of that:** planning gets cheap, quality inherits driver experience, but the archive must be indexed, revised and pruned.
- **Until finally:** the system answers a new order with one indexed query, adapts it for a closure, and keeps its memory small and fresh by forgetting on purpose.

**Why this story:** memory, not search, is what makes an AI system feel experienced.
**The position:** a delivery system that reuses past routes beats one that re-plans — but only if its case memory is indexed, revised and pruned; naive retention is a liability.
**The stakes:** re-planning every order costs minutes of compute and produces inconsistent quality; keeping everything costs retrieval latency and feeds drivers stale routes.
**The ending, written first:** Plan less, remember better. The case base is the product. Index it, revise it, prune it.

## Three messages

1. The 4-R cycle (Retrieve, Reuse, Revise, Retain) turns finished deliveries into future speed.
2. Index on destination coordinates + time of day → discrimination tree turns O(N) into a guided walk.
3. Maintenance is a feature: utility-weighted forgetting, expiry, regime tags and re-indexing keep the base small, fast and fresh.

## Outline (8 slides)

Section colours on paper `#f7f3ea`: teal `#0f766e`, red `#b3261e`, blue `#1d4ed8`, purple `#6d28d9`, amber `#b45309`, green `#15803d`.

### 1. Opening — teal
**Slide 1 · Title** — statement, full bleed
- Headline: Case-Based Reasoning for a Smart Navigation & Delivery System
- Subtitle: A last-mile fleet that answers each new order by remembering the ones it already ran

### 2. The Problem — red
**Slide 2 · The archive we throw away** — statement + data
- 12,000 orders/day, 40,000+ solved routes in archive, each re-planned 8–40 s from scratch
- Punch: we already own the answer; the problem is retrieval, not planning

### 3. The CBR Cycle — blue
**Slide 3 · The 4-R loop** — framework (2×2 cards)
- Retrieve: weighted k-NN over normalised features (coord 0.40, time 0.25, traffic 0.20, day 0.10, weather 0.05)
- Reuse: copy the route skeleton, leave holes where problems differ
- Revise: test against live traffic/closures, repair, re-score before dispatch
- Retain: store problem + repaired solution + outcome → next query is faster

### 4. Case Memory — purple
**Slide 4 · Table + Tree** — split 60/40
- Left: the flat case table (case_id, dest coords, zone, time bucket, traffic, actual min, outcome)
- Right: discrimination tree — index attributes in order: dest x-band → dest y-band → time-of-day bucket → traffic; leaf cap = 3

### 5. Worked Example — blue
**Slide 5 · Order N at 08:12** — data + mini-table
- N: depot → (1.40, 4.70) km, 08:12, moderate, weekday, target ≤ 25 min
- Walk: Root → x=1 → y=4 → morning peak → moderate → leaf {R-0142, R-0450, R-0512}
- Ranked: R-0512 (sim 0.998) retrieved
- Revise: Elm St closed → substitute Pine St (+1.4 km, +3.2 min) → 24.8 min plan → delivered 24.6 min on time
- Retain: N-1187 filed under same branch → leaf at 4 > cap 3 → splits on distance band ≤ 4.8 km / > 4.8 km

### 6. Retrieval Compared — amber
**Slide 6 · Table vs Tree vs Hybrid** — comparison matrix (3 columns × 4 rows)
| | Flat table | Discrimination tree | Hybrid (recommended) |
|---|---|---|---|
| Query cost | O(N) — 40k sims/order | O(log N) — ~10 nodes | O(log N) + k |
| Result quality | Exact NN always | Approximate: best may sit one branch over | As good as table for shortlist |
| Weights | Any feature, any weight free | Only index attributes reachable | Weights live in re-rank |
| Staleness | Stale = fresh | Stale branch keeps old queries | Regime tags filter first |

### 7. Maintenance — green
**Slide 7 · Prune + Fight Staleness** — 2-column bullets
- **Prune on purpose:** budget (30k cases), utility-weighted forgetting U = success×reuses/(1+TSK), footprint pruning, condensation
- **Fight staleness:** 90-day expiry + exp(−λ·age) decay; events (closures, new bridges) invalidate regions immediately; regime tags pre/post; monitor recall@1, index drift, Revise failure rate

### 8. Close — teal
**Slide 8 · Recap + Resources** — recap + links
- 4-R loop: Retrieve → Reuse → Revise → Retain
- Memory needs an index: coords + time-of-day → guided tree walk
- Worked order: 08:12 walked to x=1/y=4/morning/moderate, retrieved R-0512 (0.998), adapted, retained as N-1187
- Hybrid retrieval: tree shortlist + weighted metric re-rank
- Maintenance = feature: utility forgetting, expiry, regimes, re-indexing
- **Final line:** Plan less, remember better — index it, revise it, prune it.

## Visual system (unchanged)
- Palette: paper `#f7f3ea`, white surfaces, ink `#211f1e`, ink-soft `#57534e`, hairline `#e3dccb`
- Type: Bricolage Grotesque / Inter / JetBrains Mono, fluid `clamp()` scale
- Motion: headline settle + staggered rise only; `prefers-reduced-motion` guard
- Chrome: section label top-left, slide counter top-right, progress bar bottom, arrow keys + hash routes

## QA criteria
- Render every route headlessly: one message per slide, palette consistency, contrast at smallest text, no `h-screen`, reduced-motion respected, keyboard nav works, deep link `#/5` restores position.