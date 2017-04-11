/* eslint-env mocha */
'use strict'

const should = require('should')
const repository = require('../../src/repository/repository')

describe('Repository', () => {
  it('should connect with a promise', (done) => {
    should(repository.connect({collection: () => {}})).be.a.Promise()
    done()
  })
})
