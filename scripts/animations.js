// Enhanced Animations and Interactive Features for What AI Model App

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations and interactive features
    initDarkModeToggle();
    initParticleAnimation();
    initModelCardAnimations();
    initRecommendationConfetti();
    initGlowEffects();
    initHoverEffects();
    initScrollAnimations();
    initButtonEffects();
    init3DCardEffects();
    initModalParticles();
});

// Enhanced Dark Mode Toggle with Animation
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const icon = darkModeToggle.querySelector('i');
    
    // Check for saved user preference, default to dark mode if not set
    const darkModePreference = localStorage.getItem('darkMode');
    const useDarkMode = darkModePreference === null ? true : darkModePreference === 'true';
    
    // Apply preference (dark mode is default)
    if (useDarkMode) {
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Toggle dark mode on click with enhanced animation
    darkModeToggle.addEventListener('click', () => {
        // Add transition effect to body
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        
        // Toggle dark mode class
        document.body.classList.toggle('dark-mode');
        
        // Update icon with rotation animation
        if (document.body.classList.contains('dark-mode')) {
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                icon.style.transform = '';
            }, 200);
            localStorage.setItem('darkMode', 'true');
        } else {
            icon.style.transform = 'rotate(-360deg)';
            setTimeout(() => {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                icon.style.transform = '';
            }, 200);
            localStorage.setItem('darkMode', 'false');
        }
        
        // Add flash effect to indicate mode change
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = document.body.classList.contains('dark-mode') ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        flash.style.opacity = '0';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(flash);
        
        // Trigger flash effect
        setTimeout(() => {
            flash.style.opacity = '1';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(flash);
                }, 500);
            }, 100);
        }, 0);
        
        // Remove transition after animation completes
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    });
    
    // Add hover animation
    darkModeToggle.addEventListener('mouseover', () => {
        darkModeToggle.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    darkModeToggle.addEventListener('mouseout', () => {
        darkModeToggle.style.transform = '';
    });
}

// Enhanced Floating Particles Animation in Header
function initParticleAnimation() {
    const headerContent = document.querySelector('.header-content');
    
    // Clear existing particles
    const existingParticles = document.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());
    
    // Create particles container if it doesn't exist
    let particlesContainer = document.querySelector('.header-particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'header-particles';
        particlesContainer.style.position = 'absolute';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.overflow = 'hidden'; // Add overflow:hidden to contain particles
        particlesContainer.style.pointerEvents = 'none';
        headerContent.appendChild(particlesContainer);
    }
    
    // Create more particles for a richer effect
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Set random size - reduced to prevent cutoff at edges
        const size = Math.floor(Math.random() * 30) + 5; // 5-35px (smaller than before)
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Set random position - keep particles away from edges to prevent cutoff
        const posX = Math.floor(Math.random() * 80) + 10; // 10-90% (avoid edges)
        const posY = Math.floor(Math.random() * 60) + 20; // 20-80% (avoid top/bottom edges)
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Set random opacity
        const opacity = Math.random() * 0.5 + 0.1; // 0.1-0.6
        particle.style.opacity = opacity;
        
        // Set random animation duration - reduced to prevent particles from moving too far
        const duration = Math.floor(Math.random() * 10) + 5; // 5-15s
        
        // Set random animation delay
        const delay = Math.floor(Math.random() * 3);
        
        // Set random background
        const colors = [
            'var(--color-primary)', 
            'var(--color-secondary)', 
            'var(--color-accent)',
            'var(--color-info)',
            'var(--color-success)'
        ];
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        // Set random shape
        const shapes = ['circle', 'square', 'triangle', 'diamond'];
        const shapeIndex = Math.floor(Math.random() * shapes.length);
        
        if (shapes[shapeIndex] === 'circle') {
            particle.style.borderRadius = '50%';
        } else if (shapes[shapeIndex] === 'square') {
            particle.style.borderRadius = '10%';
        } else if (shapes[shapeIndex] === 'triangle') {
            particle.style.width = '0';
            particle.style.height = '0';
            particle.style.backgroundColor = 'transparent';
            particle.style.borderLeft = `${size/2}px solid transparent`;
            particle.style.borderRight = `${size/2}px solid transparent`;
            particle.style.borderBottom = `${size}px solid ${colors[colorIndex]}`;
        } else if (shapes[shapeIndex] === 'diamond') {
            particle.style.transform = 'rotate(45deg)';
            particle.style.borderRadius = '10%';
        }
        
        // Apply styles
        particle.style.backgroundColor = shapes[shapeIndex] === 'triangle' ? 'transparent' : colors[colorIndex];
        particle.style.animation = `float ${duration}s infinite ease-in-out ${delay}s`;
        
        // Add to container
        particlesContainer.appendChild(particle);
    }
}

