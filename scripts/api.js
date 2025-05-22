// API Integration for OpenRouter
class OpenRouterAPI {
    constructor() {
        this.apiKey = this.getApiKey();
        this.baseUrl = 'https://openrouter.ai/api/v1';
    }

    // Get API key from meta tag
    getApiKey() {
        // In a real production environment, this would be handled server-side
        // For this simple app, we'll use the API key from a meta tag
        // Note: Exposing API keys in client-side code is not recommended for production apps
        
        // Try to get the API key from a meta tag
        const metaTag = document.querySelector('meta[name="openrouter-api-key"]');
        if (metaTag && metaTag.content && metaTag.content !== '<%= process.env.OPENROUTER_API_KEY %>') {
            return metaTag.content;
        }
        
        // For this demo, we'll use the hardcoded API key from the .env file
        // In a real app, you would never hardcode API keys in client-side code
        const apiKey = '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';
        return apiKey;
    }

    // Fetch available models from OpenRouter
    async getModels() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching models:', error);
            throw error;
        }
    }

    // For demonstration purposes, if the API call fails or for development
    // we'll provide some sample model data
    getFallbackModels() {
        return [
            {
                id: "anthropic/claude-3-opus",
                name: "Claude 3 Opus",
                description: "Anthropic's most powerful model for highly complex tasks requiring deep analysis and carefully considered responses.",
                context_length: 200000,
                pricing: {
                    prompt: 0.000015,
                    completion: 0.000075
                },
                provider: "Anthropic",
                capabilities: ["chat", "problem-solving", "content", "coding"],
                metrics: {
                    accuracy: 9.8,
                    performance: 9.5,
                    price: 7.5
                }
            },
            {
                id: "anthropic/claude-3-sonnet",
                name: "Claude 3 Sonnet",
                description: "Anthropic's balanced model offering high intelligence with greater efficiency.",
                context_length: 200000,
                pricing: {
                    prompt: 0.000003,
                    completion: 0.000015
                },
                provider: "Anthropic",
                capabilities: ["chat", "problem-solving", "content"],
                metrics: {
                    accuracy: 9.5,
                    performance: 9.2,
                    price: 8.5
                }
            },
            {
                id: "anthropic/claude-3-haiku",
                name: "Claude 3 Haiku",
                description: "Anthropic's fastest and most compact model for near-instant responses.",
                context_length: 200000,
                pricing: {
                    prompt: 0.00000025,
                    completion: 0.0000013
                },
                provider: "Anthropic",
                capabilities: ["chat", "content"],
                metrics: {
                    accuracy: 9.0,
                    performance: 9.8,
                    price: 9.5
                }
            },
            {
                id: "openai/gpt-4o",
                name: "GPT-4o",
                description: "OpenAI's most advanced model, optimized for a balance of intelligence and speed.",
                context_length: 128000,
                pricing: {
                    prompt: 0.000005,
                    completion: 0.000015
                },
                provider: "OpenAI",
                capabilities: ["chat", "problem-solving", "content", "coding", "it-support"],
                metrics: {
                    accuracy: 9.7,
                    performance: 9.6,
                    price: 8.0
                }
            },
            {
                id: "openai/gpt-4-turbo",
                name: "GPT-4 Turbo",
                description: "OpenAI's powerful model with enhanced capabilities and improved performance.",
                context_length: 128000,
                pricing: {
                    prompt: 0.000005,
                    completion: 0.000015
                },
                provider: "OpenAI",
                capabilities: ["chat", "problem-solving", "content", "coding", "it-support"],
                metrics: {
                    accuracy: 9.6,
                    performance: 9.4,
                    price: 8.0
                }
            },
            {
                id: "openai/gpt-3.5-turbo",
                name: "GPT-3.5 Turbo",
                description: "OpenAI's efficient model balancing capability and cost-effectiveness.",
                context_length: 16000,
                pricing: {
                    prompt: 0.0000005,
                    completion: 0.0000015
                },
                provider: "OpenAI",
                capabilities: ["chat", "content", "it-support"],
                metrics: {
                    accuracy: 8.5,
                    performance: 9.0,
                    price: 9.8
                }
            },
            {
                id: "google/gemini-1.5-pro",
                name: "Gemini 1.5 Pro",
                description: "Google's advanced multimodal model with strong reasoning capabilities.",
                context_length: 1000000,
                pricing: {
                    prompt: 0.000005,
                    completion: 0.000015
                },
                provider: "Google",
                capabilities: ["chat", "problem-solving", "content", "coding", "media"],
                metrics: {
                    accuracy: 9.5,
                    performance: 9.3,
                    price: 8.0
                }
            },
            {
                id: "google/gemini-1.5-flash",
                name: "Gemini 1.5 Flash",
                description: "Google's efficient model optimized for speed and responsiveness.",
                context_length: 1000000,
                pricing: {
                    prompt: 0.0000005,
                    completion: 0.0000015
                },
                provider: "Google",
                capabilities: ["chat", "content"],
                metrics: {
                    accuracy: 8.8,
                    performance: 9.7,
                    price: 9.5
                }
            },
            {
                id: "meta-llama/llama-3-70b-instruct",
                name: "Llama 3 70B",
                description: "Meta's largest open model with strong performance across various tasks.",
                context_length: 8000,
                pricing: {
                    prompt: 0.0000007,
                    completion: 0.0000009
                },
                provider: "Meta",
                capabilities: ["chat", "problem-solving", "content", "coding"],
                metrics: {
                    accuracy: 9.2,
                    performance: 8.8,
                    price: 9.6
                }
            },
            {
                id: "meta-llama/llama-3-8b-instruct",
                name: "Llama 3 8B",
                description: "Meta's compact model offering good performance with high efficiency.",
                context_length: 8000,
                pricing: {
                    prompt: 0.0000002,
                    completion: 0.0000003
                },
                provider: "Meta",
                capabilities: ["chat", "content"],
                metrics: {
                    accuracy: 8.0,
                    performance: 9.2,
                    price: 9.9
                }
            },
            {
                id: "mistralai/mistral-large",
                name: "Mistral Large",
                description: "Mistral's flagship model with excellent reasoning and coding capabilities.",
                context_length: 32000,
                pricing: {
                    prompt: 0.000002,
                    completion: 0.000006
                },
                provider: "Mistral AI",
                capabilities: ["chat", "problem-solving", "content", "coding"],
                metrics: {
                    accuracy: 9.4,
                    performance: 9.2,
                    price: 8.8
                }
            },
            {
                id: "mistralai/mistral-medium",
                name: "Mistral Medium",
                description: "Mistral's balanced model offering good performance at a moderate cost.",
                context_length: 32000,
                pricing: {
                    prompt: 0.000001,
                    completion: 0.000003
                },
                provider: "Mistral AI",
                capabilities: ["chat", "content", "coding"],
                metrics: {
                    accuracy: 8.9,
                    performance: 9.0,
                    price: 9.2
                }
            },
            {
                id: "mistralai/mistral-small",
                name: "Mistral Small",
                description: "Mistral's efficient model designed for speed and cost-effectiveness.",
                context_length: 32000,
                pricing: {
                    prompt: 0.0000002,
                    completion: 0.0000006
                },
                provider: "Mistral AI",
                capabilities: ["chat", "content"],
                metrics: {
                    accuracy: 8.2,
                    performance: 9.5,
                    price: 9.7
                }
            },
            {
                id: "anthropic/claude-2",
                name: "Claude 2",
                description: "Anthropic's previous generation model with strong reasoning capabilities.",
                context_length: 100000,
                pricing: {
                    prompt: 0.000008,
                    completion: 0.000024
                },
                provider: "Anthropic",
                capabilities: ["chat", "problem-solving", "content"],
                metrics: {
                    accuracy: 9.0,
                    performance: 8.5,
                    price: 8.0
                }
            },
            {
                id: "cohere/command-r",
                name: "Command R",
                description: "Cohere's powerful model optimized for enterprise applications and reasoning.",
                context_length: 128000,
                pricing: {
                    prompt: 0.000001,
                    completion: 0.000003
                },
                provider: "Cohere",
                capabilities: ["chat", "problem-solving", "content", "it-support"],
                metrics: {
                    accuracy: 9.1,
                    performance: 9.0,
                    price: 9.0
                }
            },
            {
                id: "cohere/command-r-plus",
                name: "Command R+",
                description: "Cohere's enhanced model with improved reasoning and specialized capabilities.",
                context_length: 128000,
                pricing: {
                    prompt: 0.000003,
                    completion: 0.000009
                },
                provider: "Cohere",
                capabilities: ["chat", "problem-solving", "content", "coding", "it-support"],
                metrics: {
                    accuracy: 9.3,
                    performance: 9.1,
                    price: 8.5
                }
            },
            {
                id: "stability/stable-diffusion-xl",
                name: "Stable Diffusion XL",
                description: "Stability AI's advanced image generation model with high-quality outputs.",
                pricing: {
                    generation: 0.002
                },
                provider: "Stability AI",
                capabilities: ["media"],
                metrics: {
                    accuracy: 9.0,
                    performance: 8.8,
                    price: 8.5
                }
            },
            {
                id: "openai/dall-e-3",
                name: "DALL-E 3",
                description: "OpenAI's advanced image generation model with exceptional detail and accuracy.",
                pricing: {
                    generation: 0.004
                },
                provider: "OpenAI",
                capabilities: ["media"],
                metrics: {
                    accuracy: 9.5,
                    performance: 9.0,
                    price: 7.5
                }
            },
            {
                id: "google/gemini-pro-vision",
                name: "Gemini Pro Vision",
                description: "Google's multimodal model capable of understanding and generating content from images.",
                context_length: 16000,
                pricing: {
                    prompt: 0.000001,
                    completion: 0.000003
                },
                provider: "Google",
                capabilities: ["chat", "media"],
                metrics: {
                    accuracy: 9.2,
                    performance: 9.0,
                    price: 8.8
                }
            }
        ];
    }

    // Get model details by ID
    async getModelDetails(modelId) {
        try {
            // In a real app, we might have an endpoint for detailed model info
            // For this demo, we'll filter from our available models
            const models = await this.getModels();
            return models.find(model => model.id === modelId);
        } catch (error) {
            console.error('Error fetching model details:', error);
            
            // Fallback to sample data
            const fallbackModels = this.getFallbackModels();
            return fallbackModels.find(model => model.id === modelId);
        }
    }
}

// Create a global instance of the API
const openRouterAPI = new OpenRouterAPI();
