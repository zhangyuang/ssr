/**
 * modified from https://github.com/vuejs/core/blob/master/scripts/release.js
 */
import * as colors from 'picocolors'
import type { Options as ExecaOptions } from 'execa'
import execa from 'execa'
import { readFileSync, writeFileSync, existsSync, promises } from 'fs'
import * as path from 'path'
import { resolve } from 'path'
import type { ReleaseType } from 'semver'
import * as semver from 'semver'
import { cp } from 'shelljs'

export const args = require('minimist')(process.argv.slice(2))

export const isDryRun = !!args.dry

if (isDryRun) {
  console.log(colors.inverse(colors.yellow(' DRY RUN ')))
  console.log()
}
export const accessFile = async (file: string) => {
  const result = await promises.access(file)
    .then(() => true)
    .catch(() => false)
  return result
}
export const packages = [
  'cli', 'plugin-vue3', 'plugin-react',
  'plugin-vue', 'types', 'server-utils',
  'core-vue', 'hoc-vue3', 'webpack', 'core-react', 'types-react',
  'client-utils', 'core-vue3', 'plugin-midway', 'plugin-nestjs',
  'hoc-react'
]

export function getPackageInfo (pkgName: string) {
  const pkgDir = path.resolve(__dirname, '../packages/' + pkgName)

  if (!existsSync(pkgDir)) {
    throw new Error(`Package ${pkgName} not found`)
  }

  const pkgPath = path.resolve(pkgDir, 'package.json')
  const pkg: {
    name: string
    version: string
    private?: boolean
  } = require(pkgPath)
  const currentVersion = pkg.version

  if (pkg.private) {
    throw new Error(`Package ${pkgName} is private`)
  }

  return {
    pkg,
    pkgName,
    pkgDir,
    pkgPath,
    currentVersion
  }
}

export async function run (
  bin: string,
  args: string[],
  opts: ExecaOptions<string> = {}
) {
  return await execa(bin, args, { stdio: 'inherit', ...opts })
}

export async function dryRun (
  bin: string,
  args: string[],
  opts?: ExecaOptions<string>
) {
  return console.log(
    colors.blue(`[dryrun] ${bin} ${args.join(' ')}`),
    opts || ''
  )
}

export const runIfNotDry = isDryRun ? dryRun : run

export function step (msg: string) {
  return console.log(colors.cyan(msg))
}

export function getVersionChoices (currentVersion: string) {
  const currentBeta = currentVersion.includes('beta')

  const inc: (i: ReleaseType) => string = (i) =>
    semver.inc(currentVersion, i, 'beta')!

  const versionChoices = [
    {
      title: 'next',
      value: inc(currentBeta ? 'prerelease' : 'patch')
    },
    ...(currentBeta
      ? [
        {
          title: 'stable',
          value: inc('patch')
        }
      ]
      : [
        {
          title: 'beta-patch',
          value: inc('prepatch')
        },
        {
          title: 'beta-minor',
          value: inc('preminor')
        },
        {
          title: 'beta-major',
          value: inc('premajor')
        },
        {
          title: 'patch',
          value: inc('patch')
        },
        {
          title: 'minor',
          value: inc('minor')
        },
        {
          title: 'major',
          value: inc('major')
        }
      ]),
    { value: 'custom', title: 'custom' }
  ].map((i) => {
    i.title = `${i.title} (${i.value})`
    return i
  })

  return versionChoices
}

export function updateVersion (pkgPath: string, version: string): void {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

export async function publishPackage (
  pkdDir: string,
  tag?: string
): Promise<void> {
  const publicArgs = ['publish', '--access', 'public']
  if (tag) {
    publicArgs.push('--tag', tag)
  }
  await promises.writeFile(resolve(pkdDir, './.npmignore'), '**/*.map')
  cp(resolve(process.cwd(), './README.md'), resolve(pkdDir, './README.md'))
  await runIfNotDry('npm', publicArgs, {
    cwd: pkdDir
  })
}

export async function getLatestTag (pkgName: string) {
  const tags = (await run('git', ['tag'], { stdio: 'pipe' })).stdout
    .split(/\n/)
    .filter(Boolean)
  const prefix = tags.filter(tag => tag.startsWith(`${pkgName}@`)).length > 0 ? `${pkgName}@` : 'v'
  return tags
    .filter((tag) => tag.startsWith(prefix))
    .sort()
    .reverse()[0]
}

export async function logRecentCommits (pkgName: string) {
  const tag = await getLatestTag(pkgName)
  if (!tag) return
  const sha = await run('git', ['rev-list', '-n', '1', tag], {
    stdio: 'pipe'
  }).then((res) => res.stdout.trim())
  console.log(
    colors.bold(
      `\n${colors.blue('i')} Commits of ${colors.green(
        pkgName
      )} since ${colors.green(tag)} ${colors.gray(`(${sha.slice(0, 5)})`)}`
    )
  )
  await run(
    'git',
    [
      '--no-pager',
      'log',
      `${sha}..HEAD`,
      '--oneline',
      '--',
      `packages/${pkgName}`
    ],
    { stdio: 'inherit' }
  )
  console.log()
}
