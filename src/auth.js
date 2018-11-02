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
      store.dispatch('currentUser/loginAnonymously', user)
      // Different messages if the name is not blank
      if (user.displayName) {
        store.dispatch('toast/add', {
          type: 'success',
          message: 'Welcome back, ' + user.displayName + '.'
        })
      }
    } else {
      store.dispatch('toast/add', {
        type: 'success',
        code: null,
        message: 'Logged in to account ' + user.id + '.'
      })
    }
    // user.isAnonymous
    // user.id etc etc
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
