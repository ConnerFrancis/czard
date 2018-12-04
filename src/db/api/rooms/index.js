/**
 * Rooms API
 */

import Vue from 'vue'
import firebase from 'firebase'
import db from '@/db'

import store from '@/store'
import { OperationError } from '@/error'

const auth = firebase.auth()
const rooms = db.collection('rooms')
const users = db.collection('users')

/** Data retrieval. */
const getters = {
  /**
   * Query for all existing rooms.
   *
   * @return {Object} Object (key: room ID, value: room data).
   */
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
/** Actions and functions. */
const setters = {
  /**
   * Leave a room.
   *
   * @param  {string}  user - ID of the user leaving his/her current room.
   * @return {Promise} Resolved or error.
   */
  async leaveRoom () {
    const user = auth.currentUser.uid
    /* 1: Query user for the old room.
     * 2: Remove the user from the old room.
     * 3: Clear the room value from the user.
     */
    return users.doc(user)
      .get()
      .then(doc => {
        const oldRoom = doc.data().room
        // If the user is in a room, update the room, otherwise skip.
        if (oldRoom !== null) return rooms.doc(oldRoom).update({ players: firebase.firestore.FieldValue.arrayRemove(doc.id) })
        return null
      })
      .then(users.doc(user).update({ room: null }))
      .catch(e => store.dispatch('toast/error', new OperationError('Failed to leave the room.', 'api/rooms/leaveRoom/fail', e)))
  },

  /**
   * Create a new room.
   *
   * @param  {string}   title - The title of the new room.
   * @param  {string[]) decks - Array of deck IDs to be used in the game.
   * @return {string} The ID of the room created.
   */
  async createRoom (title, decks) {
    const user = auth.currentUser.uid
    /* 1: Leave the current room (if there is one).
     * 2: Create a new room.
     * 3: Set the user's room accordingly.
     */
    return this.leaveRoom()
      .then(() => {
        /* This is janky because Firestore is.
         * For some unknown reason, you can't return Collection.add()
         * and then chain it's return value in a .then chain.
         */
        return rooms.add({ title, decks, owner: user, players: [ user ] })
          .then(doc => doc.id)
      })
      .then(newRoom => {
        users.doc(user).update({ room: newRoom })
        return newRoom
      })
      .catch(e => store.dispatch('toast/error', new OperationError('Failed to create a room.', 'api/rooms/createRoom/fail', e)))
  },

  /**
   * Join an existing room.
   *
   * @param  {string} newRoom - ID of the room to join.
   * @return {string} ID of the room joined.
   */
  async joinRoom (newRoom) {
    const user = auth.currentUser.uid
    const batch = db.batch()
    /* 1: Leave the current room (if there is one).
     * 2: Join the new room and update it's player list.
     * 3: Set the user's room accordingly.
     */
    return this.leaveRoom()
      .then(batch.update(rooms.doc(newRoom), { players: firebase.firestore.FieldValue.arrayUnion(user) }))
      .then(batch.update(users.doc(user), { room: newRoom }))
      .then(batch.commit())
      .then(newRoom)
      .catch(e => store.dispatch('toast/error', new OperationError('Failed to join a room.', 'api/rooms/joinRoom/fail', e)))
  }
}

export default {
  ...getters,
  ...setters
}
