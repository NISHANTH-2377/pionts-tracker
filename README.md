# Points Tracker

A full-stack web application for tracking and managing team points in real-time.

## 🚀 Features

- ✅ Create and manage multiple teams
- ✅ Add/update points for teams with reasons
- ✅ Real-time leaderboard ranking
- ✅ Points history and analytics
- ✅ Team member management
- ✅ Responsive design
- ✅ Persistent data with MongoDB

## 📋 Project Structure

```
points-tracker/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── models/    # MongoDB schemas
│   │   ├── routes/    # Express routes
│   │   ├── controllers/ # Business logic
│   │   └── server.js  # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/     # Page components
│   │   └── App.js     # Main app component
│   ├── public/        # Static files
│   └── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI
npm run dev
```

The backend will run at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run at `http://localhost:3000`

## 📡 API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Points
- `POST /api/teams/:id/points` - Add points to team
- `GET /api/teams/:id/history` - Get points history
- `GET /api/teams/leaderboard` - Get leaderboard

## 🎯 Usage

1. Start MongoDB locally or provide cloud URI in `.env`
2. Start the backend: `npm run dev` (in backend folder)
3. Start the frontend: `npm start` (in frontend folder)
4. Open http://localhost:3000 in your browser
5. Create teams and start tracking points!

## 📊 Data Models

### Team
```javascript
{
  name: String,
  description: String,
  color: String,
  currentPoints: Number,
  members: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### PointsLog
```javascript
{
  teamId: ObjectId,
  teamName: String,
  pointsAdded: Number,
  reason: String,
  addedBy: String,
  createdAt: Date
}
```

## 🎨 UI Features

- 🏆 Real-time leaderboard with rankings
- 📝 Team creation and management forms
- 📊 Points history visualization
- 🎨 Color-coded teams
- 📱 Responsive design for all devices
- ✨ Smooth animations and transitions

## 🚀 Future Enhancements

- User authentication & authorization
- Multiple categories/events
- Export reports (CSV, PDF)
- Team logos/avatars
- Real-time notifications
- Advanced analytics dashboard
- WebSocket for live updates
- Mobile app

## 📝 License

MIT

## 💬 Support

For issues or suggestions, please create an issue in the repository.
