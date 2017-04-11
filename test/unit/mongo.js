/* eslint-env mocha */
'use strict'

const test = require('assert')
const sinon = require('sinon')
const MongoClient = require('mongodb')

const mongo = require('../../src/config/mongo')

const dbTestSettings = {
  // MongoDB config
  db: process.env.DB || 'users-test',
  server: process.env.DB_SERVER || 'localhost:27017',
  auth: false
}

describe('Mongo Connection', () => {
  it('should return db', (done) => {
    const usersDb = {}
    const sandbox = sinon.sandbox.create()
    const connectStub = sandbox.stub(MongoClient, 'connect').yieldsAsync(null, usersDb)

    mongo.connect(dbTestSettings)
      .then((db) => {
        test.ok(db)
        test.equal(db, usersDb)
        test.ok(connectStub.calledOnce)

        // Restore
        sandbox.restore()

        done()
      })
  })

  it('should return error', (done) => {
    const sandbox = sinon.sandbox.create()
    const connectStub = sandbox.stub(MongoClient, 'connect').yieldsAsync(new Error('Failed to connect'))

    mongo.connect(dbTestSettings)
      .catch((err) => {
        test.ok(err)
        test.ok(connectStub.calledOnce)

        // Restore
        sandbox.restore()

        done()
      })
  })

  it('should return db', (done) => {
    const usersDb = {
      admin: () => {
        return {
          authenticate: authenticateStub
        }
      }
    }
    const sandbox = sinon.sandbox.create()
    const authenticateStub = sandbox.stub().yieldsAsync(new Error('Failed to authenticate'))
    const connectStub = sandbox.stub(MongoClient, 'connect').yieldsAsync(null, usersDb)

    mongo.connect(Object.assign({},
      dbTestSettings,
      {
        auth: true,
        user: 'admin',
        pass: 'samplepass'
      }))
      .catch((err) => {
        test.ok(err)
        test.ok(connectStub.calledOnce)

        // Restore
        sandbox.restore()

        done()
      })
  })

  it('should return error', (done) => {
    const usersDb = {
      admin: () => {
        return {
          authenticate: authenticateStub
        }
      }
    }
    const sandbox = sinon.sandbox.create()
    const authenticateStub = sandbox.stub().yieldsAsync(null, usersDb)
    const connectStub = sandbox.stub(MongoClient, 'connect').yieldsAsync(null, usersDb)

    mongo.connect(Object.assign({},
      dbTestSettings,
      {
        auth: true,
        user: 'admin',
        pass: 'samplepass'
      }))
      .then((db) => {
        test.ok(db)
        test.equal(db, usersDb)
        test.ok(connectStub.calledOnce)
        test.ok(authenticateStub.calledOnce)

        // Restore
        sandbox.restore()

        done()
      })
  })
})
