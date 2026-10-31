# Deck plan — Case-Based Reasoning for a Smart Navigation & Delivery System

Audience: academic classroom. Setting: asynchronous / self-reading (slides must stand alone, copy is denser than a spoken deck, notes are minimal). Venue: bright room → light "paper" palette. Output: web deck (Vite + React + TypeScript, hash-routed slides), static build deployed to GitHub Pages via Actions.

## Spine

- **Once upon a time:** every route a last-mile fleet will ever need has already been driven, thousands of times, by someone in that fleet.
- **Every day:** dispatch plans each new order from scratch — graph search, constraints, optimisation — and throws the archive of finished deliveries away.
- **One day:** a new order at 08:12 to a cell the fleet has served 200 times arrives, and the system asks the archive before it plans.
- **Because of that:** planning gets cheap and answer quality inherits the experience of hundreds of drivers — but the archive is unindexed, huge, and full of routes that no longer describe the city.
- **Because of that:** the hard problem stops being "how do we plan one route" and becomes "how do we index, retrieve, revise and prune memory".
- **Until finally:** the system answers a new order with one indexed query, adapts the answer for a closure, and keeps its memory useful by forgetting on purpose.

**Why this story:** memory, not search, is what makes an AI system feel experienced.
**The position:** a delivery system that reuses past routes beats one that re-plans from scratch — but only if its case memory is indexed, revised, and pruned; naive retention is a liability, not an asset.
**The stakes:** re-planning every order costs minutes of compute per delivery and produces inconsistent quality; keeping everything costs retrieval latency and, worse, feeds drivers stale routes built for a city that no longer exists.
**The ending, written first:**

> ### Plan less, remember better.
> The case base is the product. Index it, revise it, prune it.

## Three messages (everything earns its place against these)

1. **The 4-R cycle** — Retrieve, Reuse, Revise, Retain — is the engine; knowledge lives in the case base and the cycle's feedback closes the loop.
2. **Index design decides retrieval cost and quality** — coordinates + time of day as index attributes turn an O(N) scan into a guided walk, at the price of possible misses.
3. **Maintenance is a feature, not janitorial** — forgetting, footprint pruning, expiry and re-indexing are what keep memory small, fast and fresh.

## Outline (22 slides)

Section colours on paper `#f7f3ea` (all ≥ 4.5:1 at body size): teal `#0f766e`, red `#b3261e`, purple `#6d28d9`, blue `#1d4ed8`, amber `#b45309`, green `#15803d`.

### 1. Opening — teal

**Slide 1 · Title** — statement, full bleed
- Headline: Case-Based Reasoning for a Smart Navigation & Delivery System
- Subtitle: A last-mile fleet that answers each new order by remembering the ones it already ran
- Meta: Web deck · async · GitHub Pages · built with React Bits, Originkit & Anatomy

**Slide 2 · Goals for today** — goals, split 60/40
- Four things to take away: the 4-R cycle; the case memory as table and as discrimination tree; one worked example end to end (branch stored under, case retrieved, route adapted); tabular vs tree retrieval and how to keep the case base small and fresh.

### 2. The problem — red

**Slide 3 · The archive we throw away** — statement + data
- Headline: Every route we need has already been driven
- Body: 12,000 orders/day; 40,000+ solved routes in the archive; each replanned from scratch: 8–40 s of routing compute, quality that varies with the driver who drew it.
- Punch: we already own the answer; we just can't find it in time.

**Slide 4 · The tension** — question
- Headline: What if the archive were the planner?
- Body: Reusing a finished route is not lazy — it is a query. The cost moves from "plan from scratch" to "find, adapt, verify". Two questions follow: how do we find the right past route, and what do we do when the city has changed since?
- Honest caveat stated: reuse breaks under cold start, under mid-route surprises, and if memory goes stale. Those are exactly the four sections of this deck.

### 3. The CBR cycle — blue

**Slide 5 · Section divider** — 01 / The CBR cycle
- Cycle from Aamodt & Plaza (1994); knowledge containers (case base, vocabulary, similarity, adaptation) noted for the academic frame.

**Slide 6 · The loop, once** — framework
- 4 R cards around a loop: Retrieve → Reuse → Revise → Retain, each one line for the delivery scenario.
- Note the loop closes: Retain feeds Retrieve; the fleet gets better at the queries it actually receives.

**Slide 7 · Retrieve** — statement + bullets
- Headline: Retrieve = weighted nearest neighbours
- Body: similarity function over normalised case features; destination distance dominates (w = 0.40); time of day next (0.25); then traffic (0.20), day type (0.10), weather (0.05). k-NN with k = 3; the index shortlists, the metric ranks.
- Formula (mono): `sim(N,C) = Σ wᵢ·sᵢ(N,C)` with `s_coord = exp(−d²/2σ²), σ = 1 km`.

