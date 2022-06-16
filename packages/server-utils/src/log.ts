const logGreen = (text: string) => {
  console.log(`\x1B[32m ${text}`)
}
const logWarning = (text: string) => {
  console.log(`\x1B[33m ${text}`)
}
const logRed = (text: string) => {
  console.log(`\x1B[31m ${text}`)
}

const logErr = logRed
const logInfo = logGreen

export {
  logGreen,
  logRed,
  logErr,
  logInfo,
  logWarning
}
