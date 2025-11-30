@echo off
echo ========================================
echo   Green Oasis Store - Quick Start
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
    echo.
) else (
    echo [1/3] Dependencies already installed ✓
    echo.
)

REM Check if Prisma Client is generated
echo [2/3] Setting up database...
call npm run prisma:generate
echo.

REM Start the application
echo [3/3] Starting application...
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

call npm run dev:all
