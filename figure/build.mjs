// Case memory as a machine: a punched-ticket sorter that walks the
// discrimination tree and files the solved case back into the drawer.
// Every number shown comes from model.mjs (and ../shared/cases.json).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./vendor/kit/iso-kit.mjs";
import { kitScript } from "./vendor/kit/inline-kit.mjs";
import { DATA, Q, W, SIGMA, walk, bucketOf, hhmm, leaf, best, similarity, distKm } from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const OUT = theme === "light" ? "memory-sorter-light.html" : "memory-sorter.html";

const WIDTH = 690;
const HEIGHT = 480;

// ---- world layout -----------------------------------------------------------
const PLATE = { x: -150, y: -96, w: 300, d: 192, r: 10 };
const TOP = { x: -146, y: -92, w: 292, d: 184, r: 8 };
const GATES = [40, 74, 108, 142]; // closed blade bottoms
const BLADE = { x: -119, y: -34, w: 45, d: 94, r: 2 };
const BLADE_H = 3;
const ANCHOR = { x: -96, y: 54, armW: 30, z: [80, 114, 148, 178] };
const TICKET = { x: -110, y: 8, w: 28, d: 42, r: 2 };
const TICKET_H = 2.6;
const TRAY_TOP = 26;
const SLOT_Z = 206;
const GATE_REST = [43, 77, 111, 145]; // where the ticket rests on each closed gate
const CARDS = [
  { id: "R-0450", x: 56, dist: distKm(DATA.cases[6].dest) },
  { id: "R-0142", x: 70, dist: distKm(DATA.cases[1].dest) },
  { id: "R-0512", x: 84, dist: distKm(DATA.cases[7].dest) },
];
const NEW_CARD = { id: "N-1187", x: 98 };
const DIVIDER = { x: 112, y: -10, w: 3, d: 56, parkX: 78 };
const DRAWER_OUT = 22;
const CARD_LIFT = 16;
const SEL = [
  { x: -140, w: 56, at: 0, n: 5, step: 12.5 }, // zone x-band
  { x: -78, w: 56, at: 0, n: 5, step: 12.5 }, // zone y-band
  { x: -16, w: 56, at: 0, n: 5, step: 12.5 }, // time-of-day bucket
  { x: 46, w: 42, at: 0, n: 3, step: 18 }, // traffic
];
const selX = (s, i) => s.x + 4 + s.step * i;
const LAMP = { x: 104, y: -58 };

const P = k.fitProjection(
  [
    ...k.boxCorners(TOP, 196, 212),
    ...k.boxCorners(PLATE, -5, 9),
    ...k.boxCorners({ x: 50, y: -18, w: 78, d: 76 }, 16, 42).map(([x, y]) => [x, y + DRAWER_OUT, 42]),
    ...k.boxCorners({ x: 100, y: 8, w: 30, d: 46 }, 70, 76),
  ],
  WIDTH,
  HEIGHT,
  { pad: 38, azimuth: 40, elevation: 22 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const fine = (n) => Math.round(n * 100) / 100;
const poly = (points, closed = false) => points.map((p, i) => `${i ? "L" : "M"}${fine(p[0])} ${fine(p[1])}`).join("") + (closed ? "Z" : "");

// A vertical helix around the (cx, cy) axis, split into back and front halves.
// `project` maps a world point to screen so the same function runs at build
// time (iso) and on the live page (iso with the page's own P).
function vSpring(fromZ, toZ, cx, cy, r, turns, project, perTurn = 14) {
  const count = Math.max(1, Math.round(turns * perTurn));
  const back = [];
  const front = [];
  let run = [];
  let near = null;
  for (let i = 0; i <= count; i++) {
    const share = i / count;
    const angle = share * turns * Math.PI * 2;
    const z = fromZ + (toZ - fromZ) * share;
    const point = [cx + r * Math.cos(angle), cy + r * Math.sin(angle), z];
    const facing = k.depthOf([Math.cos(angle), Math.sin(angle), 0], P) > 0;
    const flat = project(point);
    if (near === null) near = facing;
    if (facing !== near) {
      run.push(flat);
      (near ? front : back).push(poly(run));
      run = [];
      near = facing;
    } else run.push(flat);
  }
  run.push(project([cx + r, cy, toZ]));
  (near ? front : back).push(poly(run));
  return { back: back.join(""), front: front.join("") };
}
const projectAt = (p) => k.iso(p, P);

// ---- static parts -----------------------------------------------------------
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, 0, 8, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 7, -4, 4, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -4, 3.6, P, 24), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, 0, 8, P, 10, 1.2), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 6), 8, P, 10), { tone: "lo" }));
  const screws = k.corners(PLATE, 12);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 8, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 8])), { size: 0.5 }));
  const strip = { x: -110, y: PLATE.y + PLATE.d - 16, w: 220, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 8, 0.6, P, 4), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 20, 5, strip.y + 0.8, 8.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  return out.join("");
}

