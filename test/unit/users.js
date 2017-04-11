/* eslint-env mocha */
'use strict'

const request = require('supertest')
const should = require('should')

const ObjectID = require('mongodb').ObjectID
const server = require('../../src/server/server')

describe('Users API', () => {
  let app = null
  let testUsers = []
  let store = {}

  let testRepo = {
    getAllUsers () {
      return Promise.resolve(testUsers)
    },
    getUserById (id) {
      return Promise.resolve(testUsers.find(user => user._id === id))
    },
    createUser (user) {
      const index = testUsers.findIndex(user => user.email === user.email)

      if (index !== -1) {
        return Promise.reject(new Error('repository: user exists'))
      }

      const _id = new ObjectID().toString()
      const newUser = Object.assign({}, user, {
        _id,
        created: new Date()
      })
      testUsers = [...testUsers, newUser]
      return Promise.resolve(_id)
    },
    updateUser (id, user) {
      const index = testUsers.findIndex(user => user._id === id)

      if (index === -1) {
        return Promise.resolve(false)
      }

      const updated = Object.assign({}, testUsers[index], user)
      testUsers = [
        ...testUsers.slice(0, index),
        updated,
        ...testUsers.slice(index)
      ]
      return Promise.resolve(true)
    },
    deleteUser (id) {
      const index = testUsers.findIndex(user => user._id === id)

      if (index === -1) {
        return Promise.resolve(false)
      }

      testUsers = testUsers.filter(user => user._id !== id)
      return Promise.resolve(true)
    }
  }

  beforeEach(() => {
    return server.start({
      port: 3000,
      repo: testRepo
    }).then(serv => {
      app = serv
    })
  })

  afterEach(() => {
    app.close()
    app = null
  })

  it('should create user', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'user1@mail.com',
        forename: 'Sam',
        surname: 'Jones'
      })
      .expect((res) => {
        res.body.should.have.property('_id')

        // Save for later usage
        store._id = res.body._id
      })
      .expect(201, done)
  })

  it('should return 409 for an existed user', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'user1@mail.com',
        forename: 'Sam',
        surname: 'Jones'
      })
      .expect(409, done)
  })

  it('should return all users', (done) => {
    request(app)
      .get('/users')
      .expect((res) => {
        res.body.should.be.Array()
        res.body.should.has.lengthOf(1)
      })
      .expect(200, done)
  })

  it('should return 200 for an existed user', (done) => {
    request(app)
      .get(`/users/${store._id}`)
      .expect((res) => {
        res.body.should.be.Object()
        res.body.should.have.property('_id')
        res.body.should.have.property('email', 'user1@mail.com')
        res.body.should.have.property('forename', 'Sam')
        res.body.should.have.property('surname', 'Jones')
        res.body.should.have.property('created')
        res.body.should.have.property('created').String()
      })
      .expect(200, done)
  })

  it('should update the user', (done) => {
    request(app)
      .put(`/users/${store._id}`)
      .send({
        forename: 'Samantha',
        surname: 'Jones'
      })
      .expect(204, done)
  })

  it('should return 404 for a wrong user', (done) => {
    request(app)
      .put(`/users/${new ObjectID().toString()}`)
      .send({
        forename: 'Samantha',
        surname: 'Jones'
      })
      .expect(404, done)
  })

  it('should return error', (done) => {
    request(app)
      .put(`/users/${store._id}`)
      .send({
        email: 'samantha.jones@mail.com'
      })
      .expect(400, done)
  })

  it('should delete the user', (done) => {
    request(app)
      .delete(`/users/${store._id}`)
      .expect(204, done)
  })

  it('should return empty array', (done) => {
    request(app)
      .get('/users')
      .expect((res) => {
        res.body.should.be.Array()
        res.body.should.has.lengthOf(0)
      })
      .expect(200, done)
  })

  it('should return 404 for a not existed user', (done) => {
    request(app)
      .get(`/users/${store._id}`)
      .expect(404, done)
  })

  it('should return 404 for a not existed user', (done) => {
    request(app)
      .delete(`/users/${store._id}`)
      .expect(404, done)
  })
})
