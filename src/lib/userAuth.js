// User authentication utilities for portfolio visitors

const USER_TOKEN_KEY = 'portfolio_user_token';
const USER_DATA_KEY = 'portfolio_user_data';

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isUserAuthenticated = () => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  return !!token;
};

/**
 * Get stored user token
 * @returns {string|null}
 */
export const getUserToken = () => {
  return localStorage.getItem(USER_TOKEN_KEY);
};

/**
 * Get stored user data
 * @returns {object|null}
 */
export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Store user authentication data
 * @param {string} token - JWT token
 * @param {object} user - User data object
 */
export const setUserAuth = (token, user) => {
  if (token) {
    localStorage.setItem(USER_TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
};

/**
 * Clear user authentication data (logout)
 */
export const clearUserAuth = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Get user phone number
 * @returns {string|null}
 */
export const getUserPhone = () => {
  const user = getUserData();
  return user?.phone || null;
};
