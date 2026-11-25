const { onRequest } = require('firebase-functions/v2/https');
const app = require('./backend/index');

exports.api = onRequest({ region: 'asia-south1', memory: '512MiB', timeoutSeconds: 60 }, app);
