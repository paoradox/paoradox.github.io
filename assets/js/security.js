/**
 * Security Module - CSP + HTTPS Enforcement
 * Applies security headers and policies dynamically
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

        const domains = {
            images: [
                "'self'",
                "data:",
                "https://raw.githubusercontent.com",
                "https://cdn.cdnlogo.com",
                "https://upload.wikimedia.org",
                "https://behance.net",
                "https://*.behance.net",
                "https://behanceusercontent.com",
                "https://*.behanceusercontent.com",
                "https://github.com",
                "https://*.github.com",
                "https://avatars.githubusercontent.com",
                "https://github.githubassets.com"
            ].join(' '),
            
            connects: [
                "'self'",
                "https://komarev.com",
                "https://behance.net",
                "https://*.behance.net",
                "https://api.behance.net",
                "https://github.com",
                "https://*.github.com",
                "https://api.github.com",
                // 🔥 ADD CountAPI to allowed connections
                "https://api.countapi.xyz"
            ].join(' '),
            
            frames: [
                "'self'",
                "https://behance.net",
                "https://*.behance.net",
                "https://github.com",
                "https://*.github.com"
            ].join(' ')
        };

        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            `img-src ${domains.images}`,
            `connect-src ${domains.connects}`,
            `frame-src ${domains.frames}`,
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
        
        document.head.appendChild(meta);
        console.log('🔒 CSP applied (production) - Behance + GitHub + CountAPI supported');
    }

    if (!enforceHTTPS()) {
        applyCSP();
    }

})();