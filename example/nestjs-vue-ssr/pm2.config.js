module.exports = {
  apps: [
    {
      name: 'nest-vue-ssr-app',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        BUILD_TOOL: process.env.BUILD_TOOL === 'vite' ? 'vite' : ''
      }
    }
  ]
}
