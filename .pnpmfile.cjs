function readPackage(pkg, context) {
  if (pkg.name.includes('@vitejs')) {
    pkg.peerDependencies.vite = 'npm:rolldown-vite@latest'
  }
  const pkgs = ['vue-loader', 'ssr-plugin-vue3', 'ssr-plugin-vue', 'ssr-plugin-react', '@rspack/core']
  if (pkgs.includes(pkg.name) && process.env.GITHUB_JOB) {
    const webpackVersion = process.env.GITHUB_JOB.includes('rspack') ? '^5.0.0' : '^4.0.0'
    pkg.dependencies.webpack = webpackVersion
    pkg.peerDependencies.webpack = webpackVersion
  }
  if (pkg.dependencies?.vite) {
    pkg.dependencies.vite = 'npm:rolldown-vite@latest'
  }
  
  if (pkg.peerDependencies?.vite) {
    pkg.peerDependencies.vite = 'npm:rolldown-vite@latest'
  }
  
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}