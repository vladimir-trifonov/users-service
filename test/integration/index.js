/* eslint-env mocha */
const supertest = require('supertest')
const { events } = require('../../src/')

describe('users-service', () => {
  const api = supertest('http://localhost:3000')

  before((done) => {
    events.on('server:ready', () => done())
  })

  it('should return 200', (done) => {
    api.get('/users')
      .expect(200, done)
  })
})
