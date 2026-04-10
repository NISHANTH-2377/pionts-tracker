const db = require('../db');

// Get all teams with sorting
exports.getAllTeams = (req, res) => {
  try {
    const teams = db.getAllTeams().sort((a, b) => (b.currentPoints || 0) - (a.currentPoints || 0));
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single team
exports.getTeam = (req, res) => {
  try {
    const team = db.getTeamById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create team
exports.createTeam = (req, res) => {
  const { name, description, color, members } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Team name is required' });
  }

  // Check for duplicate team name
  const teams = db.getAllTeams();
  if (teams.some(t => t.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ message: 'Team with this name already exists' });
  }

  try {
    const newTeam = db.createTeam({
      name: name.trim(),
      description: description || '',
      color: color || '#3498db',
      members: members || [],
    });
    
    // Emit real-time event to all connected clients
    const io = req.app.get('io');
    io.emit('team:created', newTeam);
    
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update team
exports.updateTeam = (req, res) => {
  try {
    const team = db.getTeamById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.color) updateData.color = req.body.color;
    if (req.body.members) updateData.members = req.body.members;

    const updatedTeam = db.updateTeam(req.params.id, updateData);
    
    // Emit real-time event to all connected clients
    const io = req.app.get('io');
    io.emit('team:updated', updatedTeam);
    
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete team
exports.deleteTeam = (req, res) => {
  try {
    const team = db.getTeamById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    db.deleteTeam(req.params.id);
    
    // Emit real-time event to all connected clients
    const io = req.app.get('io');
    io.emit('team:deleted', { id: req.params.id });
    
    res.json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add points to team
exports.addPoints = (req, res) => {
  const { points, pointsAdded, reason, addedBy } = req.body;
  const pointValue = points || pointsAdded;

  if (!pointValue || pointValue === 0) {
    return res.status(400).json({ message: 'Points value is required and must not be zero' });
  }

  try {
    const team = db.getTeamById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Create points log
    const log = db.createPointsLog({
      teamId: req.params.id,
      teamName: team.name,
      points: pointValue,
      reason: reason || 'No reason provided',
      addedBy: addedBy || 'Unknown',
    });

    // Get updated team
    const updatedTeam = db.getTeamById(req.params.id);
    
    // Emit real-time events to all connected clients
    const io = req.app.get('io');
    io.emit('team:updated', updatedTeam);
    io.emit('points:added', { teamId: req.params.id, log, updatedTeam });
    
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get points history
exports.getPointsHistory = (req, res) => {
  try {
    const team = db.getTeamById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const history = db.getPointsLogByTeamId(req.params.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = (req, res) => {
  try {
    const leaderboard = db.getAllTeams()
      .map(t => ({
        id: t.id || t._id,
        name: t.name,
        currentPoints: t.currentPoints || 0,
        color: t.color
      }))
      .sort((a, b) => b.currentPoints - a.currentPoints);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
