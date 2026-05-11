@echo off
set "PATH=%SystemRoot%\System32;%PATH%"
title Mkisans Developer Server
color 0A

echo =======================================================
echo            MKisans Platform Starter
echo =======================================================
echo.
echo Starting the Backend API and Mobile Web Interface...
echo.

cd /d "%~dp0"
call npm run dev

pause
