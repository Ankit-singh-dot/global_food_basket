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
  const tokens = content.match(/[a-zA-Z0-9_\-\/\[\]\:\.\%]+/g) || [];
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

/* ── Hero shelf ── */
@keyframes shelf-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes shelf-drop { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
.shelf-in { animation: shelf-in 0.7s cubic-bezier(.2,.7,.2,1) both; }
.shelf-drop { animation: shelf-drop 0.55s cubic-bezier(.3,1.4,.5,1) both; }
.shelf-top {
  background: linear-gradient(to bottom, #ebe4d4, #d3c8b0);
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%);
}
.shelf-rail {
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.14), 0 26px 40px -22px rgb(22 22 22 / 0.6);
  background-image: linear-gradient(to bottom, #232120, #141312);
}
.pack-shadow { filter: drop-shadow(0 8px 10px rgb(22 22 22 / 0.18)); }
.ticket-shadow { box-shadow: 0 1px 0 rgb(0 0 0 / 0.5), 0 0 0 1px rgb(0 0 0 / 0.04); }
@media (prefers-reduced-motion: reduce) {
  .shelf-in, .shelf-drop { animation: none; }
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

