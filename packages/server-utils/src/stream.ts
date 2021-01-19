const stream = require('readable-stream')

class StringStream extends stream.Readable {
  constructor (str: string) {
    super()
    this._str = str
    this._encoding = 'utf8'
  }

  _read () {
    if (!this.ended) {
      process.nextTick(() => {
        this.push(Buffer.from(this._str, this._encoding))
        this.push(null)
      })
      this.ended = true
    }
  }
}

export {
  StringStream
}
