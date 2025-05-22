// Main application logic

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the app directly
    // The API key is expected to be in a meta tag in the HTML or .env file
    initializeApp();
    
    // Set up automatic refresh every 30 minutes (1800000 ms)
    // This ensures the app gets the latest models periodically
    setInterval(refreshModels, 1800000);
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

// Display models in the UI with pagination
function displayModels(models) {
    const modelsContainer = document.getElementById('models-container');
    
    if (!models || models.length === 0) {
        modelsContainer.innerHTML = '<div class="error">No models available.</div>';
        return;
    }
    
    // Clear the container
    modelsContainer.innerHTML = '';
    
    // Get the number of models per page from the dropdown or session storage
    const cardsPerPageSelect = document.getElementById('cards-per-page');
    // Try to get the value from session storage first, then from the dropdown, or default to 6
    const storedCardsPerPage = sessionStorage.getItem('cardsPerPage');
    const modelsPerPage = parseInt(storedCardsPerPage || (cardsPerPageSelect ? cardsPerPageSelect.value : 6));
    const totalPages = Math.ceil(models.length / modelsPerPage);
    
    // Get or initialize current page
    let currentPage = parseInt(sessionStorage.getItem('currentModelPage') || '1');
    if (currentPage > totalPages) currentPage = 1;
    
    // Calculate start and end indices for the current page
    const startIndex = (currentPage - 1) * modelsPerPage;
    const endIndex = Math.min(startIndex + modelsPerPage, models.length);
    
    // Get models for the current page
    const currentModels = models.slice(startIndex, endIndex);
    
    // Create and append model cards for the current page
    currentModels.forEach(model => {
        const modelCard = createModelCard(model);
        modelsContainer.appendChild(modelCard);
    });
    
    // Add pagination controls if there's more than one page
    if (totalPages > 1) {
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        
        // Create pagination elements
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                sessionStorage.setItem('currentModelPage', (currentPage - 1).toString());
                displayModels(models);
            }
        });
        
        // Page indicator
        const pageIndicator = document.createElement('div');
        pageIndicator.className = 'page-indicator';
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn';
        nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                sessionStorage.setItem('currentModelPage', (currentPage + 1).toString());
                displayModels(models);
            }
        });
        
        // Create a container for the pagination controls with flexbox layout
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-controls';
        paginationContainer.style.display = 'flex';
        paginationContainer.style.justifyContent = 'center';
        paginationContainer.style.alignItems = 'center';
        paginationContainer.style.width = '100%';
        paginationContainer.style.marginTop = '20px';
        paginationContainer.style.marginBottom = '20px';
        
        // Add the pagination buttons
        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageIndicator);
        paginationContainer.appendChild(nextButton);
        
        // Add the pagination container to the models container
        modelsContainer.appendChild(paginationContainer);
        
        // Cards per page selector - positioned below the pagination controls
        const displayOptions = document.createElement('div');
        displayOptions.className = 'display-options';
        displayOptions.style.display = 'flex';
        displayOptions.style.justifyContent = 'center';
        displayOptions.style.alignItems = 'center';
        displayOptions.style.marginTop = '10px';
        displayOptions.innerHTML = `
            <label for="cards-per-page">
                <i class="fas fa-th-large"></i> Cards per page:
                <select id="cards-per-page">
                    <option value="3" ${modelsPerPage === 3 ? 'selected' : ''}>3</option>
                    <option value="6" ${modelsPerPage === 6 ? 'selected' : ''}>6</option>
                    <option value="9" ${modelsPerPage === 9 ? 'selected' : ''}>9</option>
                    <option value="12" ${modelsPerPage === 12 ? 'selected' : ''}>12</option>
                    <option value="24" ${modelsPerPage === 24 ? 'selected' : ''}>24</option>
                </select>
            </label>
        `;
        
        // Add the display options below the pagination controls
        modelsContainer.appendChild(displayOptions);
        
        // Add event listener for the cards per page dropdown
        const cardsPerPageSelect = document.getElementById('cards-per-page');
        if (cardsPerPageSelect) {
            cardsPerPageSelect.addEventListener('change', () => {
                // Store the selected value in session storage
                sessionStorage.setItem('cardsPerPage', cardsPerPageSelect.value);
                
                // Reset to page 1 when changing the number of cards per page
                sessionStorage.setItem('currentModelPage', '1');
                
                // Get the current active category and search query
                const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
                const searchQuery = document.getElementById('model-search').value.trim();
                
                // Get models for the current category
                const categoryModels = modelManager.getModelsByCategory(activeCategory);
                
                // Apply search filter if there's a search query
                const filteredModels = searchQuery 
                    ? filterModelsBySearch(categoryModels, searchQuery) 
                    : categoryModels;
                
                // Update the display with the new cards per page setting
                displayModels(filteredModels);
            });
        }
    }
}

