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
    Cypress: true,
    cy: true,
    expect: true,
    it: true,
    describe: true
  },
  rules: {
    '@typescript-eslint/dot-notation': ['off'],
    'padded-blocks': ['off']
  }
}
