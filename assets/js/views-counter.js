/**
 * Profile Views Counter - Secure Implementation
 * Fetches global count from komarev.com/ghpvc, adds local +1 per viewer
 * Includes input validation, sanitization, and error handling
 */
(function() {
    'use strict';

    const CONFIG = {
        KOMAREV_URL: 'https://komarev.com/ghpvc/?username=paoradox',
        VIEWS_KEY: 'paoradox_views_count',
        OFFSET_KEY: 'paoradox_views_offset',
        LAST_VIEW_KEY: 'paoradox_last_view_time',
        COOLDOWN_HOURS: 24,
        SESSION_FLAG: 'paoradox_view_counted_session',
        MAX_VIEWS: 1000000000,
        MAX_OFFSET: 1000000
    };

    let viewCountElement = null;
    let viewsLabelElement = null;
    let counterContainer = null;

    function getNow() {
        return Date.now();
    }

    function getStorageItem(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? value : fallback;
        } catch (e) {
            console.warn('Views Counter: localStorage unavailable', e);
            return fallback;
        }
    }

    function setStorageItem(key, value) {
        try {
            localStorage.setItem(key, String(value));
            return true;
        } catch (e) {
            console.warn('Views Counter: Failed to save to localStorage', e);
            return false;
        }
    }

    /**
     * Validate a number is within acceptable bounds
     */
    function validateNumber(value, max, fallback) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0 || num > max) {
            return fallback;
        }
        return num;
    }

    /**
     * Get local offset with validation
     */
    function getLocalOffset() {
        const stored = getStorageItem(CONFIG.OFFSET_KEY, '0');
        return validateNumber(stored, CONFIG.MAX_OFFSET, 0);
    }

    /**
     * Set local offset with validation
     */
    function setLocalOffset(offset) {
        const validOffset = validateNumber(offset, CONFIG.MAX_OFFSET, 0);
        setStorageItem(CONFIG.OFFSET_KEY, validOffset);
    }

    /**
     * Get view count with validation
     */
    function getViews() {
        const stored = getStorageItem(CONFIG.VIEWS_KEY, '0');
        return validateNumber(stored, CONFIG.MAX_VIEWS, 0);
    }

    /**
     * Set view count with validation
     */
    function setViews(count) {
        const validCount = validateNumber(count, CONFIG.MAX_VIEWS, 0);
        setStorageItem(CONFIG.VIEWS_KEY, validCount);
    }

    /**
     * Check if this session already counted
     */
    function sessionCounted() {
        return getStorageItem(CONFIG.SESSION_FLAG, 'false') === 'true';
    }

    /**
     * Mark session as counted
     */
    function markSessionCounted() {
        setStorageItem(CONFIG.SESSION_FLAG, 'true');
    }

    /**
     * Check if 24h have passed since last increment
     */
    function canIncrement() {
        const lastView = getStorageItem(CONFIG.LAST_VIEW_KEY, '0');
        const lastTime = validateNumber(lastView, Date.now(), 0);
        const now = getNow();

        if (lastTime === 0) return true;

        const hoursSince = (now - lastTime) / (1000 * 60 * 60);
        return hoursSince >= CONFIG.COOLDOWN_HOURS;
    }

    /**
     * Try to increment local offset with validation
     */
    function tryIncrementOffset() {
        if (sessionCounted()) return false;
        if (!canIncrement()) return false;

        const currentOffset = getLocalOffset();
        if (currentOffset >= CONFIG.MAX_OFFSET) {
            console.warn('Views Counter: Maximum offset reached');
            return false;
        }
        
        setLocalOffset(currentOffset + 1);
        setStorageItem(CONFIG.LAST_VIEW_KEY, String(getNow()));
        markSessionCounted();
        return true;
    }

    /**
     * Fetch current global count from Komarev with validation
     */
    function fetchGlobalCount() {
        return fetch(CONFIG.KOMAREV_URL, {
            method: 'GET',
            headers: {
                'Accept': 'image/svg+xml,text/html'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(svgText => {
            // Validate response is SVG-like
            if (!svgText || (!svgText.includes('<svg') && !svgText.includes('<text'))) {
                console.warn('Views Counter: Invalid response from Komarev');
                return null;
            }

            // Parse and validate the number from SVG
            const match = svgText.match(/<text[^>]*>([\d,]+)<\/text>/);
            if (match) {
                const number = parseInt(match[1].replace(/,/g, ''), 10);
                return validateNumber(number, CONFIG.MAX_VIEWS, null);
            }

            // Fallback: try to find any number in the SVG
            const numberMatch = svgText.match(/(\d[\d,]*)/);
            if (numberMatch) {
                const number = parseInt(numberMatch[1].replace(/,/g, ''), 10);
                return validateNumber(number, CONFIG.MAX_VIEWS, null);
            }

            console.warn('Views Counter: No number found in Komarev response');
            return null;
        })
        .catch(error => {
            console.warn('Views Counter: Failed to fetch Komarev count:', error.message);
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
            } else {
                viewCountElement.textContent = count;
            }
        }
    }

    /**
     * Update the label - always shows "views"
     */
    function updateLabel() {
        if (viewsLabelElement) {
            viewsLabelElement.textContent = 'views';
        }
    }

    /**
     * Update the tooltip - always shows "Unique visits (24h cooldown)"
     */
    function updateTooltip() {
        const tooltip = document.querySelector('.views-tooltip');
        if (tooltip) {
            tooltip.textContent = 'Unique visits (24h cooldown)';
        }
    }

    /**
     * Trigger pulse animation on the counter
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

        let container = document.getElementById('viewsCounter');
        if (!container) {
            container = document.createElement('div');
            container.id = 'viewsCounter';
            container.className = 'views-counter';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-label', 'Profile view counter');

            container.innerHTML = `
                <span class="terminal-prompt">$</span>
                <span id="viewCount" class="terminal-counter-blink">0</span>
                <span class="views-label">views</span>
                <span class="views-tooltip">Unique visits (24h cooldown)</span>
            `;

            document.body.appendChild(container);
        }

        counterContainer = container;
        viewCountElement = document.getElementById('viewCount');
        viewsLabelElement = document.querySelector('.views-label');

        if (!viewCountElement) {
            console.warn('Views Counter: viewCount element not found');
            return;
        }

        // Show loading state
        updateDisplay('…');
        updateLabel();
        updateTooltip();

        // Try to increment local offset first
        const didIncrement = tryIncrementOffset();

        // Fetch global count from Komarev
        fetchGlobalCount().then(globalCount => {
            if (globalCount !== null) {
                // ✅ Komarev working - show global + local
                const offset = getLocalOffset();
                const totalCount = globalCount + offset;
                updateDisplay(totalCount);
            } else {
                // ❌ Komarev unreachable - show only local offset
                const offset = getLocalOffset();
                updateDisplay(offset || 0);
            }
            
            if (didIncrement) {
                triggerPulse();
            }
        });

        // Refresh count when user returns to tab
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                const canInc = !sessionCounted() && canIncrement();
                let didInc = false;
                if (canInc) {
                    didInc = tryIncrementOffset();
                }

                fetchGlobalCount().then(globalCount => {
                    if (globalCount !== null) {
                        const offset = getLocalOffset();
                        const totalCount = globalCount + offset;
                        updateDisplay(totalCount);
                    } else {
                        const offset = getLocalOffset();
                        updateDisplay(offset || 0);
                    }
                    
                    if (didInc) {
                        triggerPulse();
                    }
                });
            }
        });

        console.log('Views Counter: Initialized securely');
    }

    // Global error handler for the counter
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('Views Counter')) {
            console.warn('Views Counter: Caught error:', e.message);
        }
    });

    // Initialize
    initViewsCounter();

})();