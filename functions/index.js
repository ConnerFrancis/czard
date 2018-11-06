const functions = require('firebase-functions');

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