**Slide 8 · Reuse** — statement
- Headline: Reuse copies the parts that transfer
- Body: the retrieved route is a solution skeleton: ordered streets, timing per segment. Reuse copies what the new problem shares (origin/destination region, time regime) and leaves holes where it does not (new stop order, new closures).
- Rule: the more the two problems differ on a weighted feature, the more of the solution must be rebuilt rather than copied.

**Slide 9 · Revise** — statement
- Headline: Revise tests the answer in the world
- Body: run the reused route against live traffic and closure feeds; repair mismatches (substitute streets, re-sequence, add buffer); the repaired route is scored again. Adaptation knowledge — "swap closed Elm St for Pine St" — is itself reusable memory.
- Delivery framing: Revise is where CBR meets the routing engine: reuse proposes, the world disposes, the result is verified before dispatch.

**Slide 10 · Retain** — statement
- Headline: Retain turns one delivery into future speed
- Body: store problem + solution + outcome (delivered 24.6 min, on time, adapted from R-0512). Retain is also a policy decision: what to keep, where to file it (which tree branch), and when to stop keeping things — see §6.

### 4. Case memory — purple

**Slide 11 · Section divider** — 02 / Case memory

**Slide 12 · The case table** — data/table
- Schema + 10 sample rows (case_id, dest coords, zone, dist, time-of-day, bucket, traffic, day type, actual min, outcome, uses, last used).
- Reading note: this table is the case base; every other structure is an index over it.

**Slide 13 · Index attributes** — framework
- Why index: 40,000 rows × 12,000 orders/day = 480M similarity computations/day; the index is what keeps retrieval interactive.
- Chosen index attributes: destination coordinates → grid cell (coarse→fine), then time-of-day bucket, then traffic. Everything else stays a retrieval feature, not an index feature (weights can change without rebuilding the tree).
- Show the time-of-day buckets: night 00–06 · morning peak 06–09:30 · midday 09:30–16 · evening peak 16–19 · night.

**Slide 14 · The discrimination tree** — diagram + split
- Definition: a tree whose internal nodes test one index attribute and whose leaves/children hold cases; fan-out = attribute cardinality.
- Build rules: attribute order = discriminative power (most selective first); leaf cap L = 3 cases → over-cap leaves split on the next unused attribute (explanation-based index refinement); insert = walk to leaf, store.
- Walk the same tree the worked example uses (slide 15) so the diagram is already familiar.

**Slide 15 · The memory as a machine** — demo (Anatomy figure)
- Embedded isometric figure: an order ticket enters the memory cabinet, the zone and time-of-day gates sort it into a drawer; open a drawer to read the case cards; the readout shows the walk.
- Framing line: the tree is a filing cabinet where the filing clerk is the index.

### 5. Worked example — blue

**Slide 16 · The new order N** — data
- N: depot (0,0) → dest (1.40, 4.70) km, time 08:12, traffic moderate, weekday, clear; target ≤ 25 min.
- Step 1 — walk the tree: Root `x-band = 1` → `y-band = 4` → time bucket `morning peak` → traffic `moderate` → leaf (pre-insert) {R-0142, R-0450, R-0512}. 3 candidate cases, not 40,000.

**Slide 17 · Which case is retrieved** — data (similarity math)
- Full numeric table for the three candidates: d, s_coord, Δt, s_time, traffic/day/weather, weighted sim.
- Result: R-0512 = 0.998 retrieved; R-0142 = 0.989 runner-up. Note: k = 3 shortlist exists precisely because the tree can be wrong (next section).

**Slide 18 · Revise, then Retain** — statement + steps
- Revise: R-0512's route crosses Elm St, closed 08:30–09:00 for works; N's window hits it (~08:30). Substitute Pine St: +1.4 km, +3.2 min → re-verify with live traffic → 24.8 min plan. Outcome: delivered 24.6 min, on time.
- Retain & store: new case N-1187 (problem + adapted route + outcome + `adapted_from R-0512`, regime tag `post-closure-2026-10-14`). Filed under the same branch: Root → x=1 → y=4 → morning peak → moderate leaf. That leaf now holds 4 cases > cap 3 → splits on the next unused attribute (distance band, cut 4.8 km): ≤ 4.8 km {R-0450, R-0142} · > 4.8 km {R-0512, N-1187}.

### 6. Tabular vs tree — amber

