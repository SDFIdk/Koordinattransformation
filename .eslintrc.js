module.exports = {
  root: true,
  env: {
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': import.meta.env.NODE_ENV !== 'production' ? 'off' : 'error',
    'no-debugger': import.meta.env.NODE_ENV !== 'production' ? 'off' : 'error',
    'vue/no-parsing-error': [2, {
      'x-invalid-namespace': false
    }]
  }
}
