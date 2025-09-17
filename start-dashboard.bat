@echo off
title Personal Dashboard Launcher
color 0A

echo.
echo ========================================
echo    Personal Dashboard Launcher
echo ========================================
echo.
echo Starting backend API server...
echo.

REM Start the backend server in a new window
start "Dashboard API Server" /D "%~dp0ReactProject.API" cmd /k "npm run app"

REM Wait a moment for the backend to start
timeout /t 3 /nobreak >nul

echo Backend server starting in separate window...
echo.
echo Starting frontend development server...
echo.

REM Navigate to frontend directory and start Vite
cd /d "%~dp0reacttypescriptproject"
start "Dashboard Frontend" cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

echo.
echo Opening dashboard in browser...
echo.

REM Open the browser
start "" "http://localhost:52536"

echo.
echo ========================================
echo Dashboard launched successfully!
echo.
echo Frontend: http://localhost:52536
echo Backend:  http://localhost:3001
echo.
echo Press any key to close this window...
echo ========================================
pause >nul