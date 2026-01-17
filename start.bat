@echo off
REM Script de inicialização para Windows
REM Use este arquivo se estiver testando localmente no Windows

echo.
echo ==========================================
echo    Haxball Bot - Initialization Script
echo ==========================================
echo.

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

if not exist "configs" (
  echo Creating configs directory...
  mkdir configs
)

if not exist "configs\default.json" (
  echo Creating default configuration...
  (
    echo {
    echo   "version": "2.0.0",
    echo   "port": 3002,
    echo   "adminSecret": "change_me_with_a_secure_secret",
    echo   "rooms": [],
    echo   "webhooks": {}
    echo }
  ) > configs\default.json
)

echo.
echo Starting server...
echo.

npm start

pause
