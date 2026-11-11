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

/* ── Hero ── */
.hero-dots {
  background-image: radial-gradient(rgb(22 22 22 / 0.09) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at 70% 40%, black 20%, transparent 70%);
}
.hero-dots-light {
  background-image: radial-gradient(rgb(255 255 255 / 0.25) 1px, transparent 1px);
  background-size: 18px 18px;
}
@keyframes hero-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes hero-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
@keyframes hero-spin { to { transform: rotate(360deg); } }
@keyframes hero-draw { from { stroke-dashoffset: 260; } to { stroke-dashoffset: 0; } }
@keyframes hero-progress { from { width: 0; } to { width: 100%; } }
@keyframes hero-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@keyframes hero-marquee { to { transform: translateX(-50%); } }
@keyframes hero-shine { 0%,60% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(220%) skewX(-20deg); } }

.hero-rise { animation: hero-rise 0.8s cubic-bezier(.2,.7,.2,1) both; }
.hero-float { animation: hero-float 6s ease-in-out infinite; }
.hero-spin { animation: hero-spin 60s linear infinite; }
.hero-draw { stroke-dasharray: 260; animation: hero-draw 1.1s 0.5s ease-out both; }
.hero-progress { animation: hero-progress 3.2s linear forwards; }
.hero-fade { animation: hero-fade 0.4s ease-out both; }
.hero-marquee { animation: hero-marquee 40s linear infinite; }
.hero-marquee:hover { animation-play-state: paused; }
.hero-shine::before {
  content: ""; position: absolute; inset: 0; width: 40%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.25), transparent);
  animation: hero-shine 3.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise, .hero-float, .hero-spin, .hero-draw, .hero-fade, .hero-marquee, .hero-shine::before { animation: none; }
  .hero-progress { animation: none; width: 100%; }
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

