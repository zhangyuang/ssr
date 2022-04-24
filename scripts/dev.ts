// npx esno scripts/dev.ts --a
// npx esno scripts/dev.ts plugin-vue3

import execa from 'execa'

const args = require('minimist')(process.argv.slice(2))

let path = './packages'

if (args._[0]) {
  path = args._[0] === 'cli' ? '...ssr' : `...ssr-${args._[0]}`
}

if (args.a || args.all) {
  path = './packages'
}

execa('pnpm', ['--filter', path, 'watch', '--parallel'], {
  stdio: 'inherit'
})
