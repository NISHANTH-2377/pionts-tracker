@echo off
REM Network IP Configuration Helper for Points Tracker

echo.
echo ======================================
echo Points Tracker - Network Setup
echo ======================================
echo.

REM Get local IP
for /f "tokens=2 delims=: " %%A in ('ipconfig ^| find "IPv4 Address"') do (
    set "IP=%%A"
)

echo Your local IP address is: %IP%
echo.
echo To access from other devices on your network:
echo.
echo 1. On the backend machine:
echo    - Backend is now listening on all network interfaces
echo    - Other devices can access it at: http://%IP%:5000
echo.
echo 2. On other devices (tablets, phones, laptops):
echo    - Create a .env.local file in the frontend folder with:
echo.
echo    REACT_APP_API_URL=http://%IP%:5000/api
echo    REACT_APP_SOCKET_URL=http://%IP%:5000
echo.
echo 3. Then restart the frontend dev server:
echo    - npm start
echo.
echo ======================================
echo.
pause
