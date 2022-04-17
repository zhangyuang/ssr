module.exports = {
  apps: [
    {
      name: 'ssr-app',
      script: 'bootstrap.js',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
