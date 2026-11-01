import { useEffect, useState } from 'react';
import { VISUAL, lerpColor, prefersReducedMotion } from '../../lib/visuals';
import { DATA, leaf } from '../../data/cases';




const utility = (id: string) => {
  const c = DATA.cases.find((x) => x.id === id)!;
  return ((c.outcome === 'on-time' ? 1 : 0.5) * c.uses) / (1 + c.lastUsedDays);
};

const SORTED = [...leaf].sort((a, b) => utility(b.c.id) - utility(a.c.id));

export default function PruneChart() {
  const [animIndex, setAnimIndex] = useState(-1);
  const reduced = prefersReducedMotion;

  useEffect(() => {
    if (reduced) {
      setAnimIndex(SORTED.length - 1);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      if (i < SORTED.length) setAnimIndex(i++);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const W = 560;
  const H = 320;
  
  const PLOT_W = W - 120;
  const PLOT_H = H - MARGIN.top - MARGIN.bottom;
  
  

  return (
    <div
      className="relative card-surface p-6"
      style={{ '--accent': '#22c55e' }}
      role="img"
      aria-label="Utility scores for forgetting: R-0512 highest at 13.3, R-0142 at 10.3, R-0450 lowest at 6.3"
    >
      <h3 className="text-2xl font-extrabold mb-2 uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>UTILITY-WEIGHTED FORGETTING</h3>
      <p className="text-sm font-bold mb-4">U = SUCCESS RATE × REUSES ÷ (1 + DAYS SINCE LAST USE)</p>
      <svg
        className="w-full h-auto max-w-[560px] mx-auto"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="utilGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Bars */}
        <g transform="translate(40, 60)">
          {SORTED.map((l, i) => {
            const u = utility(l.c.id);
            const maxU = Math.max(...SORTED.map((s) => utility(s.c.id)));
            const width = (u / maxU) * 380;
            
            const show = i <= (typeof animIndex === 'number' ? animIndex : SORTED.length - 1);

            return (
              <g key={l.c.id} transform={`translate(0, ${i * 32})`} opacity={show ? 1 : 0}>
                {/* Bar */}
                <rect
                  x={0}
                  y={0}
                  width={show ? width : 0}
                  height={28}
                  fill="url(#utilGrad)"
                  stroke="#000000"
                  strokeWidth={2}
                >
                  {!reduced && (
                    <animate
                      attributeName="width"
                      from="0"
                      to={width}
                      dur="0.5s"
                      begin={`${i * 0.12}s`}
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.68 -0.55 0.265 1.55"
                    />
                  )}
                </rect>

                {/* Label */}
                <text x={-10} y={18} textAnchor="end" fontFamily="var(--font-mono, monospace)" fontSize="12" fontWeight="800" fill="#000000">
                  {l.c.id}
                </text>

                {/* Value */}
                <text x={width + 10} y={18} fontFamily="var(--font-mono, monospace)" fontSize="13" fontWeight="800" fill="#000000" style={{ textShadow: '1px 1px 0px white' }}>
                  {utility(l.c.id).toFixed(1)}
                </text>

                {/* Meta */}
                <text x={420} y={18} fontSize="10" fontWeight="700" fill="#000000">
                  {l.c.uses} USES · {l.c.outcome.toUpperCase()} · {l.c.lastUsedDays}D
                </text>
              </g>
            );
          })}
        </g>

        {/* Color scale legend */}
        <g transform="translate(40, 270)">
          <rect x={0} y={0} width={300} height={12} fill="url(#utilGrad)" stroke="#000000" strokeWidth={2} />
          <text x={0} y={-8} fontSize="10" fontWeight="800" fill="#000000">LOW UTILITY → DELETE FIRST</text>
          <text x={300} y={-8} textAnchor="end" fontSize="10" fontWeight="800" fill="#000000">HIGH UTILITY → KEEP</text>
        </g>

        {/* Insight box */}
        <g transform="translate(40, 95)">
          <rect x={0} y={0} width={480} height={70} fill="#fbbf24" stroke="#000000" strokeWidth={3} />
          <text x={12} y={18} fontSize="12" fontWeight="800" fill="#000000">
            R-0512 RANKS HIGHEST — RETRIEVED MOST OFTEN
          </text>
          <text x={12} y={38} fontSize="11" fontWeight="700" fill="#000000">
            FORGETTING IS THE ONLY POLICY THAT REMOVES A CASE THE TREE STILL FINDS USEFUL
          </text>
          <text x={12} y={58} fontSize="11" fontWeight="700" fill="#000000">
            OTHERS JUST KEEP THE BASE HONEST
          </text>
        </g>
      </svg>
    </div>
  );
}