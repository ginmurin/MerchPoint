import React, { useState, useEffect } from 'react';
import Notification from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';
import { getUserById } from '../../services/userService';
import { api } from '../../services/api';

const UserProfile = () => {
  const { notification, showNotification, hideNotification } = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phoneNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.userId) {
        const freshUserData = await getUserById(userData.userId);
        setUser(freshUserData);
        setFormData({ 
          email: freshUserData.email || '',
          username: freshUserData.username || '',
          phoneNumber: freshUserData.phoneNumber || ''
        });
        if (freshUserData.profileImage) {
          setImagePreview(`http://localhost:8080/api/upload/profile-image/file/${freshUserData.profileImage}`);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showNotification('Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('Image size must be less than 5MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailChange = (e) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
  };

  const handleUsernameChange = (e) => {
    setFormData(prev => ({ ...prev, username: e.target.value }));
  };

  const handlePhoneNumberChange = (e) => {
    setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`user/${user.userId}`, {
        ...user,
        username: formData.username
      });
      
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, username: formData.username }));
      
      // Trigger header refresh
      window.dispatchEvent(new Event('userUpdated'));
      
      showNotification('Username updated successfully!', 'success');
      fetchUserData();
    } catch (error) {
      console.error('Error updating username:', error);
      showNotification(error.message || 'Failed to update username', 'error');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`user/${user.userId}`, {
        ...user,
        email: formData.email
      });
      
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, email: formData.email }));
      
      // Trigger header refresh
      window.dispatchEvent(new Event('userUpdated'));
      
      showNotification('Email updated successfully!', 'success');
      fetchUserData();
    } catch (error) {
      console.error('Error updating email:', error);
      showNotification(error.message || 'Failed to update email', 'error');
    }
  };

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`user/${user.userId}`, {
        ...user,
        phoneNumber: formData.phoneNumber
      });
      
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, phoneNumber: formData.phoneNumber }));
      
      // Trigger header refresh
      window.dispatchEvent(new Event('userUpdated'));
      
      showNotification('Phone number updated successfully!', 'success');
      fetchUserData();
    } catch (error) {
      console.error('Error updating phone number:', error);
      showNotification(error.message || 'Failed to update phone number', 'error');
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      showNotification('Please select an image first', 'info');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', profileImage);

      const response = await fetch(`http://localhost:8080/api/upload/profile-image/${user.userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      showNotification('Profile picture updated successfully!', 'success');
      
      // Update user data and localStorage
      const updatedUser = { ...user, profileImage: data.filename };
      setUser(updatedUser);
      setImagePreview(`http://localhost:8080${data.url}`);
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, profileImage: data.filename }));
      
      // Trigger header refresh
      window.dispatchEvent(new Event('userUpdated'));
      
      setProfileImage(null);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      showNotification(error.message || 'Failed to update profile picture', 'error');
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification('Please fill in all password fields', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification('New password must be at least 6 characters', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match!', 'error');
      return;
    }

    // Verify current password
    if (passwordData.currentPassword !== user.password) {
      showNotification('Current password is incorrect', 'error');
      return;
    }

    try {
      await api.put(`user/${user.userId}`, {
        ...user,
        password: passwordData.newPassword
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showNotification('Password changed successfully!', 'success');
      fetchUserData();
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification(error.message || 'Failed to change password', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>User not found</div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="container">
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={hideNotification} 
        />
      )}
      
      <h1 className="profile-title">Profile Settings</h1>

      {/* Profile Picture Card */}
      <div className="profile-card">
        <h3 className="profile-subtitle">Profile Picture</h3>
        <div className="profile-avatar-section">
          <div className="profile-avatar" style={{ 
            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {!imagePreview && getInitials(user.fullName)}
          </div>
          <div className="profile-avatar-info">
            <h2 className="profile-avatar-name">{user.fullName}</h2>
            <p className="profile-avatar-email">{user.email}</p>
          </div>
        </div>
        <form onSubmit={handleImageSubmit}>
          <div className="login-form-group">
            <label className="login-label">Choose Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input"
              style={{ padding: '8px' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>Max size: 5MB. Supported formats: JPG, PNG, GIF</small>
          </div>
          {profileImage && (
            <div className="profile-button-group">
              <button type="submit" className="button button-primary">
                Upload Picture
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Personal Information Card */}
      <div className="profile-card">
        <h3 className="profile-subtitle">Personal Information</h3>
        <div className="profile-grid">
          <div className="login-form-group">
            <label className="login-label">Full Name</label>
            <input
              className="input"
              value={user.fullName || ''}
              readOnly
              style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>Cannot be changed</small>
          </div>
          <div className="login-form-group">
            <label className="login-label">ID Number</label>
            <input
              className="input"
              value={user.studentStaffId || ''}
              readOnly
              style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>Cannot be changed</small>
          </div>
        </div>
      </div>

      {/* Username Card */}
      <div className="profile-card">
        <h3 className="profile-subtitle">Username</h3>
        <form onSubmit={handleUsernameSubmit}>
          <div className="login-form-group">
            <label className="login-label">Username</label>
            <input
              type="text"
              className="input"
              value={formData.username}
              onChange={handleUsernameChange}
              required
              minLength="3"
            />
          </div>
          <div className="profile-button-group">
            <button type="submit" className="button button-primary">
              Update Username
            </button>
          </div>
        </form>
      </div>

      {/* Email Card */}
      <div className="profile-card">
        <h3 className="profile-subtitle">Email Address</h3>
        <form onSubmit={handleEmailSubmit}>
          <div className="login-form-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="profile-button-group">
            <button type="submit" className="button button-primary">
              Update Email
            </button>
          </div>
        </form>
      </div>

      {/* Phone Number Card */}
      <div className="profile-card">
        <h3 className="profile-subtitle">Phone Number</h3>
        <form onSubmit={handlePhoneNumberSubmit}>
          <div className="login-form-group">
            <label className="login-label">Phone Number</label>
            <input
              type="tel"
              className="input"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="profile-button-group">
            <button type="submit" className="button button-primary">
              Update Phone Number
            </button>
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
                required
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
                  placeholder="Enter new password (min. 6 characters)"
                  required
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
                  required
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
    </div>
  );
};

export default UserProfile;