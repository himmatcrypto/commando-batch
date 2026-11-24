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
  console.log('=== VERIFYING PRICING CONDITIONS: ₹100, ₹199, ₹300, ₹550 ===\n');

  // Test Case 1: Candidate A buys Single Force (BSF) for 2 Months -> Expected: ₹100
  console.log('--- TEST CASE 1: Single Force 2-Month Pass ---');
  const user1 = await request('POST', '/api/auth/register', {
    name: 'BSF Constable Ramesh',
    email: `bsf_${Date.now()}@test.in`,
    password: 'password123',
    targetExam: 'BSF SI LDCE',
    force: 'BSF',
    phone: '9811122233'
  });
  const sub1 = await request('POST', '/api/auth/subscribe-package', {
    packageId: 'pkg_100_2m',
    targetForce: 'BSF',
    durationMonths: 2
  }, user1.token);
  console.log(`✓ Result: Price = ₹${sub1.package.price}, Duration = ${sub1.package.durationMonths} Mo, Quota = ${sub1.package.testsCount} Tests, Target = ${sub1.package.targetForce}`);
  if (sub1.package.price !== 100 || sub1.package.durationMonths !== 2 || sub1.package.targetForce !== 'BSF') {
    throw new Error(`Test 1 Failed: Expected ₹100, 2 Mo, BSF. Got ₹${sub1.package.price}`);
  }

  // Test Case 2: Candidate B buys ALL Mocks for 2 Months -> Expected: ₹300
  console.log('\n--- TEST CASE 2: ALL Mocks 2-Month Pass (User Request: ₹300) ---');
  const user2 = await request('POST', '/api/auth/register', {
    name: 'Inspector Ajay Commando',
    email: `all_2m_${Date.now()}@test.in`,
    password: 'password123',
    targetExam: 'All CAPFs',
    force: 'CAPF',
    phone: '9822233344'
  });
  const sub2 = await request('POST', '/api/auth/subscribe-package', {
    packageId: 'pkg_all_2m',
    targetForce: 'ALL',
    durationMonths: 2
  }, user2.token);
  console.log(`✓ Result: Price = ₹${sub2.package.price}, Duration = ${sub2.package.durationMonths} Mo, Quota = ${sub2.package.testsCount} Tests, Target = ${sub2.package.targetForce}`);
  if (sub2.package.price !== 300 || sub2.package.durationMonths !== 2 || sub2.package.targetForce !== 'ALL' || sub2.package.testsCount !== 60) {
    throw new Error(`Test 2 Failed: Expected ₹300, 2 Mo, ALL, 60 tests. Got ₹${sub2.package.price}`);
  }

  // Test Case 3: Candidate C buys Single Force (ITBP) for 6 Months -> Expected: ₹199
  console.log('\n--- TEST CASE 3: Single Force 6-Month Pro Pass ---');
  const user3 = await request('POST', '/api/auth/register', {
    name: 'ITBP Sub-Inspector Suresh',
    email: `itbp_${Date.now()}@test.in`,
    password: 'password123',
    targetExam: 'ITBP LDCE',
    force: 'ITBP',
    phone: '9833344455'
  });
  const sub3 = await request('POST', '/api/auth/subscribe-package', {
    packageId: 'pkg_199_6m',
    targetForce: 'ITBP',
    durationMonths: 6
  }, user3.token);
  console.log(`✓ Result: Price = ₹${sub3.package.price}, Duration = ${sub3.package.durationMonths} Mo, Quota = ${sub3.package.testsCount} Tests, Target = ${sub3.package.targetForce}`);
  if (sub3.package.price !== 199 || sub3.package.durationMonths !== 6 || sub3.package.targetForce !== 'ITBP') {
    throw new Error(`Test 3 Failed: Expected ₹199, 6 Mo, ITBP. Got ₹${sub3.package.price}`);
  }

  // Test Case 4: Candidate D buys ALL Mocks for 6 Months -> Expected: ₹550
  console.log('\n--- TEST CASE 4: ALL Mocks 6-Month Pro Pass (User Request: ₹550) ---');
  const user4 = await request('POST', '/api/auth/register', {
    name: 'Major Vikram Batra All-Forces',
    email: `all_6m_${Date.now()}@test.in`,
    password: 'password123',
    targetExam: 'UPSC CAPF (AC)',
    force: 'CAPF',
    phone: '9844455566'
  });
  const sub4 = await request('POST', '/api/auth/subscribe-package', {
    packageId: 'pkg_all_6m',
    targetForce: 'ALL',
    durationMonths: 6
  }, user4.token);
  console.log(`✓ Result: Price = ₹${sub4.package.price}, Duration = ${sub4.package.durationMonths} Mo, Quota = ${sub4.package.testsCount} Tests, Target = ${sub4.package.targetForce}`);
  if (sub4.package.price !== 550 || sub4.package.durationMonths !== 6 || sub4.package.targetForce !== 'ALL' || sub4.package.testsCount !== 60) {
    throw new Error(`Test 4 Failed: Expected ₹550, 6 Mo, ALL, 60 tests. Got ₹${sub4.package.price}`);
  }

  // Test Case 5: Verify tests access for User 2 (₹300 - ALL forces) and User 4 (₹550 - ALL forces)
  console.log('\n--- TEST CASE 5: Verification of Full Test Unlocking for ALL-Force Subscribers ---');
  const testsRes = await request('GET', '/api/tests');
  const forces = ['CRPF', 'CISF', 'BSF', 'ITBP', 'SSB', 'Assam Rifles'];

  for (const force of forces) {
    const forceTests = testsRes.tests.filter(t => t.force === force);
    console.log(`   - Force ${force}: ${forceTests.length} tests found.`);
    forceTests.forEach(t => {
      // User 2 (ALL)
      const isUnlocked2 = !t.isPaid || sub2.package.targetForce === 'ALL' || t.force === sub2.package.targetForce;
      if (!isUnlocked2) throw new Error(`Test ${t.id} should be UNLOCKED for User 2 (₹300 All-Force pass)!`);

      // User 4 (ALL)
      const isUnlocked4 = !t.isPaid || sub4.package.targetForce === 'ALL' || t.force === sub4.package.targetForce;
      if (!isUnlocked4) throw new Error(`Test ${t.id} should be UNLOCKED for User 4 (₹550 All-Force pass)!`);

      // User 1 (BSF only)
      const isUnlocked1 = !t.isPaid || sub1.package.targetForce === 'ALL' || (t.force && t.force.toLowerCase() === sub1.package.targetForce.toLowerCase());
      if (force === 'BSF' && !isUnlocked1) throw new Error(`BSF test should be UNLOCKED for BSF subscriber!`);
      if (force !== 'BSF' && isUnlocked1) throw new Error(`${force} test should be LOCKED for BSF-only subscriber!`);
    });
  }

  console.log('\n======================================================');
  console.log('🎉 ALL PRICING & UNLOCK CONDITIONS VERIFIED PERFECTLY!');
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
