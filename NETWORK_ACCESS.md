# Network Access Guide

## Your Server IP Address

The backend is now running and accessible from your network at:

**`http://10.64.105.72:5000`**

(This is your computer's local network IP)

## How to Access from Other Devices

### Step 1: Configure Frontend Environment

Create a `.env.local` file in the `frontend` folder with:

```
REACT_APP_API_URL=http://10.64.105.72:5000/api
REACT_APP_SOCKET_URL=http://10.64.105.72:5000
```

### Step 2: Restart Frontend Server

```bash
cd frontend
npm start
```

The frontend will recompile and use the new environment variables.

### Step 3: Access from Other Devices

On any other device on your network (same WiFi or LAN), open a browser and go to:

```
http://10.64.105.72:3000
```

## What You'll See

✅ All devices will connect to the same backend
✅ Team updates will sync in real-time across all devices
✅ No manual refresh needed - changes appear instantly
✅ Everyone sees the same leaderboard

## Troubleshooting

### Can't connect?
- Verify both devices are on the same network (WiFi)
- Check Windows Firewall - allow Node.js on port 5000
- Try pinging: `ping 10.64.105.72` from another device
- Check the backend console for connection logs

### Firewall Setup (Windows)
- Windows Security → Firewall & network protection
- Allow Node.js through firewall (or allow ports 3000 & 5000)

### Different Network?
If your IP changes, update `.env.local` and restart the frontend.

## For Production
For a permanent setup:
1. Use a fixed IP address
2. Use a DNS name instead of IP
3. Deploy to cloud (Heroku, AWS, etc.)
4. Use environment configuration management

---

**Enjoy real-time points tracking across your network! 🎉**
