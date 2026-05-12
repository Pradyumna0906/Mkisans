@echo off
echo Starting MKisans Delivery Partner Project...

start cmd /k "cd backend && npm run dev"
start cmd /k "npm run dev"

echo.
echo Backend will run on http://localhost:5001
echo Frontend will run on http://localhost:5173
echo.
echo Please keep both terminal windows open.
