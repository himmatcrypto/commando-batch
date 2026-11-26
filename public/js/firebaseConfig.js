/**
 * COMMANDO BATCH - FIREBASE WEB SDK CONFIGURATION
 * Replace the placeholder values below with your Firebase Console Web App config
 * (Project Settings -> General -> Your apps -> SDK setup and configuration).
 */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAynFFHrg9cI5q1eu_07VnvEZLZyDm79ok",
  authDomain: "studenthub-f3414.firebaseapp.com",
  projectId: "studenthub-f3414",
  storageBucket: "studenthub-f3414.firebasestorage.app",
  messagingSenderId: "943176180410",
  appId: "1:943176180410:web:e16fbd8e90115f45c71883",
  measurementId: "G-JZ0Z6RNK8R"
};

window.CommandoFirebase = (function () {
  let app = null;
  let auth = null;
  let firestore = null;

  function init() {
    if (typeof firebase === 'undefined') return false;
    if (!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey || !window.FIREBASE_CONFIG.projectId) {
      return false;
    }
    try {
      if (!firebase.apps.length) {
        app = firebase.initializeApp(window.FIREBASE_CONFIG);
      } else {
        app = firebase.app();
      }
      auth = firebase.auth ? firebase.auth() : null;
      firestore = firebase.firestore ? firebase.firestore() : null;
      console.log('🔥 Firebase Web SDK initialized for project:', window.FIREBASE_CONFIG.projectId);
      return true;
    } catch (err) {
      console.warn('Firebase Web SDK init skipped:', err.message);
      return false;
    }
  }

  return {
    init,
    isReady: () => !!app,
    getApp: () => app,
    getAuth: () => auth,
    getFirestore: () => firestore
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.CommandoFirebase.init();
});
