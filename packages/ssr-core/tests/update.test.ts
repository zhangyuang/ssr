import { updateCli } from '../src/update'

jest.mock('../src/util/index', () => ({
  execWithPromise: jest.fn(() => Promise.resolve({
    stdout: 'stdout'
  })),
  getWithPromise: jest.requireActual('../src/util').getWithPromise,
  resolveApp: jest.requireActual('../src/util').resolveApp
}))
jest.mock('ora')

// @ts-ignore
const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {
  //
})
// @ts-ignore
jest.spyOn(process, 'exit').mockImplementation(() => {
  //
})

jest.mock('../package.json', jest.fn().mockReturnValueOnce({
  version: '1.0.0'
}).mockReturnValueOnce({}))

const spinner = require('ora')

describe('test update' ,() => {
  beforeEach(() => {
    jest.resetModules()
  })
  test('hope update cli can be invoke', async () => {
    await updateCli()
    expect(spinner.start).toBeCalled()
    expect(spinner.succeed).toBeCalled()
  })
  test('throw error should log info', async () => {
    await updateCli()
    expect(mockLog).toBeCalled()
  })
})
