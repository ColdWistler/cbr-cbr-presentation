import { useEffect, useState } from 'react';
import { VISUAL, lerpColor, prefersReducedMotion } from '../../lib/visuals';
import { DATA, leaf, retrieved, SPLIT, LEAF_CAP, distKm } from '../../data/cases';

const ACCENT = VISUAL.blue;
const LOW = VISUAL.green;
const HIGH = VISUAL.amber;

const CASES = leaf.map((l) => ({
  id: l.c.id,
  dist: distKm(l.c.dest),
  isBest: l.c.id === retrieved.c.id,
})).sort((a, b) => a.dist - b.dist);

const NEW_CASE = { id: DATA.retained.id, dist: distKm(DATA.retained.dest) };


const W = 720;
const H = 360;
const DRAWER_Y = 80;
const DRAWER_H = 180;
const CARD_W = 44;
const CARD_H = 100;
const GAP = 12;
const START_X = (W - (CASES.length * CARD_W + (CASES.length - 1) * GAP)) / 2;

export default function DrawerSplit() {
  const [phase, setPhase] = useState(0);
  const reduced = prefersReducedMotion;

  useEffect(() => {
    if (reduced) {
      setPhase(3);
      return;
    }
    const timer = setInterval(() => setPhase((p) => (p + 1) % 4), 4000);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <div
      className="relative card-surface p-6"
      role="img"
      aria-label="Drawer split animation: 3 cases in leaf, N-1187 added, drawer splits into &le;4.8km and >4.8km sections"
    >
      <svg
        className="w-full h-auto max-w-[720px] mx-auto"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="cardGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LOW} />
            <stop offset="100%" stopColor={lerpColor(LOW, VISUAL.paper, 0.3)} />
          </linearGradient>
          <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={HIGH} />
            <stop offset="100%" stopColor={lerpColor(HIGH, VISUAL.paper, 0.3)} />
          </linearGradient>
        </defs>

        {/* Phase label */}
        <text
          x={W / 2}
          y={36}
          textAnchor="middle"
          fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)"
          fontSize="18"
          fontWeight="600"
          fill={VISUAL.ink}
        >
          {[
            `Leaf at capacity: ${LEAF_CAP} cases`,
            'Adding N-1187 \u2192 over capacity',
            `Splitting on ${SPLIT.label} at ${SPLIT.cutKm} km`,
            'Two drawers, each under cap',
          ][phase]}
        </text>

        {/* Drawer body */}
        <g transform={`translate(0, ${DRAWER_Y})`}>
          {/* Drawer frame */}
          <rect
            x={START_X - 20}
            y={0}
            width={CASES.length * CARD_W + (CASES.length - 1) * GAP + 40}
            height={DRAWER_H}
            rx={12}
            fill={VISUAL.surface}
            stroke={VISUAL.hairline}
            strokeWidth={1.5}

          />

          {/* Divider line (phase 2+) */}
          {(phase >= 2) && (
            <line
              x1={START_X + CASES.length * CARD_W + (CASES.length - 1) * GAP - 60}
              y1={0}
              x2={START_X + CASES.length * CARD_W + (CASES.length - 1) * GAP - 60}
              y2={DRAWER_H}
              stroke={ACCENT}
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={phase === 2 ? 1 : 0.4}

            />
          )}

          {/* Cards */}
          {CASES.map((c, i) => {
            const x = START_X + 20 + i * (CARD_W + GAP);
            const isBest = c.isBest;
            const side = c.dist <= SPLIT.cutKm ? 'low' : 'high';
            const inLow = side === 'low';
            const targetX = phase >= 2
              ? (inLow ? START_X + 30 : START_X + CASES.length * CARD_W + (CASES.length - 1) * GAP - 10)
              : x;

            return (
              <g
                key={c.id}
                transform={`translate(${phase >= 2 ? targetX : x}, ${(DRAWER_H - CARD_H) / 2})`}
                opacity={phase === 0 && i === 3 ? 0 : 1}
              >
                {/* Card */}
                <rect
                  x={0}
                  y={0}
                  width={CARD_W}
                  height={CARD_H}
                  rx={6}
                  fill={isBest ? ACCENT : VISUAL.surface}
                  stroke={isBest ? ACCENT : VISUAL.hairline}
                  strokeWidth={isBest ? 2 : 1}
                  filter={isBest ? 'url(#cardGlow)' : undefined}
                >
                  {!reduced && phase === 1 && i === CASES.length - 1 && (
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.4s"
                      begin="0.5s"
                      fill="freeze"
                    />
                  )}
                </rect>

                {/* Distance label */}
                <text
                  x={CARD_W / 2}
                  y={18}
                  textAnchor="middle"
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="10"
                  fontWeight="600"
                  fill={isBest ? '#fff' : VISUAL.ink}
                >
                  {c.dist.toFixed(2)} km
                </text>

                {/* Case ID */}
                <text
                  x={CARD_W / 2}
                  y={CARD_H / 2 + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="12"
                  fontWeight={isBest ? '700' : '500'}
                  fill={isBest ? '#fff' : VISUAL.ink}
                >
                  {c.id}
                  {isBest && <tspan fill={isBest ? '#fff' : ACCENT} fontWeight="700" dx="4">\u2605</tspan>}
                </text>

                {/* Side indicator (phase 2+) */}
                {(phase >= 2) && (
                  <text
                    x={CARD_W / 2}
                    y={CARD_H - 14}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill={inLow ? LOW : HIGH}
                  >
                    {inLow ? '&le; 4.8 km' : '{` > 4.8 km`}'}
                  </text>
                )}
              </g>
            );
          })}

          {/* New case N-1187 (phase 1+) */}
          {(phase >= 1) && (
            <g
              transform={`translate(${START_X + CASES.length * (CARD_W + GAP) + 20}, ${(DRAWER_H - CARD_H) / 2})`}
              opacity={phase >= 1 ? 1 : 0}

            >
              <rect
                x={0}
                y={0}
                width={CARD_W}
                height={CARD_H}
                rx={6}
                fill="rgba(29, 78, 216, 0.06)"
                stroke={ACCENT}
                strokeWidth={2}
                strokeDasharray="4 4"
                filter="url(#cardGlow)"
              >
                {!reduced && (
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.4s"
                    begin="0.2s"
                    fill="freeze"
                  />
                )}
              </rect>
              <text
                x={CARD_W / 2}
                y={18}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="10"
                fontWeight="600"
                fill={ACCENT}
              >
                {NEW_CASE.dist.toFixed(2)} km
              </text>
              <text
                x={CARD_W / 2}
                y={CARD_H / 2 + 4}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="12"
                fontWeight="700"
                fill={ACCENT}
              >
                N-1187
              </text>
              <text
                x={CARD_W / 2}
                y={CARD_H - 14}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={HIGH}
              >
                {` > 4.8 km`}
              </text>
            </g>
          )}

          {/* Split result: two drawers (phase 3) */}
          {(phase === 3) && (
            <g>
              {/* Low drawer */}
              <g transform="translate(40, 0)">
                <rect
                  x={0}
                  y={0}
                  width={280}
                  height={DRAWER_H}
                  rx={12}
                  fill={VISUAL.surface}
                  stroke={LOW}
                  strokeWidth={2}
                />
                <text x={140} y={-8} textAnchor="middle" fontSize="12" fontWeight="600" fill={LOW}>
                  {`&le; 4.8 km`}
                </text>
                {CASES.filter((c) => c.dist <= SPLIT.cutKm).map((c, i) => (
                  <g key={c.id} transform={`translate(${20 + i * (CARD_W + GAP)}, ${(DRAWER_H - CARD_H) / 2})`}>
                    <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={6} fill={VISUAL.surface} stroke={VISUAL.hairline} strokeWidth={1} />
                    <text x={CARD_W / 2} y={CARD_H / 2 + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="500" fill={VISUAL.ink}>{c.id}</text>
                  </g>
                ))}
              </g>

              {/* High drawer */}
              <g transform="translate(360, 0)">
                <rect
                  x={0}
                  y={0}
                  width={300}
                  height={DRAWER_H}
                  rx={12}
                  fill={VISUAL.surface}
                  stroke={HIGH}
                  strokeWidth={2}
                />
                <text x={150} y={-8} textAnchor="middle" fontSize="12" fontWeight="600" fill={HIGH}>
                  {` > 4.8 km`}
                </text>
                {[
                  ...CASES.filter((c) => c.dist > SPLIT.cutKm),
                  NEW_CASE,
                ].map((c, i) => (
                  <g key={c.id} transform={`translate(${20 + i * (CARD_W + GAP)}, ${(DRAWER_H - CARD_H) / 2})`}>
                    <rect x={0} y={0} width={CARD_W} height={CARD_H} rx={6} fill={c.id === NEW_CASE.id ? 'rgba(29, 78, 216, 0.06)' : VISUAL.surface} stroke={c.id === NEW_CASE.id ? ACCENT : VISUAL.hairline} strokeWidth={c.id === NEW_CASE.id ? 2 : 1} strokeDasharray={c.id === NEW_CASE.id ? '4 4' : undefined} />
                    <text x={CARD_W / 2} y={18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill={c.id === NEW_CASE.id ? ACCENT : VISUAL.ink}>{c.dist.toFixed(2)} km</text>
                    <text x={CARD_W / 2} y={CARD_H / 2 + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight={c.id === NEW_CASE.id ? '700' : '500'} fill={c.id === NEW_CASE.id ? ACCENT : VISUAL.ink}>{c.id}</text>
                  </g>
                ))}
              </g>
            </g>
          )}

          {/* Legend */}
          <g transform={`translate(${W - 200}, ${H - 60})`} fontSize="10" fontFamily="var(--font-sans)">
            <rect x={-6} y={-6} width={190} height={40} rx={6} fill={VISUAL.surface} stroke={VISUAL.hairline} />
            <circle cx={8} cy={6} r={5} fill={LOW} />
            <text x={18} y={10} fill={VISUAL.ink}>{`&le; 4.8 km`}</text>
            <circle cx={8} cy={24} r={5} fill={HIGH} />
            <text x={18} y={28} fill={VISUAL.ink}>{` > 4.8 km`}</text>
          </g>
        </g>
      </svg>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}