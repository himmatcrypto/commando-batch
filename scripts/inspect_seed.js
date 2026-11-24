const { getSeedData } = require('../server/seedData');
const data = getSeedData();
console.log('defaultTests count:', data.defaultTests.length);
data.defaultTests.forEach((t, i) => {
  console.log(`${i + 1}. [${t.id}] ${t.title} - Qs: ${(t.questions || []).length}`);
});
