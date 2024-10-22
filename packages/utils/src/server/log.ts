const logGreen = (text: string) => {
	console.log('\x1b[32m%s\x1b[0m', text)
}
const logWarning = (text: string) => {
	console.log('\x1b[33m%s\x1b[0m', text)
}
const logRed = (text: string) => {
	console.log('\x1b[31m%s\x1b[0m', text)
}

const logErr = logRed
const logInfo = logGreen

export { logGreen, logRed, logErr, logInfo, logWarning }