function shell() {
  const out = [];
  const back = { x: -140, y: -86, w: 280, d: 6, r: 2 };
  const left = { x: -140, y: -80, w: 6, d: 166, r: 2 };
  const right = { x: 134, y: -80, w: 6, d: 166, r: 2 };
  const divider = { x: 34, y: -80, w: 6, d: 150, r: 2 };
  const kick = { x: -140, y: 76, w: 170, d: 10, r: 2 };
  out.push(S(k.slabOf(back, 8, 188, P, 6, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -134, y: -80, w: 266, d: 150, r: 3 }, 8, 4, P, 6), { tone: "lo" }));
  out.push(S(k.slabOf(left, 8, 188, P, 6, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf(divider, 8, 188, P, 6, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf(right, 8, 188, P, 6, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf(kick, 8, 18, P, 6, 0.6), { tone: "mid" }));
  const label = { x: -30, y: 84.4, w: 56, d: 2.4, r: 0.6 };
  out.push(S(k.slabOf(label, 12, 8, P, 4), { tone: "lo", crease: "none" }));
  for (const z of [14, 16, 18]) out.push(L(k.segment([-28, 87, z], [24, 87, z], P), { tone: "faint" }));
  out.push(S(k.slabOf(TOP, 196, 8, P, 10, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(TOP, 5), 204, P, 10), { tone: "lo" }));
  for (const [x, y] of k.corners(TOP, 12)) {
    out.push(L(k.ring(x, y, 2.2, 204, P, 16), { tone: "lo" }));
    out.push(D([at([x, y, 204])], { size: 0.45 }));
  }
  return out.join("");
}

function chute() {
  const out = [];
  const left = { x: -122, y: -32, w: 5, d: 92, r: 1.5 };
  const right = { x: -73, y: -32, w: 5, d: 92, r: 1.5 };
  const lip = { x: -122, y: 60, w: 54, d: 5, r: 1 };
  out.push(S(k.slabOf(left, 8, 160, P, 4, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -122, y: -34, w: 46, d: 96, r: 2 }, 12, 14, P, 4, 0.5), { tone: "lo" })); // tray
  out.push(L(k.planOutline(k.insetPlan({ x: -122, y: -34, w: 46, d: 96, r: 2 }, 3), 26, P, 4), { tone: "faint" }));
  // gates and their springs, painted per gate: blade, spring halves, arm, collar
  GATES.forEach((z, i) => {
    const top = z + BLADE_H;
    out.push(
      `<g data-part="gate${i}" transform="${k.translateAlong(P, [0, 0, 0])}">${S(k.slabOf(BLADE, z, BLADE_H, P, 4, 0.5), { tone: "mid", crease: "lo" })}</g>`,
    );
    const spring = vSpring(top, ANCHOR.z[i], ANCHOR.x, ANCHOR.y + 1.5, 2.6, 5, projectAt);
    out.push(
      `<g data-part="spring${i}"><path class="iso-line" data-tone="lo" d="${spring.back}"/><path class="iso-line" data-tone="mid" d="${spring.front}"/></g>`,
    );
    out.push(S(k.slabOf({ x: ANCHOR.x, y: ANCHOR.y - 3.5, w: ANCHOR.armW, d: 7, r: 1 }, ANCHOR.z[i], 2.5, P, 4, 0.4), { tone: "mid" }));
    out.push(S(k.cylinder(ANCHOR.x, ANCHOR.y + 1.5, 3, ANCHOR.z[i], 5, P, 20), { tone: "lo" }));
  });
  out.push(S(k.slabOf(right, 8, 160, P, 4, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf(lip, 8, 22, P, 4, 0.5), { tone: "mid" }));
  // intake slot in the top plate
  out.push(S(k.slabOf({ x: -115, y: -18, w: 33, d: 16, r: 2 }, 198, 6, P, 4), { tone: "faint", crease: "none" }));
  out.push(L(k.planOutline({ x: -117, y: -20, w: 37, d: 20, r: 3 }, 204, P, 4), { tone: "lo" }));
  out.push(S(k.slabOf({ x: -125, y: -28, w: 53, d: 36, r: 4 }, 204, 0.8, P, 6), { tone: "lo", crease: "none" }));
  for (const [x, y] of k.corners({ x: -125, y: -28, w: 53, d: 36 }, 4)) out.push(D([at([x, y, 204.8])], { size: 0.4 }));
  return out.join("");
}

function controls() {
  const out = [];
  SEL.forEach((s, i) => {
    out.push(S(k.slabOf({ x: s.x, y: 60, w: s.w, d: 7, r: 1.5 }, 204, 1, P, 4), { tone: "lo", crease: "none" }));
    const ticks = k.topTicks(s.x + 4, s.x + s.w - 4, s.step, 99, 60.8, 205, [2.6, 3.4], P, "x");
    out.push(L(ticks.minor, { tone: "mid" }));
    out.push(
      `<g data-part="sel${i}" transform="${k.translateAlong(P, [0, 0, 0])}">${S(k.slabOf({ x: selX(s, s.at) - 3.5, y: 58.5, w: 7, d: 10, r: 0.8 }, 205, 2.2, P, 3), { tone: "hi", lit: true })}</g>`,
    );
  });
  return out.join("");
}

function drawerBay() {
  const out = [];
  for (const x of [44, 128]) {
    out.push(S(k.slabOf({ x, y: -76, w: 6, d: 146, r: 1 }, 12, 4, P, 4, 0.4), { tone: "mid" }));
    out.push(S(k.slabOf({ x, y: 66, w: 6, d: 6, r: 1 }, 16, 4, P, 3), { tone: "mid" }));
  }
  return out.join("");
}

function drawer() {
  const out = [];
  out.push(S(k.slabOf({ x: 50, y: -18, w: 78, d: 76, r: 3 }, 16, 3, P, 6, 0.5), { tone: "mid" })); // bottom
  out.push(S(k.slabOf({ x: 50, y: -18, w: 78, d: 4, r: 1.5 }, 16, 16, P, 4, 0.5), { tone: "mid" })); // back
  for (const x of [50, 124]) out.push(S(k.slabOf({ x, y: -14, w: 4, d: 54, r: 1 }, 16, 16, P, 4, 0.4), { tone: "mid" })); // sides
  const cardSvg = (id, x, part) => `
    <g data-part="${part}"${part === "card-N-1187" ? ' opacity="0"' : ""}>
      ${S(k.slabOf({ x, y: 6, w: 6, d: 46, r: 1 }, 16, 28, P, 3, 0.4), { tone: "hi", crease: "lo" })}
      ${L(k.planOutline({ x: x + 1.2, y: 7.2, w: 3.6, d: 43.6, r: 1 }, 44, P, 3), { tone: "faint" })}
      ${k.faceTextSvg(k.sideMatrix([x + 3, 52.2], 30, P, "left"), id, { size: 2.4, tone: "lo", anchor: "middle" })}
    </g>`;
  for (const c of CARDS) out.push(cardSvg(c.id, c.x, "card-" + c.id));
  out.push(cardSvg("N-1187", NEW_CARD.x, "card-N-1187"));
  out.push(
    `<g data-part="divider">${S(k.slabOf({ x: DIVIDER.x, y: DIVIDER.y, w: DIVIDER.w, d: DIVIDER.d, r: 0.5 }, 16, 30, P, 3, 0.4), { tone: "mid", crease: "lo" })}</g>`,
  );
  // drawer front: panel, handle, mounts, engraved branch label
  out.push(S(k.slabOf({ x: 50, y: 52, w: 78, d: 5, r: 2 }, 16, 26, P, 4, 0.5), { tone: "mid" }));
  out.push(S(k.slabOf({ x: 76, y: 56.8, w: 26, d: 3.6, r: 1.2 }, 26, 4, P, 4, 0.4), { tone: "hi" }));
  for (const x of [72, 101]) out.push(S(k.slabOf({ x, y: 55, w: 5, d: 6, r: 1 }, 30, 4, P, 3), { tone: "mid" }));
  const walk0 = walk(Q);
  out.push(k.faceTextSvg(k.sideMatrix([89, 57.2], 21, P, "left"), `x=${walk0.zone.x} · y=${walk0.zone.y} · ${walk0.bucket.id} · ${Q.traffic}`, { size: 2.2, tone: "lo", anchor: "middle" }));
  return out.join("");
}

function lampAndWire() {
  const out = [];
  out.push(S(k.cylinder(LAMP.x, LAMP.y, 5.5, 204, 4, P, 24, 0.6), { tone: "mid" }));
  out.push(`<g data-part="lamp">${S(k.cylinder(LAMP.x, LAMP.y, 3.8, 208, 2.5, P, 20, 0.5), { tone: "hi", lit: true })}</g>`);
  out.push(
    k.wireSvg(at([LAMP.x, LAMP.y, 204]), at([129, 48.5, 16.2]), { via: [at([124, -58, 120]), at([130, 24, 38])], tone: "lo", ends: "both", size: 1.1 }),
  );
  out.push(S(k.slabOf({ x: 126, y: 44, w: 8, d: 10, r: 1 }, 12, 4, P, 3), { tone: "mid" }));
  out.push(D([[128, 48], [132, 48]].map(([x, y]) => at([x, y, 16])), { size: 0.45 }));
  return out.join("");
}

// ---- moving ticket ----------------------------------------------------------
function ticket() {
  const out = [];
  out.push(S(k.slabOf(TICKET, 0, TICKET_H, P, 4, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(TICKET, 2.5), TICKET_H, P, 4), { tone: "faint" }));
  for (const y of [12, 16, 20]) out.push(L(k.lineOnTop([TICKET.x + 3, y], [TICKET.x + TICKET.w - 3, y], TICKET_H, P), { tone: "lo" }));
  out.push(D(k.dotGrid(TICKET.x + 5, 26, 5, 3, 4, TICKET_H, P), { size: 0.55 }));
  out.push(k.faceTextSvg(k.topMatrix([TICKET.x + TICKET.w / 2, TICKET.y + 6], TICKET_H, P), "N · 1.40,4.70 · 08:12", { size: 1.9, tone: "lo", anchor: "middle" }));
  return `<g data-part="ticket" opacity="0">${out.join("")}</g>`;
}

// ---- figure -----------------------------------------------------------------
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A card-sorting cabinet that answers a new delivery order from its case memory. An order ticket drops through four gates that read the index attributes — destination x-band, y-band, time-of-day bucket and traffic level. The ticket lands in the drawer of the branch it selects, and the best-matching case card rises. Retaining the solved case files it back into the drawer, and the drawer splits when the leaf passes its case cap.",
  body: [
    plate(),
    shell(),
    chute(),
    controls(),
    drawerBay(),
    `<g data-part="drawer" transform="${k.translateAlong(P, [0, 0, 0])}">${drawer()}</g>`,
    ticket(),
    lampAndWire(),
  ].join(""),
});

