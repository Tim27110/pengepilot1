const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const aPath = path.join(root, 'index.html');
const bPath = path.join(root, 'public', 'legacy', 'index.html');

try {
  const a = fs.readFileSync(aPath, 'utf8');
  const b = fs.readFileSync(bPath, 'utf8');
  if (a === b) {
    console.log('OK: legacy copy is identical to root index.html');
    process.exit(0);
  } else {
    console.error('ERROR: legacy copy differs from root index.html');
    const la = a.split('\n');
    const lb = b.split('\n');
    for (let i = 0; i < Math.max(la.length, lb.length); i++) {
      if (la[i] !== lb[i]) {
        console.error('First difference at line', i+1);
        console.error('root :', la[i]);
        console.error('legacy:', lb[i]);
        break;
      }
    }
    process.exit(2);
  }
} catch (err) {
  console.error('ERROR: Could not read files:', err.message);
  process.exit(3);
}
