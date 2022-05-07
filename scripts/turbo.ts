import execa from 'execa';

(async () => {
  const args = require('minimist')(process.argv.slice(2))
  const filter = args.filter || './packages/*'
  const extra = (args._ || []).join(' ')

  turbo({
    cmd: args.cmd,
    filter,
    extra,
    cache: args.cache,
    parallel: args.parallel
  })
})()

function turbo (opts: {
  filter: string
  cmd: string
  extra?: string
  cache?: boolean
  parallel?: boolean
}) {
  const extraCmd = opts.extra ? `-- -- ${opts.extra}` : ''
  const cacheCmd = opts.cache === false ? '--no-cache --force' : ''
  const parallelCmd = opts.parallel ? '--parallel' : ''

  const options = [
    'run',
    opts.cmd,
    '--cache-dir=".turbo"',
    `--filter="${opts.filter}"`,
    cacheCmd,
    parallelCmd,
    extraCmd
  ]
    .filter(Boolean)

  console.log(process.cwd())

  execa('turbo', options, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  })
}