// Enhanced Model Card Animations
function initModelCardAnimations() {
    // Add animation order to model cards when they are created
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('model-card')) {
                        // Find the index of this card among siblings
                        const cards = Array.from(node.parentElement.children);
                        const index = cards.indexOf(node);
                        node.style.setProperty('--animation-order', index);
                        
                        // Add entrance animation
                        node.style.opacity = '0';
                        node.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            node.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                            node.style.opacity = '1';
                            node.style.transform = 'translateY(0)';
                        }, 100 + (index * 100));
                    }
                });
            }
        });
    });
    
    // Start observing the models container
    const modelsContainer = document.getElementById('models-container');
    if (modelsContainer) {
        observer.observe(modelsContainer, { childList: true });
    }
    
    // Also observe the recommendations container
    const recommendedModels = document.getElementById('recommended-models');
    if (recommendedModels) {
        observer.observe(recommendedModels, { childList: true });
    }
}

// Enhanced Confetti Animation for Recommendations
function initRecommendationConfetti() {
    const recommendationForm = document.getElementById('recommendation-form');
    const recommendationsResult = document.getElementById('recommendations-result');
    
    if (recommendationForm && recommendationsResult) {
        recommendationForm.addEventListener('submit', (event) => {
            // The actual form submission is handled in main.js
            // We just want to add the confetti effect when recommendations are shown
            
            // Wait a bit for the recommendations to be displayed
            setTimeout(() => {
                if (!recommendationsResult.classList.contains('hidden')) {
                    createEnhancedConfetti();
                }
            }, 300);
        });
    }
}

// Create multiple quick firework-style confetti animations
function createEnhancedConfetti() {
    const container = document.getElementById('recommendation');
    
    // Orange theme colors only
    const colors = [
        '#FF8200', // Brand orange
        '#FFA300', // Bright yellow/orange
        '#FF5A00', // Bright orange/red
        '#FFCC00', // Light orange/yellow
        '#FF9E45'  // Soft orange
    ];
    
    // Create multiple fireworks with slight delays between them
    createFirework(container, colors, 45, 55, 0); // First firework - left side
    createFirework(container, colors, 55, 45, 150); // Second firework - right side
    createFirework(container, colors, 50, 60, 300); // Third firework - center bottom
    
    // Add a celebratory sound effect
    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
    try {
        audio.play().catch(e => console.log('Audio play prevented by browser policy'));
    } catch (e) {
        console.log('Audio play error:', e);
    }
}

