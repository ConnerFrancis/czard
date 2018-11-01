/**
 * Rooms API
 */

import { OperationError } from '@/error'
import db from '@/db'

const getters = {
  test: 'test',
  oh: 'my god'
}

const setters = {
  // Create a new room
  async createRoom (data) {
    await db.collection('rooms').add(data)
      .then(docRef => {
        console.log('#db.rooms.createRoom()# Room with id [' + docRef.id + '] created.')
        // Catch the id with a promise
        return docRef.id
      })
      .catch(e => {
        throw new OperationError(e.code, e.message)
      })
  }
}

// Combine the modules
export default {
  ...getters,
  ...setters,
  hey: 'why no work?'
}
