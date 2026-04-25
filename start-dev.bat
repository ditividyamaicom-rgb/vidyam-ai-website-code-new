@echo off
:start
echo Starting development server...
npm start
echo.
echo Server stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto start

