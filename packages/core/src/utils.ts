import { ISSRContext, UserConfig } from 'ssr-types'

export const getCustomScript = (script: UserConfig['customeHeadScript'], ctx: ISSRContext) => {
	return Array.isArray(script) ? script : (script?.(ctx) ?? [])
}
