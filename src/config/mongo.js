'use strict'

const MongoClient = require('mongodb')

// Create connection string
const getMongoURL = (options) => {
  return `mongodb://${options.server}/${options.db}`
}

// Connect to the mongoDb
const connect = (options) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(getMongoURL(options), {}, (err, db) => {
      if (err) {
        return reject(new Error('db: ' + err))
      }

      if (!options.auth) {
        // The db is ready
        return resolve(db)
      }

      // Login with specific user and password
      db.admin().authenticate(options.user, options.pass, (err, result) => {
        if (err) {
          return reject(new Error('db: ' + err))
        }

        // The db is ready
        resolve(db)
      })
    })
  })
}

module.exports = { connect }
