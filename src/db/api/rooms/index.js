/**
 * Rooms API
 */

import Vue from 'vue'
import firebase from 'firebase'
import db from '@/db'

const rooms = db.collection('rooms')
const users = db.collection('users')

const getters = {
  all () {
    let rooms = {}

    rooms
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
   * @return room.id
   */
  async createRoom (title, decks, owner) {
    // Remove the owner from the room they are in
    users.doc(owner)
      .get()
      .then(doc => {
        rooms.doc(doc.data().room)
          .update({
            players: firebase.firestore.FieldValue.arrayRemove(doc.id)
          })
      })

    // Create a room and set the user to be in it
    return rooms.add({ title, decks, owner, players: [owner] })
      .then(doc => {
        users.doc(owner)
          .update({
            room: doc.id
          })
        return doc.id
      })
  },

  /**
   * Join an existing room
   *
   * @return room.id
   */
  async joinRoom (user, newRoom) {
    const batch = db.batch()
    const oldRoom = await users.doc(user)
      .get()
      .then(doc => {
        return doc.data().room
      })

    if (oldRoom) {
      batch.update(rooms.doc(oldRoom), {
        players: firebase.firestore.FieldValue.arrayRemove(user)
      })
    }
    batch.update(rooms.doc(newRoom), {
      players: firebase.firestore.FieldValue.arrayUnion(user)
    })
    batch.update(users.doc(user), {
      room: newRoom
    })

    return batch.commit()
      .then(() => newRoom)
  }
}

// Combine the modules
export default {
  ...getters,
  ...setters,
  hey: 'why no work?'
}
