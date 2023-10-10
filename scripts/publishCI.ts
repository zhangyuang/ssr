import { args, getPackageInfo, publishPackage, step } from './releaseUtils'

async function main () {
  const tags = args._[1]
  if (!tags) {
    throw new Error('No tag specified')
  }
  for (const tag of tags.split(',')) {
    let pkgName = ''
    let version

    if (tag.includes('@')) [pkgName, version] = tag.split('@')
    else version = tag

    console.log('publish Info', tag, pkgName, version)

    if (version.startsWith('v')) version = version.slice(1)

    const { currentVersion, pkgDir } = getPackageInfo(pkgName)
    if (currentVersion !== version) {
      throw new Error(
        `Package version from tag "${version}" mismatches with current version "${currentVersion}"`
      )
    }

    step('Publishing package...')
    await publishPackage(pkgDir, version.includes('beta') ? 'beta' : undefined)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
