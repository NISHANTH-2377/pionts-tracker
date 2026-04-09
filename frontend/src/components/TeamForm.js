import React, { useState } from 'react';
import './styles.css';

const TeamForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3498db',
    members: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const members = formData.members
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m);
    onSubmit({
      ...formData,
      members,
    });
    setFormData({
      name: '',
      description: '',
      color: '#3498db',
      members: '',
    });
  };

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <h3>Create New Team</h3>
      <div className="form-group">
        <label>Team Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter team name"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Team description (optional)"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Team Color</label>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Members (comma-separated)</label>
        <input
          type="text"
          name="members"
          value={formData.members}
          onChange={handleChange}
          placeholder="John, Jane, Bob"
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  );
};

export default TeamForm;
