import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('user');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    alert('Add User feature is not yet available');
  };

  const handleEditUser = (userId) => {
    alert(`Edit User ${userId} feature is not yet available`);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`user/${userId}`);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="admin-title">User List</h1>
        <button className="button button-primary" onClick={handleAddUser}>
          ➕ Add User
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <div className="admin-card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                    <td>
                      <span className={`status-badge ${user.role === 'admin' ? 'status-approved' : 'status-pending'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.pointsBalance || 0}</td>
                    <td>
                      <button
                        className="button button-secondary"
                        style={{ marginRight: '0.5rem', padding: '0.3rem 0.8rem' }}
                        onClick={() => handleEditUser(user.userId)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="button button-secondary"
                        style={{ padding: '0.3rem 0.8rem' }}
                        onClick={() => handleDeleteUser(user.userId)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
