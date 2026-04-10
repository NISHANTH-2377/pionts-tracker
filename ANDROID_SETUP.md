# Android Device Setup Guide

## Quick Start for Android Devices

### Your Backend IP: 10.64.105.72

### Setup Steps:

#### Step 1: Ensure Android is on Same Network
- Connect your Android device to the **same WiFi** as your computer
- (Do NOT use mobile data or a different network)

#### Step 2: On Your Computer
Create a `.env.local` file in the `frontend` folder:

```
REACT_APP_API_URL=http://10.64.105.72:5000/api
REACT_APP_SOCKET_URL=http://10.64.105.72:5000
PORT=3000
```

#### Step 3: Start Frontend Server
```bash
cd frontend
npm start
```

You should see:
```
Compiled successfully!

You can now view points-tracker-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.64.105.72:3000
```

#### Step 4: On Android Device
1. Open Chrome, Firefox, or any browser
2. Click address bar
3. Type: **`http://10.64.105.72:3000`**
4. Press Enter

That's it! 🎉

---

## Troubleshooting on Android

### "Cannot connect to page"
**Solution:**
1. Make sure Android is on **same WiFi** as computer
2. Check if frontend shows "On Your Network: http://10.64.105.72:3000" when you start it
3. Try refreshing the page (pull down)

### "Network Error" when creating team
1. Check the `.env.local` file has correct IPs
2. Restart the frontend: `npm start`
3. Refresh Android browser (Ctrl+R or pull down to refresh)

### Can't see the updates
1. Make sure WebSocket is connecting (check browser console)
2. On Android: Open Developer Tools (long press → Inspect)
3. Look for WebSocket connection in Console

### Can't reach the page at all
1. **Ping test**: From Android browser, try: `http://10.64.105.72:5000/api/health`
   - If this works, the backend is reachable
   - If not, devices are not on same network

2. **Check Network**: 
   - Go to WiFi settings on Android
   - Verify network name matches your computer's WiFi

---

## For Multiple Android Devices

All Android devices on the same network can access the same app at:
```
http://10.64.105.72:3000
```

Updates are **instant** across all devices! When anyone adds points on any Android device, **all other Android devices see it immediately**. 🔄

---

## Performance Tips for Android

- Use Google Chrome (fastest)
- Close unnecessary apps to free up memory
- Keep Android device on same WiFi (don't switch networks)
- If app is slow, close browser and reopen

---

## If Using Localhost on Computer

If you want to also access from the **same computer**, you can use:
```
http://localhost:3000
```

But Android devices must use:
```
http://10.64.105.72:3000
```

---

## Advanced: Make It Work Offline

To keep the app working without internet:
1. Both devices on same WiFi ✅
2. No need for internet connection
3. Works even if WiFi has no internet connection

---

**You now have a real-time Points Tracker running on multiple Android devices! 📱📱📱**
