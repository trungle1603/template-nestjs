module.exports = {
    apps: [
        {
            name: 'base-app',
            script: './dist/src/main.js',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
