const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '../data');
const TEAMS_FILE = path.join(DB_DIR, 'teams.json');
const POINTS_LOG_FILE = path.join(DB_DIR, 'pointsLog.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(TEAMS_FILE)) {
    fs.writeFileSync(TEAMS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(POINTS_LOG_FILE)) {
    fs.writeFileSync(POINTS_LOG_FILE, JSON.stringify([], null, 2));
  }
};

initializeFiles();

// Helper functions to read/write data
const readTeams = () => {
  try {
    const data = fs.readFileSync(TEAMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading teams:', err);
    return [];
  }
};

const writeTeams = (teams) => {
  try {
    fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2));
  } catch (err) {
    console.error('Error writing teams:', err);
  }
};

const readPointsLog = () => {
  try {
    const data = fs.readFileSync(POINTS_LOG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading points log:', err);
    return [];
  }
};

const writePointsLog = (logs) => {
  try {
    fs.writeFileSync(POINTS_LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Error writing points log:', err);
  }
};

// Teams database operations
const db = {
  // Team operations
  getAllTeams: () => {
    const teams = readTeams();
    return teams.map(team => ({
      ...team,
      id: team._id
    }));
  },

  getTeamById: (id) => {
    const teams = readTeams();
    const team = teams.find(t => t._id === id);
    return team ? { ...team, id: team._id } : null;
  },

  createTeam: (teamData) => {
    const teams = readTeams();
    const newTeam = {
      _id: Date.now().toString(),
      ...teamData,
      currentPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    teams.push(newTeam);
    writeTeams(teams);
    return { ...newTeam, id: newTeam._id };
  },

  updateTeam: (id, updateData) => {
    const teams = readTeams();
    const index = teams.findIndex(t => t._id === id);
    if (index === -1) return null;
    
    teams[index] = {
      ...teams[index],
      ...updateData,
      updatedAt: new Date()
    };
    writeTeams(teams);
    return { ...teams[index], id: teams[index]._id };
  },

  deleteTeam: (id) => {
    const teams = readTeams();
    const index = teams.findIndex(t => t._id === id);
    if (index === -1) return false;
    
    teams.splice(index, 1);
    writeTeams(teams);
    
    // Also delete associated points logs
    const logs = readPointsLog();
    const filtered = logs.filter(log => log.teamId !== id);
    writePointsLog(filtered);
    
    return true;
  },

  // Points log operations
  getAllPointsLogs: () => {
    return readPointsLog();
  },

  getPointsLogByTeamId: (teamId) => {
    const logs = readPointsLog();
    return logs.filter(log => log.teamId === teamId);
  },

  createPointsLog: (logData) => {
    const logs = readPointsLog();
    const newLog = {
      _id: Date.now().toString(),
      ...logData,
      createdAt: new Date()
    };
    logs.push(newLog);
    writePointsLog(logs);

    // Update team's current points
    const teams = readTeams();
    const teamIndex = teams.findIndex(t => t._id === logData.teamId);
    if (teamIndex !== -1) {
      teams[teamIndex].currentPoints = (teams[teamIndex].currentPoints || 0) + logData.points;
      teams[teamIndex].updatedAt = new Date();
      writeTeams(teams);
    }

    return { ...newLog, id: newLog._id };
  }
};

module.exports = db;
