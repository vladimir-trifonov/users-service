'use strict'

// HTTP status codes
const status = require('http-status')
const Joi = require('joi')
const Celebrate = require('celebrate')

Joi.objectId = require('joi-objectid')(Joi)

module.exports = (app, options) => {
  const { repo } = options

  // Return all users
  app.get('/users', async function (req, res, next) {
    try {
      const users = await repo.getAllUsers()
      res.status(status.OK).json(users)
    } catch (err) {
      next(err)
    }
  })

  // Return user by id
  app.get('/users/:id',
    Celebrate({
      params: {
        id: Joi.objectId()
      }
    }),
    async function (req, res, next) {
      try {
        const user = await repo.getUserById(req.params.id)

        if (!user) {
          // User was not found
          return res.sendStatus(status.NOT_FOUND)
        }

        res.status(status.OK).json(user)
      } catch (err) {
        next(err)
      }
    })

  // Create user
  app.post('/users',
    Celebrate({
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        forename: Joi.string().required(),
        surname: Joi.string().required()
      })
    }),
    async function (req, res, next) {
      try {
        const userId = await repo.createUser(req.body)
        res.status(status.CREATED).json({ _id: userId })
      } catch (err) {
        if (err.message === 'repository: user exists') {
          return res.sendStatus(status.CONFLICT)
        }

        next(err)
      }
    })

  // Update user
  app.put('/users/:id',
    Celebrate({
      body: Joi.object().keys({
        forename: Joi.string().min(1),
        surname: Joi.string().min(1)
      }),
      params: {
        id: Joi.objectId()
      }
    }),
    async function (req, res, next) {
      try {
        const isUpdated = await repo.updateUser(req.params.id, req.body)

        if (!isUpdated) {
          // User was not found
          return res.sendStatus(status.NOT_FOUND)
        }

        res.sendStatus(status.NO_CONTENT)
      } catch (err) {
        next(err)
      }
    })

  // Delete user
  app.delete('/users/:id',
    Celebrate({
      params: {
        id: Joi.objectId()
      }
    }),
    async function (req, res, next) {
      try {
        const isDeleted = await repo.deleteUser(req.params.id)

        if (!isDeleted) {
          // User was not found
          return res.sendStatus(status.NOT_FOUND)
        }

        res.sendStatus(status.NO_CONTENT)
      } catch (err) {
        next(err)
      }
    })
}
