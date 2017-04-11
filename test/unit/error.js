/* eslint-env mocha */
const test = require('assert')
const sinon = require('sinon')
const bunyan = require('bunyan')

const sandbox = sinon.sandbox.create()
const logErrorSpy = sandbox.spy()

sandbox.stub(bunyan, 'createLogger').returns({ error: logErrorSpy })
const error = require('../../src/utils/error')

describe('Error', () => {
  afterEach(() => {
    sandbox.restore()
  })

  beforeEach(() => {
    sandbox.reset()
  })

  it('should log error', (done) => {
    error.handle(new Error('Fail'))
    test.ok(logErrorSpy.calledOnce)
    done()
  })
})
