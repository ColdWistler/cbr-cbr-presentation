// Visual constants and helpers — single source for the deck's visual language
export const VISUAL = {
  // Color palette (paper theme)
  paper: '#f7f3ea',
  surface: '#fffdf8',
  ink: '#211f1e',
  inkSoft: '#57534e',
  hairline: '#e2d9c6',

  // Section accents
  teal: '#0f766e',
  red: '#b3261e',
  blue: '#1d4ed8',
  purple: '#6d28d9',
  amber: '#b45309',
  green: '#15803d',

  // Semantic colors
  success: '#15803d',
  warning: '#b45309',
  danger: '#b3261e',
  info: '#1d4ed8',

  // Chart colors per section
  chart: {
    teal: ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
    red: ['#b3261e', '#ef4444', '#f87171', '#fca5a5', '#fecaca'],
    blue: ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    purple: ['#6d28d9', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    amber: ['#b45309', '#f59e0b', '#fbbf24', '#fde68a', '#fef3c7'],
    green: ['#15803d', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'],
  },
} as const;

// Easing curves
export const EASE = {
  spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
  snappy: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Stagger timing
export const stagger = (index: number, base = 60) => `${index * base}ms`;

// Viewport-aware sizing
export const clamp = (min: number, max: number, vw: number) =>
  `clamp(${min}px, ${vw}vw, ${max}px)`;

// Reduced motion media query
export const prefersReducedMotion = '(prefers-reduced-motion: reduce)';

// SVG namespace
export const SVG_NS = 'http://www.w3.org/2000/svg';

// Create SVG element with attributes
export function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  ...children: (SVGElement | string)[]
): SVGElement {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  children.forEach((c) => el.append(c instanceof SVGElement ? c : document.createTextNode(c)));
  return el;
}

// Polar to cartesian
export function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Interpolate color
export function lerpColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return a;
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const b_ = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r},${g},${b_})`;
}

function hexToRgb(hex: string) {
  const m = hex.replace('#', '').match(/.{2}/g);
  return m ? { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) } : null;
}