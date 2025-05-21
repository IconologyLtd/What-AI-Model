// Main application logic

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the app directly
    // The API key is expected to be in a meta tag in the HTML
    // For this simple app, we'll use fallback data if the API key is not available
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    try {
        // Load models
        await loadModels();
        
        // Set up event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showError("There was an error initializing the application. Please try refreshing the page.");
    }
}

// Load models from API or fallback data
async function loadModels() {
    const modelsContainer = document.getElementById('models-container');
    
    try {
        // Show loading state
        modelsContainer.innerHTML = '<div class="loading">Loading models data...</div>';
        
        // Load models using the model manager
        const models = await modelManager.loadModels();
        
        // Display all models initially
        displayModels(models);
        
    } catch (error) {
        console.error('Error loading models:', error);
        modelsContainer.innerHTML = `
            <div class="error">
                Error loading models. Using fallback data instead.
                <br>
                ${error.message}
            </div>
        `;
        
        // Use fallback data
        const fallbackModels = openRouterAPI.getFallbackModels();
        displayModels(fallbackModels);
    }
}

// Display models in the UI
function displayModels(models) {
    const modelsContainer = document.getElementById('models-container');
    
    if (!models || models.length === 0) {
        modelsContainer.innerHTML = '<div class="error">No models available.</div>';
        return;
    }
    
    // Clear the container
    modelsContainer.innerHTML = '';
    
    // Create and append model cards
    models.forEach(model => {
        const modelCard = createModelCard(model);
        modelsContainer.appendChild(modelCard);
    });
}

// Create a model card element
function createModelCard(model) {
    // Log the model data to debug
    console.log(`Creating card for model: ${model.name}`, model);
    console.log(`Model metrics:`, model.metrics);
    
    const card = document.createElement('div');
    card.className = 'model-card glow-on-hover';
    card.dataset.modelId = model.id;
    
    // Get provider icon
    const providerIcon = getProviderIcon(model.provider);
    
    // Format capabilities as category tags
    const categoryTags = model.capabilities ? model.capabilities.map(capability => 
        `<span class="category-tag">${modelManager.categories[capability]?.name || capability}</span>`
    ).join('') : '';
    
    // Format metrics for display
    const accuracyMetric = model.metrics?.accuracy ? `<div class="metric-value">${model.metrics.accuracy}/10</div>` : '<div class="metric-value">N/A</div>';
    const performanceMetric = model.metrics?.performance ? `<div class="metric-value">${model.metrics.performance}/10</div>` : '<div class="metric-value">N/A</div>';
    const priceMetric = model.metrics?.price ? `<div class="metric-value">${model.metrics.price}/10</div>` : '<div class="metric-value">N/A</div>';
    
    // Format pricing
    const pricing = modelManager.formatPrice(model);
    
    // Get model strengths
    const strengths = modelManager.getModelStrengths(model);
    
    card.innerHTML = `
        <h3>${model.name}</h3>
        <div class="model-provider">${providerIcon} ${model.provider === undefined ? 'Unknown Provider' : model.provider}</div>
        <div class="model-description">${model.description || 'No description available.'}</div>
        <div class="model-categories">${categoryTags}</div>
        <div class="model-strengths"><i class="fas fa-check-circle"></i> <strong>Best for:</strong> ${strengths}</div>
        <div class="model-pricing"><i class="fas fa-tag"></i> <strong>Pricing:</strong> ${pricing}</div>
        <div class="model-metrics">
            <div class="metric">
                ${accuracyMetric}
                <div class="metric-label"><i class="fas fa-bullseye"></i></div>
            </div>
            <div class="metric">
                ${performanceMetric}
                <div class="metric-label"><i class="fas fa-bolt"></i></div>
            </div>
            <div class="metric">
                ${priceMetric}
                <div class="metric-label"><i class="fas fa-tag"></i></div>
            </div>
        </div>
        <button class="view-details-btn" data-model-id="${model.id}"><i class="fas fa-info-circle"></i> View Details</button>
    `;
    
    return card;
}

