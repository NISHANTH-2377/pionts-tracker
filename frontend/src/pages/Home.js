import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
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

  // Backend URL - change this to your server's IP for network access
  // For localhost: http://localhost:5000
  // For network: http://YOUR_IP_ADDRESS:5000
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

  // Wrap fetchTeams in useCallback to have stable identity
  const fetchTeams = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/teams`);
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  }, [API_BASE]);

  // Fetch all teams on mount
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server via WebSocket');
    });

    // Listen for real-time team updates
    newSocket.on('team:created', (newTeam) => {
      console.log('New team created:', newTeam);
      setTeams((prevTeams) => [...prevTeams, newTeam]);
    });

    newSocket.on('team:updated', (updatedTeam) => {
      console.log('Team updated:', updatedTeam);
      setTeams((prevTeams) =>
        prevTeams.map((team) => (team._id === updatedTeam._id ? updatedTeam : team))
      );
      // Update selected team if it's the one being updated
      setSelectedTeam((prevSelected) => 
        prevSelected && prevSelected._id === updatedTeam._id ? updatedTeam : prevSelected
      );
    });

    newSocket.on('team:deleted', (data) => {
      console.log('Team deleted:', data);
      setTeams((prevTeams) => prevTeams.filter((team) => team._id !== data.id));
      // Clear selected team if it was deleted
      setSelectedTeam((prevSelected) => 
        prevSelected && prevSelected._id === data.id ? null : prevSelected
      );
      setTeamHistory([]);
    });

    newSocket.on('points:added', (data) => {
      console.log('Points added:', data);
      // Update selected team with new points
      setSelectedTeam((prevSelected) => 
        prevSelected && prevSelected._id === data.teamId ? data.updatedTeam : prevSelected
      );
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [SOCKET_URL]);

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

  const handleDeductAllTeams = async () => {
    if (!window.confirm('Reduce 1 point from all teams?')) return;
    if (teams.length === 0) return;

    setFormLoading(true);
    try {
      await Promise.all(
        teams.map((team) =>
          axios.post(`${API_BASE}/teams/${team._id}/points`, {
            points: -1,
            reason: 'Global deduction',
            addedBy: 'All teams adjustment',
          })
        )
      );

      setSuccessMessage('All teams lost 1 point.');
      fetchTeams();
      if (selectedTeam) {
        handleSelectTeam(selectedTeam._id);
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deducting points for all teams:', error);
      setSuccessMessage('Error deducting points for all teams');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddAllTeams = async () => {
    if (!window.confirm('Add 1 point to all teams?')) return;
    if (teams.length === 0) return;

    setFormLoading(true);
    try {
      await Promise.all(
        teams.map((team) =>
          axios.post(`${API_BASE}/teams/${team._id}/points`, {
            points: 1,
            reason: 'Global addition',
            addedBy: 'All teams adjustment',
          })
        )
      );

      setSuccessMessage('All teams gained 1 point.');
      fetchTeams();
      if (selectedTeam) {
        handleSelectTeam(selectedTeam._id);
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding points for all teams:', error);
      setSuccessMessage('Error adding points for all teams');
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

  // Edit team members
  const handleEditMembers = async (teamId, members) => {
    setFormLoading(true);
    try {
      const response = await axios.put(`${API_BASE}/teams/${teamId}`, {
        members,
      });
      setSuccessMessage('Team members updated successfully!');
      setSelectedTeam(response.data);
      fetchTeams();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating team members:', error);
      setSuccessMessage(
        `Error updating members: ${error.response?.data?.message || error.message}`
      );
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
        <div className="global-actions">
          <button
            className="all-teams-button add"
            onClick={handleAddAllTeams}
            disabled={formLoading || teams.length === 0}
          >
            Add 1 Point to All Teams
          </button>
          <button
            className="all-teams-button deduct"
            onClick={handleDeductAllTeams}
            disabled={formLoading || teams.length === 0}
          >
            Reduce 1 Point from All Teams
          </button>
        </div>
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
          <TeamDetails team={selectedTeam} history={teamHistory} onDeleteTeam={handleDeleteTeam} onEditMembers={handleEditMembers} isLoading={formLoading} />
        </div>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default Home;
