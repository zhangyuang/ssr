import type { Arguments } from 'yargs'

export type Argv = Arguments<{
	tencent?: boolean
	tool?: string
	noclean?: boolean
	showArgs?: boolean
	analyze?: boolean
	html?: boolean
	port?: string | number
	react?: boolean
	web?: boolean
	api?: boolean
	ssg?: boolean
	ssl?: boolean
	bc?: boolean
	bcp?: string
	sourcemap?: string
	'client-sourcemap'?: string
	'server-sourcemap'?: string
	viteMode?: string
}>
