function readPackage(pkg, context) {
  if (pkg.name.includes('@vitejs')) {
    pkg.peerDependencies.vite = 'npm:rolldown-vite@latest'
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