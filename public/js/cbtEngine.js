/**
 * COMMANDO BATCH - TCS iON COMPUTER BASED TEST (CBT) ENGINE
 * Official exam simulation interface matching SSC, CAPF, CISF & CRPF CBT formats.
 * Includes Pause, Resume, Exit to Home, and Real-time Persistence.
 */

const CBTEngine = (function () {
  let activeTest = null;
  let currentQIndex = 0;
  let currentSection = '';
  let answers = {}; // { [qId]: optionIndex }
  let statuses = {}; // { [qId]: 'not-visited' | 'not-answered' | 'answered' | 'marked-review' | 'answered-review' }
  let remainingSeconds = 0;
  let totalDurationSeconds = 0;
  let timerInterval = null;
  let currentLang = 'en'; // 'en' | 'hi'
  let isPaused = false;

  // DOM Elements
  let cbtModal = null;

  function init() {
    cbtModal = document.getElementById('cbtModal');
  }

  async function startTest(testId) {
    const user = API.getUser();
    if (!user) {
      App.openAuthModal('login', () => startTest(testId));
      App.showToast('Please log in to start the CBT Mock Test', 'info');
      return;
    }

    try {
      App.showToast('Initializing secure examination environment...', 'info');
      const data = await API.getTestById(testId);
      activeTest = data.test;

      if (!activeTest || !activeTest.questions || activeTest.questions.length === 0) {
        throw new Error('This mock test currently has no questions');
      }

      // Check if test is in paid section and candidate does not have active pass (admin bypasses)
      const hasActivePass = user && user.activePackage && user.activePackage.status === 'ACTIVE';
      if (activeTest.isPaid && !hasActivePass && user.role !== 'admin') {
        App.showToast(`This ${activeTest.force || 'CAPF'} mock test requires an active Tactical Pass (₹100) or Commando Pro Pass (₹199).`, 'warning');
        App.openPackageEnrollment('pkg_100_2m');
        return;
      }

      // Reset test state
      currentQIndex = 0;
      answers = {};
      statuses = {};
      currentLang = 'en';
      isPaused = false;

      // Dynamic proportional timer: 1 minute per question (e.g. 65 Qs = 65 Min, 8 Qs = 8 Min)
      const qCount = activeTest.questions ? activeTest.questions.length : 10;
      activeTest.durationMinutes = activeTest.durationMinutes || qCount;
      totalDurationSeconds = activeTest.durationMinutes * 60;
      remainingSeconds = totalDurationSeconds;

      // Initialize all statuses to 'not-visited'
      activeTest.questions.forEach((q, idx) => {
        statuses[q.id] = idx === 0 ? 'not-answered' : 'not-visited';
      });

      // Set initial section
      const sections = activeTest.sections && activeTest.sections.length > 0
        ? activeTest.sections
        : Array.from(new Set(activeTest.questions.map(q => q.section || 'General')));
      activeTest.sections = sections;
      currentSection = activeTest.questions[0].section || sections[0];

      // Build & show CBT modal
      renderCBTInterface();
      cbtModal.style.display = 'flex';
      cbtModal.classList.add('active');

      // Start Countdown Timer
      startTimer();

      // Persist state in localStorage
      savePausedSession();

      // Sound notification (pleasant short beep)
      playBeep(440, 0.1);
    } catch (err) {
      console.error('Failed to start test:', err);
      App.showToast(err.message || 'Error launching examination', 'error');
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      if (isPaused) return;

      remainingSeconds--;
      updateTimerDisplay();

      // Periodically sync remaining time to storage every 5 seconds
      if (remainingSeconds % 5 === 0) {
        savePausedSession();
      }

      // Warning when 5 minutes remaining
      if (remainingSeconds === 300) {
        const timerBox = document.querySelector('.cbt-timer-box');
        if (timerBox) timerBox.classList.add('warning');
        App.showToast('Attention Candidate: 5 Minutes Remaining!', 'error');
        playBeep(880, 0.3);
      }

      // Auto submit when time runs out
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        App.showToast('Time expired! Submitting your examination...', 'error');
        finalizeSubmission(true);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const el = document.getElementById('cbtTimerDisplay');
    if (!el) return;
    el.textContent = formatTime(remainingSeconds);
  }

  function formatTime(secs) {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.max(0, secs % 60);

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  function savePausedSession() {
    if (!activeTest) return;
    const answeredCount = Object.values(statuses).filter(s => s === 'answered' || s === 'answered-review').length;
    const session = {
      testId: activeTest.id,
      testTitle: activeTest.title,
      category: activeTest.category,
      remainingSeconds,
      totalDurationSeconds,
      answers,
      statuses,
      currentQIndex,
      currentSection,
      currentLang,
      totalQuestions: activeTest.questions.length,
      answeredCount,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('cbt_paused_session', JSON.stringify(session));
      if (typeof App !== 'undefined' && App.checkPausedSession) {
        App.checkPausedSession();
      }
    } catch (e) {
      console.warn('Could not save test session to storage:', e);
    }
  }

  function pauseTest() {
    if (!activeTest || isPaused) return;

    // Freeze timer
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = true;

    savePausedSession();

    // Populate and display pause overlay
    const overlay = document.getElementById('cbtPauseOverlay');
    const timeEl = document.getElementById('pauseOverlayTime');
    const attEl = document.getElementById('pauseOverlayAttempted');
    const curQEl = document.getElementById('pauseOverlayCurrentQ');

    if (timeEl) timeEl.textContent = formatTime(remainingSeconds);
    if (attEl) {
      const answeredCount = Object.values(statuses).filter(s => s === 'answered' || s === 'answered-review').length;
      attEl.textContent = `${answeredCount} / ${activeTest.questions.length}`;
    }
    if (curQEl) curQEl.textContent = `Question ${currentQIndex + 1}`;

    if (overlay) {
      overlay.style.display = 'flex';
    }

    App.showToast('⏸️ Mock Test Paused. Timer stopped.', 'info');
    playBeep(350, 0.15);
  }

  function resumeTest() {
    if (!activeTest) return;

    isPaused = false;
    const overlay = document.getElementById('cbtPauseOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    // Restart timer
    startTimer();
    savePausedSession();
    App.showToast('▶️ Mock Test Resumed! Timer running.', 'success');
    playBeep(520, 0.1);
  }

  function exitToHome(confirmPrompt = true) {
    if (!activeTest) {
      if (cbtModal) {
        cbtModal.classList.remove('active');
        cbtModal.style.display = 'none';
        cbtModal.innerHTML = '';
      }
      App.switchView('homeView');
      return;
    }

    if (confirmPrompt && !isPaused) {
      const confirmExit = confirm('Pause this mock test and return to the home page?\n\nYour remaining time and answers will be saved so you can resume anytime.');
      if (!confirmExit) return;
    }

    // Stop timer and persist
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = true;
    savePausedSession();

    // Hide CBT Modal
    if (cbtModal) {
      cbtModal.classList.remove('active');
      cbtModal.style.display = 'none';
    }

    // Switch to Home View
    App.switchView('homeView');
    if (typeof App !== 'undefined' && App.checkPausedSession) {
      App.checkPausedSession();
    }
    App.showToast('⏸️ Mock test paused. Click "Resume Mock Test" anytime from the banner to continue.', 'info');
  }

  async function resumeFromStorage() {
    const raw = localStorage.getItem('cbt_paused_session');
    if (!raw) {
      App.showToast('No paused examination session found.', 'error');
      return;
    }

    let saved;
    try {
      saved = JSON.parse(raw);
    } catch (e) {
      App.showToast('Corrupted session data. Please start a new test.', 'error');
      return;
    }

    const user = API.getUser();
    if (!user) {
      App.openAuthModal('login', () => resumeFromStorage());
      App.showToast('Please log in to resume your mock test', 'info');
      return;
    }

    try {
      App.showToast(`Resuming "${saved.testTitle}"...`, 'info');
      const data = await API.getTestById(saved.testId);
      activeTest = data.test;

      if (!activeTest || !activeTest.questions || activeTest.questions.length === 0) {
        throw new Error('Test questions could not be loaded.');
      }

      // Restore full state
      remainingSeconds = typeof saved.remainingSeconds === 'number' ? saved.remainingSeconds : activeTest.durationMinutes * 60;
      totalDurationSeconds = typeof saved.totalDurationSeconds === 'number' ? saved.totalDurationSeconds : activeTest.durationMinutes * 60;
      answers = saved.answers || {};
      statuses = saved.statuses || {};
      currentQIndex = Math.min(saved.currentQIndex || 0, activeTest.questions.length - 1);
      currentLang = saved.currentLang || 'en';
      isPaused = false;

      const sections = activeTest.sections && activeTest.sections.length > 0
        ? activeTest.sections
        : Array.from(new Set(activeTest.questions.map(q => q.section || 'General')));
      activeTest.sections = sections;
      currentSection = saved.currentSection || activeTest.questions[currentQIndex].section || sections[0];

      // Ensure all questions have status
      activeTest.questions.forEach((q, idx) => {
        if (!statuses[q.id]) {
          statuses[q.id] = idx === currentQIndex ? 'not-answered' : 'not-visited';
        }
      });

      renderCBTInterface();
      cbtModal.style.display = 'flex';
      cbtModal.classList.add('active');

      renderQuestion(currentQIndex);
      renderPalette();

      startTimer();
      if (typeof App !== 'undefined' && App.checkPausedSession) {
        App.checkPausedSession();
      }

      App.showToast('🎉 Mock Test Resumed! Continuing from where you left off.', 'success');
      playBeep(440, 0.1);
    } catch (err) {
      console.error('Failed to resume test:', err);
      App.showToast(err.message || 'Error resuming test session', 'error');
    }
  }

  function discardPausedSession() {
    const raw = localStorage.getItem('cbt_paused_session');
    if (!raw) return;

    const confirmDiscard = confirm('Are you sure you want to discard your paused mock test?\n\nAll current progress and answers for this session will be permanently erased.');
    if (!confirmDiscard) return;

    localStorage.removeItem('cbt_paused_session');
    clearInterval(timerInterval);
    timerInterval = null;
    activeTest = null;
    isPaused = false;

    if (cbtModal) {
      cbtModal.classList.remove('active');
      cbtModal.style.display = 'none';
      cbtModal.innerHTML = '';
    }

    if (typeof App !== 'undefined' && App.checkPausedSession) {
      App.checkPausedSession();
    }
    App.showToast('Paused test session discarded.', 'info');
  }

  function renderCBTInterface() {
    const user = API.getUser() || { name: 'Candidate', rollNo: 'CB2026-0000' };

    cbtModal.innerHTML = `
      <div class="cbt-container">
        <!-- Top Official Header -->
        <header class="cbt-header">
          <div class="cbt-header-left">
            <div class="cbt-exam-logo">CB</div>
            <div class="cbt-exam-info">
              <h2>${escapeHtml(activeTest.title)}</h2>
              <p>DEFENSE & COMPETITIVE EXAM SIMULATOR • ${escapeHtml(activeTest.category.toUpperCase())}</p>
            </div>
          </div>
          <div class="cbt-header-right">
            <div class="cbt-candidate-box">
              <div class="cbt-candidate-photo">💂</div>
              <div class="cbt-candidate-details">
                <span class="cbt-cname">${escapeHtml(user.name)}</span>
                <span class="cbt-croll">Roll: ${escapeHtml(user.rollNo || 'CB-ASPIRANT')}${user.activePackage && user.activePackage.status === 'ACTIVE' ? ` • <strong style="color: #4ade80;">ACTIVE PASS</strong>` : ''}</span>
              </div>
            </div>
            <div class="cbt-timer-box">
              <span class="cbt-timer-label">Time Left</span>
              <span class="cbt-timer-display" id="cbtTimerDisplay">--:--</span>
            </div>
            <button class="btn-cbt-header-pause" onclick="CBTEngine.pauseTest()" title="Pause Examination Timer">
              ⏸️ Pause
            </button>
            <button class="btn-cbt-header-home" onclick="CBTEngine.exitToHome()" title="Save Progress & Return to Home">
              🏠 Home
            </button>
            <button class="btn-cbt-header-submit" onclick="CBTEngine.finalizeSubmission(false)" title="Submit Mock and End Test">
              🏁 Submit Mock
            </button>
          </div>
        </header>

        <!-- Dynamic Tactical Pause Overlay -->
        <div id="cbtPauseOverlay" class="cbt-pause-overlay" style="display: none;">
          <div class="cbt-pause-card">
            <div class="cbt-pause-badge">⏸️ EXAMINATION PAUSED / परीक्षा स्थगित</div>
            <h2 class="cbt-pause-title">${escapeHtml(activeTest.title)}</h2>
            <p class="cbt-pause-sub">Your countdown timer has been stopped and all answers are securely saved.</p>
            
            <div class="cbt-pause-stats">
              <div class="pause-stat-item">
                <span class="pause-stat-label">TIME REMAINING</span>
                <span class="pause-stat-val" id="pauseOverlayTime">--:--</span>
              </div>
              <div class="pause-stat-item">
                <span class="pause-stat-label">ATTEMPTED</span>
                <span class="pause-stat-val" id="pauseOverlayAttempted">0 / 0</span>
              </div>
              <div class="pause-stat-item">
                <span class="pause-stat-label">CURRENT QUESTION</span>
                <span class="pause-stat-val" id="pauseOverlayCurrentQ">Q1</span>
              </div>
            </div>

            <div class="cbt-pause-actions">
              <button class="btn-pause-resume" onclick="CBTEngine.resumeTest()">
                ▶️ Resume Mock Test
              </button>
              <button class="btn-pause-home" onclick="CBTEngine.exitToHome(false)">
                🏠 Save & Return to Home Page
              </button>
            </div>
            <p class="cbt-pause-footer-note">💡 You can resume this mock test anytime from the home page alert banner.</p>
          </div>
        </div>

        <!-- Sub-header with Section Tabs & Language selector -->
        <div class="cbt-sub-header">
          <div class="cbt-sections-list" id="cbtSectionsList">
            ${activeTest.sections.map(sec => `
              <button class="cbt-section-tab ${sec === currentSection ? 'active' : ''}" onclick="CBTEngine.switchSection('${escapeHtml(sec)}')">
                ${escapeHtml(sec)}
              </button>
            `).join('')}
          </div>
          <div class="cbt-language-selector">
            <span>View in:</span>
            <button class="cbt-lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="CBTEngine.setLanguage('en')">English</button>
            <button class="cbt-lang-btn ${currentLang === 'hi' ? 'active' : ''}" onclick="CBTEngine.setLanguage('hi')">हिन्दी</button>
          </div>
        </div>

        <!-- Main Body -->
        <div class="cbt-body">
          <!-- Question Pane (Left) -->
          <div class="cbt-question-area" id="cbtQuestionArea">
            <!-- Dynamic Question Content Injected Here -->
          </div>

          <!-- Question Palette (Right) -->
          <div class="cbt-palette-sidebar">
            <div class="cbt-palette-header">Question Palette</div>
            
            <!-- Standard TCS iON Legend -->
            <div class="cbt-legend-grid">
              <div class="cbt-legend-item">
                <span class="palette-badge badge-answered" id="countAnswered">0</span> Answered
              </div>
              <div class="cbt-legend-item">
                <span class="palette-badge badge-not-answered" id="countNotAnswered">0</span> Not Answered
              </div>
              <div class="cbt-legend-item">
                <span class="palette-badge badge-not-visited" id="countNotVisited">0</span> Not Visited
              </div>
              <div class="cbt-legend-item">
                <span class="palette-badge badge-marked-review" id="countMarkedReview">0</span> Marked for Review
              </div>
              <div class="cbt-legend-item" style="grid-column: span 2;">
                <span class="palette-badge badge-answered-review" id="countAnsweredReview">0</span> Answered & Marked for Review
              </div>
            </div>

            <!-- Question Numbers Grid -->
            <div class="cbt-palette-numbers" id="cbtPaletteNumbers">
              <!-- Number buttons rendered here -->
            </div>

            <!-- Footer Buttons -->
            <div class="cbt-palette-footer">
              <button class="btn-cbt-view-paper" onclick="CBTEngine.openQuestionPaper()">📜 Question Paper</button>
              <button class="btn-cbt-header-pause" style="width: 100%; justify-content: center; margin-bottom: 0.4rem;" onclick="CBTEngine.pauseTest()">⏸️ Pause Mock Test</button>
              <button class="btn-cbt-submit-final" onclick="CBTEngine.finalizeSubmission(false)">🏁 Submit Mock & End Test</button>
            </div>
          </div>
        </div>
      </div>
    `;

    renderQuestion(currentQIndex || 0);
    renderPalette();
  }

  function renderQuestion(index) {
    currentQIndex = index;
    const q = activeTest.questions[index];
    if (!q) return;

    // Update section if needed
    if (q.section && q.section !== currentSection) {
      currentSection = q.section;
      updateSectionTabs();
    }

    // Mark as not-answered if it was not-visited
    if (statuses[q.id] === 'not-visited') {
      statuses[q.id] = 'not-answered';
      savePausedSession();
    }

    const questionArea = document.getElementById('cbtQuestionArea');
    const qText = currentLang === 'hi' && q.textHi ? q.textHi : q.textEn;
    const selectedOpt = answers[q.id];

    questionArea.innerHTML = `
      <div class="cbt-q-header">
        <div class="cbt-q-number">Question ${index + 1} of ${activeTest.questions.length}</div>
        <div class="cbt-q-marks">
          <span class="mark-tag-pos">+${activeTest.marksPerQuestion || 1} Mark</span>
          <span class="mark-tag-neg">-${activeTest.negativeMarking || 0.25} Negative</span>
        </div>
      </div>

      <div class="cbt-q-content">
        <div class="cbt-q-text">${escapeHtml(qText)}</div>

        <div class="cbt-options-list">
          ${q.options.map((opt, optIdx) => `
            <div class="cbt-option-item ${selectedOpt === optIdx ? 'selected' : ''}" onclick="CBTEngine.selectOption(${optIdx})">
              <input type="radio" name="cbtOption" id="opt_${optIdx}" value="${optIdx}" ${selectedOpt === optIdx ? 'checked' : ''}>
              <span class="cbt-opt-label">${String.fromCharCode(65 + optIdx)}</span>
              <span class="cbt-opt-text">${escapeHtml(opt)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="cbt-action-footer">
        <div class="cbt-actions-left">
          <button class="btn-cbt-action btn-cbt-review" onclick="CBTEngine.markForReviewAndNext()">
            Mark for Review & Next
          </button>
          <button class="btn-cbt-action btn-cbt-clear" onclick="CBTEngine.clearResponse()">
            Clear Response
          </button>
        </div>
        <div class="cbt-actions-right">
          <button class="btn-cbt-action btn-cbt-save-next" onclick="CBTEngine.saveAndNext()">
            Save & Next ➔
          </button>
        </div>
      </div>
    `;

    renderPalette();
  }

  function renderPalette() {
    const paletteNumbers = document.getElementById('cbtPaletteNumbers');
    if (!paletteNumbers) return;

    let counts = {
      answered: 0,
      notAnswered: 0,
      notVisited: 0,
      markedReview: 0,
      answeredReview: 0
    };

    paletteNumbers.innerHTML = activeTest.questions.map((q, idx) => {
      const status = statuses[q.id] || 'not-visited';
      let badgeClass = 'badge-not-visited';

      if (status === 'answered') {
        badgeClass = 'badge-answered';
        counts.answered++;
      } else if (status === 'not-answered') {
        badgeClass = 'badge-not-answered';
        counts.notAnswered++;
      } else if (status === 'marked-review') {
        badgeClass = 'badge-marked-review';
        counts.markedReview++;
      } else if (status === 'answered-review') {
        badgeClass = 'badge-answered-review';
        counts.answeredReview++;
      } else {
        counts.notVisited++;
      }

      const isCurrent = idx === currentQIndex ? 'current' : '';

      return `
        <button class="cbt-pal-btn ${badgeClass} ${isCurrent}" onclick="CBTEngine.jumpToQuestion(${idx})">
          ${idx + 1}
        </button>
      `;
    }).join('');

    // Update count labels
    const elAns = document.getElementById('countAnswered');
    const elNotAns = document.getElementById('countNotAnswered');
    const elNotVis = document.getElementById('countNotVisited');
    const elRev = document.getElementById('countMarkedReview');
    const elAnsRev = document.getElementById('countAnsweredReview');

    if (elAns) elAns.textContent = counts.answered;
    if (elNotAns) elNotAns.textContent = counts.notAnswered;
    if (elNotVis) elNotVis.textContent = counts.notVisited;
    if (elRev) elRev.textContent = counts.markedReview;
    if (elAnsRev) elAnsRev.textContent = counts.answeredReview;
  }

  function selectOption(optIndex) {
    const q = activeTest.questions[currentQIndex];
    answers[q.id] = optIndex;

    // Visual selection
    const items = document.querySelectorAll('.cbt-option-item');
    items.forEach((item, idx) => {
      if (idx === optIndex) {
        item.classList.add('selected');
        const radio = item.querySelector('input');
        if (radio) radio.checked = true;
      } else {
        item.classList.remove('selected');
        const radio = item.querySelector('input');
        if (radio) radio.checked = false;
      }
    });

    savePausedSession();
    playBeep(520, 0.05);
  }

  function saveAndNext() {
    const q = activeTest.questions[currentQIndex];
    if (answers[q.id] !== undefined && answers[q.id] !== null) {
      statuses[q.id] = 'answered';
    } else {
      statuses[q.id] = 'not-answered';
    }

    savePausedSession();

    if (currentQIndex < activeTest.questions.length - 1) {
      renderQuestion(currentQIndex + 1);
    } else {
      renderPalette();
      App.showToast('You have reached the end of the question paper. You may review, pause, or submit.', 'info');
    }
  }

  function markForReviewAndNext() {
    const q = activeTest.questions[currentQIndex];
    if (answers[q.id] !== undefined && answers[q.id] !== null) {
      statuses[q.id] = 'answered-review';
    } else {
      statuses[q.id] = 'marked-review';
    }

    savePausedSession();

    if (currentQIndex < activeTest.questions.length - 1) {
      renderQuestion(currentQIndex + 1);
    } else {
      renderPalette();
    }
  }

  function clearResponse() {
    const q = activeTest.questions[currentQIndex];
    delete answers[q.id];
    statuses[q.id] = 'not-answered';
    savePausedSession();
    renderQuestion(currentQIndex);
  }

  function jumpToQuestion(index) {
    renderQuestion(index);
  }

  function switchSection(sectionName) {
    currentSection = sectionName;
    updateSectionTabs();

    // Find first question in this section
    const targetIdx = activeTest.questions.findIndex(q => q.section === sectionName);
    if (targetIdx !== -1) {
      renderQuestion(targetIdx);
    }
  }

  function updateSectionTabs() {
    const tabs = document.querySelectorAll('.cbt-section-tab');
    tabs.forEach(tab => {
      if (tab.textContent.trim() === currentSection.trim()) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    const btns = document.querySelectorAll('.cbt-lang-btn');
    btns.forEach(btn => {
      if ((lang === 'en' && btn.textContent === 'English') || (lang === 'hi' && btn.textContent === 'हिन्दी')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    savePausedSession();
    renderQuestion(currentQIndex);
  }

  function openQuestionPaper() {
    const content = document.getElementById('generalModalContent');

    content.innerHTML = `
      <div style="max-height: 75vh; overflow-y: auto; padding-right: 0.5rem;">
        <h2 style="color: var(--gold-bright); margin-bottom: 0.5rem;">📜 Full Question Paper</h2>
        <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 1.5rem;">${escapeHtml(activeTest.title)}</p>
        
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${activeTest.questions.map((q, idx) => `
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--border-gold-glow);">
              <div style="font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Q${idx + 1}. [${escapeHtml(q.section)}] ${escapeHtml(q.textEn)}</div>
              ${q.textHi ? `<div style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 0.5rem;">${escapeHtml(q.textHi)}</div>` : ''}
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem; font-size: 0.85rem; color: #94a3b8;">
                ${q.options.map((opt, oIdx) => `
                  <div>(${String.fromCharCode(65 + oIdx)}) ${escapeHtml(opt)}</div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    App.openGeneralModal();
  }

  function promptSubmit() {
    // Directly submit and show marks immediately per candidate request
    return finalizeSubmission(false);
  }

  async function finalizeSubmission(autoSubmit = false) {
    // 1. Immediately close any open general modal
    App.closeGeneralModal();

    // 2. Clear timer immediately and remove stored paused state
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    localStorage.removeItem('cbt_paused_session');
    if (typeof App !== 'undefined' && App.checkPausedSession) {
      App.checkPausedSession();
    }

    if (!activeTest) {
      console.warn('No active test session to finalize.');
      return;
    }

    const timeSpentSeconds = Math.max(1, totalDurationSeconds - remainingSeconds);
    const testIdToSubmit = activeTest.id;
    const testAnswers = { ...answers };
    const testStatuses = { ...statuses };

    // 3. Immediately end test and destroy CBT interface so screen completely clears
    if (cbtModal) {
      cbtModal.classList.remove('active');
      cbtModal.style.display = 'none';
      cbtModal.innerHTML = '';
    }
    activeTest = null;

    // 4. Alert candidate
    App.showToast('Evaluating mock test & calculating candidate marks...', 'info');

    try {
      const result = await API.submitTest(testIdToSubmit, testAnswers, timeSpentSeconds, testStatuses);

      // 5. Display the Testbook Style Scorecard on the page
      Scorecard.display(result.scorecard);

      App.showToast('🎉 Mock Test Evaluated! Testbook-Style Analysis is ready.', 'success');
    } catch (err) {
      console.error('Submission failed:', err);
      App.showToast(err.message || 'Error processing test submission.', 'error');
      App.switchView('studentView');
    }
  }

  // Web Audio Synth for CBT sounds
  function playBeep(freq, duration) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext muted/unsupported
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
    startTest,
    pauseTest,
    resumeTest,
    exitToHome,
    resumeFromStorage,
    discardPausedSession,
    selectOption,
    saveAndNext,
    markForReviewAndNext,
    clearResponse,
    jumpToQuestion,
    switchSection,
    setLanguage,
    openQuestionPaper,
    promptSubmit,
    confirmSubmission: () => finalizeSubmission(false),
    finalizeSubmission: () => finalizeSubmission(false)
  };
})();
