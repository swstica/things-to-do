class DemoLocationActivityFinder {
    constructor() {
        this.currentSuggestions = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Demo button
        document.getElementById('demoBtn').addEventListener('click', () => {
            this.runDemo();
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.category);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.runDemo();
        });

        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.hideAllSections();
            this.showSection('location-section');
        });
    }

    async runDemo() {
        try {
            this.showSection('loadingSection');
            this.hideSection('locationSection');
            
            // Show location info
            document.getElementById('locationInfo').classList.remove('hidden');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Use demo coordinates for New York City
            const response = await fetch('/api/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: 40.7128,
                    longitude: -74.0060,
                    locationName: "New York City (Demo)"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.currentSuggestions = data.suggestions;
                this.displaySuggestions(data.suggestions);
                this.hideSection('loadingSection');
                this.showSection('resultsSection');
            } else {
                throw new Error(data.message || 'Failed to get suggestions');
            }

        } catch (error) {
            console.error('Error getting suggestions:', error);
            this.showError('Failed to get suggestions. Please try again.');
        }
    }

    displaySuggestions(suggestions) {
        // Display food suggestions
        this.renderCategory('foodResults', suggestions.food || [], 'food');
        
        // Display tourist suggestions
        this.renderCategory('touristResults', suggestions.tourist || [], 'tourist');
        
        // Display activities suggestions
        this.renderCategory('activitiesResults', suggestions.activities || [], 'activities');
    }

    renderCategory(containerId, items, category) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="result-card">
                    <h3>No suggestions available</h3>
                    <p class="description">We couldn't find any ${category} suggestions for your location at the moment.</p>
                </div>
            `;
            return;
        }

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <h3>${this.escapeHtml(item.name || 'Unknown')}</h3>
                <p class="description">${this.escapeHtml(item.description || 'No description available')}</p>
                <p class="reason">${this.escapeHtml(item.reason || '')}</p>
            `;
            container.appendChild(card);
        });
    }

    switchTab(category) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = category === 'food' ? 'foodTab' : 
                           category === 'tourist' ? 'touristTab' : 'activitiesTab';
        document.getElementById(targetPanel).classList.add('active');
    }

    showSection(sectionId) {
        document.getElementById(sectionId).classList.remove('hidden');
    }

    hideSection(sectionId) {
        document.getElementById(sectionId).classList.add('hidden');
    }

    hideAllSections() {
        ['loadingSection', 'resultsSection', 'errorSection'].forEach(id => {
            this.hideSection(id);
        });
    }

    showError(message) {
        this.hideAllSections();
        document.getElementById('errorMessage').textContent = message;
        this.showSection('errorSection');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the demo app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DemoLocationActivityFinder();
});

// Add some visual feedback for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add click animation to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add loading animation to cards when they appear
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    });

    // Observe result cards for animation
    setTimeout(() => {
        document.querySelectorAll('.result-card').forEach(card => {
            observer.observe(card);
        });
    }, 1000);
});