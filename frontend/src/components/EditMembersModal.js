import React, { useState, useEffect } from 'react';
import './styles.css';

const EditMembersModal = ({ team, onSave, onCancel, isLoading }) => {
  const [membersInput, setMembersInput] = useState('');

  useEffect(() => {
    if (team && team.members) {
      setMembersInput(team.members.join(', '));
    }
  }, [team]);

  const handleSave = () => {
    const members = membersInput
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m);
    onSave(members);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Team Members</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Members (comma-separated)</label>
            <textarea
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              placeholder="John, Jane, Bob"
              rows="6"
              className="members-textarea"
            />
            <small>Enter each member name separated by commas</small>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="modal-btn save"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Members'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMembersModal;
