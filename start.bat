@echo off
echo ========================================
echo Starting MerchPoint Application
echo ========================================
echo.

:: Start Spring Boot Backend
echo [1/2] Starting Spring Boot Backend...
start "Spring Boot Backend" cmd /k "cd backend\dpwh && mvnw spring-boot:run"
timeout /t 3 /nobreak >nul

:: Start React Frontend
echo [2/2] Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Both services are starting!
echo ========================================
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop both services...
pause >nul

:: Kill both processes when user presses a key
echo.
echo Stopping services...
taskkill /FI "WINDOWTITLE eq Spring Boot Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq React Frontend*" /T /F >nul 2>&1
echo Services stopped.
timeout /t 2 /nobreak >nul
