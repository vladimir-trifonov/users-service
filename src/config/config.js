'use strict'

const dbSettings = {
  // MongoDB config
  db: process.env.DB || 'users',
  user: process.env.DB_USER || 'users-service',
  pass: process.env.DB_PASS || 'users-service-pass',
  server: process.env.DB_HOST || 'localhost:27017'
}

const serverSettings = {
  port: process.env.PORT || 3000
}

module.exports = { dbSettings, serverSettings }
