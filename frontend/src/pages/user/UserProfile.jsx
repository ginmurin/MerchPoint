import React, { useState } from 'react';
import Notification from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';

// Mock data for the currently logged-in user
// In a real app, you'd fetch this from your context or an API
const mockUser = {
  fullName: 'John Doe',
  username: 'johndoe',
  email: 'user@merch.com',
  studentId: '2021-00123',
  contactNumber: '09171234567',
  department: 'College of Computer Studies',
  initials: 'JD',
};

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUser);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setFormData(mockUser); // Reset changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send `formData` to your API to update
    console.log('Profile updated:', formData);
    setIsEditing(false);
    // You might want to update the mockUser or refetch data here
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Add validation for passwords here
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("New passwords do not match!", 'warning');
      return;
    }
    // API call to change password
    console.log('Password change requested:', passwordData);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showNotification('Password changed successfully!', 'success');
  };

  return (
    <div className="container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">{formData.initials}</div>
          <div className="profile-avatar-info">
            <h2 className="profile-avatar-name">{formData.fullName}</h2>
            <p className="profile-avatar-email">{formData.email}</p>
          </div>
          {/* <button className="button button-secondary">Change Photo</button> */}
        </div>

        <hr className="profile-divider" />

        <form onSubmit={handleSubmit}>
          <h3 className="profile-subtitle">Personal Details</h3>
          <div className="profile-grid">
            <div className="login-form-group">
              <label className="login-label">Full Name</label>
              <input
                name="fullName"
                className="input"
                value={formData.fullName}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">Student/Staff ID</label>
              <input
                name="studentId"
                className="input"
                value={formData.studentId}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">Contact Number</label>
              <input
                name="contactNumber"
                className="input"
                value={formData.contactNumber}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">Department</label>
              <input
                name="department"
                className="input"
                value={formData.department}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          
          <h3 className="profile-subtitle">Account Details</h3>
          <div className="profile-grid">
            <div className="login-form-group">
              <label className="login-label">Username</label>
              <input
                name="username"
                className="input"
                value={formData.username}
                readOnly // Usually username is not editable
                style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }}
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">Email Address</label>
              <input
                name="email"
                type="email"
                className="input"
                value={formData.email}
                readOnly // Email is usually not editable
                style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="profile-button-group">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="button button-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEditToggle}
                className="button button-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Change Password Card */}
      <div className="profile-card">
         <h3 className="profile-subtitle">Change Password</h3>
         <form onSubmit={handlePasswordSubmit}>
           <div className="login-form-group">
              <label className="login-label">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                className="input"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
              />
            </div>
            <div className="profile-grid">
              <div className="login-form-group">
                <label className="login-label">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  className="input"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min. 8 characters)"
                />
              </div>
              <div className="login-form-group">
                <label className="login-label">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="input"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="profile-button-group">
              <button type="submit" className="button button-primary">
                Update Password
              </button>
            </div>
         </form>
      </div>

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={hideNotification} 
        />
      )}
    </div>
  );
};

export default UserProfile;