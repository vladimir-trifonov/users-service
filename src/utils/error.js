/*
 * Error handling
 * This error handler logs errors
 */
'use strict'

const bunyan = require('bunyan')
const log = bunyan.createLogger({name: 'users-service', level: 'debug'})

const handle = (err) => {
  // Log to the console
  log.error(err)
}

module.exports = { handle }
