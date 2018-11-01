/**
 * Authentication
 *
 * Automatically signs in to an anonymous account or a real account.
 */

import firebase from 'firebase'
import store from '@/store'

// Sign in or anonymously sign in otherwise
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (user.isAnonymous) {
      store.currentUser.dispatch('loginAnonymously', user)
      store.toast.dispatch('add', {
        type: 'success',
        code: null,
        message: 'Logged in to anonymous account (' + user.displayName + ').'
      })
    } else {

    }
    // user.isAnonymous
    // user.id etc etc
  } else {
    firebase.auth().signInAnonymously()
      .catch(e => {
        store.toast.dispatch('add', {
          type: 'error',
          code: e.code,
          message: e.message
        })
      })
  }
})
