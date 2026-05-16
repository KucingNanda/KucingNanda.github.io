const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Service untuk menangani semua request ke Backend Golang
 */
export const apiService = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options,
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Fetch error pada [${endpoint}]:`, error);
            throw error;
        }
    },

    ping: () => apiService.request('/ping'),
    getGames: () => apiService.request('/games'),
    getGallery: () => apiService.request('/gallery'),
    getProfile: () => apiService.request('/profile'),
};