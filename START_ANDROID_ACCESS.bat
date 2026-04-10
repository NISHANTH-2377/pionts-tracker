@echo off
Title Points Tracker - Network Start
Color 0A

echo.
echo ======================================
echo Points Tracker - Android Setup
echo ======================================
echo.

cd frontend

echo Checking .env.local configuration...
if exist .env.local (
    echo ✓ .env.local found
) else (
    echo ✗ Creating .env.local file...
    (
        echo REACT_APP_API_URL=http://10.64.105.72:5000/api
        echo REACT_APP_SOCKET_URL=http://10.64.105.72:5000
    ) > .env.local
    echo ✓ .env.local created
)

echo.
echo Starting Points Tracker Frontend...
echo.
echo ======================================
echo Access from:
echo.
echo Computer: http://localhost:3000
echo Android:  http://10.64.105.72:3000
echo.
echo Make sure Android is on same WiFi!
echo ======================================
echo.
echo Starting server...
echo.

npm start

pause
