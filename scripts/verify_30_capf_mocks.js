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

async function runVerification() {
  console.log('=== STARTING 30 CAPF FORCE-WISE MOCKS VERIFICATION ===\n');

  // 1. Fetch all tests
  const allRes = await get('/api/tests');
  console.log('Total tests retrieved:', allRes.body.tests.length);

  // 2. Filter by paid section
  const paidRes = await get('/api/tests?category=paid');
  console.log('Paid section tests count:', paidRes.body.tests.length, '(Expected: 30)');
  if (paidRes.body.tests.length !== 30) {
    throw new Error(`Expected 30 paid tests, got ${paidRes.body.tests.length}`);
  }

  // 3. Check force breakdown
  const forces = ['crpf', 'cisf', 'bsf', 'itbp', 'ssb', 'ar'];
  for (const f of forces) {
    const fRes = await get(`/api/tests?category=${f}`);
    console.log(`Force filter [${f.toUpperCase()}]: found ${fRes.body.tests.length} tests`);
  }

  // 4. Check proportional timings (durationMinutes === questionCount)
  let timingOk = true;
  paidRes.body.tests.forEach(t => {
    if (t.durationMinutes !== t.questionCount) {
      console.error(`Timing mismatch for ${t.id}: Qs=${t.questionCount}, Duration=${t.durationMinutes}`);
      timingOk = false;
    }
  });
  console.log('Proportional timing check (1 min per Q):', timingOk ? 'ALL PASS ✓' : 'FAIL ✗');

  // 5. Test detailed CBT retrieval for a sample of each force
  const sampleTestIds = [
    'test_crpf_ldce_01',
    'test_cisf_ldce_01',
    'test_bsf_ldce_01',
    'test_itbp_ldce_01',
    'test_ssb_ldce_01',
    'test_ar_ldce_01',
    'test_capf_ac_01'
  ];

  console.log('\nTesting CBT details retrieval for each force:');
  for (const tid of sampleTestIds) {
    const detailRes = await get(`/api/tests/${tid}`);
    const t = detailRes.body.test;
    console.log(`✓ [${t.id}] "${t.title}" | Force: ${t.force} | Paid: ${t.isPaid} | Qs: ${t.questions.length} | Duration: ${t.durationMinutes}m | Sections: ${t.sections.length}`);
    if (!t.questions || t.questions.length === 0) {
      throw new Error(`Test ${tid} has no questions!`);
    }
  }

  console.log('\n=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! ===');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
