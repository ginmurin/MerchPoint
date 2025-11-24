import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import Spinner from '../components/common/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email) newErrors.email = 'Email or Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleLogin = async (e) => {
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
      const user = await login(formData.email, formData.password);
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">MerchPoint</div>
        <p className="login-subtitle">School Merchandise Reservation System</p>
        
        {apiError && <div className="login-api-error">{apiError}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Username or Email
            </label>
            <input
              id="email"
              name="email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your username or email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="login-form-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <button type="submit" className="button button-primary login-button">
              Login
            </button>
          )}
        </form>
        <div className="login-footer-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;