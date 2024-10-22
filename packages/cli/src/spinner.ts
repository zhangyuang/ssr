const spinner = require('ora')('Starting')

interface Message {
	message: 'start' | 'stop'
}

process.on('message', (data: Message) => {
	const { message } = data
	if (message === 'start') {
		spinner.start()
	} else {
		spinner.stop()
		process.exit()
	}
})
