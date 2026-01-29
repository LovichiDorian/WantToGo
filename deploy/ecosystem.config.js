// PM2 Ecosystem Configuration for WantToGo Backend
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'wanttogo-api',
      script: 'dist/main.js',
      cwd: '/var/www/wanttogo/backend',
      instances: 'max', // Use all available CPUs
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      
      // Logging
      log_file: '/var/log/wanttogo/combined.log',
      out_file: '/var/log/wanttogo/out.log',
      error_file: '/var/log/wanttogo/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      
      // Memory limit
      max_memory_restart: '500M',
      
      // Watch configuration (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'uploads', 'logs'],
      
      // Health check
      exp_backoff_restart_delay: 100,
    },
  ],
};
