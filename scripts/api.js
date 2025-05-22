// API Integration for OpenRouter
class OpenRouterAPI {
    constructor() {
        // No need for API key anymore as it's handled by the backend
        this.baseUrl = '/api'; // Use relative URL to our backend proxy
    }
    
    // Get fallback models when API is unavailable
    getFallbackModels() {
        console.warn('Using fallback models from client-side');
        // Return an empty array - the actual fallback data is provided by the server
        // This is just a placeholder to prevent errors when this method is called
        return [];
    }

    // Fetch available models from our backend proxy
    async getModels() {
        try {
            console.log('Fetching models from backend proxy...');
            const response = await fetch(`${this.baseUrl}/models`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`API request failed with status ${response.status}`);
                throw new Error(`API request failed with status ${response.status}`);
            }

            console.log('Response received from backend proxy');
            const data = await response.json();
            console.log('Response data:', data);
            
            // Check if we got fallback data from the backend
            if (data.fallback) {
                console.warn('Using fallback model data from backend');
                return data;
            }
            
            console.log('Using live data from API');
            return data;
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
