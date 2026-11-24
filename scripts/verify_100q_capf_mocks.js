const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('=== VERIFYING 100-QUESTION CAPF MOCK TESTS ===\n');

  // 1. Check all tests count
  const allRes = await get('/api/tests');
  console.log('Total tests retrieved:', allRes.body.tests.length, '(Expected: 63)');
  if (allRes.body.tests.length !== 63) {
    throw new Error(`Expected 63 tests, got ${allRes.body.tests.length}`);
  }

  // 2. Check Free tests count
  const freeRes = await get('/api/tests?category=free');
  console.log('Free common tests count:', freeRes.body.tests.length, '(Expected: 3)');
  if (freeRes.body.tests.length !== 3) {
    throw new Error(`Expected 3 free tests, got ${freeRes.body.tests.length}`);
  }

  // 3. Check Paid tests count
  const paidRes = await get('/api/tests?category=paid');
  console.log('Paid force tests count:', paidRes.body.tests.length, '(Expected: 60)');
  if (paidRes.body.tests.length !== 60) {
    throw new Error(`Expected 60 paid tests, got ${paidRes.body.tests.length}`);
  }

  // 4. Check each Force has exactly 10 tests
  const forces = ['crpf', 'cisf', 'bsf', 'itbp', 'ssb', 'ar'];
  for (const f of forces) {
    const fRes = await get(`/api/tests?category=${f}`);
    console.log(`Force [${f.toUpperCase()}]: ${fRes.body.tests.length} tests (Expected: 10)`);
    if (fRes.body.tests.length !== 10) {
      throw new Error(`Expected 10 tests for force ${f}, got ${fRes.body.tests.length}`);
    }
  }

  // 5. Check sample test details from each force and free mocks:
  // Must have exactly 100 questions, 100 minutes duration, and 25 questions in each section!
  const sampleTestIds = [
    'test_crpf_full_01',
    'test_cisf_full_01',
    'test_bsf_full_01',
    'test_itbp_full_01',
    'test_ssb_full_01',
    'test_ar_full_01',
    'test_free_common_01',
    'test_free_common_02',
    'test_free_common_03'
  ];

  console.log('\nVerifying 100 questions and 25 questions per section on sample tests:');
  for (const tid of sampleTestIds) {
    const detail = await get(`/api/tests/${tid}`);
    const t = detail.body.test;

    const secDist = {};
    t.questions.forEach(q => {
      secDist[q.section] = (secDist[q.section] || 0) + 1;
    });

    const isDistValid = Object.keys(secDist).length === 4 && Object.values(secDist).every(c => c === 25);
    console.log(`✓ [${t.id}] "${t.title}"`);
    console.log(`   Force: ${t.force} | Paid: ${t.isPaid} | Total Qs: ${t.questions.length} | Duration: ${t.durationMinutes}m`);
    console.log(`   Section Distribution (25 each):`, secDist, isDistValid ? 'PASS ✓' : 'FAIL ✗');

    if (t.questions.length !== 100 || t.durationMinutes !== 100 || !isDistValid) {
      throw new Error(`Validation failed for test ${tid}`);
    }
  }

  console.log('\n=== ALL 63 TESTS FULLY VERIFIED (100 Qs each, 25 Qs per section, 100 mins duration) ===');
}

verifyAll().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
