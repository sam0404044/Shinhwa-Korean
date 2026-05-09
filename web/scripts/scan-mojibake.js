const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const suspiciousPattern = /[�蟡暺鞈銝摮撘瘣閰蝡隤頠蝝皜餃Ｗ嚗蝬雿霈摰憿撟頛芣]/u;
const scanExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
]);
const ignoredDirs = new Set([
  '.git',
  '.next',
  'dist',
  'node_modules',
  'out',
]);
const ignoredFiles = new Set([
  path.normalize('scripts/scan-mojibake.js'),
]);

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
      continue;
    }

    if (entry.isFile() && scanExtensions.has(path.extname(entry.name).toLowerCase())) {
      const relative = path.relative(root, fullPath);
      if (!ignoredFiles.has(relative)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

const findings = [];

for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  text.split(/\r?\n/).forEach((line, index) => {
    if (suspiciousPattern.test(line)) {
      findings.push({
        file: path.relative(root, file).replace(/\\/g, '/'),
        line: index + 1,
        text: line.trim(),
      });
    }
  });
}

if (findings.length > 0) {
  console.error('Found possible mojibake text. Fix these before pushing:');
  for (const item of findings.slice(0, 80)) {
    console.error(`${item.file}:${item.line} ${item.text}`);
  }
  if (findings.length > 80) {
    console.error(`...and ${findings.length - 80} more.`);
  }
  process.exit(1);
}

console.log('No mojibake patterns found.');
