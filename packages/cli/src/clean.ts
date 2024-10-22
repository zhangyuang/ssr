import { promises } from 'fs'
import { resolve } from 'path'
import { mkdir, rm } from 'shelljs'
import type { Argv } from 'ssr-types'

export const cleanOutDir = async (argv: Argv) => {
	const { accessFile, getCwd } = await import('ssr-common-utils')
	const cwd = getCwd()
	const staticConfigPath = resolve(cwd, './build/staticConfig.js')
	if (!(await accessFile(resolve(cwd, './build')))) {
		mkdir(resolve(cwd, './build'))
	}
	const buildDir = await promises.readdir(resolve(cwd, './build'))
	if (argv.noclean) {
		return
	}
	for (const f of buildDir) {
		const fpath = resolve(cwd, `./build/${f}`)
		if (fpath !== staticConfigPath) {
			rm('-rf', fpath)
		}
	}
	// clean dist folder
	const tsconfigExist = await accessFile(resolve(cwd, './tsconfig.json'))
	if (tsconfigExist && process.env.CLEAN !== 'false') {
		try {
			const outDir = require(resolve(cwd, './tsconfig.json')).compilerOptions.outDir
			rm('-rf', resolve(cwd, outDir))
		} catch (_error) {
			// 有可能 json 文件存在注释导致 require 失败，这里 catch 一下
			console.log('检测到当前目录 tsconfig.json 文件可能存在语法错误')
		}
	}
}
