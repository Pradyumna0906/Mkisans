@echo off
echo ==========================================
echo 🌾 MKISANS AI Price Intelligence Service
echo ==========================================
echo.
cd /d "%~dp0"
echo [1/2] Checking Dependencies...
pip install -r requirements.txt
echo.
echo [2/2] Starting FastAPI Server on Port 8000...
echo.
uvicorn app:app --reload --port 8000
pause
