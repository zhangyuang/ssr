module.exports = {
  root: true,
  extends: [
    'standard-react-ts'
  ],
  parserOptions: {
    project: './tsconfig.lint.json'
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off'
  }
}
