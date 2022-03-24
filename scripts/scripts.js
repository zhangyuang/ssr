const fs = require('fs')
const os = require('os')
const { execSync } = require('child_process')
const argv = require('./minimist')(process.argv.slice(2))

function isWin () {
  return os.platform() === 'win32'
}

const options = {
  stdio: 'inherit'
}

const linkPackage = []

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

const excludePackage = ['.DS_Store']
const packages = fs.readdirSync('./packages').filter(name => {
  return !excludePackage.includes(name)
})

if (argv.clean) {
  let shell = 'rm -rf node_modules yarn.lock **/**/cjs **/**/esm **/**/yarn.lock **/**/package-lock.json packages/**/node_modules'
  if (argv.deep) {
    shell += ' example/**/node_modules'
  }
  execSync(shell, options)
}

if (argv.link) {
  if (argv.react) {
    linkPackage.push('react')
    linkPackage.push('react-dom')
    const shell = 'cd node_modules/react && yarn link && cd ../react-dom && yarn link'
    execSync(shell, options)
  }
  let shell = 'npx concurrently'
  linkPackage.forEach(item => {
    shell += ` "cd node_modules/${item} && yarn link" ` // link react-dom 防止出现多个react实例
  })

  if (argv.vue2 || argv.vue3) {
    linkPackage.push('vue')
    const shell = `cd packages/${argv.vue2 ? 'core-vue' : 'core-vue3'}/node_modules/vue && yarn link  `
    execSync(shell, options)
    if (argv.vue3) {
      linkPackage.push('vue-router')
      const shell = 'cd packages/plugin-vue3/node_modules/vue-router && yarn link  '
      execSync(shell, options)
    }
  }

  packages.forEach(item => {
    shell += ` "cd packages/${item} && yarn link" ` // link packages 下面所有的包
  })
  const linkedPackage = packages.map(item => item === 'cli' ? 'ssr' : 'ssr-' + item)
    .concat(linkPackage).join(' ')

  const examples = fs.readdirSync('./example')
  examples.forEach(example => {
    if (example !== '.DS_Store') {
      const commonShell = `${shell} && cd example/${example} && yarn link ${linkedPackage}`
      const grantExecutePermission = 'chmod 777 ./node_modules/ssr/cjs/cli.js'
      const exampleShell = isWin() ? commonShell : `${commonShell} && ${grantExecutePermission}`
      execSync(exampleShell, options)
    }
  })
}
if (argv.unlink) {
  if (argv.react) {
    linkPackage.push('react')
    linkPackage.push('react-dom')
  }

  let shell = 'npx concurrently'
  linkPackage.forEach(item => {
    shell += ` "cd node_modules/${item} && yarn unlink" ` // link react-dom 防止出现多个react实例
  })
  if (argv.vue2 || argv.vue3) {
    const shell = `cd packages/${argv.vue2 ? 'core-vue' : 'core-vue3'}/node_modules/vue && yarn unlink `
    execSync(shell, options)
  }
  packages.forEach(item => {
    shell += ` "cd packages/${item} && yarn unlink" `
  })
  execSync(shell, options)
}
if (argv.publishDoc) {
  packages.forEach(item => {
    execSync(`cp README.md packages/${item}`, options)
  })
}

if (argv.changelog) {
  execSync('cp CHANGELOG.md docs/web/markdown/changelog/index.md', options)
}

if (argv.sync) {
  const shell = 'cnpm sync '
  const linkedPackage = fs.readdirSync('./packages').map(item => item !== '.DS_Store' && item === 'cli' ? 'ssr' : 'ssr-' + item).join(' ')
  execSync(shell + linkedPackage, options)
}
