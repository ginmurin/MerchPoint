import { api } from './api';

// --- HELPER FUNCTIONS ---
// Gets the user from local storage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Saves the user to local storage
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('user'); // <-- This is the key change
  console.log('User logged out');
};

// Register user endpoint
export const register = async (userData) => {
  try {
    const response = await api.post('auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      phoneNumber: userData.contactNumber,
      address: userData.department,
      studentStaffId: userData.studentId
    });
    // POST http://localhost:8080/api/auth/register
    
    // Save user to localStorage after successful registration
    setUser(response);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login endpoint - supports both email and username
export const login = async (emailOrUsername, password) => {
  try {
    const response = await api.post('auth/login', { 
      email: emailOrUsername,
      password 
    });
    
    console.log('Login response from backend:', response);
    console.log('User role:', response.role);
    setUser(response);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};