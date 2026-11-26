const fs = require('fs');
const path = require('path');
const firebase = require('./firebase');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = {
  users: [],
  tests: [],
  attempts: [],
  enquiries: [],
  orders: [],
  settings: {
    siteName: 'Commando Batch - Defense & Competitive Exam Portal',
    announcement: 'CRPF & CISF LDCE 2026 and SSC CPO SI Mock Tests are LIVE! Realistic TCS iON CBT Mode Activated.'
  }
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading database, initializing fresh:', err);
  }
}

function saveDatabase() {
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // In Cloud Functions, source filesystem is read-only; fallback to /tmp
    if (err.code === 'EROFS' || err.code === 'EACCES') {
      try {
        fs.writeFileSync('/tmp/database.json', JSON.stringify(db, null, 2), 'utf8');
      } catch (e) {}
    } else {
      console.error('Error saving database:', err);
    }
  }
}

// Non-blocking write-through to Cloud Firestore when connected
function syncDocToFirestore(collectionName, docId, data) {
  const fsDb = firebase.getFirestore();
  if (!fsDb || !docId) return;
  fsDb.collection(collectionName).doc(String(docId)).set(JSON.parse(JSON.stringify(data)), { merge: true })
    .catch(err => console.warn(`Firestore sync error (${collectionName}/${docId}):`, err.message));
}

function deleteDocFromFirestore(collectionName, docId) {
  const fsDb = firebase.getFirestore();
  if (!fsDb || !docId) return;
  fsDb.collection(collectionName).doc(String(docId)).delete()
    .catch(err => console.warn(`Firestore delete error (${collectionName}/${docId}):`, err.message));
}

async function syncAllToFirestore() {
  const fsDb = firebase.getFirestore();
  if (!fsDb) {
    throw new Error('Firebase Firestore is not connected. Add firebase-service-account.json in project root.');
  }

  const collections = [
    { name: 'users', items: db.users || [] },
    { name: 'tests', items: db.tests || [] },
    { name: 'attempts', items: db.attempts || [] },
    { name: 'enquiries', items: db.enquiries || [] }
  ];

  let totalSynced = 0;
  for (const col of collections) {
    // Firestore batch limit is 500 writes per batch
    for (let i = 0; i < col.items.length; i += 400) {
      const batch = fsDb.batch();
      const slice = col.items.slice(i, i + 400);
      slice.forEach(item => {
        if (item && item.id) {
          const ref = fsDb.collection(col.name).doc(String(item.id));
          batch.set(ref, JSON.parse(JSON.stringify(item)));
          totalSynced++;
        }
      });
      await batch.commit();
    }
  }
  return { totalSynced };
}

async function initFirebaseSync() {
  const status = firebase.initFirebase();
  if (!status.connected) return status;

  const fsDb = firebase.getFirestore();
  try {
    const testsSnap = await fsDb.collection('tests').limit(1).get();
    if (testsSnap.empty) {
      console.log('🔥 Firestore is empty — migrating local database to Cloud Firestore...');
      const res = await syncAllToFirestore();
      console.log(`🔥 Migrated ${res.totalSynced} records to Cloud Firestore!`);
    } else {
    const [usersSnap, allTestsSnap, attemptsSnap, enquiriesSnap, ordersSnap] = await Promise.all([
      fsDb.collection('users').get(),
      fsDb.collection('tests').get(),
      fsDb.collection('attempts').get(),
      fsDb.collection('enquiries').get(),
      fsDb.collection('orders').get()
    ]);

    if (!usersSnap.empty) db.users = usersSnap.docs.map(d => d.data());
    if (!allTestsSnap.empty) db.tests = allTestsSnap.docs.map(d => d.data());
    if (!attemptsSnap.empty) db.attempts = attemptsSnap.docs.map(d => d.data());
    if (!enquiriesSnap.empty) db.enquiries = enquiriesSnap.docs.map(d => d.data());
    if (!ordersSnap.empty) db.orders = ordersSnap.docs.map(d => d.data());
      saveDatabase();
      console.log(`🔥 Synced from Cloud Firestore: ${db.users.length} users, ${db.tests.length} tests, ${db.attempts.length} attempts.`);
    }
  } catch (err) {
    console.warn('⚠️ Initial Firestore sync warning:', err.message);
  }
  return status;
}

// Initial load
loadDatabase();

