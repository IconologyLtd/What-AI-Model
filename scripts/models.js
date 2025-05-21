// Model categorization and recommendation logic

class ModelManager {
    constructor() {
        this.models = [];
        this.categories = {
            'coding': {
                name: 'Coding & Development',
                description: 'Models that excel at understanding, generating, and debugging code across various programming languages.'
            },
            'chat': {
                name: 'General Chat',
                description: 'Models optimized for natural conversation and general-purpose dialogue.'
            },
            'problem-solving': {
                name: 'Problem Solving',
                description: 'Models with strong reasoning capabilities for complex problem-solving and analysis.'
            },
            'it-support': {
                name: 'IT Support',
                description: 'Models specialized in technical troubleshooting and IT assistance.'
            },
            'content': {
                name: 'Content Creation',
                description: 'Models that excel at generating high-quality written content like articles, blogs, and marketing copy.'
            },
            'media': {
                name: 'Media Generation',
                description: 'Models designed for creating images, audio, or other media content.'
            }
        };
    }

    // Load models from API or fallback data
    async loadModels() {
        try {
            // For this demo, we'll use the fallback data directly
            // In a real app with proper API key handling, you would use the API
            this.models = openRouterAPI.getFallbackModels();
            
            // Enhance models with additional metadata if needed
            this.enhanceModels();
            
            return this.models;
        } catch (error) {
            console.error('Error loading models:', error);
            // Use fallback data in case of error
            this.models = openRouterAPI.getFallbackModels();
            this.enhanceModels();
            return this.models;
        }
    }

    // Add additional metadata to models if needed
    enhanceModels() {
        // This could include adding category information, performance metrics, etc.
        // For our demo, most of this is already in the fallback data
        
        // Ensure all models have metrics
        this.models.forEach(model => {
            if (!model.metrics) {
                model.metrics = {
                    accuracy: this.getRandomMetric(7, 9.5),
                    performance: this.getRandomMetric(7, 9.5),
                    price: this.getRandomMetric(7, 9.5)
                };
            }
            
            // Ensure all models have capabilities/categories
            if (!model.capabilities) {
                // Assign some default capabilities based on model name/description
                model.capabilities = this.inferCapabilities(model);
            }
        });
    }
    
    // Helper to generate random metrics for models that don't have them
    getRandomMetric(min, max) {
        return Math.round((min + Math.random() * (max - min)) * 10) / 10;
    }
    
    // Infer capabilities from model name and description
    inferCapabilities(model) {
        const capabilities = ["chat"]; // All models can chat at minimum
        
        const name = model.name.toLowerCase();
        const description = (model.description || "").toLowerCase();
        
        // Check for coding capabilities
        if (name.includes("code") || description.includes("code") || 
            description.includes("programming") || description.includes("developer")) {
            capabilities.push("coding");
        }
        
        // Check for problem-solving
        if (description.includes("reason") || description.includes("problem") || 
            description.includes("complex") || description.includes("analysis")) {
            capabilities.push("problem-solving");
        }
        
        // Check for content creation
        if (description.includes("content") || description.includes("writing") || 
            description.includes("creative") || description.includes("text")) {
            capabilities.push("content");
        }
        
        // Check for IT support
        if (description.includes("support") || description.includes("technical") || 
            description.includes("troubleshoot")) {
            capabilities.push("it-support");
        }
        
        // Check for media generation
        if (description.includes("image") || description.includes("visual") || 
            description.includes("media") || description.includes("generate") ||
            name.includes("vision") || name.includes("dall") || name.includes("diffusion")) {
            capabilities.push("media");
        }
        
        return capabilities;
    }

    // Get all models
    getAllModels() {
        return this.models;
    }

    // Get models by category
    getModelsByCategory(category) {
        if (category === 'all') {
            return this.models;
        }
        
        return this.models.filter(model => 
            model.capabilities && model.capabilities.includes(category)
        );
    }

    // Get model by ID
    getModelById(modelId) {
        return this.models.find(model => model.id === modelId);
    }

    // Get all available categories
    getCategories() {
        return this.categories;
    }

