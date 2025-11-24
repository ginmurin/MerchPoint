// This is a placeholder for your API configuration
// You would typically use a library like axios
const BASE_URL = 'https://api.merchpoint.com/v1';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const api = {
  get: async (endpoint, token) => {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, token) => {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};