/**
 * Profile Views Counter - CountAPI Integration
 * Simple, free, and reliable visitor counter
 */
(function() {
    'use strict';

    console.log('🔍 Views Counter: Starting with CountAPI...');

    let viewCountElement = null;
    let viewsLabelElement = null;

    const CONFIG = {
        // CountAPI endpoint - free, no CORS issues
        COUNT_API_URL: 'https://api.countapi.xyz/hit/paoradox/portfolio',
        FALLBACK_KEY: 'paoradox_fallback_count'
    };

    /**
     * Fetch the count from CountAPI
     */
    function fetchCount() {
        console.log('🌐 Fetching count from CountAPI...');
        
        return fetch(CONFIG.COUNT_API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && typeof data.value === 'number') {
                console.log(`📊 CountAPI returned: ${data.value}`);
                return data.value;
            }
            throw new Error('Invalid response from CountAPI');
        })
        .catch(error => {
            console.warn('⚠️ CountAPI fetch failed:', error.message);
            return null;
        });
    }

    /**
     * Update the display with the count
     */
    function updateDisplay(count) {
        if (viewCountElement) {
            if (typeof count === 'number') {
                viewCountElement.textContent = count.toLocaleString();
                console.log(`🖥️ Display updated: ${count.toLocaleString()}`);
            } else {
                viewCountElement.textContent = count;
                console.log(`🖥️ Display updated: ${count}`);
            }
        }
    }

    /**
     * Update label
     */
    function updateLabel() {
        if (viewsLabelElement) {
            viewsLabelElement.textContent = 'views';
        }
        const tooltip = document.querySelector('.views-tooltip');
        if (tooltip) {
            tooltip.textContent = 'Unique visits (24h cooldown)';
        }
    }

    /**
     * Trigger pulse animation
     */
    function triggerPulse() {
        if (viewCountElement) {
            viewCountElement.classList.remove('terminal-counter-pulse');
            void viewCountElement.offsetWidth;
            viewCountElement.classList.add('terminal-counter-pulse');
        }
    }

    /**
     * Initialize the views counter
     */
    function initViewsCounter() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initViewsCounter);
            return;
        }

        console.log('📄 Document ready, creating counter...');

        let container = document.getElementById('viewsCounter');
        if (!container) {
            console.log('📄 Creating new counter container');
            container = document.createElement('div');
            container.id = 'viewsCounter';
            container.className = 'views-counter';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-label', 'Profile view counter');

            container.innerHTML = `
                <span class="terminal-prompt">$</span>
                <span class="views-label">views</span>
                <span id="viewCount" class="terminal-counter-blink">0</span>
                <span class="views-tooltip">Unique visits (24h cooldown)</span>
            `;

            document.body.appendChild(container);
        }

        viewCountElement = document.getElementById('viewCount');
        viewsLabelElement = document.querySelector('.views-label');

        if (!viewCountElement) {
            console.warn('❌ viewCount element not found');
            return;
        }

        // Ensure blinking class is applied
        viewCountElement.classList.add('terminal-counter-blink');

        // Show loading state
        updateDisplay('…');
        updateLabel();

        // Try to get count from localStorage first (for speed)
        const cachedCount = localStorage.getItem(CONFIG.FALLBACK_KEY);
        if (cachedCount) {
            const count = parseInt(cachedCount, 10);
            if (!isNaN(count) && count > 0) {
                console.log(`📦 Using cached count: ${count}`);
                updateDisplay(count);
            }
        }

        // Fetch from CountAPI
        fetchCount().then(count => {
            if (count !== null && count >= 0) {
                updateDisplay(count);
                // Store in localStorage as fallback
                localStorage.setItem(CONFIG.FALLBACK_KEY, String(count));
                triggerPulse();
                console.log(`✅ Successfully loaded count: ${count}`);
            } else {
                // If fetch fails, use cached or show 0
                const cached = localStorage.getItem(CONFIG.FALLBACK_KEY);
                if (cached) {
                    const cachedCount = parseInt(cached, 10);
                    if (!isNaN(cachedCount) && cachedCount >= 0) {
                        updateDisplay(cachedCount);
                        console.log(`📦 Using cached fallback: ${cachedCount}`);
                    } else {
                        updateDisplay('0');
                    }
                } else {
                    updateDisplay('0');
                }
                console.warn('⚠️ Using fallback count');
            }
        });

        // Refresh when user returns to tab
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                console.log('👁️ Tab visible, refreshing count...');
                fetchCount().then(count => {
                    if (count !== null && count >= 0) {
                        updateDisplay(count);
                        localStorage.setItem(CONFIG.FALLBACK_KEY, String(count));
                    }
                });
            }
        });

        console.log('✅ Views Counter initialized with CountAPI');
    }

    // Start the counter
    initViewsCounter();

})();