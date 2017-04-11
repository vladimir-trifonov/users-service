'use strict'

const ObjectID = require('mongodb').ObjectID

const repository = (db) => {
  const collection = db.collection('users')

  // Return all users
  const getAllUsers = () => {
    return new Promise((resolve, reject) => {
      const users = []
      const cursor = collection.find({}, { _id: 1, email: 1, forename: 1, surname: 1, created: 1 })

      const addUser = (user) => {
        users.push(user)
      }

      const sendUsers = (err) => {
        if (err) {
          return reject(new Error('repository: cannot fetch users, err: ' + err))
        }

        resolve(users.slice())
      }

      cursor.forEach(addUser, sendUsers)
    })
  }

  // Return one user by id
  const getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const projection = { _id: 1, email: 1, forename: 1, surname: 1, created: 1 }

      const sendUser = (err, user) => {
        if (err) {
          reject(new Error(`repository: cannot fetch user with id ${id}, err: ${err}`))
        }

        resolve(user)
      }

      collection.findOne({ _id: new ObjectID(id) }, projection, sendUser)
    })
  }

  // Create user and return the id of the created user
  const createUser = (user) => {
    return new Promise((resolve, reject) => {
      const payload = {
        email: user.email,
        forename: user.forename,
        surname: user.surname,
        created: new Date()
      }

      collection.insertOne(payload, (err, r) => {
        if (err) {
          reject(new Error('repository: cannot create user, err:' + err))
        }

        // Return the user's id
        resolve(r.insertedId.toString())
      })
    })
  }

  // Update the user and return 'true' if the operation is successful
  // and return false if no record is being updated
  const updateUser = (id, user) => {
    return new Promise((resolve, reject) => {
      collection.updateOne({ _id: new ObjectID(id) }, { $set: user }, (err, r) => {
        if (err) {
          reject(new Error('repository: cannot update user, err:' + err))
        }

        resolve(!!r.result.n)
      })
    })
  }

  // Update the user and return 'true' if the operation is successful
  // and return false if no record is being deleted
  const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
      collection.deleteOne({ _id: new ObjectID(id) }, (err, r) => {
        if (err) {
          reject(new Error('repository: cannot delete user, err:' + err))
        }

        resolve(!!r.result.n)
      })
    })
  }

  const disconnect = () => {
    db.close()
  }

  // Methods
  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    disconnect
  }
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('repository: no db connection was found'))
    }

    resolve(repository(connection))
  })
}

module.exports = { connect }
