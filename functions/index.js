const { onRequest } = require('firebase-functions/v2/https');
const app = require('../server/index');

exports.api = onRequest({ region: 'asia-south1', memory: '512MiB' }, app);
