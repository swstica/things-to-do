class LocationActivityFinder {
    constructor() {
        this.currentLocation = null;
        this.currentSuggestions = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Get location button
        document.getElementById('getLocationBtn').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.category);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            if (this.currentLocation) {
                this.getSuggestions(this.currentLocation.latitude, this.currentLocation.longitude);
            }
        });

        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.hideAllSections();
            this.showSection('location-section');
        });
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showSection('loadingSection');
        this.hideSection('location-section');

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                this.updateLocationDisplay();
                this.getSuggestions(this.currentLocation.latitude, this.currentLocation.longitude);
            },
            (error) => {
                let errorMessage = 'Unable to get your location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                this.showError(errorMessage);
            },
            options
        );
    }

    async getSuggestions(latitude, longitude) {
        try {
            this.showSection('loadingSection');
            this.hideSection('resultsSection');

            // Get location name using reverse geocoding (optional)
            let locationName = '';
            try {
                locationName = await this.getLocationName(latitude, longitude);
            } catch (e) {
                console.log('Could not get location name:', e);
            }

            const response = await fetch('/api/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude,
                    longitude,
                    locationName
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
            this.showError('Failed to get suggestions. Please check your internet connection and try again.');
        }
    }

    async getLocationName(latitude, longitude) {
        // Using a simple reverse geocoding approach
        // In a production app, you might want to use a proper geocoding service
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
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

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
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

    updateLocationDisplay() {
        const locationInfo = document.getElementById('locationInfo');
        const locationText = document.getElementById('locationText');
        
        if (this.currentLocation) {
            locationText.textContent = `Location: ${this.currentLocation.latitude.toFixed(4)}, ${this.currentLocation.longitude.toFixed(4)}`;
            locationInfo.classList.remove('hidden');
        }
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

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LocationActivityFinder();
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