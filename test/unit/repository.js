/* eslint-env mocha */
'use strict'

const should = require('should')
const sinon = require('sinon')
const test = require('assert')

const repository = require('../../src/repository/repository')
const ObjectID = require('mongodb').ObjectID

describe('Repository', () => {
  let repo
  const collection = {
    find: () => { },
    findOne: () => { },
    insertOne: () => { },
    updateOne: () => { },
    deleteOne: () => { }
  }
  const closeDbSpy = sinon.spy()

  before(async function () {
    repo = await repository.connect({
      collection: () => collection,
      close: closeDbSpy
    })
  })

  it('should connect with a promise', (done) => {
    should(repository.connect({ collection: () => { } })).be.a.Promise()
    done()
  })

  it('should get all users', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const user = {
      _id: new ObjectID().toString(),
      email: 's.jones@gmail.com',
      forename: 'Sam',
      surname: 'Jones',
      created: new Date()
    }
    const users = [user]

    // Stubs
    const findStub = sandbox.stub(collection, 'find').returns([user])
    const forEachStub = sandbox.stub(Array.prototype, 'forEach').callsFake((curr, end) => {
      curr(user)
      end()

      // Immediate restore
      forEachStub.restore()
    })

    // Function call
    repo.getAllUsers()
      .then((users) => {

        // Asserts
        users.should.be.Array()
        users.should.has.lengthOf(1)
        test.ok(findStub.calledOnce)
        test.ok(findStub.calledWith({}, { _id: 1, email: 1, forename: 1, surname: 1, created: 1 }))

        // Restore
        sandbox.restore()

        // End
        done()
      })
      .catch(done)
  })

  it('should return error', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const user = {
      _id: new ObjectID().toString(),
      email: 's.jones@gmail.com',
      forename: 'Sam',
      surname: 'Jones',
      created: new Date()
    }
    const users = [user]

    // Stubs
    const findStub = sandbox.stub(collection, 'find').returns([user])
    const forEachStub = sandbox.stub(Array.prototype, 'forEach').callsFake((curr, end) => {
      curr(user)
      end(new Error('Fail'))

      // Immediate restore
      forEachStub.restore()
    })

    // Function call
    repo.getAllUsers()
      .then(() => {
        done('should not be called')
      })
      .catch((err) => {
        test.ok(err)

        // Restore
        sandbox.restore()

        // End
        done()
      })
  })

  it('should get user by id', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const user = {
      _id: new ObjectID().toString(),
      email: 's.jones@gmail.com',
      forename: 'Sam',
      surname: 'Jones',
      created: new Date()
    }

    // Stubs
    const findOneStub = sandbox.stub(collection, 'findOne').yieldsAsync(null, user)

    // Function call
    repo.getUserById(user._id)
      .then((user) => {

        // Asserts
        user.should.be.Object()
        test.ok(findOneStub.calledOnce)
        test.ok(findOneStub.calledWith({ _id: new ObjectID(user._id) }, { _id: 1, email: 1, forename: 1, surname: 1, created: 1 }))

        // Restore
        sandbox.restore()

        // End
        done()
      })
      .catch(done)
  })

  it('should return error', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const user = {
      _id: new ObjectID().toString(),
      email: 's.jones@gmail.com',
      forename: 'Sam',
      surname: 'Jones',
      created: new Date()
    }

    // Stubs
    const findOneStub = sandbox.stub(collection, 'findOne').yieldsAsync(new Error('fail'))

    // Function call
    repo.getUserById(user._id)
      .then(() => {
        done('should not be called')
      })
      .catch((err) => {
        test.ok(err)

        // Restore
        sandbox.restore()

        // End
        done()
      })
  })

  it('should create user', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const user = {
      email: 's.jones@gmail.com',
      forename: 'Sam',
      surname: 'Jones'
    }

    // Stubs
    const insertOneStub = sandbox.stub(collection, 'insertOne').yieldsAsync(null, {
      insertedId: new ObjectID()
    })
    const findOneStub = sandbox.stub(collection, 'findOne').yieldsAsync(false)

    // Function call
    repo.createUser(user)
      .then((userId) => {

        // Asserts
        userId.should.be.String()
        test.ok(insertOneStub.calledOnce)
        test.ok(findOneStub.calledOnce)

        // Restore
        sandbox.restore()

        // End
        done()
      })
      .catch(done)
  })

  it('should return error', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const user = {
      email: 's.jones@gmail.com',
      forename: 'Sam',
      surname: 'Jones'
    }

    // Stubs
    const findOneStub = sandbox.stub(collection, 'findOne').yieldsAsync(true)

    // Function call
    repo.createUser(user)
      .catch((err) => {
        test.ok(err)
        test.ok(findOneStub.calledOnce)

        // Restore
        sandbox.restore()

        // End
        done()
      })
  })

  it('should update user', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const userId = new ObjectID().toString()
    const user = {
      forename: 'Sam',
      surname: 'Jones'
    }

    // Stubs
    const updateOneStub = sandbox.stub(collection, 'updateOne').yieldsAsync(null, {
      result: {
        n: 1
      }
    })

    // Function call
    repo.updateUser(userId, user)
      .then((updated) => {

        // Asserts
        test.equal(updated, true)
        test.ok(updateOneStub.calledOnce)
        test.ok(updateOneStub.calledWith({ _id: new ObjectID(userId) }, { $set: user }))

        // Restore
        sandbox.restore()

        // End
        done()
      })
      .catch(done)
  })

  it('should return error', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const userId = new ObjectID().toString()
    const user = {
      forename: 'Sam',
      surname: 'Jones'
    }

    // Stubs
    const updateOneStub = sandbox.stub(collection, 'updateOne').yieldsAsync(new Error('Fail'))

    // Function call
    repo.updateUser(userId, user)
      .catch((err) => {
        test.ok(err)
        test.ok(updateOneStub.calledOnce)

        // Restore
        sandbox.restore()

        // End
        done()
      })
  })

  it('should delete user', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const userId = new ObjectID().toString()

    // Stubs
    const deleteOneStub = sandbox.stub(collection, 'deleteOne').yieldsAsync(null, {
      result: {
        n: 1
      }
    })

    // Function call
    repo.deleteUser(userId)
      .then((deleted) => {

        // Asserts
        test.equal(deleted, true)
        test.ok(deleteOneStub.calledOnce)
        test.ok(deleteOneStub.calledWith({ _id: new ObjectID(userId) }))

        // Restore
        sandbox.restore()

        // End
        done()
      })
      .catch(done)
  })

  it('should return error', (done) => {
    const sandbox = sinon.sandbox.create()

    // Test data
    const userId = new ObjectID().toString()

    // Stubs
    const deleteOneStub = sandbox.stub(collection, 'deleteOne').yieldsAsync(new Error('Fail'))

    // Function call
    repo.deleteUser(userId)
      .catch((err) => {
        test.ok(err)
        test.ok(deleteOneStub.calledOnce)

        // Restore
        sandbox.restore()

        // End
        done()
      })
  })

  it('should disconnect', (done) => {
    // Function call
    repo.disconnect()
    test.ok(closeDbSpy.calledOnce)
    done()
  })
})
