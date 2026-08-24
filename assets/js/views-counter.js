/**
 * Profile Views Counter - Debug Version
 * Logs everything to help identify the issue
 */
(function() {
    'use strict';

    console.log('🔍 Views Counter: Script starting...');

    const CONFIG = {
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
            console.log(`📦 getStorageItem("${key}") →`, value);
            return value !== null ? value : fallback;
        } catch (e) {
            console.warn('Views Counter: localStorage unavailable', e);
            return fallback;
        }
    }

    function setStorageItem(key, value) {
        try {
            localStorage.setItem(key, String(value));
            console.log(`💾 setStorageItem("${key}", "${value}")`);
            return true;
        } catch (e) {
            console.warn('Views Counter: Failed to save to localStorage', e);
            return false;
        }
    }

    function validateNumber(value, max, fallback) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0 || num > max) {
            console.log(`⚠️ validateNumber: "${value}" → fallback ${fallback}`);
            return fallback;
        }
        return num;
    }

    function getLocalOffset() {
        const stored = getStorageItem(CONFIG.OFFSET_KEY, '0');
        const result = validateNumber(stored, CONFIG.MAX_OFFSET, 0);
        console.log(`📊 getLocalOffset() → ${result}`);
        return result;
    }

    function setLocalOffset(offset) {
        const validOffset = validateNumber(offset, CONFIG.MAX_OFFSET, 0);
        setStorageItem(CONFIG.OFFSET_KEY, validOffset);
        console.log(`📊 setLocalOffset() → ${validOffset}`);
    }

    function sessionCounted() {
        const result = getStorageItem(CONFIG.SESSION_FLAG, 'false') === 'true';
        console.log(`🔑 sessionCounted() → ${result}`);
        return result;
    }

    function markSessionCounted() {
        setStorageItem(CONFIG.SESSION_FLAG, 'true');
        console.log(`🔑 markSessionCounted() done`);
    }

    function canIncrement() {
        const lastView = getStorageItem(CONFIG.LAST_VIEW_KEY, null);
        console.log(`⏰ canIncrement: lastView = ${lastView}`);
        
        // First visit ever - allow increment
        if (lastView === null) {
            console.log('⏰ First visit ever! Allowing increment.');
            return true;
        }
        
        const lastTime = validateNumber(lastView, Date.now(), 0);
        const now = getNow();

        if (lastTime === 0) {
            console.log('⏰ lastTime is 0, allowing increment');
            return true;
        }

        const hoursSince = (now - lastTime) / (1000 * 60 * 60);
        const canInc = hoursSince >= CONFIG.COOLDOWN_HOURS;
        console.log(`⏰ Hours since last view: ${hoursSince.toFixed(2)}, can increment: ${canInc}`);
        return canInc;
    }

    function tryIncrementOffset() {
        console.log('🔄 tryIncrementOffset() called');
        
        if (sessionCounted()) {
            console.log('🔄 Session already counted, skipping');
            return false;
        }
        
        if (!canIncrement()) {
            console.log('🔄 Cannot increment (cooldown active)');
            return false;
        }

        const currentOffset = getLocalOffset();
        if (currentOffset >= CONFIG.MAX_OFFSET) {
            console.warn('Views Counter: Maximum offset reached');
            return false;
        }
        
        const newOffset = currentOffset + 1;
        setLocalOffset(newOffset);
        setStorageItem(CONFIG.LAST_VIEW_KEY, String(getNow()));
        markSessionCounted();
        console.log(`🔄 Incremented! New offset: ${newOffset}`);
        return true;
    }

    function fetchGlobalCount() {
        console.log('🌐 fetchGlobalCount() called, URL:', CONFIG.KOMAREV_URL);
        
        return fetch(CONFIG.KOMAREV_URL, {
            method: 'GET',
            headers: { 'Accept': 'image/svg+xml,text/html' }
        })
        .then(response => {
            console.log('🌐 Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(svgText => {
            console.log('🌐 Response length:', svgText.length);
            console.log('🌐 First 100 chars:', svgText.substring(0, 100));
            
            if (!svgText || !svgText.includes('<svg')) {
                console.warn('Views Counter: Invalid SVG response');
                return null;
            }

            // Find any number in the SVG
            const numberMatch = svgText.match(/(\d[\d,]*)/);
            if (numberMatch) {
                const number = parseInt(numberMatch[1].replace(/,/g, ''), 10);
                console.log(`🌐 Found number: ${number}`);
                if (!isNaN(number) && number > 0) {
                    return validateNumber(number, CONFIG.MAX_VIEWS, null);
                }
            }

            console.warn('Views Counter: No valid number found in SVG');
            return null;
        })
        .catch(error => {
            console.warn('🌐 Fetch error:', error.message);
            return null;
        });
    }

    function updateDisplay(count) {
        if (viewCountElement) {
            if (typeof count === 'number') {
                viewCountElement.textContent = count.toLocaleString();
                console.log(`🖥️ updateDisplay: ${count.toLocaleString()}`);
            } else {
                viewCountElement.textContent = count;
                console.log(`🖥️ updateDisplay: ${count}`);
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
        console.log('🚀 initViewsCounter() called');
        
        if (document.readyState === 'loading') {
            console.log('📄 Document still loading, waiting for DOMContentLoaded');
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
                <span id="viewCount" class="terminal-counter-blink">0</span>
                <span class="views-label">views</span>
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

        console.log('🔄 Attempting to increment offset...');
        const didIncrement = tryIncrementOffset();
        console.log(`🔄 didIncrement = ${didIncrement}`);

        console.log('🌐 Fetching global count...');
        fetchGlobalCount().then(globalCount => {
            console.log(`🌐 Global count received: ${globalCount}`);
            
            if (globalCount !== null) {
                const offset = getLocalOffset();
                const totalCount = globalCount + offset;
                updateDisplay(totalCount);
                console.log(`✅ Total: ${globalCount} + ${offset} = ${totalCount}`);
            } else {
                const offset = getLocalOffset();
                updateDisplay(offset || 0);
                console.log(`⚠️ Using local-only: ${offset || 0}`);
            }
            
            if (didIncrement) {
                console.log('🎉 Triggering pulse animation!');
                triggerPulse();
            }
        });

        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                console.log('👁️ Tab became visible, refreshing...');
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

        console.log('✅ Views Counter initialized');
    }

    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('Views Counter')) {
            console.warn('⚠️ Views Counter caught error:', e.message);
        }
    });

    initViewsCounter();

})();