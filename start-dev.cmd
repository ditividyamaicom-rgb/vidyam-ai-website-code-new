@echo off
setlocal
cd /d "%~dp0"
set BROWSER=none
if exist "C:\Program Files\nodejs\npm.cmd" (
  "C:\Program Files\nodejs\npm.cmd" start
  exit /b %ERRORLEVEL%
)
where npm >nul 2>&1 && npm start && exit /b %ERRORLEVEL%
echo.
echo npm was not found. Install Node.js from https://nodejs.org
echo and tick "Add to PATH", or add your Node install folder to PATH.
echo.
pause
exit /b 1