**Slide 19 · Two ways to find a case** — comparison matrix
- Rows: query cost; result quality; index build; insert/update; weight flexibility; staleness behaviour; engineering complexity. Columns: flat table scan, discrimination tree, hybrid (tree shortlist + metric re-rank).
- Verdict row: tree = fast and lossy; table = exact and slow; hybrid = what production runs.

**Slide 20 · Where the tree lies to you** — statement + example
- The nearest neighbour can sit one branch over: the tree splits on zone then time, but similarity is dominated by coordinates; a great match at 0.6 km away — same time regime, adjacent cell — is reachable only via a sibling branch.
- Mitigations: score top-k sibling branches, not one; re-rank shortlist with the full metric; keep the index attributes aligned with the weights; re-learn indices with EBL when drift is measured.

### 7. Keeping memory small and fresh — green

**Slide 21 · Prune on purpose** — framework
- Cap first: memory budget (rows, MB, or query latency SLA). Every retention policy needs a number.
- Utility-weighted forgetting: `U(c) = success_rate × reuses / (1 + TSK_days)`; delete lowest U under budget; random deletion as baseline (it wastes what you kept).
- Footprint pruning (Smyth & Keane): delete cases whose coverage is already provided by neighbours — remove redundancy, keep competence.
- Condensation: cluster old regions, keep exemplars (medoids), archive the rest.

**Slide 22 · Fight staleness, not size** — framework
- Age: expiry window (e.g. 90 days) + recency decay in similarity (`× exp(−λ·age)`), so old-but-good cases still compete but lose ties.
- Events: topology change (new bridge, permanent closure) invalidates a region — purge or re-tag affected cases instead of waiting for the expiry clock.
- Regimes: tag cases `pre/post <event>`; retrieval prefers the current regime; cases carry provenance so "why did we route this way" is answerable.
- Drift: watch recall@1 offline and index drift (nearest neighbours found outside the walked branch); rebuild the tree / re-select index attributes when either degrades; monitor the Revise failure rate — it is your staleness alarm.

**Slide 23 · When CBR is the wrong tool** — statement
- Cold start (no history for a region — seed with the optimiser and start remembering), hard constraints that change per order (let the optimiser finish the job; reuse is the seed, not the answer), audit-critical decisions (keep provenance), solution spaces where no past case is close (k-NN returns noise → fall back to full planning and retain that case first).

### 8. Closing — teal

**Slide 24 · Recap** — recap, one line per section (see below).
**Slide 25 · Resources** — references grouped: CBR foundations, retention/maintenance, indexing; plus tooling credits (React Bits, Originkit, Anatomy) and repo/QA notes.

Final slide (recap lines, verbatim):

1. CBR is the 4-R loop: Retrieve → Reuse → Revise → Retain; Retain is what makes the next Retrieve smarter.
2. Memory needs an index: destination coordinates + time of day turn an O(N) scan into a guided walk down the discrimination tree.
3. The worked order at 08:12 walked to branch `x=1 / y=4 / morning-peak / moderate`, retrieved R-0512 (sim 0.998), was adapted around a closure, and was retained as N-1187 in the same branch.
4. Tables are exact and flexible, trees are fast and lossy; production runs the hybrid: tree shortlist, metric re-rank.
5. Memory goes stale and fat on its own: utility-weighted forgetting, footprint pruning, expiry, regime tags and re-indexing are features of the design, not chores.

## Visual system

- Palette: paper `#f7f3ea` background, white surfaces, ink `#211f1e`, ink-soft `#57534e`, hairline `#e3dccb`; one section accent per section (listed above), all ≥ 4.5:1 on paper at body size.
- Type: Bricolage Grotesque (display, weights 300–600), Inter (body), JetBrains Mono (numbers/code/schema). Fluid `clamp()` scale; headlines `text-wrap: balance`, tracking −0.02em; body 16–20px floor.
- Layouts: full statement (title, dividers, tension), split 60/40 (goals, tree diagram), table/data grid (case table, similarity math), 3-card row (4-R cards as 2×2), matrix (comparison), demo full-bleed (Anatomy figure).
- Motion (web-deck rules + the two libraries): headline settle (SplitText on route entry), staggered rise on lists; one ambient background from React Bits at low opacity; cursor/glass accents from Originkit behind a `prefers-reduced-motion` guard. No exit animations.
- Chrome: section label top-left (all caps, tracked), slide counter top-right (`tabular-nums`, aria-live), thin progress bar at the bottom, prev/next buttons + arrow keys + hash routes `#/n`, no wrap at the ends.

## QA criteria (Step 8)

- Render every route headlessly, verify: one message per slide, palette consistency (accent only for the current section), contrast measured at the smallest text on each slide, no `h-screen`, reduced-motion respected, keyboard navigation works, deep link `#/17` restores position.
