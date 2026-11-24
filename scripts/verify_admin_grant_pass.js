const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(json.error || `HTTP ${res.statusCode}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('=== VERIFYING ADMIN FREE PREMIUM PASS GRANT & REVOKE ===\n');

  // 1. Login as HQ Admin
  const adminLogin = await request('POST', '/api/auth/login', {
    email: 'admin@commandobatch.gov.in',
    password: 'admin123',
    requiredRole: 'admin'
  });
  const adminToken = adminLogin.token;
  console.log('1. Logged in as HQ Admin:', adminLogin.user.email);

  // 2. Register a fresh candidate
  const candReg = await request('POST', '/api/auth/register', {
    name: 'Constable Arjun Verma',
    email: `arjun_${Date.now()}@capf.in`,
    password: 'password123',
    targetExam: 'CAPF (AC)',
    force: 'CRPF',
    phone: '9876501234'
  });
  const candId = candReg.user.id;
  const candToken = candReg.token;
  console.log(`2. Registered candidate: ${candReg.user.name} (ID: ${candId})`);

  // 3. Admin grants 45-day ALL-Forces Free Premium Pass
  const grant1 = await request('POST', `/api/admin/users/${candId}/grant-pass`, {
    targetForce: 'ALL',
    days: 45
  }, adminToken);
  console.log('3. Admin granted 45-day ALL-Force Free Pass:', {
    name: grant1.package.name,
    price: grant1.package.price,
    targetForce: grant1.package.targetForce,
    durationDays: grant1.package.durationDays,
    grantedByAdmin: grant1.package.grantedByAdmin,
    expiresAt: grant1.package.expiresAt
  });

  if (grant1.package.price !== 0 || grant1.package.durationDays !== 45 || grant1.package.targetForce !== 'ALL' || !grant1.package.grantedByAdmin) {
    throw new Error('Grant 1 verification failed!');
  }

  // Verify candidate /api/auth/me reflects activePackage
  const me1 = await request('GET', '/api/auth/me', null, candToken);
  if (!me1.user.activePackage || me1.user.activePackage.targetForce !== 'ALL') {
    throw new Error('Candidate /me did not reflect ALL pass!');
  }
  console.log('✓ Candidate /api/auth/me confirmed active ALL pass for 45 days.');

  // 4. Admin updates to 15-day CRPF-only Free Pass
  const grant2 = await request('POST', `/api/admin/users/${candId}/grant-pass`, {
    targetForce: 'CRPF',
    days: 15
  }, adminToken);
  console.log('4. Admin updated pass to 15-day CRPF Free Pass:', {
    targetForce: grant2.package.targetForce,
    durationDays: grant2.package.durationDays
  });

  if (grant2.package.targetForce !== 'CRPF' || grant2.package.durationDays !== 15) {
    throw new Error('Grant 2 verification failed!');
  }

  // 5. Admin revokes pass
  const revoke = await request('POST', `/api/admin/users/${candId}/revoke-pass`, {}, adminToken);
  console.log('5. Admin revoked pass:', revoke.message);

  const me2 = await request('GET', '/api/auth/me', null, candToken);
  if (me2.user.activePackage !== null) {
    throw new Error('Pass should be null after revoke!');
  }
  console.log('✓ Candidate /api/auth/me confirmed pass is revoked.');

  console.log('\n======================================================');
  console.log('🎉 ALL ADMIN GRANT/REVOKE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
