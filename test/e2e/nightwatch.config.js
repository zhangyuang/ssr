const chrome = require('chromedriver')

module.exports = {
  src_folders: ['test/e2e/specs'],
  webdriver: {
    start_process: true,
    server_path: chrome.path,
    port: 9515
  },
  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['headless']
        }
      }
    }
  }
}
