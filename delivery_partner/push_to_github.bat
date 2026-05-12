@echo off
echo.
echo ===================================================
echo   MKisans Delivery Partner - LOCAL SYNC TO MKISHAN
echo ===================================================
echo.

set SOURCE_DIR=f:\project\ANTI_GRAVITY\Delivery Partner
set TARGET_PROJECT=f:\project\ANTI_GRAVITY\Mkishan
set TARGET_SUBFOLDER=delivery Partner

echo 1. Creating folder: %TARGET_SUBFOLDER% inside Mkishan...
if not exist "%TARGET_PROJECT%\%TARGET_SUBFOLDER%" mkdir "%TARGET_PROJECT%\%TARGET_SUBFOLDER%"

echo 2. Syncing files locally (No Internet Required)...
echo.

echo Copying Root files...
xcopy /y /q "package.json" "%TARGET_PROJECT%\%TARGET_SUBFOLDER%\"
xcopy /y /q "vite.config.js" "%TARGET_PROJECT%\%TARGET_SUBFOLDER%\"
xcopy /y /q "index.html" "%TARGET_PROJECT%\%TARGET_SUBFOLDER%\"

echo Copying src folder...
xcopy /s /e /y /q "src" "%TARGET_PROJECT%\%TARGET_SUBFOLDER%\src\"

echo Copying public folder...
xcopy /s /e /y /q "public" "%TARGET_PROJECT%\%TARGET_SUBFOLDER%\public\"

echo Copying backend folder...
xcopy /s /e /y /q /exclude:exclude_list.txt "backend" "%TARGET_PROJECT%\%TARGET_SUBFOLDER%\backend\"

echo Copying mobile folder (Expo)...
xcopy /s /e /y /q /exclude:exclude_list.txt "mobile" "%TARGET_PROJECT%\%TARGET_SUBFOLDER%\mobile\"

echo.
echo ===================================================
echo   SUCCESS! Files are now in your Mkishan project.
echo.
echo   NOW: Go to the Mkishan folder and run:
echo   git add .
echo   git commit -m "Add Delivery Partner module"
echo   git push
echo ===================================================
pause
