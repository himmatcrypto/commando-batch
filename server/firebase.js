/**
 * FIREBASE ADMIN SDK & CLOUD FIRESTORE CONNECTOR
 * Supports:
 *  1. ./firebase-service-account.json (or ./config/firebase-service-account.json)
 *  2. FIREBASE_SERVICE_ACCOUNT_JSON environment variable
 *  3. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY env vars
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let firestoreDb = null;
let firebaseAuth = null;
let initialized = false;
let activeProjectId = null;
let initError = null;

function loadServiceAccount() {
  // 1. Check FIREBASE_SERVICE_ACCOUNT_JSON env var
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      initError = 'Invalid FIREBASE_SERVICE_ACCOUNT_JSON format';
    }
  }

  // 2. Check individual env vars
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
  }

  // 3. Check local service account JSON files
  const candidatePaths = [
    path.join(__dirname, '..', 'firebase-service-account.json'),
    path.join(__dirname, '..', 'config', 'firebase-service-account.json')
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        initError = `Failed to parse ${path.basename(filePath)}: ${e.message}`;
      }
    }
  }

  return null;
}

function initFirebase() {
  if (initialized) return { connected: !!firestoreDb, projectId: activeProjectId };
  initialized = true;

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    return {
      connected: false,
      projectId: null,
      reason: 'No Firebase service account found. Add firebase-service-account.json in project root to enable Cloud Firestore.'
    };
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
    }
    firestoreDb = admin.firestore();
    firebaseAuth = admin.auth();
    activeProjectId = serviceAccount.project_id;
    console.log(`🔥 Firebase Admin & Cloud Firestore connected! Project: ${activeProjectId}`);
    return { connected: true, projectId: activeProjectId };
  } catch (err) {
    initError = err.message;
    console.warn('⚠️ Firebase initialization failed:', err.message);
    return { connected: false, projectId: null, reason: err.message };
  }
}

module.exports = {
  initFirebase,
  isConnected: () => !!firestoreDb,
  getFirestore: () => firestoreDb,
  getAuth: () => firebaseAuth,
  getStatus: () => ({
    connected: !!firestoreDb,
    projectId: activeProjectId,
    error: initError
  })
};
