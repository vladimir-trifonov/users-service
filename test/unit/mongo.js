/* eslint-env mocha */
const test = require('assert')
const mongo = require('../../src/config/mongo')
const { dbTestSettings } = require('../../src/config/config')

describe('Mongo Connection', () => {
  it('should return db', (done) => {
    mongo.connect(dbTestSettings)
      .then((db) => {
        test.ok(db)
        done()
      })
  })
})
