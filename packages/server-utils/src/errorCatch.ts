const processError = (err: any) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
}

export {
  processError
}
