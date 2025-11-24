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

// --- AUTH FUNCTIONS ---
export const login = async (email, password) => {
  console.log('Attempting login for:', email);
  // Mock response
  await new Promise(resolve => setTimeout(resolve, 500));

  let user = null;
  if (email === 'admin@merch.com' && password === 'admin123') {
    user = { name: 'Admin User', email: 'admin@merch.com', role: 'admin' };
  } else if (email === 'user@merch.com' && password === 'user123') {
    user = { name: 'John Doe', email: 'user@merch.com', role: 'user' };
  }

  if (user) {
    setUser(user); // <-- This is the key change
    return user;
  }
  
  throw new Error('Invalid credentials');
};

export const register = async (userData) => {
  console.log('Attempting registration for:', userData.email);
  // Mock response
  await new Promise(resolve => setTimeout(resolve, 500));
  if (userData.email === 'user@merch.com') {
    throw new Error('Email already exists');
  }
  
  const user = { name: userData.fullName, email: userData.email, role: 'user' };
  setUser(user); // <-- This is the key change
  return user;
};

export const logout = () => {
  localStorage.removeItem('user'); // <-- This is the key change
  console.log('User logged out');
};