// Create a single firework explosion
function createFirework(container, colors, posX, posY, delay) {
    setTimeout(() => {
        // Get the confetti container
        const confettiContainer = container.querySelector('.confetti-container');
        
        // Add a bright flash at the explosion point
        const explosionFlash = document.createElement('div');
        explosionFlash.style.position = 'absolute';
        explosionFlash.style.left = `${posX}%`;
        explosionFlash.style.top = `${posY}%`;
        explosionFlash.style.width = '40px'; // Smaller flash
        explosionFlash.style.height = '40px'; // Smaller flash
        explosionFlash.style.borderRadius = '50%';
        explosionFlash.style.backgroundColor = '#FFCC00';
        explosionFlash.style.boxShadow = '0 0 20px 10px rgba(255, 130, 0, 0.8)';
        explosionFlash.style.transform = 'translate(-50%, -50%) scale(0.1)';
        explosionFlash.style.opacity = '0';
        explosionFlash.style.zIndex = '1';
        confettiContainer.appendChild(explosionFlash);
        
        // Animate the explosion flash - faster animation
        const flashKeyframes = `
            @keyframes explosion-flash-${posX}-${posY} {
                0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; }
                20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
            }
        `;
        const flashStyle = document.createElement('style');
        flashStyle.textContent = flashKeyframes;
        document.head.appendChild(flashStyle);
        
        explosionFlash.style.animation = `explosion-flash-${posX}-${posY} 0.4s forwards cubic-bezier(0.22, 0.68, 0.6, 1.0)`;
        
        // Remove flash after animation completes
        setTimeout(() => {
            explosionFlash.remove();
            flashStyle.remove();
        }, 400);
        
        // Create confetti pieces for the firework - fewer particles
        const confettiCount = 40; // Reduced from 100 to 40
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // All confetti starts from the same central point
            confetti.style.left = `${posX}%`;
            confetti.style.top = `${posY}%`;
            
            // Smaller size for particles
            const size = Math.random() * 6 + 2; // 2-8px (reduced from 5-17px)
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random color from orange palette
            const colorIndex = Math.floor(Math.random() * colors.length);
            confetti.style.backgroundColor = colors[colorIndex];
            
            // Add smaller glow effect
            confetti.style.boxShadow = `0 0 3px 1px ${colors[colorIndex]}80`;
            
            // Random shape - more circles for smaller particles
            const shapes = ['circle', 'circle', 'circle', 'square', 'diamond', 'star'];
            const shapeIndex = Math.floor(Math.random() * shapes.length);
            
            if (shapes[shapeIndex] === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shapes[shapeIndex] === 'square') {
                confetti.style.borderRadius = '2px';
            } else if (shapes[shapeIndex] === 'diamond') {
                confetti.style.transform = 'rotate(45deg)';
            } else if (shapes[shapeIndex] === 'star') {
                confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                confetti.style.backgroundColor = colors[colorIndex];
            }
            
            // Full opacity for better visibility
            confetti.style.opacity = '1.0';
            
            // Much shorter animation duration
            const duration = Math.random() * 0.6 + 0.4; // 0.4-1.0s (reduced from 0.8-2.3s)
            
            // Minimal delay between particles
            const particleDelay = Math.random() * 0.1; // 0-0.1s delay (reduced from 0-0.2s)
            
            // Add to confetti container
            confettiContainer.appendChild(confetti);
            
            // Create explosion animation - particles fly outward in all directions
            // Shorter distance for quicker disappearance
            const angle = Math.random() * 360; // Random angle for explosion direction
            const distance = 30 + Math.random() * 120; // 30-150px (reduced from 50-300px)
            
            // Calculate movement based on angle
            const xMovement = distance * Math.cos(angle * Math.PI / 180);
            const yMovement = distance * Math.sin(angle * Math.PI / 180);
            
            // Create keyframes for firework explosion - faster animation
            const keyframes = `
                @keyframes firework-particle-${posX}-${posY}-${i} {
                    0% {
                        transform: translate(-50%, -50%) scale(0.3);
                        opacity: 0;
                    }
                    10% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    30% {
                        transform: translate(calc(-50% + ${xMovement * 0.3}px), calc(-50% + ${yMovement * 0.3}px)) rotate(${Math.random() * 180}deg) scale(0.8);
                        opacity: 0.9;
                    }
                    100% {
                        transform: translate(calc(-50% + ${xMovement}px), calc(-50% + ${yMovement}px)) rotate(${Math.random() * 360}deg) scale(0.1);
                        opacity: 0;
                    }
                }
            `;
            
            // Add the keyframes to the document
            const styleElement = document.createElement('style');
            styleElement.textContent = keyframes;
            document.head.appendChild(styleElement);
            
            // Apply the animation
            confetti.style.animation = `firework-particle-${posX}-${posY}-${i} ${duration}s forwards cubic-bezier(0.22, 0.68, 0.6, 1.0) ${particleDelay}s`;
            
            // Remove after animation completes
            setTimeout(() => {
                confetti.remove();
                styleElement.remove();
            }, (duration + particleDelay) * 1000);
        }
        
        // Add a brief flash effect for this firework
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'rgba(255, 130, 0, 0.1)'; // Lighter flash
        flash.style.opacity = '0';
        flash.style.zIndex = '0';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.2s ease'; // Faster transition
        confettiContainer.appendChild(flash);
        
        // Trigger flash effect - quicker flash
        setTimeout(() => {
            flash.style.opacity = '1';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    flash.remove();
                }, 200);
            }, 50);
        }, 0);
    }, delay);
}


