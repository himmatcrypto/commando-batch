const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));

console.log('Total tests in database:', db.tests.length);
db.tests.forEach((t, i) => {
  console.log(`${i + 1}. [${t.id}] ${t.title}`);
  console.log(`   Force: ${t.force || 'None'} | Category: ${t.category} | Questions: ${(t.questions || []).length} | Paid: ${t.isPaid || false} | Duration: ${t.durationMinutes}m`);
});

// Check structure of a sample question
if (db.tests[0] && db.tests[0].questions && db.tests[0].questions[0]) {
  console.log('\nSample Question structure:');
  console.log(JSON.stringify(db.tests[0].questions[0], null, 2));
}
