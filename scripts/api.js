// API Integration for OpenRouter
class OpenRouterAPI {
    constructor() {
        // No need for API key anymore as it's handled by the backend
        this.baseUrl = '/api'; // Use relative URL to our backend proxy
    }

    // Fetch available models from our backend proxy
    async getModels() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            // Check if we got fallback data from the backend
            if (data.fallback) {
                console.warn('Using fallback model data from backend');
                return data.data || [];
            }
            
            return data.data || [];
        } catch (error) {
            console.error('Error fetching models:', error);
            throw error;
        }
    }

    // Get model details by ID
    async getModelDetails(modelId) {
        try {
            const response = await fetch(`${this.baseUrl}/models/${modelId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            // Check if we got fallback data
            if (data.fallback) {
                console.warn('Using fallback model data from backend');
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching model details:', error);
            throw error;
        }
    }
}

// Create a global instance of the API
const openRouterAPI = new OpenRouterAPI();
