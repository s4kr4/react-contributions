const js = require('@eslint/js')
const babelParser = require('@babel/eslint-parser')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
]
