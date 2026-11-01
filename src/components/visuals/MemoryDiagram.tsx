import { useEffect, useState } from 'react';
import { VISUAL, svg, polar, lerpColor, prefersReducedMotion } from '../../lib/visuals';
import { DATA, Q, leaf, bucketOf, hhmm, cell } from '../../data/cases';

const ACCENT = VISUAL.purple;
const COLORS = VISUAL.chart.purple;

interface CasePoint {
  id: string;
  x: number;
  y: number;
  inLeaf: boolean;
  dist: number;
}

const POINTS: CasePoint[] = DATA.cases
  .filter((r) => r.dest.y > 2.5)
  .map((r) => ({
    id: r.id,
    x: r.dest.x,
    y: r.dest.y,
    inLeaf: leaf.some((l) => l.c.id === r.id),
    dist: Math.hypot(r.dest.x - DATA.depot.x, r.dest.y - DATA.depot.y),
  }));

const ORDER_N = { x: Q.dest.x, y: Q.dest.y };

// Pre-compute map results to avoid arrow functions in JSX
const X_BANDS = [0, 1, 2];
const Y_BANDS = [0, 1, 2, 3];
const TIME_BUCKETS = ['night', 'morning', 'midday', 'evening'];
const TRAFFIC_LEVELS = ['light', 'moderate', 'heavy'];

