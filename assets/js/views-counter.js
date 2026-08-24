/**
 * Profile Views Counter - LibreCounter Integration
 * Uses LibreCounter's SVG badge to display visitor count
 * Privacy-focused, cookie-free, and GDPR compliant
 */
(function() {
    'use strict';

    console.log('🔍 Views Counter: Starting with LibreCounter...');

    let viewCountElement = null;
    let viewsLabelElement = null;
    let retryAttempts = 0;
    const MAX_RETRIES = 10;

    // LibreCounter configuration
    const CONFIG = {
        // Your page URL - LibreCounter uses this as the unique identifier
        // ⚠️ Replace this with your actual GitHub Pages URL
        PAGE_URL: 'https://paoradox.github.io/',
        // The SVG badge URL
        BADGE_URL: 'https://librecounter.org/counter.svg',
        FALLBACK_KEY: 'paoradox_fallback_count'
    };

    /**
     * Fetch the SVG badge and extract the count
     */
    function fetchCount() {
        console.log('🌐 Fetching count from LibreCounter...');
        
        // Use fetch to get the SVG content
        return fetch(CONFIG.BADGE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'image/svg+xml'
            },
            // Important: Send the referrer so LibreCounter knows which page
            referrer: CONFIG.PAGE_URL,
            referrerPolicy: 'unsafe-url'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(svgText => {
            console.log(`📊 SVG received, parsing for count...`);
            
            // Parse the SVG to find the count
            // LibreCounter SVG typically has text elements with the count
            // Example: <text>123</text> or similar
            const match = svgText.match(/<text[^>]*>([\d,]+)<\/text>/);
            if (match) {
                const count = parseInt(match[1].replace(/,/g, ''), 10);
                if (!isNaN(count) && count >= 0) {
                    console.log(`📊 LibreCounter returned: ${count}`);
                    return count;
                }
            }
            
            // Fallback: look for any number in the SVG
            const numberMatch = svgText.match(/(\d[\d,]*)/);
            if (numberMatch) {
                const count = parseInt(numberMatch[1].replace(/,/g, ''), 10);
                if (!isNaN(count) && count >= 0) {
                    console.log(`📊 LibreCounter returned (fallback): ${count}`);
                    return count;
                }
            }
            
            throw new Error('Could not parse count from SVG');
        })
        .catch(error => {
            console.warn('⚠️ LibreCounter fetch failed:', error.message);
            return null;
        });
    }

    /**
     * Alternative: Use an image element to trigger the counter
     * This ensures the visit is counted even if the SVG parsing fails
     */
    function triggerVisitCounter() {
        console.log('📊 Triggering visit counter via image...');
        const img = document.createElement('img');
        img.src = CONFIG.BADGE_URL + '?ref=' + encodeURIComponent(CONFIG.PAGE_URL);
        img.style.display = 'none';
        img.setAttribute('referrerpolicy', 'unsafe-url');
        document.body.appendChild(img);
        
        // Remove the image after it loads (cleanup)
        img.onload = function() {
            setTimeout(() => {
                if (img.parentNode) {
                    img.parentNode.removeChild(img);
                }
            }, 1000);
        };
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
     * Update label and tooltip
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
     * Main function to fetch and update the count with retry logic
     */
    function updateCount() {
        console.log(`🔄 Attempting to fetch count (attempt ${retryAttempts + 1})...`);

        if (retryAttempts >= MAX_RETRIES) {
            console.warn('⚠️ Max retries reached, using fallback');
            const cached = localStorage.getItem(CONFIG.FALLBACK_KEY);
            if (cached) {
                const count = parseInt(cached, 10);
                if (!isNaN(count) && count >= 0) {
                    updateDisplay(count);
                } else {
                    updateDisplay('0');
                }
            } else {
                updateDisplay('0');
            }
            return;
        }

        fetchCount().then(count => {
            if (count !== null && count >= 0) {
                updateDisplay(count);
                localStorage.setItem(CONFIG.FALLBACK_KEY, String(count));
                if (retryAttempts === 0) {
                    triggerPulse();
                }
                console.log(`✅ Successfully loaded count: ${count}`);
            } else {
                retryAttempts++;
                console.log(`⏳ Retrying in 2000ms...`);
                setTimeout(updateCount, 2000);
            }
        });
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

        // Try cached count first
        const cachedCount = localStorage.getItem(CONFIG.FALLBACK_KEY);
        if (cachedCount) {
            const count = parseInt(cachedCount, 10);
            if (!isNaN(count) && count > 0) {
                console.log(`📦 Using cached count: ${count}`);
                updateDisplay(count);
            }
        }

        // Trigger the visit counter (so LibreCounter counts this visit)
        triggerVisitCounter();

        // Fetch the count from LibreCounter
        updateCount();

        // Refresh when user returns to tab
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                console.log('👁️ Tab visible, refreshing count...');
                retryAttempts = 0;
                // Trigger another visit counter
                triggerVisitCounter();
                updateCount();
            }
        });

        console.log('✅ Views Counter initialized with LibreCounter');
    }

    // Start the counter
    initViewsCounter();

})();