/**
 * COMMANDO BATCH - CORE APPLICATION CONTROLLER
 * Routing, authentication state, 3D card tilts, category filters, and student dashboard.
 */

const App = (function () {
  let currentCategory = 'all';
  let allTests = [];
  let authCallback = null;

  async function init() {
    setupEventListeners();
    updateAuthUI();

    // Initialize CBT engine
    CBTEngine.init();

    // Initialize Three.js 3D Emblem
    if (window.initThreeBadge) {
      window.initThreeBadge();
    }

    // Initialize CAPF Combat Background Slideshow
    initCombatSlider();

    // Load initial mock tests
    await loadTests('all');

    // Enable 3D tilt effects
    setup3DTilt();

    // Check for paused CBT examination session
    checkPausedSession();

    // Update packages status for active pass
    updatePackagesUI();
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

  function switchView(viewName) {
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

  async function loadTests(category = 'all') {
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
      const data = await API.getTests(category);
      allTests = data.tests;
      renderTestCards(allTests);
    } catch (err) {
      console.error('Failed to load tests:', err);
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #ef4444;">
          Failed to load mock tests. Please check connection.
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
    const hasActivePass = user && user.activePackage && user.activePackage.status === 'ACTIVE';

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
      const isUnlocked = hasActivePass || (user && user.role === 'admin');

      let passTagHtml = '';
      if (isPaidTest) {
        if (isUnlocked) {
          passTagHtml = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 0.5rem 0; padding: 0.35rem 0.65rem; background: rgba(34, 197, 94, 0.12); border-radius: 6px; border: 1px solid rgba(34, 197, 94, 0.3);">
              <span class="test-pass-unlocked-tag">🟢 Included in Active Pass</span>
              <span style="font-size: 0.72rem; color: #4ade80; font-family: var(--font-military); letter-spacing: 0.5px; font-weight: 700;">✓ UNLOCKED</span>
            </div>
          `;
        } else {
          passTagHtml = `
            <div class="test-pass-locked-tag">
              <span>🔒 Paid Force Pass</span>
              <span style="font-size: 0.72rem; color: #fbbf24; font-family: var(--font-military); font-weight: 700;">₹100 / ₹199 PASS</span>
            </div>
          `;
        }
      } else {
        passTagHtml = `
          <div style="display: flex; align-items: center; justify-content: space-between; margin: 0.5rem 0; padding: 0.35rem 0.65rem; background: rgba(56, 189, 248, 0.08); border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.25);">
            <span style="font-size: 0.75rem; color: #38bdf8; font-family: var(--font-military); font-weight: 700;">🆓 Free Open Mock</span>
            <span style="font-size: 0.72rem; color: #38bdf8; font-family: var(--font-military);">AVAILABLE</span>
          </div>
        `;
      }

      let btnActionHtml = '';
      if (isPaidTest && !isUnlocked) {
        btnActionHtml = `
          <button class="btn-3d" style="width: 100%; background: linear-gradient(180deg, #d97706, #b45309); border-color: #f59e0b;" onclick="CBTEngine.startTest('${test.id}')">
            👑 Unlock with Pass • Start CBT
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

  function setAuthMode(mode) {
    const tabLogin = document.getElementById('authTabLogin');
    const tabAdminLogin = document.getElementById('authTabAdminLogin');
    const tabRegister = document.getElementById('authTabRegister');
    const formLogin = document.getElementById('formLogin');
    const formAdminLogin = document.getElementById('formAdminLogin');
    const formRegister = document.getElementById('formRegister');

    if (tabLogin) tabLogin.classList.remove('active');
    if (tabAdminLogin) tabAdminLogin.classList.remove('active');
    if (tabRegister) tabRegister.classList.remove('active');

    if (formLogin) formLogin.style.display = 'none';
    if (formAdminLogin) formAdminLogin.style.display = 'none';
    if (formRegister) formRegister.style.display = 'none';

    if (mode === 'admin-login') {
      if (tabAdminLogin) tabAdminLogin.classList.add('active');
      if (formAdminLogin) formAdminLogin.style.display = 'block';
    } else if (mode === 'register') {
      if (tabRegister) tabRegister.classList.add('active');
      if (formRegister) formRegister.style.display = 'block';
    } else {
      if (tabLogin) tabLogin.classList.add('active');
      if (formLogin) formLogin.style.display = 'block';
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
      showToast(err.message || 'Registration failed.', 'error');
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
  function openPackageEnrollment(packageId) {
    const user = API.getUser();
    if (!user) {
      openAuthModal('login', () => openPackageEnrollment(packageId));
      showToast('Please sign in with your candidate account to enroll in test passes.', 'info');
      return;
    }

    const pkgData = {
      pkg_100_2m: {
        id: 'pkg_100_2m',
        name: 'Tactical Pass (10 Full-Length Tests)',
        price: 100,
        testsCount: 10,
        duration: '2 Months Validity',
        badge: 'TACTICAL 2-MONTH PASS'
      },
      pkg_199_6m: {
        id: 'pkg_199_6m',
        name: 'Commando Pro Pass (20 Full-Length Tests)',
        price: 199,
        testsCount: 20,
        duration: '6 Months Validity',
        badge: 'COMMANDO 6-MONTH PRO PASS'
      }
    }[packageId] || {
      id: packageId,
      name: 'Test Pass',
      price: 100,
      testsCount: 10,
      duration: '2 Months',
      badge: 'PASS'
    };

    const modalContent = `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <span style="font-size: 2.5rem;">🎖️</span>
        <h2 style="color: #fff; font-size: 1.6rem; margin-top: 0.3rem;">DEFENSE TEST PASS ENROLLMENT</h2>
        <p style="color: #94a3b8; font-size: 0.88rem;">Instant activation on your official Candidate Roll Number</p>
      </div>

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
          <span style="font-weight: 700; color: #6ee7b7;">${escapeHtml(pkgData.name)}</span>
        </div>
        <div class="enrollment-summary-row">
          <span style="color: #94a3b8;">Mock Tests Quota</span>
          <span style="font-weight: 600; color: #fff;">${pkgData.testsCount} Full-Length CBT Tests</span>
        </div>
        <div class="enrollment-summary-row">
          <span style="color: #94a3b8;">Validity Period</span>
          <span style="font-weight: 600; color: #fff;">${pkgData.duration}</span>
        </div>
        <div class="enrollment-summary-row">
          <span>Total Payable Amount</span>
          <span>₹${pkgData.price} Only</span>
        </div>
      </div>

      <div style="margin: 1.25rem 0;">
        <label style="color: #cbd5e1; font-size: 0.85rem; font-family: var(--font-military); letter-spacing: 1px;">SELECT SIMULATED DEFENSE PAYMENT GATEWAY:</label>
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
        <button class="btn-3d btn-3d-success" style="flex: 2; font-size: 1rem;" onclick="App.confirmPackageEnrollment('${pkgData.id}')">
          ⚡ Pay ₹${pkgData.price} & Activate Pass
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

      // Insert top active pass notification ribbon
      const grid = document.querySelector('.packages-grid');
      if (grid && !document.getElementById('activePassNoticeRibbon')) {
        const ribbon = document.createElement('div');
        ribbon.id = 'activePassNoticeRibbon';
        ribbon.className = 'active-pass-notice-ribbon';
        ribbon.innerHTML = `
          <div class="active-pass-ribbon-left">
            <span class="active-pass-ribbon-badge">🟢 YOU HAVE AN ACTIVE PASS</span>
            <div style="display: flex; flex-direction: column; gap: 0.15rem;">
              <span class="active-pass-ribbon-title">${escapeHtml(activePkg.name)}</span>
              <span class="active-pass-ribbon-meta">🎯 Quota: <strong>${activePkg.testsCount} Full-Length Tests</strong> • ⏳ Valid until: <strong>${expiryDate}</strong></span>
            </div>
          </div>
          <button class="btn-demo-pill" style="border-color: #34d399; color: #34d399;" onclick="App.switchView('studentView')">
            View Pass in Dashboard ➔
          </button>
        `;
        grid.parentNode.insertBefore(ribbon, grid);
      }

      if (activePkg.id === 'pkg_100_2m') {
        pkg100.classList.add('pkg-card-active');
        if (action100) {
          action100.innerHTML = `
            <button class="btn-3d btn-3d-success pkg-cta-btn" style="background: linear-gradient(180deg, #16a34a, #15803d); border-color: #4ade80; cursor: default;">
              ✓ ACTIVE PASS (10 Tests Quota Active)
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
      } else if (activePkg.id === 'pkg_199_6m') {
        pkg199.classList.add('pkg-card-active');
        if (action199) {
          action199.innerHTML = `
            <button class="btn-3d btn-3d-success pkg-cta-btn" style="background: linear-gradient(180deg, #16a34a, #15803d); border-color: #4ade80; cursor: default;">
              👑 ACTIVE PRO PASS (20 Tests Quota Active)
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
          <button class="btn-3d btn-3d-secondary pkg-cta-btn" onclick="App.openPackageEnrollment('pkg_100_2m')">
            ⚡ Enroll in 2-Month Pass • ₹100
          </button>
        `;
      }
      if (action199) {
        action199.innerHTML = `
          <button class="btn-3d pkg-cta-btn" onclick="App.openPackageEnrollment('pkg_199_6m')">
            👑 Unlock 6-Month Pro Pass • ₹199
          </button>
        `;
      }
    }
  }

  async function confirmPackageEnrollment(packageId) {
    try {
      showToast('Processing simulated payment & activating mock test quota...', 'info');
      const res = await API.subscribePackage(packageId);

      const pkg = res.package;
      const user = res.user;

      updateAuthUI();
      updatePackagesUI();

      // Render official defense active pass confirmation modal
      const receiptHtml = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(34, 197, 94, 0.15); border: 2px solid #22c55e; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; font-size: 2.2rem; box-shadow: 0 0 25px rgba(34,197,94,0.3);">
            ✅
          </div>
          <div style="display: inline-block; background: rgba(34,197,94,0.15); border: 1px solid #22c55e; color: #4ade80; font-family: var(--font-military); font-weight: 800; font-size: 0.82rem; letter-spacing: 1.5px; padding: 0.25rem 0.85rem; border-radius: 999px; margin-bottom: 0.5rem;">
            🟢 PAYMENT SUCCESSFUL • PASS ACTIVE
          </div>
          <h2 style="color: #ffffff; font-size: 1.6rem; margin-top: 0.2rem;">${escapeHtml(pkg.name)}</h2>
          <p style="color: #94a3b8; font-size: 0.88rem;">Official Defense CBT Exam Access has been permanently activated on your Roll Number.</p>
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
            <span class="receipt-label">Mock Tests Quota</span>
            <span class="receipt-val" style="color: #6ee7b7; font-weight: 700;">${pkg.testsCount} Full-Length CBT Tests</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Pass Validity</span>
            <span class="receipt-val">${pkg.durationMonths} Months (Valid until ${new Date(pkg.expiresAt).toLocaleDateString('en-IN')})</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Amount Paid</span>
            <span class="receipt-val" style="color: #ffffff; font-weight: 700;">₹${pkg.price} (Verified)</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">Transaction Reference</span>
            <span class="receipt-val" style="font-family: monospace; color: #93c5fd;">${escapeHtml(pkg.transactionId || 'TXN-CB-849201')}</span>
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
    switchView,
    loadTests,
    openAuthModal,
    closeAuthModal,
    setAuthMode,
    handleLogin,
    handleAdminLogin,
    handleRegister,
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
    checkPausedSession,
    handleEnquirySubmit,
    resetEnquiryForm
  };
})();

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
