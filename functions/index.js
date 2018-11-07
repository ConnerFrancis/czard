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
exports.userStatusLink = functions.database
  .ref('/status/{userId}')
  .onWrite(( change, context ) => {
    firestore.collection('users')
      .doc(context.params.userId)
      .set({
        online: !(change.after.val() === 'offline')
      }, { merge: true })
  })
