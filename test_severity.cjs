const fs = require('fs');
const content = fs.readFileSync('src/pages/AttackLibrary.jsx', 'utf8');

const regex = /severity:\s*(['"`])(.*?)\1[\s\S]*?misconfig:\s*(['"`])(.*?)\3/g;
let match;
const results = [];
while ((match = regex.exec(content)) !== null) {
  results.push({ severity: match[2], misconfig: match[4] });
}

console.log(JSON.stringify(results, null, 2));
