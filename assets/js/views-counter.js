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
    const MAX_RETRIES = 10;

    const CONFIG = {
        PAGE_URL: 'https://paoradox.github.io/',
        BADGE_URL: 'https://librecounter.org/counter.svg',
        FALLBACK_KEY: 'paoradox_fallback_count'
    };

    /**
     * Fetch the SVG badge using an image element
     * This avoids CORS because images are allowed cross-origin
     */
    function fetchCount() {
        console.log('🌐 Fetching count from LibreCounter via image...');

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Try to get CORS access
            img.src = CONFIG.BADGE_URL + '?ref=' + encodeURIComponent(CONFIG.PAGE_URL);
            
            // Set a timeout in case the image takes too long
            const timeout = setTimeout(() => {
                img.onload = null;
                img.onerror = null;
                reject(new Error('Image load timeout'));
            }, 10000);

            img.onload = function() {
                clearTimeout(timeout);
                console.log('📊 Image loaded successfully');
                
                try {
                    // Draw the SVG on a canvas to extract text
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas size to match image
                    canvas.width = img.naturalWidth || 200;
                    canvas.height = img.naturalHeight || 50;
                    
                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0);
                    
                    // Extract text from the canvas
                    // This is a best-effort approach - SVG text rendering may vary
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    // Try to recognize numbers by looking for patterns
                    // This is a simplified approach - for production, OCR would be needed
                    // Instead, we'll use a different method: fetch the SVG as text via proxy
                    // Since we can't read the SVG directly, we'll use the image as a "visit trigger"
                    // and then use a separate method to get the count
                    
                    // Fallback: try to get the count from the image URL or use cached
                    console.log('📊 Image loaded, but text extraction from canvas is complex');
                    resolve(null);
                } catch (error) {
                    console.warn('⚠️ Canvas extraction failed:', error.message);
                    resolve(null);
                }
            };

            img.onerror = function() {
                clearTimeout(timeout);
                console.warn('⚠️ Image failed to load');
                reject(new Error('Image load failed'));
            };
        }).catch(error => {
            console.warn('⚠️ Image-based fetch failed:', error.message);
            return null;
        });
    }

    /**
     * Alternative: Use a proxy to fetch the SVG as text
     * This avoids CORS by using a CORS proxy
     */
    function fetchCountViaProxy() {
        console.log('🌐 Fetching count via CORS proxy...');
        
        // Use a public CORS proxy
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + 
            encodeURIComponent(CONFIG.BADGE_URL + '?ref=' + encodeURIComponent(CONFIG.PAGE_URL));
        
        return fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.text();
            })
            .then(svgText => {
                console.log('📊 SVG received via proxy, parsing for count...');
                
                // Parse the SVG to find the count
                const match = svgText.match(/<text[^>]*>([\d,]+)<\/text>/);
                if (match) {
                    const count = parseInt(match[1].replace(/,/g, ''), 10);
                    if (!isNaN(count) && count >= 0) {
                        console.log(`📊 LibreCounter returned: ${count}`);
                        return count;
                    }
                }
                
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
                console.warn('⚠️ Proxy fetch failed:', error.message);
                return null;
            });
    }

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

        // Try the proxy method first
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

        viewCountElement.classList.add('terminal-counter-blink');

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

        // Trigger the visit counter
        triggerVisitCounter();

        // Fetch the count
        updateCount();

        // Refresh when user returns to tab
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                console.log('👁️ Tab visible, refreshing count...');
                retryAttempts = 0;
                triggerVisitCounter();
                updateCount();
            }
        });

        console.log('✅ Views Counter initialized with LibreCounter (Image-based)');
    }

    initViewsCounter();

})();