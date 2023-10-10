import prompts from 'prompts'
import * as semver from 'semver'
import * as colors from 'picocolors'
import {
  args,
  getPackageInfo,
  getVersionChoices,
  isDryRun,
  logRecentCommits,
  packages,
  run,
  runIfNotDry,
  step,
  updateVersion
} from './releaseUtils'

async function main (): Promise<void> {
  let targetVersion: string | undefined

  const { pkg: pkgs }: { pkg: string[] } = await prompts({
    name: 'pkg',
    message: 'Select package',
    type: 'multiselect',
    choices: packages.map((i) => ({ value: i, title: i }))
  })

  if (!pkgs?.length) return
  const tags = []
  for (const pkg of pkgs) {
    const { currentVersion, pkgName, pkgPath, pkgDir } = getPackageInfo(pkg)

    if (!targetVersion) {
      const { release }: { release: string } = await prompts({
        type: 'select',
        name: 'release',
        message: 'Select release type',
        choices: getVersionChoices(currentVersion)
      })

      if (release === 'custom') {
        const res: { version: string } = await prompts({
          type: 'text',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion
        })
        targetVersion = res.version
      } else {
        targetVersion = release
      }
    }

    await logRecentCommits(pkg, targetVersion)

    if (!semver.valid(targetVersion)) {
      throw new Error(`invalid target version: ${targetVersion}`)
    }

    const tag = `${pkgName}@${targetVersion}`

    if (targetVersion.includes('beta') && !args.tag) {
      args.tag = 'beta'
    }

    const { yes }: { yes: boolean } = await prompts({
      type: 'confirm',
      name: 'yes',
      message: `Releasing ${colors.yellow(tag)} Confirm?`
    })

    if (!yes) {
      return
    }

    step('\nUpdating package version...')
    updateVersion(pkgPath, targetVersion)

    step('\nGenerating changelog...')
    const changelogArgs = [
      'conventional-changelog',
      '-p',
      'angular',
      '-i',
      'CHANGELOG.md',
      '-s',
      '-r',
      '1',
      '-l',
      pkgName
    ]
    await run('npx', changelogArgs, { cwd: pkgDir })
    await runIfNotDry('git', ['tag', tag])
    tags.push(tag)
  }

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: ${tags}`])
  } else {
    console.log('No changes to commit.')
    return
  }

  step('\nPushing to GitHub...')
  const res = await runIfNotDry('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    stdio: 'pipe'
  }) as any
  await runIfNotDry('git', ['push', 'origin', '--tags'])
  await runIfNotDry('git', ['push', 'origin', res.stdout])

  if (isDryRun) {
    console.log('\nDry run finished - run git diff to see package changes.')
  } else {
    console.log(
      colors.green(
        '\nPushed, publishing should starts shortly on CI.\nhttps://github.com/zhangyuang/ssr/blob/dev/.github/workflows/ci.yml'
      )
    )
  }

  console.log()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
