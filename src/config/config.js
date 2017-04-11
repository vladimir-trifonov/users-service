'use strict'

const dbSettings = {
  // MongoDB config
  db: process.env.DB || 'users',
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  auth: process.env.DB_AUTH || false,
  server: process.env.DB_SERVER || 'localhost:27017'
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
