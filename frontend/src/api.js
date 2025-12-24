const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

// Leaderboard API
export async function fetchLeaderboard(week = null, year = null) {
  const params = new URLSearchParams();
  if (week) params.append('week', week);
  if (year) params.append('year', year);
  
  const query = params.toString() ? `?${params}` : '';
  return fetchAPI(`/api/leaderboard${query}`);
}

export async function fetchLeaderboardHistory() {
  return fetchAPI('/api/leaderboard/history');
}

// Users API
export async function fetchUsers() {
  return fetchAPI('/api/users');
}

export async function fetchUser(id) {
  return fetchAPI(`/api/users/${id}`);
}

export async function createUser(name, email = null) {
  return fetchAPI('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
}

export async function updateUser(id, updates) {
  return fetchAPI(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteUser(id) {
  return fetchAPI(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
