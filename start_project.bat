@echo off
SETLOCAL EnableDelayedExpansion

REM =============================================================================
REM JalWiKi Project Startup Script
REM This script starts both Django backend and Next.js frontend servers
REM =============================================================================

echo.
echo ========================================
echo   JalWiKi Project Startup Script
echo ========================================
echo.

REM Get the directory where the script is located
SET "SCRIPT_DIR=%~dp0"
echo [INFO] Project root directory: %SCRIPT_DIR%
cd /D "%SCRIPT_DIR%"

REM Check if virtual environment exists
echo.
echo [STEP 1] Checking Python virtual environment...
IF EXIST ".venv\Scripts\activate.bat" (
    echo [INFO] Virtual environment found at .venv. Activating...
    call .venv\Scripts\activate.bat
    echo [SUCCESS] Virtual environment activated.
) ELSE IF EXIST "venv\Scripts\activate.bat" (
    echo [INFO] Virtual environment found at venv. Activating...
    call venv\Scripts\activate.bat
    echo [SUCCESS] Virtual environment activated.
) ELSE (
    echo [WARNING] Virtual environment not found at 'venv' or '.venv'
    echo [INFO] Using system Python. Consider creating a virtual environment:
    echo          python -m venv .venv
    echo          .venv\Scripts\activate
    echo          pip install -r requirements.txt
)

REM Check if Django is available
echo.
echo [STEP 2] Checking Django installation...
python -c "import django; print('Django version:', django.get_version())" 2>nul
IF ERRORLEVEL 1 (
    echo [ERROR] Django not found! Please install requirements:
    echo          pip install -r requirements.txt
    pause
    goto :eof
) ELSE (
    echo [SUCCESS] Django is available.
)

REM Check if manage.py exists
IF NOT EXIST "manage.py" (
    echo [ERROR] manage.py not found in current directory!
    echo [INFO] Please run this script from the project root directory.
    pause
    goto :eof
)

REM Run Django migrations (optional but recommended)
echo.
echo [STEP 3] Running Django migrations...
python manage.py migrate --run-syncdb
IF ERRORLEVEL 1 (
    echo [WARNING] Migration failed. Continuing anyway...
) ELSE (
    echo [SUCCESS] Migrations completed.
)

REM Start Django server
echo.
echo [STEP 4] Starting Django backend server...
echo [INFO] Django server will start on http://localhost:8000
echo [INFO] Admin panel: http://localhost:8000/admin
echo [INFO] API endpoints: http://localhost:8000/api/
echo.

REM Start Django in a new window with better error handling
start "JalWiKi Django Backend" cmd /c "echo Starting Django server... && python manage.py runserver 8000 && echo Django server stopped. Press any key to close... && pause"

REM Wait longer for Django to fully initialize
echo [INFO] Waiting for Django server to initialize...
timeout /t 8 /nobreak > nul

REM Test if Django server is running
echo [INFO] Testing Django server connection...
curl -s http://localhost:8000 > nul 2>&1
IF ERRORLEVEL 1 (
    echo [WARNING] Django server might not be ready yet. Continuing...
) ELSE (
    echo [SUCCESS] Django server is responding.
)

REM Navigate to frontend directory
echo.
echo [STEP 5] Setting up Next.js frontend...
IF NOT EXIST "jalwiki_ui" (
    echo [ERROR] Frontend directory 'jalwiki_ui' not found!
    echo [INFO] Please ensure the frontend directory exists.
    pause
    goto :eof
)

cd jalwiki_ui

REM Check if package.json exists
IF NOT EXIST "package.json" (
    echo [ERROR] package.json not found in jalwiki_ui directory!
    echo [INFO] Please ensure you're in the correct project directory.
    pause
    goto :eof
)

REM Check if node_modules exists
IF NOT EXIST "node_modules" (
    echo [WARNING] node_modules not found. Installing dependencies...
    call npm install
    IF ERRORLEVEL 1 (
        echo [ERROR] npm install failed!
        pause
        goto :eof
    )
)

REM Start Next.js in development mode (faster startup)
echo.
echo [STEP 6] Starting Next.js frontend...
echo [INFO] Next.js will start on http://localhost:3000
echo [INFO] Development mode for faster startup
echo.
echo [SUCCESS] Both servers should now be running:
echo           - Django Backend: http://localhost:8000
echo           - Next.js Frontend: http://localhost:3000
echo.
echo [INFO] Press Ctrl+C to stop the Next.js server
echo [INFO] Close the Django window manually when done
echo.

REM Start Next.js in development mode instead of production
call npm run dev

echo.
echo [INFO] Next.js development server stopped.
echo [INFO] Please manually close the Django server window if it's still open.
echo [INFO] Script finished.
echo.
pause

ENDLOCAL