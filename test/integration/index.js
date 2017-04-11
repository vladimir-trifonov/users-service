/* eslint-env mocha */
'use strict'

const supertest = require('supertest')
const should = require('should')

const ObjectID = require('mongodb').ObjectID
const { events } = require('../../src/')
const { removeCollection } = require('../utils/mongo')

describe('users-service', () => {
  let store = {}
  const api = supertest('http://localhost:3000')

  before((done) => {
    events.on('server:ready', async function ({ db }) {
      await removeCollection(db, 'users')
      done()
    })
  })

  it('should return 200', (done) => {
    api.get('/users')
      .expect(200, done)
  })

  it('should create user', (done) => {
    api.post('/users')
      .send({
        email: 's.jones@gmail.com',
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
    api.post('/users')
      .send({
        email: 's.jones@gmail.com',
        forename: 'Sam',
        surname: 'Jones'
      })
      .expect(409, done)
  })

  it('should return all users', (done) => {
    api.get('/users')
      .expect((res) => {
        res.body.should.be.Array()
        res.body.should.has.lengthOf(1)
      })
      .expect(200, done)
  })

  it('should return 200 for an existed user', (done) => {
    api.get(`/users/${store._id}`)
      .expect((res) => {
        res.body.should.be.Object()
        res.body.should.have.property('_id')
        res.body.should.have.property('email', 's.jones@gmail.com')
        res.body.should.have.property('forename', 'Sam')
        res.body.should.have.property('surname', 'Jones')
        res.body.should.have.property('created')
        res.body.should.have.property('created').String()
      })
      .expect(200, done)
  })

  it('should update the user', (done) => {
    api.put(`/users/${store._id}`)
      .send({
        forename: 'Samantha',
        surname: 'Jones'
      })
      .expect(204, done)
  })

  it('should return 404 for a wrong user', (done) => {
    api.put(`/users/${new ObjectID().toString()}`)
      .send({
        forename: 'Samantha',
        surname: 'Jones'
      })
      .expect(404, done)
  })

  it('should return error', (done) => {
    api.put(`/users/${store._id}`)
      .send({
        email: 'samantha.jones@mail.com'
      })
      .expect(400, done)
  })

  it('should delete the user', (done) => {
    api.delete(`/users/${store._id}`)
      .expect(204, done)
  })

  it('should return empty array', (done) => {
    api.get('/users')
      .expect((res) => {
        res.body.should.be.Array()
        res.body.should.has.lengthOf(0)
      })
      .expect(200, done)
  })

  it('should return 404 for a not existed user', (done) => {
    api.get(`/users/${store._id}`)
      .expect(404, done)
  })

  it('should return 404 for a not existed user', (done) => {
    api.delete(`/users/${store._id}`)
      .expect(404, done)
  })
})
