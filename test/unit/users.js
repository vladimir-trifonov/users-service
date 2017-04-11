/* eslint-env mocha */
const request = require('supertest')
const should = require('should')
const server = require('../../src/server/server')

describe('Users API', () => {
  let app = null
  let testUsers = [{
    id: '58ec8a0b3af3f67473e90f4a',
    email: 'user1@mail.com',
    forename: 'Sam',
    surname: 'Jones',
    created: new Date()
  }, {
    id: '58ec8a0b3af3f67473e90f4b',
    email: 'user2@mail.com',
    forename: 'Kim',
    surname: 'Sanders',
    created: new Date()
  }]

  let testRepo = {
    getAllUsers () {
      return Promise.resolve(testUsers)
    },
    getUserById (id) {
      return Promise.resolve(testUsers.find(user => user.id === id))
    },
    createUser (user) {
      testUsers = [...testUsers, user]
      return Promise.resolve(testUsers)
    },
    updateUser (id, user) {
      const index = testUsers.findIndex(user => user.id === id)
      const updated = Object.assign({}, testUsers[index], user)
      testUsers = [
        ...testUsers.slice(0, index),
        updated,
        ...testUsers.slice(index)
      ]
      return Promise.resolve(testUsers)
    },
    deleteUser (id) {
      testUsers = testUsers.filter(user => user.id !== id)
      return Promise.resolve(testUsers)
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

  it('should return all users', (done) => {
    request(app)
      .get('/users')
      .expect((res) => {
        res.body.should.be.Array()
        res.body.should.has.lengthOf(2)
      })
      .expect(200, done)
  })

  it('should return 200 for an existed user', (done) => {
    request(app)
      .get('/users/58ec8a0b3af3f67473e90f4a')
      .expect((res) => {
        res.body.should.be.Object()
        res.body.should.have.property('email', 'user1@mail.com')
        res.body.should.have.property('forename', 'Sam')
        res.body.should.have.property('surname', 'Jones')
        res.body.should.have.property('created')
        res.body.should.have.property('created').String()
      })
      .expect(200, done)
  })
})
