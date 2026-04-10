import React from 'react';
import './styles.css';

const Leaderboard = ({ teams, onSelectTeam }) => {
  const sortedTeams = [...teams].sort((a, b) => b.currentPoints - a.currentPoints);
  
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
            <span className="points">{team.currentPoints} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
