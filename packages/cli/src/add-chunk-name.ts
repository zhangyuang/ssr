import { promises } from 'fs'
import { resolve } from 'path'
import { parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string'

const webpackCommentRegExp = /webpackChunkName:\s?"(.*)?"\s?\*/
export const addChunkNameInQuery = (source: string) => {
	let str = new MagicString(source)
	const imports = parseImports(source)[0]
	for (let index = 0; index < imports.length; index++) {
		const { s: start, e: end, se: statementEnd } = imports[index]
		const rawUrl = source.slice(start, end)
		const chunkName = webpackCommentRegExp.exec(rawUrl)?.[1]
		if (rawUrl.includes('layout') || rawUrl.includes('App') || rawUrl.includes('store')) {
			str = str.appendRight(statementEnd - 1, '?chunkName=Page')
		} else if (chunkName) {
			str = str.appendRight(statementEnd - (rawUrl.includes('\n') ? 2 : 1), `?chunkName=${chunkName}`)
		} else {
			str = str.appendRight(statementEnd - 1, '?chunkName=Page')
		}
	}
	return str.toString()
}

export const addChunkNameInRoutes = async () => {
	const { getCwd } = await import('ssr-common-utils')
	const cwd = getCwd()
	const declareRoutes = await promises.readFile(resolve(cwd, './build/ssr-declare-routes.js'), 'utf-8')
	await promises.writeFile(resolve(cwd, './build/ssr-declare-routes.js'), addChunkNameInQuery(declareRoutes))
	const manualRoutes = await promises.readFile(resolve(cwd, './build/ssr-manual-routes.js'), 'utf-8')
	await promises.writeFile(resolve(cwd, './build/ssr-manual-routes.js'), addChunkNameInQuery(manualRoutes))
}
