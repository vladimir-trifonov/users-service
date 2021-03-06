/*
 * Server
 * Express server init settings and apis initialization
 */
'use strict'

const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const Celebrate = require('celebrate')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../docs/swagger.json')
const error = require('../utils/error')
const userAPI = require('../api/users')

const start = (options) => {
  return new Promise((resolve, reject) => {
    // Check if repo is set in option
    if (!options.repo) {
      reject(new Error('server: [options] no repository specified'))
    }
    // Check if port is set in options
    if (!options.port) {
      reject(new Error('server: [options] no port specified'))
    }

    // Create express server
    const app = express()

    // Adds middleware to serve the Swagger UI bound to a Swagger document
    // This acts as living documentation for the API hosted from within the app
    // By default the Swagger Explorer bar is hidden, to display it pass true as the second parameter to the setup function
    const showExplorer = true
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, showExplorer, { validatorUrl: null }))

    // Parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // Parse application/json
    app.use(bodyParser.json())

    // Enables Access-Control-Allow-Origin CORS requests
    app.use(cors())

    // Help secure the app with various HTTP headers
    app.use(helmet())

    // Add user's api to the express app
    userAPI(app, options)

    // Handling inputs validation errors
    app.use(Celebrate.errors())

    // Express error handling
    app.use((err, req, res, next) => {
      // Log the error
      error.handle(err)
      // Notify the client
      res.sendStatus(500)
    })

    // Start the server and return the instance
    const server = app.listen(options.port, () => resolve(server))
  })
}

module.exports = { start }
