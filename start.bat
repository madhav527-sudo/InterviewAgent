@echo off
echo Starting CohortIQ Backend on http://localhost:8000
cd /d "%~dp0backend"
start "CohortIQ Backend" cmd /k "\"%~dp0backend\.venv\Scripts\python.exe\" -m uvicorn main:app --reload --port 8000"
echo Starting CohortIQ Frontend on http://localhost:5173
cd /d "%~dp0frontend"
start "CohortIQ Frontend" cmd /k "npm run dev"
echo.
echo ========================================
echo   CohortIQ is starting!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