// Create a model card element with truncated description
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
    
    // Format context length (memory)
    const contextLength = model.context_length ? 
        `<div class="model-memory"><i class="fas fa-memory"></i> <strong>Memory:</strong> ${model.context_length.toLocaleString()} tokens</div>` : 
        '';
    
// Store full description in data attribute
const fullDescription = model.description || 'No description available.';
const truncatedDescription = fullDescription.length > 100
    ? fullDescription.substring(0, 100) + '...'
    : fullDescription;

card.innerHTML = `
    <h3>${model.name}</h3>
    <div class="model-provider">${providerIcon} ${model.provider === undefined ? 'Unknown Provider' : model.provider}</div>
    <div class="model-description" data-full-description="${fullDescription.replace(/"/g, '"')}">${truncatedDescription}</div>
    <div class="model-categories">${categoryTags}</div>
    <div class="model-strengths"><i class="fas fa-check-circle"></i> <strong>Best for:</strong> ${strengths}</div>
    ${contextLength}
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
    // Search functionality
    const searchInput = document.getElementById('model-search');
    const clearSearchBtn = document.getElementById('clear-search');
    
    // Show/hide clear button based on search input content
    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.trim();
        clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        
        // Get the current active category
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        
        // Get models for the current category
        const categoryModels = modelManager.getModelsByCategory(activeCategory);
        
        // Filter models by search query
        const filteredModels = searchQuery 
            ? filterModelsBySearch(categoryModels, searchQuery) 
            : categoryModels;
        
        // Display filtered models
        displayModels(filteredModels);
    });
    
    // Clear search button
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        
        // Reset to current category filter
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        const filteredModels = modelManager.getModelsByCategory(activeCategory);
        displayModels(filteredModels);
        
        // Focus back on search input
        searchInput.focus();
    });
    
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
            
            // Apply search filter if there's a search query
            const searchQuery = document.getElementById('model-search').value.trim();
            const finalFilteredModels = searchQuery 
                ? filterModelsBySearch(filteredModels, searchQuery) 
                : filteredModels;
            
            displayModels(finalFilteredModels);
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
    
    // Manual refresh button
    const refreshButton = document.getElementById('refresh-models-btn');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            // Add spinning animation to the button icon
            const icon = refreshButton.querySelector('i');
            icon.classList.add('fa-spin');
            
            // Disable the button during refresh
            refreshButton.disabled = true;
            
            // Call the refresh function
            refreshModels().finally(() => {
                // Re-enable the button and stop spinning when done
                setTimeout(() => {
                    icon.classList.remove('fa-spin');
                    refreshButton.disabled = false;
                }, 1000);
            });
        });
    }
    
    // We don't need this duplicate event listener for cards-per-page
    // The event listener is already added in the displayModels function
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

// Display recommendations with truncated descriptions
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
        
        // Format context length (memory)
        const contextLength = model.context_length ? 
            `<div class="model-memory"><i class="fas fa-memory"></i> <strong>Memory:</strong> ${model.context_length.toLocaleString()} tokens</div>` : 
            '';
        
// Truncate description to 100 characters with ellipsis
const truncatedDescription = model.description && model.description.length > 100
    ? model.description.substring(0, 100) + '...'
    : model.description || 'No description available.';

card.innerHTML = `
    <h3>${model.name}</h3>
    <div class="model-provider">${providerIcon} ${model.provider === undefined ? 'Unknown Provider' : model.provider}</div>
    <div class="model-description">${truncatedDescription}</div>
    ${matchedCategories}
    ${matchScore}
    ${contextLength}
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

