import webpackChain from 'webpack-chain'

export const serverConfigChain = () => {
	const chain = new webpackChain()
	return chain
}
export const clientConfigChain = () => {
	const chain = new webpackChain()
	return chain
}
