/**
 * Authentication
 *
 * Automatically signs in to an anonymous account or a real account.
 */

import firebase from 'firebase'
import store from './store'

// Sign in or anonymously sign in otherwise
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
        message: 'Logged in to account ' + user.id + '.'
      })
    }
  } else {
    firebase.auth().signInAnonymously()
      .catch(e => {
        store.dispatch('toast/add', {
          type: 'error',
          code: 'auth/failed-anonymous-login',
          message: 'Failed to sign in anonymously.'
        })
      })
  }
})
