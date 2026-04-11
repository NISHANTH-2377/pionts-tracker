import React from 'react';
import './styles.css';

const Leaderboard = ({ teams, onSelectTeam, onAddPoints, onSubtractPoints, isLoading }) => {
  const sortedTeams = [...teams].sort((a, b) => b.currentPoints - a.currentPoints);
  
  const handleAddPoints = (e, teamId) => {
    e.stopPropagation();
    onAddPoints(teamId);
  };

  const handleSubtractPoints = (e, teamId) => {
    e.stopPropagation();
    onSubtractPoints(teamId);
  };
  
  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>
      <div className="leaderboard-list">
        {sortedTeams.map((team, index) => (
          <div
            key={team._id}
            className="leaderboard-item"
            onClick={() => onSelectTeam(team._id)}
            style={{ borderLeftColor: team.color }}
          >
            <span className="rank">#{index + 1}</span>
            <span className="team-name">{team.name}</span>
            <div className="team-actions">
              <button
                className="point-btn minus"
                onClick={(e) => handleSubtractPoints(e, team._id)}
                disabled={isLoading || (team.currentPoints || 0) === 0}
                title={team.currentPoints === 0 ? "Cannot subtract: team at 0 points" : "Subtract 1 point"}
              >
                −
              </button>
              <button
                className="point-btn plus"
                onClick={(e) => handleAddPoints(e, team._id)}
                disabled={isLoading}
                title="Add 1 point"
              >
                +
              </button>
            </div>
            <span className="points">{team.currentPoints} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
