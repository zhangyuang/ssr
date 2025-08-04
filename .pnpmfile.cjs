function readPackage(pkg, context) {
  if (pkg.name.includes('@vitejs')) {
    pkg.peerDependencies.vite = 'npm:rolldown-vite@latest'
  }
  
  if (pkg.name === 'vue-loader') {
    if (pkg.version.startsWith('17')) {
      pkg.peerDependencies.webpack = '^5.0.0'
      pkg.dependencies.webpack = '^5.0.0'
    } else {
      pkg.peerDependencies.webpack = '^4.0.0'
      pkg.dependencies.webpack = '^4.0.0'
    }
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