module.exports = {
  getDb: () => db,
  saveDb: saveDatabase,
  initFirebaseSync,
  syncAllToFirestore,
  // Helper queries
  findUserByEmail: (email) => {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: (id) => {
    return db.users.find(u => u.id === id);
  },
  createUser: (userData) => {
    db.users.push(userData);
    saveDatabase();
    syncDocToFirestore('users', userData.id, userData);
    return userData;
  },
  updateUser: (id, updates) => {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates };
      saveDatabase();
      syncDocToFirestore('users', id, db.users[idx]);
      return db.users[idx];
    }
    return null;
  },
  getTests: (category, force) => {
    let list = db.tests;
    if (category) {
      const catLower = category.toLowerCase();
      if (catLower === 'paid') {
        list = list.filter(t => t.isPaid === true);
      } else if (catLower === 'free') {
        list = list.filter(t => !t.isPaid);
      } else if (catLower === 'crpf' || catLower === 'cisf' || catLower === 'bsf' || catLower === 'itbp' || catLower === 'ssb') {
        list = list.filter(t => (t.force && t.force.toLowerCase() === catLower) || (t.category && t.category.toLowerCase() === catLower));
      } else if (catLower === 'ar' || catLower === 'assam_rifles' || catLower === 'assam rifles') {
        list = list.filter(t => (t.force && (t.force.toLowerCase().includes('assam') || t.force.toLowerCase().includes('ar'))));
      } else if (catLower !== 'all') {
        list = list.filter(t => (t.category && t.category.toLowerCase() === catLower) || (t.force && t.force.toLowerCase() === catLower));
      }
    }
    if (force && force !== 'all') {
      const fLower = force.toLowerCase();
      list = list.filter(t => t.force && t.force.toLowerCase().includes(fLower));
    }
    return list;
  },
  getTestById: (id) => {
    return db.tests.find(t => t.id === id);
  },
  createTest: (testData) => {
    db.tests.push(testData);
    saveDatabase();
    syncDocToFirestore('tests', testData.id, testData);
    return testData;
  },
  updateTest: (id, updates) => {
    const idx = db.tests.findIndex(t => t.id === id);
    if (idx !== -1) {
      db.tests[idx] = { ...db.tests[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      syncDocToFirestore('tests', id, db.tests[idx]);
      return db.tests[idx];
    }
    return null;
  },
  deleteTest: (id) => {
    const idx = db.tests.findIndex(t => t.id === id);
    if (idx !== -1) {
      const removed = db.tests.splice(idx, 1);
      saveDatabase();
      deleteDocFromFirestore('tests', id);
      return removed[0];
    }
    return null;
  },
  createAttempt: (attemptData) => {
    db.attempts.push(attemptData);
    saveDatabase();
    syncDocToFirestore('attempts', attemptData.id, attemptData);
    return attemptData;
  },
  getAttemptsByUser: (userId) => {
    return db.attempts
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },
  getAttemptById: (id) => {
    return db.attempts.find(a => a.id === id);
  },
  getAllAttempts: () => {
    return db.attempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },
  getEnquiries: () => {
    db.enquiries = db.enquiries || [];
    return db.enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  createEnquiry: (enquiryData) => {
    db.enquiries = db.enquiries || [];
    db.enquiries.push(enquiryData);
    saveDatabase();
    syncDocToFirestore('enquiries', enquiryData.id, enquiryData);
    return enquiryData;
  },
  updateEnquiry: (id, updates) => {
    db.enquiries = db.enquiries || [];
    const idx = db.enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      db.enquiries[idx] = { ...db.enquiries[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      syncDocToFirestore('enquiries', id, db.enquiries[idx]);
      return db.enquiries[idx];
    }
    return null;
  },
  getOrders: () => {
    db.orders = db.orders || [];
    return db.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getOrderById: (id) => {
    db.orders = db.orders || [];
    return db.orders.find(o => o.id === id || o.orderId === id);
  },
  createOrder: (orderData) => {
    db.orders = db.orders || [];
    db.orders.push(orderData);
    saveDatabase();
    syncDocToFirestore('orders', orderData.id, orderData);
    return orderData;
  },
  updateOrder: (id, updates) => {
    db.orders = db.orders || [];
    const idx = db.orders.findIndex(o => o.id === id || o.orderId === id);
    if (idx !== -1) {
      db.orders[idx] = { ...db.orders[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      syncDocToFirestore('orders', db.orders[idx].id, db.orders[idx]);
      return db.orders[idx];
    }
    return null;
  }
};