// Enhanced Glow Effects on Hover
function initGlowEffects() {
    document.addEventListener('mousemove', (e) => {
        const glowElements = document.querySelectorAll('.glow-on-hover');
        
        glowElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
            // Check if mouse is over or near the element
            const isNear = 
                e.clientX >= rect.left - 100 && 
                e.clientX <= rect.right + 100 && 
                e.clientY >= rect.top - 100 && 
                e.clientY <= rect.bottom + 100;
            
            if (isNear) {
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                // Calculate distance from center for intensity
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
                const intensity = 1 - Math.min(distance / maxDistance, 1);
                
                // Apply glow effect
                element.style.setProperty('--glow-x', `${x}px`);
                element.style.setProperty('--glow-y', `${y}px`);
                element.style.setProperty('--glow-intensity', intensity.toFixed(2));
                element.classList.add('glowing');
            } else {
                element.classList.remove('glowing');
            }
        });
    });
    
    // Add CSS for glow effect
    const style = document.createElement('style');
    style.textContent = `
        .glow-on-hover {
            position: relative;
            overflow: hidden;
        }
        
        .glow-on-hover.glowing::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at var(--glow-x) var(--glow-y),
                rgba(255, 255, 255, calc(0.8 * var(--glow-intensity))),
                transparent 50%
            );
            opacity: var(--glow-intensity);
            pointer-events: none;
            mix-blend-mode: overlay;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced Hover Effects for Cards and Buttons
function initHoverEffects() {
    // Individual card hover effects are now handled by CSS
    // No JavaScript hover effects for model cards to avoid blurring others
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = '';
        });
    });
}

// Add scroll animations
function initScrollAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('section, .model-card, h2, .form-group');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Check if element is in viewport
            if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
                element.classList.add('in-view');
            }
        });
    };
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        section, .model-card, h2, .form-group {
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        section:not(.in-view), 
        .model-card:not(.in-view),
        h2:not(.in-view),
        .form-group:not(.in-view) {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .in-view {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// Add button click effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Position the ripple
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 3D card effects disabled
function init3DCardEffects() {
    // 3D effects removed to prevent unwanted hover effects
}

// Add animated particles to the modal
function initModalParticles() {
    // Create modal particles when the modal is shown
    const modal = document.getElementById('model-details-modal');
    
    if (!modal) return;
    
    // Create particles container if it doesn't exist
    let particlesContainer = document.querySelector('.modal-particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'modal-particles';
        modal.querySelector('.modal-content').prepend(particlesContainer);
    }
    
    // Listen for modal visibility changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (!modal.classList.contains('hidden')) {
                    // Modal is visible, create particles
                    createModalParticles(particlesContainer);
                } else {
                    // Modal is hidden, clear particles
                    particlesContainer.innerHTML = '';
                }
            }
        });
    });
    
    // Start observing the modal
    observer.observe(modal, { attributes: true });
    
    // Add keyframes for modal particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-modal {
            0% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(2deg); }
            50% { transform: translateY(-8px) rotate(5deg); }
            75% { transform: translateY(-5px) rotate(2deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }
    `;
    document.head.appendChild(style);
}

// Create particles for the modal header
function createModalParticles(container) {
    // Clear existing particles
    container.innerHTML = '';
    
    // Create particles
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'modal-particle';
        
        // Set random size
        const size = Math.floor(Math.random() * 20) + 5; // 5-25px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Set random position
        const posX = Math.floor(Math.random() * 90) + 5; // 5-95%
        const posY = Math.floor(Math.random() * 80) + 10; // 10-90%
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Set random opacity
        const opacity = Math.random() * 0.5 + 0.1; // 0.1-0.6
        particle.style.opacity = opacity;
        
        // Set random animation duration
        const duration = Math.floor(Math.random() * 8) + 4; // 4-12s
        
        // Set random animation delay
        const delay = Math.floor(Math.random() * 2);
        
        // Set random shape
        const shapes = ['circle', 'square', 'triangle'];
        const shapeIndex = Math.floor(Math.random() * shapes.length);
        
        if (shapes[shapeIndex] === 'circle') {
            particle.style.borderRadius = '50%';
        } else if (shapes[shapeIndex] === 'square') {
            particle.style.borderRadius = '10%';
        } else if (shapes[shapeIndex] === 'triangle') {
            particle.style.width = '0';
            particle.style.height = '0';
            particle.style.backgroundColor = 'transparent';
            particle.style.borderLeft = `${size/2}px solid transparent`;
            particle.style.borderRight = `${size/2}px solid transparent`;
            particle.style.borderBottom = `${size}px solid rgba(255, 255, 255, 0.4)`;
        }
        
        // Apply styles
        if (shapes[shapeIndex] !== 'triangle') {
            particle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        }
        particle.style.animation = `float-modal ${duration}s infinite ease-in-out ${delay}s`;
        
        // Add to container
        container.appendChild(particle);
    }
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Smooth scroll with easing
            const startPosition = window.pageYOffset;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;
            
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const easeInOutCubic = progress => {
                    return progress < 0.5
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                };
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic(Math.min(progress / duration, 1)));
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }
            
            window.requestAnimationFrame(step);
        }
    });
});
