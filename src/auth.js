/**
 * Authentication
 *
 * Automatically signs in to an anonymous account or a real account.
 */

import { OperationError } from './error'

import firebase from 'firebase'
import store from './store'

// Sign in or anonymously sign in otherwise
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (user.isAnonymous) {
      store.dispatch('currentUser/loginAnonymously', user)
      store.dispatch('toast/add', {
        type: 'success',
        code: null,
        message: 'Logged in to anonymous account (' + user.id + ').'
      })
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
      .then(user => {
        store.dispatch('currentUser/loginAnonymously', user)
        store.dispatch('toast/add', {
          type: 'success',
          code: null,
          message: 'Logged in anonymously.'
        })
      })
      .catch(e => {
        throw new OperationError('auth/anonymous-failed', 'Signing in anonymously failed.')
      })
  }
})
