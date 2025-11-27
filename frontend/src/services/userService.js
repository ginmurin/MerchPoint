import { api } from './api';

// ============================================
// USER CRUD OPERATIONS
// ============================================

/**
 * Get all users
 * @returns {Promise<Array>} - List of all users
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('user');
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a single user by ID
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} - User object
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`user/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data { username, email, password, role, rewardPoints }
 * @returns {Promise<Object>} - Created user object
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('user', userData);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {number} userId - The user ID to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user object
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`user/${userId}`, userData);
    return response;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {number} userId - The user ID to delete
 * @returns {Promise<Object>} - Success response
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`user/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
