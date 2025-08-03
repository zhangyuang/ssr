import { join } from 'path'
import { SemVer, coerce } from 'semver'
import type { IConfig, UserConfig } from 'ssr-types'
import type { StatsOptions, DevServer } from '@rspack/core'
import { normalizeEndPath, normalizeStartPath } from '../common'
import { accessFileSync, checkModuleExist, getCwd, getFeDir, getUserConfig, addDefaultAlias, judgeFramework, loadModuleFromFramework, stringifyDefine } from './cwd'

const loadConfig = (): IConfig => {
	const cwd = getCwd()
	const framework = judgeFramework()
	const userConfig = getUserConfig()
	const mode = 'ssr'
	const stream = false
	const tool = userConfig.tool || process.env.BUILD_TOOL || (accessFileSync(join(cwd, './build/tag.json')) ? 'vite' : undefined)
	const optimize = process.env.OPTIMIZE === '1'
	const isCI = !!process.env.CI_TEST
	const supportOptinalChaining = coerce(process.version)!.major >= 14
	const define = userConfig.define ?? {}
	const defaultBrowserTarget = {
		chrome: '60',
		firefox: '60',
		ie: '9',
		safari: '10',
		edge: '17'
	}
	userConfig.define && stringifyDefine(define)
	if (framework === 'ssr-plugin-vue3') {
		define.base = {
			...define.base,
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: process.env.NODE_ENV === 'development' ? 'true' : 'false'
		}
	}
	const alias: Record<string, string> = {
		'@': getFeDir(),
		'~': getCwd(),
		'~/src': join(cwd, './src'),
		_build: join(cwd, './build')
	}

	type ClientLogLevel = 'error'
	const publicPath = userConfig.publicPath?.startsWith('http') ? userConfig.publicPath : normalizeStartPath(userConfig.publicPath ?? '/')

	const devPublicPath = publicPath.startsWith('http') ? publicPath.replace(/^http(s)?:\/\/(.*)?\d/, '') : publicPath // 本地开发不使用 http://localhost:3000 这样的 path 赋值给 webpack-dev-server 会很难处理

	const moduleFileExtensions = ['.web.mjs', '.mjs', '.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json', '.web.jsx', '.jsx', '.vue', '.css']
	const isDev = userConfig.isDev ?? process.env.NODE_ENV !== 'production'
	const fePort = userConfig.fePort ?? 8999
	const clientHistoryRouterMode = 'webHistory'
	const hmr = Object.assign(
		{
			protocol: 'ws'
		},
		userConfig.hmr
	)

	let https = userConfig.https ? userConfig.https : !!process.env.HTTPS

	if (!((typeof https === 'boolean' && https) || (typeof https === 'object' && Object.keys(https).length !== 0))) {
		https = false
	}

	const serverPort = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000

	const host = hmr?.host ?? '127.0.0.1'

	const chunkName = 'Page'

	const clientLogLevel: ClientLogLevel = 'error'
	const useHash = !isDev // 生产环境默认生成hash
	const defaultWhiteList: Array<RegExp | string> = [/\.(css|less|sass|scss)$/, /vant.*?style/, /antd.*?(style)/, /ant-design-vue.*?(style)/, /store$/, /\.(vue)$/]
	const whiteList: Array<RegExp | string> = defaultWhiteList.concat(userConfig.whiteList ?? [])
	const jsOrder = tool === 'vite' ? [`rolldown-runtime.js`, `${chunkName}.js`] : [`runtime~${chunkName}.js`, 'vendor.js', 'common-vendor.js', 'layout-app~vendor.js', `${chunkName}.js`, 'layout-app.js']

	const cssOrder = ['vendor.css', 'common-vendor.css', 'layout-app~vendor.css', `${chunkName}.css`, 'layout-app.css']

	const webpackStatsOption: StatsOptions = {
		assets: true, // 添加资源信息
		cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
		children: false, // 添加 children 信息
		chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
		colors: true, // 以不同颜色区分构建信息
		modules: false, // 添加构建模块信息
		warnings: false,
		entrypoints: false
	}
	const dynamic = true
	// ref https://www.babeljs.cn/docs/babel-preset-env#corejs
	const corejsVersion = checkModuleExist('core-js/package.json') ? coerce(require(loadModuleFromFramework('core-js/package.json')).version) : {}
	const { major, minor } = corejsVersion as SemVer

	const corejsOptions = userConfig.corejs
		? {
				corejs: {
					version: `${major}.${minor}`,
					proposals: major === 3
				},
				targets: defaultBrowserTarget,
				useBuiltIns: 'usage',
				shippedProposals: major === 2,
				...userConfig.corejsOptions
			}
		: {}

	const writeDebounceTime = 2000
	const allowedHosts = ['127.0.0.1', 'localhost', '0.0.0.0']
	const webpackDevServerConfig = Object.assign(
		{
			stats: webpackStatsOption,
			disableInfo: true, // 关闭webpack-dev-server 自带的server Info信息
			disableHostCheck: true,
			publicPath: devPublicPath,
			hotOnly: true,
			host,
			sockHost: host,
			sockPort: hmr?.port ?? fePort,
			hot: true,
			port: hmr?.port ?? fePort,
			https,
			allowedHosts,
			clientLogLevel: clientLogLevel,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
			}
		},
		userConfig.webpackDevServerConfig
	)

	const rspackDevServerConfig: DevServer = {
		host,
		devMiddleware: {
			publicPath: devPublicPath,
			stats: webpackStatsOption
		},
		allowedHosts,
		hot: true,
		port: hmr?.port ?? fePort,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
		}
	}
	const chainBaseConfig = () => {
		// 覆盖默认webpack配置
	}
	const chainClientConfig = () => {
		// 覆盖默认 client webpack配置
	}
	const chainServerConfig = () => {
		// 覆盖默认 server webpack配置
	}
	const assetsDir = userConfig.assetsDir ?? 'static'
	const manifestPath = `${normalizeEndPath(devPublicPath)}asset-manifest.json`
	const staticPath = `${normalizeEndPath(devPublicPath)}${assetsDir}`
	const hotUpdatePath = `${normalizeEndPath(devPublicPath)}*.hot-update**`
	const proxyKey = [staticPath, hotUpdatePath, manifestPath]
	const prefix = '/'
	const dynamicFile = {
		serverBundle: join(cwd, `./build/server/${chunkName}.server.js`),
		assetManifest: join(cwd, './build/client/asset-manifest.json'),
		asyncChunkMap: join(cwd, './build/asyncChunkMap.json')
	}
	const babelExtraModule: UserConfig['babelExtraModule'] = [/ssr-plugin-vue3/, /ssr-client-utils/, /ssr-hoc-vue/, /vue/, /ssr-common-utils/, /ssr-plugin-vue/, /ssr-plugin-react/, /ssr-hoc-react/, /ssr-hoc-vue3/]
	const staticConfigPath = ''
	const getOutput = () => {}
	const rootId = '#app'
	const isVite = tool === 'vite'
	const config = Object.assign(
		{},
		{
			chainBaseConfig,
			chainServerConfig,
			chainClientConfig,
			cwd,
			isDev,
			getOutput,
			publicPath,
			useHash,
			host,
			moduleFileExtensions,
			fePort,
			serverPort,
			chunkName,
			jsOrder,
			cssOrder,
			webpackStatsOption,
			dynamic,
			mode,
			stream,
			https,
			manifestPath,
			proxyKey,
			isVite,
			whiteList,
			isCI,
			tool,
			supportOptinalChaining,
			define,
			prefix,
			optimize,
			writeDebounceTime,
			dynamicFile,
			babelExtraModule,
			rootId,
			staticConfigPath,
			clientHistoryRouterMode,
			defaultBrowserTarget
		},
		userConfig
	)
	config.staticConfigPath = join(config.cwd, './build/staticConfig.js')
	config.getOutput = () => ({
		clientOutPut: join(cwd, './build/client'),
		serverOutPut: join(cwd, './build/server')
	})
	config.assetsDir = assetsDir

	if (config.tool !== 'vite') {
		addDefaultAlias(alias)
	}
	config.alias = alias
	config.prefix = normalizeStartPath(config.prefix ?? '/')
	config.corejsOptions = corejsOptions
	config.whiteList = whiteList
	config.hmr = hmr
	config.webpackDevServerConfig = webpackDevServerConfig // 防止把整个 webpackDevServerConfig 全量覆盖了
	config.rspackDevServerConfig = rspackDevServerConfig
	config.babelOptions = userConfig.babelOptions
		? {
				...{
					babelHelpers: 'bundled' as 'bundled',
					exclude: /node_modules|\.(css|less|sass)/,
					extensions: ['.ts', '.vue', '.tsx', '.js']
				},
				...userConfig.babelOptions
			}
		: undefined

	return config
}

export { loadConfig }
