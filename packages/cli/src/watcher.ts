import * as chokidar from 'chokidar'
import type { FSWatcher } from 'chokidar'
export const createWatcher = async () => {
  const { getPagesDir } = await import('ssr-server-utils')
  const pageDir = getPagesDir()
  const watcher = chokidar.watch(pageDir, {
    ignored: /.(less|css|scss)/, // ignore dotfiles
    persistent: true
  })
  return watcher
}

export const onWatcher = async (watcher: FSWatcher) => {
  const { parseFeRoutes, logGreen, logErr } = await import('ssr-server-utils')
  watcher
    .on('add', async path => {
      logGreen(`File ${path} has been added ParseFeRoutes reload`)
      await parseFeRoutes().catch(err => logErr('ParseFeRoutes Error' + err))
    })
    .on('addDir', async path => {
      logGreen(`Dir ${path} has been added ParseFeRoutes reload`)
      await parseFeRoutes().catch(err => logErr('ParseFeRoutes Error' + err))
    })
    .on('unlink', async path => {
      logGreen(`File ${path} has been deleted ParseFeRoutes reload`)
      await parseFeRoutes().catch(err => logErr('ParseFeRoutes Error' + err))
    })
    .on('unlinkDir', async path => {
      logGreen(`Dir ${path} has been deleted ParseFeRoutes reload`)
      await parseFeRoutes().catch(err => logErr('ParseFeRoutes Error' + err))
    })
}
