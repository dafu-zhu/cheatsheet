const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  async getContent() {
    const response = await fetch(`${API_URL}/api/content`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }

    return response.json();
  },

  async updateContent(data) {
    const response = await fetch(`${API_URL}/api/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update content');
    }

    return response.json();
  },
};
