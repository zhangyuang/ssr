import { getCwd, judgeFramework } from 'ssr-common-utils'
import { resolve } from 'path'

export const getBuildEntry = () => {
	const framework = judgeFramework()
	return {
		server: resolve(getCwd(), './node_modules', framework, './esm/entry/server-entry'),
		client: resolve(getCwd(), './node_modules', framework, './esm/entry/client-entry')
	}
}
