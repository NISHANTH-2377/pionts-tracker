# Real-Time Leaderboard Sync Setup

## Overview
The Points Tracker application now supports **real-time synchronization** across all devices on your network. When any device makes changes (creates a team, adds points, deletes a team), all connected devices instantly see the updates without needing to refresh.

## How It Works

### Backend (Node.js + Express + Socket.io)
- **Server**: Runs on `http://localhost:5000`
- **WebSocket**: Automatically broadcasts events to all connected clients
- **Events emitted**:
  - `team:created` - When a new team is created
  - `team:updated` - When a team is modified or points are added
  - `team:deleted` - When a team is deleted
  - `points:added` - When points are added to a team

### Frontend (React + Socket.io Client)
- Automatically connects to the WebSocket server on startup
- Listens for real-time events and updates the UI instantly
- Maintains automatic reconnection with exponential backoff

## Starting the Application

### 1. Start Backend Server
```bash
cd backend
npm start
```
The server will start on `http://localhost:5000`

### 2. Start Frontend Application
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

## Using Multiple Devices on Your Network

### Prerequisites
- All devices must be on the same network (WiFi or LAN)
- Firewall should allow port 5000 (can be configured)

### Steps to Access from Multiple Devices

1. **Find your computer's IP address** (run on the machine with the backend):
   - Windows: Open PowerShell and run `ipconfig` (look for IPv4 Address)
   - Mac/Linux: Open Terminal and run `ifconfig` (look for inet address)

2. **Modify frontend connection** (temporary for testing):
   - Edit `frontend/src/pages/Home.js`
   - Find the line: `const newSocket = io('http://localhost:5000',...)`
   - Change it to: `const newSocket = io('http://YOUR_IP_ADDRESS:5000',...)`
   - Also update `API_BASE = 'http://YOUR_IP_ADDRESS:5000/api'`
   
   Example: `const newSocket = io('http://192.168.1.100:5000',...)`

3. **Access from other devices**:
   - Open a browser on another device on the same network
   - Navigate to: `http://YOUR_IP_ADDRESS:3000`
   - The frontend will show the same leaderboard and any changes will sync in real-time

## Real-Time Features

✅ **Instant Updates**: 
- Create a team on Device A → Appears immediately on Device B and C
- Add points on Device B → Score updates immediately on all devices
- Delete team on Device C → Removed instantly from all devices

✅ **Automatic Reconnection**: 
- If a device loses connection, it automatically reconnects
- No manual refresh needed

✅ **Point History Sync**: 
- When points are added, the full history updates across all devices

## Architecture Diagram

```
Device A (Browser)  ─┐
                      │
Device B (Browser)  ──┼── WebSocket Connection ──── Backend Server
                      │   (Socket.io)               (Node.js + Express)
Device C (Browser)  ─┘                              │
                                                    └── JSON Data Files
```

## Testing Real-Time Sync

1. Open the app on 2+ devices simultaneously
2. Create a new team on Device A
3. You should see it appear on Device B instantly (no refresh needed)
4. Add points on Device B
5. Device A's leaderboard updates immediately
6. Delete the team on Device C
7. Watch it disappear from all devices in real-time

## Troubleshooting

### Connection Issues
- **Check if backend is running**: Open `http://YOUR_IP_ADDRESS:5000/api/health` in browser
- **Firewall blocking**: Ensure port 5000 is open in your firewall
- **Different network**: All devices must be on the same network/WiFi

### Real-Time Not Working
- Check browser console (F12 → Console) for connection errors
- Verify the IP address is correct
- Make sure you updated both `newSocket` and `API_BASE` URLs
- Clear browser cache and refresh

### Performance
- For 50+ concurrent devices, consider using a database (MongoDB) instead of JSON files
- Current setup uses JSON files which works well for small network usage

## Configuration

To make the app work seamlessly across devices, you can create environment variables:

### Backend (.env file)
```
PORT=5000
SOCKET_CORS_ORIGIN=*
```

### Frontend (.env file)
```
REACT_APP_API_URL=http://YOUR_IP_ADDRESS:5000/api
REACT_APP_SOCKET_URL=http://YOUR_IP_ADDRESS:5000
```

Then update Home.js to use these variables.

## Production Deployment

For production use:
1. Use a cloud service (Heroku, AWS, DigitalOcean, etc.)
2. Use a proper database (MongoDB, PostgreSQL)
3. Implement authentication/authorization
4. Add HTTPS/TLS encryption
5. Use environment variables for configuration
6. Consider Redis for horizontal scaling

## Socket.io Events Reference

### Emitted from Backend
```javascript
io.emit('team:created', newTeam)
io.emit('team:updated', updatedTeam)
io.emit('team:deleted', { id: teamId })
io.emit('points:added', { teamId, log, updatedTeam })
```

### Listened by Frontend
```javascript
socket.on('team:created', (newTeam) => { ... })
socket.on('team:updated', (updatedTeam) => { ... })
socket.on('team:deleted', (data) => { ... })
socket.on('points:added', (data) => { ... })
```

---

**Enjoy your real-time Points Tracker! 🚀**
