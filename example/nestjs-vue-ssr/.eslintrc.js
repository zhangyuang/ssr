module.exports = {
  root: true,
  extends: [
    'standard-vue-ts'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn']
  },
  parserOptions: {
    project: './tsconfig.lint.json'
  }
}
