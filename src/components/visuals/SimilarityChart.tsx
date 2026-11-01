import { useEffect, useRef, useState } from 'react';
import { VISUAL, lerpColor, prefersReducedMotion } from "../../lib/visuals";
import { leaf, retrieved } from "../../data/cases";


const ACCENT = VISUAL.blue;
const COLORS = VISUAL.chart.blue;

interface BarData {
  id: string;
  sim: number;
  coord: number;
  time: number;
  traffic: number;
  day: number;
  weather: number;
  isBest: boolean;
}

const BARS: BarData[] = leaf.map((l) => ({
  id: l.c.id,
  sim: l.sim,
  coord: l.sCoord,
  time: l.sTime,
  traffic: l.sTraffic,
  day: l.sDay,
  weather: l.sWeather,
  isBest: l.c.id === retrieved.c.id,
}));

const WEIGHTS = [
  { key: 'coord', label: 'Distance (40%)', color: COLORS[0] },
  { key: 'time', label: 'Time of day (25%)', color: COLORS[1] },
  { key: 'traffic', label: 'Traffic (20%)', color: COLORS[2] },
  { key: 'day', label: 'Day type (10%)', color: COLORS[3] },
  { key: 'weather', label: 'Weather (5%)', color: COLORS[3] },
] as const;

