;
import { VISUAL, lerpColor } from '../../lib/visuals';



const STALENESS = [
  {
    id: 'age',
    title: 'Age: expiry + decay',
    icon: 'calendar',
    color: VISUAL.blue,
    detail: 'Retire cases > 90 days; multiply similarity by exp(−λ·age). Old-but-good still competes, just loses ties.',
  },
  {
    id: 'events',
    title: 'Events beat clocks',
    icon: 'zap',
    color: VISUAL.red,
    detail: 'A new bridge or permanent closure invalidates a region immediately — purge or re-tag, don\'t wait for expiry.',
  },
  {
    id: 'regimes',
    title: 'Regimes & provenance',
    icon: 'tag',
    color: VISUAL.purple,
    detail: 'Tag cases pre/post each event; retrieval prefers current regime. Provenance makes "why this route?" answerable.',
  },
  {
    id: 'drift',
    title: 'Watch the drift',
    icon: 'activity',
    color: VISUAL.amber,
    detail: 'Track recall@1 offline, index drift (best cases outside walked branch), Revise failure rate — that\'s the staleness alarm.',
  },
];

const ICONS = {
  calendar: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="24" height="24" rx="3" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <line x1="8" y1="16" x2="16" />
      <line x1="4" y1="4" x2="28" y2="4" strokeWidth="2" />
    </g>
  ),
  zap: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l-4 10h6l-4 10-6-10h6Z" />
    </g>
  ),
  tag: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h14l6 6v10l-6 6H8l-6-6V4l6-6Z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  activity: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20v-6h6l-4-6h14l-4 6h6v6" />
      <line x1="10" y1="14" x2="10" y2="20" />
      <line x1="22" y1="14" x2="22" y2="20" />
    </g>
  ),
};

export default function StalenessTimeline() {
  
  


  const W = 640;
  const H = 360;

  return (
    <div
      className="relative"
      
      role="img"
      aria-label="Staleness strategies: age expiry, event-driven purge, regime tags, drift monitoring"
    >
      <svg
        className="w-full h-auto max-w-[640px] mx-auto"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="timelineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Title */}
        <text x={40} y={32} fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)" fontSize="18" fontWeight="600" fill={VISUAL.ink}>
          Fight staleness, not size
        </text>
        <text x={40} y={52} fontSize="12" fill={VISUAL.inkSoft}>A case base that never grows gets slow; one that never forgets gets wrong. Staleness is measured, not guessed.</text>

        {/* Timeline backbone */}
        <g transform="translate(80, 120)">
          <line x1={0} y1={0} x2={480} y2={0} stroke={VISUAL.hairline} strokeWidth={2} />

          {/* Time markers */}
          {[0, 30, 60, 90, 120].map((d) => (
            <g key={d} transform={`translate(${d * 4}, 0)`}>
              <line x1={0} y1={-6} x2={0} y2={6} stroke={VISUAL.hairline} strokeWidth={1.5} />
              <text x={0} y={20} textAnchor="middle" fontSize="10" fill={VISUAL.inkSoft} fontFamily="var(--font-mono)">{d}d</text>
            </g>
          ))}

          {/* Event markers */}
          <g>
            <circle cx="0" cy={0} r={8} fill={VISUAL.blue} />
            <text x={-4} y={-16} textAnchor="end" fontSize="9" fill={VISUAL.blue} fontWeight="600">New case</text>
          </g>
          <g transform="translate(120, 0)">
            <circle cx="0" cy={0} r={8} fill={VISUAL.red} />
            <text x={0} y={-16} textAnchor="middle" fontSize="9" fill={VISUAL.red} fontWeight="600">Event</text>
          </g>
          <g transform="translate(240, 0)">
            <circle cx="0" cy={0} r={8} fill={VISUAL.purple} />
            <text x={0} y={-16} textAnchor="middle" fontSize="9" fill={VISUAL.purple} fontWeight="600">Re-tag</text>
          </g>
          <g transform="translate(360, 0)">
            <circle cx="0" cy={0} r={8} fill={VISUAL.amber} />
            <text x={0} y={-16} textAnchor="middle" fontSize="9" fill={VISUAL.amber} fontWeight="600">Expiry</text>
          </g>
          <g transform="translate(480, 0)">
            <circle cx="0" cy={0} r={8} fill={VISUAL.green} />
            <text x={4} y={-16} textAnchor="start" fontSize="9" fill={VISUAL.green} fontWeight="600">Drift check</text>
          </g>
        </g>

        {/* Strategy cards */}
        <g transform="translate(40, 220)">
          {STALENESS.map((s, i: number) => (
            <g key={s.id} transform={`translate(${i * 150}, 0)`} opacity={i === 0 ? 1 : 0.4} >
              <rect x={i * 150} y={0} width={130} height={110} rx={12} fill={VISUAL.surface} stroke={s.color} strokeWidth={2} />
              <circle cx={65} cy={20} r={18} fill={lerpColor(s.color, VISUAL.paper, 0.85)} />
              <g transform="translate(65, 20)">{ICONS[s.icon as keyof typeof ICONS]}</g>
              <text x={65} y={60} textAnchor="middle" fontFamily="var(--font-display)" fontSize="11" fontWeight="600" fill={s.color}>
                {s.title}
              </text>
              <text x={65} y={78} textAnchor="middle" fontSize="9" fill={VISUAL.inkSoft} style={{whiteSpace: 'pre-wrap'}}>
                {s.detail}
              </text>
            </g>
          ))}
        </g>

        {/* Bottom insight */}
        <g transform="translate(40, 320)">
          <rect x={0} y={0} width={480} height={36} rx={8} fill={lerpColor(VISUAL.green, VISUAL.paper, 0.9)} stroke={VISUAL.green} strokeWidth={1.5} />
          <text x={12} y={14} fontSize="11" fontWeight="500" fill={VISUAL.green}>Revise failure rate is the staleness alarm — stale cases are the ones Revise keeps repairing.</text>
        </g>
      </svg>
    </div>
  );
}