// Filter models by search query
function filterModelsBySearch(models, query) {
    query = query.toLowerCase();
    
    return models.filter(model => {
        // Search in model name
        if (model.name && model.name.toLowerCase().includes(query)) {
            return true;
        }
        
        // Search in model provider
        if (model.provider && model.provider.toLowerCase().includes(query)) {
            return true;
        }
        
        // Search in model description
        if (model.description && model.description.toLowerCase().includes(query)) {
            return true;
        }
        
        // Search in model capabilities/categories
        if (model.capabilities && model.capabilities.some(capability => {
            // Check the capability itself
            if (capability.toLowerCase().includes(query)) {
                return true;
            }
            
            // Check the category name if available
            const categoryName = modelManager.categories[capability]?.name;
            return categoryName && categoryName.toLowerCase().includes(query);
        })) {
            return true;
        }
        
        // Search in model strengths
        const strengths = modelManager.getModelStrengths(model);
        if (strengths && strengths.toLowerCase().includes(query)) {
            return true;
        }
        
        return false;
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

    // Create modal banner container if it doesn't exist
    let modalBanner = modal.querySelector('.modal-banner');
    if (!modalBanner) {
        modalBanner = document.createElement('div');
        modalBanner.className = 'modal-banner';
        modal.querySelector('.modal-content').prepend(modalBanner);
    }

    // Show modal
    modal.classList.remove('hidden');

    try {
        // Get model details - first try to get from the DOM if available
        let model;

        // Try to find the model in the DOM first (faster and more reliable)
        const modelCard = document.querySelector(`.model-card[data-model-id="${modelId}"]`);
        if (modelCard) {
            // Extract basic info from the card
            const name = modelCard.querySelector('h3').textContent;
            const provider = modelCard.querySelector('.model-provider').textContent.trim();

// Get the full description from the data attribute
let description = modelCard.querySelector('.model-description').textContent;

// Check if the description is truncated (ends with '...')
if (description.endsWith('...')) {
    // Get the full description from the data attribute
    const fullDescription = modelCard.querySelector('.model-description').dataset.fullDescription;
    if (fullDescription) {
        description = fullDescription;
    } else {
        // If not available in dataset, try to get from API
        try {
            const apiModel = await openRouterAPI.getModelDetails(modelId);
            if (apiModel && apiModel.description) {
                description = apiModel.description;
            }
        } catch (apiError) {
            console.error('Error fetching model details from API:', apiError);
            // If API fails, use the truncated description as fallback
        }
    }
}

            // Get metrics from the card
            const metricValues = Array.from(modelCard.querySelectorAll('.metric-value')).map(el => el.textContent);

            // Extract strengths directly from the DOM if available
            let strengths = '';
            const strengthsElement = modelCard.querySelector('.model-strengths');
            if (strengthsElement) {
                // Extract just the text after "Best for:"
                const strengthsText = strengthsElement.textContent;
                const match = strengthsText.match(/Best for:\s*(.*)/);
                if (match && match[1]) {
                    strengths = match[1].trim();
                }
            }

            // Extract pricing directly from the DOM if available
            let pricingText = '';
            const pricingElement = modelCard.querySelector('.model-pricing');
            if (pricingElement) {
                // Extract just the text after "Pricing:"
                const rawPricingText = pricingElement.textContent;
                const pricingMatch = rawPricingText.match(/Pricing:\s*(.*)/);
                if (pricingMatch && pricingMatch[1]) {
                    pricingText = pricingMatch[1].trim();
                }
            }

            // Create a model object from the DOM data
            model = {
                id: modelId,
                name: name,
                provider: provider.replace(/^[\s\uFEFF\xA0\u200B]+|[\s\uFEFF\xA0\u200B]+$/g, ''), // Remove any icon characters
                description: description,
                strengths: strengths, // Add the strengths directly
                pricingText: pricingText, // Add the pricing text directly
                metrics: {
                    accuracy: metricValues[0] === 'N/A' ? null : parseFloat(metricValues[0]),
                    performance: metricValues[1] === 'N/A' ? null : parseFloat(metricValues[1]),
                    price: metricValues[2] === 'N/A' ? null : parseFloat(metricValues[2])
                }
            };

            // Try to extract capabilities from category tags
            const categoryTags = modelCard.querySelectorAll('.category-tag');
            if (categoryTags.length > 0) {
                model.capabilities = Array.from(categoryTags).map(tag => tag.textContent);
            }
            console.log('Model details from DOM:', model);
        }

        // If we couldn't get the model from the DOM, try the API
        if (!model) {
            try {
                model = await openRouterAPI.getModelDetails(modelId);
                console.log('Model details from API:', model);
            } catch (apiError) {
                console.error('Error fetching model details from API:', apiError);
                // If API fails, show an error
                modalContent.innerHTML = `
                    <div class="error">
                        <p>Sorry, we couldn't load the details for this model.</p>
                        <p>Error: ${apiError.message || 'Failed to fetch model details'}</p>
                        <button id="retry-details" class="submit-btn" style="margin-top: 20px;">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                `;

                // Add event listener for retry button
                setTimeout(() => {
                    const retryButton = document.getElementById('retry-details');
                    if (retryButton) {
                        retryButton.addEventListener('click', () => {
                            showModelDetails(modelId);
                        });
                    }
                }, 100);

                return;
            }
        }

        // If we still don't have a model, show an error
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

        // Update the modal banner with company name and model name
        const modalBanner = modal.querySelector('.modal-banner');
        if (modalBanner) {
            modalBanner.innerHTML = `
                <div class="banner-company">${providerIcon} ${model.provider || 'Unknown Provider'}</div>
                <div class="banner-model">${model.name || 'Unknown Model'}</div>
            `;
        }

        // Format capabilities as category tags
        const categoryTags = model.capabilities ? model.capabilities.map(capability =>
            `<span class="category-tag">${modelManager.categories[capability]?.name || capability}</span>`
        ).join('') : '';

        // If we got the model from the DOM, try to extract context length from the card
        if (!model.context_length && modelCard) {
            const memoryElement = modelCard.querySelector('.model-memory');
            if (memoryElement) {
                const memoryText = memoryElement.textContent;
                const match = memoryText.match(/Memory:\s*([\d,]+)\s*tokens/);
                if (match && match[1]) {
                    const contextLengthValue = parseInt(match[1].replace(/,/g, ''));
                    model.context_length = contextLengthValue;
                }
            }
        }

        // Format context length (memory) - now that we've potentially updated model.context_length
        const contextLength = model.context_length ?
            `<div class="model-context-length"><i class="fas fa-memory"></i> <strong>Memory:</strong> ${model.context_length.toLocaleString()} tokens</div>` :
            '';

        // Format pricing details - use the pricing text from the DOM if available
        let pricingDetails = '<div class="model-pricing-details"><i class="fas fa-dollar-sign"></i> <strong>Pricing Details:</strong>';

        if (model.pricingText) {
            // Use the pricing text we extracted from the DOM
            pricingDetails += `<div>${model.pricingText}</div>`;
        } else if (model.pricing) {
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

        // Format metrics - ensure we have metrics even if they're empty
        let metricsHTML = '';
        const metrics = model.metrics || {};

        // Log metrics data for debugging
        console.log(`Modal metrics for ${model.name}:`, metrics);

        // Get metric values with fallbacks
        const accuracy = metrics.accuracy || 0;
        const performance = metrics.performance || 0;
        const price = metrics.price || 0;

        // Always create the metrics HTML
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

        // Use the strengths we extracted from the DOM if available, otherwise calculate them
        const strengths = model.strengths || (model.name ? modelManager.getModelStrengths(model) : 'General AI assistance');

        // Populate modal content - ensure we have valid values for all fields
        modalContent.innerHTML = `
            <div class="model-details">
                <h2>${model.name || 'Unknown Model'}</h2>
                <div class="model-categories">${categoryTags || ''}</div>
                <div class="model-description">${model.description || 'No description available.'}</div>
                <div class="model-strengths"><i class="fas fa-check-circle"></i> <strong>Best for:</strong> ${strengths}</div>
                ${contextLength || ''}
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

        // Try to get basic model info from the ID for the banner
        let modelName = 'Unknown Model';
        let modelProvider = 'Unknown Provider';

        // Try to extract provider and model name from the ID
        if (modelId) {
            const parts = modelId.split('/');
            if (parts.length > 1) {
                modelProvider = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                modelName = parts[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
        }

        // Update the banner even in case of error
        const modalBanner = modal.querySelector('.modal-banner');
        if (modalBanner) {
            const providerIcon = getProviderIcon(modelProvider);
            modalBanner.innerHTML = `
                <div class="banner-company">${providerIcon} ${modelProvider}</div>
                <div class="banner-model">${modelName}</div>
            `;
        }

        // Show a more user-friendly error message with a retry button
        modalContent.innerHTML = `
            <div class="model-details">
                <h2>Error Loading Details</h2>
                <div class="error">
                    <p>Sorry, we couldn't load the details for this model.</p>
                    <p>Error: ${error.message || 'Unknown error'}</p>
                    <button id="retry-details" class="submit-btn" style="margin-top: 20px;">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>

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
            </div>
        `;

        // Add event listener for retry button
        setTimeout(() => {
            const retryButton = document.getElementById('retry-details');
            if (retryButton) {
                retryButton.addEventListener('click', () => {
                    showModelDetails(modelId);
                });
            }
        }, 100);
    }
}

// Refresh models from API
async function refreshModels() {
    console.log('Refreshing models from API...');
    try {
        // Show a subtle notification that refresh is happening
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = '<i class="fas fa-sync fa-spin"></i> Refreshing model data...';
        document.body.appendChild(notification);
        
        // Get the current active category
        const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
        
        // Reload models from API
        await modelManager.loadModels();
        
        // Get models for the current active category
        const models = modelManager.getModelsByCategory(activeCategory);
        
        // Update the display
        displayModels(models);
        
        // Update notification
        notification.innerHTML = '<i class="fas fa-check"></i> Model data refreshed!';
        notification.classList.add('success');
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        
    } catch (error) {
        console.error('Error refreshing models:', error);
        showError("Failed to refresh models. Using existing data.");
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
