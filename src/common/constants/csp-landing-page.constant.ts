export const CSP_LANDING_PAGE = {
    APOLLO_SANDBOX_DEV: {
        'script-src': [
            "'self'",
            "'unsafe-inline'",
            'https://embeddable-sandbox.cdn.apollographql.com',
        ],
        'frame-src': ["'self'", 'https://sandbox.embed.apollographql.com'],
    },

    PLAYGROUND: {
        'img-src': ["'self'", 'data:', 'http://cdn.jsdelivr.net'],
        'script-src-elem': [
            "'self'",
            "'unsafe-inline'",
            'http://cdn.jsdelivr.net',
        ],
    },
};
