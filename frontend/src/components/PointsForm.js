import React, { useState } from 'react';
import './styles.css';

const PointsForm = ({ teamId, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    pointsAdded: '',
    reason: '',
    addedBy: '',
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
    const points = parseInt(formData.pointsAdded);
    if (isNaN(points) || points === 0) {
      return;
    }
    onSubmit({
      ...formData,
      pointsAdded: points,
    });
    setFormData({
      pointsAdded: '',
      reason: '',
      addedBy: '',
    });
  };

  return (
    <form className="points-form" onSubmit={handleSubmit}>
      <h3>Add Points</h3>
      <div className="form-group">
        <label>Points *</label>
        <input
          type="number"
          name="pointsAdded"
          value={formData.pointsAdded}
          onChange={handleChange}
          required
          placeholder="0"
        />
      </div>

      <div className="form-group">
        <label>Reason *</label>
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          placeholder="e.g., Won match, completed task"
        />
      </div>

      <div className="form-group">
        <label>Added By</label>
        <input
          type="text"
          name="addedBy"
          value={formData.addedBy}
          onChange={handleChange}
          placeholder="Your name (optional)"
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Points'}
      </button>
    </form>
  );
};

export default PointsForm;
