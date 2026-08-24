/**
 * Profile Views Counter - OpenCounterAPI Integration
 * Displays as "$ views #" with blinking number
 */
(function() {
    'use strict';

    console.log('🔍 Views Counter: Starting with OpenCounterAPI...');

    let viewCountElement = null;
    let viewsLabelElement = null;
    let openCounterReady = false;
    let retryAttempts = 0;
    const MAX_RETRIES = 30;

    /**
     * Try to get the count from OpenCounterAPI's data-placeholder elements
     */
    function getCountFromOpenCounter() {
        const nowElement = document.querySelector('[data-placeholder="now"]');
        if (nowElement) {
            const value = parseInt(nowElement.textContent, 10);
            if (!isNaN(value) && value >= 0) {
                console.log(`📊 OpenCounterAPI 'now' value: ${value}`);
                return value;
            }
        }

        const todayElement = document.querySelector('[data-placeholder="24h"]');
        if (todayElement) {
            const value = parseInt(todayElement.textContent, 10);
            if (!isNaN(value) && value >= 0) {
                console.log(`📊 OpenCounterAPI '24h' value: ${value}`);
                return value;
            }
        }

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
     * Check if OpenCounterAPI has populated the placeholders
     */
    function isOpenCounterReady() {
        const nowElement = document.querySelector('[data-placeholder="now"]');
        if (nowElement) {
            const value = parseInt(nowElement.textContent, 10);
            if (!isNaN(value) && value > 0) {
                return true;
            }
            if (nowElement.textContent !== '0') {
                return true;
            }
        }
        const allPlaceholders = document.querySelectorAll('[data-placeholder]');
        for (let el of allPlaceholders) {
            const value = parseInt(el.textContent, 10);
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
     * Main function to fetch and update the count
     */
    function updateCount() {
        console.log(`🔄 Attempting to fetch count (attempt ${retryAttempts + 1})...`);

        if (!isOpenCounterReady()) {
            if (retryAttempts < MAX_RETRIES) {
                retryAttempts++;
                console.log(`⏳ OpenCounterAPI not ready yet, retrying in 1000ms...`);
                setTimeout(updateCount, 1000);
            } else {
                console.warn('⚠️ OpenCounterAPI not ready after max retries');
                const count = getCountFromOpenCounter();
                if (count !== null && count >= 0) {
                    updateDisplay(count);
                    updateLabel();
                    openCounterReady = true;
                    console.log(`✅ Loaded count from placeholder: ${count}`);
                    return;
                }
                const localCount = localStorage.getItem('paoradox_fallback_count') || '0';
                updateDisplay(localCount);
                updateLabel();
            }
            return;
        }

        const count = getCountFromOpenCounter();
        if (count !== null && count >= 0) {
            updateDisplay(count);
            updateLabel();
            openCounterReady = true;
            
            localStorage.setItem('paoradox_fallback_count', String(count));
            
            if (retryAttempts === 0) {
                triggerPulse();
            }
            
            console.log(`✅ Successfully loaded count: ${count}`);
        } else {
            console.warn('⚠️ Could not retrieve count from OpenCounterAPI');
            if (retryAttempts < MAX_RETRIES) {
                retryAttempts++;
                setTimeout(updateCount, 1000);
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

        let container = document.getElementById('viewsCounter');
        if (!container) {
            console.log('📄 Creating new counter container');
            container = document.createElement('div');
            container.id = 'viewsCounter';
            container.className = 'views-counter';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-label', 'Profile view counter');

            // ✅ Format: "$ views #" with blinking number
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

        // ✅ Ensure the blinking class is applied
        viewCountElement.classList.add('terminal-counter-blink');

        updateDisplay('…');
        updateLabel();

        const hasPlaceholder = document.querySelector('[data-placeholder]');
        if (hasPlaceholder) {
            console.log('📊 Hidden placeholders found, checking for data...');
            const nowElement = document.querySelector('[data-placeholder="now"]');
            if (nowElement && parseInt(nowElement.textContent, 10) > 0) {
                console.log('📊 OpenCounterAPI data already populated');
                updateCount();
            } else {
                console.log('⏳ Waiting for OpenCounterAPI to populate data...');
                let checkInterval = 0;
                const maxCheck = 30;
                const waitForData = setInterval(() => {
                    checkInterval++;
                    const nowEl = document.querySelector('[data-placeholder="now"]');
                    if (nowEl && parseInt(nowEl.textContent, 10) >= 0) {
                        clearInterval(waitForData);
                        console.log('📊 OpenCounterAPI data found!');
                        updateCount();
                    } else if (checkInterval >= maxCheck) {
                        clearInterval(waitForData);
                        console.warn('⚠️ OpenCounterAPI did not populate data within timeout');
                        const count = getCountFromOpenCounter();
                        if (count !== null && count >= 0) {
                            updateDisplay(count);
                            updateLabel();
                        } else {
                            const localCount = localStorage.getItem('paoradox_fallback_count') || '0';
                            updateDisplay(localCount);
                            updateLabel();
                        }
                    }
                }, 1000);
            }
        } else {
            console.warn('⚠️ No OpenCounterAPI placeholders found in HTML');
            const localCount = localStorage.getItem('paoradox_fallback_count') || '0';
            updateDisplay(localCount);
            updateLabel();
        }

        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && openCounterReady) {
                console.log('👁️ Tab visible, refreshing count...');
                updateCount();
            }
        });

        console.log('✅ Views Counter initialized with OpenCounterAPI');
    }

    initViewsCounter();

})();