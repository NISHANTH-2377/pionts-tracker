import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Leaderboard from '../components/Leaderboard';
import TeamForm from '../components/TeamForm';
import TeamDetails from '../components/TeamDetails';
import PointsForm from '../components/PointsForm';
import '../components/styles.css';

function Home() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamHistory, setTeamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = 'http://localhost:5000/api';

  // Fetch all teams
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE}/teams`);
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  // Fetch team details and history
  const handleSelectTeam = async (teamId) => {
    try {
      const [teamRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE}/teams/${teamId}`),
        axios.get(`${API_BASE}/teams/${teamId}/history`),
      ]);
      setSelectedTeam(teamRes.data);
      setTeamHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  // Create new team
  const handleCreateTeam = async (teamData) => {
    setFormLoading(true);
    try {
      await axios.post(`${API_BASE}/teams`, teamData);
      setSuccessMessage('Team created successfully!');
      fetchTeams();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating team:', error);
      setSuccessMessage(`Error creating team: ${error.response?.data?.message || error.message}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  // Add points to team
  const handleAddPoints = async (pointsData) => {
    if (!selectedTeam) return;
    setFormLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/teams/${selectedTeam._id}/points`,
        pointsData
      );
      setSelectedTeam(response.data);
      setSuccessMessage('Points added successfully!');
      fetchTeams();
      handleSelectTeam(selectedTeam._id);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding points:', error);
      setSuccessMessage('Error adding points');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }
    setFormLoading(true);
    try {
      await axios.delete(`${API_BASE}/teams/${teamId}`);
      setSuccessMessage('Team deleted successfully!');
      setSelectedTeam(null);
      setTeamHistory([]);
      fetchTeams();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting team:', error);
      setSuccessMessage('Error deleting team');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Points Tracker</h1>
        <p>Track and manage team points in real-time</p>
      </div>

      <div className="main-content">
        <div>
          <TeamForm onSubmit={handleCreateTeam} isLoading={formLoading} />
          {selectedTeam && (
            <PointsForm
              teamId={selectedTeam._id}
              onSubmit={handleAddPoints}
              isLoading={formLoading}
            />
          )}
        </div>

        <div>
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <Leaderboard 
            teams={teams.filter(team => 
              team.name.toLowerCase().includes(searchQuery.toLowerCase())
            )} 
            onSelectTeam={handleSelectTeam} 
          />
        </div>

        <div className="main-content">
          <TeamDetails team={selectedTeam} history={teamHistory} onDeleteTeam={handleDeleteTeam} isLoading={formLoading} />
        </div>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default Home;
