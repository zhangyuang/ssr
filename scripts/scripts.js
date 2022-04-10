const fs = require('fs')
const { execSync } = require('child_process')
const argv = require('./minimist')(process.argv.slice(2))

const options = {
  stdio: 'inherit'
}

if (argv.bootstrap) {
  let shell = 'npx concurrently "yarn"'
  const examples = fs.readdirSync('./example')
  examples.forEach(example => {
    if (example !== '.DS_Store') {
      shell += ` "cd example/${example} && yarn" `
    }
  })
  execSync(shell, options)
  execSync('yarn build:only', options)
}

if (argv.clean) {
  let shell = 'rm -rf node_modules **/**/cjs **/**/esm packages/**/node_modules'
  if (argv.deep) {
    shell += ' example/**/node_modules'
  }
  execSync(shell, options)
}

if (argv.changelog) {
  execSync('cp CHANGELOG.md docs/web/markdown/changelog/index.md', options)
}

if (argv.sync) {
  const shell = 'cnpm sync '
  const linkedPackage = fs.readdirSync('./packages').map(item => item !== '.DS_Store' && item === 'cli' ? 'ssr' : 'ssr-' + item).join(' ')
  execSync(shell + linkedPackage, options)
}