    // Recommend models based on user needs and preferences
    recommendModels(userNeeds, factors) {
        const userNeedsLower = userNeeds.toLowerCase();
        let matchedModels = [];
        
        // Determine which categories the user needs match
        const neededCategories = this.determineNeededCategories(userNeedsLower);
        
        // Filter models that match the needed categories
        this.models.forEach(model => {
            if (!model.capabilities) return;
            
            // Calculate how many of the needed categories this model supports
            const matchedCategories = neededCategories.filter(category => 
                model.capabilities.includes(category)
            );
            
            if (matchedCategories.length > 0) {
                // Calculate a match score based on how many categories match and the model's metrics
                const categoryMatchScore = matchedCategories.length / neededCategories.length;
                
                // Calculate metric score based on user's preferred factors
                let metricScore = 0;
                if (model.metrics) {
                    factors.forEach(factor => {
                        if (model.metrics[factor]) {
                            metricScore += model.metrics[factor];
                        }
                    });
                    metricScore = metricScore / (factors.length * 10); // Normalize to 0-1
                }
                
                // Combined score (70% category match, 30% metrics)
                const score = (categoryMatchScore * 0.7) + (metricScore * 0.3);
                
                matchedModels.push({
                    model,
                    score,
                    matchedCategories
                });
            }
        });
        
        // Sort by score (highest first)
        matchedModels.sort((a, b) => b.score - a.score);
        
        // Return top models (up to 3)
        return matchedModels.slice(0, 3).map(item => ({
            ...item.model,
            matchScore: Math.round(item.score * 100),
            matchedCategories: item.matchedCategories.map(cat => this.categories[cat].name)
        }));
    }
    
    // Determine which categories match the user's needs
    determineNeededCategories(userNeeds) {
        const neededCategories = [];
        
        // Check for coding needs
        if (userNeeds.includes("code") || userNeeds.includes("programming") || 
            userNeeds.includes("develop") || userNeeds.includes("software") ||
            userNeeds.includes("script") || userNeeds.includes("debug")) {
            neededCategories.push("coding");
        }
        
        // Check for chat/conversation needs
        if (userNeeds.includes("chat") || userNeeds.includes("talk") || 
            userNeeds.includes("convers") || userNeeds.includes("discuss") ||
            userNeeds.includes("communicate")) {
            neededCategories.push("chat");
        }
        
        // Check for problem-solving needs
        if (userNeeds.includes("problem") || userNeeds.includes("solve") || 
            userNeeds.includes("analyze") || userNeeds.includes("research") ||
            userNeeds.includes("complex") || userNeeds.includes("reason")) {
            neededCategories.push("problem-solving");
        }
        
        // Check for IT support needs
        if (userNeeds.includes("support") || userNeeds.includes("troubleshoot") || 
            userNeeds.includes("fix") || userNeeds.includes("technical") ||
            userNeeds.includes("error") || userNeeds.includes("help with")) {
            neededCategories.push("it-support");
        }
        
        // Check for content creation needs
        if (userNeeds.includes("content") || userNeeds.includes("write") || 
            userNeeds.includes("blog") || userNeeds.includes("article") ||
            userNeeds.includes("essay") || userNeeds.includes("story") ||
            userNeeds.includes("marketing") || userNeeds.includes("creative")) {
            neededCategories.push("content");
        }
        
        // Check for media generation needs
        if (userNeeds.includes("image") || userNeeds.includes("picture") || 
            userNeeds.includes("photo") || userNeeds.includes("visual") ||
            userNeeds.includes("design") || userNeeds.includes("generate") ||
            userNeeds.includes("create") || userNeeds.includes("art")) {
            neededCategories.push("media");
        }
        
        // If no specific categories were identified, default to general chat
        if (neededCategories.length === 0) {
            neededCategories.push("chat");
        }
        
        return neededCategories;
    }
    
    // Format pricing for display
    formatPrice(model) {
        if (!model.pricing) return "Varies";
        
        if (model.pricing.prompt && model.pricing.completion) {
            const promptPrice = model.pricing.prompt * 1000;
            const completionPrice = model.pricing.completion * 1000;
            return `$${promptPrice.toFixed(4)}/$${completionPrice.toFixed(4)} per 1K tokens`;
        } else if (model.pricing.generation) {
            return `$${model.pricing.generation.toFixed(4)} per generation`;
        }
        
        return "Varies";
    }
    
    // Get a description of what a model is best for
    getModelStrengths(model) {
        if (!model.capabilities || model.capabilities.length === 0) {
            return "General purpose AI assistance";
        }
        
        const strengths = [];
        
        if (model.capabilities.includes("coding")) {
            strengths.push("Software development");
        }
        
        if (model.capabilities.includes("problem-solving")) {
            strengths.push("Complex problem solving");
        }
        
        if (model.capabilities.includes("content")) {
            strengths.push("Content creation");
        }
        
        if (model.capabilities.includes("it-support")) {
            strengths.push("Technical support");
        }
        
        if (model.capabilities.includes("media")) {
            strengths.push("Media generation");
        }
        
        if (strengths.length === 0 && model.capabilities.includes("chat")) {
            strengths.push("General conversation");
        }
        
        return strengths.join(", ");
    }
}

// Create a global instance of the model manager
const modelManager = new ModelManager();
