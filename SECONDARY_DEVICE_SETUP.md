# Setup Other Devices on Network

## Your Backend IP: 10.64.105.72

### For the Secondary Device:

#### Step 1: Frontend Folder Configuration
On the secondary device, create a `.env.local` file in the `frontend` folder:

```
REACT_APP_API_URL=http://10.64.105.72:5000/api
REACT_APP_SOCKET_URL=http://10.64.105.72:5000
```

**Important**: Replace `frontend/package.json` proxy setting (if exists) or remove it.

#### Step 2: Start Frontend on Secondary Device
```bash
cd frontend
npm install  # (if not already done)
npm start
```

#### Step 3: Access the App
Open browser and go to: `http://10.64.105.72:3000`
(Or use `http://localhost:3000` if running on same machine)

## Troubleshooting "Network Error"

### 1. Check Backend is Running
On the main machine where backend runs, verify:
- Open `http://10.64.105.72:5000/api/health`
- Should show: `{"status":"Backend is running"}`

### 2. Verify Environment Variables
On secondary device, in `frontend/.env.local` make sure:
```
REACT_APP_API_URL=http://10.64.105.72:5000/api
REACT_APP_SOCKET_URL=http://10.64.105.72:5000
```

### 3. Clear Cache and Restart
```bash
# Stop npm start (Ctrl+C)
# Delete node_modules and .cache (if they exist)
rm -r node_modules
npm install
npm start
```

### 4. Check Network Connection
Ping the backend from secondary device:
```bash
ping 10.64.105.72
```

If this fails, devices are not on same network.

### 5. Browser Console Errors
On secondary device:
- Press F12 (open browser console)
- Look for any error messages
- Check Network tab → look for failed API requests
- Check WebSocket (WS) connections

### 6. Firewall Issue
If you see connection refused:
- Windows: Open Windows Defender Firewall
- Allow Node.js through firewall (port 5000)
- Or temporarily disable firewall (for testing only)

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Network Error" | Wrong API URL | Check `.env.local` file |
| Connection refused | Backend not running | Start backend: `npm start` |
| Socket connection timeout | Firewall blocking | Allow port 5000 in firewall |
| 404 Not Found | Wrong port | Verify port 5000 |
| CORS error | Disabled on backend | Backend CORS is now enabled |

## Verify Setup

Here's a quick test:
1. On secondary device, open browser DevTools (F12)
2. Go to Console tab
3. Run: `fetch('http://10.64.105.72:5000/api/health').then(r => r.json()).then(d => console.log(d))`
4. Should see: `{status: 'Backend is running'}`

If you see an error, the backend URL is wrong or network is disconnected.

## For Each Additional Device

Repeat the same process:
1. Create `.env.local` with correct IP
2. `npm install` (if first time)
3. `npm start`
4. Access via `http://10.64.105.72:3000`

All devices will sync in real-time! 🎉
