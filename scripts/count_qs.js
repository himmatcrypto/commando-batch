const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));

let totalQs = 0;
const sectionsCount = {};
db.tests.forEach(t => {
  (t.questions || []).forEach(q => {
    totalQs++;
    sectionsCount[q.section] = (sectionsCount[q.section] || 0) + 1;
  });
});

console.log('Total questions in database.json:', totalQs);
console.log('By section:', sectionsCount);
