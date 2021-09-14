module.exports = {
  root: true,
  extends: [
    'standard-vue-ts',
    'standard-react-ts'
  ],
  parserOptions: {
    project: './tsconfig.lint.json'
  },
  globals: {
    context: true,
    beforeEach: true,
    afterEach: true,
    Cypress,
    cy: true,
    expect: true,
    it: true,
    describe: true
  }
}
