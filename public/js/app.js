/**
 * COMMANDO BATCH - CORE APPLICATION CONTROLLER
 * Routing, authentication state, 3D card tilts, category filters, and student dashboard.
 */

const App = (function () {
  let currentCategory = 'free';
  let allTests = [];
  let authCallback = null;

  async function init() {
    try { setupEventListeners(); } catch (e) { console.warn('setupEventListeners error:', e); }
    try { updateAuthUI(); } catch (e) { console.warn('updateAuthUI error:', e); }

    // Initialize CBT engine
    try {
      if (typeof CBTEngine !== 'undefined' && CBTEngine.init) CBTEngine.init();
    } catch (e) { console.warn('CBTEngine.init error:', e); }

    // Initialize Three.js 3D Emblem (non-blocking if WebGL unavailable)
    try {
      if (window.initThreeBadge) window.initThreeBadge();
    } catch (e) { console.warn('initThreeBadge error:', e); }

    // Initialize CAPF Combat Background Slideshow
    try { initCombatSlider(); } catch (e) { console.warn('initCombatSlider error:', e); }

    // Load initial mock tests (show 3 Free Mocks tab first on homepage)
    await loadTests('free');

    // Enable 3D tilt effects
    try { setup3DTilt(); } catch (e) { console.warn('setup3DTilt error:', e); }

    // Check for paused CBT examination session
    try { checkPausedSession(); } catch (e) { console.warn('checkPausedSession error:', e); }

    // Update packages status for active pass
    try { updatePackagesUI(); } catch (e) { console.warn('updatePackagesUI error:', e); }

    // Complete Google Sign-In redirect flow if returning from mobile Safari/Chrome redirect
    try { await handleGoogleRedirectResult(); } catch (e) { console.warn('Google redirect check:', e); }

    // Verify Cashfree Payment return if redirected back with ?cf_order_id=...
    try { await handleCashfreeReturnUrl(); } catch (e) { console.warn('Cashfree return check:', e); }
  }

  function setupEventListeners() {
    // Nav links
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        switchView(view);
      });
    });

    // Close modal on click outside
    window.addEventListener('click', (e) => {
      const authModal = document.getElementById('authModal');
      const genModal = document.getElementById('generalModal');
      if (e.target === authModal) closeAuthModal();
      if (e.target === genModal) closeGeneralModal();
    });

    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
        closeGeneralModal();
      }
    });
  }

  function updateAuthUI() {
    const user = API.getUser();
    const guestNav = document.getElementById('navGuestActions');
    const userNav = document.getElementById('navUserActions');
    const studentLink = document.getElementById('navStudentLink');
    const adminLink = document.getElementById('navAdminLink');

    if (user) {
      if (guestNav) guestNav.style.display = 'none';
      if (userNav) userNav.style.display = 'flex';

      const userNameEl = document.getElementById('navUserName');
      const userRoleEl = document.getElementById('navUserRole');
      const userBadgeEl = document.getElementById('navUserBadge');
      const userPill = document.querySelector('.user-pill');

      if (userNameEl) userNameEl.textContent = user.name;

      if (user.role === 'admin') {
        if (userRoleEl) userRoleEl.textContent = 'CHIEF CONTROLLER • HQ ADMIN';
        if (userBadgeEl) userBadgeEl.textContent = '🛡️';
        if (adminLink) adminLink.style.display = 'inline-flex';
        if (studentLink) studentLink.style.display = 'none';
        if (userPill) userPill.onclick = () => switchView('adminView');
      } else {
        const hasPass = user.activePackage && user.activePackage.status === 'ACTIVE';
        if (userRoleEl) {
          if (hasPass) {
            userRoleEl.innerHTML = `${escapeHtml(user.targetExam || 'ASPIRANT')} <span class="active-pass-nav-badge">🎖️ ACTIVE PASS</span>`;
          } else {
            userRoleEl.textContent = `${user.targetExam || 'ASPIRANT'} • CANDIDATE`;
          }
        }
        if (userBadgeEl) userBadgeEl.textContent = user.name.charAt(0).toUpperCase();
        if (adminLink) adminLink.style.display = 'none';
        if (studentLink) studentLink.style.display = 'inline-flex';
        if (userPill) userPill.onclick = () => switchView('studentView');
      }

      // Pre-fill Enquiry Panel form if user is logged in
      const enqName = document.getElementById('enquiryName');
      const enqPhone = document.getElementById('enquiryPhone');
      const enqEmail = document.getElementById('enquiryEmail');
      const enqExam = document.getElementById('enquiryTargetExam');

      if (enqName && !enqName.value) enqName.value = user.name || '';
      if (enqEmail && !enqEmail.value) enqEmail.value = user.email || '';
      if (enqPhone && !enqPhone.value && user.phone) enqPhone.value = user.phone;
      if (enqExam && user.targetExam) {
        const matchingOpt = Array.from(enqExam.options).find(o => o.value.toLowerCase().includes(user.targetExam.toLowerCase()));
        if (matchingOpt) enqExam.value = matchingOpt.value;
      }
    } else {
      if (guestNav) guestNav.style.display = 'flex';
      if (userNav) userNav.style.display = 'none';
      if (studentLink) studentLink.style.display = 'none';
      if (adminLink) adminLink.style.display = 'none';
    }
  }

  function toggleMobileMenu(forceState) {
    const menu = document.getElementById('navMenuContainer');
    const toggleBtn = document.getElementById('navMobileToggle');
    if (!menu || !toggleBtn) return;
    const nextOpen = typeof forceState === 'boolean' ? forceState : !menu.classList.contains('open');
    menu.classList.toggle('open', nextOpen);
    toggleBtn.classList.toggle('active', nextOpen);
    toggleBtn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
  }

  function switchView(viewName) {
    toggleMobileMenu(false);
    const user = API.getUser();

    // Security check: Only HQ Administrators can access Admin Panel
    if (viewName === 'adminView') {
      if (!user || user.role !== 'admin') {
        showToast('Access Denied: Only authorized HQ Administrators can access the Admin Panel.', 'error');
        viewName = 'homeView';
      }
    }

    const views = ['homeView', 'studentView', 'adminView', 'scorecardView'];
    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) el.style.display = 'none';
    });

    const activeEl = document.getElementById(viewName);
    if (activeEl) {
      activeEl.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // View specific actions
    if (viewName === 'studentView') {
      loadStudentDashboard();
    } else if (viewName === 'adminView') {
      if (typeof Admin !== 'undefined' && Admin.loadAdminDashboard) {
        Admin.loadAdminDashboard();
      }
    } else if (viewName === 'homeView') {
      loadTests(currentCategory);
      updatePackagesUI();
    }

    // Update paused test banner if applicable
    checkPausedSession();
  }

  async function loadTests(category = currentCategory || 'free') {
    currentCategory = category;
    updateCategoryPills(category);

    const grid = document.getElementById('testsGrid');
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚔️</div>
        <div style="color: var(--gold-bright); font-family: var(--font-military);">Loading defense mock tests...</div>
      </div>
    `;

    try {
      let data = null;
      let lastErr = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          data = await API.getTests(category);
          break;
        } catch (e) {
          lastErr = e;
          await new Promise(r => setTimeout(r, 1200));
        }
      }
      if (!data) throw lastErr || new Error('Unable to fetch tests');
      allTests = data.tests || [];
      renderTestCards(allTests);
    } catch (err) {
      console.error('Failed to load tests:', err);
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #ef4444;">
          Failed to load mock tests. <button class="btn-demo-pill" onclick="App.loadTests('${escapeHtml(category)}')" style="margin-left: 0.5rem;">↻ Retry</button>
        </div>
      `;
    }
  }

  function updateCategoryPills(activeCat) {
    document.querySelectorAll('.cat-pill').forEach(pill => {
      if (pill.getAttribute('data-cat') === activeCat) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function renderTestCards(tests) {
    const grid = document.getElementById('testsGrid');
    if (!grid) return;

    if (!tests || tests.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: rgba(15,23,19,0.8); border-radius: 12px; border: 1px solid rgba(212,175,55,0.2);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛡️</div>
          <h3 style="color: #fff;">No Mock Tests in this Category Yet</h3>
          <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 0.3rem;">Switch categories or create one in the Admin Panel.</p>
        </div>
      `;
      return;
    }

    const user = API.getUser();
    const hasActivePass = user && user.activePackage && user.activePackage.status === 'ACTIVE' && (!user.activePackage.expiresAt || new Date(user.activePackage.expiresAt) > new Date());
    const passForce = hasActivePass ? (user.activePackage.targetForce || '') : '';

    grid.innerHTML = tests.map(test => {
      const catLower = test.category ? test.category.toLowerCase() : '';
      let badgeClass = 'badge-ldce';
      if (catLower === 'capf') badgeClass = 'badge-capf';
      if (catLower === 'si') badgeClass = 'badge-si';
      if (catLower === 'ssc') badgeClass = 'badge-ssc';
      if (catLower === 'bank') badgeClass = 'badge-bank';

      const forceStr = test.force || '';
      let forceBadgeHtml = '';
      if (forceStr) {
        const forceKey = forceStr.toLowerCase().replace(/[^a-z0-9]/g, '');
        forceBadgeHtml = `<span class="badge-force force-${forceKey}">🛡️ ${escapeHtml(forceStr)}</span>`;
      }

      const isPaidTest = !!test.isPaid;
      // Force-specific unlock check:
      // Free mocks (isPaid=false) are unlocked for all candidates.
      // Admin bypasses all checks.
      // Candidate with active pass:
      // - If passForce === 'ALL', all force tests are unlocked.
      // - Otherwise, only tests matching test.force are unlocked.
      const isForceMatch = hasActivePass && (
        passForce.toUpperCase() === 'ALL' ||
        (test.force && passForce && test.force.trim().toLowerCase() === passForce.trim().toLowerCase())
      );
      const isUnlocked = !isPaidTest || (user && user.role === 'admin') || isForceMatch;

      let passTagHtml = '';
      if (isPaidTest) {
        if (isUnlocked) {
          passTagHtml = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 0.5rem 0; padding: 0.35rem 0.65rem; background: rgba(34, 197, 94, 0.12); border-radius: 6px; border: 1px solid rgba(34, 197, 94, 0.3);">
              <span class="test-pass-unlocked-tag">🟢 Included in ${escapeHtml(passForce || test.force)} Pass</span>
              <span style="font-size: 0.72rem; color: #4ade80; font-family: var(--font-military); letter-spacing: 0.5px; font-weight: 700;">✓ UNLOCKED</span>
            </div>
          `;
        } else if (hasActivePass) {
          passTagHtml = `
            <div class="test-pass-locked-tag" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.35);">
              <span style="color: #f87171;">🔒 ${escapeHtml(test.force || 'CAPF')} Pass Required</span>
              <span style="font-size: 0.72rem; color: #fbbf24; font-family: var(--font-military); font-weight: 700;">ACTIVE: ${escapeHtml(passForce)}</span>
            </div>
          `;
        } else {
          passTagHtml = `
            <div class="test-pass-locked-tag">
              <span>🔒 ${escapeHtml(test.force || 'CAPF')} Paid Pass</span>
              <span style="font-size: 0.72rem; color: #fbbf24; font-family: var(--font-military); font-weight: 700;">₹100 / ₹199 PASS</span>
            </div>
          `;
        }
      } else {
        passTagHtml = `
          <div style="display: flex; align-items: center; justify-content: space-between; margin: 0.5rem 0; padding: 0.35rem 0.65rem; background: rgba(56, 189, 248, 0.08); border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.25);">
            <span style="font-size: 0.75rem; color: #38bdf8; font-family: var(--font-military); font-weight: 700;">🆓 Free Open Mock (100 Qs)</span>
            <span style="font-size: 0.72rem; color: #38bdf8; font-family: var(--font-military);">COMMON FOR ALL</span>
          </div>
        `;
      }

      let btnActionHtml = '';
      if (isPaidTest && !isUnlocked) {
        btnActionHtml = `
          <button class="btn-3d" style="width: 100%; background: linear-gradient(180deg, #d97706, #b45309); border-color: #f59e0b;" onclick="App.openPackageEnrollment('pkg_100_2m', '${escapeHtml(test.force || 'CRPF')}')">
            👑 Unlock ${escapeHtml(test.force || 'CAPF')} Pass • ₹100
          </button>
        `;
      } else {
        btnActionHtml = `
          <button class="btn-3d" style="width: 100%;" onclick="CBTEngine.startTest('${test.id}')">
            ⚡ Start CBT Mock Test
          </button>
        `;
      }

      const qCount = Number(test.questionCount) || 0;
      // Proportional timing: exactly 1 minute per question (e.g. 10 Qs = 10 Min, 65 Qs = 65 Min)
      const durationMins = qCount > 0 ? qCount : (test.durationMinutes || 60);
      const marksPerQ = Number(test.marksPerQuestion) || 1;
      const totalMarks = qCount > 0 ? (qCount * marksPerQ) : (test.totalMarks || 100);

      return `
        <div class="test-card-3d" data-test-id="${test.id}">
          <div class="card-header-row">
            <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
              <span class="cat-badge ${badgeClass}">${test.category} SPECIAL</span>
              ${forceBadgeHtml}
            </div>
            <span style="font-size: 0.75rem; color: #94a3b8; font-family: var(--font-military);">${test.difficulty}</span>
          </div>

          <h3 class="card-title">${escapeHtml(test.title)}</h3>
          <p class="card-desc">${escapeHtml(test.description)}</p>

          ${passTagHtml}

          <div class="card-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Questions</span>
              <span class="meta-val">${qCount} Qs</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Duration</span>
              <span class="meta-val">${durationMins} Min</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Total Marks</span>
              <span class="meta-val">${totalMarks} M</span>
            </div>
          </div>

          <div class="card-footer-action">
            ${btnActionHtml}
          </div>
        </div>
      `;
    }).join('');

    setup3DTilt();
  }

  // 3D Tilt perspective on cards
  function setup3DTilt() {
    const cards = document.querySelectorAll('.test-card-3d');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // Student Dashboard
  async function loadStudentDashboard() {
    const user = API.getUser();
    if (!user) {
      openAuthModal('login', () => switchView('studentView'));
      return;
    }

    const container = document.getElementById('studentDashboardContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <div style="font-size: 2rem;">💂</div>
        <div style="color: var(--gold-bright); font-family: var(--font-military); margin-top: 0.5rem;">Retrieving candidate performance records...</div>
      </div>
    `;

    try {
      const [meRes, attemptsRes] = await Promise.all([
        API.getMe(),
        API.getMyAttempts()
      ]);

      const candidate = meRes.user;
      const stats = meRes.stats;
      const attempts = attemptsRes.attempts;

      const bestRank = attempts.length > 0 ? '#' + Math.min(...attempts.map(a => a.rank || 1)) : 'N/A';
      const totalPositive = attempts.reduce((sum, a) => sum + (a.positiveMarks !== undefined ? a.positiveMarks : a.score), 0);
      const activePkg = candidate.activePackage;

      const pkgBannerHtml = activePkg ? `
        <div class="active-package-banner">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2.2rem;">🎖️</span>
            <div>
              <div style="font-family: var(--font-military); color: #fbbf24; font-size: 1.15rem; letter-spacing: 1px;">
                ACTIVE PASS: ${escapeHtml(activePkg.name).toUpperCase()}
              </div>
              <div style="color: #cbd5e1; font-size: 0.88rem; margin-top: 0.25rem;">
                Quota: <strong style="color: #34d399;">${activePkg.testsCount} Full-Length Tests</strong> • Duration: <strong>${activePkg.durationMonths} Months</strong> • Expires: <strong>${new Date(activePkg.expiresAt).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>
          <button class="btn-demo-pill" style="border-color: #fbbf24; color: #fbbf24;" onclick="App.switchView('homeView'); document.getElementById('packagesSection').scrollIntoView({behavior: 'smooth'})">
            🔄 Extend / Upgrade Pass
          </button>
        </div>
      ` : `
        <div class="active-package-banner inactive">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2.2rem;">⭐</span>
            <div>
              <div style="font-family: var(--font-military); color: #cbd5e1; font-size: 1.05rem; letter-spacing: 1px;">
                NO ACTIVE PASS ENROLLED • UNLOCK FULL COMMANDO ACCESS
              </div>
              <div style="color: #94a3b8; font-size: 0.88rem; margin-top: 0.25rem;">
                Enroll in Tactical Pass (₹100 for 10 Tests) or Commando Pro Pass (₹199 for 20 Tests).
              </div>
            </div>
          </div>
          <button class="btn-3d" style="padding: 0.5rem 1.2rem; font-size: 0.88rem;" onclick="App.switchView('homeView'); document.getElementById('packagesSection').scrollIntoView({behavior: 'smooth'})">
            🎖️ View Passes (From ₹100)
          </button>
        </div>
      `;

      container.innerHTML = `
        <div class="panel-header-bar">
          <div class="panel-user-profile">
            <div class="profile-avatar-large">
              💂
            </div>
            <div class="profile-meta">
              <h2>${escapeHtml(candidate.name)}</h2>
              <div class="profile-tags">
                <span class="profile-tag">Roll No: <strong>${escapeHtml(candidate.rollNo || 'CB2026')}</strong></span>
                <span class="profile-tag">Target: <strong>${escapeHtml(candidate.targetExam)}</strong></span>
                <span class="profile-tag">Force: <strong>${escapeHtml(candidate.force || 'Paramilitary Force')}</strong></span>
              </div>
            </div>
          </div>

          <div>
            <button class="btn-3d btn-3d-secondary" onclick="App.switchView('homeView')">
              + Browse More Tests
            </button>
          </div>
        </div>

        ${pkgBannerHtml}

        <!-- Student KPI Row with Rank and Net Marks Diagnostics -->
        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-icon gold">📝</div>
            <div class="kpi-content">
              <div class="kpi-label">Tests Attempted</div>
              <div class="kpi-value">${stats.totalAttempts}</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon green">🏆</div>
            <div class="kpi-content">
              <div class="kpi-label">Best Net Score</div>
              <div class="kpi-value">${stats.bestScore} M</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon blue">🎖️</div>
            <div class="kpi-content">
              <div class="kpi-label">Best All-India Rank</div>
              <div class="kpi-value" style="color: #fbbf24;">${bestRank}</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon red">🎯</div>
            <div class="kpi-content">
              <div class="kpi-label">Gross Positive (+)</div>
              <div class="kpi-value" style="color: #34d399;">+${Math.round(totalPositive * 10) / 10} M</div>
            </div>
          </div>
        </div>

        <!-- Previous Submissions & Scorecards Table -->
        <div class="section-breakdown-card">
          <h3 class="section-card-title">📜 Candidate Mock Test Performance & Scorecard Records</h3>
          
          ${attempts.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem; color: #94a3b8;">
              <p>You have not attempted any mock tests yet.</p>
              <button class="btn-3d btn-3d-success" style="margin-top: 1rem;" onclick="App.switchView('homeView')">
                Attempt Your First Mock Test
              </button>
            </div>
          ` : `
            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Force / Target</th>
                    <th>Marks Obtained (Net)</th>
                    <th>Positive (+)</th>
                    <th>Negative (-)</th>
                    <th>All-India Rank</th>
                    <th>Accuracy</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Official Scorecard</th>
                  </tr>
                </thead>
                <tbody>
                  ${attempts.map(a => {
        const posM = a.positiveMarks !== undefined ? a.positiveMarks : (a.summary ? a.summary.correct : a.score);
        const negM = a.negativeMarks !== undefined ? a.negativeMarks : 0;
        return `
                      <tr>
                        <td><strong>${escapeHtml(a.testTitle)}</strong></td>
                        <td><span class="cat-badge badge-ldce">${escapeHtml(a.category)}</span></td>
                        <td style="font-weight: 700; color: #fbbf24; font-size: 1.05rem;">
                          ${a.score} / ${a.totalMarks} <span style="font-size: 0.8rem; color: #94a3b8;">(${a.percentage}%)</span>
                        </td>
                        <td style="color: #34d399; font-weight: 700;">+${posM}</td>
                        <td style="color: #f87171; font-weight: 700;">-${negM}</td>
                        <td>
                          <span class="rank-badge-pill">👑 Rank #${a.rank || 1}</span>
                        </td>
                        <td style="color: #38bdf8; font-weight: 700;">${a.accuracy}%</td>
                        <td>
                          <span class="status-tag ${a.isQualified ? 'pass' : 'fail'}">
                            ${a.isQualified ? 'QUALIFIED' : 'NEEDS PRACTICE'}
                          </span>
                        </td>
                        <td style="font-size: 0.8rem; color: #94a3b8;">${new Date(a.submittedAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <button class="btn-demo-pill" onclick="Scorecard.loadAndDisplay('${a.id}')">
                            View Scorecard ➔
                          </button>
                        </td>
                      </tr>
                    `;
      }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #ef4444;">
          Failed to load dashboard. Please log in again.
        </div>
      `;
    }
  }

  // Auth Modals
  function openAuthModal(mode = 'login', callback = null) {
    authCallback = callback;
    const modal = document.getElementById('authModal');
    if (!modal) return;

    setAuthMode(mode);
    modal.classList.add('active');
  }

  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
  }

  function setAuthMode(mode, prefillEmail = '') {
    const tabLogin = document.getElementById('authTabLogin');
    const tabAdminLogin = document.getElementById('authTabAdminLogin');
    const tabRegister = document.getElementById('authTabRegister');
    const formLogin = document.getElementById('formLogin');
    const formAdminLogin = document.getElementById('formAdminLogin');
    const formRegister = document.getElementById('formRegister');
    const formForgot = document.getElementById('formForgotPassword');
    const dupAlert = document.getElementById('regDuplicateAlert');

    if (tabLogin) tabLogin.classList.remove('active');
    if (tabAdminLogin) tabAdminLogin.classList.remove('active');
    if (tabRegister) tabRegister.classList.remove('active');

    if (formLogin) formLogin.style.display = 'none';
    if (formAdminLogin) formAdminLogin.style.display = 'none';
    if (formRegister) formRegister.style.display = 'none';
    if (formForgot) formForgot.style.display = 'none';
    if (dupAlert) { dupAlert.style.display = 'none'; dupAlert.innerHTML = ''; }

    if (mode === 'admin-login') {
      if (tabAdminLogin) tabAdminLogin.classList.add('active');
      if (formAdminLogin) formAdminLogin.style.display = 'block';
    } else if (mode === 'register') {
      if (tabRegister) tabRegister.classList.add('active');
      if (formRegister) formRegister.style.display = 'block';
    } else if (mode === 'forgot') {
      if (formForgot) formForgot.style.display = 'block';
      const step1 = document.getElementById('forgotStep1Form');
      const step2 = document.getElementById('forgotStep2Form');
      const forgotEmailInput = document.getElementById('forgotEmail');
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'none';
      if (forgotEmailInput && prefillEmail) forgotEmailInput.value = prefillEmail;
    } else {
      if (tabLogin) tabLogin.classList.add('active');
      if (formLogin) formLogin.style.display = 'block';
      const loginEmailInput = document.getElementById('loginEmail');
      if (loginEmailInput && prefillEmail) loginEmailInput.value = prefillEmail;
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      showToast('Authenticating credentials...', 'info');
      const res = await API.login(email, password);
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome back, ${res.user.name}!`, 'success');

      if (authCallback) {
        authCallback();
        authCallback = null;
      } else if (res.user.role === 'admin') {
        switchView('adminView');
      } else {
        switchView('studentView');
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Check email/password.', 'error');
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminLoginEmail').value.trim();
    const password = document.getElementById('adminLoginPassword').value;

    try {
      showToast('Authenticating Administrator credentials...', 'info');
      // Pass 'admin' as requiredRole so the backend verifies admin role strictly
      const res = await API.login(email, password, 'admin');

      // Double-check role on response
      if (res.user.role !== 'admin') {
        API.logout();
        updateAuthUI();
        throw new Error('Access Denied: Only authorized HQ Administrators are permitted to log in here.');
      }

      updateAuthUI();
      closeAuthModal();
      showToast(`🎖️ Access Granted! Welcome to HQ Admin Command Center, ${res.user.name}.`, 'success');

      switchView('adminView');
    } catch (err) {
      console.error('Admin login failed:', err);
      showToast(err.message || 'Admin authentication failed.', 'error');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const targetExam = document.getElementById('regTargetExam').value;
    const force = document.getElementById('regForce').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const dupAlert = document.getElementById('regDuplicateAlert');
    if (dupAlert) { dupAlert.style.display = 'none'; dupAlert.innerHTML = ''; }

    try {
      showToast('Creating candidate defense account...', 'info');
      const res = await API.register({ name, email, password, targetExam, force, phone });
      updateAuthUI();
      closeAuthModal();
      showToast(`Account registered successfully! Assigned Roll: ${res.user.rollNo}`, 'success');

      if (authCallback) {
        authCallback();
        authCallback = null;
      } else {
        switchView('studentView');
      }
    } catch (err) {
      if (err.data && err.data.alreadyRegistered && dupAlert) {
        const info = err.data.existingAccount || {};
        const loginHint = info.email || info.maskedEmail || email;
        const prefill = info.email || '';
        dupAlert.innerHTML = `
          <div style="font-weight: 700; color: #fca5a5; margin-bottom: 0.35rem;">
            ⚠️ Account Already Exists!
          </div>
          <p style="margin: 0 0 0.65rem 0; line-height: 1.45;">
            You already registered previously with <strong>${escapeHtml(loginHint)}</strong>${info.rollNo ? ` (Roll: <code>${escapeHtml(info.rollNo)}</code>)` : ''}. Please log in or reset your password instead of creating a duplicate account.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn-3d" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;" onclick="App.setAuthMode('forgot', '${escapeHtml(prefill)}')">
              🔑 Reset Password
            </button>
            <button type="button" class="btn-demo-pill" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; border-color: #38bdf8; color: #38bdf8;" onclick="App.setAuthMode('login', '${escapeHtml(prefill)}')">
              ➡️ Go to Login
            </button>
          </div>
        `;
        dupAlert.style.display = 'block';
      }
      showToast(err.message || 'Registration failed.', 'error');
    }
  }

  let activeResetEmail = '';

  async function handleForgotLookup(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    try {
      showToast('Checking candidate account...', 'info');
      const res = await API.forgotPassword(email);
      activeResetEmail = res.hints.email;
      const hintsBox = document.getElementById('forgotHintsBox');
      if (hintsBox) {
        const parts = [];
        if (res.hints.rollNoHint) parts.push(`Roll No: <strong>${escapeHtml(res.hints.rollNoHint)}</strong>`);
        if (res.hints.maskedPhone) parts.push(`Phone: <strong>${escapeHtml(res.hints.maskedPhone)}</strong>`);
        hintsBox.innerHTML = `
          <div>Account Found: <strong>${escapeHtml(res.hints.email)}</strong></div>
          <div style="margin-top: 0.25rem;">Verify using ${parts.join(' or ') || 'your Roll Number'}.</div>
          ${res.hints.authProvider === 'google' ? '<div style="margin-top:0.25rem; color:#fde047;">Tip: You can also sign in directly using the Google button.</div>' : ''}
        `;
      }
      document.getElementById('forgotStep1Form').style.display = 'none';
      document.getElementById('forgotStep2Form').style.display = 'block';
      showToast('Account verified! Enter your Roll No or Phone to reset password.', 'success');
    } catch (err) {
      showToast(err.message || 'Unable to locate candidate account.', 'error');
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    const verificationValue = document.getElementById('resetVerifyInput').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;
    try {
      showToast('Updating password...', 'info');
      const res = await API.resetPassword(activeResetEmail, verificationValue, newPassword);
      showToast(res.message || 'Password reset successful!', 'success');
      setAuthMode('login', activeResetEmail);
    } catch (err) {
      showToast(err.message || 'Password reset failed.', 'error');
    }
  }

  async function handleGoogleAuth() {
    try {
      if (!window.CommandoFirebase || !window.CommandoFirebase.isReady()) {
        window.CommandoFirebase && window.CommandoFirebase.init();
      }
      const fbAuth = window.CommandoFirebase && window.CommandoFirebase.getAuth();
      if (!fbAuth || typeof firebase === 'undefined' || !firebase.auth) {
        throw new Error('Google Sign-In SDK is still loading. Please try again in a moment.');
      }

      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      showToast('Opening Google Sign-In...', 'info');

      try {
        const result = await fbAuth.signInWithPopup(provider);
        const idToken = await result.user.getIdToken();
        await completeGoogleServerLogin(idToken);
      } catch (popupErr) {
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/operation-not-supported-in-this-environment') {
          showToast('Redirecting to Google Sign-In...', 'info');
          await fbAuth.signInWithRedirect(provider);
          return;
        }
        throw popupErr;
      }
    } catch (err) {
      console.error('Google Sign-In error:', err);
      const msg = err.code === 'auth/popup-closed-by-user'
        ? 'Google Sign-In cancelled.'
        : (err.message || 'Google Sign-In failed. Ensure Google provider is enabled in Firebase Console.');
      showToast(msg, 'error');
    }
  }

  async function handleGoogleRedirectResult() {
    const fbAuth = window.CommandoFirebase && window.CommandoFirebase.getAuth();
    if (!fbAuth) return;
    const result = await fbAuth.getRedirectResult();
    if (result && result.user) {
      const idToken = await result.user.getIdToken();
      await completeGoogleServerLogin(idToken);
    }
  }

  async function completeGoogleServerLogin(idToken) {
    const targetExamEl = document.getElementById('regTargetExam');
    const forceEl = document.getElementById('regForce');
    const res = await API.googleAuth(
      idToken,
      targetExamEl ? targetExamEl.value : 'CAPF',
      forceEl ? forceEl.value : 'Paramilitary Forces'
    );
    updateAuthUI();
    closeAuthModal();
    showToast(res.message || `Welcome, ${res.user.name}!`, 'success');
    if (authCallback) {
      authCallback();
      authCallback = null;
    } else {
      switchView('studentView');
    }
  }

  function handleLogout() {
    API.logout();
    updateAuthUI();
    switchView('homeView');
    showToast('Logged out successfully', 'info');
  }

  // =========================================================================
  // CAPF COMBAT BACKGROUND SLIDESHOW CONTROLLER
  // =========================================================================
  let currentCombatSlide = 0;
  let combatSlideTimer = null;
  let isCombatSlidePlaying = true;
  const COMBAT_SLIDE_DURATION = 5500; // 5.5 seconds per slide

  function initCombatSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides || slides.length === 0) return;

    startCombatSlideTimer();

    // Pause on hover over HUD controls
    const hud = document.querySelector('.combat-slider-hud');
    if (hud) {
      hud.addEventListener('mouseenter', () => {
        if (isCombatSlidePlaying) clearInterval(combatSlideTimer);
      });
      hud.addEventListener('mouseleave', () => {
        if (isCombatSlidePlaying) startCombatSlideTimer();
      });
    }
  }

  function startCombatSlideTimer() {
    clearInterval(combatSlideTimer);
    combatSlideTimer = setInterval(() => {
      nextCombatSlide();
    }, COMBAT_SLIDE_DURATION);
  }

  function showCombatSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hud-dot');
    const captionEl = document.getElementById('combatSlideCaption');
    const counterEl = document.getElementById('combatSlideCounter');

    if (!slides || slides.length === 0) return;

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentCombatSlide = index;

    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        if (captionEl) {
          const cap = slide.getAttribute('data-caption') || 'CAPF COMBAT PATROL & TACTICAL ASSAULT';
          captionEl.textContent = cap;
        }
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    if (counterEl) {
      const pad = (n) => String(n).padStart(2, '0');
      counterEl.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
    }
  }

  function nextCombatSlide() {
    showCombatSlide(currentCombatSlide + 1);
  }

  function prevCombatSlide() {
    showCombatSlide(currentCombatSlide - 1);
  }

  function goToCombatSlide(index) {
    showCombatSlide(index);
    if (isCombatSlidePlaying) startCombatSlideTimer();
  }

  function toggleCombatSlider() {
    const btn = document.getElementById('combatSlidePlayBtn');
    isCombatSlidePlaying = !isCombatSlidePlaying;

    if (isCombatSlidePlaying) {
      startCombatSlideTimer();
      if (btn) btn.textContent = '⏸️';
      showToast('Combat recon slideshow resumed', 'info');
    } else {
      clearInterval(combatSlideTimer);
      if (btn) btn.textContent = '▶️';
      showToast('Combat recon slideshow paused', 'info');
    }
  }

  // General Modal helper
  function openGeneralModal(html) {
    if (html) {
      const content = document.getElementById('generalModalContent');
      if (content) content.innerHTML = html;
    }
    const modal = document.getElementById('generalModal');
    if (modal) modal.classList.add('active');
  }

  function closeGeneralModal() {
    const modal = document.getElementById('generalModal');
    if (modal) modal.classList.remove('active');
  }

  // =========================================================================
  // MOCK TEST PACKAGES COMMERCE ENROLLMENT
  // =========================================================================
  function getEnrollmentPricing(durationMonths, targetForce) {
    const isAll = (targetForce || '').toUpperCase() === 'ALL';
    const is6m = Number(durationMonths) === 6;

    if (is6m) {
      return {
        price: isAll ? 550 : 199,
        testsCount: isAll ? 60 : 10,
        name: isAll ? 'Commando All-Force Pro Pass (All 60 Full-Length Mocks)' : `Commando Pro Pass (${targetForce} Special - 10 Tests)`,
        duration: '6 Months Validity',
        packageId: isAll ? 'pkg_all_6m' : 'pkg_199_6m'
      };
    } else {
      return {
        price: isAll ? 300 : 100,
        testsCount: isAll ? 60 : 10,
        name: isAll ? 'Tactical All-Force Pass (All 60 Full-Length Mocks)' : `Tactical Pass (${targetForce} Special - 10 Tests)`,
        duration: '2 Months Validity',
        packageId: isAll ? 'pkg_all_2m' : 'pkg_100_2m'
      };
    }
  }

  function onEnrollmentConfigChange() {
    const durationEl = document.querySelector('input[name="enrollmentDuration"]:checked');
    const forceSelect = document.getElementById('enrollmentForceSelect');
    if (!durationEl || !forceSelect) return;

    const durationMonths = parseInt(durationEl.value, 10);
    const targetForce = forceSelect.value;
    const info = getEnrollmentPricing(durationMonths, targetForce);

    const priceDisplay = document.getElementById('enrollmentPriceDisplay');
    const quotaDisplay = document.getElementById('enrollmentQuotaDisplay');
    const planNameDisplay = document.getElementById('enrollmentPlanNameDisplay');
    const validityDisplay = document.getElementById('enrollmentValidityDisplay');
    const payBtn = document.getElementById('enrollmentPayBtn');

    if (priceDisplay) priceDisplay.textContent = `₹${info.price} Only`;
    if (quotaDisplay) quotaDisplay.textContent = `${info.testsCount} Full-Length CBT Tests ${targetForce === 'ALL' ? '(All Forces)' : '(' + targetForce + ')'}`;
    if (planNameDisplay) planNameDisplay.textContent = info.name;
    if (validityDisplay) validityDisplay.textContent = info.duration;
    if (payBtn) {
      payBtn.innerHTML = `⚡ Pay ₹${info.price} & Activate Pass`;
      payBtn.setAttribute('data-pkg-id', info.packageId);
    }
  }

  function openPackageEnrollment(packageId = 'pkg_100_2m', preselectedForce = '') {
    const user = API.getUser();
    if (!user) {
      openAuthModal('login', () => openPackageEnrollment(packageId, preselectedForce));
      showToast('Please sign in with your candidate account to enroll in test passes.', 'info');
      return;
    }

    const initialDuration = (packageId === 'pkg_199_6m' || packageId === 'pkg_all_6m') ? 6 : 2;
    const defaultForce = preselectedForce || (user.activePackage && user.activePackage.targetForce) || user.force || 'CRPF';
    const forces = ['CRPF', 'CISF', 'BSF', 'ITBP', 'SSB', 'Assam Rifles', 'ALL'];

    const initialPricing = getEnrollmentPricing(initialDuration, defaultForce);

    const forceOptionsHtml = forces.map(f => {
      const isSelected = f.toLowerCase() === defaultForce.toLowerCase() ? 'selected' : '';
      const label = f === 'ALL'
        ? '🌟 ALL CAPF FORCES (All 60 Mocks: 2 Mo = ₹300 | 6 Mo = ₹550)'
        : `🛡️ ${f} (10 Full-Length Mocks: 2 Mo = ₹100 | 6 Mo = ₹199)`;
      return `<option value="${escapeHtml(f)}" ${isSelected}>${label}</option>`;
    }).join('');

    const modalContent = `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <span style="font-size: 2.5rem;">🎖️</span>
        <h2 style="color: #fff; font-size: 1.6rem; margin-top: 0.3rem;">DEFENSE TEST PASS ENROLLMENT</h2>
        <p style="color: #94a3b8; font-size: 0.88rem;">Instant activation on your official Candidate Roll Number</p>
      </div>

      <!-- Duration Selection Switcher -->
      <div style="margin-bottom: 1.25rem; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.85rem;">
        <label style="color: #cbd5e1; font-size: 0.85rem; font-family: var(--font-military); letter-spacing: 1px; display: block; margin-bottom: 0.6rem; font-weight: 700;">
          ⏳ 1. CHOOSE PASS VALIDITY DURATION:
        </label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <label style="display: flex; align-items: center; gap: 0.6rem; background: rgba(30, 41, 59, 0.8); border: 1.5px solid #3b82f6; border-radius: 8px; padding: 0.65rem 0.85rem; cursor: pointer;">
            <input type="radio" name="enrollmentDuration" value="2" ${initialDuration === 2 ? 'checked' : ''} onchange="App.onEnrollmentConfigChange()" style="accent-color: #3b82f6; transform: scale(1.2);">
            <div>
              <div style="color: #fff; font-weight: 700; font-size: 0.95rem;">2 MONTHS PASS</div>
              <div style="color: #94a3b8; font-size: 0.75rem;">₹100 Single / ₹300 All Mocks</div>
            </div>
          </label>
          <label style="display: flex; align-items: center; gap: 0.6rem; background: rgba(30, 41, 59, 0.8); border: 1.5px solid #f59e0b; border-radius: 8px; padding: 0.65rem 0.85rem; cursor: pointer;">
            <input type="radio" name="enrollmentDuration" value="6" ${initialDuration === 6 ? 'checked' : ''} onchange="App.onEnrollmentConfigChange()" style="accent-color: #f59e0b; transform: scale(1.2);">
            <div>
              <div style="color: #fbbf24; font-weight: 700; font-size: 0.95rem;">6 MONTHS PRO PASS</div>
              <div style="color: #94a3b8; font-size: 0.75rem;">₹199 Single / ₹550 All Mocks</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Target Force Selection Option in Payment -->
      <div style="margin-bottom: 1.25rem; background: rgba(30, 41, 59, 0.7); border: 1.5px solid #3b82f6; border-radius: 10px; padding: 1rem;">
        <label for="enrollmentForceSelect" style="color: #60a5fa; font-size: 0.88rem; font-family: var(--font-military); letter-spacing: 1px; display: block; margin-bottom: 0.5rem; font-weight: 700;">
          🎯 2. SELECT TARGET CAPF FORCE TO UNLOCK:
        </label>
        <select id="enrollmentForceSelect" onchange="App.onEnrollmentConfigChange()" style="width: 100%; padding: 0.75rem 0.85rem; background: #0b1324; border: 1px solid #3b82f6; border-radius: 8px; color: #fbbf24; font-size: 0.95rem; font-weight: 700; outline: none; cursor: pointer;">
          ${forceOptionsHtml}
        </select>
        <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 0.5rem; line-height: 1.4;">
          💡 <strong>Pricing Rules:</strong> Particular force: <strong>₹100</strong> (2 mo) / <strong>₹199</strong> (6 mo). All 60 Mocks across all forces: <strong>₹300</strong> (2 mo) / <strong>₹550</strong> (6 mo).
        </div>
      </div>

      <!-- Live Plan Summary Box -->
      <div class="enrollment-summary-box">
        <div class="enrollment-summary-row">
          <span style="color: #94a3b8;">Candidate Name</span>
          <span style="font-weight: 600; color: #fff;">${escapeHtml(user.name)}</span>
        </div>
        <div class="enrollment-summary-row">
          <span style="color: #94a3b8;">Assigned Roll Number</span>
          <span style="font-family: var(--font-military); color: #fbbf24;">${escapeHtml(user.rollNo || 'CB2026')}</span>
        </div>
        <div class="enrollment-summary-row">
          <span style="color: #94a3b8;">Selected Pass</span>
          <span id="enrollmentPlanNameDisplay" style="font-weight: 700; color: #6ee7b7;">${escapeHtml(initialPricing.name)}</span>
        </div>
        <div class="enrollment-summary-row">
          <span style="color: #94a3b8;">Mock Tests Quota</span>
          <span id="enrollmentQuotaDisplay" style="font-weight: 600; color: #fff;">${initialPricing.testsCount} Full-Length CBT Tests</span>
        </div>
        <div class="enrollment-summary-row">
          <span style="color: #94a3b8;">Validity Period</span>
          <span id="enrollmentValidityDisplay" style="font-weight: 600; color: #fff;">${initialPricing.duration}</span>
        </div>
        <div class="enrollment-summary-row">
          <span>Total Payable Amount</span>
          <span id="enrollmentPriceDisplay" style="color: #fbbf24; font-size: 1.15rem; font-weight: 800;">₹${initialPricing.price} Only</span>
        </div>
      </div>

      <div style="margin: 1.25rem 0;">
        <label style="color: #cbd5e1; font-size: 0.85rem; font-family: var(--font-military); letter-spacing: 1px;">SECURE CASHFREE PAYMENT GATEWAY (UPI / CARDS / NETBANKING):</label>
        <div class="payment-options-grid">
          <div class="pay-option-card active" onclick="this.parentNode.querySelectorAll('.pay-option-card').forEach(c=>c.classList.remove('active')); this.classList.add('active');">
            <div class="pay-option-icon">📱</div>
            <div class="pay-option-name">UPI / QR (BHIM/GPay)</div>
          </div>
          <div class="pay-option-card" onclick="this.parentNode.querySelectorAll('.pay-option-card').forEach(c=>c.classList.remove('active')); this.classList.add('active');">
            <div class="pay-option-icon">💳</div>
            <div class="pay-option-name">Debit / RuPay Card</div>
          </div>
          <div class="pay-option-card" onclick="this.parentNode.querySelectorAll('.pay-option-card').forEach(c=>c.classList.remove('active')); this.classList.add('active');">
            <div class="pay-option-icon">🏦</div>
            <div class="pay-option-name">Net Banking / SBI</div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
        <button class="btn-demo-pill" style="flex: 1;" onclick="App.closeGeneralModal()">Cancel</button>
        <button class="btn-3d btn-3d-success" id="enrollmentPayBtn" data-pkg-id="${initialPricing.packageId}" style="flex: 2; font-size: 1rem;" onclick="App.confirmPackageEnrollment()">
          ⚡ Pay ₹${initialPricing.price} & Activate Pass
        </button>
      </div>
    `;

    openGeneralModal(modalContent);
  }

  function updatePackagesUI() {
    const user = API.getUser();
    const pkg100 = document.getElementById('pkgCard100');
    const pkg199 = document.getElementById('pkgCard199');
    if (!pkg100 || !pkg199) return;

    const action100 = pkg100.querySelector('.pkg-action-wrap');
    const action199 = pkg199.querySelector('.pkg-action-wrap');

    pkg100.classList.remove('pkg-card-active');
    pkg199.classList.remove('pkg-card-active');

    // Remove old ribbon if any
    const existingRibbon = document.getElementById('activePassNoticeRibbon');
    if (existingRibbon) existingRibbon.remove();

    if (user && user.activePackage && user.activePackage.status === 'ACTIVE') {
      const activePkg = user.activePackage;
      const expiryDate = new Date(activePkg.expiresAt).toLocaleDateString('en-IN');
      const isAll = (activePkg.targetForce || '').toUpperCase() === 'ALL';

      // Insert top active pass notification ribbon
      const grid = document.querySelector('.packages-grid');
      if (grid && !document.getElementById('activePassNoticeRibbon')) {
        const ribbon = document.createElement('div');
        ribbon.id = 'activePassNoticeRibbon';
        ribbon.className = 'active-pass-notice-ribbon';
        const targetForceBadge = isAll ? ' [ALL CAPF FORCES UNLOCKED]' : ` [${escapeHtml(activePkg.targetForce)} SPECIAL]`;
        ribbon.innerHTML = `
          <div class="active-pass-ribbon-left">
            <span class="active-pass-ribbon-badge">🟢 YOU HAVE AN ACTIVE PASS</span>
            <div style="display: flex; flex-direction: column; gap: 0.15rem;">
              <span class="active-pass-ribbon-title">${escapeHtml(activePkg.name)}${targetForceBadge}</span>
              <span class="active-pass-ribbon-meta">🎯 Unlocked Force: <strong style="color: #fbbf24;">${isAll ? 'ALL 6 CAPF FORCES' : escapeHtml(activePkg.targetForce)}</strong> • Quota: <strong>${activePkg.testsCount} Full-Length Tests</strong> • ⏳ Valid until: <strong>${expiryDate}</strong></span>
            </div>
          </div>
          <button class="btn-demo-pill" style="border-color: #34d399; color: #34d399;" onclick="App.switchView('studentView')">
            View Pass in Dashboard ➔
          </button>
        `;
        grid.parentNode.insertBefore(ribbon, grid);
      }

      if (isAll) {
        pkg100.classList.add('pkg-card-active');
        pkg199.classList.add('pkg-card-active');
        if (action100) {
          action100.innerHTML = `
            <button class="btn-demo-pill" style="width: 100%; border-color: #34d399; color: #34d399; padding: 0.65rem;" onclick="App.switchView('studentView')">
              ✓ All 60 Tests Unlocked & Active
            </button>
          `;
        }
        if (action199) {
          action199.innerHTML = `
            <button class="btn-3d btn-3d-success pkg-cta-btn" style="background: linear-gradient(180deg, #16a34a, #15803d); border-color: #4ade80; cursor: default;">
              👑 ACTIVE ALL-FORCE PRO PASS (60 Tests Active)
            </button>
          `;
        }
      } else if (activePkg.durationMonths === 2 || activePkg.id === 'pkg_100_2m') {
        pkg100.classList.add('pkg-card-active');
        if (action100) {
          action100.innerHTML = `
            <button class="btn-3d btn-3d-success pkg-cta-btn" style="background: linear-gradient(180deg, #16a34a, #15803d); border-color: #4ade80; cursor: default;">
              ✓ ACTIVE PASS (${escapeHtml(activePkg.targetForce || 'CRPF')} - 10 Tests Active)
            </button>
          `;
        }
        if (action199) {
          action199.innerHTML = `
            <button class="btn-3d pkg-cta-btn" onclick="App.openPackageEnrollment('pkg_199_6m')">
              ⚡ Upgrade to 6-Month Pro Pass • ₹199
            </button>
          `;
        }
      } else if (activePkg.durationMonths === 6 || activePkg.id === 'pkg_199_6m') {
        pkg199.classList.add('pkg-card-active');
        if (action199) {
          action199.innerHTML = `
            <button class="btn-3d btn-3d-success pkg-cta-btn" style="background: linear-gradient(180deg, #16a34a, #15803d); border-color: #4ade80; cursor: default;">
              👑 ACTIVE PRO PASS (${escapeHtml(activePkg.targetForce || 'ALL')} - Active)
            </button>
          `;
        }
        if (action100) {
          action100.innerHTML = `
            <button class="btn-demo-pill" style="width: 100%; border-color: #34d399; color: #34d399; padding: 0.65rem;" onclick="App.switchView('studentView')">
              ✓ Covered by Commando Pro Pass
            </button>
          `;
        }
      }
    } else {
      if (action100) {
        action100.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            <button class="btn-3d btn-3d-secondary pkg-cta-btn" onclick="App.openPackageEnrollment('pkg_100_2m')">
              ⚡ Single Force Pass • ₹100
            </button>
            <button class="btn-demo-pill" style="border-color: #38bdf8; color: #38bdf8; width: 100%; padding: 0.55rem; font-weight: 700; font-size: 0.82rem;" onclick="App.openPackageEnrollment('pkg_100_2m', 'ALL')">
              🌟 All Forces (All 60 Mocks) • ₹300
            </button>
          </div>
        `;
      }
      if (action199) {
        action199.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            <button class="btn-3d pkg-cta-btn" onclick="App.openPackageEnrollment('pkg_199_6m')">
              ⚡ Single Force Pro • ₹199
            </button>
            <button class="btn-demo-pill" style="border-color: #fbbf24; color: #fbbf24; width: 100%; padding: 0.55rem; font-weight: 700; font-size: 0.82rem;" onclick="App.openPackageEnrollment('pkg_199_6m', 'ALL')">
              👑 All Forces Mega Pro (All 60 Mocks) • ₹550
            </button>
          </div>
        `;
      }
    }
  }

  function renderCashfreeReceiptModal(pkg, user, fallbackForce = 'CAPF') {
    const receiptHtml = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(34, 197, 94, 0.15); border: 2px solid #22c55e; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; font-size: 2.2rem; box-shadow: 0 0 25px rgba(34,197,94,0.3);">
            ✅
          </div>
          <div style="display: inline-block; background: rgba(34,197,94,0.15); border: 1px solid #22c55e; color: #4ade80; font-family: var(--font-military); font-weight: 800; font-size: 0.82rem; letter-spacing: 1.5px; padding: 0.25rem 0.85rem; border-radius: 999px; margin-bottom: 0.5rem;">
            🟢 CASHFREE PAYMENT VERIFIED • PASS ACTIVE
          </div>
          <h2 style="color: #ffffff; font-size: 1.6rem; margin-top: 0.2rem;">${escapeHtml(pkg.name)}</h2>
          <p style="color: #94a3b8; font-size: 0.88rem;">Official Defense CBT Exam Access has been permanently activated on your Roll Number for <strong>${escapeHtml(pkg.targetForce || fallbackForce)}</strong>.</p>
        </div>

        <div class="active-pass-receipt-box">
          <div class="receipt-row">
            <span class="receipt-label">Pass Status</span>
            <span class="receipt-val" style="color: #4ade80; font-weight: 800;">🟢 ACTIVE PASS</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Assigned Candidate</span>
            <span class="receipt-val">${escapeHtml(user.name)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Official Roll No</span>
            <span class="receipt-val" style="font-family: monospace; color: #fbbf24;">${escapeHtml(user.rollNo)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Target Force Unlocked</span>
            <span class="receipt-val" style="color: #38bdf8; font-weight: 800;">🛡️ ${escapeHtml(pkg.targetForce || fallbackForce)}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Mock Tests Quota</span>
            <span class="receipt-val" style="color: #6ee7b7; font-weight: 700;">${pkg.testsCount} Full-Length CBT Tests</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Pass Validity</span>
            <span class="receipt-val">${pkg.durationMonths} Months (Valid until ${new Date(pkg.expiresAt).toLocaleDateString('en-IN')})</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Amount Paid</span>
            <span class="receipt-val" style="color: #ffffff; font-weight: 700;">₹${pkg.price} (Cashfree Verified)</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Transaction Reference</span>
            <span class="receipt-val" style="font-family: monospace; color: #93c5fd;">${escapeHtml(pkg.transactionId || pkg.orderId || 'CASHFREE-VERIFIED')}</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap;">
          <button class="btn-3d btn-3d-success" style="flex: 1; min-width: 200px;" onclick="App.closeGeneralModal(); App.switchView('homeView'); document.getElementById('testsSection').scrollIntoView({behavior: 'smooth'});">
            ⚡ Start CBT Mock Test Now
          </button>
          <button class="btn-3d btn-3d-secondary" style="flex: 1; min-width: 200px;" onclick="App.closeGeneralModal(); App.switchView('studentView');">
            📊 View in Student Dashboard
          </button>
        </div>
      `;

    openGeneralModal(receiptHtml);
    showToast(`🎉 Payment Confirmed! ${pkg.name} is now ACTIVE.`, 'success');
  }

  async function handleCashfreeReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    const cfOrderId = params.get('cf_order_id');
    if (!cfOrderId) return;

    // Clean query string cleanly without reloading
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    if (!API.getToken()) return;
    showToast('Verifying your Cashfree payment...', 'info');
    try {
      const res = await API.verifyCashfreeOrder(cfOrderId);
      if (res && res.verified && res.package && res.user) {
        updateAuthUI();
        updatePackagesUI();
        loadTests();
        renderCashfreeReceiptModal(res.package, res.user);
      }
    } catch (err) {
      showToast(err.message || 'Payment verification pending or incomplete.', 'warning');
    }
  }

  async function confirmPackageEnrollment(overridePackageId = null) {
    try {
      const forceSelect = document.getElementById('enrollmentForceSelect');
      const targetForce = forceSelect ? forceSelect.value : 'CRPF';
      const durationEl = document.querySelector('input[name="enrollmentDuration"]:checked');
      const durationMonths = durationEl ? parseInt(durationEl.value, 10) : 2;

      const pricing = getEnrollmentPricing(durationMonths, targetForce);
      const packageId = overridePackageId || pricing.packageId;

      showToast(`Creating Cashfree payment order for ₹${pricing.price}...`, 'info');
      const orderRes = await API.createCashfreeOrder(packageId, targetForce, durationMonths);

      if (typeof window.Cashfree !== 'function') {
        throw new Error('Cashfree Checkout SDK failed to load. Please refresh the page and try again.');
      }

      closeGeneralModal();
      const cashfree = window.Cashfree({ mode: orderRes.mode || 'sandbox' });
      const checkoutResult = await cashfree.checkout({
        paymentSessionId: orderRes.paymentSessionId,
        redirectTarget: '_modal'
      });

      if (checkoutResult && checkoutResult.error) {
        throw new Error(checkoutResult.error.message || 'Cashfree payment cancelled or failed.');
      }

      showToast('Verifying Cashfree payment with server...', 'info');
      const verifyRes = await API.verifyCashfreeOrder(orderRes.orderId);
      if (!verifyRes || !verifyRes.verified) {
        throw new Error('Payment could not be confirmed yet.');
      }

      updateAuthUI();
      updatePackagesUI();
      loadTests();
      renderCashfreeReceiptModal(verifyRes.package, verifyRes.user, targetForce);
    } catch (err) {
      showToast(err.message || 'Payment activation failed. Please try again.', 'error');
    }
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitEnquiry');
    const form = document.getElementById('formEnquiry');
    const successCard = document.getElementById('enquirySuccessCard');

    const name = document.getElementById('enquiryName').value.trim();
    const phone = document.getElementById('enquiryPhone').value.trim();
    const email = document.getElementById('enquiryEmail').value.trim();
    const targetExam = document.getElementById('enquiryTargetExam').value;
    const message = document.getElementById('enquiryMessage').value.trim();

    if (!name || !phone || !email || !message) {
      showToast('Please fill in all required enquiry fields.', 'error');
      return;
    }

    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting your enquiry...';
      }

      showToast('Submitting your examination enquiry to Defense Helpdesk...', 'info');
      const res = await API.submitEnquiry({ name, phone, email, targetExam, message });

      if (form) form.style.display = 'none';
      if (successCard) {
        successCard.innerHTML = `
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h3 style="color: #4ade80; font-size: 1.4rem; margin-bottom: 0.3rem;">EXAM ENQUIRY REGISTERED</h3>
          <p style="color: #cbd5e1; font-size: 0.92rem;">Your official helpdesk tracking ticket has been assigned:</p>
          <div class="ticket-number-pill">TICKET #${res.ticketNo}</div>
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; margin: 1.25rem 0; text-align: left; font-size: 0.88rem; color: #cbd5e1;">
            <div><strong>Candidate:</strong> ${escapeHtml(res.enquiry.name)}</div>
            <div><strong>Contact:</strong> ${escapeHtml(res.enquiry.phone)} • ${escapeHtml(res.enquiry.email)}</div>
            <div><strong>Target Exam:</strong> <span style="color: #fbbf24;">${escapeHtml(res.enquiry.targetExam)}</span></div>
            <div style="margin-top: 0.4rem; color: #94a3b8; font-style: italic;">"${escapeHtml(res.enquiry.message)}"</div>
          </div>
          <p style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 1.25rem;">Our defense academic counselors will call or WhatsApp you on <strong>${escapeHtml(res.enquiry.phone)}</strong> within 24 hours.</p>
          <button class="btn-demo-pill" style="border-color: #4ade80; color: #4ade80;" onclick="App.resetEnquiryForm()">
            + Submit Another Enquiry
          </button>
        `;
        successCard.style.display = 'block';
      }

      showToast(`✅ Enquiry #${res.ticketNo} submitted successfully!`, 'success');
    } catch (err) {
      console.error('Enquiry submission error:', err);
      showToast(err.message || 'Failed to submit enquiry. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '⚡ Submit Exam Enquiry & Request Callback';
      }
    }
  }

  function resetEnquiryForm() {
    const form = document.getElementById('formEnquiry');
    const successCard = document.getElementById('enquirySuccessCard');
    const msg = document.getElementById('enquiryMessage');
    if (form) {
      form.style.display = 'block';
      if (msg) msg.value = '';
    }
    if (successCard) {
      successCard.style.display = 'none';
      successCard.innerHTML = '';
    }
  }

  // Toast Notification
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function checkPausedSession() {
    const banner = document.getElementById('cbtPausedBanner');
    if (!banner) return;

    const raw = localStorage.getItem('cbt_paused_session');
    if (!raw) {
      banner.style.display = 'none';
      banner.innerHTML = '';
      return;
    }

    try {
      const session = JSON.parse(raw);
      const remainingSecs = typeof session.remainingSeconds === 'number' ? session.remainingSeconds : 0;
      const hours = Math.floor(remainingSecs / 3600);
      const minutes = Math.floor((remainingSecs % 3600) / 60);
      const seconds = remainingSecs % 60;
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = hours > 0
        ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(minutes)}:${pad(seconds)}`;

      const attempted = session.answeredCount || 0;
      const total = session.totalQuestions || 0;

      banner.innerHTML = `
        <div class="cbt-paused-banner-inner">
          <div class="paused-banner-left">
            <span class="paused-banner-tag">⏸️ TEST PAUSED</span>
            <div class="paused-banner-text">
              <span>Candidate Mock in Progress:</span>
              <span class="paused-banner-title">${escapeHtml(session.testTitle || 'Active Mock')}</span>
              <span class="paused-banner-meta">⏳ Time Left: ${timeStr} • 📝 Attempted: ${attempted}/${total}</span>
            </div>
          </div>
          <div class="paused-banner-right">
            <button class="btn-paused-resume-banner" onclick="CBTEngine.resumeFromStorage()">
              ▶️ Resume Mock Test
            </button>
            <button class="btn-paused-discard-banner" onclick="CBTEngine.discardPausedSession()" title="Discard this paused test">
              ✕ Discard
            </button>
          </div>
        </div>
      `;
      banner.style.display = 'block';
    } catch (e) {
      console.warn('Invalid paused session:', e);
      banner.style.display = 'none';
      banner.innerHTML = '';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    init,
    toggleMobileMenu,
    switchView,
    loadTests,
    openAuthModal,
    closeAuthModal,
    setAuthMode,
    handleLogin,
    handleAdminLogin,
    handleRegister,
    handleForgotLookup,
    handleResetPassword,
    handleGoogleAuth,
    handleLogout,
    openGeneralModal,
    closeGeneralModal,
    showToast,
    nextCombatSlide,
    prevCombatSlide,
    goToCombatSlide,
    toggleCombatSlider,
    openPackageEnrollment,
    confirmPackageEnrollment,
    onEnrollmentConfigChange,
    getEnrollmentPricing,
    checkPausedSession,
    handleEnquirySubmit,
    resetEnquiryForm
  };
})();

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
