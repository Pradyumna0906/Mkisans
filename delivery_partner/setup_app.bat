@echo off
echo Installing Capacitor Dependencies...
call npm install @capacitor/core @capacitor/cli @capacitor/android

echo.
echo Building the React Application...
call npm run build

echo.
echo Initializing Capacitor...
call npx cap init "MKisans Delivery" "com.mkisans.delivery" --web-dir dist

echo.
echo Adding Android Platform...
call npx cap add android

echo.
echo Setup Complete! 
echo You can now run "npx cap sync" and "npx cap open android"
pause
