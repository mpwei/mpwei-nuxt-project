module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
	  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'no-unused-vars': 'off',
	  'vue/html-indent': 'off',
	  'vue/html-closing-bracket-newline': 'off',
	  'indent': 'off',
	  'no-tabs': 'off',
	  'no-mixed-spaces-and-tabs': 'off'
  }
}