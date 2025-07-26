import { getCwd, judgeFramework, getClientEntry } from 'ssr-common-utils'
import { resolve } from 'path'

export const getBuildEntry = () => {
	const framework = judgeFramework()
	const defaultClientEntry = getClientEntry()
	return {
		server: resolve(getCwd(), './node_modules', framework, './esm/entry/server-entry'),
		client: resolve(getCwd(), './node_modules', framework, `./esm/entry/${defaultClientEntry}`)
	}
}