// Set up event listeners
function setupEventListeners() {
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter models by category
            const category = button.dataset.category;
            const filteredModels = modelManager.getModelsByCategory(category);
            displayModels(filteredModels);
        });
    });
    
    // Recommendation form submission
    const recommendationForm = document.getElementById('recommendation-form');
    recommendationForm.addEventListener('submit', event => {
        event.preventDefault();
        
        // Get user input
        const userNeeds = document.getElementById('user-needs').value.trim();
        
        // Get selected factors
        const factorCheckboxes = document.querySelectorAll('input[name="factors"]:checked');
        const selectedFactors = Array.from(factorCheckboxes).map(checkbox => checkbox.value);
        
        // Validate input
        if (!userNeeds) {
            alert('Please describe what you need the AI model for.');
            return;
        }
        
        if (selectedFactors.length === 0) {
            alert('Please select at least one factor that is important to you.');
            return;
        }
        
        // Get recommendations
        const recommendations = modelManager.recommendModels(userNeeds, selectedFactors);
        
        // Display recommendations
        displayRecommendations(recommendations, userNeeds);
    });
    
    // Reset recommendation button
    const resetButton = document.getElementById('reset-recommendation');
    resetButton.addEventListener('click', () => {
        // Hide recommendations and show form
        document.getElementById('recommendations-result').classList.add('hidden');
        recommendationForm.classList.remove('hidden');
        
        // Clear form
        document.getElementById('user-needs').value = '';
        
        // Reset checkboxes to default (all checked)
        document.querySelectorAll('input[name="factors"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    });
    
    // Model details buttons (using event delegation)
    document.addEventListener('click', event => {
        if (event.target.classList.contains('view-details-btn')) {
            const modelId = event.target.dataset.modelId;
            showModelDetails(modelId);
        }
    });
    
    // Close modal button
    const closeModalButton = document.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        document.getElementById('model-details-modal').classList.add('hidden');
    });
    
    // Close modal when clicking outside content
    const modal = document.getElementById('model-details-modal');
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            modal.classList.add('hidden');
        }
    });
}

// Helper function to get provider icon
function getProviderIcon(provider) {
    if (!provider) return '<i class="fas fa-robot"></i>';
    
    const providerLower = provider.toLowerCase();
    
    if (providerLower.includes('openai')) {
        return '<i class="fas fa-brain"></i>';
    } else if (providerLower.includes('anthropic')) {
        return '<i class="fas fa-user-astronaut"></i>';
    } else if (providerLower.includes('google') || providerLower.includes('gemini')) {
        return '<i class="fab fa-google"></i>';
    } else if (providerLower.includes('meta') || providerLower.includes('llama')) {
        return '<i class="fab fa-facebook"></i>';
    } else if (providerLower.includes('mistral')) {
        return '<i class="fas fa-wind"></i>';
    } else if (providerLower.includes('cohere')) {
        return '<i class="fas fa-link"></i>';
    } else if (providerLower.includes('stability')) {
        return '<i class="fas fa-image"></i>';
    } else {
        return '<i class="fas fa-robot"></i>';
    }
}

