module.exports = {
    apps: [
        {
            name: 'kickshare-markdown',
            script: './server.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: 5001,
                DOMAIN: 'kickshare.fun'
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5001,
                DOMAIN: 'kickshare.fun'
            },
            max_memory_restart: '256M',
            error_file: 'logs/err.log',
            out_file: 'logs/out.log',
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss'
        }
    ]
};
