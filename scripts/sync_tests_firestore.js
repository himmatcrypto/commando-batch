/**
 * Syncs mock test definitions (data/database.json -> tests[]) to Cloud Firestore
 * without overwriting live users, attempts, enquiries, or security settings.
 */

const fs = require('fs');
const path = require('path');
const firebase = require('../server/firebase');

async function syncTests() {
  const status = firebase.initFirebase();
  if (!status.connected) {
    throw new Error(`Firebase not connected: ${status.reason || status.error || 'missing credentials'}`);
  }

  const dbPath = path.join(__dirname, '..', 'data', 'database.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const tests = data.tests || [];

  const fsDb = firebase.getFirestore();
  let uploaded = 0;

  for (let i = 0; i < tests.length; i += 400) {
    const batch = fsDb.batch();
    const slice = tests.slice(i, i + 400);
    slice.forEach((test) => {
      if (test && test.id) {
        const ref = fsDb.collection('tests').doc(String(test.id));
        batch.set(ref, test);
        uploaded++;
      }
    });
    await batch.commit();
  }

  console.log(`✓ Synced ${uploaded} mock tests to Cloud Firestore (project: ${status.projectId}).`);
}

syncTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Firestore test sync failed:', err.message);
    process.exit(1);
  });
