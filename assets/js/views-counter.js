/**
 * Profile Views Counter - Komarev Badge API + Local Offset
 * Fetches the SVG badge and extracts the view count
 */
(function() {
    'use strict';

    const CONFIG = {
        // Use the badge version (designed for embedding)
        KOMAREV_URL: 'https://komarev.com/ghpvc/?username=paoradox&label=Profile%20views&color=blueviolet&style=for-the-badge',
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

    function validateNumber(value, max, fallback) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0 || num > max) {
            return fallback;
        }
        return num;
    }

    function getLocalOffset() {
        const stored = getStorageItem(CONFIG.OFFSET_KEY, '0');
        return validateNumber(stored, CONFIG.MAX_OFFSET, 0);
    }

    function setLocalOffset(offset) {
        const validOffset = validateNumber(offset, CONFIG.MAX_OFFSET, 0);
        setStorageItem(CONFIG.OFFSET_KEY, validOffset);
    }

    function sessionCounted() {
        return getStorageItem(CONFIG.SESSION_FLAG, 'false') === 'true';
    }

    function markSessionCounted() {
        setStorageItem(CONFIG.SESSION_FLAG, 'true');
    }

    function canIncrement() {
        const lastView = getStorageItem(CONFIG.LAST_VIEW_KEY, '0');
        const lastTime = validateNumber(lastView, Date.now(), 0);
        const now = getNow();

        if (lastTime === 0) return true;

        const hoursSince = (now - lastTime) / (1000 * 60 * 60);
        return hoursSince >= CONFIG.COOLDOWN_HOURS;
    }

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
     * Fetch the SVG badge and extract the view count
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
            // Validate it's an SVG
            if (!svgText || !svgText.includes('<svg')) {
                console.warn('Views Counter: Invalid SVG response');
                return null;
            }

            // Parse the SVG to find the view count
            // The badge has multiple text elements; find the one with just the number
            // Pattern: <text ...>1,247</text> or similar
            const textMatches = svgText.match(/<text[^>]*>([^<]+)<\/text>/g);
            
            if (textMatches) {
                for (let match of textMatches) {
                    // Extract the text content
                    const content = match.replace(/<[^>]*>/g, '').trim();
                    // Remove commas and check if it's a number
                    const cleaned = content.replace(/,/g, '').trim();
                    if (/^\d+$/.test(cleaned)) {
                        const number = parseInt(cleaned, 10);
                        if (!isNaN(number) && number > 0) {
                            return validateNumber(number, CONFIG.MAX_VIEWS, null);
                        }
                    }
                }
            }

            // Fallback: look for any number in the SVG
            const numberMatch = svgText.match(/(\d[\d,]*)/);
            if (numberMatch) {
                const number = parseInt(numberMatch[1].replace(/,/g, ''), 10);
                if (!isNaN(number) && number > 0) {
                    return validateNumber(number, CONFIG.MAX_VIEWS, null);
                }
            }

            console.warn('Views Counter: No valid number found in SVG');
            return null;
        })
        .catch(error => {
            console.warn('Views Counter: Failed to fetch Komarev badge:', error.message);
            return null;
        });
    }

    function updateDisplay(count) {
        if (viewCountElement) {
            if (typeof count === 'number') {
                viewCountElement.textContent = count.toLocaleString();
            } else {
                viewCountElement.textContent = count;
            }
        }
    }

    function updateLabel() {
        if (viewsLabelElement) {
            viewsLabelElement.textContent = 'views';
        }
    }

    function updateTooltip() {
        const tooltip = document.querySelector('.views-tooltip');
        if (tooltip) {
            tooltip.textContent = 'Unique visits (24h cooldown)';
        }
    }

    function triggerPulse() {
        if (viewCountElement) {
            viewCountElement.classList.remove('terminal-counter-pulse');
            void viewCountElement.offsetWidth;
            viewCountElement.classList.add('terminal-counter-pulse');
        }
    }

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
                <span class="views-label">views</span>
                <span id="viewCount" class="terminal-counter-blink">0</span>
                <span class="views-tooltip">Unique visits (24h cooldown)</span>
            `;

            document.body.appendChild(container);
        }

        viewCountElement = document.getElementById('viewCount');
        viewsLabelElement = document.querySelector('.views-label');

        if (!viewCountElement) {
            console.warn('Views Counter: viewCount element not found');
            return;
        }

        updateDisplay('…');
        updateLabel();
        updateTooltip();

        const didIncrement = tryIncrementOffset();

        fetchGlobalCount().then(globalCount => {
            if (globalCount !== null) {
                const offset = getLocalOffset();
                const totalCount = globalCount + offset;
                updateDisplay(totalCount);
                console.log(`Views Counter: Global ${globalCount} + Local ${offset} = ${totalCount}`);
            } else {
                const offset = getLocalOffset();
                updateDisplay(offset || 0);
                console.log(`Views Counter: Using local-only mode (${offset} views)`);
            }
            
            if (didIncrement) {
                triggerPulse();
            }
        });

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

        console.log('Views Counter: Initialized with Komarev badge API');
    }

    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('Views Counter')) {
            console.warn('Views Counter: Caught error:', e.message);
        }
    });

    initViewsCounter();

})();