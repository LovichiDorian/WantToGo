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
    {
      name: 'wanttogo-frontend',
      cwd: './frontend',
      script: '/home/ubuntu/.npm-global/bin/serve',
      args: ['-s', 'dist', '-p', '3000'],
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
