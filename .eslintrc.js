module.exports = {
  root: true,
  extends: [
    'standard-react-ts'
  ],
  parserOptions: {
    project: './tsconfig.base.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/naming-convention': 'off'
  }
}
