@echo off
setlocal
cd /d "%~dp0"
set BROWSER=none
set PORT=3001
if exist "C:\Program Files\nodejs\npm.cmd" (
  "C:\Program Files\nodejs\npm.cmd" start
  exit /b %ERRORLEVEL%
)
where npm >nul 2>&1 && npm start && exit /b %ERRORLEVEL%
echo npm was not found. Install Node.js from https://nodejs.org
pause
exit /b 1
