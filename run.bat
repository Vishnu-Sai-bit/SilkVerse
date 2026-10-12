@echo off
title SilkVerse Launcher
echo ========================================================
echo        SilkVerse - Handloom Pure Silk Sarees
echo ========================================================
echo.
echo [1/3] Starting SilkVerse Express Backend on port 5001...
start "SilkVerse Backend (:5001)" cmd /k "cd backend && npm run dev"

echo [2/3] Starting SilkVerse Next.js Frontend on port 3001...
start "SilkVerse Frontend (:3001)" cmd /k "cd frontend && npm run dev"

echo.
echo [3/3] Opening SilkVerse Storefront in your browser...
timeout /t 3 >nul
start http://localhost:3001

echo.
echo ========================================================
echo  All services launched successfully!
echo  Storefront: http://localhost:3001
echo  Backend:    http://localhost:5001/health
echo ========================================================
pause
