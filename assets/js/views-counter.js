/**
 * Profile Views Counter - OpenCounterAPI Integration
 * Works alongside OpenCounterAPI script to display visitor counts
 */
(function() {
    'use strict';

    console.log('🔍 Views Counter: Starting with OpenCounterAPI...');

    let viewCountElement = null;
    let viewsLabelElement = null;
    let openCounterReady = false;
    let retryAttempts = 0;
    const MAX_RETRIES = 20;

    /**
     * Try to get the count from OpenCounterAPI's data-placeholder elements
     */
    function getCountFromOpenCounter() {
        // OpenCounterAPI stores data in elements with data-placeholder
        // We'll use the "now" (current visitors) as our primary count
        const nowElement = document.querySelector('[data-placeholder="now"]');
        if (nowElement) {
            const value = parseInt(nowElement.textContent, 10);
            if (!isNaN(value) && value >= 0) {
                console.log(`📊 OpenCounterAPI 'now' value: ${value}`);
                return value;
            }
        }

        // Fallback: try "24h" (today's visitors)
        const todayElement = document.querySelector('[data-placeholder="24h"]');
        if (todayElement) {
            const value = parseInt(todayElement.textContent, 10);
            if (!isNaN(value) && value >= 0) {
                console.log(`📊 OpenCounterAPI '24h' value: ${value}`);
                return value;
            }
        }

        // Fallback: try "month" (monthly visitors)
        const monthElement = document.querySelector('[data-placeholder="month"]');
        if (monthElement) {
            const value = parseInt(monthElement.textContent, 10);
            if (!isNaN(value) && value >= 0) {
                console.log(`📊 OpenCounterAPI 'month' value: ${value}`);
                return value;
            }
        }

        return null;
    }

    /**
     * Check if OpenCounterAPI is loaded and has data
     */
    function isOpenCounterReady() {
        // Check if the script has been loaded and has populated the placeholders
        const nowElement = document.querySelector('[data-placeholder="now"]');
        if (nowElement) {
            const value = parseInt(nowElement.textContent, 10);
            if (!isNaN(value) && value > 0) {
                return true;
            }
        }
        return false;
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
            tooltip.textContent = 'Live visitor count';
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
     * Main function to fetch and update the count
     */
    function updateCount() {
        console.log(`🔄 Attempting to fetch count (attempt ${retryAttempts + 1})...`);

        if (!isOpenCounterReady()) {
            if (retryAttempts < MAX_RETRIES) {
                retryAttempts++;
                console.log(`⏳ OpenCounterAPI not ready yet, retrying in 500ms...`);
                setTimeout(updateCount, 500);
            } else {
                console.warn('⚠️ OpenCounterAPI not ready after max retries');
                // Show local fallback if available
                const localCount = localStorage.getItem('paoradox_fallback_count') || '0';
                updateDisplay(localCount);
                updateLabel();
            }
            return;
        }

        const count = getCountFromOpenCounter();
        if (count !== null && count > 0) {
            updateDisplay(count);
            updateLabel();
            openCounterReady = true;
            
            // Store as fallback
            localStorage.setItem('paoradox_fallback_count', String(count));
            
            // Trigger pulse on first load
            if (retryAttempts === 0) {
                triggerPulse();
            }
            
            console.log(`✅ Successfully loaded count: ${count}`);
        } else {
            console.warn('⚠️ Could not retrieve count from OpenCounterAPI');
            if (retryAttempts < MAX_RETRIES) {
                retryAttempts++;
                setTimeout(updateCount, 500);
            } else {
                const localCount = localStorage.getItem('paoradox_fallback_count') || '0';
                updateDisplay(localCount);
                updateLabel();
            }
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

        // Create or get the counter container
        let container = document.getElementById('viewsCounter');
        if (!container) {
            console.log('📄 Creating new counter container');
            container = document.createElement('div');
            container.id = 'viewsCounter';
            container.className = 'views-counter';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-label', 'Live visitor counter');

            container.innerHTML = `
                <span class="terminal-prompt">$</span>
                <span id="viewCount" class="terminal-counter-blink">0</span>
                <span class="views-label">views</span>
                <span class="views-tooltip">Live visitor count</span>
            `;

            document.body.appendChild(container);
        }

        viewCountElement = document.getElementById('viewCount');
        viewsLabelElement = document.querySelector('.views-label');

        if (!viewCountElement) {
            console.warn('❌ viewCount element not found');
            return;
        }

        // Show loading state
        updateDisplay('…');
        updateLabel();

        // Check if OpenCounterAPI is already loaded
        if (typeof OpenCounterAPI !== 'undefined' || document.querySelector('[data-placeholder]')) {
            console.log('📊 OpenCounterAPI appears to be loaded');
            updateCount();
        } else {
            console.log('⏳ Waiting for OpenCounterAPI to load...');
            // Wait for the OpenCounterAPI script to load
            let checkInterval = 0;
            const maxCheck = 30; // 30 seconds max
            const waitForOpenCounter = setInterval(() => {
                checkInterval++;
                if (document.querySelector('[data-placeholder="now"]') && 
                    parseInt(document.querySelector('[data-placeholder="now"]').textContent, 10) > 0) {
                    clearInterval(waitForOpenCounter);
                    console.log('📊 OpenCounterAPI loaded successfully');
                    updateCount();
                } else if (checkInterval >= maxCheck) {
                    clearInterval(waitForOpenCounter);
                    console.warn('⚠️ OpenCounterAPI did not load within timeout');
                    const localCount = localStorage.getItem('paoradox_fallback_count') || '0';
                    updateDisplay(localCount);
                    updateLabel();
                }
            }, 1000);
        }

        // Refresh when user returns to tab
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && openCounterReady) {
                console.log('👁️ Tab visible, refreshing count...');
                updateCount();
            }
        });

        // Listen for OpenCounterAPI updates (if they trigger events)
        document.addEventListener('openCounterUpdate', function(e) {
            console.log('📊 OpenCounterAPI update event received');
            if (e.detail && e.detail.count) {
                updateDisplay(e.detail.count);
            } else {
                updateCount();
            }
        });

        console.log('✅ Views Counter initialized with OpenCounterAPI');
    }

    // Start the counter
    initViewsCounter();

})();