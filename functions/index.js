const functions = require('firebase-functions')
const Firestore = require('@google-cloud/firestore')

const firestore = new Firestore()

/**
 * Cleans all rooms that have no players
 */
exports.cleanRooms = functions.firestore
  .document('rooms/{roomId}')
  .onUpdate(( change, context ) => {
    const data = change.after.data()
    const previousData = change.before.data()

    // If the players havent changed, just quit
    // eslint-disable-next-line
    if (data.players == previousData.players) return null

    // eslint-disable-next-line
    if (!data.players || data.players == [])
      change.after.ref.delete()
      return null
  })

/**
 * When a user's status changes in the realtime db
 */
exports.onUserStatusChanged = functions.database
  .ref('/status/{userId}')
  .onUpdate(event => {
    return event.data.ref.once('value')
      .then(statusSnapshot => snapShot.val()) // Grab the status
      .then(status => {
        // If the realtime db user is offline, set the corresponding
        // firestore user to offline as well
        // eslint-disable-next-line
        if (status === 'offline') {
          firestore.collection('/users')
            .doc(event.params.userId)
            .set({
              online: false
            }, { merge: true })
        }
      })
  })