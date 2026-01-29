module.exports = {
  apps: [
    {
      name: 'wanttogo-api',
      cwd: './backend',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3010,
      },
    },
    // Frontend is served by nginx from dist/ folder
    // No need for a dev server in production
  ],
};
