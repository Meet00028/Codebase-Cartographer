// React component for displaying user information
import React, { useState, useEffect } from 'react';
import { fetchData, formatDate } from './utils.js';
import { THEME_COLORS } from './config.js';

const UserComponent = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchData(`/users/${userId}`);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-spinner" style={{ color: THEME_COLORS.primary }}>
        Loading user data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" style={{ color: THEME_COLORS.error }}>
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div className="user-profile">
      <div className="user-header">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <h2>{user.name}</h2>
        <p className="user-email">{user.email}</p>
      </div>
      
      <div className="user-details">
        <div className="detail-item">
          <label>Joined:</label>
          <span>{formatDate(user.createdAt)}</span>
        </div>
        <div className="detail-item">
          <label>Role:</label>
          <span className="role-badge" style={{ backgroundColor: THEME_COLORS.secondary }}>
            {user.role}
          </span>
        </div>
        <div className="detail-item">
          <label>Status:</label>
          <span 
            className="status-indicator"
            style={{ 
              color: user.isActive ? THEME_COLORS.success : THEME_COLORS.warning 
            }}
          >
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
