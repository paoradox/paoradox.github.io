/**
 * Security Module - CSP + HTTPS Enforcement
 */
(function() {
    'use strict';

    function enforceHTTPS() {
        const hostname = window.location.hostname;
        const isLocal = ['localhost', '127.0.0.1'].includes(hostname) || hostname.startsWith('192.168.');
        if (window.location.protocol !== 'https:' && !isLocal) {
            window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
            return true;
        }
        return false;
    }

    function applyCSP() {
        const hostname = window.location.hostname;
        const isLocal = ['localhost', '127.0.0.1'].includes(hostname) || hostname.startsWith('192.168.');
        if (isLocal) {
            console.log('🔓 CSP disabled (development mode)');
            return;
        }

        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https://raw.githubusercontent.com https://cdn.cdnlogo.com https://upload.wikimedia.org",
            "connect-src 'self'",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
        document.head.appendChild(meta);
        console.log('🔒 CSP applied (production)');
    }

    if (!enforceHTTPS()) {
        applyCSP();
    }

})();