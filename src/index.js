'use strict'

const { EventEmitter } = require('events')
const events = new EventEmitter()
const server = require('./server/server')
const repository = require('./repository/repository')
const config = require('./config/')
const error = require('./utils/error')

// Error handling - on unhandled promise rejection
process.on('unhandledRejection', function (reason, p) {
  // Will be handled by uncaughtException err handler
  throw reason
})

// Error handling - on uncaught exception
process.on('uncaughtException', async function (err) {
  error.handle(err)
  // Stop the process and exit
  process.exit(1)
})

async function start () {
  try {
    const db = await config.db.connect(config.dbSettings)
    const repo = await repository.connect(db)

    // Start server
    const app = await server.start({
      port: config.serverSettings.port,
      repo
    })

    // Server is ready
    events.emit('server:ready', { app, db })

    // Disconnect the db on app exit
    app.on('close', repo.disconnect)
  } catch (err) {
    error.handle(err)
  }
}

// Start the server
start()

module.exports = { events }
