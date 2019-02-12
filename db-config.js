// config files:
const defaultConfig = './db-config-default.js'
const overrideConfig = './db-config-override.js'
const testConfig = './db-config-test.js'

const fs = require('fs')

var config = null

if (process.env.NODE_ENV === 'test') {
  console.log(`Load ${testConfig}...`)
  config = require(testConfig)
} else {
  console.log(`Load ${defaultConfig}...`)
  config = require(defaultConfig)
  try {
    if (fs.statSync(overrideConfig).isFile()) {
      console.log(`Load ${overrideConfig}...`)
      config = Object.assign(config, require(overrideConfig))
    }
  } catch (err) {
    console.log(`Cannot load ${overrideConfig}.`)
  }
}

module.exports = config
