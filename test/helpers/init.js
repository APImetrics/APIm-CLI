const path = require('path')
process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
process.env.NODE_ENV = 'development'
process.env.APIMETRICS_DEBUG = 1

global.oclif = global.oclif || {}
global.oclif.columns = 80
