module.exports = {
  after (browser, done) {
    browser.end(() => {
      console.info('*--*--*--*--*--*--*--*--*--*--*--*--*')
      console.info('*-- Clossing session... Good bye! --*')
      console.info('*--*--*--*--*--*--*--*--*--*--*--*--*')
      done()
    })
  },
  'hope ssr application can be start succeed': function (browser) {
    browser
      .url('http://localhost:7001')
      .assert.containsText('.author', 'by ykfe')
  },
  'hope csr application can be start succeed': function (browser, done) {
    browser
      .url('http://localhost:8000')
      .assert.containsText('#app', '')
  }
}