export default function MemoryDiagram() {
  const [phase, setPhase] = useState(0);
  const reduced = prefersReducedMotion;

  useEffect(() => {
    if (reduced) {
      setPhase(3);
      return;
    }
    const timer = setInterval(() => setPhase((p) => (p + 1) % 4), 3500);
    return () => clearInterval(timer);
  }, [reduced]);

  // SVG dimensions
  const W = 720;
  const H = 420;
  const MARGIN = 60;
  const PLOT_W = W - MARGIN * 2;
  const PLOT_H = H - MARGIN * 2;

  // Map world coords to SVG
  const scaleX = (wx: number) => MARGIN + (wx - 0.5) / 3.5 * PLOT_W;
  const scaleY = (wy: number) => MARGIN + PLOT_H - (wy - 2.5) / 3.5 * PLOT_H;

  return (
    <div
      className="relative"
      style={{ '--accent': VISUAL.purple }}
      role="img"
      aria-label="Case memory visualization: 1km grid with past cases as dots, order N highlighted, discrimination tree walk shown"
    >
      <svg
        className="w-full h-auto max-w-[720px] mx-auto"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 8 3.5, 0 6" fill={VISUAL.purple} />
          </marker>
        </defs>

        {/* Grid */}
        <g opacity={phase === 0 || phase === 2 ? 1 : 0.3} transition="opacity 0.6s ease">
          {X_BANDS.map((i) => (
            <line
              key={`vx-${i}`}
              x1={scaleX(i)}
              y1={MARGIN}
              x2={scaleX(i)}
              y2={MARGIN + PLOT_H}
              stroke={VISUAL.hairline}
              strokeWidth={1}
            />
          ))}
          {Y_BANDS.map((i) => (
            <line
              key={`hy-${i}`}
              x1={MARGIN}
              y1={scaleY(2.5 + i * 0.75)}
              x2={MARGIN + PLOT_W}
              y2={scaleY(2.5 + i * 0.75)}
              stroke={VISUAL.hairline}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Grid labels */}
        <g fontSize="10" fill={VISUAL.inkSoft} fontFamily="var(--font-mono, monospace)">
          {X_BANDS.map((i) => (
            <text key={`xl-${i}`} x={scaleX(i)} y={H - MARGIN + 18} textAnchor="middle">{i}</text>
          ))}
          {Y_BANDS.map((i) => (
            <text key={`yl-${i}`} x={MARGIN - 10} y={scaleY(2.5 + i * 0.75) + 4} textAnchor="end">
              {2.5 + i * 0.75}
            </text>
          ))}
        </g>

        {/* Walked branch highlight (phase 2+) */}
        {(phase >= 2) && (
          <rect
            x={scaleX(1)}
            y={MARGIN}
            width={scaleX(2) - scaleX(1)}
            height={PLOT_H}
            fill="rgba(109, 40, 217, 0.08)"
            stroke={VISUAL.purple}
            strokeWidth={1.5}
            strokeDasharray="8 6"
            rx={4}
            opacity={phase === 2 ? 1 : 0.5}
            transition="opacity 0.4s"
          />
        )}

        {/* Tree structure overlay (phase 1+) */}
        {(phase >= 1) && (
          <g opacity={phase === 1 ? 1 : 0.4} transition="opacity 0.6s">
            {/* Tree nodes */}
            <g fontSize="11" fontFamily="var(--font-mono, monospace)" fill={VISUAL.ink}>
              {/* Root */}
              <circle cx={W / 2} cy={40} r={18} fill={VISUAL.surface} stroke={VISUAL.purple} strokeWidth={2} />
              <text x={W / 2} y={44} textAnchor="middle" fontSize="10" fontWeight="600" fill={VISUAL.purple}>case base</text>
              <text x={W / 2} y={56} textAnchor="middle" fontSize="9" fill={VISUAL.inkSoft}>x-band</text>

              {/* Level 1: x-bands */}
              {X_BANDS.map((i) => (
                <g key={`x-${i}`}>
                  <line
                    x1={W / 2}
                    y1={58}
                    x2={80 + i * 200}
                    y2={110}
                    stroke={i === 1 ? VISUAL.purple : VISUAL.hairline}
                    strokeWidth={i === 1 ? 2 : 1}
                    markerEnd={i === 1 ? 'url(#arrowhead)' : undefined}
                  />
                  <circle cx={80 + i * 200} cy={110} r={16} fill={i === 1 ? VISUAL.purple : VISUAL.surface} stroke={i === 1 ? VISUAL.purple : VISUAL.hairline} strokeWidth={2} />
                  <text x={80 + i * 200} y={114} textAnchor="middle" fontSize="10" fontWeight="600" fill={i === 1 ? '#fff' : VISUAL.ink}>x={i}</text>
                </g>
              ))}

              {/* Level 2: y-bands (from x=1) */}
              {Y_BANDS.map((i) => (
                <g key={`y-${i}`}>
                  <line
                    x1={280}
                    y1={126}
                    x2={180 + i * 100}
                    y2={170}
                    stroke={i === 3 ? VISUAL.purple : VISUAL.hairline}
                    strokeWidth={i === 3 ? 2 : 1}
                    markerEnd={i === 3 ? 'url(#arrowhead)' : undefined}
                  />
                  <circle cx={180 + i * 100} cy={170} r={14} fill={i === 3 ? VISUAL.purple : VISUAL.surface} stroke={i === 3 ? VISUAL.purple : VISUAL.hairline} strokeWidth={1.5} />
                  <text x={180 + i * 100} y={174} textAnchor="middle" fontSize="9" fontWeight="600" fill={i === 3 ? '#fff' : VISUAL.ink}>y={i + 1}</text>
                </g>
              ))}

              {/* Level 3: time buckets (from y=4) */}
              {TIME_BUCKETS.map((b, i) => (
                <g key={`t-${b}`}>
                  <line
                    x1={480}
                    y1={186}
                    x2={420 + i * 80}
                    y2={230}
                    stroke={b === 'morning' ? VISUAL.purple : VISUAL.hairline}
                    strokeWidth={b === 'morning' ? 2 : 1}
                    markerEnd={b === 'morning' ? 'url(#arrowhead)' : undefined}
                  />
                  <rect x={420 + i * 80 - 30} y={230 - 12} width={60} height={24} rx={4} fill={b === 'morning' ? VISUAL.purple : VISUAL.surface} stroke={b === 'morning' ? VISUAL.purple : VISUAL.hairline} strokeWidth={1.5} />
                  <text x={420 + i * 80} y={235} textAnchor="middle" fontSize={9} fontWeight="600" fill={b === 'morning' ? '#fff' : VISUAL.ink}>{b}</text>
                </g>
              ))}

              {/* Level 4: traffic (from morning) */}
              {TRAFFIC_LEVELS.map((t, i) => (
                <g key={`tr-${t}`}>
                  <line
                    x1={460}
                    y1={246}
                    x2={400 + i * 100}
                    y2={285}
                    stroke={t === 'moderate' ? VISUAL.purple : VISUAL.hairline}
                    strokeWidth={t === 'moderate' ? 2 : 1}
                    markerEnd={t === 'moderate' ? 'url(#arrowhead)' : undefined}
                  />
                  <rect x={400 + i * 100 - 35} y={285 - 12} width={70} height={24} rx={4} fill={t === 'moderate' ? VISUAL.purple : VISUAL.surface} stroke={t === 'moderate' ? VISUAL.purple : VISUAL.hairline} strokeWidth={1.5} />
                  <text x={400 + i * 100} y={289} textAnchor="middle" fontSize={9} fontWeight="600" fill={t === 'moderate' ? '#fff' : VISUAL.ink}>{t}</text>
                </g>
              ))}

              {/* Leaf */}
              <line x1={500} y1={301} x2={500} y2={335} stroke={VISUAL.purple} strokeWidth={2} markerEnd="url(#arrowhead)" />
              <rect x={380} y={335} width={240} height={36} rx={6} fill="rgba(109, 40, 217, 0.08)" stroke={VISUAL.purple} strokeWidth={2} />
              <text x={500} y={355} textAnchor="middle" fontSize={11} fontWeight="600" fill={VISUAL.purple}>leaf \u00b7 R-0142 \u00b7 R-0450 \u00b7 R-0512</text>
              <text x={500} y={370} textAnchor="middle" fontSize={9} fill={VISUAL.inkSoft}>cap = 3 cases</text>
            </g>
          </g>
        )}

        {/* Past cases as dots */}
        <g>
          {POINTS.map((p) => {
            
            
            const inLeaf = p.inLeaf;
            const isOrderN = p.id === 'N';

            return (
              <g key={p.id} transform={`translate(${scaleX(p.x)}, ${scaleY(p.y)})`}>
                {/* Pulse ring for leaf cases (phase 2+) */}
                {(phase >= 2 && inLeaf) && (
                  <circle
                    r={18}
                    fill="transparent"
                    stroke={VISUAL.purple}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    opacity={0.6}
                    filter="url(#glow)"
                  >
                    {!reduced && (
                      <animate
                        attributeName="r"
                        from="12"
                        to="24"
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${p.dist * 100}ms`}
                      />
                    )}
                  </circle>
                )}

                {/* Dot */}
                <circle
                  r={inLeaf ? 9 : 6}
                  fill={inLeaf ? VISUAL.purple : '#c9c0aa'}
                  stroke={inLeaf ? VISUAL.purple : VISUAL.hairline}
                  strokeWidth={inLeaf ? 0 : 1.5}
                  opacity={phase === 0 ? (inLeaf ? 1 : 0.6) : (inLeaf ? 1 : 0.3)}
                  filter={inLeaf ? 'url(#glow)' : undefined}
                  
                >
                  {!reduced && phase === 0 && (
                    <animate
                      attributeName="r"
                      from="0"
                      to={inLeaf ? 9 : 6}
                      dur="0.5s"
                      begin={`${p.dist * 80}ms`}
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.34 1.56 0.64 1"
                    />
                  )}
                </circle>

                {/* Order N label */}
                {isOrderN && (
                  <text
                    x={18}
                    y={-14}
                    textAnchor="middle"
                    fontFamily="var(--font-mono, monospace)"
                    fontSize="14"
                    fontWeight="700"
                    fill={VISUAL.ink}
                  >
                    N
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Order N special marker */}
        <g transform={`translate(${scaleX(ORDER_N.x)}, ${scaleY(ORDER_N.y)})`}>
          <rect x={-10} y={-10} width={20} height={20} fill="none" stroke={VISUAL.ink} strokeWidth={2.5} rx={2} />
          <text x={0} y={-16} textAnchor="middle" fontFamily="var(--font-mono, monospace)" fontSize="14" fontWeight="700" fill={VISUAL.ink}>N</text>
        </g>

        {/* Phase label */}
        <text
          x={W / 2}
          y={30}
          textAnchor="middle"
          fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)"
          fontSize="16"
          fontWeight="600"
          fill={VISUAL.ink}
        >
          {['1 km grid \u00b7 40,000 cases', 'Discrimination tree overlay', 'Order N walk: x=1 \u2192 y=4 \u2192 morning peak \u2192 moderate', 'Leaf: 3 cases \u00b7 split on distance'][phase]}
        </text>

        {/* Legend */}
        <g transform={`translate(${W - 180}, ${MARGIN})`} fontSize="11" fontFamily="var(--font-sans)">
          <rect x={-8} y={-8} width={170} height={60} rx={6} fill={VISUAL.surface} stroke={VISUAL.hairline} strokeWidth={1} />
          <circle cx={8} cy={6} r={5} fill={VISUAL.purple} />
          <text x={18} y={10} fill={VISUAL.ink}>In walked branch</text>
          <circle cx={8} cy={24} r={5} fill="#c9c0aa" stroke={VISUAL.hairline} strokeWidth={1.5} />
          <text x={18} y={28} fill={VISUAL.inkSoft}>Other cases</text>
          <rect x={4} y={42} width={8} height={8} rx={2} fill="none" stroke={VISUAL.ink} strokeWidth={2.5} />
          <text x={18} y={50} fill={VISUAL.ink}>Order N</text>
        </g>
      </svg>
    </div>
  );
}