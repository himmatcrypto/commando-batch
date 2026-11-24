const fs = require('fs');
const path = require('path');

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
    console.error('Error saving database:', err);
  }
}

// Initial load
loadDatabase();

module.exports = {
  getDb: () => db,
  saveDb: saveDatabase,
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
    return userData;
  },
  updateUser: (id, updates) => {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates };
      saveDatabase();
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
      } else if (catLower === 'crpf' || catLower === 'cisf' || catLower === 'bsf' || catLower === 'itbp' || catLower === 'ssb') {
        list = list.filter(t => (t.force && t.force.toLowerCase() === catLower) || (t.category && t.category.toLowerCase() === catLower));
      } else if (catLower === 'ar' || catLower === 'assam_rifles' || catLower === 'assam rifles') {
        list = list.filter(t => (t.force && (t.force.toLowerCase().includes('assam') || t.force.toLowerCase().includes('ar') || t.force.toLowerCase().includes('capf'))));
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
    return testData;
  },
  updateTest: (id, updates) => {
    const idx = db.tests.findIndex(t => t.id === id);
    if (idx !== -1) {
      db.tests[idx] = { ...db.tests[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.tests[idx];
    }
    return null;
  },
  deleteTest: (id) => {
    const idx = db.tests.findIndex(t => t.id === id);
    if (idx !== -1) {
      const removed = db.tests.splice(idx, 1);
      saveDatabase();
      return removed[0];
    }
    return null;
  },
  createAttempt: (attemptData) => {
    db.attempts.push(attemptData);
    saveDatabase();
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
    return enquiryData;
  },
  updateEnquiry: (id, updates) => {
    db.enquiries = db.enquiries || [];
    const idx = db.enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      db.enquiries[idx] = { ...db.enquiries[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.enquiries[idx];
    }
    return null;
  }
};
