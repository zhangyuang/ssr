import { resolve } from 'path'
import axios from 'axios'
import { getCwd, logGreen, ssrPackages } from 'ssr-common-utils'

export const update = async () => {
	const cwd = getCwd()
	const { dependencies, devDependencies } = require(resolve(cwd, './package.json'))
	const d = Object.assign({}, dependencies, devDependencies)
	const needCheck = Object.keys(d).filter((item) => ssrPackages.includes(item))
	const res: Record<string, { currentVersion: string; lastestVersion: string }> = {}
	await (await Promise.all(needCheck.map(async (p) => await axios.get(`https://registry.npmjs.org/${p}`)))).forEach((item) => {
		const currentVersion = require(resolve(cwd, `./node_modules/${item.data.name}/package.json`)).version
		const lastestVersion = item.data['dist-tags'].latest
		if (lastestVersion !== currentVersion) {
			res[item.data.name] = {
				currentVersion,
				lastestVersion
			}
		}
	})
	if (Object.keys(res).length === 0) {
		logGreen('All ssr dpendencies is latest!')
	} else {
		Object.entries(res).forEach(([key, value]) => {
			logGreen(`${key} current version is ${value.currentVersion} latest version is ${value.lastestVersion}`)
		})
	}
}
