/**
 * Rooms API
 */

import Vue from 'vue'
import db from '@/db'

const ref = db.collection('rooms')

const getters = {
  all () {
    let rooms = {}

    ref
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          Vue.set(rooms, doc.id, doc.data())
        })
      })

    return rooms
  }
}

const setters = {
  /**
   * Create a new room
   *
   * @return: doc.id
   */
  async createRoom (data) {
    return ref.add(data)
      .then(doc => {
        console.log('#db.rooms.createRoom()# Room with id [' + doc.id + '] created.')
        // Catch the id with a promise
        return doc.id
      })
      .catch(e => {
        throw e
      })
  }
}

// Combine the modules
export default {
  ...getters,
  ...setters,
  hey: 'why no work?'
}
