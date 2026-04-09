const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// GET routes
router.get('/', teamController.getAllTeams);
router.get('/leaderboard', teamController.getLeaderboard);
router.get('/:id', teamController.getTeam);
router.get('/:id/history', teamController.getPointsHistory);

// POST routes
router.post('/', teamController.createTeam);
router.post('/:id/points', teamController.addPoints);

// PUT routes
router.put('/:id', teamController.updateTeam);

// DELETE routes
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
