module.exports = {
  apps: [
    {
      name: 'nest-react-ssr-app',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
