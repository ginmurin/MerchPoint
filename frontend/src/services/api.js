// This is a placeholder for your API configuration
// You would typically use a library like axios
const BASE_URL = 'http://localhost:8080/api';

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role || 'guest';
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || 'Something went wrong');
  }
  return response.json();
};

export const api = {
  get: async (endpoint, token) => {
    const url = `${BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
        'X-User-Role': getUserRole(),
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, token) => {
    const url = `${BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
        'X-User-Role': getUserRole(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  put: async (endpoint, data, token) => {
    const url = `${BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
        'X-User-Role': getUserRole(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint, token) => {
    const url = `${BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
        'X-User-Role': getUserRole(),
      },
    });
    
    // DELETE returns 204 No Content, so don't parse JSON
    if (response.status === 204) {
      return { success: true };
    }
    return handleResponse(response);
  },
};