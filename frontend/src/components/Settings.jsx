import React, { useState, useEffect } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api';

function Settings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      alert('Please enter a name');
      return;
    }

    try {
      await createUser(newUserName, newUserEmail);
      setNewUserName('');
      setNewUserEmail('');
      loadUsers();
    } catch (err) {
      alert('Failed to add user: ' + err.message);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await updateUser(user.id, { active: !user.active });
      loadUsers();
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="settings">
      <section className="settings-section">
        <h2>Manage Users</h2>
        
        <form className="add-user-form" onSubmit={handleAddUser}>
          <h3>Add New User</h3>
          <div className="form-group">
            <label htmlFor="user-name">Name *</label>
            <input
              id="user-name"
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="user-email">Email</label>
            <input
              id="user-email"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="Enter email (optional)"
            />
          </div>
          <button type="submit" className="btn-primary">Add User</button>
        </form>
      </section>

      <section className="settings-section">
        <h3>Current Users</h3>
        {error && <div className="error">{error}</div>}
        
        {users.length === 0 ? (
          <p className="no-data">No users yet. Add one above!</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={!user.active ? 'inactive' : ''}>
                  <td>{user.name}</td>
                  <td>{user.email || '—'}</td>
                  <td>
                    <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="btn-small"
                      onClick={() => handleToggleActive(user)}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="settings-section">
        <h3>About</h3>
        <p>
          This application tracks NYT Games scores for weekly competitions.
          Add users above and run the ETL process to fetch scores from NYT.
        </p>
        <p className="info-text">
          To fetch real scores, configure the backend with your NYT session cookie.
        </p>
      </section>
    </div>
  );
}

export default Settings;
