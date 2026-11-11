const { compile } = require('@tailwindcss/node');
const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(full);
    }
  });
  return results;
}

const files = getFiles(path.join(__dirname, '../app'));
const candidates = new Set();

files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf-8');
  const tokens = content.match(/[a-zA-Z0-9_\-\/\[\]\:\.\%#\(\),]+/g) || [];
  tokens.forEach((t) => {
    if (t.length > 1 && !t.includes('{') && !t.includes('}')) {
      candidates.add(t);
    }
  });
});

async function run() {
  const baseCss = `
@import "tailwindcss";

@theme {
  --font-sans: var(--font-outfit), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-script: var(--font-dancing), "Brush Script MT", cursive;

  --color-ink: #161616;
  --color-cream: #faf7f0;
  --color-sand: #f2ede2;
  --color-line: #e8e1d3;

  --color-leaf-50: #f2f8ec;
  --color-leaf-100: #e2f0d4;
  --color-leaf-200: #c6e2a8;
  --color-leaf-300: #a2cf76;
  --color-leaf-400: #7fbb4c;
  --color-leaf-500: #63a535;
  --color-leaf-600: #4d8a27;
  --color-leaf-700: #3d6d21;
  --color-leaf-800: #33571f;
  --color-leaf-900: #2b491d;

  --shadow-soft: 0 1px 2px rgb(22 22 22 / 0.04), 0 10px 30px -14px rgb(22 22 22 / 0.18);
  --shadow-lift: 0 2px 4px rgb(22 22 22 / 0.05), 0 22px 44px -18px rgb(22 22 22 / 0.28);
}

body {
  background-color: #faf7f0;
  color: #161616;
  font-family: var(--font-sans);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "tnum" 0;
}

.tabular {
  font-variant-numeric: tabular-nums;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #ddd5c4;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #c4b9a3;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  scrollbar-width: none;
}

/* ── Hero slider ── */
.hero-frame { height: 880px; }
@media (min-width: 640px) { .hero-frame { height: 980px; } }
@media (min-width: 1024px) { .hero-frame { height: min(calc(100vh - 136px), 740px); min-height: 620px; } }
.hero-type-shadow { text-shadow: 0 3px 0 rgb(22 22 22 / 0.14); }
.hero-pack-shadow { filter: drop-shadow(0 22px 22px rgb(0 0 0 / 0.35)); }
.globe-spin { transform-origin: 200px 200px; animation: hero-spin 90s linear infinite; }
.stamp-spin { animation: hero-spin 24s linear infinite; }
.slide-progress { animation-name: slide-progress; animation-timing-function: linear; animation-fill-mode: forwards; }
@keyframes hero-spin { to { transform: rotate(360deg); } }
@keyframes slide-progress { from { width: 0; } to { width: 100%; } }
@media (prefers-reduced-motion: reduce) {
  .globe-spin, .stamp-spin, .slide-progress { animation: none; }
}
`;

  const compiled = await compile(baseCss, {
    base: path.join(__dirname, '..'),
    onDependency: () => {},
  });

  const css = compiled.build(Array.from(candidates));
  fs.writeFileSync(path.join(__dirname, '../app/globals.css'), css);
  console.log('✓ Successfully compiled Tailwind CSS into app/globals.css (' + (css.length / 1024).toFixed(1) + ' KB)');
}

run().catch((err) => {
  console.error('Error compiling Tailwind CSS:', err);
  process.exit(1);
});

