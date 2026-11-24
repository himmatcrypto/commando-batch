/**
 * COMMANDO BATCH - FIREBASE WEB SDK CONFIGURATION
 * Replace the placeholder values below with your Firebase Console Web App config
 * (Project Settings -> General -> Your apps -> SDK setup and configuration).
 */

window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
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
