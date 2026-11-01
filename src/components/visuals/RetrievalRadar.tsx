import { useEffect, useState } from 'react';
import { VISUAL, polar, prefersReducedMotion } from '../../lib/visuals';


const COLORS = {
  table: '#ef4444',
  tree: '#a855f7',
  hybrid: '#22c55e',
};

const AXES = [
  { key: 'speed', label: 'QUERY SPEED', table: 0.2, tree: 0.9, hybrid: 0.85, higherBetter: true },
  { key: 'quality', label: 'RESULT QUALITY', table: 1.0, tree: 0.6, hybrid: 0.95, higherBetter: true },
  { key: 'weights', label: 'WEIGHT FLEXIBILITY', table: 1.0, tree: 0.4, hybrid: 0.9, higherBetter: true },
  { key: 'staleness', label: 'STALE HANDLING', table: 0.3, tree: 0.5, hybrid: 0.9, higherBetter: true },
  { key: 'complexity', label: 'SIMPLICITY', table: 1.0, tree: 0.5, hybrid: 0.4, higherBetter: true },
  { key: 'maintenance', label: 'MAINTENANCE', table: 0.7, tree: 0.6, hybrid: 0.8, higherBetter: true },
];

const SYSTEMS = [
  { id: 'table', name: 'FLAT TABLE', color: COLORS.table },
  { id: 'tree', name: 'DISCRIM TREE', color: COLORS.tree },
  { id: 'hybrid', name: 'HYBRID ★', color: COLORS.hybrid },
];

export default function RetrievalRadar() {
  const [highlight, setHighlight] = useState<string | null>(null);
  const reduced = prefersReducedMotion;

  const W = 560;
  const H = 560;
  const CX = W / 2;
  const CY = H / 2;
  const MAX_R = Math.min(CX, CY) - 90;
  const LEVELS = 5;

  return (
    <div
      className="relative card-surface p-6"
      role="img"
      aria-label="Radar chart comparing flat table, discrimination tree, and hybrid retrieval across six criteria"
    >
      <h3 className="text-2xl font-extrabold mb-4 uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>RETRIEVAL COMPARISON</h3>
      <svg
        className="w-full h-auto max-w-[560px] mx-auto"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid circles */}
        <g stroke="#000000" strokeWidth="2" fill="none">
          {[...Array(LEVELS)].map((_, i) => (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={((i + 1) / LEVELS) * MAX_R}
              opacity={0.3}
            />
          ))}
        </g>

        {/* Axis lines & labels */}
        <g fontFamily="var(--font-sans, sans-serif)" fontSize="10" fill="#000000">
          {AXES.map((axis, i) => {
            const angle = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
            const labelR = MAX_R + 40;
            const labelX = CX + Math.cos(angle) * labelR;
            const labelY = CY + Math.sin(angle) * labelR;
            const anchor = Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle';
            const baseline = Math.sin(angle) > 0.1 ? 'hanging' : Math.sin(angle) < -0.1 ? 'alphabetic' : 'middle';

            return (
              <g key={axis.key}>
                <line
                  x1={CX}
                  y1={CY}
                  x2={CX + Math.cos(angle) * MAX_R}
                  y2={CY + Math.sin(angle) * MAX_R}
                  stroke="#000000"
                  strokeWidth={2}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  dominantBaseline={baseline}
                  fontSize="9"
                  fontWeight="800"
                  fill="#000000"
                  style={{ textShadow: '1px 1px 0px white' }}
                >
                  {axis.label}
                </text>

                {/* Level markers */}
                {[...Array(LEVELS)].map((_, l) => {
                  const r = ((l + 1) / LEVELS) * MAX_R;
                  const x = CX + Math.cos(angle) * r;
                  const y = CY + Math.sin(angle) * r;
                  return (
                    <circle key={l} cx={x} cy={y} r={2} fill={VISUAL.hairline} opacity={0.5} />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* Polygons for each system */}
        <g filter="url(#radarGlow)">
          {SYSTEMS.map((sys) => {
            const points = AXES.map((axis, i) => {
              const angle = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
              const value = axis[sys.id as keyof typeof axis] as number;
              const r = value * MAX_R;
              return polar(CX, CY, r, (i / AXES.length) * 360 - 90);
            });

            return (
              <g key={sys.id}>
                <polygon
                  points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill={sys.color}
                  fillOpacity={highlight === sys.id ? 0.4 : 0.25}
                  stroke="#000000"
                  strokeWidth={4}
                  strokeLinejoin="round"
                >
                  {!reduced && (
                    <animate
                      attributeName="points"
                      from={AXES.map(() => `${CX},${CY}`).join(' ')}
                      to={points.map((p) => `${p.x},${p.y}`).join(' ')}
                      dur="0.8s"
                      begin="0.1s"
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.68 -0.55 0.265 1.55"
                    />
                  )}
                </polygon>

                {/* Vertices */}
                <g>
                  {AXES.map((axis, i) => {
                    const angle = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
                    const value = axis[sys.id as keyof typeof axis] as number;
                    const r = value * MAX_R;
                    const p = polar(CX, CY, r, (i / AXES.length) * 360 - 90);

                    return (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={7}
                        fill={sys.color}
                        stroke="#000000"
                        strokeWidth={3}
                        opacity={highlight === sys.id || highlight === null ? 1 : 0.4}
                      />
                    );
                  })}
                </g>
              </g>
            );
          })}
        </g>

        {/* Center label */}
        <g transform={`translate(${CX}, ${CY})`} textAnchor="middle">
          <rect x={-70} y={-30} width={140} height={60} fill="#fbbf24" stroke="#000000" strokeWidth={3} />
          <text y={-6} fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)" fontSize="20" fontWeight="800" fill="#000000">
            RETRIEVAL
          </text>
          <text y={18} fontSize="12" fontWeight="800" fill="#000000">HYBRID WINS</text>
        </g>

        {/* Legend */}
        <g transform={`translate(${30}, ${30})`} fontSize="11" fontFamily="var(--font-sans)">
          {SYSTEMS.map((sys, i) => (
            <g key={sys.id} transform={`translate(0, ${i * 28})`} cursor="pointer" onMouseEnter={() => setHighlight(sys.id)} onMouseLeave={() => setHighlight(null)}>
              <rect x={0} y={0} width={16} height={16} fill={sys.color} stroke="#000000" strokeWidth={2} />
              <text x={26} y={12} fontSize="11" fontWeight="800" fill="#000000">{sys.name}</text>
            </g>
          ))}
        </g>

        {/* Verdict badge */}
        <g transform={`translate(${W - 190}, ${H - 70})`}>
          <rect x={0} y={0} width={170} height={50} fill="#22c55e" stroke="#000000" strokeWidth={3} />
          <text x={85} y={18} textAnchor="middle" fontSize="12" fontWeight="800" fill="#000000">★ RECOMMENDED ★</text>
          <text x={85} y={36} textAnchor="middle" fontSize="12" fontWeight="800" fill="#000000">HYBRID APPROACH</text>
        </g>
      </svg>
    </div>
  );
}