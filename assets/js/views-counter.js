/**
 * Profile Views Counter - Secure Static Implementation
 * Anti-spam: Daily cooldown + session flag + rate limiting
 */
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        VIEWS_KEY: 'paoradox_views_count',
        LAST_VIEW_KEY: 'paoradox_last_view_time',
        SESSION_FLAG: 'paoradox_view_counted_session',
        COOLDOWN_HOURS: 24,
        MIN_INTERVAL_MS: 1000, // 1 second minimum between increments
        STORAGE_VERSION: '1.0'
    };

    // DOM elements
    let viewCountElement = null;
    let counterContainer = null;

    /**
     * Get current timestamp in milliseconds
     */
    function getNow() {
        return Date.now();
    }

    /**
     * Safely get item from localStorage with fallback
     */
    function getStorageItem(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? value : fallback;
        } catch (e) {
            // localStorage unavailable or quota exceeded
            console.warn('Views Counter: localStorage unavailable', e);
            return fallback;
        }
    }

    /**
     * Safely set item in localStorage
     */
    function setStorageItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.warn('Views Counter: Failed to save to localStorage', e);
            return false;
        }
    }

    /**
     * Get current view count (number)
     */
    function getViews() {
        const stored = getStorageItem(CONFIG.VIEWS_KEY, '0');
        const count = parseInt(stored, 10);
        return isNaN(count) ? 0 : count;
    }

    /**
     * Set view count (number)
     */
    function setViews(count) {
        if (count < 0) count = 0;
        setStorageItem(CONFIG.VIEWS_KEY, String(count));
    }

    /**
     * Check if enough time has passed since last view
     */
    function canIncrement() {
        const lastView = getStorageItem(CONFIG.LAST_VIEW_KEY, '0');
        const lastTime = parseInt(lastView, 10);
        const now = getNow();

        // Rate limiting: minimum interval check
        if (!isNaN(lastTime) && (now - lastTime) < CONFIG.MIN_INTERVAL_MS) {
            return false;
        }

        // Cooldown check: 24 hours
        const hoursSince = (now - lastTime) / (1000 * 60 * 60);
        return isNaN(lastTime) || hoursSince >= CONFIG.COOLDOWN_HOURS;
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
     * Increment view count if conditions met
     * Returns true if incremented, false otherwise
     */
    function incrementViews() {
        // Check session flag first (fastest)
        if (sessionCounted()) {
            return false;
        }

        // Check cooldown
        if (!canIncrement()) {
            return false;
        }

        // All checks passed - increment
        const currentViews = getViews();
        const newViews = currentViews + 1;

        setViews(newViews);
        setStorageItem(CONFIG.LAST_VIEW_KEY, String(getNow()));
        markSessionCounted();

        return true;
    }

    /**
     * Update the DOM with current count
     */
    function updateDisplay(count) {
        if (viewCountElement) {
            viewCountElement.textContent = count;
        }
    }

    /**
     * Trigger pulse animation on the counter
     */
    function triggerPulse() {
        if (counterContainer) {
            counterContainer.classList.remove('pulse');
            // Force reflow for animation restart
            void counterContainer.offsetWidth;
            counterContainer.classList.add('pulse');
        }
    }

    /**
     * Initialize the views counter
     */
    function initViewsCounter() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initViewsCounter);
            return;
        }

        // Find or create counter element
        let container = document.getElementById('viewsCounter');
        if (!container) {
            // Create the overlay if it doesn't exist
            container = document.createElement('div');
            container.id = 'viewsCounter';
            container.className = 'views-counter';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-label', 'Profile view counter');

            container.innerHTML = `
                <span class="terminal-prompt">$</span>
                <span class="views-label">views</span>
                <span id="viewCount">0</span>
                <span class="views-tooltip">unique views (24h cooldown)</span>
            `;

            document.body.appendChild(container);
        }

        // Cache DOM references
        counterContainer = container;
        viewCountElement = document.getElementById('viewCount');

        if (!viewCountElement) {
            console.warn('Views Counter: viewCount element not found');
            return;
        }

        // Get current count
        let currentCount = getViews();

        // Try to increment
        const didIncrement = incrementViews();

        if (didIncrement) {
            // Refresh count after increment
            currentCount = getViews();
            triggerPulse();
        }

        // Update display
        updateDisplay(currentCount);

        // Handle storage events from other tabs
        window.addEventListener('storage', function(e) {
            if (e.key === CONFIG.VIEWS_KEY) {
                const newCount = parseInt(e.newValue, 10);
                if (!isNaN(newCount)) {
                    updateDisplay(newCount);
                }
            }
        });

        // Handle page visibility change (user returns to tab)
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                // Only check if we haven't counted this session yet
                if (!sessionCounted() && canIncrement()) {
                    const didIncrementNow = incrementViews();
                    if (didIncrementNow) {
                        const updatedCount = getViews();
                        updateDisplay(updatedCount);
                        triggerPulse();
                    }
                }
            }
        });

        console.log(`Views Counter initialized: ${currentCount} views`);
    }

    // Start the counter
    initViewsCounter();

})();