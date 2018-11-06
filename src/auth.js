/**
 * Authentication
 *
 * Automatically signs in to an anonymous account or a real account.
 */

import firebase from 'firebase'
import store from './store'

// const realtimeDb = firebase.database()

// Sign in or anonymously sign in otherwise
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (user.isAnonymous) {
      // Obviously log the user in
      store.dispatch('currentUser/login', user)
      // Different messages if the name is not blank
      store.dispatch('toast/add', {
        type: 'success',
        message: 'Welcome back, ' + user.displayName + '.'
      })
    } else {
      store.dispatch('currentUser/login', user)
      store.dispatch('toast/add', {
        type: 'success',
        code: null,
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

/* Why u no work?
realtimeDb.ref('.info/connected')
  .on('value', snapshot => {
    if (snapshot.val()) {
      // Realtime db
      realtimeDb.ref('status/cobbler')
        .onDisconnect()
        .set('offline') // <-- linked to Firestore in Firestore function
    }
  })
*/

/* sweet jesus jus twork
realtimeDb
  .ref('status/cobbler')
  .onDisconnect()
  .set('offline')
*/
