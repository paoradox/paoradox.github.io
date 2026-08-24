/**
 * Profile Views Counter - LibreCounter (Image-Based)
 * Uses an <img> tag to load the SVG badge and extract the count
 * This avoids CORS issues since images are not subject to CORS
 */
(function() {
    'use strict';

    console.log('🔍 Views Counter: Starting with LibreCounter (Image-based)...');

    let viewCountElement = null;
    let viewsLabelElement = null;
    let retryAttempts = 0;
    const MAX_RETRIES = 5;

    const CONFIG = {
        PAGE_URL: 'https://paoradox.github.io/',
        BADGE_URL: 'https://librecounter.org/counter.svg',
        FALLBACK_KEY: 'paoradox_fallback_count'
    };

    /**
     * Trigger a visit counter using an image
     * This ensures the visit is counted
     */
    function triggerVisitCounter() {
        console.log('📊 Triggering visit counter via image...');
        const img = document.createElement('img');
        img.src = CONFIG.BADGE_URL + '?ref=' + encodeURIComponent(CONFIG.PAGE_URL);
        img.style.display = 'none';
        img.setAttribute('referrerpolicy', 'unsafe-url');
        document.body.appendChild(img);
        
        // Remove after load
        setTimeout(() => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        }, 2000);
    }

    /**
     * Alternative: Use a CORS proxy to fetch the SVG as text
     * Try multiple proxies in case one fails
     */
    function fetchCountViaProxy() {
        console.log('🌐 Fetching count via CORS proxy...');
        
        const url = CONFIG.BADGE_URL + '?ref=' + encodeURIComponent(CONFIG.PAGE_URL);
        
        // Try different proxies
        const proxies = [
            'https://corsproxy.io/?url=' + encodeURIComponent(url),
            'https://thingproxy.freeboard.io/fetch/' + encodeURIComponent(url)
        ];
        
        // Try the first proxy
        return fetch(proxies[0])
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.text();
            })
            .then(svgText => {
                console.log('📊 SVG received via proxy, parsing for count...');
                return parseSVGForCount(svgText);
            })
            .catch(error => {
                console.warn('⚠️ First proxy failed:', error.message);
                // Try the second proxy
                console.log('🔄 Trying second proxy...');
                return fetch(proxies[1])
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(svgText => {
                        console.log('📊 SVG received via second proxy, parsing for count...');
                        return parseSVGForCount(svgText);
                    })
                    .catch(error2 => {
                        console.warn('⚠️ All proxies failed:', error2.message);
                        return null;
                    });
            });
    }

    /**
     * Parse SVG text to extract the count
     */
    function parseSVGForCount(svgText) {
        // Look for text elements with numbers
        const match = svgText.match(/<text[^>]*>([\d,]+)<\/text>/);
        if (match) {
            const count = parseInt(match[1].replace(/,/g, ''), 10);
            if (!isNaN(count) && count >= 0) {
                console.log(`📊 Parsed count: ${count}`);
                return count;
            }
        }
        
        // Fallback: look for any number in the SVG
        const numberMatch = svgText.match(/(\d[\d,]*)/);
        if (numberMatch) {
            const count = parseInt(numberMatch[1].replace(/,/g, ''), 10);
            if (!isNaN(count) && count >= 0) {
                console.log(`📊 Parsed count (fallback): ${count}`);
                return count;
            }
        }
        
        return null;
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
            console.warn('⚠️ Max retries reached, using cached fallback');
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

        fetchCountViaProxy().then(count => {
            if (count !== null && count >= 0) {
                updateDisplay(count);
                localStorage.setItem(CONFIG.FALLBACK_KEY, String(count));
                if (retryAttempts === 0) {
                    triggerPulse();
                }
                console.log(`✅ Successfully loaded count: ${count}`);
            } else {
                retryAttempts++;
                console.log(`⏳ Retrying in 3000ms...`);
                setTimeout(updateCount, 3000);
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

        viewCountElement.classList.add('terminal-counter-blink');

        updateDisplay('…');
        updateLabel();

        // Try cached count first (for immediate display)
        const cachedCount = localStorage.getItem(CONFIG.FALLBACK_KEY);
        if (cachedCount) {
            const count = parseInt(cachedCount, 10);
            if (!isNaN(count) && count > 0) {
                console.log(`📦 Using cached count: ${count}`);
                updateDisplay(count);
            }
        }

        // Trigger the visit counter (counts this visit)
        triggerVisitCounter();

        // Try to fetch fresh count (will update if successful)
        setTimeout(() => {
            updateCount();
        }, 1000);

        // Refresh when user returns to tab
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                console.log('👁️ Tab visible, refreshing count...');
                retryAttempts = 0;
                triggerVisitCounter();
                updateCount();
            }
        });

        console.log('✅ Views Counter initialized with LibreCounter');
    }

    initViewsCounter();

})();