// Display recommendations
function displayRecommendations(recommendations, userNeeds) {
    const recommendationsContainer = document.getElementById('recommended-models');
    const recommendationsResult = document.getElementById('recommendations-result');
    const recommendationForm = document.getElementById('recommendation-form');
    
    // Hide form and show recommendations
    recommendationForm.classList.add('hidden');
    recommendationsResult.classList.remove('hidden');
    
    // Clear previous recommendations
    recommendationsContainer.innerHTML = '';
    
    if (!recommendations || recommendations.length === 0) {
        recommendationsContainer.innerHTML = '<div class="error">No matching models found for your needs.</div>';
        return;
    }
    
    // Create and append recommendation cards
    recommendations.forEach((model, index) => {
        const card = document.createElement('div');
        card.className = 'model-card recommendation-card glow-on-hover';
        card.style.setProperty('--animation-order', index);
        
        // Get provider icon
        const providerIcon = getProviderIcon(model.provider);
        
        // Format matched categories
        const matchedCategories = model.matchedCategories ? 
            `<div class="matched-categories"><i class="fas fa-bullseye"></i> <strong>Matches your needs for:</strong> ${model.matchedCategories.join(', ')}</div>` : '';
        
        // Format match score
        const matchScore = model.matchScore ? 
            `<div class="match-score"><i class="fas fa-percentage"></i> <strong>Match Score:</strong> ${model.matchScore}%</div>` : '';
        
        // Format metrics for display
        const accuracyMetric = model.metrics?.accuracy ? `<div class="metric-value">${model.metrics.accuracy}/10</div>` : '<div class="metric-value">N/A</div>';
        const performanceMetric = model.metrics?.performance ? `<div class="metric-value">${model.metrics.performance}/10</div>` : '<div class="metric-value">N/A</div>';
        const priceMetric = model.metrics?.price ? `<div class="metric-value">${model.metrics.price}/10</div>` : '<div class="metric-value">N/A</div>';
        
        // Format pricing
        const pricing = modelManager.formatPrice(model);
        
        card.innerHTML = `
            <h3>${model.name}</h3>
            <div class="model-provider">${providerIcon} ${model.provider === undefined ? 'Unknown Provider' : model.provider}</div>
            <div class="model-description">${model.description || 'No description available.'}</div>
            ${matchedCategories}
            ${matchScore}
            <div class="model-pricing"><i class="fas fa-tag"></i> <strong>Pricing:</strong> ${pricing}</div>
            <div class="model-metrics">
                <div class="metric">
                    ${accuracyMetric}
                    <div class="metric-label"><i class="fas fa-bullseye"></i></div>
                </div>
                <div class="metric">
                    ${performanceMetric}
                    <div class="metric-label"><i class="fas fa-bolt"></i></div>
                </div>
                <div class="metric">
                    ${priceMetric}
                    <div class="metric-label"><i class="fas fa-tag"></i></div>
                </div>
            </div>
            <button class="view-details-btn" data-model-id="${model.id}"><i class="fas fa-info-circle"></i> View Details</button>
        `;
        
        recommendationsContainer.appendChild(card);
    });
}

