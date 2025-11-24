import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import Spinner from '../components/common/Spinner';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    studentId: '',
    contactNumber: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.studentId) newErrors.studentId = 'Student/Staff ID is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact Number is required';
    if (!formData.department) newErrors.department = 'Department is required';

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard'); // Redirect to dashboard after successful registration
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box register-box">
        <div className="login-logo" style={{ fontSize: '28px' }}>
          Create Your Account
        </div>
        
        {apiError && <div className="login-api-error">{apiError}</div>}

        <form onSubmit={handleRegister}>
          <div className="register-grid">
            <div className="login-form-group">
              <label className="login-label">Username</label>
              <input
                name="username"
                className={`input ${errors.username ? 'input-error' : ''}`}
                placeholder="Choose username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input
                name="email"
                type="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              name="password"
              type="password"
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Create password (min. 8 characters)"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="login-form-group">
            <label className="login-label">Full Name</label>
            <input
              name="fullName"
              className={`input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="register-grid">
            <div className="login-form-group">
              <label className="login-label">Student/Staff ID</label>
              <input
                name="studentId"
                className={`input ${errors.studentId ? 'input-error' : ''}`}
                placeholder="Enter ID"
                value={formData.studentId}
                onChange={handleChange}
              />
              {errors.studentId && <span className="error-text">{errors.studentId}</span>}
            </div>
            <div className="login-form-group">
              <label className="login-label">Contact Number</label>
              <input
                name="contactNumber"
                type="tel"
                className={`input ${errors.contactNumber ? 'input-error' : ''}`}
                placeholder="Enter number"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">Department</label>
            <input
              name="department"
              className={`input ${errors.department ? 'input-error' : ''}`}
              placeholder="Enter department"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="register-button-group">
              <button
                type="submit"
                className="button button-primary"
                style={{ flex: 1, padding: '16px' }}
              >
                Register
              </button>
              <Link
                to="/login"
                className="button button-secondary"
                style={{ flex: 1, padding: '16px' }}
              >
                Cancel
              </Link>
            </div>
          )}
        </form>

        <div className="login-footer-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;