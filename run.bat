@echo off
title Commando Batch - Defense & Competitive Exam Portal
echo ====================================================================
echo   COMMANDO BATCH - DEFENSE & COMPETITIVE EXAM PLATFORM
echo   Target Exams: SSC ^| Bank ^| CAPF ^| SI ^| LDCE (CRPF / CISF)
echo   3D Realistic Portal with Real CBT Examination Simulator
echo ====================================================================
echo.
set PATH=C:\Program Files\nodejs;%PATH%
echo Starting server on http://localhost:5000 ...
echo.
echo [DEMO CREDENTIALS]
echo  - Demo Admin:   admin@commandobatch.gov.in / admin123
echo  - Demo Student: commando@student.in / student123
echo.
node server/index.js
pause
