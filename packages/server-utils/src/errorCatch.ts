const processError = (err: any) => {
  if (err) {
    console.log(err)
    process.exit(0)
  }
}

export {
  processError
}
