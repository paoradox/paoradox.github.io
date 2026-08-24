/**
 * Greetings Overlay - Matrix Shuffle Effect
 * Displays a single line where characters shuffle until the message is formed
 * Always shows the correct time‑based greeting when the loop resets
 */
(function() {
    'use strict';

    // ----- Configuration -----
    const STATIC_MESSAGES = [
        'Thanks for dropping by!',
        'Enjoy your stay!',
        'Sharing is caring!'
    ];

    const SHUFFLE_SPEED = 50;          // ms per character update
    const PAUSE_BEFORE_NEXT = 2000;    // pause after message is complete

    // ----- DOM refs -----
    let container = null;
    let displaySpan = null;

    // ----- State -----
    let currentMessageIndex = 0;
    let currentTargetMessage = '';
    let shuffleInterval = null;
    let timeoutId = null;

    // ----- Helper: get time-based greeting (re‑evaluated each time) -----
    function getTimeGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning, visitor!';
        if (hour < 18) return 'Good afternoon, visitor!';
        return 'Good evening, visitor!';
    }

    // ----- Build the full message list dynamically -----
    function getFullMessageList() {
        // First message is always the time‑based greeting
        return [getTimeGreeting(), ...STATIC_MESSAGES];
    }

    // ----- Helper: generate a random character -----
    function getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}\\|;:\'",.<>/?';
        return chars[Math.floor(Math.random() * chars.length)];
    }

    // ----- Shuffle a single character toward the target -----
    function shuffleStep(currentText, targetText) {
        let result = '';
        for (let i = 0; i < targetText.length; i++) {
            if (i < currentText.length && currentText[i] === targetText[i]) {
                result += targetText[i];
            } else {
                // 20% chance to land on the correct character early
                if (Math.random() < 0.2) {
                    result += targetText[i];
                } else {
                    result += getRandomChar();
                }
            }
        }
        return result;
    }

    // ----- Check if the message is fully formed -----
    function isMessageComplete(currentText, targetText) {
        if (currentText.length !== targetText.length) return false;
        return currentText === targetText;
    }

    // ----- The main shuffle loop -----
    function startShuffle(targetMessage) {
        // Clear any existing interval / timeout
        if (shuffleInterval) clearInterval(shuffleInterval);
        if (timeoutId) clearTimeout(timeoutId);

        // Reset display to random characters
        let currentText = '';
        for (let i = 0; i < targetMessage.length; i++) {
            currentText += getRandomChar();
        }
        displaySpan.textContent = currentText;

        // Shuffle until the message is formed
        shuffleInterval = setInterval(() => {
            const newText = shuffleStep(currentText, targetMessage);
            currentText = newText;
            displaySpan.textContent = currentText;

            if (isMessageComplete(currentText, targetMessage)) {
                clearInterval(shuffleInterval);
                shuffleInterval = null;

                // Pause, then move to the next message
                timeoutId = setTimeout(() => {
                    // Re‑build the full list each time to refresh the time‑based greeting
                    const fullList = getFullMessageList();
                    currentMessageIndex = (currentMessageIndex + 1) % fullList.length;
                    startShuffle(fullList[currentMessageIndex]);
                }, PAUSE_BEFORE_NEXT);
            }
        }, SHUFFLE_SPEED);
    }

    // ----- Build the overlay (single line) -----
    function buildOverlay() {
        if (document.getElementById('greetingsOverlay')) return;

        container = document.createElement('div');
        container.id = 'greetingsOverlay';
        container.className = 'greetings-overlay';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-label', 'Greeting overlay');

        const line = document.createElement('div');
        line.className = 'greeting-line';
        line.innerHTML = `<span class="greeting-text" id="greetingDisplay"></span>`;

        container.appendChild(line);
        document.body.appendChild(container);

        displaySpan = document.getElementById('greetingDisplay');
    }

    // ----- Init -----
    function initGreetings() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGreetings);
            return;
        }

        buildOverlay();

        if (!displaySpan) {
            console.warn('Greetings: display element not found');
            return;
        }

        // Start with the current time-based greeting
        const fullList = getFullMessageList();
        currentMessageIndex = 0;
        startShuffle(fullList[0]);

        console.log('✅ Greetings overlay initialized (Matrix shuffle with dynamic time)');
    }

    // Start
    initGreetings();

})();