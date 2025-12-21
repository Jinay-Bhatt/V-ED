// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        // Initialize token from localStorage when the service is created
        this.token = localStorage.getItem('authToken');
    }

    setAuthToken(token) {
        this.token = token; // Update the instance's token
        if (token) {
            localStorage.setItem('authToken', token); // Store in localStorage
            console.log("authToken stored:", token); // <-- Add this for debugging
        } else {
            localStorage.removeItem('authToken'); // Remove from localStorage
            console.log("authToken removed."); // <-- Add this for debugging
        }
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // ONLY add Authorization header if token exists
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            },
            ...options,
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            console.log(`API Request: ${options.method || 'GET'} ${url}`, { body: options.body, headers: config.headers }); // <-- Add this for debugging
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Log full error response from backend
                console.error(`API Error Response for ${url}:`, data); // <-- Add this for debugging
                throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
            }

            console.log(`API Success Response for ${url}:`, data); // <-- Add this for debugging
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication
    async registerStudent(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: userData,
        });
    }

    async loginStudent(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: credentials,
        });
    }

    async verifyToken() {
        return this.request('/auth/verify');
    }

    // Students
    async getProfile() {
        return this.request('/students/profile');
    }

    async updateProfile(updates) {
        return this.request('/students/profile', {
            method: 'PUT',
            body: updates,
        });
    }

    // Lessons
    async getLessons(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`/lessons${queryParams ? `?${queryParams}` : ''}`);
    }

    async completeLesson(lessonId, score = 100, timeSpent = 0) {
        return this.request(`/lessons/${lessonId}/complete`, {
            method: 'POST',
            body: { score, timeSpent },
        });
    }

    // Games
    async getGames(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`/games${queryParams ? `?${queryParams}` : ''}`);
    }

    async playGame(gameId, score = 0, timeSpent = 0) {
        return this.request(`/games/${gameId}/play`, {
            method: 'POST',
            body: { score, timeSpent },
        });
    }

    // Progress
    async getProgress() {
        return this.request('/progress');
    }

    async getBadges() {
        return this.request('/progress/badges');
    }
}

// Export a single instance of the service
export default new ApiService();
