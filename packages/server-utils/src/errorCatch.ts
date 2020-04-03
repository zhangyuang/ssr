const processError = err => {
  if (err) {
    console.log(err)
    process.exit(0)
  }
}

export {
  processError
}
