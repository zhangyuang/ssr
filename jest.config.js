
module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'
  ]
}
