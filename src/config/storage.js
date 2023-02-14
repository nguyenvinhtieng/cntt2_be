const credentials = require('../credentials')

const { Storage } = require('megajs')
module.exoprts = new Storage({
  email: credentials.mega_config.email,
  password: credentials.mega_config.password,
  userAgent: 'ExampleClient/1.0'
})

