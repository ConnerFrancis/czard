/**
 * Authentication
 *
 * Automatically signs in to an anonymous account or a real account.
 */

import firebase from 'firebase'
import store from './store'
import db, { realtimeDb } from './db'

import { OperationError } from './error'

const auth = firebase.auth()

/** Handle the authentication state. */
firebase.auth().onAuthStateChanged(user => {
  // If the user is signed in...
  if (user) {
    /* 1: Log the user in.
     * 2: Bind the database and state.
     * 3: Alert the user to any errors.
     */
    store.dispatch('currentUser/login', user)
      .then(store.dispatch('toast/add', {
        type: 'success',
        message: 'You have been signed in anonymously.'
      }))
      .then(db.collection('users')
        .doc(auth.currentUser.uid)
        .onSnapshot(snapshot => {
          store.dispatch('currentUser/updateData', {
            id: snapshot.id,
            data: snapshot.data()
          })
        }))
      .catch(e => store.dispatch('toast/error', new OperationError('Failed to handle auth.', 'auth/failed-handle', e)))
  // ...sign them in if they are not.
  } else {
    firebase.auth().signInAnonymously()
      .catch(e => store.dispatch('toast/error', new OperationError('Failed to sign in anonymously.', 'auth/anonymous-sign-in-fail', e)))
  }
})

/** Handle the user presence. */
realtimeDb.ref('.info/connected').on('value', (snapshot) => {
  var status = realtimeDb.ref('/status/' + auth.currentUser.uid)

  // If there is no connection don't do anything
  // eslint-disable-next-line
  if (snapshot.val() == false) return

  status
    .onDisconnect()
    .set('offline')
})

export default auth
