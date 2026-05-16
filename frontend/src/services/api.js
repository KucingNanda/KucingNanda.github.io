const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fungsi dasar untuk melakukan fetch dengan penanganan error
 */
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
};

export const apiService = {
    // Test koneksi ke backend
    ping: () => fetchAPI('/ping'),

    // Ambil data gallery
    getGalleries: () => fetchAPI('/gallery'),
};