/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
  // rules: {
  //   quotes: [
  //     'error',
  //     'single',
  //     {
  //       allowTemplateLiterals: true,
  //       avoidEscape: true
  //     }
  //   ],
  //   indent: [
  //     'error', 2, {
  //       ignoredNodes: ['TemplateLiteral']
  //     }
  //   ],
  // }
}
