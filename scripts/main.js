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
    const card = document.createElement('div');
    card.className = 'model-card';
    card.dataset.modelId = model.id;
    
    // Format capabilities as category tags
    const categoryTags = model.capabilities ? model.capabilities.map(capability => 
        `<span class="category-tag">${modelManager.categories[capability]?.name || capability}</span>`
    ).join('') : '';
    
    // Format metrics for display
    const accuracyMetric = model.metrics?.accuracy ? `<div class="metric-value">${model.metrics.accuracy}/10</div>` : '';
    const performanceMetric = model.metrics?.performance ? `<div class="metric-value">${model.metrics.performance}/10</div>` : '';
    const priceMetric = model.metrics?.price ? `<div class="metric-value">${model.metrics.price}/10</div>` : '';
    
    // Format pricing
    const pricing = modelManager.formatPrice(model);
    
    // Get model strengths
    const strengths = modelManager.getModelStrengths(model);
    
    card.innerHTML = `
        <h3>${model.name}</h3>
        <div class="model-provider">${model.provider || 'Unknown Provider'}</div>
        <div class="model-description">${model.description || 'No description available.'}</div>
        <div class="model-categories">${categoryTags}</div>
        <div class="model-strengths"><strong>Best for:</strong> ${strengths}</div>
        <div class="model-pricing"><strong>Pricing:</strong> ${pricing}</div>
        <div class="model-metrics">
            <div class="metric">
                ${accuracyMetric}
                <div class="metric-label">Accuracy</div>
            </div>
            <div class="metric">
                ${performanceMetric}
                <div class="metric-label">Performance</div>
            </div>
            <div class="metric">
                ${priceMetric}
                <div class="metric-label">Price</div>
            </div>
        </div>
        <button class="view-details-btn" data-model-id="${model.id}">View Details</button>
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
    recommendations.forEach(model => {
        const card = document.createElement('div');
        card.className = 'model-card recommendation-card';
        
        // Format matched categories
        const matchedCategories = model.matchedCategories ? 
            `<div class="matched-categories"><strong>Matches your needs for:</strong> ${model.matchedCategories.join(', ')}</div>` : '';
        
        // Format match score
        const matchScore = model.matchScore ? 
            `<div class="match-score"><strong>Match Score:</strong> ${model.matchScore}%</div>` : '';
        
        // Format metrics for display
        const accuracyMetric = model.metrics?.accuracy ? `<div class="metric-value">${model.metrics.accuracy}/10</div>` : '';
        const performanceMetric = model.metrics?.performance ? `<div class="metric-value">${model.metrics.performance}/10</div>` : '';
        const priceMetric = model.metrics?.price ? `<div class="metric-value">${model.metrics.price}/10</div>` : '';
        
        // Format pricing
        const pricing = modelManager.formatPrice(model);
        
        card.innerHTML = `
            <h3>${model.name}</h3>
            <div class="model-provider">${model.provider || 'Unknown Provider'}</div>
            <div class="model-description">${model.description || 'No description available.'}</div>
            ${matchedCategories}
            ${matchScore}
            <div class="model-pricing"><strong>Pricing:</strong> ${pricing}</div>
            <div class="model-metrics">
                <div class="metric">
                    ${accuracyMetric}
                    <div class="metric-label">Accuracy</div>
                </div>
                <div class="metric">
                    ${performanceMetric}
                    <div class="metric-label">Performance</div>
                </div>
                <div class="metric">
                    ${priceMetric}
                    <div class="metric-label">Price</div>
                </div>
            </div>
            <button class="view-details-btn" data-model-id="${model.id}">View Details</button>
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
    modal.classList.remove('hidden');
    
    try {
        // Get model details
        const model = await openRouterAPI.getModelDetails(modelId);
        
        if (!model) {
            modalContent.innerHTML = '<div class="error">Model details not found.</div>';
            return;
        }
        
        // Format capabilities as category tags
        const categoryTags = model.capabilities ? model.capabilities.map(capability => 
            `<span class="category-tag">${modelManager.categories[capability]?.name || capability}</span>`
        ).join('') : '';
        
        // Format context length
        const contextLength = model.context_length ? 
            `<div class="model-context-length"><strong>Context Length:</strong> ${model.context_length.toLocaleString()} tokens</div>` : '';
        
        // Format pricing details
        let pricingDetails = '<div class="model-pricing-details"><strong>Pricing Details:</strong>';
        
        if (model.pricing) {
            if (model.pricing.prompt && model.pricing.completion) {
                const promptPrice = model.pricing.prompt * 1000;
                const completionPrice = model.pricing.completion * 1000;
                pricingDetails += `
                    <div>Input: $${promptPrice.toFixed(6)} per 1K tokens</div>
                    <div>Output: $${completionPrice.toFixed(6)} per 1K tokens</div>
                `;
            } else if (model.pricing.generation) {
                pricingDetails += `<div>$${model.pricing.generation.toFixed(6)} per generation</div>`;
            } else {
                pricingDetails += '<div>Pricing information not available</div>';
            }
        } else {
            pricingDetails += '<div>Pricing information not available</div>';
        }
        
        pricingDetails += '</div>';
        
        // Format metrics
        const metricsHTML = model.metrics ? `
            <div class="model-metrics-details">
                <h4>Performance Metrics</h4>
                <div class="metrics-grid">
                    <div class="metric-detail">
                        <div class="metric-name">Accuracy</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${model.metrics.accuracy * 10}%"></div>
                        </div>
                        <div class="metric-value">${model.metrics.accuracy}/10</div>
                    </div>
                    <div class="metric-detail">
                        <div class="metric-name">Performance</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${model.metrics.performance * 10}%"></div>
                        </div>
                        <div class="metric-value">${model.metrics.performance}/10</div>
                    </div>
                    <div class="metric-detail">
                        <div class="metric-name">Price (Value)</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${model.metrics.price * 10}%"></div>
                        </div>
                        <div class="metric-value">${model.metrics.price}/10</div>
                    </div>
                </div>
            </div>
        ` : '';
        
        // Get model strengths
        const strengths = modelManager.getModelStrengths(model);
        
        // Populate modal content
        modalContent.innerHTML = `
            <div class="model-details">
                <h2>${model.name}</h2>
                <div class="model-provider">${model.provider || 'Unknown Provider'}</div>
                <div class="model-categories">${categoryTags}</div>
                <div class="model-description">${model.description || 'No description available.'}</div>
                <div class="model-strengths"><strong>Best for:</strong> ${strengths}</div>
                ${contextLength}
                ${pricingDetails}
                ${metricsHTML}
            </div>
        `;
        
        // Add custom styles for the metrics bars
        const style = document.createElement('style');
        style.textContent = `
            .model-metrics-details {
                margin-top: 2rem;
            }
            
            .metrics-grid {
                display: grid;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .metric-detail {
                display: grid;
                grid-template-columns: 120px 1fr 50px;
                align-items: center;
                gap: 1rem;
            }
            
            .metric-bar {
                height: 12px;
                background-color: #e9ecef;
                border-radius: 6px;
                overflow: hidden;
            }
            
            .metric-fill {
                height: 100%;
                background-color: var(--primary-color);
                border-radius: 6px;
            }
            
            .model-pricing-details {
                margin-top: 1rem;
            }
            
            .model-pricing-details div {
                margin-top: 0.5rem;
                margin-left: 1rem;
            }
        `;
        
        document.head.appendChild(style);
        
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
