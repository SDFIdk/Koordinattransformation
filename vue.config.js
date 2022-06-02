const { defineConfig } = require('@vue/cli-service')
require('dotenv').config({ path: `../.env.${ process?.env?.NODE_ENV || '' }` })
module.exports = defineConfig({
  transpileDependencies: true
})
