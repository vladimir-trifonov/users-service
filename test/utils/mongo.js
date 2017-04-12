'use strict'

// Removes collection from mongo db
const removeCollection = (db, collection) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).remove((err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

module.exports = { removeCollection }
