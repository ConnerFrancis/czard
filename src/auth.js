/**
 * Authentication
 *
 * Automatically signs in to an anonymous account or a real account.
 */

import firebase from 'firebase'
import store from './store'
import { realtimeDb } from '@/db'

const auth = firebase.auth()

// Handle auth state automagically
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (user.isAnonymous) {
      // Obviously log the user in
      store.dispatch('currentUser/login', user)
      store.dispatch('toast/add', {
        type: 'success',
        message: 'You have been signed in anonymously with ID ' + user.uid + '.'
      })
    } else {
      store.dispatch('currentUser/login', user)
      store.dispatch('toast/add', {
        type: 'success',
        message: 'Logged in to account ' + user.uid + '.'
      })
    }
  } else {
    firebase.auth().signInAnonymously()
      .catch(e => {
        store.dispatch('toast/add', {
          type: 'error',
          code: 'auth/failed-anonymous-login',
          message: 'Failed to sign in anonymously (' + e.message + ').'
        })
      })
  }
})

// Handle user presence
realtimeDb.ref('.info/connected').on('value', (snapshot) => {
  var status = realtimeDb.ref('/status/' + auth.currentUser.uid)

  // If there is no connection don't do anything
  // eslint-disable-next-line
  if (snapshot.val() == false) return

  status
    .onDisconnect()
    .set('offline')
    .then(() => {
      status.set('online')
    })
})

export default auth
