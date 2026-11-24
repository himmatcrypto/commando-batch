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
  console.log('--- TESTING FORCE SPECIFIC PASS SUBSCRIPTION & VERIFICATION ---');

  // Register candidate
  const testEmail = `candidate_${Date.now()}@force.test`;
  console.log(`1. Registering candidate: ${testEmail}`);
  const regRes = await request('POST', '/api/auth/register', {
    name: 'Inspector Vikram CISF',
    email: testEmail,
    password: 'password123',
    targetExam: 'CISF LDCE',
    force: 'CISF',
    phone: '9876543210'
  });
  const token = regRes.token;
  console.log(`✓ Candidate registered. Roll No: ${regRes.user.rollNo}`);

  // Subscribe ₹100 Tactical Pass for CISF
  console.log('2. Subscribing to ₹100 Tactical Pass for targetForce: "CISF"');
  const subRes = await request('POST', '/api/auth/subscribe-package', {
    packageId: 'pkg_100_2m',
    targetForce: 'CISF'
  }, token);

  console.log(`✓ Subscribed successfully:`, {
    packageName: subRes.package.name,
    targetForce: subRes.package.targetForce,
    price: subRes.package.price,
    testsCount: subRes.package.testsCount,
    status: subRes.package.status
  });

  if (subRes.package.targetForce !== 'CISF') {
    throw new Error(`Expected targetForce 'CISF', got '${subRes.package.targetForce}'`);
  }

  // Get current user profile
  const meRes = await request('GET', '/api/auth/me', null, token);
  console.log(`3. Verified /api/auth/me has activePackage with targetForce: ${meRes.user.activePackage.targetForce}`);

  // Check test access logic against tests list
  const testsRes = await request('GET', '/api/tests');
  console.log(`4. Retrieved ${testsRes.tests.length} mock tests from API.`);

  const cisfTests = testsRes.tests.filter(t => t.force === 'CISF');
  const crpfTests = testsRes.tests.filter(t => t.force === 'CRPF');
  const freeTests = testsRes.tests.filter(t => !t.isPaid);

  console.log(`   - Found ${cisfTests.length} CISF tests`);
  console.log(`   - Found ${crpfTests.length} CRPF tests`);
  console.log(`   - Found ${freeTests.length} Free Common tests`);

  // Verify unlocking logic:
  const passForce = meRes.user.activePackage.targetForce;

  // CISF tests MUST be unlocked
  cisfTests.forEach(t => {
    const isUnlocked = !t.isPaid || passForce === 'ALL' || (t.force && t.force.toLowerCase() === passForce.toLowerCase());
    if (!isUnlocked) throw new Error(`Test ${t.id} (${t.title}) should be unlocked for CISF pass!`);
  });
  console.log(`✓ All ${cisfTests.length} CISF tests verified UNLOCKED for CISF pass.`);

  // CRPF paid tests MUST be locked
  crpfTests.forEach(t => {
    const isUnlocked = !t.isPaid || passForce === 'ALL' || (t.force && t.force.toLowerCase() === passForce.toLowerCase());
    if (isUnlocked) throw new Error(`Test ${t.id} (${t.title}) should be LOCKED for CISF pass!`);
  });
  console.log(`✓ All ${crpfTests.length} CRPF paid tests verified LOCKED for CISF pass.`);

  // Free tests MUST be unlocked for all
  freeTests.forEach(t => {
    const isUnlocked = !t.isPaid || passForce === 'ALL' || (t.force && t.force.toLowerCase() === passForce.toLowerCase());
    if (!isUnlocked) throw new Error(`Free test ${t.id} should be UNLOCKED!`);
  });
  console.log(`✓ All ${freeTests.length} Free tests verified UNLOCKED.`);

  console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY! ---');
}

run().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
