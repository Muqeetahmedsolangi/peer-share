module.exports = {
  apps: [{
    name: 'apiserver',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: '~/.pm2/logs/apiserver-error.log',
    out_file: '~/.pm2/logs/apiserver-out.log',
    log_file: '~/.pm2/logs/apiserver-combined.log',
    time: true
  }]
};
