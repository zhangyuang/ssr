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
    'padded-blocks': ['off'],
    '@typescript-eslint/no-base-to-string': ['off'],
    '@typescript-eslint/restrict-plus-operands': ['off']
  }
}