// ---- live ------------------------------------------------------------------
const live = `
const P = ${JSON.stringify(P)};
const GATES = ${JSON.stringify(GATES)};
const BLADE_H = ${BLADE_H};
const ANCHOR_Z = ${JSON.stringify(ANCHOR.z)};
const ANCHOR = { x: ${ANCHOR.x}, y: ${ANCHOR.y + 1.5} };
const GATE_REST = ${JSON.stringify(GATE_REST)};
const TICKET_H = ${TICKET_H};
const TRAY_TOP = ${TRAY_TOP};
const SLOT_Z = ${SLOT_Z};
const SEL = ${JSON.stringify(SEL.map((s) => ({ x0: selX(s, 0), step: s.step, at: s.at })))};
const CARD_LIFT = ${CARD_LIFT};
const DRAWER_OUT = ${DRAWER_OUT};
const DIVIDER = { rest: ${DIVIDER.x}, park: ${DIVIDER.parkX}, y: ${DIVIDER.y} };
const BEST_CARD = "${best.case.id}";
const walk = ${JSON.stringify(walk(Q).path.map((p) => p.test))};
const vSpring = ${vSpring.toString().replace(/k\.depthOf/g, "depthOf").replace(/projectAt\(/g, "((p) => iso(p, P))")};
const projectAt = (p) => iso(p, P);
const springSvg = (fromZ, toZ, cx, cy, r, turns) => vSpring(fromZ, toZ, cx, cy, r, turns, projectAt);
const poly = ${poly.toString()};

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const parts = {};
for (const el of svg.querySelectorAll("[data-part]")) parts[el.dataset.part] = el;
const readout = document.querySelector("[data-readout]");
readout.setAttribute("aria-live", "polite");
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

const gateEls = GATES.map((_, i) => parts["gate" + i]);
const springEls = GATES.map((_, i) => parts["spring" + i]);
const selEls = SEL.map((_, i) => parts["sel" + i]);
const ticketEl = parts.ticket;
const drawerEl = parts.drawer;
const dividerEl = parts.divider;
const newCardEl = parts["card-N-1187"];
const bestEl = parts["card-" + BEST_CARD];
const lampEl = parts.lamp;

const state = {
  ticketZ: SLOT_Z, ticketA: 0,
  g: GATES.map(() => 0),
  sel: SEL.map((s) => 0),
  card: 0,
  drawer: 0,
  dividerZ: 0, dividerX: 0,
  newZ: 16, newA: 0,
  lamp: 0,
};
const target = { ...state, g: [...state.g], sel: [...state.sel] };

// insert timeline: at seconds, set values
const INSERT = [
  [0.0, { ticketA: 1, ticketZ: SLOT_Z }],
  [0.55, { ticketZ: GATE_REST[0], g0: 30 }],
  [0.65, { sel0: 1 }],
  [1.0, { ticketZ: GATE_REST[1] }],
  [1.45, { g0: 0, g1: 30 }],
  [1.55, { sel1: 3 }],
  [1.9, { ticketZ: GATE_REST[2] }],
  [2.35, { g1: 0, g2: 30 }],
  [2.45, { sel2: 1 }],
  [2.8, { ticketZ: GATE_REST[3] }],
  [3.25, { g2: 0, g3: 30 }],
  [3.35, { sel3: 1 }],
  [3.7, { ticketZ: TRAY_TOP }],
  [4.15, { g3: 0 }],
  [4.45, { card: CARD_LIFT, lamp: 1 }],
  [4.9, { lamp: 0 }],
];
const RETAIN = [
  [0.0, { drawer: DRAWER_OUT }],
  [0.9, { dividerZ: 30 }],
  [1.5, { dividerX: DIVIDER.park - DIVIDER.rest }],
  [2.3, { dividerZ: 0 }],
  [2.4, { newA: 1, newZ: SLOT_Z }],
  [3.6, { newZ: 16 }],
  [4.2, { drawer: 0 }],
];
const MARK_INSERT = [
  [0.0, "order N inserted · reading the ticket"],
  [0.6, "gate 1 · " + walk[0]],
  [1.5, "gate 2 · " + walk[1]],
  [2.4, "gate 3 · " + walk[2]],
  [3.35, "gate 4 · " + walk[3]],
  [4.15, "leaf: " + ${JSON.stringify(leaf.map((l) => l.case.id).join(", "))} + " · 3 cases"],
  [4.6, "retrieved " + BEST_CARD + " · sim " + ${best.sim.toFixed(3)}],
];
const MARK_RETAIN = [
  [0.0, "drawer out · leaf at cap 3"],
  [2.4, "filing N-1187 into the drawer"],
  [4.3, "retained · split ≤ 4.8 km / > 4.8 km"],
];

let mode = null; // "insert" | "retain"
let t = 0;
let frame = 0;
let last = 0;
let visible = false;
let idle = 0;
let mark = -1;

const setOf = (key, value) => {
  if (key.startsWith("g")) target.g[Number(key.slice(1))] = value;
  else if (key.startsWith("sel")) target.sel[Number(key.slice(3))] = value;
  else target[key] = value;
};

function slideOf(i) {
  const s = SEL[i];
  const at = state.sel[i] || s.at;
  return s.step * (at - s.at);
}

function draw() {
  for (let i = 0; i < GATES.length; i++) {
    gateEls[i].setAttribute("transform", translateAlong(P, [0, 0, state.g[i]]));
    const s = springSvg(GATES[i] + BLADE_H + state.g[i], ANCHOR_Z[i], ANCHOR.x, ANCHOR.y, 2.6, 5);
    springEls[i].innerHTML = '<path class="iso-line" data-tone="lo" d="' + s.back + '"/><path class="iso-line" data-tone="mid" d="' + s.front + '"/>';
    selEls[i] && selEls[i].setAttribute("transform", translateAlong(P, [slideOf(i), 0, 0]));
  }
  ticketEl.setAttribute("transform", translateAlong(P, [0, 0, state.ticketZ]));
  ticketEl.setAttribute("opacity", state.ticketA.toFixed(3));
  bestEl.setAttribute("transform", translateAlong(P, [0, 0, state.card]));
  drawerEl.setAttribute("transform", translateAlong(P, [0, state.drawer, 0]));
  dividerEl.setAttribute("transform", translateAlong(P, [state.dividerX, 0, state.dividerZ]));
  newCardEl.setAttribute("transform", translateAlong(P, [0, 0, state.newZ]));
  newCardEl.setAttribute("opacity", state.newA.toFixed(3));
  lampEl.setAttribute("opacity", (1 - 0.5 * state.lamp).toFixed(3));
}

function follow(dt) {
  const k = 1 - Math.exp(-Math.min(dt, 0.05) / 0.24);
  for (const key of Object.keys(state)) {
    if (key === "g" || key === "sel") continue;
    if (Math.abs(target[key] - state[key]) > 0.01) state[key] += (target[key] - state[key]) * k;
  }
  for (let i = 0; i < GATES.length; i++) if (Math.abs(target.g[i] - state.g[i]) > 0.01) state.g[i] += (target.g[i] - state.g[i]) * k;
  for (let i = 0; i < SEL.length; i++) if (Math.abs(target.sel[i] - state.sel[i]) > 0.01) state.sel[i] += (target.sel[i] - state.sel[i]) * k;
  return false;
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (mode) {
    t += dt;
    const track = mode === "insert" ? INSERT : RETAIN;
    const marks = mode === "insert" ? MARK_INSERT : MARK_RETAIN;
    for (const row of track) if (row[0] <= t) for (const [key, value] of Object.entries(row[1])) setOf(key, value);
    for (let i = marks.length - 1; i >= 0; i--) if (marks[i][0] <= t && i > mark) { mark = i; say(marks[i][1]); break; }
    if (track[track.length - 1][0] + 0.7 < t) { mode = null; t = 0; }
  } else if (idle > 0) {
    idle -= dt;
    if (idle <= 0) start("insert");
  }
  follow(dt);
  draw();
  frame = visible && mode ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const say = (text) => { if (readout.textContent !== text) readout.textContent = text; };

function start(which) {
  if (mode) return;
  mode = which;
  t = 0;
  mark = -1;
  run();
}
function reset() {
  mode = null;
  t = 0;
  mark = -1;
  Object.assign(target, { ticketZ: SLOT_Z, ticketA: 0, g: GATES.map(() => 0), sel: SEL.map(() => 0), card: 0, cardA: 0, drawer: 0, dividerZ: 0, dividerX: 0, newZ: 16, newA: 0, lamp: 0 });
  say("memory idle · 40,000 cases · 3 in this leaf");
  run();
}
for (const button of document.querySelectorAll("[data-act]")) {
  button.addEventListener("click", () => {
    idle = 0;
    if (button.dataset.act === "reset") reset();
    else start(button.dataset.act);
  });
}
stage.addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); start("insert"); }
  if (event.key.toLowerCase() === "r") { event.preventDefault(); start("retain"); }
  if (event.key === "0") { event.preventDefault(); reset(); }
});
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
say("memory idle · 40,000 cases · 3 in this leaf");
if (still) { reset(); } else { idle = 6; }
draw();
`;

