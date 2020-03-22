import shell from 'shelljs'
import fs from 'fs'
import { checkRepeat } from '../src/check'

console.log = jest.fn()
jest.mock('inquirer', () => ({
  prompt: jest.fn().mockReturnValueOnce({
    delete: true
  }).mockReturnValueOnce({
    delete: false
  })
}))
// @ts-ignore
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  //
})

describe('test checkRepet', () => {
  beforeEach(() => {
    shell.mkdir('./app')
  })
  test('hope checkRepeat can be invoke', async () => {
    const inquirer = require('inquirer')
    await checkRepeat({
      appName: 'app',
      language: 'javascript'
    })
    expect(inquirer.prompt).toBeCalled()
    fs.stat('./app', err => {
      expect(err).not.toBe(undefined)
    })
  })
  test('hope checkRepeat can be invoke', async () => {
    const inquirer = require('inquirer')
    await checkRepeat({
      appName: 'app',
      language: 'javascript'
    })
    expect(inquirer.prompt).toBeCalled()
    expect(mockExit).toBeCalled()
    fs.stat('./app', err => {
      expect(err).not.toBe(undefined)
    })
  })
  afterEach(() => {
    shell.rm('-rf', './app')
  })
})
