/**
 * COMMANDO BATCH - ADMIN PANEL CONTROLLER
 * Comprehensive administration panel for managing mock tests, questions, and inspecting student submissions.
 */

const Admin = (function () {
  let stats = null;
  let tests = [];
  let attempts = [];
  let users = [];
  let enquiries = [];
  let tempQuestions = [];

  async function loadAdminDashboard() {
    const user = API.getUser();
    if (!user || user.role !== 'admin') {
      App.showToast('Admin authorization required', 'error');
      App.switchView('homeView');
      return;
    }

    try {
      App.showToast('Loading Admin Command Center...', 'info');
      const [statsRes, testsRes, attemptsRes, usersRes, enquiriesRes] = await Promise.all([
        API.getAdminStats(),
        API.getAdminTests(),
        API.getAdminAttempts(),
        API.getAdminUsers(),
        API.getAdminEnquiries()
      ]);

      stats = statsRes.stats;
      tests = testsRes.tests;
      attempts = attemptsRes.attempts;
      users = usersRes.users;
      enquiries = enquiriesRes.enquiries || [];

      renderAdminPanel();
    } catch (err) {
      console.error('Failed to load admin data:', err);
      App.showToast(err.message || 'Error loading admin data', 'error');
    }
  }

  function renderAdminPanel() {
    const container = document.getElementById('adminPanelContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header-bar">
        <div class="panel-user-profile">
          <div class="profile-avatar-large" style="background: linear-gradient(135deg, #ef4444, #7f1d1d);">
            🛡️
          </div>
          <div class="profile-meta">
            <h2>HQ EXAM CONTROL PANEL <span class="badge-admin-tag">ADMINISTRATOR</span></h2>
            <div class="profile-tags">
              <span class="profile-tag">Command Center</span>
              <span class="profile-tag">Defense & Competitive Exams</span>
              <span class="profile-tag">Role: Chief Controller</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-3d btn-3d-success" onclick="Admin.openCreateTestModal()">
            + Create New Mock Test
          </button>
          <button class="btn-3d btn-3d-secondary" onclick="Admin.resetSeedDataConfirm()">
            🔄 Reset Seed Data
          </button>
        </div>
      </div>

      <!-- KPI Metrics Row -->
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-icon green">👨‍🎓</div>
          <div class="kpi-content">
            <div class="kpi-label">Registered Students</div>
            <div class="kpi-value">${stats.totalStudents}</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon gold">📝</div>
          <div class="kpi-content">
            <div class="kpi-label">Active Mock Tests</div>
            <div class="kpi-value">${stats.totalTests}</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon blue">📊</div>
          <div class="kpi-content">
            <div class="kpi-label">Total Submissions</div>
            <div class="kpi-value">${stats.totalAttempts}</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon red">🎯</div>
          <div class="kpi-content">
            <div class="kpi-label">Pass Qualification Rate</div>
            <div class="kpi-value">${stats.passRate}%</div>
          </div>
        </div>
      </div>

      <!-- Admin Tabs Navigation -->
      <div class="panel-nav-tabs">
        <button class="panel-tab-btn active" id="tabAdminTests" onclick="Admin.switchAdminTab('tests')">
          Mock Tests Management (${tests.length})
        </button>
        <button class="panel-tab-btn" id="tabAdminAttempts" onclick="Admin.switchAdminTab('attempts')">
          Student Attempts & Scorecards (${attempts.length})
        </button>
        <button class="panel-tab-btn" id="tabAdminUsers" onclick="Admin.switchAdminTab('users')">
          Candidate Roster (${users.length})
        </button>
        <button class="panel-tab-btn" id="tabAdminEnquiries" onclick="Admin.switchAdminTab('enquiries')">
          Candidate Enquiries (${enquiries.length})
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="adminTabContent">
        <!-- Render tests by default -->
        ${renderTestsTab()}
      </div>
    `;
  }

  function switchAdminTab(tabName) {
    const tabBtns = document.querySelectorAll('.panel-nav-tabs .panel-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    const content = document.getElementById('adminTabContent');

    if (tabName === 'tests') {
      document.getElementById('tabAdminTests').classList.add('active');
      content.innerHTML = renderTestsTab();
    } else if (tabName === 'attempts') {
      document.getElementById('tabAdminAttempts').classList.add('active');
      content.innerHTML = renderAttemptsTab();
    } else if (tabName === 'users') {
      document.getElementById('tabAdminUsers').classList.add('active');
      content.innerHTML = renderUsersTab();
    } else if (tabName === 'enquiries') {
      document.getElementById('tabAdminEnquiries').classList.add('active');
      content.innerHTML = renderEnquiriesTab();
    }
  }

  function renderEnquiriesTab() {
    if (enquiries.length === 0) {
      return `
        <div style="text-align: center; padding: 3rem; background: rgba(15,23,19,0.8); border-radius: 12px; border: 1px solid rgba(212,175,55,0.2);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📬</div>
          <h3 style="color: #fff;">No Candidate Enquiries Recorded Yet</h3>
          <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 0.3rem;">When candidates submit queries through the Exam Enquiry Panel, their helpdesk tickets will appear here.</p>
        </div>
      `;
    }

    return `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Candidate Name</th>
              <th>Phone Number</th>
              <th>Email Address</th>
              <th>Target Exam / Force</th>
              <th>Query Details</th>
              <th>Submitted At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${enquiries.map(e => `
              <tr>
                <td><strong style="color: #fbbf24; font-family: monospace;">${escapeHtml(e.ticketNo || e.id)}</strong></td>
                <td><strong>${escapeHtml(e.name)}</strong></td>
                <td>
                  <a href="tel:${escapeHtml(e.phone)}" style="color: #38bdf8; font-weight: 700; text-decoration: none;">📞 ${escapeHtml(e.phone)}</a>
                </td>
                <td>
                  <a href="mailto:${escapeHtml(e.email)}" style="color: #cbd5e1; text-decoration: none;">✉️ ${escapeHtml(e.email)}</a>
                </td>
                <td><span class="cat-badge badge-ldce">${escapeHtml(e.targetExam)}</span></td>
                <td style="max-width: 250px; font-size: 0.85rem; color: #cbd5e1; word-break: break-word;">${escapeHtml(e.message)}</td>
                <td style="font-size: 0.8rem; color: #94a3b8;">${new Date(e.createdAt).toLocaleString('en-IN')}</td>
                <td>
                  <span class="status-tag ${e.status === 'RESOLVED' ? 'pass' : 'fail'}">
                    ${escapeHtml(e.status)}
                  </span>
                </td>
                <td>
                  ${e.status !== 'RESOLVED' ? `
                    <button class="btn-demo-pill" style="border-color: #34d399; color: #34d399; font-size: 0.78rem;" onclick="Admin.resolveEnquiry('${e.id}')">
                      ✓ Mark Resolved
                    </button>
                  ` : `
                    <span style="color: #34d399; font-size: 0.82rem; font-weight: 700;">✓ Resolved</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  async function resolveEnquiry(id) {
    try {
      App.showToast('Updating enquiry status...', 'info');
      await API.updateAdminEnquiry(id, { status: 'RESOLVED' });
      const item = enquiries.find(e => e.id === id);
      if (item) item.status = 'RESOLVED';
      switchAdminTab('enquiries');
      App.showToast('Enquiry ticket marked as Resolved!', 'success');
    } catch (err) {
      App.showToast(err.message || 'Error updating enquiry status', 'error');
    }
  }

  function renderTestsTab() {
    return `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Test Title</th>
              <th>Force / Cat</th>
              <th>Target Exam</th>
              <th>Questions</th>
              <th>Duration</th>
              <th>Pass Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tests.map(t => {
              const qCount = t.questions ? t.questions.length : (t.questionCount || 0);
              const duration = qCount > 0 ? qCount : (t.durationMinutes || 60);
              const marks = qCount * (t.marksPerQuestion || 1);
              return `
                <tr>
                  <td><strong>${escapeHtml(t.title)}</strong></td>
                  <td>
                    <div style="display: flex; gap: 0.3rem; flex-direction: column;">
                      <span class="cat-badge badge-ldce">${escapeHtml(t.category)}</span>
                      ${t.force ? `<span class="badge-force force-${t.force.toLowerCase().replace(/[^a-z0-9]/g, '')}">🛡️ ${escapeHtml(t.force)}</span>` : ''}
                    </div>
                  </td>
                  <td>${escapeHtml(t.targetExam || t.category)}</td>
                  <td style="font-weight: 700; color: var(--gold-bright);">${qCount} Qs</td>
                  <td>${duration} Mins</td>
                  <td>
                    ${t.isPaid ? `
                      <span style="display: inline-block; padding: 0.2rem 0.5rem; background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: 4px; color: #fbbf24; font-size: 0.75rem; font-weight: 700; font-family: var(--font-military);">
                        🔒 PAID PASS
                      </span>
                    ` : `
                      <span style="display: inline-block; padding: 0.2rem 0.5rem; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 4px; color: #38bdf8; font-size: 0.75rem; font-weight: 700; font-family: var(--font-military);">
                        🆓 FREE OPEN
                      </span>
                    `}
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                      <button class="btn-demo-pill btn-admin-edit" onclick="Admin.openEditTestModal('${t.id}')" title="Edit Test Details & Add New Questions">
                        ✏️ Edit / Add Qs
                      </button>
                      <button class="btn-demo-pill" onclick="CBTEngine.startTest('${t.id}')" title="Preview CBT Test">
                        Preview CBT
                      </button>
                      <button class="btn-demo-pill" style="border-color: #ef4444; color: #f87171;" onclick="Admin.deleteTestConfirm('${t.id}')" title="Delete Test">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAttemptsTab() {
    if (attempts.length === 0) {
      return `
        <div style="text-align: center; padding: 3rem; background: rgba(15,23,19,0.8); border-radius: 12px; border: 1px solid rgba(212,175,55,0.2);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h3 style="color: #fff;">No Student Attempts Recorded Yet</h3>
          <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 0.3rem;">When students take and submit mock tests, their complete scorecards will appear here.</p>
        </div>
      `;
    }

    return `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Roll No</th>
              <th>Mock Test</th>
              <th>Score</th>
              <th>Accuracy</th>
              <th>Status</th>
              <th>Submitted At</th>
              <th>Inspect</th>
            </tr>
          </thead>
          <tbody>
            ${attempts.map(a => `
              <tr>
                <td><strong>${escapeHtml(a.userName)}</strong><br><small style="color: #94a3b8;">${escapeHtml(a.userForce || '')}</small></td>
                <td style="font-family: monospace; color: var(--gold-bright);">${escapeHtml(a.userRollNo || '')}</td>
                <td>${escapeHtml(a.testTitle)}</td>
                <td style="font-weight: 700; color: #fff;">
                  ${a.score} / ${a.totalMarks} <small style="color: #cbd5e1;">(${a.percentage}%)</small>
                </td>
                <td style="color: #34d399; font-weight: 700;">${a.accuracy}%</td>
                <td>
                  <span class="status-tag ${a.isQualified ? 'pass' : 'fail'}">
                    ${a.isQualified ? 'QUALIFIED' : 'FAILED'}
                  </span>
                </td>
                <td style="font-size: 0.8rem; color: #94a3b8;">${new Date(a.submittedAt).toLocaleString('en-IN')}</td>
                <td>
                  <button class="btn-demo-pill" onclick="Scorecard.loadAndDisplay('${a.id}')">
                    View Scorecard ➔
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderUsersTab() {
    return `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Roll Number</th>
              <th>Target Exam</th>
              <th>Force / Unit</th>
              <th>Role</th>
              <th>Tests Taken</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${escapeHtml(u.name)}</strong></td>
                <td style="color: #94a3b8;">${escapeHtml(u.email)}</td>
                <td style="font-family: monospace; color: var(--gold-bright);">${escapeHtml(u.rollNo || 'N/A')}</td>
                <td><span class="cat-badge badge-ldce">${escapeHtml(u.targetExam || 'LDCE')}</span></td>
                <td>${escapeHtml(u.force || 'Defense')}</td>
                <td><span class="status-tag ${u.role === 'admin' ? 'fail' : 'pass'}">${u.role.toUpperCase()}</span></td>
                <td style="font-weight: 700;">${u.attemptsCount || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function openCreateTestModal() {
    tempQuestions = [
      {
        section: 'Professional Knowledge & Service Rules',
        textEn: '',
        textHi: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanationEn: '',
        explanationHi: ''
      }
    ];

    const modal = document.getElementById('generalModal');
    const content = document.getElementById('generalModalContent');

    content.innerHTML = `
      <div style="max-height: 80vh; overflow-y: auto; padding-right: 0.5rem;">
        <h2 style="color: var(--gold-bright); margin-bottom: 0.3rem;">📝 Create New Defense Mock Test</h2>
        <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 1.5rem;">Configure test parameters and build questions.</p>

        <form id="createTestForm" onsubmit="Admin.handleCreateTest(event)">
          <div class="form-group">
            <label class="form-label">Test Title</label>
            <input type="text" id="adminNewTitle" class="form-input" placeholder="e.g. CRPF SI (GD) LDCE 2026 - Speed Mock #3" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="adminNewCategory" class="form-select">
                <option value="LDCE">LDCE (CRPF / CISF)</option>
                <option value="CAPF">CAPF (Assistant Commandant)</option>
                <option value="SI">Sub-Inspector (SI)</option>
                <option value="SSC">SSC (CGL / CPO / GD)</option>
                <option value="Bank">Bank (SBI / IBPS PO)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Target Exam Label</label>
              <input type="text" id="adminNewTargetExam" class="form-input" placeholder="e.g. CISF ASI LDCE" value="CISF ASI LDCE">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="adminNewDesc" class="form-textarea" rows="2" placeholder="Brief details about the test syllabus, rules, and pattern..."></textarea>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Duration (Mins)</label>
              <input type="number" id="adminNewDuration" class="form-input" value="60" min="5" required>
            </div>
            <div class="form-group">
              <label class="form-label">Total Marks</label>
              <input type="number" id="adminNewTotalMarks" class="form-input" value="100" min="1" required>
            </div>
            <div class="form-group">
              <label class="form-label">Marks / Question</label>
              <input type="number" id="adminNewMarksPerQ" class="form-input" value="1" step="0.5" min="0.5" required>
            </div>
            <div class="form-group">
              <label class="form-label">Negative Marking</label>
              <input type="number" id="adminNewNegMark" class="form-input" value="0.25" step="0.05" min="0" required>
            </div>
          </div>

          <!-- Section List -->
          <div class="form-group">
            <label class="form-label">Sections (Comma Separated)</label>
            <input type="text" id="adminNewSections" class="form-input" value="Professional Knowledge & Service Rules, Reasoning, Numerical Ability, English/Hindi">
          </div>

          <hr style="border-color: rgba(212,175,55,0.25); margin: 1.5rem 0;">

          <!-- Question Builder Area -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="color: #fff; font-size: 1.15rem;">Question Builder (<span id="qCountDisplay">${tempQuestions.length}</span>)</h3>
            <button type="button" class="btn-demo-pill" style="border-color: var(--gold-bright); color: var(--gold-bright);" onclick="Admin.addQuestionForm()">
              + Add Another Question
            </button>
          </div>

          <div id="questionsContainer">
            ${renderQuestionForms()}
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.75rem;">
            <button type="button" class="btn-3d btn-3d-secondary" onclick="App.closeGeneralModal()">Cancel</button>
            <button type="submit" class="btn-3d btn-3d-success">Publish Mock Test</button>
          </div>
        </form>
      </div>
    `;

    App.openGeneralModal();
  }

  function renderQuestionForms() {
    return tempQuestions.map((q, idx) => `
      <div class="question-builder-item" id="qBlock_${idx}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <strong style="color: var(--gold-bright);">Question #${idx + 1}</strong>
          ${tempQuestions.length > 1 ? `
            <button type="button" style="color: #ef4444; background: none; border: none; cursor: pointer; font-size: 0.8rem;" onclick="Admin.removeQuestion(${idx})">
              ✕ Remove
            </button>
          ` : ''}
        </div>

        <div class="form-group">
          <label class="form-label">Section Tag</label>
          <input type="text" class="form-input q-section" value="${escapeHtml(q.section)}" placeholder="e.g. Professional Knowledge">
        </div>

        <div class="form-group">
          <label class="form-label">Question Text (English)</label>
          <textarea class="form-textarea q-text-en" rows="2" placeholder="Enter question in English..." required>${escapeHtml(q.textEn)}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Question Text (Hindi) - Optional</label>
          <textarea class="form-textarea q-text-hi" rows="2" placeholder="प्रश्न हिन्दी में दर्ज करें...">${escapeHtml(q.textHi)}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin-bottom: 1rem;">
          <input type="text" class="form-input q-opt-0" placeholder="Option A" value="${escapeHtml(q.options[0] || '')}" required>
          <input type="text" class="form-input q-opt-1" placeholder="Option B" value="${escapeHtml(q.options[1] || '')}" required>
          <input type="text" class="form-input q-opt-2" placeholder="Option C" value="${escapeHtml(q.options[2] || '')}" required>
          <input type="text" class="form-input q-opt-3" placeholder="Option D" value="${escapeHtml(q.options[3] || '')}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Correct Option</label>
          <select class="form-select q-correct">
            <option value="0" ${q.correctAnswer === 0 ? 'selected' : ''}>Option A</option>
            <option value="1" ${q.correctAnswer === 1 ? 'selected' : ''}>Option B</option>
            <option value="2" ${q.correctAnswer === 2 ? 'selected' : ''}>Option C</option>
            <option value="3" ${q.correctAnswer === 3 ? 'selected' : ''}>Option D</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Explanation (English & Legal references)</label>
          <textarea class="form-textarea q-exp-en" rows="2" placeholder="Provide solution and statutory references...">${escapeHtml(q.explanationEn)}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Explanation (Hindi)</label>
          <textarea class="form-textarea q-exp-hi" rows="2" placeholder="विस्तृत व्याख्या हिन्दी में...">${escapeHtml(q.explanationHi)}</textarea>
        </div>
      </div>
    `).join('');
  }

  function addQuestionForm() {
    collectCurrentFormQuestions();
    tempQuestions.push({
      section: 'Professional Knowledge & Service Rules',
      textEn: '',
      textHi: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanationEn: '',
      explanationHi: ''
    });

    document.getElementById('questionsContainer').innerHTML = renderQuestionForms();
    document.getElementById('qCountDisplay').textContent = tempQuestions.length;
  }

  function removeQuestion(idx) {
    collectCurrentFormQuestions();
    tempQuestions.splice(idx, 1);
    document.getElementById('questionsContainer').innerHTML = renderQuestionForms();
    document.getElementById('qCountDisplay').textContent = tempQuestions.length;
  }

  function collectCurrentFormQuestions() {
    const blocks = document.querySelectorAll('.question-builder-item');
    tempQuestions = [];

    blocks.forEach((block, idx) => {
      tempQuestions.push({
        section: block.querySelector('.q-section').value.trim() || 'General',
        textEn: block.querySelector('.q-text-en').value.trim(),
        textHi: block.querySelector('.q-text-hi').value.trim(),
        options: [
          block.querySelector('.q-opt-0').value.trim(),
          block.querySelector('.q-opt-1').value.trim(),
          block.querySelector('.q-opt-2').value.trim(),
          block.querySelector('.q-opt-3').value.trim()
        ],
        correctAnswer: parseInt(block.querySelector('.q-correct').value, 10),
        explanationEn: block.querySelector('.q-exp-en').value.trim(),
        explanationHi: block.querySelector('.q-exp-hi').value.trim()
      });
    });
  }

  async function handleCreateTest(event) {
    event.preventDefault();
    collectCurrentFormQuestions();

    if (tempQuestions.length === 0) {
      App.showToast('Please add at least one question', 'error');
      return;
    }

    const title = document.getElementById('adminNewTitle').value.trim();
    const category = document.getElementById('adminNewCategory').value;
    const targetExam = document.getElementById('adminNewTargetExam').value.trim();
    const description = document.getElementById('adminNewDesc').value.trim();
    const durationMinutes = parseInt(document.getElementById('adminNewDuration').value, 10);
    const totalMarks = parseFloat(document.getElementById('adminNewTotalMarks').value);
    const marksPerQuestion = parseFloat(document.getElementById('adminNewMarksPerQ').value);
    const negativeMarking = parseFloat(document.getElementById('adminNewNegMark').value);
    const sectionsInput = document.getElementById('adminNewSections').value;
    const sections = sectionsInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      App.showToast('Creating mock test...', 'info');

      await API.createAdminTest({
        title,
        category,
        targetExam,
        description,
        durationMinutes,
        totalMarks,
        marksPerQuestion,
        negativeMarking,
        sections,
        questions: tempQuestions
      });

      App.closeGeneralModal();
      App.showToast('Mock test created successfully!', 'success');
      loadAdminDashboard();
    } catch (err) {
      console.error('Error creating test:', err);
      App.showToast(err.message || 'Failed to create test', 'error');
    }
  }

  async function deleteTestConfirm(testId) {
    if (confirm('Are you sure you want to delete this mock test? This action cannot be undone.')) {
      try {
        await API.deleteAdminTest(testId);
        App.showToast('Test deleted successfully', 'success');
        loadAdminDashboard();
      } catch (err) {
        App.showToast(err.message || 'Failed to delete test', 'error');
      }
    }
  }

  async function resetSeedDataConfirm() {
    if (confirm('Reset all tests, users, and attempts to default authentic defense mock tests?')) {
      try {
        await API.resetSeedData();
        App.showToast('Database reset to authentic seed data!', 'success');
        loadAdminDashboard();
      } catch (err) {
        App.showToast(err.message || 'Failed to reset seed data', 'error');
      }
    }
  }

  // ==========================================================================
  // EDIT TEST & QUESTION BUILDER MANAGEMENT
  // ==========================================================================
  let editingTest = null;
  let editingQuestions = [];
  let editingQIndex = -1;

  async function openEditTestModal(testId) {
    let t = tests.find(item => item.id === testId);
    if (!t || !t.questions || t.questions.length === 0) {
      try {
        const full = await API.getAdminTests();
        if (full && full.tests) {
          tests = full.tests;
          t = tests.find(item => item.id === testId);
        }
      } catch (e) {
        console.error('Failed to load full test for editing:', e);
      }
    }

    if (!t) {
      App.showToast('Test not found for editing', 'error');
      return;
    }

    editingTest = JSON.parse(JSON.stringify(t));
    editingQuestions = editingTest.questions ? JSON.parse(JSON.stringify(editingTest.questions)) : [];
    editingQIndex = -1;

    const modalBox = document.querySelector('#generalModal .modal-box');
    if (modalBox) modalBox.classList.add('modal-box-large');

    renderEditTestModalView();
    App.openGeneralModal();
  }

  function renderEditTestModalView() {
    const content = document.getElementById('generalModalContent');
    if (!content || !editingTest) return;

    const qCount = editingQuestions.length;
    const mpq = Number(editingTest.marksPerQuestion) || 1;
    const totalMarks = qCount * mpq;

    content.innerHTML = `
      <div style="max-height: 82vh; overflow-y: auto; padding-right: 0.5rem;" id="editModalScroll">
        <!-- Header -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <h2 style="color: var(--gold-bright); margin-bottom: 0.25rem;">✏️ Edit Mock Test & Question Manager</h2>
            <p style="color: #94a3b8; font-size: 0.85rem;">Modify test syllabus parameters, edit questions, or add brand-new questions.</p>
            <div class="edit-test-badge-row">
              <span class="edit-badge-pill gold">Category: ${escapeHtml(editingTest.category)}</span>
              <span class="edit-badge-pill green" id="editLiveQCountPill">🛡️ ${qCount} Questions</span>
              <span class="edit-badge-pill" id="editLiveDurationPill">⏱️ ${qCount} Mins (1 Min/Q)</span>
              <span class="edit-badge-pill" id="editLiveMarksPill">Total Marks: ${totalMarks} M</span>
            </div>
          </div>
          <button type="button" class="btn-demo-pill" style="border-color: #22c55e; color: #4ade80; font-weight: 700;" onclick="Admin.jumpToAddQuestion()">
            ➕ Add Question
          </button>
        </div>

        <hr style="border-color: rgba(212,175,55,0.25); margin: 1rem 0;">

        <!-- 1. Test Configuration Settings -->
        <details style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1.5rem;" open>
          <summary style="font-weight: 700; color: #e2e8f0; cursor: pointer; user-select: none;">
            ⚙️ Test Information & Marking Scheme <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">(Click to collapse/expand)</span>
          </summary>
          <div style="margin-top: 1rem;">
            <div class="form-group">
              <label class="form-label">Test Title</label>
              <input type="text" id="editTestTitle" class="form-input" value="${escapeHtml(editingTest.title)}" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="editTestCategory" class="form-select">
                  <option value="LDCE" ${editingTest.category === 'LDCE' ? 'selected' : ''}>LDCE (CRPF / CISF)</option>
                  <option value="CAPF" ${editingTest.category === 'CAPF' ? 'selected' : ''}>CAPF (Assistant Commandant)</option>
                  <option value="SI" ${editingTest.category === 'SI' ? 'selected' : ''}>Sub-Inspector (SI)</option>
                  <option value="SSC" ${editingTest.category === 'SSC' ? 'selected' : ''}>SSC (CGL / CPO / GD)</option>
                  <option value="Bank" ${editingTest.category === 'Bank' ? 'selected' : ''}>Bank (SBI / IBPS PO)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Target Exam</label>
                <input type="text" id="editTestTargetExam" class="form-input" value="${escapeHtml(editingTest.targetExam || editingTest.category)}">
              </div>
              <div class="form-group">
                <label class="form-label">Difficulty Level</label>
                <select id="editTestDifficulty" class="form-select">
                  <option value="Easy" ${editingTest.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                  <option value="Moderate" ${editingTest.difficulty === 'Moderate' ? 'selected' : ''}>Moderate</option>
                  <option value="Hard" ${editingTest.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
                  <option value="Advanced" ${editingTest.difficulty === 'Advanced' ? 'selected' : ''}>Advanced</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description / Syllabus</label>
              <textarea id="editTestDesc" class="form-textarea" rows="2">${escapeHtml(editingTest.description || '')}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Marks per Correct Question (+M)</label>
                <input type="number" id="editTestMarksPerQ" class="form-input" value="${editingTest.marksPerQuestion || 1}" step="0.5" min="0.5" oninput="Admin.recalcEditMarks()">
              </div>
              <div class="form-group">
                <label class="form-label">Negative Marking (-M)</label>
                <input type="number" id="editTestNegMark" class="form-input" value="${editingTest.negativeMarking !== undefined ? editingTest.negativeMarking : 0.25}" step="0.05" min="0">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Syllabus Sections (Comma Separated)</label>
              <input type="text" id="editTestSections" class="form-input" value="${escapeHtml((editingTest.sections || ['Professional Knowledge & Service Rules', 'Reasoning', 'General Awareness', 'Language']).join(', '))}">
            </div>
          </div>
        </details>

        <!-- 2. Existing Questions Section -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <h3 style="color: #fff; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
            📋 Questions in this Test (<span id="editQCountSpan">${editingQuestions.length}</span>)
          </h3>
          <span style="font-size: 0.75rem; color: #4ade80;">⚡ 1 min per question synchronized automatically</span>
        </div>

        <div id="editQuestionsList" class="existing-questions-list">
          ${renderEditingQuestionsList()}
        </div>

        <!-- 3. Add New Question Form Card -->
        <div id="addNewQuestionAnchor" class="add-q-card-box">
          <div class="add-q-title">
            <span>➕</span>
            <span>Add New Question to this Mock Test</span>
          </div>
          <p style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 1.25rem;">
            Enter question details in English (and optionally हिन्दी). Upon clicking Add, the question will be appended and the test duration will auto-increment by 1 minute.
          </p>

          <div class="form-group">
            <label class="form-label">Section / Topic Tag</label>
            <input type="text" id="newQSection" class="form-input" value="${escapeHtml((editingTest.sections && editingTest.sections[0]) || 'Professional Knowledge & Service Rules')}" placeholder="e.g. Professional Knowledge & Service Rules">
          </div>

          <div class="form-group">
            <label class="form-label">Question Text (English) <span style="color: #ef4444;">*</span></label>
            <textarea id="newQTextEn" class="form-textarea" rows="2" placeholder="Enter question statement in English..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Question Text (हिन्दी) - Optional</label>
            <textarea id="newQTextHi" class="form-textarea" rows="2" placeholder="प्रश्न हिन्दी में दर्ज करें (वैकल्पिक)..."></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div>
              <label class="form-label" style="font-size: 0.75rem;">Option A <span style="color: #ef4444;">*</span></label>
              <input type="text" id="newQOptA" class="form-input" placeholder="Option A text" required>
            </div>
            <div>
              <label class="form-label" style="font-size: 0.75rem;">Option B <span style="color: #ef4444;">*</span></label>
              <input type="text" id="newQOptB" class="form-input" placeholder="Option B text" required>
            </div>
            <div>
              <label class="form-label" style="font-size: 0.75rem;">Option C</label>
              <input type="text" id="newQOptC" class="form-input" placeholder="Option C text">
            </div>
            <div>
              <label class="form-label" style="font-size: 0.75rem;">Option D</label>
              <input type="text" id="newQOptD" class="form-input" placeholder="Option D text">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Correct Option <span style="color: #ef4444;">*</span></label>
            <select id="newQCorrect" class="form-select">
              <option value="0">Option A</option>
              <option value="1">Option B</option>
              <option value="2">Option C</option>
              <option value="3">Option D</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Detailed Solution & Statutory Reference (English)</label>
            <textarea id="newQExpEn" class="form-textarea" rows="2" placeholder="e.g. As per Section 8 of CISF Act 1968 / CRPF Rules 1955..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Detailed Solution & Statutory Reference (हिन्दी)</label>
            <textarea id="newQExpHi" class="form-textarea" rows="2" placeholder="विस्तृत व्याख्या और अधिनियम संदर्भ हिन्दी में..."></textarea>
          </div>

          <button type="button" class="btn-3d btn-3d-success" style="width: 100%; margin-top: 0.5rem;" onclick="Admin.addNewQuestionToEditingTest()">
            ⚡ Append Question to Test (+1 Question, +1 Min)
          </button>
        </div>

        <!-- Footer Actions -->
        <div style="display: flex; gap: 1rem; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
          <button type="button" class="btn-3d btn-3d-secondary" onclick="Admin.closeEditModal()">
            Cancel
          </button>
          <button type="button" class="btn-3d btn-3d-success" style="font-size: 1rem; padding: 0.75rem 1.75rem;" onclick="Admin.saveEditTest()">
            💾 Save All Changes to Mock Test
          </button>
        </div>
      </div>
    `;
  }

  function renderEditingQuestionsList() {
    if (editingQuestions.length === 0) {
      return `
        <div style="text-align: center; padding: 2rem; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15); color: #94a3b8;">
          No questions in this test yet. Use the form below to add the first question.
        </div>
      `;
    }

    return editingQuestions.map((q, idx) => {
      const isEditingThis = editingQIndex === idx;
      return `
        <div class="q-manage-card" id="qManageCard_${idx}">
          <div class="q-manage-top">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="q-num-tag">Q${idx + 1}</span>
              <span class="cat-badge badge-ldce" style="font-size: 0.7rem;">${escapeHtml(q.section || 'General')}</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn-demo-pill" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;" onclick="Admin.toggleEditExistingQuestion(${idx})">
                ${isEditingThis ? '✕ Close Edit' : '✏️ Edit'}
              </button>
              <button type="button" class="btn-demo-pill" style="border-color: #ef4444; color: #f87171; font-size: 0.72rem; padding: 0.2rem 0.6rem;" onclick="Admin.removeEditingQuestion(${idx})">
                🗑️ Delete
              </button>
            </div>
          </div>

          ${isEditingThis ? `
            <!-- Inline Question Editor Form -->
            <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 8px; margin-top: 0.5rem; border: 1px solid rgba(212,175,55,0.3);">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem;">Section</label>
                <input type="text" id="inlineSec_${idx}" class="form-input" value="${escapeHtml(q.section || '')}">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem;">Question Text (English)</label>
                <textarea id="inlineEn_${idx}" class="form-textarea" rows="2">${escapeHtml(q.textEn || '')}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem;">Question Text (हिन्दी)</label>
                <textarea id="inlineHi_${idx}" class="form-textarea" rows="2">${escapeHtml(q.textHi || '')}</textarea>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;">
                <input type="text" id="inlineOpt0_${idx}" class="form-input" placeholder="Option A" value="${escapeHtml((q.options && q.options[0]) || '')}">
                <input type="text" id="inlineOpt1_${idx}" class="form-input" placeholder="Option B" value="${escapeHtml((q.options && q.options[1]) || '')}">
                <input type="text" id="inlineOpt2_${idx}" class="form-input" placeholder="Option C" value="${escapeHtml((q.options && q.options[2]) || '')}">
                <input type="text" id="inlineOpt3_${idx}" class="form-input" placeholder="Option D" value="${escapeHtml((q.options && q.options[3]) || '')}">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem;">Correct Option</label>
                <select id="inlineCorrect_${idx}" class="form-select">
                  <option value="0" ${q.correctAnswer === 0 ? 'selected' : ''}>Option A</option>
                  <option value="1" ${q.correctAnswer === 1 ? 'selected' : ''}>Option B</option>
                  <option value="2" ${q.correctAnswer === 2 ? 'selected' : ''}>Option C</option>
                  <option value="3" ${q.correctAnswer === 3 ? 'selected' : ''}>Option D</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem;">Explanation (English)</label>
                <textarea id="inlineExpEn_${idx}" class="form-textarea" rows="2">${escapeHtml(q.explanationEn || '')}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size: 0.75rem;">Explanation (हिन्दी)</label>
                <textarea id="inlineExpHi_${idx}" class="form-textarea" rows="2">${escapeHtml(q.explanationHi || '')}</textarea>
              </div>
              <button type="button" class="btn-3d btn-3d-success" style="font-size: 0.85rem; padding: 0.4rem 1rem;" onclick="Admin.saveExistingQuestionEdit(${idx})">
                ✓ Apply Question Updates
              </button>
            </div>
          ` : `
            <!-- Question Content Preview -->
            <div style="color: #fff; font-size: 0.92rem; font-weight: 600; margin-bottom: 0.4rem;">
              ${escapeHtml(q.textEn)}
            </div>
            ${q.textHi ? `
              <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.5rem; font-family: sans-serif;">
                ${escapeHtml(q.textHi)}
              </div>
            ` : ''}

            <div class="q-manage-opts-grid">
              ${(q.options || []).map((opt, oIdx) => {
                const isCorrect = q.correctAnswer === oIdx;
                return `
                  <div class="q-opt-pill ${isCorrect ? 'correct' : ''}">
                    <strong>${String.fromCharCode(65 + oIdx)}.</strong>
                    <span>${escapeHtml(opt)}</span>
                    ${isCorrect ? '<span style="margin-left: auto;">✓</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>

            ${q.explanationEn ? `
              <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed rgba(255,255,255,0.08);">
                <strong style="color: #cbd5e1;">Reference / Explanation:</strong> ${escapeHtml(q.explanationEn)}
              </div>
            ` : ''}
          `}
        </div>
      `;
    }).join('');
  }

  function addNewQuestionToEditingTest() {
    const textEn = (document.getElementById('newQTextEn')?.value || '').trim();
    if (!textEn) {
      App.showToast('Please enter the English question statement', 'error');
      document.getElementById('newQTextEn')?.focus();
      return;
    }

    const optA = (document.getElementById('newQOptA')?.value || '').trim();
    const optB = (document.getElementById('newQOptB')?.value || '').trim();
    const optC = (document.getElementById('newQOptC')?.value || '').trim();
    const optD = (document.getElementById('newQOptD')?.value || '').trim();

    if (!optA || !optB) {
      App.showToast('Please provide at least Option A and Option B', 'error');
      return;
    }

    const options = [optA, optB];
    if (optC) options.push(optC);
    if (optD) options.push(optD);

    const section = (document.getElementById('newQSection')?.value || '').trim() || 'General';
    const textHi = (document.getElementById('newQTextHi')?.value || '').trim();
    const correctAnswer = parseInt(document.getElementById('newQCorrect')?.value || '0', 10);
    const expEn = (document.getElementById('newQExpEn')?.value || '').trim();
    const expHi = (document.getElementById('newQExpHi')?.value || '').trim();

    const newQ = {
      id: `q_${Date.now()}_${editingQuestions.length + 1}`,
      section,
      textEn,
      textHi,
      options,
      correctAnswer: Math.min(correctAnswer, options.length - 1),
      explanationEn: expEn,
      explanationHi: expHi
    };

    editingQuestions.push(newQ);

    // Clear add question form inputs
    if (document.getElementById('newQTextEn')) document.getElementById('newQTextEn').value = '';
    if (document.getElementById('newQTextHi')) document.getElementById('newQTextHi').value = '';
    if (document.getElementById('newQOptA')) document.getElementById('newQOptA').value = '';
    if (document.getElementById('newQOptB')) document.getElementById('newQOptB').value = '';
    if (document.getElementById('newQOptC')) document.getElementById('newQOptC').value = '';
    if (document.getElementById('newQOptD')) document.getElementById('newQOptD').value = '';
    if (document.getElementById('newQExpEn')) document.getElementById('newQExpEn').value = '';
    if (document.getElementById('newQExpHi')) document.getElementById('newQExpHi').value = '';

    // Update questions list display and live badges
    const listEl = document.getElementById('editQuestionsList');
    if (listEl) listEl.innerHTML = renderEditingQuestionsList();

    const countSpan = document.getElementById('editQCountSpan');
    if (countSpan) countSpan.textContent = editingQuestions.length;

    const countPill = document.getElementById('editLiveQCountPill');
    if (countPill) countPill.textContent = `🛡️ ${editingQuestions.length} Questions`;

    const durPill = document.getElementById('editLiveDurationPill');
    if (durPill) durPill.textContent = `⏱️ ${editingQuestions.length} Mins (1 Min/Q)`;

    recalcEditMarks();

    App.showToast(`✅ New Question #${editingQuestions.length} added! Duration updated to ${editingQuestions.length} Mins.`, 'success');

    // Scroll to new question
    const newCard = document.getElementById(`qManageCard_${editingQuestions.length - 1}`);
    if (newCard) {
      newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      newCard.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.5)';
      setTimeout(() => { if (newCard) newCard.style.boxShadow = ''; }, 2000);
    }
  }

  function removeEditingQuestion(idx) {
    if (confirm(`Remove Question #${idx + 1} from this test?`)) {
      editingQuestions.splice(idx, 1);
      if (editingQIndex === idx) editingQIndex = -1;

      const listEl = document.getElementById('editQuestionsList');
      if (listEl) listEl.innerHTML = renderEditingQuestionsList();

      const countSpan = document.getElementById('editQCountSpan');
      if (countSpan) countSpan.textContent = editingQuestions.length;

      const countPill = document.getElementById('editLiveQCountPill');
      if (countPill) countPill.textContent = `🛡️ ${editingQuestions.length} Questions`;

      const durPill = document.getElementById('editLiveDurationPill');
      if (durPill) durPill.textContent = `⏱️ ${editingQuestions.length} Mins (1 Min/Q)`;

      recalcEditMarks();

      App.showToast(`🗑️ Question removed. Total questions: ${editingQuestions.length}`, 'info');
    }
  }

  function toggleEditExistingQuestion(idx) {
    editingQIndex = (editingQIndex === idx) ? -1 : idx;
    const listEl = document.getElementById('editQuestionsList');
    if (listEl) listEl.innerHTML = renderEditingQuestionsList();
  }

  function saveExistingQuestionEdit(idx) {
    const sec = (document.getElementById(`inlineSec_${idx}`)?.value || '').trim() || 'General';
    const en = (document.getElementById(`inlineEn_${idx}`)?.value || '').trim();
    const hi = (document.getElementById(`inlineHi_${idx}`)?.value || '').trim();
    const opt0 = (document.getElementById(`inlineOpt0_${idx}`)?.value || '').trim();
    const opt1 = (document.getElementById(`inlineOpt1_${idx}`)?.value || '').trim();
    const opt2 = (document.getElementById(`inlineOpt2_${idx}`)?.value || '').trim();
    const opt3 = (document.getElementById(`inlineOpt3_${idx}`)?.value || '').trim();
    const correct = parseInt(document.getElementById(`inlineCorrect_${idx}`)?.value || '0', 10);
    const expEn = (document.getElementById(`inlineExpEn_${idx}`)?.value || '').trim();
    const expHi = (document.getElementById(`inlineExpHi_${idx}`)?.value || '').trim();

    if (!en || !opt0 || !opt1) {
      App.showToast('Question text and at least Options A & B are required', 'error');
      return;
    }

    const opts = [opt0, opt1];
    if (opt2) opts.push(opt2);
    if (opt3) opts.push(opt3);

    editingQuestions[idx] = {
      ...editingQuestions[idx],
      section: sec,
      textEn: en,
      textHi: hi,
      options: opts,
      correctAnswer: Math.min(correct, opts.length - 1),
      explanationEn: expEn,
      explanationHi: expHi
    };

    editingQIndex = -1;
    const listEl = document.getElementById('editQuestionsList');
    if (listEl) listEl.innerHTML = renderEditingQuestionsList();

    App.showToast(`✅ Question #${idx + 1} updated!`, 'success');
  }

  function recalcEditMarks() {
    const mpqInput = document.getElementById('editTestMarksPerQ');
    const mpq = mpqInput ? (parseFloat(mpqInput.value) || 1) : 1;
    const marksPill = document.getElementById('editLiveMarksPill');
    if (marksPill) {
      marksPill.textContent = `Total Marks: ${editingQuestions.length * mpq} M`;
    }
  }

  function jumpToAddQuestion() {
    const anchor = document.getElementById('addNewQuestionAnchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' });
      const textEn = document.getElementById('newQTextEn');
      if (textEn) textEn.focus();
    }
  }

  async function saveEditTest() {
    if (!editingTest) return;

    if (editingQuestions.length === 0) {
      App.showToast('Test must contain at least one question', 'error');
      return;
    }

    const title = (document.getElementById('editTestTitle')?.value || '').trim() || editingTest.title;
    const category = document.getElementById('editTestCategory')?.value || editingTest.category;
    const targetExam = (document.getElementById('editTestTargetExam')?.value || '').trim() || editingTest.targetExam;
    const difficulty = document.getElementById('editTestDifficulty')?.value || editingTest.difficulty || 'Moderate';
    const description = (document.getElementById('editTestDesc')?.value || '').trim();
    const marksPerQ = parseFloat(document.getElementById('editTestMarksPerQ')?.value) || 1;
    const negMark = parseFloat(document.getElementById('editTestNegMark')?.value);
    const sectionsInput = document.getElementById('editTestSections')?.value || '';
    const sections = sectionsInput.split(',').map(s => s.trim()).filter(Boolean);

    const qCount = editingQuestions.length;
    // Auto proportional duration: 1 min per question per user requirement
    const durationMinutes = qCount;
    const totalMarks = qCount * marksPerQ;
    const passingMarks = Math.round(totalMarks * 0.4);

    try {
      App.showToast('Saving updated test & questions...', 'info');

      await API.updateAdminTest(editingTest.id, {
        title,
        category,
        targetExam,
        difficulty,
        description,
        marksPerQuestion: marksPerQ,
        negativeMarking: isNaN(negMark) ? 0.25 : negMark,
        sections: sections.length > 0 ? sections : editingTest.sections,
        durationMinutes,
        totalMarks,
        passingMarks,
        questions: editingQuestions
      });

      closeEditModal();
      App.showToast(`🎉 Test "${title}" updated with ${qCount} questions (${durationMinutes} Mins)!`, 'success');
      await loadAdminDashboard();
      if (typeof App !== 'undefined' && App.loadTests) {
        App.loadTests();
      }
    } catch (err) {
      console.error('Error saving test edits:', err);
      App.showToast(err.message || 'Failed to update test', 'error');
    }
  }

  function closeEditModal() {
    const modalBox = document.querySelector('#generalModal .modal-box');
    if (modalBox) modalBox.classList.remove('modal-box-large');
    App.closeGeneralModal();
    editingTest = null;
    editingQuestions = [];
    editingQIndex = -1;
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
    loadAdminDashboard,
    switchAdminTab,
    openCreateTestModal,
    addQuestionForm,
    removeQuestion,
    handleCreateTest,
    deleteTestConfirm,
    resetSeedDataConfirm,
    resolveEnquiry,
    openEditTestModal,
    addNewQuestionToEditingTest,
    removeEditingQuestion,
    toggleEditExistingQuestion,
    saveExistingQuestionEdit,
    recalcEditMarks,
    jumpToAddQuestion,
    saveEditTest,
    closeEditModal
  };
})();