// Show model details in modal
async function showModelDetails(modelId) {
    const modal = document.getElementById('model-details-modal');
    const modalContent = document.getElementById('model-details-content');
    
    // Show loading state
    modalContent.innerHTML = '<div class="loading">Loading model details...</div>';
    
    // Create particles container if it doesn't exist
    let particlesContainer = modal.querySelector('.modal-particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'modal-particles';
        modal.querySelector('.modal-content').prepend(particlesContainer);
    }
    
    // Show modal
    modal.classList.remove('hidden');
    
    try {
        // Get model details
        const model = await openRouterAPI.getModelDetails(modelId);
        
        console.log('Model details:', model);
        console.log('Provider:', model.provider);
        
        if (!model) {
            modalContent.innerHTML = '<div class="error">Model details not found.</div>';
            return;
        }
        
        // Ensure the model has a provider
        if (!model.provider) {
            model.provider = modelManager.inferProvider(model);
        }
        
        // Get provider icon
        const providerIcon = getProviderIcon(model.provider);
        
        // Format capabilities as category tags
        const categoryTags = model.capabilities ? model.capabilities.map(capability => 
            `<span class="category-tag">${modelManager.categories[capability]?.name || capability}</span>`
        ).join('') : '';
        
        // Format context length
        const contextLength = model.context_length ? 
            `<div class="model-context-length"><i class="fas fa-exchange-alt"></i> <strong>Context Length:</strong> ${model.context_length.toLocaleString()} tokens</div>` : '';
        
        // Format pricing details
        let pricingDetails = '<div class="model-pricing-details"><i class="fas fa-dollar-sign"></i> <strong>Pricing Details:</strong>';
        
        if (model.pricing) {
            if (model.pricing.prompt && model.pricing.completion) {
                const promptPrice = model.pricing.prompt * 1000;
                const completionPrice = model.pricing.completion * 1000;
                pricingDetails += `
                    <div><i class="fas fa-arrow-right"></i> Input: $${promptPrice.toFixed(6)} per 1K tokens</div>
                    <div><i class="fas fa-arrow-left"></i> Output: $${completionPrice.toFixed(6)} per 1K tokens</div>
                `;
            } else if (model.pricing.generation) {
                pricingDetails += `<div><i class="fas fa-image"></i> $${model.pricing.generation.toFixed(6)} per generation</div>`;
            } else {
                pricingDetails += '<div>Pricing information not available</div>';
            }
        } else {
            pricingDetails += '<div>Pricing information not available</div>';
        }
        
        pricingDetails += '</div>';
        
        // Format metrics
        let metricsHTML = '';
        if (model.metrics) {
            // Log metrics data for debugging
            console.log(`Modal metrics for ${model.name}:`, model.metrics);
            
            const accuracy = model.metrics.accuracy || 0;
            const performance = model.metrics.performance || 0;
            const price = model.metrics.price || 0;
            
            metricsHTML = `
                <div class="model-metrics-details">
                    <h4><i class="fas fa-chart-line"></i> Performance Metrics</h4>
                    <div class="metrics-grid">
                        <div class="metric-detail">
                            <div class="metric-name"><i class="fas fa-bullseye"></i> Accuracy</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${accuracy * 10}%"></div>
                            </div>
                            <div class="metric-value">${accuracy ? accuracy + '/10' : 'N/A'}</div>
                        </div>
                        <div class="metric-detail">
                            <div class="metric-name"><i class="fas fa-bolt"></i> Speed</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${performance * 10}%"></div>
                            </div>
                            <div class="metric-value">${performance ? performance + '/10' : 'N/A'}</div>
                        </div>
                        <div class="metric-detail">
                            <div class="metric-name"><i class="fas fa-tag"></i> Value</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${price * 10}%"></div>
                            </div>
                            <div class="metric-value">${price ? price + '/10' : 'N/A'}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            console.log(`No metrics data for ${model.name}`);
            metricsHTML = `
                <div class="model-metrics-details">
                    <h4><i class="fas fa-chart-line"></i> Performance Metrics</h4>
                    <div class="metrics-grid">
                        <div class="metric-detail">
                            <div class="metric-name"><i class="fas fa-bullseye"></i> Accuracy</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 0%"></div>
                            </div>
                            <div class="metric-value">N/A</div>
                        </div>
                        <div class="metric-detail">
                            <div class="metric-name"><i class="fas fa-bolt"></i> Speed</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 0%"></div>
                            </div>
                            <div class="metric-value">N/A</div>
                        </div>
                        <div class="metric-detail">
                            <div class="metric-name"><i class="fas fa-tag"></i> Value</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 0%"></div>
                            </div>
                            <div class="metric-value">N/A</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Get model strengths
        const strengths = modelManager.getModelStrengths(model);
        
        // Populate modal content
        modalContent.innerHTML = `
            <div class="model-details">
                <h2>${model.name}</h2>
                <div class="model-provider">${providerIcon} ${model.provider === undefined ? 'Unknown Provider' : model.provider}</div>
                <div class="model-categories">${categoryTags}</div>
                <div class="model-description">${model.description || 'No description available.'}</div>
                <div class="model-strengths"><i class="fas fa-check-circle"></i> <strong>Best for:</strong> ${strengths}</div>
                ${contextLength}
                ${pricingDetails}
                ${metricsHTML}
            </div>
        `;
        
        // Trigger animation for metric bars
        setTimeout(() => {
            const metricFills = document.querySelectorAll('.metric-fill');
            metricFills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            });
        }, 300);
        
    } catch (error) {
        console.error('Error showing model details:', error);
        modalContent.innerHTML = `
            <div class="error">
                Error loading model details.
                <br>
                ${error.message}
            </div>
        `;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    // Insert at the top of the main content
    const main = document.querySelector('main');
    main.insertBefore(errorDiv, main.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
