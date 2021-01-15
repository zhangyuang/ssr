const spinner = require('ora')('正在构建')

process.on('message', (data) => {
  const { message } = data
  if (message === 'start') {
    spinner.start()
  } else {
    spinner.stop()
  }
})