const controlsHtml = `
<div class="mem-controls" role="group" aria-label="Case memory controls">
  <button type="button" data-act="insert">Insert order N</button>
  <button type="button" data-act="retain">Retain N-1187</button>
  <button type="button" data-act="reset">Reset</button>
</div>
<style>
.mem-controls{display:flex;gap:8px;justify-content:center;margin:2px 0 4px}
.mem-controls button{font:500 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.02em;padding:7px 12px;border-radius:7px;border:1px solid var(--anatomy-lo);background:var(--anatomy-card);color:var(--anatomy-text);cursor:pointer}
.mem-controls button:hover{border-color:var(--anatomy-mid);color:var(--anatomy-strong)}
.mem-controls button:focus-visible{outline:2px solid var(--anatomy-blue);outline-offset:2px}
@media (prefers-reduced-motion: reduce){.mem-controls button{transition:none}}
</style>`;

const body = k.plateHtml({
  fig: "Fig 2",
  title: "Case memory sorter",
  hint: "Insert, retain, reset · keys: enter / r / 0",
  readout: "memory idle · 40,000 cases · 3 in this leaf",
  keys: [
    { mark: "lit", label: "Selector sliders and the retrieved card: what moves" },
    { mark: "raised", label: "Standing case cards in the branch drawer" },
  ],
  caption:
    "The discrimination tree as a machine. A selector is set for each index attribute in turn; the matching gate opens; the ticket drops to the drawer for branch x=1 · y=4 · morning peak · moderate. R-0512 (similarity 0.998) rises as the retrieved case. Retaining N-1187 files a fourth card, over the leaf cap of three, so the drawer splits on distance band ≤ 4.8 km / > 4.8 km.",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Case memory sorter: Enter inserts the order, R retains the solved case, 0 resets">${svg}</div>${controlsHtml}`,
});

writeFileSync(join(HERE, OUT), k.pageHtml({ title: "Case memory sorter", theme, body, script: kitScript() + live, width: 720 }));
console.log("wrote", OUT);
