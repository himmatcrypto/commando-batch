# COMMANDO BATCH - DEFENSE & COMPETITIVE EXAM CBT PLATFORM
### 3D Realistic Exam Simulator for SSC, Bank, CAPF (AC), Sub-Inspector (SI), and CRPF / CISF LDCE

![Commando Batch Banner](https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80)

---

## 🎖️ Overview

**Commando Batch** is a full-stack web application designed for students and serving paramilitary personnel preparing for competitive examinations such as:
1. **LDCE (Limited Departmental Competitive Exams)**:
   - **CISF ASI / Sub-Inspector (Executive) LDCE**
   - **CRPF SI (GD) LDCE**
   - Real coverage of **CISF Act 1968, CISF Rules 2001, CRPF Act 1949, IPC (Sections 96-106), CrPC (Section 100), Aviation Security (ASG), Riot Control & Weaponry**.
2. **CAPF (AC)**: UPSC Assistant Commandant Paper-I (General Ability & Intelligence).
3. **Sub-Inspector (SI)**: Delhi Police & CAPF Sub-Inspector (SSC CPO).
4. **SSC**: Staff Selection Commission (SSC CGL Tier-1, CHSL, GD Constable).
5. **Bank**: SBI & IBPS Probationary Officer (PO) & Clerk.

---

## ⚡ Key Highlights & Features

### 1. 3D Realistic Defense Aesthetic
- **Three.js Interactive 3D Insignia**: Real-time rotating metallic gold Commando Emblem that tilts and reacts to mouse movement with authentic specular highlights.
- **Paramilitary Visuals**: High-definition backgrounds and color palettes inspired by official CRPF and CISF portals (`#0a0e14`, `#10b981`, `#fbbf24`, tactical camouflage gradients).
- **3D Card Tilts**: Interactive perspective transforms on all mock test cards and KPI stat containers.

### 2. Student Panel & Account Management
- **Registration & Login**: Secure token-based authentication. Automatic generation of military-style Candidate Roll Numbers (e.g. `LDCE-2026-8842`).
- **Profile & Force Unit**: Target exam selection (CISF LDCE, CRPF LDCE, CAPF, SI, SSC, Bank) and force unit designation.
- **My Scorecards & Performance History**: Comprehensive record of all attempted tests, scores, percentiles, and pass/fail qualifications.

### 3. Official TCS iON Computer Based Test (CBT) Simulator
- Exact match of the examination interface used by SSC, TCS iON, and NTA:
  - **Candidate Bar**: Candidate photo, roll number, exam title, and real-time countdown timer with 5-minute audible warning.
  - **Official 5-Color Question Palette**:
    1. Not Visited (Silver)
    2. Not Answered (Orange/Red)
    3. Answered (Green)
    4. Marked for Review (Purple)
    5. Answered & Marked for Review (Purple with Green badge)
  - **Section Tabs**: Quick switching between sections (Professional Knowledge, Reasoning, Quant, English/Hindi).
  - **Bilingual Switcher**: Switch questions seamlessly between English and Hindi on the fly.
  - **Final Submission Summary**: Pre-submission confirmation matrix showing answered, unanswered, and marked question counts.

### 4. Comprehensive Defense Scorecard & Marks Analysis
- **3D Performance Badge**: Total Marks, Cutoff comparison, and Qualification verdict.
- **4 Key Diagnostic Metrics**:
  - Accuracy Rate %
  - Estimated All-India Percentile
  - Total Time Utilized
  - Average Speed (seconds per question)
- **Subject-Wise Breakdown Table**: Detailed sectional marks, attempts, correct/wrong counts, and sectional accuracy.
- **Question-by-Question Solution Explorer**:
  - Filter by All, Correct, Incorrect, or Unattempted.
  - Candidate chosen option vs Official correct option.
  - Detailed explanations in English & Hindi citing statutory provisions (CISF Rules, CRPF standing orders, IPC, mathematical formulas).
- **Official Print / PDF Export**: Formatted printable candidate certificate with Commando Batch seal.

### 5. Dedicated Admin Panel (HQ Command Center)
- **Platform Analytics**: Total enrolled students, active mock tests, total attempts, platform average score, and qualification pass rate.
- **Mock Test Creator & Question Builder**:
  - Form to create tests with custom duration, total marks, positive marks, and negative marking penalties.
  - Interactive Question Builder to add questions with bilingual text (English & Hindi), 4 options, correct answer index, section assignment, and detailed explanations.
- **Candidate Submission Inspector**: View any student's complete scorecard and answer sheet.
- **Candidate Roster**: Directory of all registered aspirants.
- **Database Reset Button**: Re-seeds default authentic mock tests with one click.

---

## 🔑 Pre-Seeded Demo Accounts

You can test the platform instantly using the demo buttons on the login modal or with these credentials:

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin HQ** | `admin@commandobatch.gov.in` | `admin123` | Full access to Admin Panel, Test Creator, and Student Roster |
| **CISF LDCE Student** | `commando@student.in` | `student123` | Constable Vikas Sharma (Roll: CB2026-8842, Force: CISF) |
| **SSC SI Student** | `rahul@student.in` | `student123` | Rahul Verma (Roll: CB2026-9014, Target: SSC CPO SI) |

---

## 🚀 How to Run the Website

### Option 1: One-Click Windows Batch File
Double-click `run.bat` in the project root folder.

### Option 2: Command Line
```powershell
# Set Node.js path if needed and run
node server/index.js
```

Open your browser at:
👉 **`http://localhost:5000`**

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, JWT, bcryptjs, persistent JSON store.
- **Frontend**: Vanilla ES6+ SPA, Three.js 3D WebGL engine, CSS 3D Transforms, Web Audio API synth.
- **Exam Engine**: Official TCS iON Computer Based Test architecture.