export default function SimilarityChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'total' | 'breakdown'>('total');
  const [animIndex, setAnimIndex] = useState(-1);
  const reduced = prefersReducedMotion;

  // Toggle mode every 4s
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setMode((m) => (m === 'total' ? 'breakdown' : 'total')), 4000);
    return () => clearInterval(timer);
  }, [reduced]);

  // Staggered bar animation
  useEffect(() => {
    if (reduced) {
      setAnimIndex(BARS.length - 1);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      if (i < BARS.length) setAnimIndex(i++);
    }, 150);
    return () => clearInterval(timer);
  }, [reduced, mode]);

  // Dimensions
  const W = 800;
  const H = 420;
  const MARGIN = { top: 60, right: 40, bottom: 60, left: 120 };
  const PLOT_W = W - MARGIN.left - MARGIN.right;
  
  const BAR_H = 28;
  const GAP = 10;

  return (
    <div
      ref={containerRef}
      className="relative"
      role="img"
      aria-label={`Similarity ranking for order N: ${BARS.map(b => `${b.id} ${(b.sim*100).toFixed(1)}%`).join(', ')}`}
    >
      <button
        onClick={() => setMode((m) => (m === 'total' ? 'breakdown' : 'total'))}
        className="absolute top-4 right-4 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors"
        style={{
          background: VISUAL.surface,
          borderColor: VISUAL.hairline,
          color: VISUAL.ink,
        }}
        aria-pressed={mode === 'breakdown'}
      >
        {mode === 'total' ? 'Show breakdown' : 'Show total'}
      </button>

      <svg
        className="w-full h-auto max-w-[800px] mx-auto"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bestGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS[0]} />
            <stop offset="100%" stopColor={COLORS[2]} />
          </linearGradient>
          <linearGradient id="otherGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={lerpColor(COLORS[1], VISUAL.paper, 0.4)} />
            <stop offset="100%" stopColor={lerpColor(COLORS[2], VISUAL.paper, 0.4)} />
          </linearGradient>
          <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Title */}
        <text
          x={W / 2}
          y={36}
          textAnchor="middle"
          fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)"
          fontSize="20"
          fontWeight="600"
          fill={VISUAL.ink}
        >
          {mode === 'total' ? 'Similarity ranking — order N at 08:12' : 'Score breakdown by feature'}
        </text>
        <text
          x={W / 2}
          y={54}
          textAnchor="middle"
          fontSize="12"
          fill={VISUAL.inkSoft}
        >
          {mode === 'total'
            ? `Retrieved: ${retrieved.c.id} · ${(retrieved.sim * 100).toFixed(1)}% match`
            : 'Weights: Distance 40% · Time 25% · Traffic 20% · Day 10% · Weather 5%'}
        </text>

        {/* Bars */}
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {BARS.map((bar, i) => {
            const y = i * (BAR_H + GAP);
            const show = animIndex >= i;
            const totalWidth = mode === 'total' ? bar.sim * PLOT_W : PLOT_W;

            // Segment widths for breakdown
            const segments = mode === 'breakdown' ? [
              { key: 'coord', width: bar.coord * 0.40 * PLOT_W },
              { key: 'time', width: bar.time * 0.25 * PLOT_W },
              { key: 'traffic', width: bar.traffic * 0.20 * PLOT_W },
              { key: 'day', width: bar.day * 0.10 * PLOT_W },
              { key: 'weather', width: bar.weather * 0.05 * PLOT_W },
            ] : [];

            return (
              <g key={bar.id} transform={`translate(0, ${y})`} opacity={show ? 1 : 0}>
                {!reduced && show && (
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.4s"
                    begin={`${i * 0.15}s`}
                    fill="freeze"
                  />
                )}

                {/* Row background */}
                <rect
                  x={-10}
                  y={-4}
                  width={PLOT_W + 20}
                  height={BAR_H + 8}
                  rx={6}
                  fill={bar.isBest ? lerpColor(ACCENT, VISUAL.paper, 0.92) : 'transparent'}
                  stroke={bar.isBest ? ACCENT : 'transparent'}
                  strokeWidth={1.5}
                  opacity={bar.isBest ? 1 : 0}
                />

                {/* Total bar (mode === 'total') */}
                {mode === 'total' && (
                  <g>
                    <rect
                      x={0}
                      y={0}
                      width={show ? bar.sim * PLOT_W : 0}
                      height={BAR_H}
                      rx={6}
                      fill={bar.isBest ? 'url(#bestGrad)' : 'url(#otherGrad)'}
                      stroke={bar.isBest ? '#000000' : '#000000'}
                      strokeWidth={bar.isBest ? 3 : 2}
                    >
                      {!reduced && show && (
                        <animate
                          attributeName="width"
                          from="0"
                          to={bar.sim * PLOT_W}
                          dur="0.5s"
                          begin={`${i * 0.12}s`}
                          fill="freeze"
                          calcMode="spline"
                          keySplines="0.68 -0.55 0.265 1.55"
                        />
                      )}
                    </rect>

                    {/* Score label */}
                    <text
                      x={bar.sim * PLOT_W + 12}
                      y={BAR_H / 2 + 4}
                      fontFamily="var(--font-mono, monospace)"
                      fontSize="14"
                      fontWeight="800"
                      fill="#000000"
                      style={{ textShadow: '1px 1px 0px white' }}
                      opacity={show ? 1 : 0}
                    >
                      {(bar.sim * 100).toFixed(1)}%
                      {bar.isBest && ' ★'}
                    </text>
                  </g>
                )}

                {/* Breakdown segments (mode === 'breakdown') */}
                {mode === 'breakdown' && (
                  <g>
                    {segments.map((seg, si) => {
                      let x = 0;
                      for (let j = 0; j < si; j++) x += segments[j].width;

                      return (
                        <rect
                          key={seg.key}
                          x={x}
                          y={0}
                          width={show ? seg.width : 0}
                          height={BAR_H}
                          rx={si === 0 ? 6 : si === segments.length - 1 ? 6 : 0}
                          fill={WEIGHTS[si].color}
                          opacity={0.85}
                        >
                          {!reduced && (
                            <animate
                              attributeName="width"
                              from="0"
                              to={seg.width}
                              dur="0.5s"
                              begin={`${(i * 5 + si) * 0.1}s`}
                              fill="freeze"
                              calcMode="spline"
                              keySplines="0.34 1.56 0.64 1"
                            />
                          )}
                        </rect>
                      );
                    })}
                  </g>
                )}

                {/* Case label */}
                <text
                  x={-110}
                  y={BAR_H / 2 + 4}
                  textAnchor="end"
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="13"
                  fontWeight={bar.isBest ? '800' : '700'}
                  fill="#000000"
                >
                  {bar.id}
                  {bar.isBest && <tspan fontWeight="800"> ★ PICKED</tspan>}
                </text>
              </g>
            );
          })}
        </g>

        {/* Weight legend (breakdown mode) */}
        {mode === 'breakdown' && (
          <g transform={`translate(${MARGIN.left}, ${H - MARGIN.bottom + 20})`}>
            <text
              x={0}
              y={-8}
              fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)"
              fontSize="12"
              fontWeight="600"
              fill={VISUAL.ink}
            >
              Feature weights
            </text>
            <g transform="translate(0, 0)">
              {WEIGHTS.map((w, i) => (
                <g key={w.key} transform={`translate(${i * 160}, 0)`}>
                  <rect x={0} y={0} width={14} height={14} rx={3} fill={w.color} opacity={0.85} />
                  <text x={20} y={10} fontSize="11" fill={VISUAL.ink}>{w.label}</text>
                </g>
              ))}
            </g>
          </g>
        )}

        {/* Formula */}
        {mode === 'total' && (
          <text
            x={W / 2}
            y={H - 20}
            textAnchor="middle"
            fontFamily="var(--font-mono, monospace)"
            fontSize="12"
            fill={VISUAL.inkSoft}
          >
            sim = 0.40×coord + 0.25×time + 0.20×traffic + 0.10×day + 0.05×weather
          </text>
        )}
      </svg>

      <style>{`
        @media ${prefersReducedMotion} {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}