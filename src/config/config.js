'use strict'

const dbSettings = {
  // MongoDB config
  db: process.env.DB || 'users',
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  server: process.env.DB_SERVER || 'mongo:27017',
  auth: process.env.DB_AUTH || false
}

const dbTestSettings = {
  // MongoDB config
  db: process.env.DB || 'users-test',
  server: process.env.DB_SERVER || 'localhost:27017',
  auth: false
}

const serverSettings = {
  port: process.env.PORT || 3000
}

module.exports = { dbSettings, dbTestSettings, serverSettings }
