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

:root {
  --background: #fafafa;
  --foreground: #18181b;
  --card: #ffffff;
  --card-foreground: #18181b;
  --popover: #ffffff;
  --popover-foreground: #18181b;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #18181b;
}

body {
  background-color: #fafafa;
  color: #18181b;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* Custom subtle scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d4d4d8;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a1a1aa;
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

