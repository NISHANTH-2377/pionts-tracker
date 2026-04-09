import React from 'react';
import './styles.css';

const TeamDetails = ({ team, history, onDeleteTeam, isLoading }) => {
  if (!team) {
    return <div className="team-details">Select a team to view details</div>;
  }

  return (
    <div className="team-details">
      <div className="team-header" style={{ borderColor: team.color }}>
        <div className="team-header-top">
          <h2>{team.name}</h2>
          <button
            className="delete-btn"
            onClick={() => onDeleteTeam(team._id)}
            disabled={isLoading}
            title="Delete this team"
          >
            🗑️ Delete
          </button>
        </div>
        <div className="team-info">
          <div className="info-item">
            <span className="label">Current Points:</span>
            <span className="value" style={{ color: team.color }}>
              {team.currentPoints}
            </span>
          </div>
          {team.description && (
            <div className="info-item">
              <span className="label">Description:</span>
              <span className="value">{team.description}</span>
            </div>
          )}
          {team.members && team.members.length > 0 && (
            <div className="info-item">
              <span className="label">Members:</span>
              <span className="value">{team.members.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {history && history.length > 0 && (
        <div className="history-section">
          <h3>Points History</h3>
          <div className="history-list">
            {history.map((log) => (
              <div key={log._id} className="history-item">
                <div className="history-meta">
                  <span className="reason">{log.reason}</span>
                  <span className="date">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="history-points">
                  <span className={log.pointsAdded > 0 ? 'positive' : 'negative'}>
                    {log.pointsAdded > 0 ? '+' : ''}{log.pointsAdded}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
