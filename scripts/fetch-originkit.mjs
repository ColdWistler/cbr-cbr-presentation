// Extracts Originkit component source from the page's RSC payload and writes
// it into src/components/originkit/<Name>.tsx. The payload embeds the preset's
// TypeScript after a "// Originkit preset" header; \r\n and \" are escaped.
import { writeFileSync, mkdirSync } from "node:fs";

const COMPONENTS = ["dash-cursor", "weight-hover", "interactive-grid", "frost-glass-card"];
const OUT = "src/components/originkit";
mkdirSync(OUT, { recursive: true });

function extract(payload) {
  const start = payload.indexOf("// Originkit preset");
  if (start < 0) throw new Error("no preset marker");
  // The flight row that follows starts with `<id>:T<len>,` at the beginning of a line.
  const rest = payload.slice(start);
  const endMatch = /\n[0-9a-f]+:T[0-9a-f]+,/.exec(rest);
  const slice = endMatch ? rest.slice(0, endMatch.index) : rest;
  return slice
    .replace(/\\r\\n/g, "\n") // payload's raw line breaks
    .replace(/\\\\n/g, "\\n") // a literal \n inside a source string literal
    .replace(/\\"/g, '"')
    .replace(/\r\n/g, "\n") // the payload mixes CRLF and LF across components
    .replace(/\r/g, "\n");
}

for (const name of COMPONENTS) {
  const res = await fetch(`https://www.originkit.dev/components/${name}`, {
    headers: { RSC: "1", "User-Agent": "Mozilla/5.0" },
  });
  const payload = await res.text();
  let code = extract(payload);

  // Deck adaptations, applied after every fetch so the script stays the
  // single way to (re)produce these files:
  // 1. weight-hover ships against framer-motion; this project installs the
  //    successor package `motion`, which exports the same three symbols.
  if (name === "weight-hover") {
    code = code.replace('} from "framer-motion"', '} from "motion/react"');
  }
  // 2. dash-cursor hides the native pointer inside its frame. The deck is
  //    full of links and buttons, so keep the pointer visible.
  if (name === "dash-cursor") {
    code = code.replace(
      `    const previousCursor = document.documentElement.style.cursor;
    let cursorHidden = false;
    const hideNativeCursor = (hide: boolean) => {
      if (hide === cursorHidden) return;
      cursorHidden = hide;
      document.documentElement.style.cursor = hide ? "none" : previousCursor;
    };`,
      `    const hideNativeCursor = (_hide: boolean) => {};`,
    );
  }
  // 3. weight-hover's Framer-era prop types don't line up with motion's
  //    AnimationOptions, and it declares two unused tables. Loosen the two
  //    spots the project actually types against.
  if (name === "weight-hover") {
    code = code.replace(
      /const WEIGHT_OPTIONS = \[100[\s\S]*?\n\]\n/,
      "// (Framer control-page tables removed: unused in this build)\n",
    )
    code = code.replace(
      `    props = { ...COMPONENT_DEFAULTS, ...props }
    const {`,
      `    const p = { ...COMPONENT_DEFAULTS, ...props } as Props
    const {`,
    )
    code = code.replace(
      `        color,
        onClick,
        style,
    } = props`,
      `        color,
        onClick,
        style,
    } = p`,
    )
    code = code.replace(
      "function __OriginkitBase_VariableFontHoverByLetter(props: Props) {",
      "function __OriginkitBase_VariableFontHoverByLetter(props: Partial<Props>) {",
    )
  }
  // 4. frost-glass-card types its Framer prop controls as plain strings, which
  //    React's CSSProperties rejects (textAlign) and motion's AnimationOptions
  //    too (transition). Type them against the real unions.
  if (name === "frost-glass-card") {
    code = code.replace(
      'import { animate } from "motion/react"',
      'import { animate, type AnimationOptions } from "motion/react"',
    )
    code = code.replace("    textAlign?: string", '    textAlign?: React.CSSProperties["textAlign"]')
    code = code.replace(
      "            const t = instant ? { duration: 0 } : transition",
      "            const t = (instant ? { duration: 0 } : transition) as AnimationOptions",
    )
    code = code.replace("const SIZE_MIN = 40\nconst SIZE_MAX = 800\n", "")
  }
  const file = `${OUT}/${name}.tsx`;
  writeFileSync(file, code);
  console.log(file, code.length, "bytes", code.split("\n").length, "lines");
}
