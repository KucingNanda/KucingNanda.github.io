const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Service untuk menangani semua request ke Backend Golang
 */
export const apiService = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const isFormData = options.body instanceof FormData;
        const headers = {
            ...options.headers
        };
        
        if (!isFormData && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers,
                ...options,
            });
            
            // Allow 401 to propagate properly for login handling
            if (!response.ok && response.status !== 401) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }
            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            return await response.json();
        } catch (error) {
            console.error(`Fetch error pada [${endpoint}]:`, error);
            throw error;
        }
    },

    ping: () => apiService.request('/ping'),
    login: (credentials) => apiService.request('/login', { method: 'POST', body: JSON.stringify(credentials) }),
    
    getGames: () => apiService.request('/games'),
    createGame: (data) => apiService.request('/games', { method: 'POST', body: JSON.stringify(data) }),
    updateGame: (id, data) => apiService.request(`/games/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteGame: (id) => apiService.request(`/games/${id}`, { method: 'DELETE' }),

    getGallery: () => apiService.request('/gallery'),
    createGallery: (data) => apiService.request('/gallery', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
    updateGallery: (id, data) => apiService.request(`/gallery/${id}`, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
    deleteGallery: (id) => apiService.request(`/gallery/${id}`, { method: 'DELETE' }),

    getProfile: () => apiService.request('/profile'),
    createProfile: (data) => apiService.request('/profile', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
    updateProfile: (data) => apiService.request('/profile', { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),

    getVaults: () => apiService.request('/vault'),
    createVault: (data) => apiService.request('/vault', { method: 'POST', body: JSON.stringify(data) }),
    updateVault: (id, data) => apiService.request(`/vault/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteVault: (id) => apiService.request(`/vault/${id}`, { method: 'DELETE' }),

    getPlaylist: () => apiService.request('/playlist'),
    createPlaylist: (data) => apiService.request('/playlist', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
    updatePlaylist: (id, data) => apiService.request(`/playlist/${id}`, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
    deletePlaylist: (id) => apiService.request(`/playlist/${id}`, { method: 'DELETE' }),
};