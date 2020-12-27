const webpackError = (err: any) => {
  if (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details)
    }
  }
}

export {
  webpackError
}
