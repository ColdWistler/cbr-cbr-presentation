import { useEffect, useRef, useState } from 'react';
import { VISUAL, lerpColor, prefersReducedMotion } from '../../lib/visuals';


const ACCENT = VISUAL.red;

interface FlowStep {
  label: string;
  value: string;
  note: string;
  icon: 'package' | 'archive' | 'clock' | 'arrow';
}

const STEPS: FlowStep[] = [
  { label: 'New orders', value: '12,000 / day', note: 'each planned from scratch', icon: 'package' },
  { label: 'Archive', value: '40,000+ routes', note: 'already driven & solved', icon: 'archive' },
  { label: 'Re-plan time', value: '8–40 seconds', note: 'before first parcel moves', icon: 'clock' },
];

const ICONS = {
  package: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="24" height="26" rx="2" />
      <path d="M20 2v26 M8 12h24" />
    </g>
  ),
  archive: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="32" height="20" rx="2" />
      <path d="M4 14h32 M12 8v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <circle cx="20" cy="18" r="3" />
    </g>
  ),
  clock: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="16" />
      <path d="M20 20v-8 M20 20h8" />
    </g>
  ),
  arrow: (
    <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20h24 M24 12l8 8-8 8" />
    </g>
  ),
};

export default function ProblemFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<number[]>([]);
  const reduced = prefersReducedMotion;

  useEffect(() => {
    if (reduced) {
      setVisible([0, 1, 2, 3]);
      return;
    }
    const timer = setInterval(() => {
      setVisible((prev) => {
        if (prev.length >= 4) return prev;
        return [...prev, prev.length];
      });
    }, 400);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ '--accent': ACCENT }}
      role="img"
      aria-label="Problem flow: 12,000 orders per day enter the archive of 40,000 routes, each re-planned from scratch in 8–40 seconds"
    >
      <svg
        className="w-full h-auto max-w-[900px] mx-auto"
        viewBox="0 0 900 280"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={VISUAL.hairline} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="900" height="280" fill="url(#grid)" opacity="0.3" />

        {/* Flow arrows between steps */}
        {[0, 1].map((i) => (
          <g key={`arrow-${i}`} opacity={visible.includes(i + 1) ? 1 : 0} transition="opacity 0.4s ease">
            <path
              d={`M${280 + i * 290} 140 Q${330 + i * 290} 140 ${330 + i * 290} 140`}
              stroke={ACCENT}
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 6"
              strokeLinecap="round"
            >
              {visible.includes(i + 1) && !reduced && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="50"
                  to="0"
                  dur="0.6s"
                  begin={`${i * 0.4}s`}
                  fill="freeze"
                />
              )}
            </path>
            <polygon
              points={`${375 + i * 290},140 ${360 + i * 290},132 ${360 + i * 290},148`}
              fill={ACCENT}
              opacity={visible.includes(i + 1) ? 1 : 0}
            />
          </g>
        ))}

        {/* Step cards */}
        {STEPS.map((step, i) => {
          const x = 50 + i * 290;
          const y = 60;
          const show = visible.includes(i);
          const showNote = visible.includes(i + 1);

          return (
            <g key={step.label} transform={`translate(${x}, ${y})`} opacity={show ? 1 : 0}>
              {show && !reduced && (
                <animate
                  attributeName="opacity"
                  from="0"
                  to="1"
                  dur="0.4s"
                  begin={`${i * 0.4}s`}
                  fill="freeze"
                />
              )}

              {/* Card background */}
              <rect
                x="0"
                y="0"
                width="220"
                height="160"
                rx="16"
                fill={VISUAL.surface}
                stroke={VISUAL.hairline}
                strokeWidth="1"
                filter="drop-shadow(0 4px 12px rgba(33,31,30,0.08))"
              />

              {/* Accent bar at top */}
              <rect
                x="0"
                y="0"
                width="220"
                height="4"
                rx="16 16 0 0"
                fill={ACCENT}
              />

              {/* Icon */}
              <g transform="translate(110, 40)">
                <circle r="28" fill={lerpColor(ACCENT, VISUAL.paper, 0.85)} />
                {ICONS[step.icon]}
              </g>

              {/* Label */}
              <text
                x="110"
                y="92"
                textAnchor="middle"
                fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)"
                fontSize="14"
                fontWeight="600"
                fill={VISUAL.ink}
              >
                {step.label}
              </text>

              {/* Value */}
              <text
                x="110"
                y="114"
                textAnchor="middle"
                fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                fontSize="22"
                fontWeight="700"
                fill={ACCENT}
              >
                {step.value}
              </text>

              {/* Note */}
              <text
                x="110"
                y="140"
                textAnchor="middle"
                fontSize="11"
                fill={VISUAL.inkSoft}
                opacity={showNote ? 1 : 0}
              >
                {showNote && !reduced && (
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin={`${(i + 1) * 0.4}s`} fill="freeze" />
                )}
                {step.note}
              </text>
            </g>
          );
        })}

        {/* Final insight box */}
        <g
          transform="translate(50, 240)"
          opacity={visible.includes(3) ? 1 : 0}
        >
          {visible.includes(3) && !reduced && (
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.4s"
              begin="1.6s"
              fill="freeze"
            />
          )}
          <rect
            x="0"
            y="0"
            width="800"
            height="36"
            rx="10"
            fill={lerpColor(ACCENT, VISUAL.paper, 0.92)}
            stroke={ACCENT}
            strokeWidth="1.5"
          />
          <text
            x="400"
            y="23"
            textAnchor="middle"
            fontFamily="var(--font-sans, Inter, sans-serif)"
            fontSize="13"
            fontWeight="500"
            fill={ACCENT}
          >
            The archive is a liability only because nothing in it can be found in time.
          </text>
        </g>
      </svg>

      <style>{}</style>
    </div>
  );
}